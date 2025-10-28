/* Componente que muestra todos los datos de un articulo en detalle*/

// Importaciones
import React from "react";
import { Button } from "../ui/button";
import type { Article } from "@/services/articleServices";
import type { Status, Type } from "@/services/articleServices";

// Lo que espera recibir el componente
export interface ArticleCardProps {
  article: Article;
}

// Textos asociados a cada estado
const estadoTexto: Record<Status, string> = {
  accepted: "Aceptado",
  reception: "Recibido",
  bidding: "Bidding",
  assignment: "Asignación",
  review: "Revisión",
  selection: "Selección",
  rejected: "Rechazado",
};

// Textos asociados a cada tipo
const tipoTexto: Record<Type, string> = {
  regular: "Regular",
  poster: "Poster",
};

const handleDownload = async (url: string, filename: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = filename; // nombre personalizado
  link.click();
};

const API_BASE = import.meta.env.VITE_API_URL;

//Cuerpo del Componente
const ArticleDetail: React.FC<ArticleCardProps> = ({ article }) => {

  // Renderizado del componente
  return (
    <div>
      <hr className="my-2"/>
      <div className="text-start flex-1 flex flex-col gap-1 mb-2">
        <p><b>Titulo: </b>{article.title}</p>
        <p><b>Sesión: </b>{article.session?.title}</p>
        <p><b>Conferencia: </b>{article.session?.conference?.title}</p>
        <p><b>Tipo: </b>{tipoTexto[article.type] ?? "Desconocido"}</p>
        <p><b>Estado: </b>{estadoTexto[article.status] ?? "Desconocido"}</p>
        <p><b>Autor de Notificación: </b>{article.corresponding_author?.email}</p>
        <p><b>Autores: </b>{article.authors?.map((author, index) => (<span key={index}>{author?.email}{index < article.authors.length - 1 ? ", " : ""}</span>))}</p>
        <p><b>Abstract: </b>{article.abstract}</p>
      </div>
      <hr className="my-2"/>
      <div className="flex flex-row gap-4">
        <div className="flex flex-col basis-1/2 gap-1">
          <span className="text-sm text-slate-900 font-medium text-start">Articulo</span> 
          <Button variant="outline" className="bg-slate-900 text-white" onClick={() => handleDownload(`${API_BASE}/api/article/${article.id}/download_main/`,"Archivo principal")}>
            Descargar
          </Button>
        </div>
        <div className={`flex flex-col basis-1/2 gap-1 ${article.type !== "poster" ? 'invisible' : 'visible'}`}>
          <span className="text-sm text-slate-900 font-medium text-start">Fuentes</span>
            <Button variant="outline" className="bg-slate-900 text-white" onClick={() => handleDownload(`${API_BASE}/api/article/${article.id}/download_source/`,"Fuentes")}>
              Descargar
            </Button>
        </div>
      </div>
    </div>
  );

};

export default ArticleDetail;