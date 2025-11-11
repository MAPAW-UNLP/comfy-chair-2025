// -------------------------------------------------------------------------------------- 
//
// Grupo 1 - Componente para mostrar todos los campos completos de un articulo.
//
// -------------------------------------------------------------------------------------- 

// Importaciones
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import {  } from "lucide-react";
import type { Article, Status, Type } from "@/services/articleServices";
import { downloadMainFile, downloadSourceFile } from "@/services/articleServices";

// Lo que espera recibir el componente
export interface ArticleDetailProps {
  article: Article;
}

// Textos asociados a cada tipo
const tipoTexto: Record<Type, string> = {
  regular: "Regular",
  poster: "Poster",
};

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

//Cuerpo del Componente
const ArticleDetail : React.FC<ArticleDetailProps> = ({ article }) => {

  // (Back button removed — breadcrumb handles navigation)

  // Archivos (articulo y fuentes)
  const [existingMainFileName, setExistingMainFileName] = useState<string | null>(null); // Nombre del archivo principal
  const [existingSourceFileName, setExistingSourceFileName] = useState<string | null>(null); // Nombre del archivo de fuentes

  //------------------------------------------------------------
  // Efecto para cargar los archivos existentes (articulo y fuentes)
  //------------------------------------------------------------
  useEffect(() => {
  
    if (article) {
  
      // Manejo de los archivos del articulo
      const mf: any = article.main_file;
      const sf: any = article.source_file;
  
      // Cargar y settear el arthivo principal
      if (mf) {
        const url = typeof mf === 'string' ? mf : mf.url ?? null;
        if (url) {
          try {
            const parts = url.split('/');
            setExistingMainFileName(decodeURIComponent(parts[parts.length - 1]));
          } catch (_) {
            setExistingMainFileName(String(mf));
          }
        } else {
          setExistingMainFileName(typeof mf === 'string' ? mf : null);
        }
      }

      // Cargar y settear el archivo de fuentes (si existe)
      if (sf) {
        const urlS = typeof sf === 'string' ? sf : sf.url ?? null;
        if (urlS) {
          try {
            const parts = urlS.split('/');
            setExistingSourceFileName(decodeURIComponent(parts[parts.length - 1]));
          } catch (_) {
            setExistingSourceFileName(String(sf));
          }
        } else {
          setExistingSourceFileName(typeof sf === 'string' ? sf : null);
        }
      } else {
        setExistingSourceFileName(null);
      }

    }
  
  }, [article]);

  //------------------------------------------------------------
  // Renderizado del componente
  //------------------------------------------------------------
  return (
    <div className="flex justify-end items-center">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">

        {/* Campos del articulo */}
        <div className="text-start flex flex-col gap-2">
          
          {/* Back button removed — breadcrumb includes navigation */}
          
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

          <div className="flex flex-col md:flex-row gap-4 w-full">

            {existingMainFileName && (
              <div className="flex-1 grid items-start gap-2">
                <Button
                variant="outline"
                onClick={() => downloadMainFile(article.id, existingMainFileName!)}
                className="w-full bg-slate-900 text-white"
                >
                  Descargar Articulo
                </Button>
              </div>      
            )}

            {existingSourceFileName && (
              <div className="flex-1 grid items-start gap-2">
                <Button
                variant="outline"
                onClick={() => downloadSourceFile(article.id, existingSourceFileName!)}
                className="w-full bg-slate-900 text-white"
                >
                  Descargar Fuentes
                </Button>
              </div>
            )}

          </div> 
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;