
// -------------------------------------------------------------------------------------- 
//
// Grupo 1 - Componente para mostrar todos los campos completos de un articulo.
//
// -------------------------------------------------------------------------------------- 

// Importaciones
import { Button } from "../ui/button";
import { useArticleFiles } from "@/hooks/Grupo1/useArticleFiles";
import { useEffect, useState } from 'react';
import type { Article, Status, Type } from "@/services/articleServices";
import { downloadMainFile, downloadSourceFile } from "@/services/articleServices";
import { getReviewsByArticle } from '@/services/reviewerServices'
import type { Review } from '@/services/reviewerServices'

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

  // Hook custom para el manejo de archivos
  const { mainFileName, sourceFileName } = useArticleFiles(article);

  // Estado y carga de reviews
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const data = await getReviewsByArticle(article.id);
        if (mounted) setReviews(data ?? []);
      } catch (e) {
        console.error('Error fetching reviews', e);
        if (mounted) setReviews([]);
      } finally {
        if (mounted) setLoadingReviews(false);
      }
    };

    if (article.status === 'accepted' || article.status === 'rejected') {
      fetchReviews();
    }

    return () => { mounted = false };
  }, [article.id, article.status]);

  //------------------------------------------------------------
  // Renderizado del componente
  //------------------------------------------------------------
  return (
    <div className="flex flex-col xl:flex-row items-start gap-4 max-w-5xl w-full">
      
      {/* Card con los detalles del articulo */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full">
        <div className="text-start flex flex-col gap-2">

          {/* Titulo de la card */}
          <h2 className="text-lg font-bold italic text-slate-500 text-center">
            Detalle del Articulo
          </h2>

          <hr className="bg-slate-100" />
          
          {/* Detalles del Artículo */}
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

          {/* Botones de Archivos */}
          <div className="flex flex-col sm:flex-row gap-2 w-full">

            {/* Archivo principal descargable */}
            {mainFileName && (
              <div className="flex-1 grid items-start">
                <p><b>Articulo</b></p>
                <Button
                  variant="outline"
                  onClick={() => downloadMainFile(article.id, mainFileName!)}
                  className="w-full text-white bg-slate-900"
                >
                  Descargar Artículo
                </Button>
              </div>
            )}

            {/* Archivo fuentes descargable */}
            {sourceFileName && (
              <div className="flex-1 grid items-start">
                <p><b>Fuentes</b></p>
                <Button
                  variant="outline"
                  onClick={() => downloadSourceFile(article.id, sourceFileName!)}
                  className="w-full text-white bg-slate-900"
                >
                  Descargar Fuentes
                </Button>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Card con las reviews del articulo, solo si el estado es aceptado o rechazado */}
      {(article.status === "accepted" || article.status === "rejected") && (
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full">
          <div className="text-start flex flex-col gap-2">
            
            {/* Titulo de la card */}
            <h2 className="text-lg font-bold italic text-slate-500 text-center">
              Reviews del Articulo
            </h2>

            <hr className="bg-slate-100" />

            {/* Reviews del Artículo */}
            {loadingReviews && (
              <div className="py-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              </div>
            )}

            {!loadingReviews && (!reviews || reviews.length === 0) && (
              <div className="py-4 text-sm text-muted-foreground">No hay reviews publicadas para este artículo.</div>
            )}

            {!loadingReviews && reviews && reviews.length > 0 && (
              (() => {
                const publishedReviews = reviews.filter((r) => r.is_published === true);
                
                if (publishedReviews.length === 0) {
                  return (
                    <div className="py-4 text-sm text-muted-foreground">No hay reviews publicadas para este artículo.</div>
                  );
                }
                
                return (
                  <div className="space-y-4">
                    {publishedReviews.map((r) => (
                      <div key={r.id} className="p-3 border rounded">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">Revisor: {String(r.reviewer)}</div>
                          <div className="text-sm font-medium">Puntaje: {r.score}</div>
                        </div>
                        <div className="mt-2 text-sm">{r.opinion}</div>
                      </div>
                    ))}
                  </div>
                );
              })()
            )}
          
          </div>
        </div>
      )}

    </div>
  );
};

export default ArticleDetail;