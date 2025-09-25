import axiosInstance from './api'
import type { RegisterFormData, LoginFormData } from '@/lib/validations'

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    nombreCompleto: string
    afiliacion: string
  }
}

export const authService = {
  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/register', {
      nombreCompleto: data.nombreCompleto,
      afiliacion: data.afiliacion,
      email: data.email,
      password: data.contraseña
    })
    return response.data
  },

  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/login', {
      email: data.email,
      password: data.contraseña
    })
    return response.data
  }
}
