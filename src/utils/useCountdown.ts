import { useEffect, useMemo, useState } from "react";

/**
 * Hook de cuenta regresiva (countdown) hacia una fecha límite.
 *
 * @param deadlineISO Fecha límite en formato ISO ("2025-12-31T23:59:59-03:00")
 *                    o segundos relativos ("+3600" → una hora desde ahora)
 *
 * Devuelve:
 *  - display: "HH:MM:SS"
 *  - isOver: boolean (true cuando llega a 0)
 *  - diff: milisegundos restantes
 *  - progress: porcentaje transcurrido (0–1)
 *  - color: "text-green-600" | "text-yellow-500" | "text-red-600"
 */
export function useCountdown(deadlineISO?: string) {
  // 🔹 Parseo robusto (ISO o relativo)
  const deadlineMs = useMemo(() => {
    if (!deadlineISO) return NaN;
    if (/^[+-]?\d+$/.test(deadlineISO.trim())) {
      const secs = parseInt(deadlineISO, 10);
      return Date.now() + secs * 1000;
    }
    const t = Date.parse(deadlineISO);
    return Number.isNaN(t) ? NaN : t;
  }, [deadlineISO]);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Number.isNaN(deadlineMs) ? 0 : Math.max(0, deadlineMs - now);
  const isOver = diff <= 999;

  // 🔹 Formateo HH:MM:SS
  const hours = String(Math.floor(diff / 1000 / 60 / 60)).padStart(2, "0");
  const minutes = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, "0");
  const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

  // 🔹 Progreso (0 a 1)
  const total =
    !Number.isNaN(deadlineMs) && deadlineISO
      ? Math.max(diff, deadlineMs - Date.now() + diff)
      : NaN;
  const progress = Number.isNaN(total) || total === 0 ? 1 : 1 - diff / total;

  // 🔹 Color reactivo según tiempo restante
  let color = "text-green-600"; // por defecto verde
  if (diff <= 10_000) color = "text-red-600"; // menos de 10 segundos → rojo
  else if (diff <= 60_000) color = "text-yellow-500"; // menos de 1 min → amarillo

  return {
    isOver,
    diff,
    display: `${hours}:${minutes}:${seconds}`,
    progress: Math.min(Math.max(progress, 0), 1),
    color,
  };
}
