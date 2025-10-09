import type { Article } from '@/services/articulos';
import { useNavigate } from '@tanstack/react-router';
import { UserPlus2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type React from 'react';

interface ArticuloCardProps {
  articulo: Article;
}

export const ArticuloCard = ({ articulo }: ArticuloCardProps) => {
  const { id, title, revisores = [] } = articulo;
  const navigate = useNavigate();

  const completo = revisores.length === 3;

  const handleCardClick = () => {
    navigate({ to: `/articulos/${id}/revisores` });
  };

  const handleRevisorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate({ to: `/chairs/articulos/${id}/revisores` });
  };

  return (
    <div
      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer w-full"
      onClick={handleCardClick}
    >
      {/* Título */}
      <div className="flex-1 pr-4">
        <h3 className="text-base text-gray-900 leading-tight">{title}</h3>
      </div>

      <div className="flex flex-col items-center gap-2">
        {/* Estado */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            completo
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {completo ? 'Completo' : 'Incompleto'}
        </span>

        {/* Botón de revisores */}
        <Button
          size="icon"
          variant="outline"
          className="w-8 h-8 rounded-full border-gray-300 hover:bg-gray-100"
          title={completo ? 'Editar revisores' : 'Agregar revisor'}
          onClick={handleRevisorClick}
        >
          {completo ? (
            <Users className="h-4 w-4 text-gray-600" />
          ) : (
            <UserPlus2 className="h-4 w-4 text-gray-600" />
          )}
        </Button>
      </div>
    </div>
  );
};
