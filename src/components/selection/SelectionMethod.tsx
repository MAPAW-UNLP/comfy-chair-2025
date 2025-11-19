'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  executeCutoffSelection,
  executeScoreThresholdSelection,
  getSessionById,
} from '@/services/selectionServices';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export const SelectionMethod = () => {
  const navigate = useNavigate();
  const [sessionTitle, setSessionTitle] = useState<string>('Sesión');
  const [selectedMethod, setSelectedMethod] = useState<'cutoff' | 'threshold'>(
    'cutoff'
  );
  const [cutoffScore, setCutoffScore] = useState('');
  const [percentage, setPercentage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);

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

  const executeSelection = async (methodOverride?: 'cutoff' | 'threshold') => {
    // Usa el override (si viene del boton) o el estado actual
    const method = methodOverride || selectedMethod;

    setLoading(true);
    setShowResults(false);
    setAcceptedCount(0);
    setRejectedCount(0);

    // Revisa si existe un id antes de ejecutar
    if (currentSessionId === null) {
      toast.error('No hay sesión activa para ejecutar la selección.', {
        position: 'top-left',
      });
      setLoading(false);
      return;
    }

    try {
      let result: any = null;

      if (method === 'cutoff') {
        if (!percentage || isNaN(parseFloat(percentage))) {
          toast.error('Ingrese un porcentaje válido.', {
            position: 'top-left',
          });
          setLoading(false);
          return; // Frena la ejecución si falla
        }
        result = await executeCutoffSelection(
          currentSessionId, // usa el estado interno
          parseFloat(percentage)
        );
      }

      if (method === 'threshold') {
        if (!cutoffScore || isNaN(parseFloat(cutoffScore))) {
          toast.error('Ingresa un puntaje mínimo válido.', {
            position: 'top-left',
          });
          setLoading(false);
          return; // Frena la ejecución si falla
        }
        result = await executeScoreThresholdSelection(
          currentSessionId,
          parseFloat(cutoffScore)
        );
      }

      // Muestra los resultados sólo si la ejecución fue exitosa
      setShowResults(true);

      // Procesa los resultados
      const safeResult = result && typeof result === 'object' ? result : {};

      // Toma los contadores del back
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
      executeSelection();
    }
  };

  const goToReviewList = (status: 'accepted' | 'rejected') => {
    if (currentSessionId === null) return; // si el id no se cargó
    navigate({
      to: '/chairs/selection/reviewed-article-list',
      search: { status: status }, // parámetro de búsqueda
    });
  };

  if (loadingSession) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center text-gray-500">Cargando sesión...</div>
      </div>
    );
  }

  // Guarda de ejecución
  const isThresholdEmpty = !cutoffScore;
  const isCutoffEmpty = !percentage;

  const currentInputValue =
    selectedMethod === 'threshold' ? cutoffScore : percentage;

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
                setSelectedMethod('cutoff');
                setCutoffScore(''); // Limpia el input del método opuesto (threshold)
                setShowResults(false); // Oculta resultados cuando cambia de metodo

                // Si el input de corte fijo no estaba vacío ejecuta la selección
                if (!isCutoffEmpty) executeSelection('cutoff');
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
                setSelectedMethod('threshold');
                setPercentage(''); // Limpia el input del método opuesto (cutoff)
                setShowResults(false);

                // Si el input de mejor puntaje no estaba vacío ejecuta la selección
                if (!isThresholdEmpty) executeSelection('threshold');
              }}
              disabled={loading}
            >
              Mejor Puntaje
            </Button>
          </div>

          <input
            type="number"
            value={currentInputValue}
            onChange={(e) => {
              if (selectedMethod === 'threshold') {
                setCutoffScore(e.target.value);
              } else {
                setPercentage(e.target.value);
              }
            }}
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
              <Button
                variant="outline"
                className="w-full"
                // Deshabilita el boton si no hay articulos en la lista
                disabled={acceptedCount === 0}
                onClick={() => goToReviewList('accepted')}
              >
                Ver Artículos Aceptados
              </Button>
            </div>

            {/* Bloque Rechazados */}
            <div className="p-4 border rounded-lg shadow-md bg-white">
              <h3 className="text-xl font-semibold mb-2 text-red-700">
                Rechazados: {rejectedCount}
              </h3>
              <Button
                variant="outline"
                className="w-full"
                disabled={rejectedCount === 0}
                onClick={() => goToReviewList('rejected')}
              >
                Ver Artículos Rechazados
              </Button>
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
