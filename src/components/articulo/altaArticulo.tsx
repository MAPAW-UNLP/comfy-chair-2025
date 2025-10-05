import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { User } from "@/services/users";
import type { Conference } from "@/services/conferences";
import { getSessionsByConference } from "@/services/sessions";
import type { Session } from "@/services/sessions";

type AltaArticuloProps = {
  users: User[];
  conferences: Conference[];
};

export default function AltaArticulo({ users, conferences }: AltaArticuloProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const extraFileRef = useRef<HTMLInputElement>(null);

  const [tipoArticulo, setTipoArticulo] = useState<string>("");
  const [selectedConference, setSelectedConference] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState<boolean>(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

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

  // Efecto para traer sesiones cuando cambia la conferencia seleccionada
  useEffect(() => {
    if (selectedConference) {
      setLoadingSessions(true);
      setSelectedSession(null); // limpia la sesión al cambiar conferencia
      getSessionsByConference(Number(selectedConference))
        .then((data) => setSessions(data))
        .catch((err) => console.error("Error cargando sesiones:", err))
        .finally(() => setLoadingSessions(false));
    } else {
      setSessions([]);
      setSelectedSession(null); // limpia si no hay conferencia
    }
  }, [selectedConference]);

  return (
    <div className="w-full max-w-md rounded-2xl shadow-md border p-4 bg-white flex flex-col gap-4">
      <h2 className="text-lg font-bold italic text-slate-500 text-center">Alta de Articulo</h2>
      <hr className="bg-slate-100" />

      {/* Select de Conferencias */}
      <Label htmlFor="conferencia">Conferencia</Label>
      <Select onValueChange={(value) => setSelectedConference(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccione una conferencia..." />
        </SelectTrigger>
        <SelectContent>
          {conferences.map((c) => (
            <SelectItem key={c.id} value={String(c.id)}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Select de Sesiones (filtrado) */}
      <Label htmlFor="sesion">Sesión</Label>
      <Select
        value={selectedSession ?? ""}
        onValueChange={(value) => setSelectedSession(value)}
        disabled={!selectedConference || loadingSessions}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={
              loadingSessions
                ? "Cargando sesiones..."
                : !selectedConference
                ? "Seleccione una conferencia primero..."
                : sessions.length
                ? "Seleccione una sesión..."
                : "No hay sesiones disponibles..."
            }
          />
        </SelectTrigger>
        <SelectContent>
          {sessions.map((s) => (
            <SelectItem key={s.id} value={String(s.id)}>
              {s.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Campo de título */}
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="title">Título</Label>
        <Input type="text" id="title" placeholder="Título del artículo..." />
      </div>

      {/* Archivo principal */}
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="DetalleRegular">Artículo</Label>
        <input type="file" ref={fileInputRef} onChange={handleChange} className="hidden" />
        <Button onClick={handleClick} type="button" className="w-full">
          Seleccionar archivo...
        </Button>
      </div>

      {/* Select de autores */}
      <Label htmlFor="autor">Autores del Artículo</Label>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccione un autor..." />
        </SelectTrigger>
        <SelectContent>
          {users.map((u) => (
            <SelectItem key={u.id} value={String(u.id)}>
              {u.first_name} {u.last_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Select de autor de notificación */}
      <Label htmlFor="autorNotif">Autor de Notificación</Label>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccione un autor..." />
        </SelectTrigger>
        <SelectContent>
          {users.map((u) => (
            <SelectItem key={u.id} value={String(u.id)}>
              {u.first_name} {u.last_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Select tipo de artículo */}
      <Label htmlFor="tipo-articulo">Tipo de Artículo</Label>
      <Select value={tipoArticulo} onValueChange={setTipoArticulo}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccione un tipo..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="regular">Regular</SelectItem>
          <SelectItem value="poster">Poster</SelectItem>
        </SelectContent>
      </Select>

      {/* Campos dinámicos */}
      <div>
        {tipoArticulo === "poster" && (
          <div className="grid w-full items-center gap-3">
            <Label htmlFor="DetalleRegular">Fuentes</Label>
            <input type="file" ref={extraFileRef} onChange={handleExtraFileChange} className="hidden" />
            <Button onClick={handleExtraFileClick} type="button" className="w-full">
              Seleccionar archivo...
            </Button>
          </div>
        )}

        {tipoArticulo === "regular" && (
          <div className="grid w-full items-center gap-3">
            <Label htmlFor="DetalleRegular">Abstract</Label>
            <Textarea id="DetalleRegular" placeholder="Abstract de hasta 300 caracteres..." />
          </div>
        )}
      </div>

      {/* Botones inferiores */}
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
