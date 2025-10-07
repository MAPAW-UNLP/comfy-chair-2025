"use client"

import { useEffect, useState } from "react"
import { useParams } from "@tanstack/react-router"
import { RevisorItem } from "./RevisorItem"
import { getRevisoresByArticulo, type Revisor } from "@/services/revisor"
import { getArticuloById, type Article } from "@/services/articulos"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export const RevisoresApp = () => {
  const { id } = useParams({ from: "/articulos/$id/revisores" })
  const [revisores, setRevisores] = useState<Revisor[]>([])
  const [articulo, setArticulo] = useState<Article | null>(null)
  const [asignados, setAsignados] = useState<number>(0)
  const [loadingRevisores, setLoadingRevisores] = useState(true)
  const [loadingArticulo, setLoadingArticulo] = useState(true)
  const [showMaxDialog, setShowMaxDialog] = useState(false)
  const maxAsignados = 3

  useEffect(() => {
    const fetchRevisores = async () => {
      try {
        setLoadingRevisores(true)
        const data = await getRevisoresByArticulo(Number(id))
        setRevisores(data ?? [])
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
        const data = await getArticuloById(Number(id))
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

  const handleAsignar = () => {
    if (asignados >= maxAsignados) {
      setShowMaxDialog(true)
      return false
    }
    setAsignados((prev) => prev + 1)
    return true
  }

  const handleEliminar = () => {
    setAsignados((prev) => Math.max(prev - 1, 0))
  }

  if (loadingRevisores || loadingArticulo) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-gray-700 font-semibold text-lg">Cargando datos...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <h2 className="relative font-semibold text-2xl tracking-tight my-4 text-center text-white">
        {articulo && (
          <div>
            {articulo.title}
          </div>
        )}
      </h2>
      {revisores.length > 0 ? (
        <div
          className="flex flex-col gap-4 py-4 px-6 shadow-inner w-full min-h-screen"
          style={{ backgroundColor: "hsl(0 0% 75.1%)" }}
        >
          {revisores.map((rev) => (
            <RevisorItem
              key={rev.id}
              revisor={rev}
              asignado={false}
              onAsignar={handleAsignar}
              onEliminar={handleEliminar}
            />
          ))}
          <div className="mt-auto text-center">
            <div
              className="bg-gray-500 text-white rounded-full px-8 py-2 text-sm font-medium inline-block border border-black"
              style={{ backgroundColor: "hsla(0, 0%, 19%, 1.00)" }}
            >
              Revisores asignados: {asignados} de {maxAsignados}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex flex-col items-center gap-4 bg-white border-2 border-gray-300 rounded-xl p-8 shadow-lg">
            <p className="text-lg font-semibold text-gray-700">
              No hay revisores disponibles
            </p>
            <p className="text-sm text-gray-500 text-center">
              Parece que aún no se han registrado revisores.
            </p>
          </div>
        </div>
      )}

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
