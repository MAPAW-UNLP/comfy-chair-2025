import React, { useEffect, useState } from "react";
import { fetchArticulos, type Articulo } from "@/services/articulosServices";
import { useCountdown } from "@/utils/useCountdown";

const Inicio: React.FC = () => {
  // 🕒 Fecha límite desde .env
  const DEADLINE = import.meta.env.VITE_BIDDING_DEADLINE as string | undefined;
  const { isOver, display, color } = useCountdown(DEADLINE);

  // 🔍 Debug en consola
  console.log("DEADLINE:", DEADLINE);
  console.log("isOver:", isOver, "| display:", display);

  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ⚙️ Solo cargamos artículos cuando termina el bidding
  useEffect(() => {
    if (!isOver) return;
    setLoading(true);
    fetchArticulos()
      .then((data) => setArticulos(data ?? []))
      .catch(() => setError("No se pudieron cargar los artículos."))
      .finally(() => setLoading(false));
  }, [isOver]);

  const completados = articulos.filter((a) => a.estado === "Completo").length;

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">{error}</div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Bienvenido, Revisor</h2>

      {/* Panel superior con countdown y progreso */}
      <div className="flex gap-4 mb-6">
        {/* 🕒 Card de countdown */}
        <div className="flex flex-col items-center justify-center bg-gray-100 rounded-xl p-4 w-1/2">
          <span className={`text-3xl font-bold ${color}`}>
            {isOver ? "00:00:00" : display}
          </span>
          <span className="text-sm text-gray-600">De Bidding</span>
        </div>

        {/* 📊 Card de progreso */}
        <div className="flex flex-col items-center justify-center bg-gray-100 rounded-xl p-4 w-1/2">
          {isOver ? (
            <>
              <span className="text-3xl font-bold">
                {completados}/{articulos.length}
              </span>
              <span className="text-sm text-gray-600">
                Revisiones completadas
              </span>
            </>
          ) : (
            <>
              <span className="text-4xl font-bold">—</span>
              <span className="text-sm text-gray-600">Artículos pendientes</span>
            </>
          )}
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Tus Artículos</h3>

      {/* 🔒 Mientras NO termine el bidding → mensaje bloqueante */}
      {!isOver && (
        <div className="border-t border-gray-200 pt-3 text-sm text-gray-600">
          Pendiente de bidding…
        </div>
      )}

      {/* ✅ Solo cuando terminó el bidding → mostramos lista */}
      {isOver && (
        <>
          {loading && (
            <div className="text-sm text-gray-600">Cargando artículos…</div>
          )}

          {!loading && articulos.length === 0 && (
            <div className="text-sm text-gray-600">
              No hay artículos asignados todavía.
            </div>
          )}

          {!loading && articulos.length > 0 && (
            <ul className="space-y-3 mt-2">
              {articulos.map((a) => (
                <li
                  key={a.id}
                  className="flex justify-between items-center bg-white shadow rounded-lg p-3"
                >
                  <span>{a.titulo}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      a.estado === "Completo"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {a.estado}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default Inicio;
