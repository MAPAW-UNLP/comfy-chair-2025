"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import type { Revisor } from "@/services/revisor"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface RevisorProps {
  revisor: Revisor
  asignado?: boolean
  onAsignar?: () => boolean | Promise<boolean>
  onEliminar?: () => void | Promise<void>
}

const interesMap: Record<string, string> = {
  interesado: "Interesado",
  quizas: "Quizás",
  no_interesado: "No interesado",
  ninguno: "No indicó",
}

export const RevisorItem: React.FC<RevisorProps> = ({
  revisor,
  asignado = false,
  onAsignar,
  onEliminar,
}) => {
  const [isAsignado, setIsAsignado] = useState(asignado)
  const [showAsignadoDialog, setShowAsignadoDialog] = useState(false)
  const [showEliminadoDialog, setShowEliminadoDialog] = useState(false)

  useEffect(() => {
    setIsAsignado(asignado)
  }, [asignado])

  const getEstadoColor = () => {
    switch (revisor.interes) {
      case "interesado":
        return { backgroundColor: "hsla(141, 81%, 66%, 1.00)" }
      case "quizas":
        return { backgroundColor: "hsl(52.8 98.3% 76.9%)" }
      case "no_interesado":
        return { backgroundColor: "hsl(0 90.6% 70.8%)" }
      default:
        return { backgroundColor: "hsl(240 4.9% 83.9%)" }
    }
  }

  const handleAsignar = async () => {
    if (!onAsignar) return
    const exito = await onAsignar()
    if (exito) {
      setIsAsignado(true)
      setShowAsignadoDialog(true)
    }
  }

  const handleEliminarClick = async () => {
    if (!onEliminar) return
    await onEliminar()
    setIsAsignado(false)
    setShowEliminadoDialog(true)
  }

  return (
    <>
      <div className="w-screen flex items-center justify-between py-6 border-b border-black relative left-1/2 right-1/2 -translate-x-1/2 px-8">
        <div className="flex-1 text-center mr-4">
          <p className="text-2xl font-bold tracking-wide">
            {revisor.nombre_completo}
          </p>
        </div>

        <div className="flex flex-col items-center min-w-[160px]">
          <span
            className="mb-3 h-9 w-26 flex items-center justify-center rounded-md text-sm font-bold text-black border border-black"
            style={getEstadoColor()}
          >
            {interesMap[revisor.interes] || "No indicó"}
          </span>

          {isAsignado ? (
            <button
              onClick={handleEliminarClick}
              className="flex items-center gap-2 bg-red-600 text-white px-5 py-1 rounded-lg text-lg font-bold hover:bg-red-700 border border-black transition"
            >
              <Trash2 size={20} /> Eliminar
            </button>
          ) : (
            <button
              onClick={handleAsignar}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-1 rounded-lg text-lg font-bold hover:bg-green-700 border border-black transition"
            >
              <Plus size={20} /> Asignar
            </button>
          )}
        </div>
      </div>

      <Dialog open={showAsignadoDialog} onOpenChange={setShowAsignadoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revisor asignado</DialogTitle>
            <DialogDescription>
              El revisor <b>{revisor.nombre_completo}</b> fue asignado con éxito.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showEliminadoDialog} onOpenChange={setShowEliminadoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revisor eliminado</DialogTitle>
            <DialogDescription>
              El revisor <b>{revisor.nombre_completo}</b> fue eliminado.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
