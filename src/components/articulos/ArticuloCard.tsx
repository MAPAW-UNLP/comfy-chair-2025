import type { Articulo } from '@/services/articulos';
import { useNavigate } from '@tanstack/react-router';
import { UserPlus2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type React from 'react';

interface ArticuloCardProps {
  articulo: Articulo;
}

export const ArticuloCard = ({ articulo }: ArticuloCardProps) => {
  const { id, title, revisores = [] } = articulo;
  const navigate = useNavigate();

  const completo = revisores.length === 3;

  const handleCardClick = () => {
    navigate({ to: `/articulos/${id}` });
  };

  const handleRevisorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate({
      to: completo
        ? `/articulos/${id}/revisores`
        : `/articulos/${id}/revisores-disponibles`,
    });
  };

  return (
    <li
      className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-muted/50 transition cursor-pointer"
      onClick={handleCardClick}
    >
      <h2 className="text-sm font-medium text-foreground">{title}</h2>

      <div className="flex flex-col items-center gap-2">
        <Badge
          variant={completo ? 'default' : 'secondary'}
          className={
            completo
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-200 text-gray-700'
          }
        >
          {completo ? 'Completo' : 'Incompleto'}
        </Badge>

        <Button
          size="icon"
          variant="outline"
          className="rounded-full bg-gray-200 hover:bg-gray-300"
          title={completo ? 'Editar revisores' : 'Agregar revisor'}
          onClick={handleRevisorClick}
        >
          {completo ? (
            <Users className="h-5 w-5 text-gray-700" />
          ) : (
            <UserPlus2 className="h-5 w-5 text-gray-700" />
          )}
        </Button>
      </div>
    </li>
  );
};
