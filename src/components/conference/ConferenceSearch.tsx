import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import type { Conference } from './ConferenceApp';

type ConferenceSearchProps= {
  confActivas:Conference[];
  confTerminadas: Conference[];
  setConferencias: React.Dispatch<React.SetStateAction<Conference[]>>;
  verActivas: boolean;
}

export const ConferenceSearch = ({confActivas, confTerminadas, setConferencias, verActivas}: ConferenceSearchProps) => {
  const [query, setQuery] = useState('');

  const buscar= ()=>{
    if (query===''){
      setConferencias(verActivas ? confActivas : confTerminadas)
      return
    }
    const valor= query.toLowerCase()
    const resultado= [...confActivas, ...confTerminadas].filter(conf => conf.title.toLowerCase().includes(valor))
    setConferencias(resultado)
  }

  useEffect(() =>{
    buscar()
  },[query])

  return (
    <div className="flex flex-auto border border-gray-300 rounded-lg bg-white min-w-20 overflow-hidden shadow">
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
