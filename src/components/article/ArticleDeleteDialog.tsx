import { type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent } from "@/components/ui/alert-dialog"
import { AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface DeleteDialogProps {
  trigger: ReactNode
  onConfirm: () => void
}

export default function AlertDeleteDialog({ trigger, onConfirm }: DeleteDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar artículo?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer.
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
            <Button variant="outline" className="bg-red-900 text-white" onClick={onConfirm}>
              Eliminar
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
