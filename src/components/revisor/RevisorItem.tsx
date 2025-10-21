"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import type { Revisor } from "@/services/revisor"
import { toast } from "sonner"

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

  useEffect(() => {
    setIsAsignado(asignado)
  }, [asignado])

  const getEstadoColor = () => {
    switch (revisor.interest) {
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
      toast.success(`Revisor ${revisor.full_name} asignado con éxito`)
    }
  }

  const handleEliminarClick = async () => {
    if (!onEliminar) return
    await onEliminar()
    setIsAsignado(false)
    toast.error(`Revisor ${revisor.full_name} fue desasignado`)
  }

  return (
    <>
      <div className="w-screen flex items-center justify-between py-6 border-b border-black relative left-1/2 right-1/2 -translate-x-1/2 px-8">
        <div className="flex-1 text-center mr-4 flex flex-col items-center">
          <p className="text-xl font-bold tracking-wide">
            {revisor.full_name}
          </p>
          <span
            className="mt-2 h-9 w-30 flex items-center justify-center rounded-md text-sm font-bold text-black border border-black"
            style={getEstadoColor()}
          >
            {interesMap[revisor.interest] || "No indicó"}
          </span>
        </div>

        {isAsignado ? (
          <button
            onClick={handleEliminarClick}
            className="flex items-center gap-2 bg-red-600 text-white px-2 py-0.5 rounded-lg text-lg font-bold hover:bg-red-700 border border-black transition"
          >
            <Trash2 size={20} /> Desasignar
          </button>
        ) : (
          <button
            onClick={handleAsignar}
            className="flex items-center gap-2 bg-green-600 text-white px-2 py-0.5 rounded-lg text-lg font-bold hover:bg-green-700 border border-black transition"
          >
            <Plus size={20} /> Asignar
          </button>
        )}
      </div>
    </>
  )
}
