import { createDummy, getAllDummies, type Dummy } from '@/services/dummy';
import { useEffect, useState } from 'react';
import { DummyItem } from './Dummy';
import { Button } from '../ui/button';

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
    <div className="flex min-h-svh flex-col gap-8 items-center justify-center">
      <form className="flex flex-col gap-3" onSubmit={handleClick}>
        <label>Nuevo Dummy</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Name"
          className="border-2 border-black"
        />
        <Button>Create Dummy</Button>
      </form>
      <div>
        <h2 className="font-bold text-2xl">Dummies Creados</h2>
        <ul>
          {dummies.map((dummy) => (
            <DummyItem key={dummy.id} dummy={dummy} />
          ))}
        </ul>
      </div>
    </div>
  );
};
