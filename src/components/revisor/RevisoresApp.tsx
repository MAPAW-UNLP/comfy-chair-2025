import { useEffect, useState } from "react"
import { getRevisoresByArticulo, type Revisor } from "@/services/revisor"
import { RevisorItem } from "./RevisorItem"
import { useParams } from "@tanstack/react-router"
import { Users, Smile } from "lucide-react"
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
  const [asignados, setAsignados] = useState<number>(0)
  const maxAsignados = 3

  // Estado para dialogs
  const [showMaxDialog, setShowMaxDialog] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRevisoresByArticulo(Number(id))
      setRevisores(data)
    }
    fetchData()
  }, [id])

  if (revisores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4 bg-white border-2 border-gray-300 rounded-xl p-8 shadow-lg">
          <Users size={48} className="text-gray-400" />
          <p className="text-lg font-semibold text-gray-700">
            No hay revisores disponibles
          </p>
          <p className="text-sm text-gray-500 text-center">
            Parece que aún no se han registrado revisores.
          </p>
        </div>
      </div>
    )
  }

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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <h2 className="relative font-semibold text-2xl tracking-tight my-4 text-center">
        <Users
          size={28}
          className="absolute left-4 top-1/2 -translate-y-1/2"
        />
        Revisores disponibles
        <div className="text-sm mt-1 tracking-tight font-bold">
          para el artículo {id}
        </div>
        <Smile
          size={40}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500"
        />
      </h2>

      {/* Lista de revisores */}
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

        {/* Contador asignados */}
        <div className="mt-auto text-center">
          <div
            className="bg-gray-500 text-white rounded-full px-8 py-2 text-sm font-medium inline-block border border-black"
            style={{ backgroundColor: "hsl(0 0% 40.1%)" }}
          >
            Revisores asignados: {asignados} de {maxAsignados}
          </div>
        </div>
      </div>

      <p className="text-sm py-3 text-black mt-2 text-center tracking-tight">
        Mostrando {revisores.length} revisores
      </p>

      {/* Dialog cuando se supera el máximo */}
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
