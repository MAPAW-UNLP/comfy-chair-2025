import { useEffect, useState, useMemo } from 'react';
import { fetchArticulos, type Articulo } from '@/services/articulosServices';
import {
  getBidsByReviewer,
  saveBid,
  type BiddingPreference,
} from '@/services/bidding.service';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from '@tanstack/react-router';
import { useCountdown } from '@/utils/useCountdown';

type InteresLocal = 'interesado' | 'quizas' | 'no' | 'no_select';

const REVIEWER_ID = 1; // TODO: auth real
const DEADLINE = import.meta.env.VITE_BIDDING_DEADLINE as string | undefined;

function formatDMY(iso?: string) {
  if (!iso) return 'xx-xx-20xx';
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

// Backend -> UI
function mapChoiceToLocal(v?: string): InteresLocal {
  const s = (v ?? '').toLowerCase();
  if (s.includes('quiz')) return 'quizas';
  if (s === 'no_select' || s.includes('no_select')) return 'no_select';
  if (s.includes('no')) return 'no';
  if (s.includes('interes')) return 'interesado';
  return 'no_select'; // default inicial
}

// UI -> Backend
function mapLocalToChoice(v: InteresLocal): 'Interesado' | 'Quizás' | 'No Interesado' | 'No_select' {
  if (v === 'interesado') return 'Interesado';
  if (v === 'quizas') return 'Quizás';
  if (v === 'no') return 'No Interesado';
  return 'No_select';
}

export default function BiddingPage() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [bids, setBids] = useState<BiddingPreference[]>([]);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [seleccion, setSeleccion] = useState<Record<number, InteresLocal>>({});
  const [saving, setSaving] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  // 🔢 paginación
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const navigate = useNavigate();

  // ⏱ cuenta regresiva
  const c = useCountdown(DEADLINE);
  const isOverByMinute = c.isOver || (c.days === 0 && c.hours === 0 && c.minutes === 0);

  // Carga inicial
  useEffect(() => {
    (async () => {
      try {
        const [arts, userBids] = await Promise.all([
          fetchArticulos(),
          getBidsByReviewer(REVIEWER_ID),
        ]);
        setArticulos(arts);
        setBids(userBids);

        // Inicializar TODAS las selecciones en no_select
        const initSel: Record<number, InteresLocal> = {};
        arts.forEach(a => { initSel[a.id] = 'no_select'; });

        // Sobrescribir con lo que venga de la API
        userBids.forEach((b) => {
          initSel[b.article] = mapChoiceToLocal(b.choice);
        });

        setSeleccion(initSel);
      } catch {
        setError('No se pudieron cargar los artículos.');
      }
    })();
  }, []);

  // Si cambia la cantidad de artículos o el pageSize, volver a página 1 si la actual queda fuera de rango
  useEffect(() => {
    setPage(1);
  }, [articulos.length, pageSize]);

  // Si se cerró, opcional: colapsar
  useEffect(() => {
    if (isOverByMinute) setExpanded({});
  }, [isOverByMinute]);

  const totalPages = Math.max(1, Math.ceil(articulos.length / pageSize));
  const pageStart = (page - 1) * pageSize;
  const pageEnd = pageStart + pageSize;

  const currentItems = useMemo(
    () => articulos.slice(pageStart, pageEnd),
    [articulos, pageStart, pageEnd]
  );

  const goToPage = (p: number) => {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
    // scroll suave al top del listado
    requestAnimationFrame(() => {
      const el = document.getElementById('bidding-list-top');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const toggleExpand = (id: number) =>
    setExpanded((s) => ({ ...s, [id]: !s[id] }));

  const handleChoose = async (articleId: number, value: InteresLocal) => {
    if (isOverByMinute) return;
    const current = seleccion[articleId] ?? 'no_select';

    // toggle: misma opción -> No_select
    const nextLocal: InteresLocal = current === value ? 'no_select' : value;
    const backendChoice = mapLocalToChoice(nextLocal);

    // update optimista para evitar “titilar”
    setSeleccion((s) => (s[articleId] === nextLocal ? s : { ...s, [articleId]: nextLocal }));
    setSaving((s) => ({ ...s, [articleId]: true }));
    try {
      await saveBid({
        reviewer: REVIEWER_ID,
        article: articleId,
        value: backendChoice,
      });
    } catch (e) {
      console.error('Error al guardar bid:', e);
      // rollback
      setSeleccion((s) => ({ ...s, [articleId]: current }));
    } finally {
      setSaving((s) => ({ ...s, [articleId]: false }));
    }
  };

  if (error) return <p className="p-4 text-red-600">{error}</p>;

  if (isOverByMinute) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-20 text-center">
        <h1 className="mb-4 text-2xl font-semibold text-slate-800">Bidding finalizado</h1>
        <p className="text-slate-600">No hay bidding disponible en este momento.</p>
        <Button className="mt-8 w-full py-6 text-base" onClick={() => navigate({ to: '/' })}>
          Volver al inicio
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w/full max-w-xl px-4 py-6">
      <h1 className="text-2xl font-semibold">Bidding</h1>
      <p className="mt-1 text-sm text-slate-600">Fecha Límite: {formatDMY(DEADLINE)}</p>

      {/* Controles de paginado (top) */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Resumen (oculto en mobile) */}
        <div className="hidden sm:block text-sm text-slate-600">
          Mostrando <span className="font-medium">{articulos.length === 0 ? 0 : pageStart + 1}</span>–
          <span className="font-medium">{Math.min(pageEnd, articulos.length)}</span> de{' '}
          <span className="font-medium">{articulos.length}</span>
        </div>

        <div className="flex w-full items-center justify-between gap-2 sm:w-auto">
          {/* Selector por página (oculto en mobile) */}
          <div className="hidden sm:flex items-center gap-2">
            <label className="text-sm text-slate-600">Por página</label>
            <select
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={8}>8</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>

          {/* Navegación: en mobile ocupan todo el ancho */}
          <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:flex sm:items-center">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
            >
              Anterior
            </Button>

            {/* Números: ocultos en mobile; con scroll horizontal en tablets/escritorio chico */}
            <div className="hidden sm:flex overflow-x-auto no-scrollbar max-w-[280px] gap-1 px-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                // opcional: limitar render a ventana alrededor de la página actual para performance
                if (Math.abs(p - page) > 3 && p !== 1 && p !== totalPages) return null;
                return (
                  <Button
                    key={p}
                    variant={p === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => goToPage(p)}
                  >
                    {p}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>


      <div id="bidding-list-top" className="mt-6 space-y-6">
        {currentItems.map((a) => {
          const isOpen = !!expanded[a.id];
          const interes = seleccion[a.id] ?? 'no_select';

          return (
            <article key={a.id} className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-black/5">
              <header className="flex items-start justify-between gap-3">
                <h2 className="text-base font-semibold leading-6">{a.titulo}</h2>
                <button
                  type="button"
                  className="rounded p-1 hover:bg-gray-100"
                  aria-label={isOpen ? 'Ocultar descripción' : 'Mostrar descripción'}
                  onClick={() => toggleExpand(a.id)}
                >
                  {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
              </header>

              <hr className="my-3 border-gray-200" />

              {isOpen && (
                <p className="mb-4 text-sm leading-6 text-gray-700">
                  {a.descripcion?.trim() || 'Descripción no disponible por el momento.'}
                </p>
              )}

              {/* Botones mutuamente excluyentes; toggle → No_select */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!!saving[a.id]}
                  aria-pressed={interes === 'interesado'}
                  className={cn(
                    'min-w-[100px] justify-center transition-colors',
                    interes === 'interesado' && 'border-transparent bg-slate-900 text-white hover:bg-gray-400'
                  )}
                  onClick={() => handleChoose(a.id, 'interesado')}
                >
                  Interesado
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!!saving[a.id]}
                  aria-pressed={interes === 'quizas'}
                  className={cn(
                    'min-w-[100px] justify-center transition-colors',
                    interes === 'quizas' && 'border-transparent bg-slate-900 text-white hover:bg-gray-400'
                  )}
                  onClick={() => handleChoose(a.id, 'quizas')}
                >
                  Quizás
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!!saving[a.id]}
                  aria-pressed={interes === 'no'}
                  className={cn(
                    'min-w-[100px] justify-center transition-colors',
                    interes === 'no' && 'border-transparent bg-slate-900 text-white hover:bg-gray-400'
                  )}
                  onClick={() => handleChoose(a.id, 'no')}
                >
                  No interesado
                </Button>
              </div>
            </article>
          );
        })}
      </div>
      {/* Paginado inferior (no flotante) */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="text-sm text-slate-600">
          Página <span className="font-medium">{page}</span> de <span className="font-medium">{totalPages}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => goToPage(page - 1)} disabled={page <= 1}>
            Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={() => goToPage(page + 1)} disabled={page >= totalPages}>
            Siguiente
          </Button>
        </div>
      </div>

      <div className="sticky bottom-4 mt-8">
        <Button className="w-full py-6 text-base hover:bg-gray-600" onClick={() => navigate({ to: '/' })}>
          Salir
        </Button>
      </div>

    </div>
  );
}
