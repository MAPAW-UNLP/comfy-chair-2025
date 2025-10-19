import type { Article } from '@/services/articles';
import { useNavigate } from '@tanstack/react-router';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const { id, title, reviewers = [] } = article;
  console.log('Artículo:', title, '| Revisores:', reviewers, '| Cantidad:', reviewers.length);

  const navigate = useNavigate();

  const iscomplete = reviewers.length === 3;

  const handleCardClick = () => {
    navigate({ to: `/articulos/${id}/revisores` });
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
            iscomplete
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-700'
            }`}
        >
          {iscomplete ? 'Completo' : 'Incompleto'}
        </span>

      </div>
    </div>
  );
};
