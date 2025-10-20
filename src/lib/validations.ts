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

//Grupo 1
export const articleSchema = z.object({
  conference: z.string().min(1, "conferencia requerida"),
  session: z.string().min(1, "sesión requerida"),
  title: z.string().min(1, "título requerido"),
  abstract: z.string().min(1, "abstract requerido"),
  file: z.string().min(1, "archivo de articulo requerido"),
  sourcesFile: z.string().min(1, "archivo de fuentes requerido"),
  authors: z.string().min(1, "seleccionar al menos un autor"),
  correspondingAuthor: z.string().min(1, "autor de notificacion requerido"),
})

export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type ArticleFormData = z.infer<typeof articleSchema> //Grupo 1
