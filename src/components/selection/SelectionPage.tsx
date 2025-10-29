"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { executeCutoffSelection, executeScoreThresholdSelection, getSessionById } from "@/services/selectionServices";
import { SelectionResultsList } from "./SelectionResultsList";
import { Button } from "@/components/ui/button";
import { ChevronDown, Check } from "lucide-react";

interface SelectionPageProps {
  sessionId: number;
}

export const SelectionPage = ({ sessionId }: SelectionPageProps) => {
  const [sessionTitle, setSessionTitle] = useState<string>("Sesión");
  const [selectedMethod, setSelectedMethod] = useState<"cutoff" | "threshold">("cutoff");
  const [cutoffScore, setCutoffScore] = useState("");
  const [percentage, setPercentage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);
  const [articles, setArticles] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getSessionById(sessionId);
        setSessionTitle(session.title || "Sesión desconocida");
      } catch (error) {
        console.error("Error fetching session:", error);
        setSessionTitle("Sesión desconocida");
        toast.error("No se pudo cargar la sesión.", {
          position: "top-left",
        });
      } finally {
        setLoadingSession(false);
      }
    };

    if (sessionId) fetchSession();
  }, [sessionId]);

  const executeSelection = async () => {
    if (selectedMethod === "cutoff" && !percentage) {
      toast.error("Por favor ingresa un porcentaje.", { position: "top-left" });
      return;
    }
    if (selectedMethod === "threshold" && !cutoffScore) {
      toast.error("Por favor ingresa un puntaje mínimo.", { position: "top-left" });
      return;
    }
    setLoading(true);
    setShowResults(true);
    try {
      let result: any = null;

      if (selectedMethod === "cutoff") {
        const parsed = parseFloat(percentage);
        if (isNaN(parsed)) {
          toast.error("Por favor ingresa un número válido para el porcentaje.", {
            position: "top-left",
          });
          return;
        }
        result = await executeCutoffSelection(sessionId, parsed);
      } else {
        result = await executeScoreThresholdSelection(sessionId, parseFloat(cutoffScore));
      }

      const safeResult = result && typeof result === 'object' ? result : {};
      const accepted = safeResult.accepted_articles ?? [];
      const rejected = safeResult.rejected_articles ?? [];

      // Si no hay articulos aceptados ni rechazados pone articles en []
      if (accepted.length === 0 && rejected.length === 0) {
        setArticles([]);
        return;
      }

      const combined = [
        ...accepted.map((a: any) => ({ ...a, status: "accepted" })),
        ...rejected.map((a: any) => ({ ...a, status: "rejected" })),
      ];

      setArticles(combined);

    } catch (error: any) {
      // console.error("Error ejecutando selección:", error);

      setArticles([]);
      setShowResults(true); // Fuerza la vista de resultados vacios en caso de error

      const backendMessage =
        error.response?.data?.detail ||
        error.response?.data?.error ||
        null;

      if (backendMessage) {
        toast.error(backendMessage, {
          position: "top-left",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getMethodLabel = () => (selectedMethod === "cutoff" ? "Corte Fijo" : "Mejores");

  if (loadingSession) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center text-gray-500">Cargando sesión...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}

      {/* Titulo de la sesion */}
      {/*
      <div
        className="text-white py-1 px-6 flex items-center gap-3 flex-shrink-0"
        style={{ backgroundColor: "var(--muted-foreground)" }}//"var(--ring)"
      >
        <h1 className="text-lg truncate">{sessionTitle}</h1>
      </div>
      */}

      <div
        className="text-white py-2 px-6 flex items-center justify-between flex-shrink-0"
        style={{ backgroundColor: "var(--ring)" }}
      >
        <div className="flex items-center gap-3 flex-wrap">
          {/* Dropdown de método */}
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
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${selectedMethod === "cutoff" ? "bg-gray-100 font-medium" : ""
                    } rounded-t-lg`}
                  onClick={() => {
                    setSelectedMethod("cutoff");
                    setMenuOpen(false);
                    setShowResults(false); // Oculta resultados cuando cambia de metodo
                    setArticles([]);      // Limpia lista de articulos
                  }}
                >
                  Corte Fijo
                </button>
                <button
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${selectedMethod === "threshold" ? "bg-gray-100 font-medium" : ""
                    } rounded-b-lg`}
                  onClick={() => {
                    setSelectedMethod("threshold");
                    setMenuOpen(false);
                    setShowResults(false); // Oculta resultados cuando cambia de metodo
                    setArticles([]);      // Limpia lista de articulos
                  }}
                >
                  Mejores
                </button>
              </div>
            )}
          </div>

          {selectedMethod === "threshold" ? (
            <input
              type="number"
              value={cutoffScore}
              onChange={(e) => setCutoffScore(e.target.value)}
              placeholder="Puntaje mínimo"
              step="1"
              min="-3"
              max="3"
              className="px-3 py-2 border rounded-md w-24 sm:w-32 text-black"
            />
          ) : (
            <input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              placeholder="Porcentaje"
              min="0"
              max="100"
              className="px-3 py-2 border rounded-md w-24 sm:w-32 text-black"
            />
          )}

          <Button
            onClick={executeSelection}
            disabled={loading}
            className="hover:opacity-90 text-white px-4 py-2 rounded-md transition-colors shadow-sm flex items-center justify-center"
            style={{ backgroundColor: "var(--primary)" }}
          >
            {loading ? (
              "Procesando..."
            ) : (
              <Check className="w-5 h-5" /> // icono tick
            )}
          </Button>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-hidden" style={{ backgroundColor: "var(--sidebar-border)" }}>
        {showResults ? (
          articles.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500 text-lg">
              No se encontraron artículos
            </div>
          ) : (
            <SelectionResultsList items={articles} />
          )
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-lg"></div>
        )}
      </div>
    </div>
  );
};