import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Her istekten önce çalışır: token varsa otomatik ekler
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Her cevaptan sonra çalışır: token geçersizse otomatik login'e yönlendirir
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const isLoginRequest = error.config.url.includes("/auth/login");

      if (!isLoginRequest) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;