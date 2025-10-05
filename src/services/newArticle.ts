import type { Estado } from '@/components/articulo/ArticuloCard';
import api from './api';

export interface Conference {
  id: number
  name: string
}

export interface Session {
  id: number    
  title: string
  deadline: string
  conference?: Conference | null
}

export interface Articulo {
  title: string;
  main_file_url: string;
  status: string | null;
  article_type: string | null;
  abstract: string;
  source_file_url: string;
  authors: number[];
  notification_author: number | null;
  session_id: number | null;
}
export async function createArticle(newArticle: Articulo) {
  const response = await fetch("http://127.0.0.1:8000/api/articles/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newArticle),
  });

  if (!response.ok) {
    throw new Error("Error al crear el artículo");
  }
  return response.json();
}