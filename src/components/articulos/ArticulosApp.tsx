import { useEffect, useState } from 'react';
// import { getArticulos, type Articulo } from '@/services/articulos';
import type { Articulo } from '@/services/articulos';
import { ListaArticulos } from './ListaArticulos';
import { articulosMock } from '@/mocks/articulos';


export const ArticulosApp = () => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        setLoading(true);
        // const data = await getArticulos();
        // console.log('Datos recibidos en componente:', data);
        // setArticulos(data);
        setArticulos(articulosMock);
      } catch (error) {
        console.error('Error fetching articulos:', error);
        // setArticulos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticulos();
  }, []);

  if (loading) {
    return <div className="animate-pulse">Cargando artículos...</div>;
  }

  return (
    <div>
      <ListaArticulos items={articulos} />
    </div>
  );
};
