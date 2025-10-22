/* Componente que muestra una tarjeta de sesión con sus artículos */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Session } from "@/services/sessionServices";
import EditarSession from "./EditarSession";
import { Calendar } from "lucide-react";

type SessionCardProps = {
  session: Session;
  onSessionUpdated?: () => void;
};

export default function SessionCard({
  session,
  onSessionUpdated,
}: SessionCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 flex-1">
          <div className="text-xs text-muted-foreground">Sesión</div>
          <CardTitle className="text-xl">{session.title}</CardTitle>
        </div>
        <EditarSession session={session} onSessionUpdated={onSessionUpdated} />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Deadline */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Deadline</span>
          <span className="font-medium">{formatDate(session.deadline)}</span>
        </div>

        {/* Cupo máximo */}
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">
            Cupo máximo de artículos aceptados
          </div>
          <div className="text-2xl font-bold">{session.capacity}</div>
        </div>

        {/* Artículos - Por ahora vacío, se puede agregar después */}
        <div className="space-y-2">
          <div className="text-sm font-semibold">Artículos</div>
          <div className="flex gap-2 flex-wrap">
            {/* Aquí irían los artículos cuando estén disponibles */}
            <div className="text-xs text-muted-foreground">
              No hay artículos asignados
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
