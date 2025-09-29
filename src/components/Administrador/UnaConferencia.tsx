import React from 'react'
import { Route } from '@/routes/conferencias/$id'
import Header from './Header'

function UnaConferencia() {
  const conferencia= Route.useLoaderData() 

  return (
    <div className="flex flex-col justify-center items-center gap-5 bg-[#EEEEEE] h-full ">
      <Header />
      {conferencia.titulo}
    </div>
  )
}

export default UnaConferencia