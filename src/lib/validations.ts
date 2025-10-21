import { z } from "zod"

export const registerSchema = z.object({
  fullName: z.string().min(1, "El nombre completo es requerido"),
  affiliation: z.string().min(1, "La afiliación es requerida"),
  email: z.email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmation: z.string()
}).refine((data: { password: string; confirmation: string }) => data.password === data.confirmation, {
  message: "Las contraseñas no coinciden",
  path: ["confirmation"],
})

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
})

export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
