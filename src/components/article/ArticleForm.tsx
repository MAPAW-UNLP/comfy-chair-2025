/* Componente que representa un formulario para dar de alta o modificar un artículo en una sesión de una conferencia */

// Importación de funcionalidades y librerías
import React, { useEffect, useRef, useState } from "react";
import { articleSchema } from '@/lib/validations';
import type { ArticleFormData } from '@/lib/validations';
import { useNavigate } from '@tanstack/react-router'

// Importación de componentes UI
import { toast } from 'sonner';
import { X, AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserCombobox } from "@/components/combobox/UserCombobox";

// Importación de servicios
import { createArticle } from "@/services/articleServices";
import { getSessionsByConferenceGrupo1 } from "@/services/sessionServices";
import type { User } from "@/services/userServices";
import type { Session } from "@/services/sessionServices";
import type { Article, ArticleNew } from "@/services/articleServices";
import { getConferenceById, type ConferenceG1 } from "@/services/conferenceServices";

// Props del componente
type ArticleFormProps = {
  users: User[];
  editMode ?: boolean;
  conferenceId? : number;
  article?: Article;
};

export default function ArticleForm({ users, editMode, article, conferenceId }: ArticleFormProps) {

  // Navegacion
  const navigate = useNavigate();
  const navigateBack = () => navigate({ to: `/articles/view/${conferenceId}`, replace: true });

  // Setteo de sesiones
  const [sessions, setSessions] = useState<Session[]>([]); // Sesiones pertenecientes a la conferencia seleccionada

  // Manejo de errores y estados de carga
  const [error, setError] = useState<string | null>(null); // Error general
  const [errors, setErrors] = useState<Partial<ArticleFormData>>({}); // Errores por campo para validación del form
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false); // Mostrar alert de error
  const [loading, setLoading] = useState<boolean>(false); // Estado de carga del submit
  const [loadingSessions, setLoadingSessions] = useState<boolean>(false); // Estado de carga de sesiones
  
  // Setteo de campos del formulario (solo para edición)
  const [title, setTitle] = useState<string>(""); // Título del artículo
  const [abstract, setAbstract] = useState<string>(""); // Abstract del artículo
  const [articleType, setArticleType] = useState<string>("regular"); // Tipo de artículo
  const [selectedConference, setSelectedConference] = useState< ConferenceG1 | null>(null); // Conferencia seleccionada
  const [selectedSession, setSelectedSession] = useState<string | null>(null); // Sesión seleccionada
  const [authors, setAuthors] = useState<User[]>([]); // Autores seleccionados
  const [correspondingAuthor, setCorrespondingAuthor] = useState<string>(""); // Autor de notificación

  // Manejo de archivos
  const mainFileRef = useRef<HTMLInputElement>(null); // Ref para el input de archivo principal
  const sourceFileRef = useRef<HTMLInputElement>(null); // Ref para el input de archivo de fuentes
  const [mainFile, setMainFile] = useState<File | null>(null); // Archivo principal
  const [sourceFile, setSourceFile] = useState<File | null>(null); // Archivo de fuentes (solo para posters)
  const [existingMainFileUrl, setExistingMainFileUrl] = useState<string | null>(null); // URL del archivo principal ya existente (edicion)
  const [existingMainFileName, setExistingMainFileName] = useState<string | null>(null); // Nombre del archivo principal ya existente (edicion)
  const [existingSourceFileUrl, setExistingSourceFileUrl] = useState<string | null>(null); // URL del archivo de fuentes ya existente (edicion)
  const [existingSourceFileName, setExistingSourceFileName] = useState<string | null>(null); // Nombre del archivo de fuentes ya existente (edicion)

  // -------------------
  // Efecto para cargar conferencia, sesiones y (si aplica) datos del artículo
  // -------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingSessions(true);

        const conference = await getConferenceById(conferenceId!);
        setSelectedConference(conference);

        const sessionsData = await getSessionsByConferenceGrupo1(conferenceId!);
        setSessions(sessionsData);
        
        if (editMode && article) {
          setTitle(article.title);
          setAbstract(article.abstract);
          setArticleType(article.type);
          setSelectedSession(article.session?.id ? String(article.session.id) : null);
          setAuthors(article.authors);
          setCorrespondingAuthor(String(article.corresponding_author?.id ?? ""));

          // --- Manejo de archivos ---
          const mf: any = article.main_file;
          const sf: any = article.source_file;

          // Archivo principal
          if (mf) {
            const url = typeof mf === "string" ? mf : mf.url ?? null;
            setExistingMainFileUrl(url);
            if (url) {
              try {
                const parts = url.split("/");
                setExistingMainFileName(decodeURIComponent(parts[parts.length - 1]));
              } catch {
                setExistingMainFileName(String(mf));
              }
            } else {
              setExistingMainFileName(typeof mf === "string" ? mf : null);
            }
          }

          // Archivo de fuentes
          if (sf) {
            const urlS = typeof sf === "string" ? sf : sf.url ?? null;
            setExistingSourceFileUrl(urlS);
            if (urlS) {
              try {
                const parts = urlS.split("/");
                setExistingSourceFileName(decodeURIComponent(parts[parts.length - 1]));
              } catch {
                setExistingSourceFileName(String(sf));
              }
            } else {
              setExistingSourceFileName(typeof sf === "string" ? sf : null);
            }
          } else {
            setExistingSourceFileUrl(null);
            setExistingSourceFileName(null);
          }
        } else {
          // Si no está en modo edición, limpiar posibles residuos
          setSelectedSession(null);
          setExistingMainFileUrl(null);
          setExistingMainFileName(null);
          setExistingSourceFileUrl(null);
          setExistingSourceFileName(null);
        }

      } catch (err) {
        console.error("Error cargando conferencia, sesiones o artículo:", err);
        setSelectedConference(null);
        setSessions([]);
        setSelectedSession(null);
      } finally {
        setLoadingSessions(false);
      }
    };

    if (conferenceId) {
      fetchData();
    }
  }, [conferenceId, editMode, article]);

  // -------------------
  // Efecto para traer sesiones al cambiar la conferencia
  // -------------------
  useEffect(() => {
    const fetchConference = async () => {
      try {
        const conference = await getConferenceById(conferenceId!);
        setSelectedConference(conference);

        setLoadingSessions(true);

        const data = await getSessionsByConferenceGrupo1(conferenceId!);
        setSessions(data);

        // Si estamos editando, preseleccionamos la sesión si corresponde
        if (editMode && article?.session && article.session.conference?.id === conferenceId) {
          setSelectedSession(String(article.session.id));
        } else {
          setSelectedSession(null);
        }

      } catch (err) {
        console.error("Error cargando conferencia o sesiones:", err);
        setSessions([]);
        setSelectedSession(null);
      } finally {
        setLoadingSessions(false);
      }
    };

    if (conferenceId) {
      fetchConference();
    }

  }, [conferenceId, editMode, article]);

  // -------------------
  // Manejo de la seleccion de archivos
  // -------------------
  const handleMainFileClick = () => mainFileRef.current?.click();

  const handleMainFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setMainFile(file);
  };

  const handleSourceFileClick = () => sourceFileRef.current?.click();

  const handleSourceFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSourceFile(file);
  };

  // -------------------
  // Manejo de la seleccion de autores
  // -------------------
  const handleAgregarAutor = (id: number) => {
    const autor = users.find((u) => u.id === id);
    if (autor && !authors.some((a) => a.id === autor.id)) {
      setAuthors([...authors, autor]);
    }
  };

  const handleEliminarAutor = (id: number) => {
    setAuthors(authors.filter((a) => a.id !== id));
    if (correspondingAuthor === String(id)) setCorrespondingAuthor(""); // limpiar si se elimina
  };

  // -------------------
  // Manejo del boton de cancelación
  // -------------------
  const handleCancel = () => {
    navigateBack();
  }

  // -------------------
  // Manejo del boton de submit
  // -------------------
  const handleSubmit = async () => {

    setShowErrorAlert(false);

    // Datos a validar con Zod
    const formData = {
      conference: selectedConference ? String(selectedConference) : "",
      session: selectedSession ?? "",
      title: title.trim(),
      abstract: abstract.trim(),
      file: mainFile ? mainFile.name : "",
      authors: authors.length > 0 ? "ok" : "",
      correspondingAuthor: correspondingAuthor ?? "",
      sourcesFile: articleType === "poster" ? (sourceFile ? sourceFile.name : "") : "ok",
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
        title: title,
        main_file: mainFile!,
        source_file: articleType === "poster" ? sourceFile : null,
        status: 'reception',
        type: articleType,
        abstract: abstract,
        authors: authors.map((a) => a.id),
        corresponding_author: Number(correspondingAuthor),
        session: Number(selectedSession),
      };

      const response = await createArticle(article);
      console.log("Article Submit: ", response);

      toast.success('Artículo subido correctamente !', { duration: 5000 });
      navigateBack();

    } catch (error) {

      console.error("Error al subir el artículo: ", error);
      setError((error as Error).message);
      setShowErrorAlert(true);

    } finally {
      setLoading(false);
    }
  };

  // -------------------
  // Manejo del boton de update (edit mode)
  // -------------------
  const handleUpdate = async () => {

    if (!article) return;

    setShowErrorAlert(false);

    // Datos a validar con Zod
    const formDataForValidation = {
      conference: selectedConference ? String(selectedConference) : "",
      session: selectedSession ?? "",
      title: title.trim(),
      abstract: abstract.trim(),
      file: mainFile ? mainFile.name : existingMainFileName ?? "",
      authors: authors.length > 0 ? "ok" : "",
      correspondingAuthor: correspondingAuthor ?? "",
      sourcesFile: articleType === "poster" ? (sourceFile ? sourceFile.name : existingSourceFileName ?? "") : "ok",
    };

    // Validación con Zod
    const result = articleSchema.safeParse(formDataForValidation);
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

      const updated: import('@/services/articleServices').ArticleUpdate = {
        title: title,
        abstract: abstract,
        type: articleType,
        status: 'reception',
        authors: authors.map((a) => a.id),
        corresponding_author: correspondingAuthor ? Number(correspondingAuthor) : null,
        session: selectedSession ? Number(selectedSession) : null,
      };

      // Archivo principal
      if (mainFile) {
        updated.main_file = mainFile;
      }

      // Archivo fuentes
      if (articleType === "regular") {
        updated.source_file = null; // Si es regular, fuerzo el campo source_file = null para borrar cualquier referencia vieja
      } else if (sourceFile) {
        updated.source_file = sourceFile;
      }

      const response = await import('@/services/articleServices').then(mod => mod.updateArticle(article.id, updated));
      console.log('Article Update: ', response);
      
      toast.success('Artículo actualizado correctamente !', { duration: 5000 });
      navigateBack();

    } catch (error) {

      console.error('Error al actualizar el artículo: ', error);
      setError((error as Error).message);
      setShowErrorAlert(true);

    } finally {
      setLoading(false);
    }
  };

  // -------------------
  // Renderizado del componente
  // -------------------
  return (
    <div className="w-full max-w-3xl rounded-2xl shadow-md border p-4 bg-white flex flex-col gap-4">

      {/* Titulo del Form */}
      <h2 className="text-lg font-bold italic text-slate-500 text-center">
        {!editMode ? "Alta de Artículo" : "Editar Artículo"}
      </h2>

      <hr className="bg-slate-100" />

      {/* Conferencia y Sesión */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        
        {/* Conferencia (solo lectura) */}
        <div className="flex-1 flex flex-col gap-2">
          <Label htmlFor="conferencia">Conferencia {errors.conference && <p className="text-destructive">{errors.conference}</p>}</Label>
          <Input type="text" id="conference" placeholder="Conferencia" value={selectedConference?.title} disabled/>
        </div>

        {/* Select de Sesiones */}
        <div className="flex-1 flex flex-col gap-2">
          <Label htmlFor="sesion">
            Sesión {errors.session && <p className="text-destructive">{errors.session}</p>}
          </Label>
          <Select value={selectedSession ?? ""} onValueChange={(value) => setSelectedSession(value)} disabled={!selectedConference || loadingSessions}>
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
        </div>
      </div>

      {/* Campo de Título */}
      <div className="flex-1 flex flex-col gap-2">
        <Label htmlFor="titulo">Título {errors.title && <p className="text-destructive">{errors.title}</p>}</Label>
        <Input type="text" id="title" placeholder="Título del artículo..." maxLength={100} value={title} onChange={(e) => setTitle(e.target.value)}/>
      </div>
      
      {/* Campo de Abstract */}
      <div className="flex-1 flex flex-col gap-2">
        <Label htmlFor="abstract">Abstract {errors.abstract && <p className="text-destructive">{errors.abstract}</p>}</Label>
        <Textarea id="DetalleRegular" placeholder="Hasta 300 caracteres..." value={abstract} maxLength={300} onChange={(e) => setAbstract(e.target.value)}/>
      </div>

      {/* RadioGroup tipo de artículo */}
      <div className="flex-1 flex flex-col gap-2">   
        <Label htmlFor="tipo-articulo">Tipo</Label>
        <RadioGroup value={articleType} onValueChange={setArticleType} className="flex flex-row gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={"regular"} id="regular" />
            <Label htmlFor="regular">Regular</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="poster" id="poster" />
            <Label htmlFor="poster">Poster</Label>
          </div>
        </RadioGroup>
      </div> 

      {/* Archivos */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        
        {/* Archivo principal */}
        <div className="flex-1 grid items-start gap-2">
          <Label htmlFor="DetalleRegular">
            Artículo {errors.file && <p className="text-destructive">{errors.file}</p>}
          </Label>
          <input type="file" ref={mainFileRef} onChange={handleMainFileChange} className="hidden" />
          <Button
            variant="outline"
            onClick={handleMainFileClick}
            type="button"
            className={`w-full text-white ${
              mainFile
                ? "bg-lime-900"                     
                : editMode && existingMainFileName  
                ? "bg-lime-900"
                : "bg-slate-900"                    
            }`}
          >
            {mainFile
              ? mainFile.name
              : existingMainFileName
              ? existingMainFileName
              : "Seleccionar archivo..."}
          </Button>
        </div>  

        {/* Archivo de fuentes solo si es Poster */}
        {articleType === "poster" && (
          <div className="flex-1 grid items-start gap-2">
            <Label htmlFor="DetalleRegular">
              Fuentes {errors.sourcesFile && <p className="text-destructive">{errors.sourcesFile}</p>}
            </Label>
            <input type="file" ref={sourceFileRef} onChange={handleSourceFileChange} className="hidden" />
            <Button
              variant="outline"
              onClick={handleSourceFileClick}
              type="button"
              className={`w-full text-white ${
                sourceFile
                  ? "bg-lime-900"                         
                  : editMode && existingSourceFileName   
                  ? "bg-lime-900"
                  : "bg-slate-900"                        
              }`}
            >
              {sourceFile
                ? sourceFile.name
                : existingSourceFileName
                ? existingSourceFileName
                : "Seleccionar archivo..."}
            </Button>
          </div>
        )}

      </div>

      {/* Links de archivos actuales (solo en modo edición) */}
      {editMode && (existingMainFileUrl || existingSourceFileUrl) && (
        <div className="flex flex-col md:flex-row gap-2 items-start justify-between text-xs text-sky-600">
          
          {/* Link archivo principal */}
          {existingMainFileUrl && (
            <a
              href={existingMainFileUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              Ver archivo actual{existingMainFileName ? `: ${existingMainFileName}` : ""}
            </a>
          )}

          {/* Link archivo fuentes (solo si es poster y tiene fuente previa) */}
          {articleType === "poster" && existingSourceFileUrl && (
            <a
              href={existingSourceFileUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
             Ver fuentes actuales{existingSourceFileName ? `: ${existingSourceFileName}` : ""}
            </a>
          )}
        </div>
      )}

      {/* Combobox de autores */}
      <div className="flex-1 flex flex-col gap-2">
        <Label htmlFor="autor">Autores del Artículo {errors.authors && <p className="text-destructive">{errors.authors}</p>}</Label>
        <UserCombobox onValueChange={handleAgregarAutor} backgroundWhite={true} users={users} />
      </div>

      {/* Lista de autores seleccionados */}
      {authors?.length > 0 && (
        <div className="flex flex-col gap-2 w-full">
          {authors.map((a) => (
            <div key={a.id} className="flex justify-between items-center bg-gray-100 px-3 py-1 rounded-lg shadow-sm w-full">
              <span className="truncate text-sm">{a.full_name} ({a.email})</span>
              <button type="button" onClick={() => handleEliminarAutor(a.id)} className="text-red-500 hover:text-red-700">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Select de autor de notificación */}
      <div className="flex-1 flex flex-col gap-2">
        <Label htmlFor="autorNotif">Autor de Notificación {errors.correspondingAuthor && <p className="text-destructive">{errors.correspondingAuthor}</p>}</Label>
        <Select value={correspondingAuthor} onValueChange={setCorrespondingAuthor} disabled={authors.length === 0}>
          <SelectTrigger className="w-full hover:bg-accent hover:text-accent-foreground">
            <SelectValue placeholder={authors.length > 0 ? "Seleccione un autor..." : "Seleccione un autor primero..."} />
          </SelectTrigger>
          <SelectContent>
            {authors.map((a) => (
              <SelectItem key={a.id} value={String(a.id)}>
                {a.full_name} ({a.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <hr className="bg-slate-100" />

      {/* Botones inferiores */}
      <div className="flex flex-row gap-2">
        <Button variant="outline" onClick={handleCancel} className="flex-1 bg-zinc-500 text-white" disabled={loading}>
          Cancelar
        </Button>
        <Button variant="outline" onClick={editMode ? handleUpdate : handleSubmit} className="flex-1 bg-slate-900 text-white" disabled={loading}>
          {loading ? editMode ? "Guardando..." : "Subiendo..." : editMode ? "Guardar" : "Subir"}
        </Button>
      </div>
        
      {/* Alert de error */}
      {showErrorAlert && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>
            Error
          </AlertTitle>
          <AlertDescription>
              Hubo un error al subir el artículo {error}
          </AlertDescription>
        </Alert>
      )}
      
    </div>
  );
}
