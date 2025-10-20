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
import type { ArticleNew } from "@/services/articleServices";
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import { UserCombobox } from "@/components/combobox/UserCombobox";
import { ConferenceCombobox } from "@/components/combobox/ConferenceCombobox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { articleSchema, type ArticleFormData } from '@/lib/validations';

// Props del componente
type ArticleFormProps = {
  users: User[];
  conferences: Conference[];
};

export default function ArticleForm({ users, conferences }: ArticleFormProps) {

  // -------------------
  // Estados principales
  // -------------------
  const [errors, setErrors] = useState<Partial<ArticleFormData>>({}); // Errores por campo para validación
  const [tipoArticulo, setTipoArticulo] = useState<string>("regular"); // Tipo de artículo (regular / poster)
  const [selectedConference, setSelectedConference] = useState<number | null>(null); // Conferencia seleccionada
  const [sessions, setSessions] = useState<Session[]>([]); // Sesiones cargadas de la conferencia
  const [loadingSessions, setLoadingSessions] = useState<boolean>(false); // Estado de carga de sesiones
  const [selectedSession, setSelectedSession] = useState<string | null>(null); // Sesión seleccionada
  const [autoresSeleccionados, setAutoresSeleccionados] = useState<User[]>([]); // Lista de autores seleccionados
  const [autorNotif, setAutorNotif] = useState<string>(""); // Autor de notificación
  const [titulo, setTitulo] = useState<string>(""); // Título del artículo
  const [abstract, setAbstract] = useState<string>(""); // Abstract
  const [archivo, setArchivo] = useState<File | null>(null); // Archivo principal
  const [archivoExtra, setArchivoExtra] = useState<File | null>(null); // Archivo extra (para poster)
  const [loading, setLoading] = useState<boolean>(false); // Estado de carga del submit
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false); // Mostrar alert de error

  const navigate = useNavigate();

  // -------------------
  // Referencias a inputs de archivos
  // -------------------
  const fileInputRef = useRef<HTMLInputElement>(null);
  const extraFileRef = useRef<HTMLInputElement>(null);

  // -------------------
  // Funciones para manejar archivos
  // -------------------
  const handleClick = () => fileInputRef.current?.click();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setArchivo(file);
  };

  const handleExtraFileClick = () => extraFileRef.current?.click();
  const handleExtraFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setArchivoExtra(file);
  };

  // -------------------
  // Manejo de autores
  // -------------------
  const handleAgregarAutor = (id: number) => {
    const autor = users.find((u) => u.id === id);
    if (autor && !autoresSeleccionados.some((a) => a.id === autor.id)) {
      setAutoresSeleccionados([...autoresSeleccionados, autor]);
    }
  };

  const handleEliminarAutor = (id: number) => {
    setAutoresSeleccionados(autoresSeleccionados.filter((a) => a.id !== id));
    if (autorNotif === String(id)) setAutorNotif(""); // limpiar si se elimina
  };

  // -------------------
  // Efecto para traer sesiones al cambiar la conferencia
  // -------------------
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

  // -------------------
  // Manejo de submit
  // -------------------
  const handleSubmit = async () => {
    setShowErrorAlert(false);

    // Datos a validar con Zod
    const formData = {
      conference: selectedConference ? String(selectedConference) : "",
      session: selectedSession ?? "",
      title: titulo.trim(),
      abstract: abstract.trim(),
      file: archivo ? archivo.name : "",
      authors: autoresSeleccionados.length > 0 ? "ok" : "",
      correspondingAuthor: autorNotif ?? "",
      sourcesFile: tipoArticulo === "poster" ? (archivoExtra ? archivoExtra.name : "") : "ok",
    };

    // Validación con Zod
    const result = articleSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<ArticleFormData> = {};
      result.error.issues.forEach((error) => {
        if (error.path[0]) fieldErrors[error.path[0] as keyof ArticleFormData] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Preparar objeto a enviar al backend
    try {
      setLoading(true);

      const article: ArticleNew = {
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

      toast.success('Artículo subido correctamente !', { duration: 5000 });
      navigate({ to: '/article/view', replace: true });
    } catch (error) {
      console.error("Error al subir el artículo:", error);
      setShowErrorAlert(true);
    } finally {
      setLoading(false);
    }
  };

  // -------------------
  // Renderizado
  // -------------------
  return (
    <div className="w-full max-w-md rounded-2xl shadow-md border p-4 bg-white flex flex-col gap-4">

      <h2 className="text-lg font-bold italic text-slate-500 text-center">Alta de Artículo</h2>
      <hr className="bg-slate-100" />

      {/* Combobox de Conferencias */}
      <Label htmlFor="conferencia">Conferencia {errors.conference && <p className="text-destructive">{errors.conference}</p>}</Label>
      <ConferenceCombobox onValueChange={setSelectedConference} conferences={conferences} />
      
      {/* Select de Sesiones */}
      <Label htmlFor="sesion">Sesión {errors.session && <p className="text-destructive">{errors.session}</p>}</Label>
      <Select value={selectedSession ?? ""} onValueChange={(value) => setSelectedSession(value)} disabled={!selectedConference || loadingSessions}>
        <SelectTrigger className="w-full hover:bg-accent hover:text-accent-foreground">
          <SelectValue placeholder={loadingSessions ? "Cargando sesiones..." : !selectedConference ? "Seleccione una conferencia primero..." : sessions.length ? "Seleccione una sesión..." : "No hay sesiones disponibles..."}/>
        </SelectTrigger>
        <SelectContent>
          {sessions.map((s) => (
            <SelectItem key={s.id} value={String(s.id)}>
              {s.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Campo de Título */}
      <Label htmlFor="titulo">Título {errors.title && <p className="text-destructive">{errors.title}</p>}</Label>
      <Input type="text" id="title" placeholder="Título del artículo..." value={titulo} onChange={(e) => setTitulo(e.target.value)}/>
      
      {/* Campo de Abstract */}
      <Label htmlFor="abstract">Abstract {errors.abstract && <p className="text-destructive">{errors.abstract}</p>}</Label>
      <Textarea id="DetalleRegular" placeholder="Hasta 300 caracteres..." value={abstract} maxLength={300} onChange={(e) => setAbstract(e.target.value)}/>

      {/* RadioGroup tipo de artículo */}
      <Label htmlFor="tipo-articulo">Tipo</Label>
      <RadioGroup defaultValue="regular" onValueChange={setTipoArticulo} className="flex flex-row gap-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="regular" id="regular" />
          <Label htmlFor="regular">Regular</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="poster" id="poster" />
          <Label htmlFor="poster">Poster</Label>
        </div>
      </RadioGroup>

      {/* Archivo principal */}
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="DetalleRegular">Artículo {errors.file && <p className="text-destructive">{errors.file}</p>}</Label>
        <input type="file" ref={fileInputRef} onChange={handleChange} className="hidden" />
        <Button variant="outline" onClick={handleClick} type="button" className={`w-full ${archivo ? "bg-lime-900" : "bg-slate-900"} text-white`}>
          {archivo ? archivo.name : "Seleccionar archivo..."}
        </Button>
      </div>

      {/* Archivo extra solo si es Poster */}
      {tipoArticulo === "poster" && (
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="DetalleRegular">Fuentes {errors.sourcesFile && <p className="text-destructive">{errors.sourcesFile}</p>}</Label>
          <input type="file" ref={extraFileRef} onChange={handleExtraFileChange} className="hidden" />
          <Button variant="outline" onClick={handleExtraFileClick} type="button" className={`w-full ${archivoExtra ? "bg-lime-900" : "bg-slate-900"} text-white`}>
            {archivoExtra ? archivoExtra.name : "Seleccionar archivo..."}
          </Button>
        </div>
      )}

      {/* Combobox de autores */}
      <Label htmlFor="autor">Autores del Artículo {errors.authors && <p className="text-destructive">{errors.authors}</p>}</Label>
      <UserCombobox onValueChange={handleAgregarAutor} users={users} />

      {/* Lista de autores seleccionados */}
      {autoresSeleccionados?.length > 0 && (
        <div className="flex flex-col gap-2 w-full">
          {autoresSeleccionados.map((a) => (
            <div key={a.id} className="flex justify-between items-center bg-gray-100 px-3 py-1 rounded-lg shadow-sm w-full">
              <span className="truncate">{a.full_name} ({a.email})</span>
              <button type="button" onClick={() => handleEliminarAutor(a.id)} className="text-red-500 hover:text-red-700">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Select de autor de notificación */}
      <Label htmlFor="autorNotif">Autor de Notificación {errors.correspondingAuthor && <p className="text-destructive">{errors.correspondingAuthor}</p>}</Label>
      <Select value={autorNotif} onValueChange={setAutorNotif} disabled={autoresSeleccionados.length === 0}>
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

      <hr className="bg-slate-100" />

      {/* Botón de submit */}
      <Button variant="outline" onClick={handleSubmit} className="w-full bg-slate-900 text-white" disabled={loading}>
        {loading ? "Subiendo..." : "Subir"}
      </Button>

      {/* Alert de error */}
      {showErrorAlert && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>
            Error
          </AlertTitle>
          <AlertDescription>
              Hubo un error al subir el artículo
          </AlertDescription>
        </Alert>
      )}
      
    </div>
  );
}
