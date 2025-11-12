// src/pages/reviewer/ReviewHistory.tsx
import { useEffect, useMemo, useState } from "react";
import api from '@/services/api';

// --- shadcn/ui (ajusta imports según tu setup)
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
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

// --- Tipos base
type ArticleLite = {
  id: number;
  title: string;
  type?: "regular" | "poster";
  session_name?: string;
};

type ReviewVersion = {
  id: number | string;
  edited_at: string; // ISO
  editor_id?: number;
  score: number; // -3..3
  opinion: string;
};

type ReviewWithHistory = {
  review_id: number;
  article: ArticleLite;
  versions: ReviewVersion[]; // ordenadas asc por fecha
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

// Diff naive por líneas (suficiente para opiniones de texto)
function diffLines(a: string, b: string) {
  const aLines = a.split(/\r?\n/);
  const bLines = b.split(/\r?\n/);
  const max = Math.max(aLines.length, bLines.length);
  const rows: Array<{ a?: string; b?: string; status: "equal" | "added" | "removed" | "changed" }> =
    [];
  for (let i = 0; i < max; i++) {
    const la = aLines[i] ?? "";
    const lb = bLines[i] ?? "";
    if (la === lb) rows.push({ a: la, b: lb, status: "equal" });
    else if (la && !lb) rows.push({ a: la, status: "removed" });
    else if (!la && lb) rows.push({ b: lb, status: "added" });
    else rows.push({ a: la, b: lb, status: "changed" });
  }
  return rows;
}

// --- Servicio (solo front): intenta dos variantes de API y convierte respuesta
async function fetchReviewsWithHistory(): Promise<ReviewsResponse> {
  // Variante A (ideal):
  // GET /api/reviewer/reviews -> [{review_id, article, versions:[...]}]
  try {
    const { data } = await api.get("/api/reviewer/reviews", {
      params: { include: "history" },
    });
    if (Array.isArray(data)) return data;
  } catch {
    /* noop */
  }

  // Variante B (fallback): 1) listar artículos asignados 2) para cada uno traer review y su history
  try {
    // GET /api/reviewer/assigned (ajusta si tu endpoint es otro)
    const { data: assigned } = await api.get("/api/reviewer/assigned");
    const items = await Promise.all(
      (assigned ?? []).map(async (row: any) => {
        const article: ArticleLite = {
          id: row?.article?.id ?? row?.id,
          title: row?.article?.title ?? row?.title ?? "Artículo",
          type: row?.article?.type ?? row?.type,
          session_name: row?.article?.session_name ?? row?.session_name,
        };
        // GET /api/reviews/{articleId}
        const reviewRes = await api.get(`/api/reviews/${article.id}`);
        const reviewId = reviewRes?.data?.id ?? reviewRes?.data?.review_id;
        // GET /api/reviews/{reviewId}/history
        const histRes = await api.get(`/api/reviews/${reviewId}/history`);
        const versions: ReviewVersion[] = (histRes?.data ?? []).sort(
          (a: ReviewVersion, b: ReviewVersion) =>
            new Date(a.edited_at).getTime() - new Date(b.edited_at).getTime()
        );
        return { review_id: reviewId, article, versions };
      })
    );
    return items;
  } catch {
    // Variante C (sin backend aún): retornar array vacío
    return [];
  }
}

// --- UI principal
export default function ReviewHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");
  const [rows, setRows] = useState<ReviewsResponse>([]);

  // filtros
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "regular" | "poster">(
    "all"
  );
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // modal
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<ReviewWithHistory | null>(null);

  // selección de versiones para diff
  const [leftId, setLeftId] = useState<string>("");
  const [rightId, setRightId] = useState<string>("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const data = await fetchReviewsWithHistory();
        setRows(data);
      } catch (e: any) {
        setErr("No se pudo obtener el historial. Verificá tu API.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const df = dateFrom ? new Date(dateFrom).getTime() : null;
    const dt = dateTo ? new Date(dateTo).getTime() : null;
    return rows.filter((r) => {
      const matchQ =
        !q ||
        r.article.title.toLowerCase().includes(q.toLowerCase()) ||
        (r.article.session_name ?? "")
          .toLowerCase()
          .includes(q.toLowerCase());
      const matchType =
        typeFilter === "all" || r.article.type === typeFilter;

      const lastEdit =
        r.versions.length > 0
          ? new Date(r.versions[r.versions.length - 1].edited_at).getTime()
          : 0;

      const matchFrom = df === null || lastEdit >= df;
      const matchTo = dt === null || lastEdit <= dt;

      return matchQ && matchType && matchFrom && matchTo;
    });
  }, [rows, q, typeFilter, dateFrom, dateTo]);

  const openHistory = (r: ReviewWithHistory) => {
    setCurrent(r);
    setLeftId(r.versions.at(-2)?.id?.toString() ?? "");
    setRightId(r.versions.at(-1)?.id?.toString() ?? "");
    setOpen(true);
  };

  const closeHistory = () => {
    setOpen(false);
    setCurrent(null);
    setLeftId("");
    setRightId("");
  };

  const left = current?.versions.find((v) => v.id.toString() === leftId);
  const right = current?.versions.find((v) => v.id.toString() === rightId);

  return (
    <section className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Historial de revisiones</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Buscar por título o sesión…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-64"
          />
          <Select
            value={typeFilter}
            onValueChange={(v: any) => setTypeFilter(v)}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="poster">Poster</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Rango de fechas</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <div className="text-sm font-medium">Última edición</div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setDateFrom("");
                      setDateTo("");
                    }}
                  >
                    Limpiar
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Card className="p-3">
        {loading ? (
          <div className="p-8 text-center">Cargando…</div>
        ) : err ? (
          <div className="p-6 text-center text-red-500">{err}</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No hay revisiones para mostrar.
          </div>
        ) : (
          <div className="divide-y">
            {filtered
              .sort((a, b) => {
                const la =
                  a.versions.length > 0
                    ? new Date(a.versions.at(-1)!.edited_at).getTime()
                    : 0;
                const lb =
                  b.versions.length > 0
                    ? new Date(b.versions.at(-1)!.edited_at).getTime()
                    : 0;
                return lb - la; // más reciente primero
              })
              .map((r) => {
                const last = r.versions.at(-1);
                return (
                  <div
                    key={r.review_id}
                    className="flex items-center justify-between p-3 gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">
                          {r.article.title}
                        </span>
                        {r.article.type && (
                          <Badge variant="outline">{r.article.type}</Badge>
                        )}
                        {r.article.session_name && (
                          <Badge variant="secondary">
                            {r.article.session_name}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {r.versions.length} versión
                        {r.versions.length !== 1 ? "es" : ""} • Última edición:{" "}
                        {formatDate(last?.edited_at)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={scoreBadgeVariant(last?.score ?? 0)}>
                        Score: {last?.score ?? "-"}
                      </Badge>
                      <Button onClick={() => openHistory(r)}>
                        Ver historial
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </Card>

      {/* Modal de historial + diff */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Historial de revisión</DialogTitle>
            <DialogDescription>
              {current?.article?.title ?? "-"}
            </DialogDescription>
          </DialogHeader>

          {!current ? null : (
            <div className="space-y-4">
              {/* Timeline simple */}
              <Card className="p-3">
                <div className="text-sm font-medium mb-2">Versiones</div>
                <ol className="relative border-s pl-4 space-y-3">
                  {current.versions.map((v) => (
                    <li key={v.id} className="ms-2">
                      <div className="absolute w-3 h-3 rounded-full bg-foreground -start-1.5 mt-1.5" />
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={scoreBadgeVariant(v.score)}>
                          Score {v.score}
                        </Badge>
                        <span className="text-sm">
                          {formatDate(v.edited_at)}
                        </span>
                        {v.editor_id && (
                          <span className="text-xs text-muted-foreground">
                            por #{v.editor_id}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {v.opinion}
                      </div>
                    </li>
                  ))}
                </ol>
              </Card>

              {/* Selector de versiones para diff */}
              <Card className="p-3 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-sm mb-1">Versión izquierda</div>
                    <Select
                      value={leftId}
                      onValueChange={(v) => setLeftId(v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccioná una versión" />
                      </SelectTrigger>
                      <SelectContent>
                        {current.versions.map((v) => (
                          <SelectItem key={v.id} value={v.id.toString()}>
                            {formatDate(v.edited_at)} — score {v.score}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm mb-1">Versión derecha</div>
                    <Select
                      value={rightId}
                      onValueChange={(v) => setRightId(v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccioná una versión" />
                      </SelectTrigger>
                      <SelectContent>
                        {current.versions.map((v) => (
                          <SelectItem key={v.id} value={v.id.toString()}>
                            {formatDate(v.edited_at)} — score {v.score}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Resultado diff */}
                <div className="grid md:grid-cols-3 gap-3">
                  <Card className="p-3 md:col-span-1">
                    <div className="text-sm font-medium mb-2">
                      Metadatos
                    </div>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-muted-foreground">Izq.: </span>
                        {left ? formatDate(left.edited_at) : "-"}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Der.: </span>
                        {right ? formatDate(right.edited_at) : "-"}
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Score izq.:
                        </span>{" "}
                        {left?.score ?? "-"}
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Score der.:
                        </span>{" "}
                        {right?.score ?? "-"}
                      </div>
                    </div>
                  </Card>
                  <Card className="p-3 md:col-span-2 overflow-auto max-h-80">
                    <div className="text-sm font-medium mb-2">
                      Diff de opinión (línea por línea)
                    </div>
                    {!left || !right ? (
                      <div className="text-sm text-muted-foreground">
                        Elegí dos versiones para comparar.
                      </div>
                    ) : (
                      <div className="text-sm font-mono whitespace-pre-wrap leading-6">
                        {diffLines(left.opinion, right.opinion).map(
                          (row, idx) => {
                            const base =
                              "block rounded px-2 py-0.5 -mx-2";
                            const style =
                              row.status === "equal"
                                ? ""
                                : row.status === "added"
                                ? "bg-green-100 dark:bg-green-900/30"
                                : row.status === "removed"
                                ? "bg-red-100 dark:bg-red-900/30"
                                : "bg-yellow-100 dark:bg-yellow-900/30";
                            return (
                              <div key={idx} className={`${base} ${style}`}>
                                {row.status === "equal" && row.a}
                                {row.status === "added" && `+ ${row.b}`}
                                {row.status === "removed" && `- ${row.a}`}
                                {row.status === "changed" &&
                                  `~ ${row.a}  →  ${row.b}`}
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}
                  </Card>
                </div>
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
