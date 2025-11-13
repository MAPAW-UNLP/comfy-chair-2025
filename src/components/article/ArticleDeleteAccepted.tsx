// -------------------------------------------------------------------------------------- 
//
// Grupo 1 - Componente para mostrar un diálogo de alerta para confirmar la eliminación de un artículo ya aceptado
//
// -------------------------------------------------------------------------------------- 

import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogCancel, AlertDialogContent } from "@/components/ui/alert-dialog"
import { AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useState } from "react"
import api from "@/services/api"
import { toast } from "sonner"

interface ArticleDeleteAcceptedProps {
  trigger: React.ReactNode
  articleId: number
  onConfirm?: () => void
}

export default function ArticleDeleteAccepted({ trigger, articleId}: ArticleDeleteAcceptedProps) {

  const [descripcion, setDescripcion] = useState("")
  const [error, setError] = useState("")
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (descripcion.trim() === "") {
      setError("Debes completar el motivo de la solicitud")
      return
    }
    setError("")
    setLoading(true);

    try {
    const requestData = {
      article_id: articleId,
      description: descripcion.trim(),
    };

    const res = await api.post("/api/article-deletion-request/", requestData, {
      headers: { "Content-Type": "application/json" },
    });

    toast.success('Solicitud de baja enviada correctamente!', { duration: 5000 });
    console.log(res.data);
    setOpen(false)
  } catch (err: any) {
    console.error("Error al enviar la solicitud:", err);
    setError(err.response?.data?.detail || "Error al enviar la solicitud");
  }

  }

  // Verifica si ya existe una solicitud de baja para este artículo
  const checkDeletionRequestExists = async (): Promise<boolean> => {
    try {
      const res = await api.get(`/api/article-deletion-request/exists/${articleId}`);
      return res.data.exists; // true o false
    } catch (err) {
      console.error("Error al verificar solicitud de baja:", err);
      return false;
    }
  };

  const handleTriggerClick = async (e: React.SyntheticEvent) => {
    e.preventDefault(); // evitamos abrir el dialog automáticamente
    const exists = await checkDeletionRequestExists();
    if (exists) {
      toast.error("Este artículo ya tiene una solicitud de baja", { duration: 5000 });
      return;
    }
    setOpen(true); // si no existe, abrimos el dialog
  };


  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div onClick={handleTriggerClick}>
          {trigger}
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <label htmlFor="mensaje" className="block mb-2.5 text-xl font-medium">Solicitar Baja de Articulo</label>
          <textarea id="mensaje" rows={4} maxLength={300} onChange={(e) => (setDescripcion(e.target.value), setError(""))} className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full p-3.5 shadow-xs placeholder:text-body" placeholder="Tu razon de baja aquí... (máx. 300)"></textarea>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* Boton de cancelar */}
          <AlertDialogCancel asChild>
            <Button variant="outline" className="bg-zinc-500 text-white">
              Cancelar
            </Button>
          </AlertDialogCancel>
          {/* Boton de confirmar eliminacion */}
          <Button variant="outline" className="bg-slate-900 text-white" onClick={handleConfirm} disabled={loading}>
            Confirmar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
