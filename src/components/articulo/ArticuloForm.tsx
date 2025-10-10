/* Componente que representa un formulario para dar de alta un artículo en una sesión de una conferencia */

// Importaciones
import React, { useEffect, useRef, useState } from "react";
import { createArticle } from "@/services/articleServices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { User } from "@/services/userServices";
import type { Conference } from "@/services/conferenceServices"; 
import { getSessionsByConference } from "@/services/sessionServices";
import type { Session } from "@/services/sessionServices";
import type { ArticuloNuevo } from "@/services/articleServices";
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import { UserCombobox } from "@/components/combobox/UserCombobox";
import { ConferenceCombobox} from "@/components/combobox/ConferenceCombobox";

type AltaArticuloProps = {
  users: User[];
  conferences: Conference[];
};

export default function AltaArticulo({ users, conferences }: AltaArticuloProps) { 

  //Debug
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  // Referencias a los inputs de archivos
  const fileInputRef = useRef<HTMLInputElement>(null);
  const extraFileRef = useRef<HTMLInputElement>(null);

  const [tipoArticulo, setTipoArticulo] = useState<string>("");
  const [selectedConference, setSelectedConference] = useState<number | null>(null);
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
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleClick = () => fileInputRef.current?.click();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setArchivo(file);
    }
  };

  const handleExtraFileClick = () => extraFileRef.current?.click();
  const handleExtraFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setArchivoExtra(file);
    }
  };

  // Manejo de autores
  const handleAgregarAutor = (id: number) => {
    const autor = users.find((u) => u.id === id);
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
  // Limpiar alertas anteriores
  setShowErrorAlert(false);
  setValidationErrors([]);

  // Validaciones
  const errors: string[] = [];
  
  if (!titulo.trim()) {
    errors.push("El título es obligatorio");
  }

  if (!abstract.trim()) {
    errors.push("El abstract es obligatorio");
  }
  
  if (!selectedConference) {
    errors.push("Debe seleccionar una conferencia");
  }
  
  if (!selectedSession) {
    errors.push("Debe seleccionar una sesión");
  }
  
  if (autoresSeleccionados.length === 0) {
    errors.push("Debe agregar al menos un autor");
  }
  
  if (!autorNotif) {
    errors.push("Debe seleccionar un autor de notificación");
  }
  
  if (!archivo) {
    errors.push("Debe seleccionar un archivo principal");
  }
  
  if (tipoArticulo !== "regular" && tipoArticulo !== "poster") {
    errors.push("Debe seleccionar un tipo de articulo");
  }

  if (tipoArticulo === "poster" && !archivoExtra) {
    errors.push("El archivo de fuentes es obligatorio para posters");
  }

  if (errors.length > 0) {
    setValidationErrors(errors);
    return;
  }

  try {
    setLoading(true);

    // Construimos el objeto Articulo con la estructura correcta
    const article: ArticuloNuevo = {
      title: titulo,
      main_file: archivo!,
      source_file: tipoArticulo === "poster" ? archivoExtra : null,
      status: 'reception',
      type: tipoArticulo,
      abstract: abstract,
      authors: autoresSeleccionados.map((a) => a.id),
      corresponding_author: Number(autorNotif),
      session: Number(selectedSession),
    };

    console.log("Datos a enviar:", article);

    const response = await createArticle(article);
    console.log("Artículo creado:", response);

    toast.success('Artículo subido correctamente !', {
      duration: 5000,
    });
    navigate({ to: '/articulo/visualizacion', replace: true });
  } catch (error) {
    console.error("Error al subir el artículo:", error);
    setError(String(error));
    setShowErrorAlert(true);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="w-full max-w-md rounded-2xl shadow-md border p-4 bg-white flex flex-col gap-4">
      <h2 className="text-lg font-bold italic text-slate-500 text-center">Alta de Artículo</h2>
      <hr className="bg-slate-100" />

      {/* Combobox de Conferencias */}
      <Label htmlFor="conferencia">Conferencia</Label>
      <ConferenceCombobox onValueChange={setSelectedConference} conferences={conferences} />
 
      {/* Select de Sesiones */}
      <Label htmlFor="sesion">Sesión</Label>
      <Select
        value={selectedSession ?? ""}
        onValueChange={(value) => setSelectedSession(value)}
        disabled={!selectedConference || loadingSessions}
      >
        <SelectTrigger className="w-full hover:bg-accent hover:text-accent-foreground">
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
      <Label htmlFor="autor">Título</Label>
      <Input
        type="text"
        id="title"
        placeholder="Título del artículo..."
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      {/* Campo de abstract */}
      <Label htmlFor="autor">Abstract</Label>
      <Textarea
        id="DetalleRegular"
        placeholder="Hasta 300 caracteres..."
        value={abstract}
        maxLength={300}
        onChange={(e) => setAbstract(e.target.value)}
      />

      {/* Archivo principal */}
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="DetalleRegular">Artículo</Label>
        <input type="file" ref={fileInputRef} onChange={handleChange} className="hidden" />
        <Button variant="outline" onClick={handleClick} type="button" className={`w-full ${archivo ? "bg-lime-900" : "bg-slate-900"} text-white`}>
          {archivo ? "Archivo Seleccionado" : "Seleccionar archivo..."}
        </Button>
      </div>

      {/* Combobox de autores */}
      <Label htmlFor="autor">Autores del Artículo</Label>
      <UserCombobox onValueChange={handleAgregarAutor} users={users} />

      {/* Lista de autores seleccionados (solo renderiza si hay autores) */}
      {autoresSeleccionados?.length > 0 && (
        <div className="flex flex-col gap-2 w-full">
          {autoresSeleccionados.map((a) => (
            <div
              key={a.id}
              className="flex justify-between items-center bg-gray-100 px-3 py-1 rounded-lg shadow-sm w-full"
            >
              <span className="truncate">
                {a.full_name} ({a.email})
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
      )}

      {/* Select de autor de notificación */}
      <Label htmlFor="autorNotif">Autor de Notificación</Label>
      <Select
        value={autorNotif}
        onValueChange={setAutorNotif}
        disabled={autoresSeleccionados.length === 0}
      >
        <SelectTrigger className="w-full hover:bg-accent hover:text-accent-foreground">
          <SelectValue placeholder="Seleccione un autor primero..." />
        </SelectTrigger>
        <SelectContent>
          {autoresSeleccionados.map((a) => (
            <SelectItem key={a.id} value={String(a.id)}>
              {a.full_name} ({a.email})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Select tipo de artículo */}
      <Label htmlFor="tipo-articulo">Tipo de Artículo</Label>
      <Select value={tipoArticulo} onValueChange={setTipoArticulo}>
        <SelectTrigger className="w-full hover:bg-accent hover:text-accent-foreground">
          <SelectValue placeholder="Seleccione un tipo..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="regular">Regular</SelectItem>
          <SelectItem value="poster">Poster</SelectItem>
        </SelectContent>
      </Select>

      {/* Campos dinámicos */}
      {tipoArticulo === "poster" && (
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="DetalleRegular">Fuentes</Label>
          <input type="file" ref={extraFileRef} onChange={handleExtraFileChange} className="hidden" />
          <Button variant="outline" onClick={handleExtraFileClick} type="button" className={`w-full ${archivoExtra ? "bg-lime-900" : "bg-slate-900"} text-white`}>
           {archivoExtra ? "Archivo Seleccionado" : "Seleccionar archivo..."}
          </Button>
        </div>
      )}

      <hr className="bg-slate-100" />

      {/* Boton inferior */}
      <Button variant="outline" onClick={handleSubmit} className="w-full bg-slate-900 text-white" disabled={loading}>
        {loading ? "Subiendo..." : "Subir"}
      </Button>

      {/* Error Alert */}
      {showErrorAlert && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Hubo un error al subir el artículo.
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Validation Errors Alert */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Campos obligatorios</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}