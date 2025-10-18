import { useMemo } from "react";

/**
 * Vista: Artículos Asignados (FRONT SOLO)
 * - Encabezado: título + fecha límite
 * - Lista de cards: título del paper, estado (badge) y botón contextual
 * - Sin llamadas a API (datos mock), estilado móvil-first
 *
 * Requiere Tailwind habilitado en el proyecto.
 */

const DEADLINE = "2025-11-10";

const MOCK_ASSIGNED = [
  {
    id: 1,
    title:
      "Un Marco de Trabajo para la Detección Temprana de Deuda Técnica en Repositorios de Código Fuente Utilizando Análisis de Métricas y Machine Learning",
    status: "pending", // pending | draft | submitted
  },
  {
    id: 2,
    title:
      "Evaluación Comparativa de Técnicas de Generación de Casos de Prueba para Sistemas basados en Microservicios",
    status: "draft",
  },
  {
    id: 3,
    title:
      "Propuesta de una Técnica de Priorización de Requisitos No Funcionales en Metodologías Ágiles para Entornos de Alta Criticidad",
    status: "pending",
  },
];

const STATUS_UI = {
  pending: {
    label: "Pendiente",
    badgeClass:
      "text-red-700 bg-red-50 ring-1 ring-red-200 dark:text-red-200 dark:bg-red-900/30 dark:ring-red-800",
    cta: "Revisar",
  },
  draft: {
    label: "Revisado",
    badgeClass:
      "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 dark:text-emerald-200 dark:bg-emerald-900/30 dark:ring-emerald-800",
    cta: "Modificar",
  },
  submitted: {
    label: "Enviado",
    badgeClass:
      "text-slate-600 bg-slate-100 ring-1 ring-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:ring-slate-700",
    cta: "Ver",
  },
};

function ArticleCard({ article, onAction }) {
  const conf = STATUS_UI[article.status];

  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 md:p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="text-slate-900 dark:text-slate-100 font-semibold leading-snug">
            {article.title}
          </h3>

          <div className="mt-2">
            <span
              className={
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium " +
                conf.badgeClass
              }
            >
              {conf.label}
            </span>
          </div>
        </div>

        <button
          onClick={() => onAction?.(article)}
          className="shrink-0 rounded-xl px-3 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 dark:focus:ring-offset-slate-900"
          aria-label={`${conf.cta} artículo`}
        >
          {conf.cta}
        </button>
      </div>
    </div>
  );
}

export default function AssignedArticlesView() {
  // si querés, reemplazá por props o estado global
  const data = useMemo(() => MOCK_ASSIGNED, []);

  const handleAction = (article) => {
    // Navegación/acción a definir: p. ej. /reviews/:articleId
    // Aquí solo mostramos un log para mantenerlo "front-only".
    console.log("Acción:", STATUS_UI[article.status].cta, "→", article.id);
  };

  return (
    <div className="mx-auto w-full max-w-md sm:max-w-lg px-4 py-4 sm:py-6">
      {/* Top bar (como en la captura) */}
      <header className="mb-4">
        <div className="h-10 w-full bg-[#0B3E4F] rounded-md mb-4 sm:hidden" aria-hidden />
        {/* ↑ placeholder de la barra superior mobile (reemplazá por tu Navbar real) */}

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Artículos Asignados
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Fecha Límite de Revisión: <span className="font-medium"> {DEADLINE}</span>
        </p>
      </header>

      <div className="space-y-3">
        {data.map((a) => (
          <ArticleCard key={a.id} article={a} onAction={handleAction} />
        ))}
      </div>
    </div>
  );
}
