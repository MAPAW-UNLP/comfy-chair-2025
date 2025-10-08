import { useEffect, useState } from 'react';
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

type InteresLocal = 'interesado' | 'quizas' | 'no';

const REVIEWER_ID = 1; // TODO: tomar del auth real
const DEADLINE = import.meta.env.VITE_BIDDING_DEADLINE as string | undefined;

function formatDMY(iso?: string) {
  if (!iso) return 'xx-xx-20xx';
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function mapChoiceToLocal(v?: string): InteresLocal | undefined {
  const s = (v ?? '').toLowerCase();
  if (s.includes('quiz')) return 'quizas';
  if (s.includes('no')) return 'no';
  if (s.includes('interes')) return 'interesado';
  return undefined;
}
function mapLocalToChoice(v: InteresLocal): 'Interesado' | 'Quizás' | 'No Interesado' {
  if (v === 'interesado') return 'Interesado';
  if (v === 'quizas') return 'Quizás';
  return 'No Interesado';
}

export default function BiddingPage() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [bids, setBids] = useState<BiddingPreference[]>([]);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [seleccion, setSeleccion] = useState<Record<number, InteresLocal | undefined>>({});
  const [saving, setSaving] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const countdown = useCountdown(DEADLINE); 
  // Carga inicial: artículos + bids del revisor (persistidos)
  useEffect(() => {
    (async () => {
      try {
        const [arts, userBids] = await Promise.all([
          fetchArticulos(),
          getBidsByReviewer(REVIEWER_ID),
        ]);
        setArticulos(arts);
        setBids(userBids);

        // Si existe un bid para ese artículo, marcamos la selección; si no, queda sin seleccionar
        const initSel: Record<number, InteresLocal | undefined> = {};
        userBids.forEach((b) => {
          const v = mapChoiceToLocal(b.choice);
          if (v) initSel[b.article] = v;
        });
        setSeleccion(initSel);
      } catch {
        setError('No se pudieron cargar los artículos.');
      }
    })();
  }, []);

  const toggleExpand = (id: number) =>
    setExpanded((s) => ({ ...s, [id]: !s[id] }));

  // Guardar elección (PUT si existe / POST si no) y refrescar estado local
  const handleChoose = async (articleId: number, value: InteresLocal) => {
    if (seleccion[articleId] === value) return; // nada que hacer

    setSaving((s) => ({ ...s, [articleId]: true }));
    try {
      await saveBid({
        reviewer: REVIEWER_ID,
        article: articleId,
        value: mapLocalToChoice(value),
      });
      // refresco desde API para mantener consistencia y evitar duplicados
      const fresh = await getBidsByReviewer(REVIEWER_ID);
      setBids(fresh);
      setSeleccion((s) => ({ ...s, [articleId]: value }));
    } catch (e) {
      console.error('Error al guardar bid:', e);
    } finally {
      setSaving((s) => ({ ...s, [articleId]: false }));
    }
  };

  if (error) return <p className="p-4 text-red-600">{error}</p>;

  if (countdown.isOver) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold text-slate-800 mb-4">Bidding finalizado</h1>
        <p className="text-slate-600">
          No hay bidding disponible en este momento.
        </p>
        <Button
          className="mt-8 w-full py-6 text-base"
          onClick={() => navigate({ to: '/' })}
        >
          Volver al inicio
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-6">
      <h1 className="text-2xl font-semibold">Bidding</h1>
      <p className="mt-1 text-sm text-slate-600">Fecha Límite: {formatDMY(DEADLINE)}</p>

      <div className="mt-6 space-y-6">
        {articulos.map((a) => {
          const isOpen = !!expanded[a.id];
          const interes = seleccion[a.id];

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

              {/* Botones mutuamente excluyentes; sin selección por defecto si no hay bid */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!!saving[a.id]}
                  aria-pressed={interes === 'interesado'}
                  className={cn(
                    'min-w-[100px] justify-center',
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
                    'min-w-[100px] justify-center',
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
                    'min-w-[100px] justify-center',
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

      <div className="sticky bottom-4 mt-8">
        <Button className="w-full py-6 text-base hover:bg-gray-600" onClick={() => navigate({ to: '/' })}>
          Salir
        </Button>
      </div>
    </div>
  );
}
