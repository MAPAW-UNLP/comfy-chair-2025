/* Componente que muestra todos los datos de un articulo en detalle*/

// Importaciones
import React, { useState, useEffect } from "react";
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

  // Navegacion
  const navigate = useNavigate();
  const handleCancel = () => {navigate({ to: '/article/view', replace: true });}

  // Manejo de archivos
  const [existingMainFileUrl, setExistingMainFileUrl] = useState<string | null>(null); // URL del archivo principal ya existente (edicion)
  const [existingSourceFileUrl, setExistingSourceFileUrl] = useState<string | null>(null); // URL del archivo de fuentes ya existente (edicion)

  useEffect(() => {
  
    if (article) {
  
      // Manejo de los archivos del articulo
      const mf: any = article.main_file;
      const sf: any = article.source_file;
  
      // Cargar y settear el arthivo principal
      if (mf) {
        const url = typeof mf === 'string' ? mf : mf.url ?? null;
        setExistingMainFileUrl(url);
      }
  
      // Cargar y settear el archivo de fuentes (si existe)
      if (sf) {
        const urlS = typeof sf === 'string' ? sf : sf.url ?? null;
        setExistingSourceFileUrl(urlS);
      } else {
        setExistingSourceFileUrl(null);
      }
    }
  
  }, [article]);

  // Renderizado del componente
  return (
    <div className="flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <div className="text-start flex flex-col gap-2 mb-4">
          <p><b>Título:</b> {article?.title}</p>
          <p><b>Tipo:</b> {tipoTexto[article?.type!] ?? "Desconocido"}</p>
          <p><b>Sesión:</b> {article?.session?.title}</p>
          <p><b>Conferencia:</b> {article?.session?.conference?.title}</p>
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
          {/* Mostrar enlace al archivo existente en modo edición */}
          {existingMainFileUrl && (
            <p><b>Articulo: </b>
              <a href={existingMainFileUrl} target="_blank" rel="noreferrer" className="text-xs text-sky-600 hover:underline mt-1">Ver Archivo</a>
            </p>
          )}
          {/* Mostrar enlace al archivo de fuentes existente en modo edición */}
          {existingSourceFileUrl && (
            <p>
              <b>Fuentes: </b>
              <a href={existingSourceFileUrl} target="_blank" rel="noreferrer" className="text-xs text-sky-600 hover:underline mt-1">Ver Archivo</a>
            </p>
          )}
        </div>

        <div>
          <Button variant="outline" onClick={handleCancel} className="w-full bg-zinc-500 text-white">
            Volver
          </Button>
        </div>
      </div>
    </div>
  );

};

export default ArticleDetail;