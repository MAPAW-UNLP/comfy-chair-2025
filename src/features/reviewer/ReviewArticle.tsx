import React, { useEffect, useState } from "react";
import { getOwnReviewByArticle, createReview, updateReview } from "@/services/reviewerServices";
import { getArticleById } from "@/services/articleServices";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

interface ReviewArticleProps {
  articleId: number;
}

export default function ReviewArticle({ articleId }: ReviewArticleProps) {
  const navigate = useNavigate();

  const [article, setArticle] = useState<any>(null);
  const [review, setReview] = useState<any>(null);
  const [opinion, setOpinion] = useState("");
  const [score, setScore] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // Carga del artículo
        const art = await getArticleById(articleId);
        setArticle(art);

        // Carga de la revisión si existe
        const existingReview = await getOwnReviewByArticle(articleId);
        if (existingReview) {
          setReview(existingReview);
          setOpinion(existingReview.opinion);
          setScore(existingReview.score);
        }
      } catch (err) {
        console.error("Error cargando datos del artículo:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [articleId]);

  const handleSave = async () => {
    try {
      if (!opinion.trim() || score === "") {
        alert("Por favor, completa la opinión y la puntuación antes de guardar.");
        return;
      }
      setSaving(true);

      if (review) {
        await updateReview(review.id, { opinion, score: Number(score) });
      } else {
        await createReview({
          article: articleId,
          reviewer: 1, // TODO: reemplazar con el reviewer autenticado real
          opinion,
          score: Number(score),
        });
      }

      // Dispara evento global → actualizar AssignedArticles y Index
      window.dispatchEvent(new CustomEvent("review-updated", { detail: { articleId } }));

      alert("Revisión guardada correctamente ✅");
      navigate({ to: "/reviewer/assigned" });
    } catch (err) {
      console.error("Error al guardar revisión:", err);
      alert("Error al guardar la revisión.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-slate-600 dark:text-slate-300">Cargando artículo...</p>;
  }

  if (!article) {
    return <p className="text-red-600">No se encontró el artículo.</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      {/* Título */}
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
        {article.title}
      </h1>

      {/* Resumen */}
      <p className="text-slate-700 dark:text-slate-300 mb-4">
        {article.abstract || "Sin resumen disponible."}
      </p>

      {/* Tipo y autores */}
      <p className="text-sm text-slate-600 mb-2">
        <strong>Tipo:</strong> {article.type || "No especificado"}
      </p>
      <p className="text-sm text-slate-600 mb-4">
        <strong>Autores:</strong>{" "}
        {article.authors?.map((a: any) => a.full_name || a.email).join(", ") || "Desconocidos"}
      </p>

      {/* Enlaces de descarga */}
      <div className="space-x-4 mb-6">
        {article.main_file && (
          <a
            href={article.main_file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Descargar artículo principal
          </a>
        )}
        {article.type === "poster" && article.source_file && (
          <a
            href={article.source_file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Descargar información adicional (poster)
          </a>
        )}
      </div>

      {/* Formulario de revisión */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Opinión
          </label>
          <textarea
            className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-sky-400"
            rows={6}
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Puntuación (-3 a 3)
          </label>
          <input
            type="number"
            min={-3}
            max={3}
            className="w-24 rounded-md border border-slate-300 p-1 text-center"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
          />
        </div>

        <Button
          disabled={saving}
          onClick={handleSave}
          className="mt-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-6 rounded-lg"
        >
          {saving ? "Guardando..." : review ? "Actualizar revisión" : "Guardar revisión"}
        </Button>
      </div>
    </div>
  );
}
