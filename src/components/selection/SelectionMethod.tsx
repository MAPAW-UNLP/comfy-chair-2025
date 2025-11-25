'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  executeCutoffSelection,
  executeScoreThresholdSelection,
  getSessionById,
  lockSelection,
} from '@/services/selectionServices';
import { Button } from '@/components/ui/button';
import { useNavigate, Link, useSearch } from '@tanstack/react-router';

interface SelectionSearchParams {
  method: 'cutoff' | 'threshold';
  value: string;
}

export const SelectionMethod = () => {
  const [loading, setLoading] = useState(false);

  const [sessionTitle, setSessionTitle] = useState<string>('Sesión');
  const [showResults, setShowResults] = useState(false);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  const [loadingSession, setLoadingSession] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);

  const [isSelectionLocked, setIsSelectionLocked] = useState(false);
  const [lockedMethod, setLockedMethod] = useState<'cutoff' | 'threshold' | null>(null);
  const [lockedValue, setLockedValue] = useState<string | null>(null);

  const navigate = useNavigate();
  const search = useSearch({
    from: '/_auth/chairs/selection/selection-method',
  }) as SelectionSearchParams;

  const selectedMethod = search.method;
  const urlValue = search.value; // Unifica cutoffScore y percentage - valor desde la URL

  const [localInputValue, setLocalInputValue] = useState(urlValue); // valor local del input

  // Actualiza la url (se usa en Enter o cambio de método)
  const updateSearchParams = (newMethod: 'cutoff' | 'threshold', newValue: string, shouldReplace: boolean = true) => {
    navigate({
      search: ((prevSearch: any) => ({
        ...prevSearch,
        method: newMethod,
        value: newValue,
      })) as any,
      replace: shouldReplace,
    });

    // Oculta los resultados si el valor o el método cambia
    if (newMethod !== selectedMethod || newValue !== urlValue || newValue === '' || newValue === null) {
      setShowResults(false);
    }
  };

  // Reejecuta al volver a la url de resultados o resetea la vista si el valor está vacío
  useEffect(() => {
    setLocalInputValue(urlValue);
    // Caso de la url con valor (ejecución/resultados)
    if (urlValue && urlValue !== '' && !loadingSession && !loading && !showResults && currentSessionId !== null) {
      if (!loading && !showResults) {
        executeSelection(selectedMethod, urlValue, currentSessionId);
      }
    }
    // Caso de la url vacía (selección de método y valor)
    else if (urlValue === '' && !isSelectionLocked) {
      setShowResults(false);
      setAcceptedCount(0);
      setRejectedCount(0);
    }
  }, [urlValue, selectedMethod, loadingSession, currentSessionId, showResults]);

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

      setCurrentSessionId(sessionId);

      try {
        const session = await getSessionById(sessionId);
        setSessionTitle(session.title || 'Sesión desconocida');

        setIsSelectionLocked(session.locked_selection);
        if (session.locked_selection) {
          let method: 'cutoff' | 'threshold' = 'cutoff';
          let value: string = '';

          if (session.type_selection === 'CutoffSelection') {
            method = 'cutoff';
            value = String(session.threshold_percentage || '0');
          } else if (session.type_selection === 'ScoreThresholdSelection') {
            method = 'threshold';
            value = String(session.improvement_threshold || '0');
          }
          setLockedValue(value);
          setLockedMethod(method);

          if (value !== '') {
            await executeSelection(method, value, sessionId);
          }
        }

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


  const executeSelection = async (method: 'cutoff' | 'threshold', value: string, sessionIdToUse: number | null) => {
    // Usa el método y valor de la URL
    setLoading(true);
    setShowResults(false);
    setAcceptedCount(0);
    setRejectedCount(0);

    if (sessionIdToUse === null) {
      toast.error('No hay sesión activa para ejecutar la selección.', {
        position: 'top-left',
      });
      setLoading(false);
      return;
    }

    const id = sessionIdToUse;

    try {
      let result: any = null;
      const numericValue = parseFloat(value);

      if (method === 'cutoff') {
        if (!value || isNaN(numericValue) || numericValue < 0 || numericValue > 100) {
          toast.error('Ingrese un porcentaje válido.', {
            position: 'top-left',
          });
          setLoading(false);
          updateSearchParams(method, '', true); // no queda guardado en el historial el valor inválido
          return;
        }
        result = await executeCutoffSelection(
          id,
          numericValue
        );
      }
      if (method === 'threshold') {
        if (!value || isNaN(numericValue) || numericValue < -3 || numericValue > 3) {
          toast.error('Ingresa un puntaje mínimo válido.', {
            position: 'top-left',
          });
          setLoading(false);
          updateSearchParams(method, '', true);
          return; // Frena la ejecución si falla
        }
        result = await executeScoreThresholdSelection(
          id,
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
      updateSearchParams(selectedMethod, localInputValue, false); // actualiza url con el valor local
    }
  };

  const handleLockSelection = async () => {
    const typeSelection: 'ScoreThresholdSelection' | 'CutoffSelection' =
      selectedMethod === 'cutoff'
        ? 'CutoffSelection'
        : 'ScoreThresholdSelection';

    if (currentSessionId === null) {
      toast.error('Error: No hay sesión activa.');
      return;
    }

    setLoading(true);
    try {
      await lockSelection(currentSessionId, typeSelection);

      setIsSelectionLocked(true);
      setLockedMethod(selectedMethod);
      setLockedValue(urlValue);

      toast.success('Selección guardada', {
        position: 'top-left',
      });
    } catch (error: any) {
      const backendMessage =
        error.response?.data?.detail || error.response?.data?.error || 'No se pudo guardar la selección';
      toast.error(backendMessage, {
        position: 'top-left',
      });
    } finally {
      setLoading(false);
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

      {!isSelectionLocked && showResults && (
        <div className="bg-white py-3 px-6 flex justify-center border-b border-gray-300 flex-shrink-0">
          <Button
            onClick={handleLockSelection}
            disabled={loading}
            className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? 'Guardando...' : 'Guardar Selección'}
          </Button>
        </div>
      )}

      <div
        className="px-6 py-2 flex flex-col items-start justify-between flex-shrink-0"
        style={{ backgroundColor: 'var(--background)' }}
      >

        <div className="h-[4.5rem] flex items-center mt-4">
          {isSelectionLocked ? (
            <div className="flex flex-col text-gray-700 leading-tight">
              {/* Título y método */}
              <span className="text-lg font-bold">
                Selección Definida: {lockedMethod === 'cutoff' ? 'Corte Fijo' : 'Mejor Puntaje'}
              </span>

              {/* Descripción del resultado de selección */}
              <span className="text-sm text-gray-700 mt-1">
                {lockedMethod === 'cutoff'
                  ? `Se aceptó el ${lockedValue}% de artículos (de mejor a peor puntaje)`
                  : `Se aceptaron todos los artículos que superaron el puntaje ${lockedValue}`
                }
              </span>
            </div>
          ) : (
            // Contenido cuando la selección no está bloqueada
            <span className="text-gray-500 text-md text-justify">
              {showResults
                ? 'Si estás conforme con la selección, podes guardarla'
                : 'Seleccione el criterio para obtener los listados de artículos aceptados y rechazados'
              }
            </span>
          )}
        </div>
      </div>


      {/* Barra de selección de filtros */}
      {!isSelectionLocked && (
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
                disabled={loading || isSelectionLocked}
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
                disabled={loading || isSelectionLocked}
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
              disabled={loading || isSelectionLocked}
            />
            {/* Info del input - se muestra si no hay resultados exitosos */}
            {!showResults && (
              <p className="text-gray-500 text-sm mt-1">
                Ingrese un valor para ver los artículos
              </p>
            )}
          </div>
        </div>
      )}

      {/* Contenido: puede ser explicación de vista o lista de resultados */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="text-center text-gray-500">
            Ejecutando selección...
          </div>
        ) : (showResults || isSelectionLocked) ? (
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
                className={`w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2 
                  ${acceptedCount === 0
                    ? 'bg-gray-200 border-gray-400 text-gray-500 disabled:pointer-events-none' // estilo gris deshabilitado
                    : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' // estilo habilitado
                  }`}
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
                className={`w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2 
                  ${rejectedCount === 0
                    ? 'bg-gray-200 border-gray-400 text-gray-500 disabled:pointer-events-none'
                    : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                  }`}
                disabled={rejectedCount === 0}
              >
                Ver Artículos Rechazados
              </Link>
            </div>
          </div>
        ) : (
          // Texto explicativo de la vista (este sería el estado inicial)
          !isSelectionLocked && (
            <div className="flex flex-col gap-6 max-w-lg mx-auto">
              {/* Bloque 1 - Corte Fijo (explicación) */}
              <div className="p-6 border rounded-lg shadow-md">
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
              <div className="p-8 border rounded-lg shadow-md">
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
          )
        )}
      </div>
    </div>
  );
};