import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export type Estado = "Aceptado" | "Recibido" | "Rechazado";

export interface ArticuloCardProps {
  titulo: string;
  conferencia: string;
  estado: Estado;
  finPeriodo?: Date;
}

const estadoColor: Record<Estado, string> = {
  Aceptado: "bg-lime-900",
  Recibido: "bg-slate-900",
  Rechazado: "bg-red-900",
};

function formatearTiempo(msRestante: number): string {
  const minutosTotales = Math.floor(msRestante / (1000 * 60));
  const horasTotales = Math.floor(msRestante / (1000 * 60 * 60));
  const diasTotales = Math.floor(msRestante / (1000 * 60 * 60 * 24));

  if (diasTotales >= 2) {
    return `${diasTotales} Días`;
  } else if (horasTotales >= 2) {
    return `${horasTotales} Horas`;
  } else {
    return `${minutosTotales} Minutos`;
  }
}

const ArticuloCard: React.FC<ArticuloCardProps> = ({ titulo, conferencia, estado, finPeriodo }) => {

  const [tiempoRestante, setTiempoRestante] = useState<string>("");

  useEffect(() => {
    if (estado !== "Recibido" || !finPeriodo) return;

    const actualizarTiempo = () => {
      const ahora = new Date().getTime();
      const limite = finPeriodo.getTime();
      const diferencia = limite - ahora;

      if (diferencia <= 0) {
        setTiempoRestante("Expirado");
      } else {
        setTiempoRestante(formatearTiempo(diferencia));
      }
    };

    actualizarTiempo();
    const interval = setInterval(actualizarTiempo, 1000 * 60); // actualiza cada minuto
    return () => clearInterval(interval);

  }, [estado, finPeriodo]);

  return (
    <div className="w-full max-w-md rounded-2xl shadow-md border p-4 bg-white flex flex-col gap-4">
      {/* Titulo y Conferencia */}
      <h2 className="text-lg font-bold italic text-slate-500 text-center">{titulo}</h2>
      <hr className="bg-slate-100"/>
      <p className="text-md text-slate-500 text-center">{conferencia}</p>
      
      {/* Contenedor de los dos botones */}
      <div className="flex gap-2 mt-auto">

        {/* Boton Estado */}
        <div className="flex-1 flex flex-col gap-1">
          <span className="text-sm text-slate-900 font-medium text-start">Estado</span>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className={`${estadoColor[estado]} text-white w-full`}>
                {estado}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Detalle del Estado</DialogTitle>
                <DialogDescription>
                  Su articulo se encuentra en estado <b>{estado}</b>.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        {/* Boton Modificar */}
        <div className="flex-1 flex flex-col gap-1">
          <span className="text-sm text-slate-900 font-medium text-start">Modificar</span>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={estado !== "Recibido"} className={`w-full ${estado === "Recibido" ? "bg-slate-900 text-white" : "bg-zinc-500 text-white"}`}>
                {estado === "Recibido" ? tiempoRestante + " Restantes" || "..." : "No Disponible"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modificar Articulo</DialogTitle>
                <DialogDescription>
                  <span>
                    Tienes tiempo de modificar tu articulo hasta el dia
                    <br/>
                    <b>{finPeriodo ? finPeriodo.toLocaleString("es-AR", {dateStyle: "full", timeStyle: "short",}): "No se estableció una fecha límite."}</b>
                  </span>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

      </div>
    </div>
  );
};

export default ArticuloCard;
