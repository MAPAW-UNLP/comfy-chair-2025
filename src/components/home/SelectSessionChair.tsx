import { useEffect, useState } from "react"
import { getAllSessions, type Session } from "@/services/sessionServices"
import { useNavigate } from "@tanstack/react-router"

export function SelectSessionChair() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllSessions()
        setSessions(data)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const selectSession = (sessionId: number) => {
    localStorage.setItem("selectedSession", String(sessionId))
    navigate({ to: "/chairs/home" })
  }

  if (loading) {
    return <div className="p-10 text-center">Cargando sesiones...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Seleccionar sesión
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sessions.map((s) => (
          <button
            key={s.id}
            onClick={() => selectSession(s.id)}
            className="p-6 rounded-xl shadow-lg border bg-white hover:bg-gray-100 transition text-left"
          >
            <h2 className="text-xl font-semibold">{s.title}</h2>

            <p className="text-sm text-gray-600 mt-2">
              Deadline: {s.deadline}
            </p>

            <p className="text-sm text-gray-600">
              Capacidad: {s.capacity}
            </p>

            <p className="text-sm text-gray-600">
              Conferencia: {s.conference?.title}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
