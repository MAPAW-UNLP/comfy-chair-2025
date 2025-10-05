import React, { useEffect, useRef, useState } from "react";
import { createArticle } from "@/services/newArticle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import type { User } from "@/services/users";
import type { Conference } from "@/services/conferences"; 
import { getSessionsByConference } from "@/services/sessions";
import type { Session } from "@/services/sessions";
import type { Articulo } from "@/services/newArticle";

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
  const [autoresSeleccionados, setAutoresSeleccionados] = useState<User[]>([]);
  const [autorNotif, setAutorNotif] = useState<string>("");

  /*manu*/
  const [titulo, setTitulo] = useState<string>("");
  const [abstract, setAbstract] = useState<string>("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [archivoExtra, setArchivoExtra] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

  // Manejo de autores
  const handleAgregarAutor = (id: string) => {
    const autor = users.find((u) => String(u.id) === id);
    if (autor && !autoresSeleccionados.some((a) => a.id === autor.id)) {
      setAutoresSeleccionados([...autoresSeleccionados, autor]);
    }
  };

  const handleEliminarAutor = (id: number) => {
    setAutoresSeleccionados(autoresSeleccionados.filter((a) => a.id !== id));
    if (autorNotif === String(id)) {
      setAutorNotif(""); // limpiar autorNotif si se elimina
    }
  };

  // Efecto para traer sesiones al cambiar conferencia
  useEffect(() => {
    if (selectedConference) {
      setLoadingSessions(true);
      setSelectedSession(null);
      getSessionsByConference(Number(selectedConference))
        .then((data) => setSessions(data))
        .catch((err) => console.error("Error cargando sesiones:", err))
        .finally(() => setLoadingSessions(false));
    } else {
      setSessions([]);
      setSelectedSession(null);
    }
  }, [selectedConference]);

const handleSubmit = async () => {
  try {
    /*
    if (!titulo || !selectedConference || !selectedSession || !archivo || !autorNotif) {
      alert("Complete todos los campos obligatorios antes de enviar.");
      return;
    }
*/
    setLoading(true);

    // Construimos el objeto Articulo con la estructura correcta
    const article: Articulo = {
      title: titulo,
      main_file_url:"https://www.example.com/archivo.pdf",
      status: 'reception',
      article_type: tipoArticulo,
      abstract: tipoArticulo === "regular" ? abstract : "",
      source_file_url: archivoExtra?.name || "",
      authors: autoresSeleccionados.map((a) => a.id),
      notification_author: Number(autorNotif),
      session_id: Number(selectedSession),
    };

    console.log("Datos a enviar:", article);

    const response = await createArticle(article);
    console.log("Artículo creado:", response);

    alert("Artículo subido correctamente 🎉");
  } catch (error) {
    console.error("Error al subir el artículo:", error);
    alert("Hubo un error al subir el artículo.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="w-full max-w-md rounded-2xl shadow-md border p-4 bg-white flex flex-col gap-4">
      <h2 className="text-lg font-bold italic text-slate-500 text-center">Alta de Artículo</h2>
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

      {/* Select de Sesiones */}
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
      <Input
        type="text"
        id="title"
        placeholder="Título del artículo..."
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        />

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
      <Select onValueChange={handleAgregarAutor}>
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

      {/* Lista de autores seleccionados */}
      <div className="flex flex-wrap gap-2">
        {autoresSeleccionados.map((a) => (
          <div
            key={a.id}
            className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full shadow-sm"
          >
            <span>
              {a.first_name} {a.last_name}
            </span>
            <button
              type="button"
              onClick={() => handleEliminarAutor(a.id)}
              className="text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Select de autor de notificación */}
      <Label htmlFor="autorNotif">Autor de Notificación</Label>
      <Select
        value={autorNotif}
        onValueChange={setAutorNotif}
        disabled={autoresSeleccionados.length === 0}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccione un autor..." />
        </SelectTrigger>
        <SelectContent>
          {autoresSeleccionados.map((a) => (
            <SelectItem key={a.id} value={String(a.id)}>
              {a.first_name} {a.last_name}
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
          <Textarea
            id="DetalleRegular"
            placeholder="Abstract de hasta 300 caracteres..."
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
          />
        )}
      </div>

      {/* Botones inferiores */}
      <div id="bottom-buttons" className="flex w-full gap-2">
        <Button  variant="outline" className="w-1/2">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} className="w-1/2">
          Subir
        </Button>
      </div>
    </div>
  );
}
