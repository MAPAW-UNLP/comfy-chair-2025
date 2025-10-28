import { useState } from 'react';
import { executeCutoffSelection, executeScoreThresholdSelection } from '@/services/selectionService';
import { SelectionResultsList } from './SelectionResultsList';
import { Button } from '@/components/ui/button';
import { ChevronDown, ArrowLeft } from 'lucide-react';

interface SelectionPageProps {
  sessionId: number;
  sessionTitle: string;
  onBack: () => void;
}

export const SelectionPage = ({ sessionId, sessionTitle, onBack }: SelectionPageProps) => {
  const [selectedMethod, setSelectedMethod] = useState<'cutoff' | 'threshold'>('cutoff');
  const [cutoffScore, setCutoffScore] = useState('');
  const [percentage, setPercentage] = useState('');
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const executeSelection = async () => {
    // Valida que se haya ingresado un valor
    if (selectedMethod === 'cutoff' && (percentage === '' || percentage === null)) {
      alert('Por favor ingresa un porcentaje');
      return;
    }
    if (selectedMethod === 'threshold' && (cutoffScore === '' || cutoffScore === null)) {
      alert('Por favor ingresa un puntaje mínimo');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (selectedMethod === 'cutoff') {
        result = await executeCutoffSelection(sessionId, parseFloat(percentage));
      } else {
        result = await executeScoreThresholdSelection(sessionId, parseFloat(cutoffScore));
      }

      // Si el backend devuelve un mensaje sin artículos
      if (result.accepted_articles && result.rejected_articles) {
        const combined = [
          ...result.accepted_articles.map((a: any) => ({ ...a, status: 'accepted' })),
          ...result.rejected_articles.map((a: any) => ({ ...a, status: 'rejected' }))
        ];
        setArticles(combined);
      } else {
        // No hay artículos
        setArticles([]);
      }

      setShowResults(true);
    } catch (error: any) {
      console.error('Error ejecutando selección:', error);

      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error;

        // Si es un mensaje sobre que no hay artículos, muestra lista vacía
        if (errorMessage?.includes('artículos') || errorMessage?.includes('puntajes')) {
          setArticles([]);
          setShowResults(true);
        } else {
          // Otro tipo de error 400
          alert('Error: ' + errorMessage);
        }
      } else if (error.response?.status === 404) {
        alert('Error: Sesión no encontrada');
      } else {
        alert('Error al ejecutar la selección. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getMethodLabel = () => {
    return selectedMethod === 'cutoff' ? 'Corte Fijo' : 'Mejores';
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="text-white py-3 px-6 flex items-center gap-3 flex-shrink-0" style={{ backgroundColor: 'var(--ring)' }}>
        <button
          onClick={onBack}
          className="text-white hover:bg-white/10 p-2 rounded-md transition-colors"
          title="Volver"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold truncate">{sessionTitle}</h1>
      </div>

      <div className="text-white py-2 px-6 flex items-center justify-between flex-shrink-0" style={{ backgroundColor: 'var(--muted-foreground)' }}>
        <div className="flex items-center gap-3">
          {/* Dropdown de métodos */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 bg-white text-black border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-full shadow-sm"
            >
              {getMethodLabel()}
              <ChevronDown className="w-4 h-4" />
            </Button>

            {menuOpen && (
              <div className="absolute left-0 mt-2 w-44 bg-white text-gray-900 border rounded-lg shadow-lg z-50">
                <button
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${selectedMethod === 'cutoff' ? 'bg-gray-100 font-medium' : ''} rounded-t-lg`}
                  onClick={() => {
                    setSelectedMethod('cutoff');
                    setMenuOpen(false);
                  }}
                >
                  Corte Fijo
                </button>
                <button
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${selectedMethod === 'threshold' ? 'bg-gray-100 font-medium' : ''} rounded-b-lg`}
                  onClick={() => {
                    setSelectedMethod('threshold');
                    setMenuOpen(false);
                  }}
                >
                  Mejores
                </button>
              </div>
            )}
          </div>

          {/* Input para parámetros */}
          {selectedMethod === 'threshold' ? (
            <input
              type="number"
              value={cutoffScore}
              onChange={(e) => setCutoffScore(e.target.value)}
              placeholder="Puntaje mínimo"
              step="1"
              min="-3"
              max="3"
              className="px-3 py-2 border rounded-md w-32 text-black"
            />
          ) : (
            <input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              placeholder="Porcentaje"
              min="0"
              max="100"
              className="px-3 py-2 border rounded-md w-32 text-black"
            />
          )}

          <Button
            onClick={executeSelection}
            disabled={loading}
            className="hover:opacity-90 text-white px-6 py-2 rounded-md font-medium transition-colors shadow-sm"
            style={{
              backgroundColor: "var(--primary)",
            }}
          >
            {loading ? 'Procesando...' : 'Aplicar'}
          </Button>

        </div>
        <h2 className="text-lg font-semibold">
          {showResults ? 'Resultados de la Selección' : 'Elegir selección'}
        </h2>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-hidden" style={{ backgroundColor: 'var(--sidebar-border)' }}>
        {showResults ? (
          articles.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500 text-lg">
              No se encontraron artículos con los criterios seleccionados
            </div>
          ) : (
            <SelectionResultsList items={articles} />
          )
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-lg">
          </div>
        )}
      </div>
    </div>
  );
}