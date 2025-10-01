"use client"

import { useState } from "react"
import { Plus, Trash2, Smile } from "lucide-react"
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
  onAsignar?: () => boolean | void   // 🔹 ajustado
  onEliminar?: () => void
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

  const getEstadoColor = () => {
    switch (revisor.interes) {
      case "interesado":
        return { backgroundColor: "hsla(141, 81%, 66%, 1)" }
      case "quizas":
        return { backgroundColor: "hsl(52.8 98.3% 76.9%)" }
      case "no_interesado":
        return { backgroundColor: "hsl(0 90.6% 70.8%)" }
      default:
        return { backgroundColor: "hsl(240 4.9% 83.9%)" }
    }
  }

  const handleAsignar = () => {
    const exito = onAsignar?.()
    if (exito === undefined || exito) {   // 🔹 maneja undefined como éxito
      setIsAsignado(true)
      setShowAsignadoDialog(true)
    }
  }

  const handleEliminarClick = () => {
    setIsAsignado(false)
    onEliminar?.()
    setShowEliminadoDialog(true)
  }

  return (
    <>
      <div className="flex items-center justify-between border-2 border-black rounded-xl p-3 shadow-2xl bg-white">
        <div className="flex items-center gap-4">
          <Smile size={40} className="text-yellow-500 flex-shrink-0" />
          <div className="flex flex-col items-start">
            <p className="text-lg font-semibold">{revisor.nombre_completo}</p>
            <span
              className="mt-1 px-3 py-1 rounded-md text-sm font-bold text-black flex items-center justify-center border-2 border-black"
              style={getEstadoColor()}
            >
              {interesMap[revisor.interes] || "No indicó"}
            </span>
          </div>
        </div>

        {isAsignado ? (
          <button
            onClick={handleEliminarClick}
            className="flex items-center gap-1 bg-red-600 px-3 py-1 rounded-lg text-sm font-bold hover:bg-red-700 border-2 border-black"
          >
            <Trash2 size={16} /> Eliminar
          </button>
        ) : (
          <button
            onClick={handleAsignar}
            className="flex items-center gap-1 bg-green-600 px-3 py-1 rounded-lg text-sm font-bold hover:bg-green-700 border-2 border-black"
          >
            <Plus size={16} /> Asignar
          </button>
        )}
      </div>

      {/* Dialog asignado */}
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

      {/* Dialog eliminado */}
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
