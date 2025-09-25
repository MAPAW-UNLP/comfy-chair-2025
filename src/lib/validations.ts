import { z } from "zod"

export const registerSchema = z.object({
  nombreCompleto: z.string().min(1, "El nombre completo es requerido"),
  afiliacion: z.string().min(1, "La afiliación es requerida"),
  email: z.email("Email inválido"),
  contraseña: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmacion: z.string()
}).refine((data: { contraseña: string; confirmacion: string }) => data.contraseña === data.confirmacion, {
  message: "Las contraseñas no coinciden",
  path: ["confirmacion"],
})

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  contraseña: z.string().min(1, "La contraseña es requerida"),
})

export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
