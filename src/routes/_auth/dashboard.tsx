import { createFileRoute, useNavigate, useRouteContext } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getUserFullData, type ProcessedConference } from '@/services/userServices'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/_auth/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  // Get user from the parent _auth route context
  const { user } = useRouteContext({ from: '/_auth/dashboard' })

  // Fetch user conferences and roles
  const { data: conferences, isLoading, isError } = useQuery({
    queryKey: ['user-full-data'],
    queryFn: getUserFullData,
  })

  const handleLogout = () => {
    logout()
    navigate({ to: '/login', search: { redirect: undefined, registered: undefined } })
  }

  const handleRoleClick = (conference: ProcessedConference, role: string) => {
    if(role === "autor"){
      navigate({ to: `/articles/${conference.conference_id}`, replace: true })
    }
    else{
       alert(
        `🚧 MOCK - Funcionalidad en desarrollo\n\n` +
        `Conferencia: ${conference.conference_name}\n` +
        `Conference ID: ${conference.conference_id}\n` +
        `Rol: ${role}\n\n` +
        `Esta funcionalidad redirigirá a la página correspondiente del rol una vez que las rutas estén completamente implementadas.`
      )
    }
  }

  return (
    <div className="min-h-[calc(100dvh-64px)] bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Inicio</h1>
            <p className="text-muted-foreground mt-1">Bienvenido, {user.full_name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* User Info Card - Small card on the side */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="font-medium">{user.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-sm">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Afiliación</p>
                  <p className="font-medium">{user.affiliation}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rol</p>
                  <p className="font-medium">{user.role}</p>
                </div>
                <Button onClick={handleLogout} variant="destructive" size="sm" className="w-full mt-4">
                  Cerrar Sesión
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Conferences Section */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Mis Conferencias</CardTitle>
                <CardDescription>Conferencias en las que participas y tus roles</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center space-y-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-sm text-muted-foreground">Cargando conferencias...</p>
                    </div>
                  </div>
                )}

                {isError && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-destructive">Error al cargar las conferencias</p>
                      <p className="text-xs text-muted-foreground">Por favor, intenta nuevamente más tarde</p>
                    </div>
                  </div>
                )}

                {!isLoading && !isError && conferences && conferences.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No tienes conferencias</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Aún no estás participando en ninguna conferencia. Cuando te unas a una, aparecerá aquí.
                    </p>
                  </div>
                )}

                {!isLoading && !isError && conferences && conferences.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {conferences.map((conference) => (
                      <Card key={conference.conference_id} className="border-2 hover:border-primary/50 transition-colors">
                        <CardHeader>
                          <CardTitle className="text-lg">{conference.conference_name}</CardTitle>
                          <CardDescription>
                            {conference.roles.length} {conference.roles.length === 1 ? 'rol' : 'roles'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground mb-2">Accesos rápidos:</p>
                            <div className="flex flex-wrap gap-2">
                              {conference.roles.map((role) => (
                                <Badge
                                  key={role}
                                  variant="secondary"
                                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                  onClick={() => handleRoleClick(conference, role)}
                                >
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

