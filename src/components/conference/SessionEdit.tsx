/* Componente para editar una sesión existente */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import SessionForm, { type SessionFormData } from './SessionForm';
import { toast } from 'sonner';
import { axiosInstance as api } from '@/services/api';
import type { Session } from '@/services/sessionServices';
import { Edit } from 'lucide-react';

type EditarSessionProps = {
  session: Session;
  onSessionUpdated?: () => void;
  trigger?: React.ReactNode;
};

export default function EditarSession({
  session,
  onSessionUpdated,
  trigger,
}: EditarSessionProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Datos iniciales del formulario
  const initialData: Partial<SessionFormData> = {
    title: session.title,
    deadline: new Date(session.deadline),
    capacity: session.capacity,
    selectionMethod: 'mejores', // Valor por defecto
    threshold: -1, // Valor por defecto
    chairs: [], // TODO: cargar chairs desde session cuando el backend lo soporte
  };

  const handleSubmit = async (data: SessionFormData) => {
    setIsLoading(true);
    try {
      // Preparar los datos para enviar al backend
      const sessionData = {
        title: data.title,
        deadline: data.deadline?.toISOString().split('T')[0], // Solo la fecha (YYYY-MM-DD)
        capacity: data.capacity,
        conference_id: session.conference?.id,
        chairs: data.chairs.map((ch) => ch.id), // Enviar solo los IDs de los chairs
        threshold_percentage:
          data.selectionMethod === 'corte_fijo' ? data.percentage : 50,
        improvement_threshold:
          data.selectionMethod === 'mejores' ? data.threshold : 0,
      };

      await api.put(`/api/session/${session.id}/`, sessionData);

      toast.success('Sesión actualizada exitosamente');
      setOpen(false);
      onSessionUpdated?.();
    } catch (error: any) {
      console.error('Error al actualizar la sesión:', error);
      toast.error(
        error.response?.data?.message || 'Error al actualizar la sesión'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger del modal */}
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={(e) => e.stopPropagation()} // evita que el click del botón abra redirect
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      {/* Contenido del modal */}
      <DialogContent
        className="max-w-md"
        onClick={(e) => e.stopPropagation()} // evita que clicks dentro del modal disparen redirect
      >
        <DialogHeader>
          <DialogTitle>Editar Sesión</DialogTitle>
        </DialogHeader>
        <SessionForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          submitButtonText="Guardar"
        />
      </DialogContent>
    </Dialog>
  );
}
