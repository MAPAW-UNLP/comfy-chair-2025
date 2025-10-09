import {axiosInstance} from './api'

export interface RegisterData {
  nombre_completo: string;
  afiliacion: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  nombre_completo: string;
  afiliacion: string;
}

export interface LoginResponse {
  status: string;
  token: string;
  user: User;
}

export const authService = {
  // Register a new user
  async register(data: RegisterData): Promise<User> {
    const response = await axiosInstance.post('/users/registro/', data);
    return response.data;
  },

  // Login user
  async login(data: LoginData): Promise<LoginResponse> {
    const response = await axiosInstance.post<LoginResponse>('/users/login/', data);
    const { token, user } = response.data;
    
    // Store token and user in localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  // Logout user
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Get current user from localStorage
  async getCurrentUser(): Promise<User | null> {
    const userStr =  await this.fetchCurrentUser();
    return userStr;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },

  // Fetch current user from backend (validates token)
  async fetchCurrentUser(): Promise<User> {
    const response = await axiosInstance.get<User>('/users/getUsuario/');
    return response.data;
  },
};