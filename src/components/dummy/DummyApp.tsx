import { createDummy, getAllDummies, type Dummy } from '@/services/dummy';
import { useEffect, useState, type SetStateAction } from 'react';
import { DummyItem } from './Dummy';
import { Button } from '../ui/button';
import { Input } from "@/components/ui/input"
import { Label } from '../ui/label';

export const DummyApp = () => {
  const [name, setName] = useState<string>('');
  const [dummies, setDummies] = useState<Dummy[]>([]);

  // recupera dummies del server ni bien se abre la app
  useEffect(() => {
    const fetchDummies = async () => {
      const data = await getAllDummies();
      setDummies(data);
    };
    fetchDummies();
  }, []);

  const handleClick = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const data = await createDummy(name);
    setDummies([...dummies, data]);
  };

  return (
    <div className="flex flex-col gap-4 mx-4 items-center">
      <form className="w-full max-w-md rounded-2xl shadow-md border p-4 bg-white flex flex-col gap-4" onSubmit={handleClick}>

        <h2 className="text-lg font-bold italic text-slate-500 text-center">Nuevo Dummy</h2>
        <hr className="bg-slate-100"/>

        <Label htmlFor="autor">Nombre</Label>
        <Input
          value={name}
          onChange={(e: { target: { value: SetStateAction<string>; }; }) => setName(e.target.value)}
          type="text"
          placeholder="Nombre del dummy..."
        />
        
        <hr className="bg-slate-100" />
        <Button variant="outline" className="bg-slate-900 text-white w-full">Crear Dummy</Button>
      </form>

      <div>
        <h2 className="font-bold text-2xl mb-2">Dummies Creados: {dummies.length}</h2>
        <ul>
          {dummies.map((dummy) => (
            <DummyItem key={dummy.id} dummy={dummy} />
          ))}
        </ul>
      </div>
    </div>
  );
};
