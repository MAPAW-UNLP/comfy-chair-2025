import { useEffect, useMemo, useState } from 'react';
import { fetchArticulos, type Articulo } from '@/services/articulosServices';
import { getBidsByReviewer } from '@/services/bidding.service';
import { useCountdown } from '@/utils/useCountdown';
import { fetchAssignedArticles, type AssignedArticle } from '@/services/assignments.service';

const REVIEWER_ID = 1; // TODO: tomar del auth real
const DEADLINE = import.meta.env.VITE_BIDDING_DEADLINE as string | undefined;

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function SoftCard(props: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl bg-slate-100/70 px-5 py-4 shadow-sm ring-1 ring-black/5 ${
        props.className ?? ''
      }`}
    >
      {props.children}
    </div>
  );
}

export default function Inicio() {
  // Estado pre-deadline (bidding)
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [bids, setBids] = useState<{ article: number; choice?: string }[]>([]);
  const [err, setErr] = useState<string | null>(null);

  // Estado post-deadline (asignaciones)
  const [assigned, setAssigned] = useState<AssignedArticle[] | null>(null);
  const [loadingAssigned, setLoadingAssigned] = useState(false);

  const c = useCountdown(DEADLINE);

  // Datos de bidding
  useEffect(() => {
    (async () => {
      try {
        const [arts, userBids] = await Promise.all([
          fetchArticulos(),
          getBidsByReviewer(REVIEWER_ID),
        ]);
        setArticulos(arts);
        setBids(userBids);
      } catch {
        setErr('No se pudieron cargar los datos.');
      }
    })();
  }, []);

  // Cuando termina el bidding, cargamos las asignaciones
  useEffect(() => {
    if (!c.isOver) return;
    setLoadingAssigned(true);
    fetchAssignedArticles(REVIEWER_ID)
      .then((rows) => setAssigned(rows))
      .catch(() => setAssigned([]))
      .finally(() => setLoadingAssigned(false));
  }, [c.isOver]);

  // Cálculo de métricas pre-deadline
  const total = articulos.length;
  const completados = useMemo(
    () => bids.filter((b) => !!(b.choice && String(b.choice).trim())).length,
    [bids]
  );

  // Contador: DD:HH:MM
  const dhm = `${pad(c.days)}:${pad(c.hours)}:${pad(c.minutes)}`;

  // ----------------------------- RENDER -----------------------------
  return (
    <div className="mx-auto w-full max-w-md px-4 py-6 md:max-w-2xl">
      <h1 className="mb-4 text-2xl font-semibold">Bienvenido, Revisor</h1>

      {!c.isOver ? (
        // -------- VISTA PRE-DEADLINE --------
        <>
          <div className="grid grid-cols-2 gap-4">
            {/* Contador */}
            <SoftCard>
              <div className="flex h-full flex-col items-center justify-center">
                <div className="text-3xl font-semibold tracking-tight">{dhm}</div>
                 <div className="mt-1 text-[11px] text-slate-400 tracking-wide"> Días <span className="mx-1 text-slate-300">|</span> Horas <span className="mx-1 text-slate-300">|</span> Minutos
                </div>
                <div className="mt-1 text-sm text-slate-600">Para finalizar</div>
              </div>
            </SoftCard>

            {/* Artículos pendientes */}
            <SoftCard>
              <div className="flex h-full flex-col items-center justify-center">
                <div className="text-3xl font-semibold tracking-tight">
                  {completados}/{total}
                </div>
                <div className="mt-1 text-sm text-slate-600">Completados</div>
              </div>
            </SoftCard>
          </div>

          <section className="mt-8">
            <h2 className="mb-2 text-lg font-semibold">Tus Artículos</h2>
            <hr className="mb-4 border-slate-200" />
            {err && <p className="text-sm text-red-600">{err}</p>}
            <p className="text-slate-600">Pendiente de bidding…</p>
          </section>
        </>
      ) : (
        // -------- VISTA POST-DEADLINE --------
        <>
          <div className="grid grid-cols-2 gap-4">
            {/* Artículos asignados */}
            <SoftCard>
              <div className="flex h-full flex-col items-center justify-center">
                <div className="text-4xl font-semibold leading-none">
                  {assigned ? assigned.length : 0}
                </div>
                <div className="mt-1 text-xs text-slate-600">Artículos asignados</div>
              </div>
            </SoftCard>

            {/* Revisiones completadas o estado de cierre */}
            <SoftCard>
              <div className="flex h-full flex-col items-center justify-center">
                {assigned && assigned.length > 0 ? (
                  <>
                    <div className="text-2xl font-semibold leading-none">
                      {assigned.filter((a) => a.reviewed).length}/{assigned.length}
                    </div>
                    <div className="mt-1 text-xs text-slate-600">
                      Revisiones completadas
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-semibold leading-none">
                      Bidding
                    </div>
                    <div className="mt-1 text-xs text-slate-600">
                      Finalizado
                    </div>
                  </>
                )}
              </div>
            </SoftCard>
          </div>

          <section className="mt-8">
            <h2 className="mb-2 text-lg font-semibold">Tus Artículos</h2>
            <hr className="mb-4 border-slate-200" />
            {loadingAssigned ? (
              <p className="text-slate-600">Cargando asignaciones…</p>
            ) : !assigned || assigned.length === 0 ? (
              <p className="text-slate-600">Sin asignar aún…</p>
            ) : (
              <ul className="space-y-3">
                {assigned.map((a) => {
                  const done = !!a.reviewed;
                  return (
                    <li
                      key={a.id}
                      className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-black/5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate text-sm font-medium">{a.title}</span>
                        <span
                          className={
                            done
                              ? 'rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-white'
                              : 'rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-semibold text-white'
                          }
                        >
                          {done ? 'Completo' : 'Pendiente'}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
