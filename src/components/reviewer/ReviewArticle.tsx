// src/features/reviewer/ReviewArticle.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

import { getArticleById } from "@/services/articleServices";
import {
  getOwnReviewByArticle,
  createReview,
  updateReview,
  publishReview,
  type Review as ReviewDTO,
} from "@/services/reviewerServices";

type Author = { id: number; full_name?: string; email?: string };

type Article = {
  id: number;
  title: string;
  type: string | null;
  abstract: string | null;
  main_file?: string | null;   // PDF principal
  source_file?: string | null; // adjunto extra (posters)
  authors?: Author[];
};

const SCORE_OPTIONS = [-3, -2, -1, 0, 1, 2, 3];

// Base para armar hrefs absolutos cuando llegan paths relativos
const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") || "";
function hrefFrom(path?: string | null) {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
}

export default function ReviewArticle() {
  const navigate = useNavigate();
  const { articleId: articleIdParam } = useParams({ from: "/_auth/reviewer/review/$articleId" });
  const articleId = Number(articleIdParam);

  const { user } = useAuth();

  // 🛟 Fallback para tener reviewerId aunque el AuthContext aún no esté hidratado
  const reviewerId = useMemo(() => {
    if (user?.id != null) return Number(user.id);
    const stored =
      localStorage.getItem("cc_user_id") || sessionStorage.getItem("cc_user_id");
    return stored ? Number(stored) : NaN;
  }, [user?.id]);

  const [article, setArticle] = useState<Article | null>(null);
  const [review, setReview] = useState<ReviewDTO | null>(null);
  const [opinion, setOpinion] = useState("");
  const [score, setScore] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null); // solo la última edición (frontend)

  const isPoster = useMemo(
    () => (article?.type || "").toLowerCase() === "poster",
    [article?.type]
  );

  // Estado derivado para badge
  const derivedState = useMemo(() => {
    if (!review) return { key: "pending" as const, label: "Pendiente" };
    if (review.is_published) {
      return review.is_edited
        ? { key: "sent_edited" as const, label: "Enviada (editada)" }
        : { key: "sent" as const, label: "Enviada" };
    }
    return { key: "draft" as const, label: "Borrador" };
  }, [review]);

  // ---- Carga inicial ----
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);

        const art = (await getArticleById(articleId)) as Article;
        if (!alive) return;
        setArticle(art);

        if (!Number.isFinite(reviewerId)) return; // no precargamos si no hay id

        const r = await getOwnReviewByArticle(articleId, reviewerId);
        if (!alive) return;

        setReview(r);
        if (r) {
          setOpinion(r.opinion ?? "");
          setScore(String(r.score ?? ""));
        }
      } catch (e) {
        console.error("Error cargando artículo/revisión:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [articleId, reviewerId]);

  // ---- Acciones ----
  const ensureFields = () => {
    if (!opinion.trim() || score === "") {
      alert("Completá la opinión y la puntuación.");
      return false;
    }
    if (!Number.isFinite(reviewerId)) {
      alert("No se pudo identificar al revisor. Iniciá sesión nuevamente.");
      return false;
    }
    return true;
  };

  // Guardar como borrador (NO publica)
  const handleSaveDraft = async () => {
    if (!ensureFields()) return;

    try {
      setSaving(true);
      let saved: ReviewDTO;

      if (review) {
        saved = await updateReview(review.id, {
          opinion: opinion.trim(),
          score: Number(score),
        });
      } else {
        saved = await createReview({
          article: articleId,
          reviewer: reviewerId,
          opinion: opinion.trim(),
          score: Number(score),
        });
      }

      setReview(saved);
      const stamp = new Date().toLocaleString();
      setLastUpdated(stamp);

      // notificar AssignedArticles / Index
      window.dispatchEvent(
        new CustomEvent("review-updated", {
          detail: { articleId, state: "draft" },
        })
      );

      // ⬅️ ir a ReviewsIndex resaltando este artículo
      navigate({
        to: "/reviewer",
        search: { selected: String(articleId) },
      });
    } catch (e) {
      console.error("Error al guardar borrador:", e);
      alert("Ocurrió un error al guardar el borrador.");
    } finally {
      setSaving(false);
    }
  };

  // Enviar (publicar). Si ya existe, primero se actualiza y luego se publica.
  const handleSend = async () => {
    if (!ensureFields()) return;

    try {
      setSaving(true);
      let saved: ReviewDTO;

      if (review) {
        saved = await updateReview(review.id, {
          opinion: opinion.trim(),
          score: Number(score),
        });
        saved = await publishReview(saved.id);
      } else {
        saved = await createReview({
          article: articleId,
          reviewer: reviewerId,
          opinion: opinion.trim(),
          score: Number(score),
        });
        saved = await publishReview(saved.id);
      }

      setReview(saved);
      const stamp = new Date().toLocaleString();
      setLastUpdated(stamp);

      window.dispatchEvent(
        new CustomEvent("review-updated", {
          detail: { articleId, state: saved.is_edited ? "sent_edited" : "sent" },
        })
      );

      // ⬅️ ir a ReviewsIndex resaltando este artículo
      navigate({
        to: "/reviewer",
        search: { selected: String(articleId) },
      });
    } catch (e) {
      console.error("Error al enviar la revisión:", e);
      alert("Ocurrió un error al enviar la revisión.");
    } finally {
      setSaving(false);
    }
  };

  // ---- Render ----
  if (loading) {
    return <p className="text-slate-600 dark:text-slate-300 px-6 py-8">Cargando artículo…</p>;
  }

  if (!article) {
    return <p className="text-red-600 px-6 py-8">No se encontró el artículo.</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      {/* Encabezado */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{article.title}</h1>
        <span
          className={[
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
            derivedState.key === "pending" && "bg-slate-200 text-slate-800",
            derivedState.key === "draft" && "bg-amber-200 text-amber-900",
            (derivedState.key === "sent" || derivedState.key === "sent_edited") &&
              "bg-emerald-200 text-emerald-900",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {derivedState.label}
        </span>
      </div>

      {lastUpdated && (
        <p className="mt-1 text-xs text-slate-500">Última actualización: {lastUpdated}</p>
      )}

      {/* Datos del artículo */}
      <div className="mt-2 text-sm text-slate-700 dark:text-slate-300 space-y-1">
        <p>
          <span className="font-semibold">Tipo:</span>{" "}
          {article.type || "No especificado"}
        </p>
        <p>
          <span className="font-semibold">Autores:</span>{" "}
          {article.authors?.length
            ? article.authors.map(a => a.full_name || a.email || "Autor").join(", ")
            : "Desconocidos"}
        </p>
      </div>

      {/* Abstract */}
      <p className="mt-4 text-slate-700 dark:text-slate-300">
        {article.abstract || "Sin resumen disponible."}
      </p>

      {/* Descargas */}
      <div className="mt-5 flex flex-wrap items-center gap-4">
        {article.main_file && (
          <a
            href={hrefFrom(article.main_file)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
            download
          >
            Descargar artículo principal
          </a>
        )}
        {isPoster && article.source_file && (
          <a
            href={hrefFrom(article.source_file)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
            download
          >
            Descargar información adicional (poster)
          </a>
        )}
      </div>

      {/* Aviso de login si no hay id */}
      {!Number.isFinite(reviewerId) && (
        <div className="mt-6 rounded-md bg-amber-50 border border-amber-200 p-3 text-amber-800">
          No se pudo identificar tu usuario. Iniciá sesión para guardar/editar la revisión.
        </div>
      )}

      {/* Formulario */}
      <div className="mt-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            Opinión
          </label>
          <textarea
            rows={7}
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
            placeholder="Escribí aquí tu revisión…"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            Puntuación
          </label>
          <select
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="w-28 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2 text-sm"
          >
            <option value="" disabled>Seleccionar</option>
            {SCORE_OPTIONS.map((s) => (
              <option key={s} value={String(s)}>{s}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">
            Valores permitidos: -3, -2, -1, 0, 1, 2, 3
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <Button
            onClick={handleSaveDraft}
            disabled={saving || !opinion.trim() || score === "" || !Number.isFinite(reviewerId)}
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg"
          >
            {saving ? "Guardando…" : "Guardar borrador"}
          </Button>

          <Button
            onClick={handleSend}
            disabled={saving || !opinion.trim() || score === "" || !Number.isFinite(reviewerId)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-6 rounded-lg"
          >
            {saving ? "Enviando…" : review?.is_published ? "Actualizar y enviar" : "Enviar"}
          </Button>
        </div>
      </div>
    </div>
  );
}