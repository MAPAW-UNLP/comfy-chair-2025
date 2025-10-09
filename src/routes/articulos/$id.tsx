import { createFileRoute } from '@tanstack/react-router';

// Temporal, para mostrar un artículo individual
function ArticuloIndividual() {
  const { id } = Route.useParams();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Artículo {id}</h1>
      <p className="text-gray-600">
        Esta es la página del artículo con ID: {id}
      </p>
      <p className="mt-4 text-sm text-gray-500">
        Aquí se mostrarían los detalles del artículo si tan solo los tuvieramos ;)
      </p>
    </div>
  );
}

export const Route = createFileRoute('/articulos/$id')({
  component: ArticuloIndividual,
});