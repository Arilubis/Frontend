export default function setupRefreshInterceptor(api) {
  let isRefreshing = false;
  let failedQueue = [];

  const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
      if (error) prom.reject(error);
      else prom.resolve(token);
    });
    failedQueue = [];
  };

  api.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;

      // Jika token expired (401)
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes("/auth/refresh")
      ) {
        originalRequest._retry = true;

        // Jika sudah ada proses refresh → queue request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = "Bearer " + token;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        // Jalankan refresh token
        isRefreshing = true;

        try {
          const res = await api.post("/auth/refresh");
          const newToken = res.data.data.accessToken;

          localStorage.setItem("accessToken", newToken);

          processQueue(null, newToken);
          isRefreshing = false;

          originalRequest.headers.Authorization = "Bearer " + newToken;

          return api(originalRequest);
        } catch (errRefresh) {
          processQueue(errRefresh, null);
          isRefreshing = false;

          localStorage.removeItem("accessToken");
          window.location.href = "/login";

          return Promise.reject(errRefresh);
        }
      }

      return Promise.reject(error);
    }
  );
}
