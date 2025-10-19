import { createFileRoute } from '@tanstack/react-router'
import { ArticlesApp } from '@/components/article/ArticlesApp'

export const Route = createFileRoute('/articulos/articulos')({
  component: () => <ArticlesApp />,
});