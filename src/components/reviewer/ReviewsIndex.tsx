// ./reviewer/ReviewsIndex.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getAllArticles, type Article } from "@/services/articleServices";
import { getBidsByReviewer } from "@/services/biddingServices";
import { useAuth } from "@/contexts/AuthContext";
import { useCountdown } from "@/utils/useCountdown";
import {
  fetchAssignedArticlesStrict,
  type AssignedArticle,
  fetchAssignedArticles, // para el listado clonado
} from "@/services/assignmentsServices";
import {
  hasPublishedReview,
  getOwnReviewByArticle, // para el listado clonado
} from "@/services/reviewerServices";
import { Button } from "../ui/button"; // ⬅️ ajustado a tu estructura

// --- helpers existentes
const REVIEW_DEADLINE =
  (import.meta.env.VITE_REVIEW_DEADLINE as string | undefined) ?? null;
const pad = (n: number) => String(n).padStart(2, "0");

// --- UI auxiliar (se mantiene)
function SoftCard(props: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const base =
    "rounded-2xl bg-slate-100/70 px-5 py-4 shadow-sm ring-1 ring-black/5 transition";
  const interactive =
    "cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2";
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={`${base} ${interactive} ${props.className ?? ""}`}
    >
      {props.children}
    </button>
  );
}

/* =========================================================================
 *   BLOQUE TRANSFERIDO de AssignedArticles.tsx — {content} y su lógica
 * ========================================================================= */
type ReviewStatus = "pending" | "draft" | "completed";

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
  draft: {
    label: "Borrador",
    badgeClass:
      "text-amber-700 bg-amber-50 ring-1 ring-amber-200 dark:text-amber-200 dark:bg-amber-900/30 dark:ring-amber-800",
    cta: "Editar borrador" as const,
  },
  completed: {
    label: "Completo",
    badgeClass:
      "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 dark:text-emerald-200 dark:bg-emerald-900/30 dark:ring-emerald-800",
    cta: "Ver" as const,
  },
} as const;

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
/* ========================= FIN bloque transferido ========================= */

export default function ReviewsIndex() {
  const navigate = useNavigate();
  const auth = useAuth();

  // ---- estado original (no modificado, salvo lo necesario para integrarse)
  const [articulos, setArticulos] = useState<Article[]>([]);
  const [bids, setBids] = useState<{ article: number; choice?: string }[]>([]);
  const [assigned, setAssigned] = useState<AssignedArticle[] | null>(null);
  const [loadingAssigned, setLoadingAssigned] = useState(false);
  const [reviewedMap, setReviewedMap] = useState<Record<number, boolean>>({});

  const cd = useCountdown(REVIEW_DEADLINE || undefined);
  const isReviewOver =
    !REVIEW_DEADLINE || cd.isOver || (cd.days === 0 && cd.hours === 0 && cd.minutes === 0);
  const dhm = `${pad(cd.days)}:${pad(cd.hours)}:${pad(cd.minutes)}`;

  useEffect(() => {
    (async () => {
      try {
        const artsPromise = getAllArticles();
        let bidsPromise: Promise<{ article: number; choice?: string }[]> = Promise.resolve([]);
        if (auth.user) {
          bidsPromise = getBidsByReviewer(Number(auth.user.id));
        }
        const [arts, userBids] = await Promise.all([artsPromise, bidsPromise]);
        setArticulos(arts);
        setBids(userBids);
      } catch {
        /* noop */
      }
    })();
  }, [auth.user]);

  useEffect(() => {
    const load = async () => {
      setLoadingAssigned(true);
      try {
        if (!auth.user) {
          setAssigned(null);
          return;
        }
        const rows = await fetchAssignedArticlesStrict(Number(auth.user.id));
        setAssigned(rows);
      } catch {
        setAssigned([]);
      } finally {
        setLoadingAssigned(false);
      }
    };
    load();
  }, [auth.user]);

  useEffect(() => {
    if (!assigned || assigned.length === 0) {
      setReviewedMap({});
      return;
    }
    let alive = true;
    (async () => {
      try {
        const flags = await Promise.all(assigned.map((a) => hasPublishedReview(a.id)));
        if (!alive) return;
        const map: Record<number, boolean> = {};
        assigned.forEach((a, i) => {
          map[a.id] = Boolean(flags[i] ?? a.reviewed ?? false);
        });
        setReviewedMap(map);
      } catch {
        if (!alive) return;
        const map: Record<number, boolean> = {};
        assigned.forEach((a) => (map[a.id] = Boolean(a.reviewed)));
        setReviewedMap(map);
      }
    })();
    return () => {
      alive = false;
    };
  }, [assigned?.length]);

  const reviewedCount = useMemo(
    () => Object.values(reviewedMap).filter(Boolean).length,
    [reviewedMap]
  );

  /* ===================== Estado + efectos del {content} ===================== */
  const [data, setData] = useState<UiRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [flashId, setFlashId] = useState<number | null>(null);

  const { user } = useAuth();
  const reviewerId = Number(user?.id ?? 1); // fallback simple si aún no está el auth real

  // --- helper para calcular estado (pendiente/draft/completed) ---
  const computeStatusFor = useCallback(
    async (articleId: number): Promise<ReviewStatus> => {
      try {
        // primero vemos si está publicada
        const published = await hasPublishedReview(articleId);
        if (published) return "completed";
        // si no está publicada, puede haber borrador
        const own = await getOwnReviewByArticle(articleId, reviewerId);
        return own ? "draft" : "pending";
      } catch {
        return "pending";
      }
    },
    [reviewerId]
  );

  // --- Recalcular estado tras guardar revisión (usamos el detalle del evento si viene) ---
  useEffect(() => {
    const handleReviewUpdated = async (e: any) => {
      const updatedId = Number(e.detail?.articleId ?? 0);
      const stateHint: "draft" | "sent" | "sent_edited" | undefined = e.detail?.state;
      if (!updatedId) return;

      // si nos pasaron el estado, lo mapeamos directo; si no, recalculamos
      let status: ReviewStatus | null = null;
      if (stateHint === "draft") status = "draft";
      if (stateHint === "sent" || stateHint === "sent_edited") status = "completed";
      if (!status) status = await computeStatusFor(updatedId);

      setData((prev) =>
        prev.map((a) => (a.id === updatedId ? { ...a, status: status! } : a))
      );
    };
    window.addEventListener("review-updated", handleReviewUpdated);
    return () => window.removeEventListener("review-updated", handleReviewUpdated);
  }, [computeStatusFor]);

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

  // --- Carga inicial ---
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const assigned = await fetchAssignedArticles(reviewerId);
        const rows: UiRow[] = await Promise.all(
          assigned.map(async (a: any) => ({
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

  /* =================== FIN estado/efectos del {content} =================== */

  return (
    <div className="mx-auto w-full max-w-md px-4 py-6 md:max-w-2xl">
      <h1 className="mb-4 text-2xl font-semibold">Bienvenido, Revisor</h1>

      {/* Tarjetas superiores (sin cambios en su intención) */}
      <div className="grid grid-cols-2 gap-4">
        <SoftCard onClick={() => navigate({ to: "/reviewer/assigned" })}>
          <div className="flex h-full flex-col items-center justify-center">
            <div className="text-3xl font-semibold tracking-tight">
              {isReviewOver ? "00:00:00" : dhm}
            </div>
            <div className="mt-1 text-[11px] text-slate-400 tracking-wide">
              Días <span className="mx-1 text-slate-300">|</span> Horas
              <span className="mx-1 text-slate-300">|</span> Minutos
            </div>
            <div className="mt-1 text-sm text-slate-600">
              {isReviewOver ? "Revisión finalizada" : "Para finalizar revisión"}
            </div>
          </div>
        </SoftCard>

        <SoftCard onClick={() => navigate({ to: "/reviewer/assigned" })}>
          <div className="flex h-full flex-col items-center justify-center">
            <div className="text-3xl font-semibold tracking-tight">
              {reviewedCount}/{assigned?.length ?? 0}
            </div>
            <div className="mt-1 text-sm text-slate-600">Artículos revisados</div>
          </div>
        </SoftCard>
      </div>

      {/* Encabezado + botón historial a la derecha */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Tus Artículos
          </h1>

          <Button
            onClick={() => navigate({ to: "/reviewer/history" })}
            className="bg-slate-700 hover:bg-slate-600 text-white font-medium"
          >
            Ver historial
          </Button>
        </div>

        <hr className="mb-4 border-slate-200" />

        {/* 👇 Reemplazo directo por el {content} traído de AssignedArticles */}
        {auth.isLoading ? (
          <p className="text-slate-600">Verificando usuario…</p>
        ) : !auth.user ? (
          <div className="rounded-md border-l-4 border-amber-400 bg-amber-50 p-3 text-amber-800">
            Debes iniciar sesión para ver los artículos asignados.
            <button
              onClick={() => navigate({ to: "/login" })}
              className="ml-2 underline text-amber-700"
            >
              Iniciar sesión
            </button>
          </div>
        ) : (
          content
        )}
      </section>
    </div>
  );
}