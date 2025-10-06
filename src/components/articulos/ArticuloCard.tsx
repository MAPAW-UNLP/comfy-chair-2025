import type { Articulo } from '@/services/articulos';
import { useNavigate } from '@tanstack/react-router';

interface ArticuloCardProps {
  articulo: Articulo;
}

const getInitials = (name: string): string => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
};

export const ArticuloCard = ({ articulo }: ArticuloCardProps) => {
  const { id, title, description, revisores = [] } = articulo;
  const navigate = useNavigate();
  
  const handleAddRevisor = () => {
    navigate({ to: `/articulos/${id}/revisores-disponibles` });
  };

  const handleRevisorClick = () => {
    navigate({ to: `/articulos/${id}/revisores-disponibles` }); // esto deberia ser '/revisor/${revisor.id}' o algo así y traerme revisorId: number
  };
  
  return (
    <li className="rounded-xl border p-4 shadow-sm flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        {revisores && revisores.length > 0 && (
          <div className="flex -space-x-2">
            {revisores.slice(0, 3).map((revisor, index) => (
              <button
                key={index}
                onClick={handleRevisorClick}
                className="w-8 h-8 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center border-2 border-white hover:bg-blue-600 cursor-pointer"
                title={revisor}
              >
                {getInitials(revisor)}
              </button>
            ))}
          </div>
        )}
        <button 
          onClick={handleAddRevisor}
          className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600 flex items-center justify-center text-sm cursor-pointer"
          title="Agregar revisor"
        >
          +
        </button>
      </div>
    </li>
  );
};