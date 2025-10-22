import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/article/edit/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-wrap gap-4 mx-4 my-4 justify-center items-center">
      <span>Desarrollar componente para poder editar el articulo... </span>
      <Button variant={"outline"} className='bg-slate-900 text-white' onClick={() => window.history.back()}>
        Volver
      </Button>
    </div>
  )
}
