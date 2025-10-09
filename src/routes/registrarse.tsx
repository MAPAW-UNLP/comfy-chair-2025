import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { registerSchema, type RegisterFormData } from '@/lib/validations'
import { authService } from '@/services/auth'

export const Route = createFileRoute('/registrarse')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<RegisterFormData>({
    nombreCompleto: '',
    afiliacion: '',
    email: '',
    contraseña: '',
    confirmacion: '',
  })
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({})
  const [formError, setFormError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev: RegisterFormData) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: Partial<RegisterFormData>) => ({ ...prev, [field]: undefined }))
    }
    // Clear form error when user starts typing
    if (formError) {
      setFormError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const result = registerSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Partial<RegisterFormData> = {}
      result.error.issues.forEach((error: any) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as keyof RegisterFormData] = error.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setIsLoading(true)
    setFormError('')
    try {
      const response = await authService.register({
        nombre_completo: formData.nombreCompleto,
        afiliacion: formData.afiliacion,
        email: formData.email,
        password: formData.contraseña,
      })
      // TODO: Store token in localStorage or context
      console.log('Registration successful:', response)
      navigate({ to: '/ingresar', search: { redirect: undefined, registered: 'true' } })
    } catch (error: any) {
      console.error('Registration failed:', error)
      
      // Check if it's a 5xx server error
      if (error.response?.status >= 500) {
        window.alert('Error del servidor. Por favor, intenta nuevamente más tarde.')
      } else {
        // For 4xx errors (email already exists, etc.), show a generic form error
        setFormError('No se pudo crear la cuenta. Por favor, verifica tus datos o intenta nuevamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Crear una cuenta</CardTitle>
          <CardDescription>¡Bienvenido!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombreCompleto">Nombre completo</Label>
              <Input
                id="nombreCompleto"
                type="text"
                value={formData.nombreCompleto}
                onChange={(e) => handleInputChange('nombreCompleto', e.target.value)}
                className={errors.nombreCompleto ? 'border-destructive' : ''}
              />
              {errors.nombreCompleto && (
                <p className="text-sm text-destructive">{errors.nombreCompleto}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="afiliacion">Afiliación</Label>
              <Input
                id="afiliacion"
                type="text"
                value={formData.afiliacion}
                onChange={(e) => handleInputChange('afiliacion', e.target.value)}
                className={errors.afiliacion ? 'border-destructive' : ''}
              />
              {errors.afiliacion && (
                <p className="text-sm text-destructive">{errors.afiliacion}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contraseña">Contraseña</Label>
              <Input
                id="contraseña"
                type="password"
                value={formData.contraseña}
                onChange={(e) => handleInputChange('contraseña', e.target.value)}
                className={errors.contraseña ? 'border-destructive' : ''}
              />
              {errors.contraseña && (
                <p className="text-sm text-destructive">{errors.contraseña}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmacion">Confirmación</Label>
              <Input
                id="confirmacion"
                type="password"
                value={formData.confirmacion}
                onChange={(e) => handleInputChange('confirmacion', e.target.value)}
                className={errors.confirmacion ? 'border-destructive' : ''}
              />
              {errors.confirmacion && (
                <p className="text-sm text-destructive">{errors.confirmacion}</p>
              )}
            </div>

            {formError && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive rounded-md">
                {formError}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link to="/ingresar" search={{ redirect: undefined, registered: undefined }} className="text-primary underline">
              Ingresar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
