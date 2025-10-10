/* Componente que representa un formulario para dar de alta un artículo en una sesión de una conferencia */

// Importaciones
import React, { useEffect, useRef, useState } from "react";
import { createArticle, type Articulo } from "@/services/articleServices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { User } from "@/services/userServices";
import type { Conference } from "@/services/conferenceServices";
import { getSessionsByConference, type Session } from "@/services/sessionServices";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { UserCombobox } from "@/components/combobox/UserCombobox";
import { ConferenceCombobox } from "@/components/combobox/ConferenceCombobox";

type AltaArticuloProps = {
  users: User[];
  conferences: Conference[];
};

export default function ArticuloForm({ users, conferences }: AltaArticuloProps) {
  const navigate = useNavigate();

  // Referencias a los inputs de archivos
  const fileInputRef = useRef<HTMLInputElement>(null);
  const extraFileRef = useRef<HTMLInputElement>(null);

  // Estados del formulario
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedConference, setSelectedConference] = useState<number | null>(null);
  const [titulo, setTitulo] = useState("");
  const [abstract, setAbstract] = useState("");
  const [tipoArticulo, setTipoArticulo] = useState("");
  const [autoresSeleccionados, setAutoresSeleccionados] = useState<User[]>([]);
  const [autorNotif, setAutorNotif] = useState<User | null>(null);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [archivoExtra, setArchivoExtra] = useState<File | null>(null);

  // Estados de carga y validación
  const [loading, setLoading] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Handlers para archivos
  const handleClick = () => fileInputRef.current?.click();
  const handleExtraFileClick = () => extraFileRef.current?.click();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setArchivo(file);
  };

  const handleExtraFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setArchivoExtra(file);
  };

  // Agregar y eliminar autores
  const handleAgregarAutor = (id: number) => {
    const autor = users.find((u) => u.id === id);
    if (autor && !autoresSeleccionados.some((a) => a.id === autor.id)) {
      setAutoresSeleccionados((prev) => [...prev, autor]);
    }
  };

  const handleEliminarAutor = (id: number) => {
    setAutoresSeleccionados((prev) => prev.filter((a) => a.id !== id));
    if (autorNotif && autorNotif.id === id) {
      setAutorNotif(null);
    }
  };

  // Efecto: cargar sesiones cuando cambia la conferencia
  useEffect(() => {
    if (selectedConference) {
      setLoadingSessions(true);
      setSelectedSession(null);
      getSessionsByConference(selectedConference)
        .then((data) => {
          setSessions(data);
        })
        .catch((err) => console.error("Error cargando sesiones:", err))
        .finally(() => setLoadingSessions(false));
    } else {
      setSessions([]);
      setSelectedSession(null);
    }
  }, [selectedConference]);

  // Manejo del envío
  const handleSubmit = async () => {
    setShowErrorAlert(false);
    setValidationErrors([]);

    const errors: string[] = [];

    if (!titulo.trim()) errors.push("El título es obligatorio");
    if (!selectedConference) errors.push("Debe seleccionar una conferencia");
    if (!selectedSession) errors.push("Debe seleccionar una sesión");
    if (autoresSeleccionados.length === 0) errors.push("Debe agregar al menos un autor");
    if (!autorNotif) errors.push("Debe seleccionar un autor de notificación");
    if (!archivo) errors.push("Debe seleccionar un archivo principal");
    if (tipoArticulo !== "regular" && tipoArticulo !== "poster")
      errors.push("Debe seleccionar un tipo de artículo");
    if (tipoArticulo === "regular" && !abstract.trim())
      errors.push("El abstract es obligatorio para artículos regulares");
    if (tipoArticulo === "poster" && !archivoExtra)
      errors.push("El archivo de fuentes es obligatorio para posters");

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setLoading(true);

      // 🔧 Corrección: selectedSession y autorNotif pueden ser null, los casteamos
      const article: Articulo = {
        title: titulo,
        main_file: archivo!,
        source_file: tipoArticulo === "poster" ? archivoExtra : null,
        status: "reception",
        type: tipoArticulo,
        abstract: tipoArticulo === "regular" ? abstract : "",
        authors: autoresSeleccionados,
        corresponding_author: autorNotif!,
        session: selectedSession!,
      };

      console.log("Datos a enviar:", article);
      const response = await createArticle(article);
      console.log("Artículo creado:", response);

      toast.success("Artículo subido correctamente!", { duration: 5000 });
      navigate({ to: "/articulo/visualizacion", replace: true });
    } catch (error) {
      console.error("Error al subir el artículo:", error);
      setShowErrorAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl shadow-md border p-4 bg-white flex flex-col gap-4">
      {/* Título */}
      <h2 className="text-lg font-bold italic text-slate-500 text-center">
        Alta de Artículo
      </h2>
      <hr className="bg-slate-100" />

      {/* Conferencia */}
      <Label htmlFor="conferencia">Conferencia</Label>
      <ConferenceCombobox
        onValueChange={(value) => setSelectedConference(Number(value))}
        conferences={conferences}
      />

      {/* Sesión */}
      <Label htmlFor="sesion">Sesión</Label>
      <Select
        // 🔧 Debe ser el id, no el título
        value={selectedSession ? String(selectedSession.id) : ""}
        onValueChange={(value) => {
          const sesion = sessions.find((s) => String(s.id) === value);
          setSelectedSession(sesion || null);
        }}
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

      {/* Título */}
      <Label htmlFor="titulo">Título</Label>
      <Input
        id="titulo"
        placeholder="Título del artículo..."
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      {/* Archivo principal */}
      <div className="grid w-full items-center gap-3">
        <Label>Artículo</Label>
        <input type="file" ref={fileInputRef} onChange={handleChange} className="hidden" />
        <Button
          variant="outline"
          onClick={handleClick}
          type="button"
          className={`w-full ${archivo ? "bg-lime-900" : "bg-slate-900"} text-white`}
        >
          {archivo ? "Archivo Seleccionado" : "Seleccionar archivo..."}
        </Button>
      </div>

      {/* Autores */}
      <Label>Autores del Artículo</Label>
      <UserCombobox onValueChange={handleAgregarAutor} users={users} />

      {autoresSeleccionados.length > 0 && (
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

      {/* Autor de notificación */}
      <Label>Autor de Notificación</Label>
      <Select
        value={autorNotif ? String(autorNotif.id) : ""}
        onValueChange={(value) => {
          const autor = autoresSeleccionados.find((a) => String(a.id) === value);
          setAutorNotif(autor || null);
        }}
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

      {/* Tipo de artículo */}
      <Label>Tipo de Artículo</Label>
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
          <Label>Fuentes</Label>
          <input type="file" ref={extraFileRef} onChange={handleExtraFileChange} className="hidden" />
          <Button
            variant="outline"
            onClick={handleExtraFileClick}
            type="button"
            className={`w-full ${archivoExtra ? "bg-lime-900" : "bg-slate-900"} text-white`}
          >
            {archivoExtra ? "Archivo Seleccionado" : "Seleccionar archivo..."}
          </Button>
        </div>
      )}

      {tipoArticulo === "regular" && (
        <Textarea
          placeholder="Abstract de hasta 300 caracteres..."
          value={abstract}
          maxLength={300}
          onChange={(e) => setAbstract(e.target.value)}
        />
      )}

      <hr className="bg-slate-100" />

      {/* Botón de envío */}
      <Button
        variant="outline"
        onClick={handleSubmit}
        className="w-full bg-slate-900 text-white"
        disabled={loading}
      >
        {loading ? "Subiendo..." : "Subir"}
      </Button>

      {/* Alertas */}
      {showErrorAlert && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Hubo un error al subir el artículo.</AlertDescription>
        </Alert>
      )}

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
