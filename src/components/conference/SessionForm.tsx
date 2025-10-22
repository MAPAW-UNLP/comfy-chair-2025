import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

// Tipos
type SelectionMethod = "corte_fijo" | "mejores";

export type SessionFormData = {
  title: string;
  deadline: Date | undefined;
  capacity: number;
  selectionMethod: SelectionMethod;
  percentage?: number; // Para corte fijo
  threshold?: number; // Para mejores
};

type SessionFormProps = {
  initialData?: Partial<SessionFormData>;
  onSubmit: (data: SessionFormData) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  submitButtonText?: string;
};

export default function SessionForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitButtonText = "Guardar",
}: SessionFormProps) {
  // Estados del formulario
  const [title, setTitle] = useState<string>(initialData?.title || "");
  const [deadline, setDeadline] = useState<Date | undefined>(initialData?.deadline);
  const [capacity, setCapacity] = useState<string>(initialData?.capacity?.toString() || "");
  const [selectionMethod, setSelectionMethod] = useState<SelectionMethod>(
    initialData?.selectionMethod || "corte_fijo"
  );
  const [percentage, setPercentage] = useState<string>(
    initialData?.percentage?.toString() || "50"
  );
  const [threshold, setThreshold] = useState<string>(
    initialData?.threshold?.toString() || "-1"
  );

  // Validación y submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!title.trim()) {
      return;
    }
    if (!deadline) {
      return;
    }
    const capacityNum = parseInt(capacity);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      return;
    }

    const formData: SessionFormData = {
      title: title.trim(),
      deadline,
      capacity: capacityNum,
      selectionMethod,
    };

    // Agregar el campo correspondiente según el método de selección
    if (selectionMethod === "corte_fijo") {
      const percentageNum = parseInt(percentage);
      if (isNaN(percentageNum) || percentageNum <= 0 || percentageNum > 100) {
        return;
      }
      formData.percentage = percentageNum;
    } else {
      const thresholdNum = parseInt(threshold);
      if (isNaN(thresholdNum)) {
        return;
      }
      formData.threshold = thresholdNum;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre de la sesión */}
      <div className="space-y-2">
        <Label htmlFor="title">Nombre de la sesión</Label>
        <Input
          id="title"
          placeholder="Ingresá el nombre..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Deadline */}
      <div className="space-y-2">
        <Label>Deadline</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !deadline && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {deadline ? (
                format(deadline, "dd/MM/yyyy", { locale: es })
              ) : (
                <span>dd/mm/aaaa</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={deadline}
              onSelect={setDeadline}
              initialFocus
              locale={es}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Cupo de artículos aceptados */}
      <div className="space-y-2">
        <Label htmlFor="capacity">Cupo de artículos aceptados</Label>
        <Input
          id="capacity"
          type="number"
          placeholder="Ingresá el cupo..."
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          min="1"
          required
        />
      </div>

      {/* Método de Selección */}
      <div className="space-y-4">
        <Label>Método de Selección</Label>
        <RadioGroup value={selectionMethod} onValueChange={(value) => setSelectionMethod(value as SelectionMethod)}>
          {/* Corte fijo */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="corte_fijo" id="corte_fijo" />
            <Label htmlFor="corte_fijo" className="font-normal cursor-pointer">
              Corte fijo
            </Label>
          </div>
          {selectionMethod === "corte_fijo" && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="percentage" className="text-sm text-muted-foreground">
                Porcentaje
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="percentage"
                  type="number"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  min="1"
                  max="100"
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
          )}

          {/* Mejores */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mejores" id="mejores" />
            <Label htmlFor="mejores" className="font-normal cursor-pointer">
              Mejores
            </Label>
          </div>
          {selectionMethod === "mejores" && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="threshold" className="text-sm text-muted-foreground">
                Umbral
              </Label>
              <Input
                id="threshold"
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-24"
              />
            </div>
          )}
        </RadioGroup>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : submitButtonText}
        </Button>
      </div>
    </form>
  );
}
