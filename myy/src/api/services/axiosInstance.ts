// src/api/axiosInstance.ts
import axios from "axios";

const baseURL = "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Функция для обновления токена
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token available");
    
    const response = await axios.post(`${baseURL}/api/token/refresh/`, {
      refresh: refreshToken,
    });
    
    const newAccessToken = response.data.access;
    localStorage.setItem("accessToken", newAccessToken);
    return newAccessToken;
  } catch (error) {
    // Очищаем хранилище при ошибке обновления
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    window.location.href = "/login";
    throw error;
  }
};

// Настройка периодического обновления токена
let isRefreshing = false;
const setupTokenRefresh = () => {
  const refreshInterval = 4.5 * 60 * 1000; // 4.5 минуты (270000 мс)
  
  const refresh = async () => {
    if (isRefreshing) return;
    if (!localStorage.getItem("refreshToken")) return;
    
    isRefreshing = true;
    try {
      await refreshAccessToken();
      console.log("Token refreshed successfully");
    } catch (error) {
      console.error("Failed to refresh token:", error);
    } finally {
      isRefreshing = false;
    }
  };
  
  // Запускаем сразу (если есть refreshToken)
  if (localStorage.getItem("refreshToken")) {
    refresh();
  }
  
  // Устанавливаем интервал для периодического обновления
  const intervalId = setInterval(refresh, refreshInterval);
  
  // Функция для очистки интервала
  return () => clearInterval(intervalId);
};

// Запускаем механизм обновления токена
setupTokenRefresh();

// Перехватчик запросов: добавить accessToken
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Перехватчик ответов: обработать 401 и попытаться обновить токен
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        
        // Повторить оригинальный запрос с новым access токеном
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;