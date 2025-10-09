import type {  Articulo } from '@/services/articulos';

// Función para crear un artículo
export async function createArticle(newArticle: Articulo) {
  const formData = new FormData();
  formData.append('title', newArticle.title);
  formData.append('main_file', newArticle.main_file);

  if (newArticle.source_file) {
    formData.append('source_file', newArticle.source_file);
  }

  formData.append('status', newArticle.status || 'reception');
  formData.append('type', newArticle.type || 'regular');
  formData.append('abstract', newArticle.abstract);

  if (newArticle.notification_author !== undefined) {
    formData.append('corresponding_author', newArticle.notification_author.toString());
  }

  if (newArticle.session_id !== undefined) {
    formData.append('session', newArticle.session_id.toString());
  }

  newArticle.authors.forEach((authorId) => {
    formData.append('authors', authorId.toString());
  });

  const response = await fetch('http://127.0.0.1:8000/api/article/', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Error response:', errorData);
    console.error('Status:', response.status);
    throw new Error(`Error al crear el artículo: ${JSON.stringify(errorData)}`);
  }

  return response.json();
}