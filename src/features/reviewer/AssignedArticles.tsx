import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { fetchAssignedArticles } from "@/services/assignmentsServices";
import { hasOwnReview } from "@/services/reviewerServices";
import { useAuth } from "@/contexts/AuthContext";

type ReviewStatus = "pending" | "completed";

interface UiRow {
  id: number;
  title: string;
  status: ReviewStatus;
}

interface ArticleCardProps {
  article: UiRow;
  onAction?: (article: UiRow) => void;
  selected?: boolean;
  flashing?: boolean;
}

const DEADLINE = "2025-11-10";

const STATUS_UI = {
  pending: {
    label: "Pendiente",
    badgeClass:
      "text-rose-700 bg-rose-50 ring-1 ring-rose-200 dark:text-rose-200 dark:bg-rose-900/30 dark:ring-rose-800",
    cta: "Revisar" as const,
  },
  completed: {
    label: "Completo",
    badgeClass:
      "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 dark:text-emerald-200 dark:bg-emerald-900/30 dark:ring-emerald-800",
    cta: "Ver" as const,
  },
} as const;

// ---------- Tarjeta ----------
function ArticleCard({ article, onAction, selected, flashing }: ArticleCardProps) {
  const conf = STATUS_UI[article.status];

  return (
    <div
      id={`art-${article.id}`}
      tabIndex={-1}
      className={[
        "rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 md:p-5 transition-all duration-500 ease-out",
        selected ? "ring-2 ring-sky-400 ring-offset-2" : "ring-1 ring-transparent",
        flashing ? "bg-sky-50/70 shadow-md scale-[1.01]" : "",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="text-slate-900 dark:text-slate-100 font-semibold leading-snug">
            {article.title}
          </h3>
          <div className="mt-2">
            <span
              className={
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium " +
                conf.badgeClass
              }
            >
              {conf.label}
            </span>
          </div>
        </div>

        <button
          onClick={() => onAction?.(article)}
          className="shrink-0 rounded-xl px-3 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 dark:focus:ring-offset-slate-900"
        >
          {conf.cta}
        </button>
      </div>
    </div>
  );
}

// ---------- Vista principal ----------
export default function AssignedArticlesView() {
  const [data, setData] = useState<UiRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [flashId, setFlashId] = useState<number | null>(null);

  const navigate = useNavigate();
  const { user } = useAuth();
  const reviewerId = Number(user?.id ?? 1); // por ahora fallback

  // --- Escucha evento global para actualizar estado tras guardar revisión ---
  useEffect(() => {
    const handleReviewUpdated = (e: any) => {
      const updatedId = e.detail.articleId;
      setData((prev) =>
        prev.map((a) =>
          a.id === updatedId ? { ...a, status: "completed" } : a
        )
      );
    };
    window.addEventListener("review-updated", handleReviewUpdated);
    return () => window.removeEventListener("review-updated", handleReviewUpdated);
  }, []);

  // --- Detectar seleccionado por query param ---
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const v = sp.get("selected");
    const id = v ? Number(v) : null;
    setSelectedId(id);
    setFlashId(id);
  }, []);

  // --- Quitar “flash” ---
  useEffect(() => {
    if (!flashId) return;
    const t = setTimeout(() => setFlashId(null), 1200);
    return () => clearTimeout(t);
  }, [flashId]);

  // --- Scroll + focus al cargar ---
  useEffect(() => {
    if (loading || !selectedId) return;
    const el = document.getElementById(`art-${selectedId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => (el as HTMLElement).focus?.(), 300);
    }
  }, [loading, selectedId]);

  // --- Lógica de carga (igual que Index) ---
  const computeStatusFor = useCallback(async (articleId: number): Promise<ReviewStatus> => {
    try {
      const hasReview = await hasOwnReview(articleId);
      return hasReview ? "completed" : "pending";
    } catch {
      return "pending";
    }
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const assigned = await fetchAssignedArticles(reviewerId);
        const rows: UiRow[] = await Promise.all(
          assigned.map(async (a) => ({
            id: a.id,
            title: a.title,
            status: await computeStatusFor(a.id),
          }))
        );
        if (alive) setData(rows);
      } catch (err) {
        console.error("Error cargando artículos asignados:", err);
        if (alive) setData([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [reviewerId, computeStatusFor]);

  const handleAction = useCallback(
    (article: UiRow) => {
      navigate({
        to: "/reviewer/review/$articleId",
        params: { articleId: String(article.id) },
      });
    },
    [navigate]
  );

  const content = useMemo(() => {
    if (loading) return <div className="text-slate-600 dark:text-slate-300">Cargando…</div>;
    if (!data.length) return <div className="text-slate-600 dark:text-slate-300">Sin asignar aún…</div>;
    return (
      <div className="space-y-3">
        {data.map((a) => (
          <ArticleCard
            key={a.id}
            article={a}
            onAction={handleAction}
            selected={selectedId === a.id}
            flashing={flashId === a.id}
          />
        ))}
      </div>
    );
  }, [data, loading, handleAction, selectedId, flashId]);

  return (
    <div className="mx-auto w-full max-w-md sm:max-w-lg px-4 py-4 sm:py-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Artículos Asignados</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Fecha Límite de Revisión: <span className="font-medium">{DEADLINE}</span>
        </p>
      </header>
      {content}
    </div>
  );
}
