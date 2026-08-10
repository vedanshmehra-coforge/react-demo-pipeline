import { apiClient } from '@core/api/api-client';
import { tokenService } from './token.service';
import type { User } from '@shared/types/auth.types';

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  user: User;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    tokenService.set(response.data.accessToken);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      tokenService.clear();
    }
  },

  async refreshToken(): Promise<string> {
    // Refresh token is in HttpOnly cookie — no manual header needed
    const response = await apiClient.post<{ accessToken: string }>('/auth/refresh');
    const newToken = response.data.accessToken;
    tokenService.set(newToken);
    return newToken;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },
};
