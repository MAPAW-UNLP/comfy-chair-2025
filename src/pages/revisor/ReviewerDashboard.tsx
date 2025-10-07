import { useEffect, useState } from "react";
import axios from "../../services/api";
import CountdownCard from "@/components/CountdownCard";
import { useCountdown } from "@/utils/useCountdown";

type Article = { id: number; title: string; status?: string };

export default function ReviewerDashboard() {
  const DEADLINE = import.meta.env.VITE_BIDDING_DEADLINE as string | undefined;
  const { isOver, display } = useCountdown(DEADLINE);

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  // 👉 Sólo cargo artículos CUANDO termina el bidding
  useEffect(() => {
    if (!isOver) return; // mientras esté en bidding, NO traigo nada
    setLoading(true);
    axios
      .get<Article[]>("/api/articles")
      .then((r) => setArticles(r.data ?? []))
      .finally(() => setLoading(false));
  }, [isOver]);

  return (
    <div className="mx-auto max-w-md px-4 py-3">
      <h1 className="mb-3 text-lg font-semibold">Bienvenido, Revisor</h1>

      {/* Resumen superior */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <CountdownCard time={display} label="De bidding" />
        <div className="rounded-xl bg-slate-100 px-4 py-3 text-center">
          {/* Este cuadro puede mostrar progreso real solo cuando termine el bidding */}
          <div className="text-xl font-semibold">{isOver ? "2/6" : "—"}</div>
          <div className="text-xs text-slate-500">{isOver ? "Revisiones completadas" : "Artículos pendientes"}</div>
        </div>
      </div>

      {/* Lista / Mensaje */}
      <h2 className="mb-2 text-base font-semibold">Tus Artículos</h2>

      {!isOver && (
        <div className="border-t border-slate-200 pt-3 text-sm text-slate-500">
          Pendiente de bidding…
        </div>
      )}

      {isOver && (
        <div className="space-y-3">
          {loading && <div className="text-sm text-slate-500">Cargando artículos…</div>}
          {!loading && articles.length === 0 && (
            <div className="text-sm text-slate-500">No hay artículos asignados todavía.</div>
          )}
          {!loading &&
            articles.map((a) => (
              <div key={a.id} className="rounded-xl border border-slate-200 p-3">
                <div className="text-sm font-medium">{a.title}</div>
                {/* si más adelante querés un badge de estado, va acá */}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
