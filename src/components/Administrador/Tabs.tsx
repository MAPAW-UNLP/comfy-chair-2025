import React from 'react'

type TabsProps={
  setVerActivas: React.Dispatch<React.SetStateAction<boolean>>;
  verActivas: boolean;
}

function Tabs({setVerActivas, verActivas} : TabsProps) {

  const mostrarActivas= () =>{
    setVerActivas(true)
  }

  const mostrarTerminadas= () =>{
    setVerActivas(false)
  }
  return (
    <div className='flex justify-center items-center bg-[#F1F5F9] px-1 py-1  rounded-sm gap-3 shadow'>
      <div onClick={mostrarActivas} className={`flex justify-center items-center px-3 py-1 rounded-sm cursor-pointer ${verActivas && "bg-white font-bold shadow"}` }>
        <p>Activas</p>
      </div>

      <div onClick={mostrarTerminadas} className={`flex justify-center items-center px-3 py-1 rounded-sm cursor-pointer ${!verActivas && "bg-white font-bold shadow"}`}>
        <p>Terminadas</p>
      </div>
    </div>
  )
}

export default Tabs