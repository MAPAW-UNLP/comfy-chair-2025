import { useEffect } from "react"
import { useNavigate, Link } from "@tanstack/react-router"
import { Users, FileSearch, ClipboardCheck } from "lucide-react"

export function HomeChair() {
  const navigate = useNavigate()

  useEffect(() => {
    const sessionId = localStorage.getItem("selectedSession")
    if (!sessionId) {
      navigate({ to: "/chairs/select-session" })
    }
  }, [navigate])

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-10">
        Panel del Chair
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link
          to="/article/select"
          className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center hover:shadow-2xl hover:bg-gray-50 transition border border-gray-300"
        >
          <Users size={70} className="mb-4 text-gray-700" />
          <p className="text-xl font-semibold text-gray-800">
            Asignar revisores
          </p>
        </Link>

        <Link
          to="/chairs/selection/session-list"
          className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center hover:shadow-2xl hover:bg-gray-50 transition border border-gray-300"
        >
          <ClipboardCheck size={70} className="mb-4 text-gray-700" />
          <p className="text-xl font-semibold text-gray-800">
            Seleccionar corte
          </p>
        </Link>

        <Link
          to="/review/chair/reviewed"
          className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center hover:shadow-2xl hover:bg-gray-50 transition border border-gray-300"
        >
          <FileSearch size={70} className="mb-4 text-gray-700" />
          <p className="text-xl font-semibold text-gray-800">
            Ver revisiones de artículos
          </p>
        </Link>
      </div>
    </div>
  )
}
