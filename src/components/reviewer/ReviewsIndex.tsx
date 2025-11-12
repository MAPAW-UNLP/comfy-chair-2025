// src/components/reviews/Index.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { getAllArticles, type Article } from "@/services/articleServices";
import { getBidsByReviewer } from "@/services/biddingServices";
import { useAuth } from "@/contexts/AuthContext";
import { useCountdown } from "@/utils/useCountdown";
import { fetchAssignedArticlesStrict, type AssignedArticle } from "@/services/assignmentsServices";
import { hasPublishedReview } from "@/services/reviewerServices";
import { Button } from "@/components/ui/button";

// NOTE: before this component used a hardcoded REVIEWER_ID; we now use
// the authenticated user id via AuthContext. For non-authenticated users
// we show a friendly warning instead of falling back to all articles.
const REVIEW_DEADLINE =
  (import.meta.env.VITE_REVIEW_DEADLINE as string | undefined) ?? null;

const pad = (n: number) => String(n).padStart(2, "0");

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

export default function Inicio() {
  const navigate = useNavigate();

  // Métricas previas (no se tocan)
  const [articulos, setArticulos] = useState<Article[]>([]);
  const [bids, setBids] = useState<{ article: number; choice?: string }[]>([]);

  // Asignados + estado de revisión por id
  const [assigned, setAssigned] = useState<AssignedArticle[] | null>(null);
  const [loadingAssigned, setLoadingAssigned] = useState(false);
  const [reviewedMap, setReviewedMap] = useState<Record<number, boolean>>({});

  // -------- Contador de revisión (mismo mecanismo que bidding) --------
  const cd = useCountdown(REVIEW_DEADLINE || undefined);
  const isReviewOver =
    !REVIEW_DEADLINE || cd.isOver || (cd.days === 0 && cd.hours === 0 && cd.minutes === 0);
  const dhm = `${pad(cd.days)}:${pad(cd.hours)}:${pad(cd.minutes)}`;

  // Datos previos (mantener comportamiento)
  useEffect(() => {
    (async () => {
      try {
        // Keep fetching global metrics quietly, but don't use them to render
        // the assigned list. Bids depend on reviewer id; only fetch if we
        // have a logged user.
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
  }, []);

  const auth = useAuth();

  // Cargar asignados (solo para usuario autenticado). Usamos la variante
  // estricta para evitar el fallback que devuelve todos los artículos.
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

  // Construir reviewedMap consultando al backend (publicadas)
  useEffect(() => {
    if (!assigned || assigned.length === 0) {
      setReviewedMap({});
      return;
    }
    let alive = true;
    (async () => {
      try {
        const flags = await Promise.all(
          assigned.map((a) => hasPublishedReview(a.id))
        );
        if (!alive) return;
        const map: Record<number, boolean> = {};
        assigned.forEach((a, i) => {
          // preferimos la verificación remota; si falla, caemos al flag que venga del servicio
          map[a.id] = Boolean(flags[i] ?? a.reviewed ?? false);
        });
        setReviewedMap(map);
      } catch {
        if (!alive) return;
        // fallback: usar lo que venga del servicio si existe
        const map: Record<number, boolean> = {};
        assigned.forEach((a) => (map[a.id] = Boolean(a.reviewed)));
        setReviewedMap(map);
      }
    })();
    return () => {
      alive = false;
    };
  }, [assigned?.length]); // se recalcula cuando cambia la cantidad de asignados

  const reviewedCount = useMemo(
    () => Object.values(reviewedMap).filter(Boolean).length,
    [reviewedMap]
  );

  return (
    <div className="mx-auto w-full max-w-md px-4 py-6 md:max-w-2xl">
      <h1 className="mb-4 text-2xl font-semibold">Bienvenido, Revisor</h1>
      {/* Tarjetas superiores: ahora son botones a /reviewer/assigned */}
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

      {/* Lista breve de asignados (cada item navega y pasa selected) */}
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

        {loadingAssigned ? (
          <p className="text-slate-600">Cargando asignaciones…</p>
        ) : auth.isLoading ? (
          <p className="text-slate-600">Verificando usuario…</p>
        ) : !auth.user ? (
          <div className="rounded-md border-l-4 border-amber-400 bg-amber-50 p-3 text-amber-800">
            Debes iniciar sesión para ver los artículos asignados. 
            <button
              onClick={() => navigate({ to: '/login' })}
              className="ml-2 underline text-amber-700"
            >Iniciar sesión</button>
          </div>
        ) : !assigned || assigned.length === 0 ? (
          <p className="text-slate-600">Sin asignar aún…</p>
        ) : (
          <ul className="space-y-3">
            {assigned.map((a) => {
              const done = reviewedMap[a.id] ?? Boolean(a.reviewed);
              return (
                <li
                  key={a.id}
                  className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-black/5 hover:shadow-md cursor-pointer transition"
                  onClick={() =>
                    navigate({
                      to: "/reviewer/assigned",
                      search: { selected: a.id },
                    })
                  }
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate text-sm font-medium">{a.title}</span>
                    <span
                      className={
                        done
                          ? "rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-white"
                          : "rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-semibold text-white"
                      }
                    >
                      {done ? "Completo" : "Pendiente"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
