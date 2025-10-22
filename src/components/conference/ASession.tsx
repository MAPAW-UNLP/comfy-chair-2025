/* Componente que muestra una sesión individual */

import { useState, useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import { axiosInstance as api } from "@/services/api";
import type { Session } from "@/services/sessionServices";
import SessionCard from "./SessionCard";
import { Loader2 } from "lucide-react";

function ASession() {
  const params = useParams({ strict: false }) as { sessionId?: string };
  const sessionId = params.sessionId;
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = async () => {
    if (!sessionId) return;
    try {
      setLoading(true);
      const response = await api.get(`/api/session/${sessionId}/`);
      setSession(response.data);
    } catch (error) {
      console.error("Error al cargar la sesión:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Sesión no encontrada</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <SessionCard session={session} onSessionUpdated={fetchSession} />
    </div>
  );
}

export default ASession;