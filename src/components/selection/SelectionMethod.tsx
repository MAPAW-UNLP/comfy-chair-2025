'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  executeCutoffSelection,
  executeScoreThresholdSelection,
  getSessionById,
} from '@/services/selectionServices';
import { Button } from '@/components/ui/button';
import { useNavigate, Link, useSearch } from '@tanstack/react-router';

interface SelectionSearchParams {
  method: 'cutoff' | 'threshold';
  value: string;
}

export const SelectionMethod = () => {
  const [sessionTitle, setSessionTitle] = useState<string>('Sesión');
  const [loading, setLoading] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);

  const navigate = useNavigate();
  const search = useSearch({
    from: '/_auth/chairs/selection/selection-method',
  }) as SelectionSearchParams;

  const selectedMethod = search.method;
  const urlValue = search.value; // Unifica cutoffScore y percentage - valor desde la URL

  const [localInputValue, setLocalInputValue] = useState(urlValue); // valor local del input

  // Actualiza la url (se usa en Enter o cambio de método)
  const updateSearchParams = (newMethod: 'cutoff' | 'threshold', newValue: string) => {
    navigate({
      search: ((prevSearch: any) => ({
        ...prevSearch,
        method: newMethod,
        value: newValue,
      })) as any,
      replace: true,
    });

    // Oculta los resultados si el valor o el método cambia
    if (newMethod !== selectedMethod || newValue !== urlValue) {
      setShowResults(false);
    }
  };

  // Reejecuta al volver para atrás
  useEffect(() => {
    if (urlValue && urlValue !== '' && !loadingSession && !loading && !showResults) {
      executeSelection(selectedMethod, urlValue);
    }
  }, [urlValue, selectedMethod, loadingSession]);


  // Sincroniza estado local con la url
  useEffect(() => {
    setLocalInputValue(urlValue);
  }, [urlValue]);


  // Carga la sesión seleccionada desde localStorage
  useEffect(() => {
    const loadSessionData = async () => {
      const sessionIdString = localStorage.getItem("selectedSession");
      const sessionId = sessionIdString ? parseInt(sessionIdString) : NaN;

      if (sessionId <= 0 || isNaN(sessionId)) {
        setLoadingSession(false);
        toast.error('No hay sesión seleccionada en localStorage.', {
          position: 'top-left',
        });
        return;
      }

      // Guarda el id obtenido para usarlo en otras funciones
      setCurrentSessionId(sessionId);

      // Carga el título de la sesión
      try {
        const session = await getSessionById(sessionId);
        setSessionTitle(session.title || 'Sesión desconocida');
      } catch (error) {
        console.error('Error fetching session:', error);
        setSessionTitle('Sesión desconocida');
        toast.error('No se pudo cargar la sesión.', {
          position: 'top-left',
        });
      } finally {
        setLoadingSession(false);
      }
    };
    loadSessionData();
  }, []);

  const executeSelection = async (method: 'cutoff' | 'threshold', value: string) => {
    // Usa el método y valor de la URL
    setLoading(true);
    setShowResults(false);
    setAcceptedCount(0);
    setRejectedCount(0);

    if (currentSessionId === null) {
      toast.error('No hay sesión activa para ejecutar la selección.', {
        position: 'top-left',
      });
      setLoading(false);
      return;
    }

    try {
      let result: any = null;
      const numericValue = parseFloat(value);

      if (method === 'cutoff') {
        if (!value || isNaN(numericValue) || numericValue < 0 || numericValue > 100) {
          toast.error('Ingrese un porcentaje válido.', {
            position: 'top-left',
          });
          setLoading(false);
          return;
        }
        result = await executeCutoffSelection(
          currentSessionId,
          numericValue
        );
      }

      if (method === 'threshold') {
        if (!value || isNaN(numericValue) || numericValue < -3 || numericValue > 3) {
          toast.error('Ingresa un puntaje mínimo válido.', {
            position: 'top-left',
          });
          setLoading(false);
          return; // Frena la ejecución si falla
        }
        result = await executeScoreThresholdSelection(
          currentSessionId,
          numericValue
        );
      }

      // Muestra los resultados sólo si la ejecución fue exitosa
      setShowResults(true);

      // Procesa los resultados
      const safeResult = result && typeof result === 'object' ? result : {};
      setAcceptedCount(safeResult.accepted_count ?? 0);
      setRejectedCount(safeResult.rejected_count ?? 0);

    } catch (error: any) {
      const backendMessage =
        error.response?.data?.detail || error.response?.data?.error || null;

      if (backendMessage) {
        toast.error(backendMessage, {
          position: 'top-left',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      updateSearchParams(selectedMethod, localInputValue); // actualiza url con el valor local
      executeSelection(selectedMethod, localInputValue); // ejecuta la selección con el valor local
    }
  };

  if (loadingSession) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center text-gray-500">Cargando sesión...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Titulo de la sesion */}
      <div
        className="text-white py-4 px-6 flex items-center flex-shrink-0 relative"
        style={{ backgroundColor: '#555353ff' }}
      >
        <h1 className="text-xl font-semibold mx-auto">{sessionTitle}</h1>
      </div>

      <div
        className="px-6 py-2 flex flex-col items-start justify-between flex-shrink-0"
        style={{ backgroundColor: 'var(--background)' }}
      >
        {showResults ? (
          // Texto a mostrar después de enter
          <div className="h-[4.5rem] flex items-center">
            <span className="text-gray-900 text-lg font-bold">

            </span>
          </div>
        ) : (
          // Texto a mostrar antes de ver los resultados (estado inicial - info sobre la vista en sí)
          <p className="text-gray-500 text-justify">
            Seleccione el criterio para obtener las listas de artículos aceptados y rechazados
          </p>
        )}
      </div>

      {/* Barra de selección de filtros */}
      <div className="text-white py-2 px-6 flex items-center justify-start flex-shrink-0">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="flex w-full items-stretch overflow-hidden shadow-sm">
            {/* Botón 1 - Corte Fijo */}
            <Button
              className={`flex-1 rounded-none ${selectedMethod === 'cutoff'
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-white text-black hover:bg-gray-100 border-r border-gray-300'
                }`}
              variant={selectedMethod === 'cutoff' ? 'default' : 'outline'}
              onClick={() => {
                setLocalInputValue(''); // limpia input visual
                updateSearchParams('cutoff', ''); // actualiza url y método
              }}
              disabled={loading}
            >
              Corte Fijo
            </Button>

            {/* Botón 2 - Mejor Puntaje */}
            <Button
              className={`flex-1 rounded-none ${selectedMethod === 'threshold'
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-white text-black hover:bg-gray-100'
                }`}
              variant={selectedMethod === 'threshold' ? 'default' : 'outline'}
              onClick={() => {
                setLocalInputValue('');
                updateSearchParams('threshold', '');
              }}
              disabled={loading}
            >
              Mejor Puntaje
            </Button>
          </div>

          <input
            type="number"
            value={localInputValue}
            onChange={(e) => { setLocalInputValue(e.target.value); }}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedMethod === 'threshold'
                ? 'Puntaje Mínimo'
                : 'Porcentaje (%)'
            }
            className="px-3 py-2 rounded-none w-full text-black text-center no-spinner bg-white"
            disabled={loading}
          />
          {/* Info del input - se muestra si no hay resultados exitosos */}
          {!showResults && (
            <p className="text-gray-500 text-sm mt-1">
              Ingrese un valor para ver los totales
            </p>
          )}
        </div>
      </div>

      {/* Contenido: puede ser explicación de vista o lista de resultados */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="text-center text-gray-500">
            Ejecutando selección...
          </div>
        ) : showResults ? (
          // Bloques de Resultados: se muestran despues de presionar enter y si la ejecución fue exitosa
          <div className="flex flex-col gap-6 max-w-lg mx-auto">
            {/* Cantidad total de artículos revisados */}
            <div className="p-4 border rounded-lg shadow-md bg-white text-center">
              <h3 className="text-xl font-semibold mb-0 text-gray-600">
                Totales: {acceptedCount + rejectedCount} artículos revisados
              </h3>
            </div>

            {/* Bloque Aceptados */}
            <div className="p-4 border rounded-lg shadow-md bg-white">
              <h3 className="text-xl font-semibold mb-2 text-green-700">
                Aceptados: {acceptedCount}
              </h3>
              <Link
                to="/chairs/selection/reviewed-article-list"
                search={{ status: 'accepted' }}
                className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                disabled={acceptedCount === 0}
              >
                Ver Artículos Aceptados
              </Link>
            </div>

            {/* Bloque Rechazados */}
            <div className="p-4 border rounded-lg shadow-md bg-white">
              <h3 className="text-xl font-semibold mb-2 text-red-700">
                Rechazados: {rejectedCount}
              </h3>
              <Link
                to="/chairs/selection/reviewed-article-list"
                search={{ status: 'rejected' }}
                className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                disabled={rejectedCount === 0}
              >
                Ver Artículos Rechazados
              </Link>
            </div>
          </div>
        ) : (
          // Texto explicativo de la vista (este sería el estado inicial)
          <div className="flex flex-col gap-6 max-w-lg mx-auto">
            {/* Bloque 1 - Corte Fijo (explicación) */}
            <div className="p-4 border rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                Corte Fijo (Porcentaje)
              </h3>
              <p className="text-gray-500 text-justify">
                Acepta el porcentaje de envíos ingresado (los mejores primero)
              </p>
              <span className="block mt-2 font-bold text-gray-600">
                <ul className="text-gray-600 list-disc list-inside space-y-1">
                  <li>
                    Valores: de 0% a 100%
                  </li>
                </ul>
              </span>
            </div>

            {/* Bloque 2 - Mejor Puntaje (explicación) */}
            <div className="p-4 border rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                Mejor Puntaje (Umbral)
              </h3>
              <p className="text-gray-500 text-justify">
                Acepta artículos cuyo puntaje superen al valor ingresado
              </p>
              <span className="block mt-2 font-bold text-gray-600">
                <ul className="text-gray-600 list-disc list-inside space-y-1">
                  <li>
                    Valores: de -3 a 3
                  </li>
                </ul>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
