// -------------------------------------------------------------------------------------- 
//
// Grupo 1 - Componente para mostrar un diálogo de alerta para confirmar la eliminación de un artículo ya aceptado
//
// -------------------------------------------------------------------------------------- 

import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent } from "@/components/ui/alert-dialog"
import { AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface ArticleDeleteAcceptedProps {
  trigger: React.ReactNode
  onConfirm?: () => void
}

export default function ArticleDeleteAccepted({ trigger }: ArticleDeleteAcceptedProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Solicitar Baja de Articulo</AlertDialogTitle>
          <AlertDialogDescription>
            @LEO
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* Boton de cancelar */}
          <AlertDialogCancel asChild>
            <Button variant="outline" className="bg-zinc-500 text-white">
              Cancelar
            </Button>
          </AlertDialogCancel>
          {/* Boton de confirmar eliminacion */}
          <AlertDialogAction asChild>
            <Button variant="outline" className="bg-slate-900 text-white">
              Confirmar
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
