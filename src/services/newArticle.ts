export interface Conference {
  id: number;
  name: string;
}

export interface Session {
  id: number;
  title: string;
  deadline: string;
  conference?: Conference | null;
}

export interface Articulo {
  title: string;
  main_file: File;
  source_file?: File | null;
  status: string | null;
  article_type: string | null;
  abstract: string;
  authors: number[];
  notification_author: number | null;
  session_id: number | null;
}
export async function createArticle(newArticle: Articulo) {
  // Crear FormData
  const formData = new FormData();
  formData.append('title', newArticle.title);
  formData.append('main_file', newArticle.main_file);
  if (newArticle.source_file && newArticle.source_file !== null) {
    formData.append('source_file', newArticle.source_file);
  }
  formData.append('status', newArticle.status || 'reception');
  formData.append('article_type', newArticle.article_type || '');
  formData.append('abstract', newArticle.abstract || '');
  formData.append(
    'notification_author',
    newArticle.notification_author?.toString() || ''
  );
  formData.append('session_id', newArticle.session_id?.toString() || '');

  // Agregar autores
  newArticle.authors.forEach((authorId) => {
    formData.append('authors', authorId.toString());
  });

  const response = await fetch('http://127.0.0.1:8000/api/articles/', {
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