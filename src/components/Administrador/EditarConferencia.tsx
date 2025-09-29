import React, { useState } from 'react';
import Header from './Header';
import { Route } from '@/routes/conferencias/editar/$id';

function EditarConferencia() {
  const conferenciaInicial = Route.useLoaderData();
  const [conferencia, setConferencia] = useState(conferenciaInicial);

  return (
    <div className="bg-[#EEEEEE]">
      <Header />
    </div>
  );
}

export default EditarConferencia;
