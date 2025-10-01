/* Componente que representa una tarjeta para visualizar un articulo con su estado y opcione para modificarlo.
Recibe como props el titulo del articulo, la conferencia a la que fue enviado, su estado (Aceptado, Recibido, Rechazado) y la fecha limite para modificarlo.
Muestra dos botones: uno con el estado (de color segun el estado) y otro para modificar (solo habilitado si el estado es "Recibido").
El boton de modificar muestra el tiempo restante hasta el deadline si esta habilitado.
Al hacer click en los botones se abre un dialogo con mas informacion. */

// Importaciones
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Solo 3 tipos de estado posibles
export type Estado = "reception" | "bidding" | "assignment" | "review" | "selection" | "accepted" | "rejected";

// Lo que espera recibir el componente
export interface ArticuloCardProps {
  titulo: string;
  conferencia: string;
  estado: Estado;
  deadline: Date;
}

// Colores asociados a cada estado
const estadoColor: Record<Estado, string> = {
  accepted: "bg-lime-900",
  reception: "bg-slate-900",
  bidding: "bg-slate-900",
  assignment: "bg-slate-900",
  review: "bg-slate-900",
  selection: "bg-slate-900",
  rejected: "bg-red-900",
};

// Función para formatear el tiempo restante hasta el deadline (recibe en ms)
function formatearTiempo(msRestante: number): string {
  const minutosTotales = Math.floor(msRestante / (1000 * 60));
  const horasTotales = Math.floor(msRestante / (1000 * 60 * 60));
  const diasTotales = Math.floor(msRestante / (1000 * 60 * 60 * 24));

  if (diasTotales >= 2) {
    return `${diasTotales} Días`; // Si quedan 2 o más días, mostrar en días
  } else if (horasTotales >= 2) {
    return `${horasTotales} Horas`; // Si quedan menos de 2 días pero 2 o más horas, mostrar en horas
  } else {
    return `${minutosTotales} Minutos`; // Si quedan menos de 2 horas, mostrar en minutos
  }
}

const ArticuloCard: React.FC<ArticuloCardProps> = ({ titulo, conferencia, estado, deadline }) => {

  // Guarda un string con el tiempo restante para mostrar en el boton
  const [tiempoRestante, setTiempoRestante] = useState<string>("");

  // Efecto para actualizar el tiempo restante cada minuto si el estado es "Recibido"
  useEffect(() => {
    if (estado !== "reception") return;

    const actualizarTiempo = () => { 
      const ahora = new Date().getTime();
      const limite = deadline.getTime();
      const diferencia = limite - ahora;

      if (diferencia <= 0) {
        setTiempoRestante("Expirado");
      } else {
        setTiempoRestante(formatearTiempo(diferencia));
      }
    };

    actualizarTiempo();
    const interval = setInterval(actualizarTiempo, 1000 * 60 * 5); // actualiza cada 5 minutos
    return () => clearInterval(interval);

  }, [estado, deadline]);

  // Renderizado del componente
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
              <Button variant="outline" disabled={estado !== "reception"} className={`w-full ${estado === "reception" ? "bg-slate-900 text-white" : "bg-zinc-500 text-white"}`}>
                {estado === "reception" ? tiempoRestante + " Restantes" || "..." : "No Disponible"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modificar Articulo</DialogTitle>
                <DialogDescription>
                  <span>
                    Tienes tiempo de modificar tu articulo hasta el dia
                    <br/>
                    <b>{deadline.toLocaleString("es-AR", {dateStyle: "full", timeStyle: "short"})}</b>
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
