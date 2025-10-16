import { createFileRoute, useNavigate, useRouteContext } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_auth/dashboard')({
  component: PanelPage,
})

function PanelPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  // Get user from the parent _auth route context
  const { user } = useRouteContext({ from: '/_auth/dashboard' })

  const handleLogout = () => {
    logout()
    navigate({ to: '/login', search: { redirect: undefined, registered: undefined } })
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
              <p className="text-lg">{user.full_name}</p>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
              <p className="text-lg">{user.email}</p>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Afiliación</h3>
              <p className="text-lg">{user.affiliation}</p>
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

