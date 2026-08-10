import { http, HttpResponse } from 'msw';

export const authHandlers = [
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken: 'mock-access-token',
        user: {
          id: 'u1',
          username: 'testuser',
          email: 'test@nhai.gov.in',
          fullName: 'Test User',
          role: 'TOLL_OFFICER',
          department: 'Toll Ops',
          designation: 'Officer',
          isActive: true,
          lastLoginAt: null,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      },
    });
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true, message: 'Logged out' });
  }),

  http.get('/api/auth/me', () => {
    return HttpResponse.json({
      success: true,
      message: 'OK',
      data: {
        id: 'u1',
        username: 'testuser',
        email: 'test@nhai.gov.in',
        fullName: 'Test User',
        role: 'TOLL_OFFICER',
        department: 'Toll Ops',
        designation: 'Officer',
        isActive: true,
        lastLoginAt: null,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
    });
  }),
];
