import { useEffect, useMemo, useState } from "react";
import api from "@/services/api";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// --- Tipos base
type ArticleLite = {
  id: number;
  title: string;
  type?: "regular" | "poster";
  session_name?: string;
};

// Solo timestamps intermedios (desde la primer revisión hasta la última modif.)
type ReviewEditMeta = {
  edited_at: string; // ISO
};

// Solo la versión final conserva score + opinión
type LatestReview = {
  edited_at: string; // ISO
  score: number;     // -3..3
  opinion: string;
};

// Estructura final: enviado + última modif + versión final + timestamps previos
type ReviewWithHistory = {
  review_id: number;
  article: ArticleLite;
  sent_at: string;              // fecha/hora del envío
  last_modified_at?: string;    // fecha/hora de la última modificación (si hubo)
  latest: LatestReview;         // ÚNICA versión con score/opinion
  edits: ReviewEditMeta[];      // historial SOLO con fechas intermedias
};

type ReviewsResponse = ReviewWithHistory[];

// --- Helpers
const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleString() : "-";

const scoreBadgeVariant = (score: number) => {
  if (score >= 2) return "default";
  if (score === 1) return "secondary";
  if (score === 0) return "outline";
  if (score === -1) return "secondary";
  return "destructive";
};

// --- Servicio: intenta API real y usa mock si falla
async function fetchReviewsWithHistory(): Promise<ReviewsResponse> {
  // Intento A: endpoint consolidado
  try {
    const { data } = await api.get("/api/reviewer/reviews", {
      params: { include: "history_minimal" },
    });
    if (Array.isArray(data)) return data;
  } catch {
    /* noop */
  }

  // Intento B: endpoints alternativos (si existieran)
  try {
    const { data: items } = await api.get("/api/reviewer/reviews-min");
    if (Array.isArray(items)) return items;
  } catch {
    /* noop */
  }

  // Mock local (solo artículos ENVIADOS). La última versión guarda score/opinion.
  console.warn("⚠️ Backend no disponible, usando datos simulados mínimos.");
  const now = new Date();
  const daysAgo = (n: number) =>
    new Date(now.getTime() - n * 86400000).toISOString();

  const mock: ReviewsResponse = [
    {
      review_id: 1,
      article: {
        id: 101,
        title: "Optimizing Conference Scheduling with Django",
        type: "regular",
        session_name: "IA Aplicada",
      },
      sent_at: daysAgo(10),
      last_modified_at: daysAgo(2),
      edits: [{ edited_at: daysAgo(9) }, { edited_at: daysAgo(5) }],
      latest: {
        edited_at: daysAgo(2),
        score: 3,
        opinion:
          "Versión final: bien estructurado, mejoras de rendimiento resueltas.",
      },
    },
    {
      review_id: 2,
      article: {
        id: 102,
        title: "Machine Learning for Review Assignment",
        type: "poster",
        session_name: "Recomendación y ML",
      },
      sent_at: daysAgo(6),
      last_modified_at: undefined,
      edits: [],
      latest: {
        edited_at: daysAgo(6),
        score: 1,
        opinion: "Versión final enviada sin cambios posteriores.",
      },
    },
    {
      review_id: 3,
      article: {
        id: 103,
        title: "Graph-Based Similarity for Reviewer Matching",
        type: "regular",
        session_name: "Minería de Datos",
      },
      sent_at: daysAgo(9),
      last_modified_at: daysAgo(1),
      edits: [{ edited_at: daysAgo(8) }, { edited_at: daysAgo(4) }],
      latest: {
        edited_at: daysAgo(1),
        score: 2,
        opinion:
          "Versión final: ajuste de conclusiones y referencias actualizado.",
      },
    },
  ];

  return mock;
}

// --- UI principal
export default function ReviewHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");
  const [rows, setRows] = useState<ReviewsResponse>([]);

  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "regular" | "poster">(
    "all"
  );

  // Modal simple
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<ReviewWithHistory | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const data = await fetchReviewsWithHistory();
        const onlySent = (data ?? []).filter((r) => !!r.sent_at);
        onlySent.sort((a, b) => {
          const la = new Date(a.last_modified_at ?? a.sent_at).getTime();
          const lb = new Date(b.last_modified_at ?? b.sent_at).getTime();
          return lb - la;
        });
        setRows(onlySent);
      } catch {
        setErr("No se pudo obtener el historial.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchQ =
        !q ||
        r.article.title.toLowerCase().includes(q.toLowerCase()) ||
        (r.article.session_name ?? "")
          .toLowerCase()
          .includes(q.toLowerCase());
      const matchType =
        typeFilter === "all" || r.article.type === typeFilter;
      return matchQ && matchType;
    });
  }, [rows, q, typeFilter]);

  const openHistory = (r: ReviewWithHistory) => {
    setCurrent(r);
    setOpen(true);
  };

  const closeHistory = () => {
    setOpen(false);
    setCurrent(null);
  };

  return (
    <section className="container mx-auto p-4 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Historial de revisiones enviadas</h1>
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Buscar por título o sesión…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full sm:w-64"
          />
          <Select
            value={typeFilter}
            onValueChange={(v: any) => setTypeFilter(v)}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="poster">Poster</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="p-3">
        {loading ? (
          <div className="p-8 text-center">Cargando…</div>
        ) : err ? (
          <div className="p-6 text-center text-red-500">{err}</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No hay revisiones enviadas.
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map((r) => {
              const sentDate = r.sent_at;
              const lastMod = r.last_modified_at;
              return (
                <div
                  key={r.review_id}
                  className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{r.article.title}</span>
                      {r.article.type && (
                        <Badge variant="outline">{r.article.type}</Badge>
                      )}
                      {r.article.session_name && (
                        <Badge variant="secondary">
                          {r.article.session_name}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1 space-x-1">
                      <span>Enviado:</span>
                      <span>{formatDate(sentDate)}</span>
                      {lastMod && (
                        <>
                          <span>• Última modificación:</span>
                          <span>{formatDate(lastMod)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Acción: sin score en la lista; botón full width en mobile */}
                  <div className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto" onClick={() => openHistory(r)}>
                      Ver detalle
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Modal de detalle (con score de la versión final) */}
      <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-3xl px-6 sm:px-10">
    <DialogHeader>
      <DialogTitle>Detalle de revisión</DialogTitle>
      <DialogDescription>
        {current?.article?.title ?? "-"}
      </DialogDescription>
    </DialogHeader>

    {!current ? null : (
      <div className="space-y-6">
        <Card className="p-5 sm:p-6">
          <div className="text-sm font-medium mb-2">Fechas</div>
          <ul className="text-sm space-y-1">
            <li>
              <span className="text-muted-foreground">Envío: </span>
              {formatDate(current.sent_at)}
            </li>
            {current.edits.map((e, idx) => (
              <li key={idx}>
                <span className="text-muted-foreground">Edición {idx + 1}: </span>
                {formatDate(e.edited_at)}
              </li>
            ))}
            {current.last_modified_at && (
              <li>
                <span className="text-muted-foreground">Última modificación: </span>
                {formatDate(current.last_modified_at)}
              </li>
            )}
          </ul>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="text-sm font-medium mb-2">Versión final</div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant={scoreBadgeVariant(current.latest.score)}>
              Score {current.latest.score}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {formatDate(current.latest.edited_at)}
            </span>
          </div>
          <p className="text-sm leading-relaxed">{current.latest.opinion}</p>
        </Card>

        <div className="flex justify-end">
          <Button variant="secondary" onClick={closeHistory}>
            Cerrar
          </Button>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>

    </section>
  );
}
