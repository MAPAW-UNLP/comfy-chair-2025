import ArticuloCard from '@/components/articulo/ArticuloCard';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/articulos')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <div className="flex flex-wrap gap-4 mx-4 justify-center">
        <ArticuloCard
            titulo={"Seguridad en Aplicaciones Web con Arquitecturas Basadas en Microservicios"}
            conferencia={"Congreso Latinoamericano de Ciberseguridad 2025"}
            estado={"Aceptado"}
            finPeriodo={new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000)} // 5 días desde ahora
        />
        <ArticuloCard
            titulo={"Detección Proactiva de Amenazas en Redes Corporativas Usando Análisis Basado en IA"}
            conferencia={"Congreso Latinoamericano de Ciberseguridad 2025"}
            estado={"Rechazado"}
            finPeriodo={new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000)} // 1 día desde ahora
        />
        <ArticuloCard
            titulo={"Optimización de Modelos de Machine Learning en Ambientes con Recursos Limitados"}
            conferencia={"Conferencia Internacional de Inteligencia Artificial y Data Science 2025"}
            estado={"Recibido"}
            finPeriodo={new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000 + 30 * 60 * 1000)} // 2 días, 3 horas y 30 minutos desde ahora
        />
      </div>
  );
}
