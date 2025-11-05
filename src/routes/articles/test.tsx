// -------------------------------------------------------------------------------------- 
//
// Grupo 1 - COMPONENTE PROVISORIO DE ACCESO A ARTÍCULOS POR CONFERENCIA
//
// El componente funciona como un "dashboard" temporal que permite al usuario seleccionar 
// una conferencia y acceder a sus artículos correspondientes.
//
// Anteriormente existía una vista global de todos los artículos, pero se eliminó
// por pedido del profesor Juan Cruz. A partir de ahora, los artículos 
// solo deben visualizarse dentro del contexto de una conferencia específica.
//
// Este componente cumple un rol provisorio hasta que el grupo 5 implemente el 
// dashboard de inicio, en el que un usuario puede seleccionar conferencias en las que 
// tiene rol de "autor", y asi poder ver, subir y editar articulos de la misma.
//
// ----------------------------------------------------------------------------- 

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getActiveConferences } from '@/services/conferenceServices';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { type Conference } from '@/components/conference/ConferenceApp';

export const Route = createFileRoute('/articles/test')({
  component: RouteComponent,
})

function RouteComponent() {

    // Navegacion
    const navigate = useNavigate();
    const handleClick = (conferenceId : number) => navigate({ to: `/articles/${conferenceId}`, replace: true });

    // Estado de carga
    const [loading, setLoading] = useState(true);

    // Listado de Conferencias
    const [conferences, setConferences] = useState<Conference[]>([]);

    // Efecto para traer las conferencias activas
    useEffect(() => {

        const fetchConferences = async () => {
            try {
                const data = await getActiveConferences();
                setConferences(data);
            } catch {
                console.error("Error al obtener las conferencias");
            } finally {
                setLoading(false);
            }
        };

        fetchConferences();

    }, []);

    // Spinner de carga
    if (loading) {
        return (
        <div className="flex items-center justify-center w-full min-h-full">
            <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
        );
    }

    // Mensaje si no hay conferencias activas
    if (conferences. length === 0) {
        return (
        <div className="flex flex-col items-center justify-center w-full min-h-full">
            <h1 className="text-2xl font-bold italic text-slate-500 text-center">
                No hay conferencias activas...
            </h1>
        </div>
        );
    }
  
    // Cuerpo del componente
    return (
        <div className="flex flex-col items-center mx-4 my-6">

            {/* Título */}
            <h1 className="text-center text-2xl font-bold text-red-500 mb-6">
                COMPONENTE PROVISORIO UNICAMENTE PARA TESTING
            </h1>

            {/* Título */}
            <h1 className="text-2xl font-bold italic text-slate-500 mb-6">
                Conferencias Activas
            </h1>

            {/* Botones */}
            <div className="flex flex-wrap gap-4 justify-center">
                {conferences.map((conference) => (
                    <Button variant={"outline"} key={conference.id} onClick={() => handleClick(conference.id)} className="px-6 py-3 bg-slate-900 text-white rounded-lg shadow-md">
                        {conference.title}
                    </Button>
                ))}
            </div>

        </div>
    );

}