import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { fetchArticulos, type Articulo } from '@/services/articulosServices';
import { getBidsByReviewer } from '@/services/bidding.service';
import { useCountdown } from '@/utils/useCountdown';
import { fetchAssignedArticles, type AssignedArticle } from '@/services/assignments.service';
import { Button } from '@/components/ui/button';

const REVIEWER_ID = 1; // TODO: tomar del auth real
const DEADLINE = (import.meta.env.VITE_BIDDING_DEADLINE as string | undefined) ?? null;

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function SoftCard(props: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const base =
    'rounded-2xl bg-slate-100/70 px-5 py-4 shadow-sm ring-1 ring-black/5 transition';
  const interactive = props.onClick
    ? 'cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2'
    : '';

  if (props.onClick) {
    return (
      <button
        type="button"
        onClick={props.onClick}
        disabled={props.disabled}
        aria-label={props.ariaLabel}
        className={`${base} ${interactive} ${
          props.disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${props.className ?? ''}`}
      >
        {props.children}
      </button>
    );
  }

  return <div className={`${base} ${props.className ?? ''}`}>{props.children}</div>;
}

export default function Inicio() {
  const navigate = useNavigate();

  // Estado pre-deadline (bidding)
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [bids, setBids] = useState<{ article: number; choice?: string }[]>([]);
  const [err, setErr] = useState<string | null>(null);

  // Estado post-deadline (asignaciones)
  const [assigned, setAssigned] = useState<AssignedArticle[] | null>(null);
  const [loadingAssigned, setLoadingAssigned] = useState(false);

  const c = useCountdown(DEADLINE || undefined);

  // ✅ Termina por MINUTO: al llegar a 00:00 pasa a post (sin mostrar 00:00:00)
  const isOverByMinute = c.isOver || (c.days === 0 && c.hours === 0 && c.minutes === 0);

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

  // Cuando termina el bidding por minuto, cargamos las asignaciones
  useEffect(() => {
    if (!isOverByMinute) return;
    setLoadingAssigned(true);
    fetchAssignedArticles(REVIEWER_ID)
      .then((rows) => setAssigned(rows))
      .catch(() => setAssigned([]))
      .finally(() => setLoadingAssigned(false));
  }, [isOverByMinute]);

  // Cálculo de métricas pre-deadline
  const total = articulos.length;
  const completados = useMemo(
    () => bids.filter((b) => !!(b.choice && String(b.choice).trim())).length,
    [bids]
  );

  // Contador (solo DD:HH:MM). Si llega a 00:00, ya no se muestra porque isOverByMinute=true
  const dhm = `${pad(c.days)}:${pad(c.hours)}:${pad(c.minutes)}`;

  return (
    <div className="mx-auto w-full max-w-md px-4 py-6 md:max-w-2xl">
      <h1 className="mb-4 text-2xl font-semibold">Bienvenido, Revisor</h1>

      {!isOverByMinute ? (
        // -------- VISTA PRE-DEADLINE --------
        <>
          <div className="grid grid-cols-2 gap-4">
            {/* Contador */}
            <SoftCard>
              <div className="flex h-full flex-col items-center justify-center">
                <div className="text-3xl font-semibold tracking-tight">{dhm}</div>
                <div className="mt-1 text-[11px] text-slate-400 tracking-wide">
                  Días <span className="mx-1 text-slate-300">|</span> Horas
                  <span className="mx-1 text-slate-300">|</span> Minutos
                </div>
                <div className="mt-1 text-sm text-slate-600">Para finalizar</div>
              </div>
            </SoftCard>

            {/* Bids completados → BOTÓN a /bidding */}
            <SoftCard
              onClick={() => navigate({ to: '/bidding' })}
              ariaLabel="Ir a la pantalla de bidding"
              className="focus:ring-offset-2"
            >
              <div className="flex h-full flex-col items-center justify-center">
                <div className="text-3xl font-semibold tracking-tight">
                  {completados}/{total}
                </div>
                <div className="mt-1 text-sm text-slate-600">Bids completados</div>
              </div>
            </SoftCard>
          </div>

          <section className="mt-8">
            <h2 className="mb-2 text-lg font-semibold">Tus Artículos</h2>
            <hr className="mb-4 border-slate-200" />
            {err && <p className="text-sm text-red-600">{err}</p>}
            <p className="text-slate-600">Bidding en proceso...</p>
            {err && <p className="text-sm text-red-600">{err}</p>}
            <Button
              className="mt-2 w-full py-6 text-base"
              onClick={() => navigate({ to: '/bidding' })}
            >
              Ir al Bidding
            </Button>
          </section>
        </>
      ) : (
        // -------- VISTA POST-DEADLINE --------
        <>
          <div className="grid grid-cols-2 gap-4">
            {/* 1) Bidding finalizado (reemplaza al card de asignados) */}
            <SoftCard>
              <div className="flex h-full flex-col items-center justify-center">
                <div className="text-2xl font-semibold leading-none">Bidding</div>
                <div className="mt-1 text-xs text-slate-600">Finalizado</div>
              </div>
            </SoftCard>

            {/* 2) Bids completados (como pre-deadline pero NO clickeable) */}
            <SoftCard className="opacity-70 pointer-events-none select-none">
              <div className="flex h-full flex-col items-center justify-center">
                <div className="text-3xl font-semibold tracking-tight">
                  {completados}/{total}
                </div>
                <div className="mt-1 text-sm text-slate-600">Bids completados</div>
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