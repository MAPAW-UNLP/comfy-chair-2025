import type { Articulo } from '@/services/articulos';
import { ArticuloCard } from './ArticuloCard';

interface ListaArticulosProps {
  items: Articulo[];
}

export const ListaArticulos = ({ items }: ListaArticulosProps) => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Listado de Artículos</h1>
      <ul className="space-y-4">
        {items.map((articulo) => (
          <ArticuloCard key={articulo.id} articulo={articulo} />
        ))}
      </ul>
      <div className="mt-6 text-center text-sm text-gray-500">
          Mostrando {items.length} artículos
      </div>
    </div>
  );
};