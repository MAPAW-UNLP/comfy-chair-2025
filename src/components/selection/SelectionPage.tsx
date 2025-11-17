'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  executeCutoffSelection,
  executeScoreThresholdSelection,
  getSessionById,
} from '@/services/selectionServices';
import { Button } from '@/components/ui/button';

interface SelectionPageProps {
  sessionId: number;
}

export const SelectionPage = ({ sessionId }: SelectionPageProps) => {
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

  useEffect(() => {
    const fetchSession = async () => {
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

    if (sessionId) fetchSession();
  }, [sessionId]);

  const executeSelection = async (methodOverride?: 'cutoff' | 'threshold') => {
    // Usa el override (si viene del boton) o el estado actual
    const method = methodOverride || selectedMethod;

    setLoading(true);
    setShowResults(false);
    setAcceptedCount(0);
    setRejectedCount(0);

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
          sessionId,
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
          sessionId,
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
      {/* Header */}

      {/* Titulo de la sesion */}
      <div
        className="text-white py-1 px-6 flex items-center justify-start gap-3 flex-shrink-0"
        style={{ backgroundColor: 'var(--muted-foreground)' }} //"var(--ring)"
      >
        <h1 className="text-lg truncate">{sessionTitle}</h1>
      </div>

      <div
        className="px-6 py-2 flex flex-col items-start justify-between flex-shrink-0"
        style={{ backgroundColor: 'var(--background)' }}
      >
        <div
          className="px-6 py-2 flex flex-col items-start justify-between flex-shrink-0"
          style={{ backgroundColor: 'var(--background)' }}
        >
          {showResults ? (
            // Texto a mostrar después de enter (info sobre los valores permitidos)
            <div className="text-sm text-gray-600 font-medium">
              <span className="font-bold text-gray-1500">
                VALORES PERMITIDOS
              </span>
              <p className="mt-2">
                Corte Fijo:{' '}
                <span className="font-bold text-gray-900">0% a 100%</span>
              </p>
              <p className="mt-2">
                Mejor Puntaje:{' '}
                <span className="font-bold text-gray-900">-3 a 3</span>
              </p>
            </div>
          ) : (
            // Texto a mostrar antes de ver los resultados (estado inicial - info sobre la vista en sí)
            <p className="text-gray-500 text-justify">
              Para ver la lista de artículos aceptados y rechazados, seleccione
              un método para filtrarlos e ingrese un valor
            </p>
          )}
        </div>
      </div>

      {/* Barra de selección de filtros */}
      <div
        className="text-white py-2 px-6 flex items-center justify-start flex-shrink-0"
        style={{ backgroundColor: 'var(--ring)' }}
      >
        <div className="flex w-full items-center justify-start gap-3 flex-wrap">
          <div className="flex flex-col gap-0 rounded-md overflow-hidden shadow-sm border border-gray-300">
            {/* Botón 1 - Corte Fijo */}
            <Button
              variant={selectedMethod === 'cutoff' ? 'default' : 'outline'}
              onClick={() => {
                setSelectedMethod('cutoff');
                setCutoffScore(''); // Limpia el input del método opuesto (threshold)
                setShowResults(false); // Oculta resultados cuando cambia de metodo

                // Si el input de corte fijo no estaba vacío ejecuta la selección
                if (!isCutoffEmpty) executeSelection('cutoff');
              }}
              disabled={loading}
              className={
                selectedMethod === 'cutoff'
                  ? 'bg-primary text-white hover:bg-primary/90 rounded-none'
                  : 'bg-white text-black hover:bg-gray-100 rounded-none'
              }
            >
              Corte Fijo
            </Button>

            {/* Botón 2 - Mejor Puntaje */}
            <Button
              variant={selectedMethod === 'threshold' ? 'default' : 'outline'}
              onClick={() => {
                setSelectedMethod('threshold');
                setPercentage(''); // Limpia el input del método opuesto (cutoff)
                setShowResults(false); // Oculta resultados cuando cambia de metodo

                // Si el input de mejor puntaje no estaba vacío ejecuta la selección
                if (!isThresholdEmpty) executeSelection('threshold');
              }}
              disabled={loading}
              className={
                selectedMethod === 'threshold'
                  ? 'bg-primary text-white hover:bg-primary/90 rounded-none border-t border-gray-300'
                  : 'bg-white text-black hover:bg-gray-100 rounded-none border-t border-gray-300'
              }
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
            className="px-3 py-2 border rounded-md w-40 sm:w-48 text-black text-center no-spinner" // poner py-6 para que tenga la altrua de los filtros
          />
        </div>
      </div>
      {/* Final de barra de selección de filtros */}

      {/* Contenido: puede ser explicación de vista o lista de resultados */}
      <div
        className="flex-1 overflow-auto p-6"
        style={{ backgroundColor: 'var(--sidebar-border)' }}
      >
        {loading ? (
          <div className="text-center text-gray-500">
            Ejecutando selección...
          </div>
        ) : showResults ? (
          // Bloques de Resultados: se muestran despues de presionar enter
          <div className="flex flex-col gap-6 max-w-lg mx-auto">
            {/* Cantidad total de artículos revisados */}
            <div className="p-4 border rounded-lg shadow-md bg-white text-center">
              <h3 className="text-xl font-semibold mb-0 text-gray-800">
                Totales: {acceptedCount + rejectedCount} artículos revisados
              </h3>
            </div>

            {/* Bloque Aceptados */}
            <div className="p-4 border rounded-lg shadow-md bg-white">
              <h3 className="text-xl font-semibold mb-2 text-green-700">
                Aceptados: {acceptedCount}
              </h3>
              <Button variant="outline" className="w-full">
                Ver Artículos
              </Button>
            </div>

            {/* Bloque Rechazados */}
            <div className="p-4 border rounded-lg shadow-md bg-white">
              <h3 className="text-xl font-semibold mb-2 text-red-700">
                Rechazados: {rejectedCount}
              </h3>
              <Button variant="outline" className="w-full">
                Ver Artículos
              </Button>
            </div>
          </div>
        ) : (
          // Texto explicativo de la vista (este sería el estado inicial)
          <div className="text-center max-w-sm p-4 mx-auto">
            <p className="mt-4 text-gray-500 text-justify">
              <span className="font-semibold text-gray-700"> Corte Fijo: </span>
              acepta el porcentaje de envíos ingresado (los mejores primero).
            </p>

            <p className="mt-6 text-gray-500 text-justify">
              <span className="font-semibold text-gray-700">
                {' '}
                Mejor Puntaje:{' '}
              </span>
              acepta artículos cuyo puntaje superen al valor ingresado
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
