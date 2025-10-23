/* Componente que muestra una sesión individual */

import { useState, useEffect } from "react";
import { axiosInstance as api } from "@/services/api";
import type { Session } from "@/services/sessionServices";
import { Loader2 } from "lucide-react";
import { Route } from "@/routes/conference/session/$id";

function ASession() {
  const sessionInicial = Route.useLoaderData();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(sessionInicial);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/session/${sessionInicial.id}/`);
      setSession(response.data);
    } catch (error) {
      console.error("Error al cargar la sesión:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="">
      {session && session.title}
      <p>Falta esta view</p>
    </div>
  );
}

export default ASession;