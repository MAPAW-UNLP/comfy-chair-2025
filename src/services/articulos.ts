import api from './api';

export interface Article {
  id: number;
  title: string;
  description: string;
  autores?: string[]; // user[];
  revisores?: string[]; // user[];
}

export const getArticulos = async (): Promise<Article[]> => {
  try {
    // console.log('Haciendo request a /articles/articles/');
    const response = await api.get('/articles/articles/');
    // console.log('Respuesta completa:', response.data);

    // Los articulos estan en response.data.results
    const articles = response.data.results;
    // console.log('Articulos en results:', articles);
    // console.log('Tipo de results:', typeof articles);
    // console.log('Es array?', Array.isArray(articles));

    return Array.isArray(articles) ? articles : [];
  } catch (error) {
    console.error('Error en getArticulos:', error);
    return [];
  }
};

export const getArticuloById = async (id: number): Promise<Article> => {
  const res = await api.get(`/articles/articles/${id}/`)
  if (!res.status || res.status >= 400) throw new Error("Error al obtener el artículo")
  return res.data
}
