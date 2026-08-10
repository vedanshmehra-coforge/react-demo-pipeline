import axios from 'axios';
import axiosRetry from 'axios-retry';
import { env } from '@config/env';

export const axiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// Retry on network errors and 5xx — never retry 4xx
axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) =>
    axiosRetry.isNetworkError(error) ||
    (error.response !== undefined && error.response.status >= 500),
});
