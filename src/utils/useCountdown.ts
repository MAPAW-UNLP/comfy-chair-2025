import { useEffect, useMemo, useState } from 'react';

export type Countdown = {
  isOver: boolean;              // ya pasó la fecha
  msLeft: number;               // milisegundos restantes (>=0)
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  display: string;              // "Xd HH:MM:SS" o "HH:MM:SS" si days=0
};

/**
 * Calcula cuánto falta para deadline (ISO). Se actualiza cada 1s.
 * Si pasás "2025-11-30T23:59:59Z" se interpreta en UTC (recomendado).
 */
export function useCountdown(deadlineIso?: string): Countdown {
  const target = useMemo(() => {
    if (!deadlineIso) return NaN;
    const t = Date.parse(deadlineIso);
    return Number.isNaN(t) ? NaN : t;
  }, [deadlineIso]);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Number.isNaN(target) ? 0 : Math.max(0, target - now);

  const totalSec = Math.floor(diff / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  const pad = (n: number) => String(n).padStart(2, '0');
  const hms = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  const display = days > 0 ? `${days}d ${hms}` : hms;

  return {
    isOver: diff === 0,
    msLeft: diff,
    days,
    hours,
    minutes,
    seconds,
    display,
  };
}
