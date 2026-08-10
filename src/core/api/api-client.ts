import type { AxiosRequestConfig } from 'axios';
import { axiosInstance } from './axios-instance';
import { setupAuthInterceptor } from './interceptors/auth.interceptor';
import { setupErrorInterceptor } from './interceptors/error.interceptor';

// Wire up interceptors once
setupAuthInterceptor(axiosInstance);
setupErrorInterceptor(axiosInstance);

/**
 * Typed HTTP client used by ALL domain API modules.
 * Never import axiosInstance directly in domains — always use apiClient.
 */
export const apiClient = {
  get<T>(url: string, config?: AxiosRequestConfig) {
    return axiosInstance.get<T>(url, config);
  },
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return axiosInstance.post<T>(url, data, config);
  },
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return axiosInstance.put<T>(url, data, config);
  },
  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return axiosInstance.patch<T>(url, data, config);
  },
  delete<T>(url: string, config?: AxiosRequestConfig) {
    return axiosInstance.delete<T>(url, config);
  },
};
