import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import type { Conferencia } from './AdministradorApp';

type BuscadorProps= {
  confActivas:Conferencia[];
  confTerminadas: Conferencia[];
  setConferencias: React.Dispatch<React.SetStateAction<Conferencia[]>>;
  verActivas: boolean;
}

export const Buscador = ({confActivas, confTerminadas, setConferencias, verActivas}: BuscadorProps) => {
  const [query, setQuery] = useState('');

  const buscar= ()=>{
    if (query===''){
      setConferencias(verActivas ? confActivas : confTerminadas)
      return
    }
    const valor= query.toLowerCase()
    const resultado= [...confActivas, ...confTerminadas].filter(conf => conf.titulo.toLowerCase().includes(valor))
    setConferencias(resultado)
  }

  useEffect(() =>{
    buscar()
  },[query])

  return (
    <div className="flex flex-auto border border-gray-300 rounded-lg bg-white min-w-20 overflow-hidden">
      <div className="flex items-center pl-2">
        <Search className="w-4 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Buscar conferencia..."
        value={query}
        onChange={(e)=> setQuery(e.target.value)}
        className="p-2 outline-none w-full"
      />
    </div>
  );
};
