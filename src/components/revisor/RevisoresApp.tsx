import { useEffect, useState } from 'react';
import { getRevisoresByArticulo, type RevisoresPorInteres } from '@/services/revisor';
import { RevisorItem } from './RevisorItem';
import { useParams } from '@tanstack/react-router';

export const RevisoresApp = () => {
  const { id } = useParams({ from: '/articles/$id/revisores' });
  const [data, setData] = useState<RevisoresPorInteres | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getRevisoresByArticulo(Number(id));
      setData(result);
    };
    fetchData();
  }, [id]);

  if (!data) return <p>Cargando revisores...</p>;

  const { interesados, quizas, no_interesados } = data;

  return (
    <div className="flex flex-col gap-6 p-4">
      <h2 className="font-bold text-2xl">Revisores del Artículo {id}</h2>

      {interesados.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg">Interesados</h3>
          <div className="flex flex-col gap-2">
            {interesados.map((rev) => (
              <RevisorItem key={rev.id} revisor={rev} />
            ))}
          </div>
        </div>
      )}

      {quizas.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg">Quizás</h3>
          <div className="flex flex-col gap-2">
            {quizas.map((rev) => (
              <RevisorItem key={rev.id} revisor={rev} />
            ))}
          </div>
        </div>
      )}

      {no_interesados.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg">No interesados</h3>
          <div className="flex flex-col gap-2">
            {no_interesados.map((rev) => (
              <RevisorItem key={rev.id} revisor={rev} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
