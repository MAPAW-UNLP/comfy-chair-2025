/* Componente para dar de alta una sesión en una conferencia */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SessionForm, { type SessionFormData } from "./SessionForm";
import { toast } from "sonner";
import { axiosInstance as api } from "@/services/api";

type AltaSessionProps = {
  conferenceId: number;
  onSessionCreated?: () => void;
  trigger?: React.ReactNode;
};

export default function AltaSession({
  conferenceId,
  onSessionCreated,
  trigger,
}: AltaSessionProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: SessionFormData) => {
    setIsLoading(true);
    try {
      // Preparar los datos para enviar al backend
      const sessionData = {
        title: data.title,
        deadline: data.deadline?.toISOString(),
        capacity: data.capacity,
        conference_id: conferenceId,
        // Aquí puedes agregar los campos de selection_method, percentage y threshold
        // cuando el backend los soporte
      };

      await api.post("/api/session/", sessionData);

      toast.success("Sesión creada exitosamente");
      setOpen(false);
      onSessionCreated?.();
    } catch (error: any) {
      console.error("Error al crear la sesión:", error);
      toast.error(error.response?.data?.message || "Error al crear la sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Alta Sesión</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Alta Sesión</DialogTitle>
        </DialogHeader>
        <SessionForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          submitButtonText="Guardar"
        />
      </DialogContent>
    </Dialog>
  );
}
