import { useEffect, useState } from "react"
import { useParams } from "@tanstack/react-router"
import { RevisorItem } from "./RevisorItem"
import {
  getRevisoresByArticulo,
  assignReviewerToArticle,
  removeReviewerFromArticle,
  type Revisor,
} from "@/services/revisor"
import { getArticleById, type Article } from "@/services/articles"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export const RevisoresApp = () => {
  const { id } = useParams({ from: "/articulos/$id/revisores" })
  const [revisores, setRevisores] = useState<Revisor[]>([])
  const [articulo, setArticulo] = useState<Article | null>(null)
  const [asignados, setAsignados] = useState<number>(0)
  const [loadingRevisores, setLoadingRevisores] = useState(true)
  const [loadingArticulo, setLoadingArticulo] = useState(true)
  const [showMaxDialog, setShowMaxDialog] = useState(false)
  const maxAsignados = 3

  const [paginaActual, setPaginaActual] = useState(1)
  const itemsPorPagina = 5
  const totalPaginas = Math.ceil(revisores.length / itemsPorPagina)
  const indiceInicial = (paginaActual - 1) * itemsPorPagina
  const revisoresVisibles = revisores.slice(indiceInicial, indiceInicial + itemsPorPagina)

  const siguientePagina = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1)
  }

  const paginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1)
  }

  useEffect(() => {
    const fetchRevisores = async () => {
      try {
        setLoadingRevisores(true)
        const data = await getRevisoresByArticulo(Number(id))
        const revisoresConAsignado = (data ?? []).map((rev: Revisor) => ({
          ...rev,
          asignado: rev.assigned ?? false,
        }))
        revisoresConAsignado.sort((a, b) => Number(b.asignado) - Number(a.asignado))
        setRevisores(revisoresConAsignado)
        setAsignados(revisoresConAsignado.filter((r) => r.asignado).length)
      } catch (error) {
        console.error("Error al traer revisores:", error)
        setRevisores([])
      } finally {
        setLoadingRevisores(false)
      }
    }
    fetchRevisores()
  }, [id])

  useEffect(() => {
    const fetchArticulo = async () => {
      try {
        setLoadingArticulo(true)
        const data = await getArticleById(Number(id))
        setArticulo(data)
      } catch (error) {
        console.error("Error al traer artículo:", error)
        setArticulo(null)
      } finally {
        setLoadingArticulo(false)
      }
    }
    fetchArticulo()
  }, [id])

  const handleAsignar = async (revisorId: number) => {
    if (asignados >= maxAsignados) {
      setShowMaxDialog(true)
      return false
    }
    try {
      await assignReviewerToArticle(revisorId, Number(id))
      setRevisores((prev) =>
        prev.map((r) => (r.id === revisorId ? { ...r, asignado: true } : r))
      )
      setAsignados((prev) => prev + 1)
      return true
    } catch (error) {
      console.error("Error al asignar revisor:", error)
      return false
    }
  }

  const handleEliminar = async (revisorId: number) => {
    try {
      await removeReviewerFromArticle(revisorId, Number(id))
      setRevisores((prev) =>
        prev.map((r) => (r.id === revisorId ? { ...r, asignado: false } : r))
      )
      setAsignados((prev) => Math.max(prev - 1, 0))
    } catch (error) {
      console.error("Error al eliminar revisor:", error)
    }
  }

  if (loadingRevisores || loadingArticulo) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-gray-700 font-semibold text-lg">Cargando datos...</p>
      </div>
    )
  }

  if (revisores.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen w-full"
        style={{ backgroundColor: "hsl(0 0% 75.1%)" }}
      >
        <div className="flex flex-col items-center gap-4 bg-white border-2 border-gray-300 rounded-xl p-8 shadow-lg">
          <p className="text-lg font-bold">No hay revisores disponibles</p>
          <p className="text-sm text-gray-500 text-center">
            Parece que aún no se han registrado revisores.
          </p>
        </div>
      </div>
    )
  }

  return (
  <div className="h-screen flex flex-col bg-gray-200">
    <div
      className="text-white py-4 px-6 flex-shrink-0 text-center"
      style={{ backgroundColor: 'var(--ring)' }}
    >
      <h2 className="text-xl font-semibold">
        {articulo?.title || "Artículo sin título"}
      </h2>
    </div>
    <div className="flex-1 px-4">
      {revisoresVisibles.map((rev) => (
        <RevisorItem
          key={rev.id}
          revisor={rev}
          asignado={rev.assigned}
          onAsignar={() => handleAsignar(rev.id)}
          onEliminar={() => handleEliminar(rev.id)}
        />
      ))}
    </div>
    <div className="bg-slate-800 text-white py-4 px-6 flex-shrink-0 sticky bottom-0">
      <div className="flex justify-center items-center gap-4">
        {totalPaginas > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={paginaAnterior}
            disabled={paginaActual === 1}
            className="bg-transparent border-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 p-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        <p className="text-sm">
          Mostrando {indiceInicial + revisoresVisibles.length} revisores de {revisores.length}
        </p>

        {totalPaginas > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={siguientePagina}
            disabled={paginaActual === totalPaginas}
            className="bg-transparent border-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 p-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="mt-2 text-center text-sm opacity-80">
        Revisores asignados: {asignados} de {maxAsignados}
      </div>
    </div>

    <Dialog open={showMaxDialog} onOpenChange={setShowMaxDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-600">
            No se pueden asignar más revisores
          </DialogTitle>
          <DialogDescription>
            El máximo permitido es <b>{maxAsignados}</b> revisores.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  </div>
)

}
