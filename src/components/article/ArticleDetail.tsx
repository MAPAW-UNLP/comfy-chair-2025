/* Componente que muestra todos los datos de un articulo en detalle*/

// Importaciones
import React from "react";
import type { Article } from "@/services/articleServices";
import type { Status, Type } from "@/services/articleServices";
import { Button } from "../ui/button";
import { useNavigate } from '@tanstack/react-router';

// Lo que espera recibir el componente
export interface ArticleCardProps {
  article?: Article;
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

//Cuerpo del Componente
const ArticleDetail: React.FC<ArticleCardProps> = ({ article }) => {

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate({ to: '/article/view', replace: true });
  }

  // Renderizado del componente
  return (
    <div className="flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <div className="text-start flex flex-col gap-2 mb-4">
          <p><b>Título:</b> {article?.title}</p>
          <p><b>Sesión:</b> {article?.session?.title}</p>
          <p><b>Conferencia:</b> {article?.session?.conference?.title}</p>
          <p><b>Tipo:</b> {tipoTexto[article?.type!] ?? "Desconocido"}</p>
          <p><b>Estado:</b> {estadoTexto[article?.status!] ?? "Desconocido"}</p>
          <p><b>Autor de Notificación:</b> {article?.corresponding_author?.email}</p>
          <p>
            <b>Autores:</b>{" "}
            {article?.authors?.map((author, index) => (
              <span key={index}>
                {author?.email}
                {index < article.authors.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
          <p><b>Abstract:</b> {article?.abstract}</p>
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="bg-zinc-500 text-white hover:bg-zinc-600"
          >
            Volver
          </Button>
        </div>
      </div>
    </div>
  );

};

export default ArticleDetail;