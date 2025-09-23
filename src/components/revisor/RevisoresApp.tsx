import { useEffect, useState } from 'react';
import { getRevisoresByArticulo, type RevisoresPorInteres } from '@/services/revisor';
import { RevisorItem } from './RevisorItem';
import { useParams } from '@tanstack/react-router';
import { Users, Smile } from 'lucide-react';

export const RevisoresApp = () => {
  const { id } = useParams({ from: '/articles/$id/revisores' });
  const [data, setData] = useState<RevisoresPorInteres | null>(null);
  const [asignados, setAsignados] = useState<number>(2);
  const maxAsignados = 3;

  useEffect(() => {
    const fetchData = async () => {
      const result = await getRevisoresByArticulo(Number(id));
      setData(result);
    };
    fetchData();
  }, [id]);

  if (!data) return <p>No hay revisores</p>;

  const allRevisores = [
    ...data.interesados.map((rev) => ({ ...rev, interes: 'interesado' })),
    ...data.quizas.map((rev) => ({ ...rev, interes: 'quizas' })),
    ...data.no_interesados.map((rev) => ({ ...rev, interes: 'no_interesado' })),
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <h2 className="relative font-semibold text-2xl tracking-tight my-4 text-center">
        <Users size={28} className="absolute left-4 top-1/2 -translate-y-1/2" />
        <span>Revisores disponibles</span>
        <div className="text-sm mt-1 tracking-tight font-bold">
          para el artículo {id}
        </div>
        <Smile size={40} className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500" />
      </h2>

      <div className="flex flex-col gap-4 py-4 px-6 shadow-inner w-full min-h-screen"
            style={{ backgroundColor: 'hsl(0 0% 75.1%)' }}>
        {allRevisores.length === 0 ? (
          <p className="text-center text-gray-600">No hay revisores</p>
        ) : (
          allRevisores.map((rev) => (
            <RevisorItem
              key={rev.id}
              revisor={rev}
              asignado={rev.id % 2 === 0}
              onAsignar={() => setAsignados(asignados + 1)}
              onEliminar={() => setAsignados(asignados - 1)}
            />
          ))
        )}
        <div className="mt-auto text-center">
          <div className="bg-gray-500 text-white rounded-full px-8 py-2 text-sm font-medium inline-block"
                style={{ backgroundColor: 'hsl(0 0% 40.1%)' }}>
            Revisores asignados: 1 de {maxAsignados}
          </div>
        </div>
      </div>
      <p className="text-sm py-3 text-black mt-2 text-center tracking-tight">
        Mostrando {allRevisores.length} revisores de 5
      </p>
    </div>
  );
};
