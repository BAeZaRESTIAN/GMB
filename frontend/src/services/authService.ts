import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  tenantName?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    tenantId?: string;
  };
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    this.setTokens(response.accessToken, response.refreshToken);
    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    this.setTokens(response.accessToken, response.refreshToken);
    return response;
  }

  async getProfile() {
    return api.get('/auth/profile');
  }

  async updatePassword(newPassword: string) {
    return api.put('/auth/password', { newPassword });
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }

  private setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}

export default new AuthService();
