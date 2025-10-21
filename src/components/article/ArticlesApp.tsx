import { useEffect, useState } from 'react';
import { getAllArticles, type Article } from '@/services/articleServices';
import { ArticleList } from './ArticleList';


export const ArticlesApp = () => {
  const [articulos, setArticulos] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        setLoading(true);
        const data = await getAllArticles();
        setArticulos(data);
      } catch (error) {
        console.error('Error fetching articulos:', error);
        setArticulos([]);
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
      <ArticleList items={articulos} />
    </div>
  );
};
