export const dummyApprovers = [
  { id: "u1", name: "Budi Setiadi", role: "Manager IT", email: "budi@company.com" },
  { id: "u2", name: "Siti Aminah", role: "Direktur Keuangan", email: "siti@company.com" },
  { id: "u3", name: "Agus Pratama", role: "HRD Spesialis", email: "agus@company.com" },
  { id: "u4", name: "Rina Wijaya", role: "Finance Manager", email: "rina@company.com" },
  { id: "u5", name: "Dedi Kusuma", role: "Operations Head", email: "dedi@company.com" }
];

export const dummyDocuments = [
  {
    id: 1,
    documentId: "DOC-2025-001",
    number: "REQ-2025-X01",
    title: "Request Dana Pengadaan Laptop",
    category: "Gaji Masuk",
    description: "Kebutuhan untuk tim development baru",
    amount: "Rp 50.000.000",
    sender: "John Doe",
    senderEmail: "john@company.com",
    status: "In Progress",
    priority: "High",
    currentLevelIndex: 1,
    totalLevels: 2,
    isReviewed: false,
    createdAt: "2025-01-02T10:30:00Z",
    pdfUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
    attachments: [
      {
        id: "att-001",
        filename: "quotation.pdf",
        fileUrl: "https://example.com/files/quotation.pdf",
        fileSize: 2048576
      }
    ],
    approvalFlow: [
      {
        levelIndex: 0,
        type: "sequential",
        status: "completed",
        reviewers: [
          {
            userId: "u1",
            name: "Budi Setiadi",
            role: "Manager IT",
            action: "approved",
            actionAt: "2025-01-02T11:00:00Z",
            notes: "Approved for budget allocation"
          }
        ]
      },
      {
        levelIndex: 1,
        type: "parallel",
        status: "pending",
        reviewers: [
          {
            userId: "u2",
            name: "Siti Aminah",
            role: "Direktur Keuangan",
            action: null,
            actionAt: null,
            notes: null
          },
          {
            userId: "u3",
            name: "Agus Pratama",
            role: "HRD Spesialis",
            action: "approved",
            actionAt: "2025-01-02T13:30:00Z",
            notes: null
          }
        ]
      }
    ],
    timeline: [
      {
        step: "Document Created",
        status: "Verified by Admin",
        completed: true,
        active: false
      },
      {
        step: "Level 1 Approval",
        status: "Approved by Budi Setiadi",
        completed: true,
        active: false
      },
      {
        step: "Level 2 Approval",
        status: "Waiting for approval",
        completed: false,
        active: true
      },
      {
        step: "Final Finance Check",
        status: "Locked",
        completed: false,
        active: false
      }
    ]
  },
  {
    id: 2,
    documentId: "DOC-2025-002",
    number: "HR-LEAVE-992",
    title: "Formulir Cuti Tahunan - Andi",
    category: "Surat Izin",
    description: "Permohonan cuti tahunan periode Jan 2025",
    amount: "-",
    sender: "Andi Pratama",
    senderEmail: "andi@company.com",
    status: "Pending",
    priority: "Normal",
    currentLevelIndex: 0,
    totalLevels: 1,
    isReviewed: false,
    createdAt: "2025-01-02T09:00:00Z",
    pdfUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
    timeline: [
      {
        step: "Document Created",
        status: "Pending review",
        completed: false,
        active: true
      }
    ]
  },
  {
    id: 3,
    documentId: "DOC-2025-003",
    number: "FIN-INV-445",
    title: "Invoice Pembelian Server",
    category: "Gaji Masuk",
    description: "Tagihan server cloud Q1 2025",
    amount: "Rp 75.000.000",
    sender: "Rudi Hermawan",
    senderEmail: "rudi@company.com",
    status: "Completed",
    priority: "High",
    currentLevelIndex: 2,
    totalLevels: 2,
    isReviewed: true,
    createdAt: "2025-01-01T08:00:00Z",
    pdfUrl: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
    timeline: [
      {
        step: "Document Created",
        status: "Verified",
        completed: true,
        active: false
      },
      {
        step: "Manager Approval",
        status: "Approved",
        completed: true,
        active: false
      },
      {
        step: "Finance Approval",
        status: "Completed",
        completed: true,
        active: false
      }
    ]
  }
];

export const dummyArchivedDocs = [
  {
    id: 101,
    documentId: "DOC-2024-999",
    number: "PRC-2024-001",
    title: "Laptop Procurement Agreement",
    category: "Legal",
    description: "Final approved procurement",
    version: "1.2",
    status: "Archived",
    approverName: "Budi Santoso",
    completedAt: "2025-01-10T10:00:00Z",
    archivedAt: "2025-01-15T10:00:00Z"
  },
  {
    id: 102,
    documentId: "DOC-2024-998",
    number: "TAX-24-Q4",
    title: "Q4 Tax Report 2024",
    category: "Finance",
    description: "Quarterly tax report",
    version: "2.0",
    status: "Final",
    approverName: "Siti Aminah",
    completedAt: "2025-01-12T10:00:00Z"
  },
  {
    id: 103,
    documentId: "DOC-2024-997",
    number: "HR-POL-02",
    title: "Employee Handbook 2025",
    category: "HR",
    description: "Updated employee policies",
    version: "1.0",
    status: "Archived",
    approverName: "Admin Utama",
    completedAt: "2025-01-15T10:00:00Z"
  }
];

export const dummyDocumentHistory = [
  {
    id: 1,
    action: "Document Created",
    actor: "John Doe",
    actorRole: "User",
    timestamp: "2025-01-02T10:30:00Z",
    details: "Document created and submitted for approval"
  },
  {
    id: 2,
    action: "Level 1 Approved",
    actor: "Budi Setiadi",
    actorRole: "Manager IT",
    timestamp: "2025-01-02T11:00:00Z",
    details: "Approved at Level 1 (Sequential)",
    notes: "Budget approved"
  },
  {
    id: 3,
    action: "Document Reviewed",
    actor: "Siti Aminah",
    actorRole: "Finance Director",
    timestamp: "2025-01-02T14:20:00Z",
    details: "Document opened for review"
  }
];