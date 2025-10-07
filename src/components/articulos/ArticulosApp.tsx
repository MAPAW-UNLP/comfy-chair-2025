import { useEffect, useState } from 'react';
// import { getArticulos, type Articulo } from '@/services/articulos';
import type { Articulo } from '@/services/articulos';
import { ListaArticulos } from './ListaArticulos';
import { articulosMock } from '@/mocks/articulos';


export const ArticulosApp = () => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [origen, setOrigen] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        setLoading(true);

        
        /* PARA USAR DATOS DEL BACK DESCOMENTAR EL SIGUIENTE CODIGO Y COMENTAR EL RESTO DEL TRY */


        // const data = await getArticulos();
        // console.log('Datos recibidos en componente:', data);

        // setArticulos(data);
        // setOrigen('backend');
        console.log('Cargando datos mock:', articulosMock);
        setArticulos(articulosMock);
        setOrigen('mock');
      } catch (error) {
        console.error('Error fetching articulos:', error);
        setOrigen('mock');
        setArticulos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticulos();
  }, []);

  if (loading) {
    return <div className="p-8 animate-pulse">Cargando artículos...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-2 text-xs text-gray-500">
        Origen de datos:{' '}
        <span className="font-bold">
          {origen === 'backend' ? 'Backend' : 'Mock'}
        </span>
      </div>
      <ListaArticulos items={articulos} />
    </div>
  );
};
