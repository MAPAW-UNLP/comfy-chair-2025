import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function AltaArticulo() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const extraFileRef = useRef<HTMLInputElement>(null);

  const [tipoArticulo, setTipoArticulo] = useState<string>("");

  const handleClick = () => fileInputRef.current?.click();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) console.log("Archivo seleccionado:", file.name);
  };

  const handleExtraFileClick = () => extraFileRef.current?.click();

  const handleExtraFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) console.log("Archivo extra (Poster):", file.name);
  };

  return (
    <div className="w-full max-w-md rounded-2xl shadow-md border p-4 bg-white flex flex-col gap-4">
      <h3>Título</h3>
      <Input id="Titulo" placeholder="Escribí el título" />

      <h3>Archivo adjunto</h3>
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          className="hidden"
        />
        <Button className="mb-4" onClick={handleClick} type="button">
          Adjuntar archivo
        </Button>
      </div>

      <h3>Autor</h3>
      <Input id="Autor" placeholder="Escribí el nombre del autor" />

      <h3>Autor de notificación</h3>
      <Input
        id="AutorNotificacion"
        placeholder="Escribí el nombre del autor de notificación"
      />

      <Accordion type="single" collapsible>
        <AccordionItem value="item-2">
          <AccordionTrigger>Seleccionar el tipo de artículo</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              name="tipoArticulo"
              value={tipoArticulo}
              onValueChange={setTipoArticulo}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poster" id="poster" />
                <Label htmlFor="poster">Poster</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regular" id="regular" />
                <Label htmlFor="regular">Regular</Label>
              </div>
            </RadioGroup>

            {/* Campos dinámicos */}
            {tipoArticulo === "poster" && (
              <div className="mt-4">
                <input
                  type="file"
                  ref={extraFileRef}
                  onChange={handleExtraFileChange}
                  className="hidden"
                />
                <Button onClick={handleExtraFileClick} type="button">
                  Adjuntar archivo extra (Poster)
                </Button>
              </div>
            )}

            {tipoArticulo === "regular" && (
              <div className="mt-4">
                <Textarea
                  id="DetalleRegular"
                  placeholder="Detalle adicional para artículo regular..."
                />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div id="bottom-buttons" className="flex gap-2">
        <Button type="button" variant="outline">Cancelar</Button>
        <Button type="submit">Subir</Button>
      </div>
    </div>
  );
}
