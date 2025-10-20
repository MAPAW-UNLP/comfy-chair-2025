/* Componente que representa una tarjeta para visualizar un articulo con su estado y opcioned para modificarlo*/

// Importaciones
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ClipboardEditIcon, EyeIcon } from "lucide-react";
import { useNavigate } from '@tanstack/react-router';
import type { Article } from "@/services/articleServices";
import ArticleDetail from "./ArticleDetail";


// Tipos de estado posibles
export type Estado = "reception" | "bidding" | "assignment" | "review" | "selection" | "accepted" | "rejected";

// Lo que espera recibir el componente
export interface ArticleCardProps {
  article: Article;
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

// Textos asociados a cada estado
const estadoTexto: Record<Estado, string> = {
  accepted: "Aceptado",
  reception: "Recibido",
  bidding: "Bidding",
  assignment: "Asignación",
  review: "Revisión",
  selection: "Selección",
  rejected: "Rechazado",
};

// Descripciones asociadas a cada estado
const estadoDescripcion: Record<Estado, string> = {
  accepted: "Su articulo ha sido aceptado para la conferencia. ¡Felicitaciones!",
  reception: "Su articulo ha sido recibido y está pendiente de revisión.",
  bidding: "Su articulo está en proceso de bidding.",
  assignment: "Su articulo está en proceso de asignación de revisores.",
  review: "Su articulo está siendo revisado por los revisores asignados.",
  selection: "Su articulo está en proceso de selección final.",
  rejected: "Lamentablemente, su articulo ha sido rechazado para la conferencia.",
};

// Convierte la deadline de una conferencia a un string con el tiempo restante
function formatearTiempo(msRestante: number): string {

  if (!Number.isFinite(msRestante) || msRestante <= 0) {
    return "invalido";
  }

  const minutosTotales = Math.floor(msRestante / (1000 * 60));
  const horasTotales = Math.floor(msRestante / (1000 * 60 * 60));
  const diasTotales = Math.floor(msRestante / (1000 * 60 * 60 * 24));

  if (horasTotales >= 48) {
    return `${diasTotales} ${diasTotales === 1 ? "Día Restante" : "Días Restantes"}`;
  } else if (horasTotales >= 1) {
    return `${horasTotales} ${horasTotales === 1 ? "Hora Restante" : "Horas Restantes"}`;
  } else {
    // Si falta menos de una hora → en minutos
    const minutos = Math.max(minutosTotales, 1);
    return `${minutos} ${minutos === 1 ? "Minuto Restante" : "Minutos Restantes"}`;
  }
}

//Cuerpo del Componente
const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {

  const navigate = useNavigate();
  const deadlineDate = article.session?.deadline ? new Date(article.session?.deadline) : null;
  const [tiempoRestante, setTiempoRestante] = useState<string>("");

  const navigateEditArticle = () => {
    navigate({ to: `/article/edit/${article.id}` });
  };

  // Efecto para actualizar el tiempo restante cada minuto si el estado es "Recibido"
  useEffect(() => {
    if (article.status !== "reception") return;

    const actualizarTiempo = () => { 
      const ahora = new Date().getTime();
      const limite = deadlineDate?.getTime();

      if (typeof limite !== "number") {
        setTiempoRestante("Sin fecha límite");
        return;
      }

      const diferencia = limite - ahora;

      if (diferencia <= 0) {
        setTiempoRestante("invalido");
      } else {
        setTiempoRestante(formatearTiempo(diferencia));
      }
    };

    actualizarTiempo();
    const interval = setInterval(actualizarTiempo, 1000 * 60 * 5); // actualiza cada 5 minutos
    return () => clearInterval(interval);

  }, [article.status, article.session?.deadline]);

  // Renderizado del componente
  return (
    <div className="w-full max-w-md rounded-2xl shadow-md border p-4 mb-2 bg-white flex flex-col gap-4">
      
      {/* Titulo, Sesion y Conferencia */}
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-lg font-bold italic text-slate-500 text-center">{article.title}</h2>
      </div>
      <hr className="bg-slate-100"/>
      <div className="flex flex-row">
        <div className="basis-3/4">
          <p className="text-md text-slate-500"><b>Sesion:</b> {article.session?.title}</p>
          <p className="text-md text-slate-500"><b>Conferencia:</b> {article.session?.conference?.title}</p>
        </div>
        <div className="flex flex-row basis-1/4 items-center">
          <ClipboardEditIcon onClick={navigateEditArticle} className={`basis-1/2 ${article.status !== "reception" || tiempoRestante === "invalido" ? 'invisible' : 'visible'}`}/>
          <Dialog>
            <DialogTrigger asChild>
              <EyeIcon className="basis-1/2"/>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Detalle del Articulo</DialogTitle>
                <DialogDescription>
                  <ArticleDetail article={article} />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Contenedor de los dos botones */}
      <div className="flex gap-2 mt-auto">

        {/* Boton Estado */}
        <div className="flex-1 flex flex-col gap-1">
          <span className="text-sm text-slate-900 font-medium text-start">Estado</span>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className={`${estadoColor[article.status] ?? "bg-slate-900"} text-white w-full`}>
                {estadoTexto[article.status] ?? "Desconocido"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Detalle del Estado</DialogTitle>
                <DialogDescription>
                  {estadoDescripcion[article.status] ?? "Ocurrió un error al obtener el estado del artículo."}
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
              <Button variant="outline" disabled={article.status !== "reception" || tiempoRestante === "invalido"} className={`w-full ${article.status === "reception" ? "bg-slate-900 text-white" : "bg-zinc-500 text-white"}`}>
                {article.status === "reception" && tiempoRestante !== "invalido" ? tiempoRestante || "..." : "No Disponible"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modificar Articulo</DialogTitle>
                <DialogDescription>
                      Tienes tiempo de modificar tu artículo hasta el día:
                      <br />
                      {/* TODO FIX: por alguna razón interpreta la Date de la base de datos como zona horaria UTC y al parsearse a la
                          hora de argentina UTC-3 muestra 3 horas menos, se parsea a hora UTC para que muestre la fecha y hora reales */}
                      <b>{deadlineDate?.toLocaleString("es-AR", { timeZone: "UTC", dateStyle: "full", timeStyle: "short"})}</b>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;