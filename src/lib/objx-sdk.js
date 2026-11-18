import axios from 'axios';
import CryptoJS from 'crypto-js';
/**
 * ObjxSDK — Official JavaScript/Vue SDK for ObjxStore
 *
 * Architecture:
 *   Vue App → Express Gateway → Go Storage Backend
 *
 * The SDK communicates only with the Express Gateway.
 * The Gateway injects the API key before forwarding requests to Go.
 * The API key is never exposed in the browser.
 *
 * Usage:
 *   import ObjxSDK from '@/lib/objx-sdk';
 *   const sdk = new ObjxSDK({ gatewayUrl: import.meta.env.VITE_GATEWAY_URL });
 */
export default class ObjxSDK {
  /**
   * @param {Object} config
   * @param {string} config.gatewayUrl - Base URL of your Express Gateway
   */
  constructor({ gatewayUrl }) {
    if (!gatewayUrl) throw new Error('[ObjxSDK] gatewayUrl is required');

    this.gatewayUrl = gatewayUrl.replace(/\/$/, '');
    this.gateway = axios.create({
      baseURL: this.gatewayUrl,
      timeout: 15000, // 15s for all standard gateway requests
    });
  }

  // ─────────────────────────────────────────────
  // INTERNAL HELPERS
  // ─────────────────────────────────────────────

  /**
   * Calculate SHA-256 checksum from a File object (browser only).
   * Uses the native Web Crypto API — no external dependencies needed.
   * Called once before upload; the Go backend recalculates and compares
   * after all chunks are merged to verify file integrity.
   *
   * @param {File} file
   * @returns {Promise<string>} Hex string, e.g. "a3f1b2..."
   */
  static async _checksum(file) {
    // const buffer = await file.arrayBuffer();
    // const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    // return Array.from(new Uint8Array(hashBuffer))
    //   .map(b => b.toString(16).padStart(2, '0'))
    //   .join('');
     if (window.isSecureContext && window.crypto?.subtle) {
      try {
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        return Array.from(new Uint8Array(hashBuffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      } catch (e) {
        console.warn('[ObjxSDK] WebCrypto gagal, beralih ke CryptoJS');
      }
    }

    // Fallback untuk HTTP: Gunakan CryptoJS (SHA-256)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const wordArray = CryptoJS.lib.WordArray.create(reader.result);
        const hash = CryptoJS.SHA256(wordArray);
        resolve(hash.toString(CryptoJS.enc.Hex));
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Format raw bytes into a human-readable string.
   *
   * Examples:
   *   formatBytes(1048576)     → "1.00 MB"
   *   formatBytes(2560, 1)     → "2.5 KB"
   *   formatBytes(0)           → "0 Bytes"
   *
   * @param {number} bytes
   * @param {number} decimals
   * @returns {string}
   */
  static formatBytes(bytes, decimals = 2) {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  }

  /**
   * Detect MIME type from a filename extension.
   * Used to set the correct Content-Type when creating Blob previews.
   *
   * @param {string} fileName
   * @returns {string} MIME type string
   */
  static _mimeType(fileName) {
    const name = fileName.toLowerCase();
    if (name.match(/\.(jpg|jpeg)$/)) return 'image/jpeg';
    if (name.endsWith('.png'))  return 'image/png';
    if (name.endsWith('.webp')) return 'image/webp';
    if (name.endsWith('.gif'))  return 'image/gif';
    if (name.endsWith('.pdf'))  return 'application/pdf';
    return 'application/octet-stream';
  }

  // ─────────────────────────────────────────────
  // UPLOAD
  // ─────────────────────────────────────────────

  /**
   * Upload a file to ObjxStore via the Express Gateway.
   *
   * Full flow:
   *   1. Calculate SHA-256 checksum locally (integrity baseline)
   *   2. POST /request-upload to Gateway → receive presigned upload token,
   *      bucket_id, chunk_size, and upload_init_url
   *   3. _ObjxUploader streams file in 5MB chunks directly to Go backend
   *      with per-chunk onUploadProgress callbacks
   *   4. POST /files/:id/complete → Go merges chunks and verifies hash
   *   5. POST /save-metadata to Gateway → persist filename, bucket, hash
   *
   * @param {File}     file       - File object from <input type="file">
   * @param {Function} onProgress - Callback receiving percent (0–100)
   * @param {string}   path       - Optional virtual folder, e.g. 'invoices/2026'
   * @returns {Promise<Object>} { object_id, hash, size, path }
   */
  async upload(file, onProgress, path = '') {
    // Step 1 — Compute hash once; reused in init request and metadata save
    const checksum = await ObjxSDK._checksum(file);

    // Step 2 — Request presigned token from Gateway
    const { data: gateway } = await this.gateway.post('/request-upload', {
      size: file.size,
      checksum,
      path,
    });

    const resolvedPath = gateway.path ?? path ?? '';

    // Step 3 & 4 — Chunk upload directly to Go backend
    const uploader = new _ObjxUploader(gateway.upload_init_url, gateway.chunk_size);
    const result = await uploader.upload(
      file, gateway.bucket_id, onProgress, checksum, resolvedPath
    );

    // Step 5 — Persist metadata via Gateway
    await this.gateway.post('/save-metadata', {
      object_id: result.object_id,
      filename:  file.name,
      bucket_id: gateway.bucket_id,
      hash:      result.hash,
    });

    return result;
  }

  // ─────────────────────────────────────────────
  // FETCH FILES
  // ─────────────────────────────────────────────

  /**
   * Retrieve the list of all objects from the Gateway.
   *
   * The Go backend returns:
   *   { data: [...], count: int, has_more: bool, next_cursor: int }
   *
   * The Express Gateway can forward this as-is or unwrap to a plain array.
   * Both shapes are handled here for resilience.
   *
   * @returns {Promise<Array>} Array of file objects
   */
  async fetchFiles() {
    const { data } = await this.gateway.get('/files');
    if (Array.isArray(data)) return data;
    if (data?.data && Array.isArray(data.data)) return data.data;
    return [];
  }

  // ─────────────────────────────────────────────
  // DOWNLOAD
  // ─────────────────────────────────────────────

  /**
   * Download a file by opening its presigned URL in a new browser tab.
   *
   * The SDK requests a short-lived signed URL from the backend and opens
   * it via window.open(). The browser handles the actual download — no
   * binary data passes through the Vue app's memory.
   *
   * @param {string} fileId   - Object ID of the file
   * @param {string} fileName - Not used for browser downloads; kept for API parity with Flutter SDK
   * @returns {Promise<{ success: boolean }>}
   */
  async download(fileId, fileName) {
    if (!fileId) throw new Error('[ObjxSDK] fileId is required');
    const { data } = await this.gateway.post(`/presigned/download/${fileId}`);
    if (!data.url) throw new Error('[ObjxSDK] No download URL returned');
    window.open(data.url, '_blank', 'noopener,noreferrer');
    return { success: true };
  }

  // ─────────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────────

  /**
   * Soft-delete a file by its object ID.
   *
   * The file is moved to the trash bucket and permanently deleted after
   * 24 hours unless restored via the /restore endpoint.
   *
   * @param {string} fileId - Object ID to delete
   * @returns {Promise<Object>} { message: string }
   */
  async delete(fileId) {
    if (!fileId) throw new Error('[ObjxSDK] fileId is required');
    const { data } = await this.gateway.delete(`/files/${fileId}`);
    return data;
  }

  // ─────────────────────────────────────────────
  // PREVIEW
  // ─────────────────────────────────────────────

  /**
   * Fetch and prepare file content for inline preview.
   *
   * Supported formats: jpg, jpeg, png, webp, gif, pdf, docx
   *
   * For images and PDFs: fetches the binary, creates a Blob URL,
   * and returns { type, url } — use this directly in <img :src> or <iframe>.
   *
   * For DOCX: dynamically imports mammoth.js and converts to HTML.
   * Returns { type: 'docx', html } — render with v-html.
   *
   * IMPORTANT: Always call ObjxSDK.revokePreview(url) when the
   * preview modal is closed to free browser memory.
   *
   * @param {Object} file - File object from fetchFiles()
   * @returns {Promise<{ type: string, url?: string, html?: string }>}
   */
  async preview(file) {
    const fileId   = file.ID  || file.id;
    const fileName = (file.Key || file.key || '').toLowerCase();

    let type = '';
    if (fileName.match(/\.(jpg|jpeg|png|webp|gif)$/)) type = 'image';
    else if (fileName.endsWith('.pdf'))  type = 'pdf';
    else if (fileName.endsWith('.docx')) type = 'docx';
    else throw new Error('[ObjxSDK] Unsupported preview format');

    // Fetch presigned preview URL from Gateway
    const { data } = await this.gateway.get(`/files/${fileId}/preview-link`);

    // Fetch binary content with extended timeout for large files
    const fileData = await axios.get(data.url, {
      responseType: 'arraybuffer',
      timeout: 60000, // 60s for large preview files
    });

    if (type === 'docx') {
      // Dynamic import — mammoth is only loaded when a .docx is previewed
      const mammoth = await import('mammoth');
      const result  = await mammoth.convertToHtml({ arrayBuffer: fileData.data });
      return { type: 'docx', html: result.value, url: '' };
    }

    const blob    = new Blob([fileData.data], { type: ObjxSDK._mimeType(fileName) });
    const blobUrl = window.URL.createObjectURL(blob);
    return { type, url: blobUrl, html: '' };
  }

  /**
   * Revoke a Blob URL created by preview() to free browser memory.
   * Call this when the preview modal is closed.
   *
   * @param {string} blobUrl - URL returned from preview()
   */
  static revokePreview(blobUrl) {
    if (blobUrl) window.URL.revokeObjectURL(blobUrl);
  }

  // ─────────────────────────────────────────────
  // SHARE LINK
  // ─────────────────────────────────────────────

  /**
   * Generate a public presigned link for sharing a file externally.
   *
   * The link is publicly accessible — no authentication required.
   * Useful for sharing files with users who don't have an account.
   * Expiry is enforced server-side regardless of how the link is accessed.
   *
   * @param {string} fileId           - Object ID
   * @param {number} expiresInMinutes - Link lifetime in minutes (default: 60)
   * @returns {Promise<Object>} { share_url, expires_at, token }
   */
  async generateShareLink(fileId, expiresInMinutes = 60) {
    if (!fileId) throw new Error('[ObjxSDK] fileId is required');
    const { data } = await this.gateway.post(`/presigned/share/${fileId}`, {
      expires_in_minutes: expiresInMinutes,
    });
    return data;
  }
}

// ─────────────────────────────────────────────
// INTERNAL: _ObjxUploader
//
// Handles chunked multipart upload directly to the Go backend.
// Not exported — use ObjxSDK.upload() instead.
//
// Chunk flow per file:
//   POST /files/init          → receive upload_id
//   POST /files/:id/part × N  → stream N chunks with onUploadProgress
//   POST /files/:id/complete  → backend merges chunks and verifies SHA-256
// ─────────────────────────────────────────────

class _ObjxUploader {
  constructor(uploadInitUrl, chunkSize) {
    const url = new URL(uploadInitUrl);
    this.uploadToken = url.searchParams.get('upload_token');
    // Di mode dev lokal (import.meta.env.DEV), lewatkan via proxy Vite agar tidak diblokir CORS preflight
    this.baseUrl     = import.meta.env.DEV ? '/objx-storage/api/v1' : `${url.protocol}//${url.host}/api/v1`;
    this.client      = axios.create({
      baseURL: this.baseUrl,
      timeout: 60000, // 60s per chunk for slow connections
    });
    this.CHUNK_SIZE = chunkSize || 5 * 1024 * 1024; // Default: 5 MB
  }

  async upload(file, bucketId, onProgress, checksum, path = '') {
    // 1. Initialize upload session on Go backend
    const { data: init } = await this.client.post(
      `/files/init?upload_token=${this.uploadToken}`,
      { filename: file.name, size: file.size, bucket_id: bucketId, checksum, path }
    );

    const uploadId = init.upload_id || init.uploadId || init.id;
    if (!uploadId) {
      console.error('❌ Server storage tidak mengembalikan upload_id:', init);
      throw new Error('ID sesi upload tidak ditemukan dari server storage');
    }
    const totalParts = Math.ceil(file.size / this.CHUNK_SIZE);

    // 2. Upload each chunk sequentially
    for (let i = 0; i < totalParts; i++) {
      const start = i * this.CHUNK_SIZE;
      const end   = Math.min(start + this.CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append('file', chunk, file.name);

      await this.client.post(
        `/files/${uploadId}/part?part_num=${i + 1}&upload_token=${this.uploadToken}`,
        formData,
        {
          timeout: 120000, // 2 min per chunk for very slow connections
          onUploadProgress: (e) => {
            if (onProgress) {
              const partProgress  = e.loaded / e.total;
              const totalProgress = Math.round(((i + partProgress) / totalParts) * 100);
              onProgress(totalProgress);
            }
          },
        }
      );
    }

    // 3. Complete — backend merges all parts and verifies SHA-256
    try {
      const { data: final } = await this.client.post(
        `/files/${uploadId}/complete?upload_token=${this.uploadToken}`,
        {},
        { headers: { 'Content-Type': 'application/json' } }
      );
      return final;
    } catch (completeErr) {
      console.error('Go backend /complete error response:', completeErr.response?.data);
      console.error('Go backend /complete status:', completeErr.response?.status);
      throw completeErr;
    }
  }
}

window._ObjxUploaderInternal = class {
  constructor(uploadInitUrl, chunkSize) {
    const url = new URL(uploadInitUrl);
    this.uploadToken = url.searchParams.get('upload_token');
    // Di mode dev lokal (import.meta.env.DEV), lewatkan via proxy Vite agar tidak diblokir CORS preflight
    this.baseUrl = import.meta.env.DEV ? '/objx-storage/api/v1' : `${url.protocol}//${url.host}/api/v1`;
    this.client = axios.create({ baseURL: this.baseUrl, timeout: 60000 });
    this.CHUNK_SIZE = chunkSize || 5 * 1024 * 1024;
  }

  async upload(file, bucketId, path, onProgress, checksum) {
    // Gunakan bucketId dari response, atau dari env VITE_OBJX_BUCKET_ID, atau fallback bucket aktif
    const resolvedBucketId = bucketId || import.meta.env.VITE_OBJX_BUCKET_ID || 'a9c4a4f9-2c1e-410e-b43f-a9068bb1c154';
    const body = { 
      filename: file.name, 
      size: file.size, 
      checksum, 
      path,
      bucket_id: resolvedBucketId  // ← selalu ada nilainya sekarang
    };

    let init;
    try {
      const resp = await this.client.post(
        `/files/init?upload_token=${this.uploadToken}`,
        body
      );

    init = resp.data;
  } catch (err) {
    // Log pesan error 400 dari Go backend
    console.error('Go backend /files/init error response:', err.response?.data);
    console.error('Go backend /files/init status:', err.response?.status);
    console.error('Body yang dikirim:', { 
      filename: file.name, 
      size: file.size, 
      checksum, 
      path 
    });
    throw err;
  }

    const uploadId = init.upload_id || init.uploadId || init.id;
    if (!uploadId) {
      console.error('❌ Server storage tidak mengembalikan upload_id:', init);
      throw new Error('ID sesi upload tidak ditemukan dari server storage');
    }
    const totalParts = Math.ceil(file.size / this.CHUNK_SIZE);

    for (let i = 0; i < totalParts; i++) {
      const start    = i * this.CHUNK_SIZE;
      const end      = Math.min(start + this.CHUNK_SIZE, file.size);
      const chunk    = file.slice(start, end);
      const formData = new FormData();
      formData.append('file', chunk, file.name);

      await this.client.post(
        `/files/${uploadId}/part?part_num=${i + 1}&upload_token=${this.uploadToken}`,
        formData,
        {
          timeout: 120000,
          onUploadProgress: (e) => {
            if (onProgress) {
              const total = Math.round(((i + e.loaded / e.total) / totalParts) * 100);
              onProgress(total);
            }
          }
        }
      );
    }

    try {
      const { data: final } = await this.client.post(
        `/files/${uploadId}/complete?upload_token=${this.uploadToken}`,
        {},
        { headers: { 'Content-Type': 'application/json' } }
      );
      return final;
    } catch (completeErr) {
      console.error('Go backend /complete error response:', completeErr.response?.data);
      console.error('Go backend /complete status:', completeErr.response?.status);
      throw completeErr;
    }
  }
};