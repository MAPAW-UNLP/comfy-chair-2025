import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/panel')({
  component: PanelPage,
})

function PanelPage() {
  const { user, isLoading, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      navigate({ to: '/ingresar' })
    }
  }, [user, isLoading, navigate])

  const handleLogout = () => {
    logout()
    navigate({ to: '/ingresar' })
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Cargando...</p>
      </div>
    )
  }

  // Don't render if no user (will redirect)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Panel de Usuario</CardTitle>
          <CardDescription>Bienvenido a tu panel personal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">ID de Usuario</h3>
              <p className="text-lg">{user.id}</p>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Nombre Completo</h3>
              <p className="text-lg">{user.nombre_completo}</p>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
              <p className="text-lg">{user.email}</p>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Afiliación</h3>
              <p className="text-lg">{user.afiliacion}</p>
            </div>
          </div>

          <Button onClick={handleLogout} variant="destructive" className="w-full">
            Cerrar Sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

