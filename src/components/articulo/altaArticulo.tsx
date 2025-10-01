import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"

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
      <h2 className="text-lg font-bold italic text-slate-500 text-center">Alta de Articulo</h2>
      <hr className="bg-slate-100"/>
      
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="title">Titulo</Label>
        <Input type="text" id="title" placeholder="Titulo del articulo..." />
      </div>

      <div className="grid w-full items-center gap-3">
        <Label htmlFor="DetalleRegular">Articulo</Label>
        <input
          type="file"
          ref={extraFileRef}
          onChange={handleExtraFileChange}
          className="hidden"
        />
        <Button onClick={handleExtraFileClick} type="button" className="w-full">
          Archivo con el Articulo
        </Button>
      </div>

      <Select>
        <Label htmlFor="autor">Autores del Articulo</Label>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccione un autor..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Autor 1</SelectItem>
          <SelectItem value="dark">Autor 2</SelectItem>
          <SelectItem value="system">Autor 3</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <Label htmlFor="autor">Autor de Notificacion</Label>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccione un autor..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Autor 1</SelectItem>
          <SelectItem value="dark">Autor 2</SelectItem>
          <SelectItem value="system">Autor 3</SelectItem>
        </SelectContent>
      </Select>
  
      <Select value={tipoArticulo} onValueChange={setTipoArticulo}>
        <Label htmlFor="tipo-articulo">Tipo de Articulo</Label>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccione un tipo..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="regular">Regular</SelectItem>
          <SelectItem value="poster">Poster</SelectItem>
        </SelectContent>
      </Select>

      {/* Campos dinámicos para abstrac / poster */}
      <div>
          {tipoArticulo === "poster" && (
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="DetalleRegular">Fuentes</Label>
              <input
                type="file"
                ref={extraFileRef}
                onChange={handleExtraFileChange}
                className="hidden"
              />
              <Button onClick={handleExtraFileClick} type="button" className="w-full">
                Archivo con las Fuentes
              </Button>
            </div>
          )}

          {tipoArticulo === "regular" && (
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="DetalleRegular">Abstract</Label>
              <Textarea
                id="DetalleRegular"
                placeholder="Abstract de hasta 300 caracteres..."
              />
            </div>
          )}
      </div>

      <div id="bottom-buttons" className="flex w-full gap-2">
        <Button type="button" variant="outline" className="w-1/2">
          Cancelar
        </Button>
        <Button type="submit" className="w-1/2">
          Subir
        </Button>
      </div>

    </div>
  );
}
