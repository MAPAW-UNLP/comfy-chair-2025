import api from "./api"

export interface Article {
  id: number
  title: string
  description: string
}

export const getArticuloById = async (id: number): Promise<Article> => {
  const res = await api.get(`/articles/articles/${id}/`)
  if (!res.status || res.status >= 400) throw new Error("Error al obtener el artículo")
  return res.data
}
