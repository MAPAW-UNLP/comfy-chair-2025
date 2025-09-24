import type { Dummy } from '@/services/dummy';
import dayjs from 'dayjs';
import type React from 'react';

interface DummyProps {
  dummy: Dummy;
}

export const DummyItem: React.FC<DummyProps> = ({ dummy }) => {
  return (
     <div className="w-full max-w-md rounded-2xl shadow-md border m-1 bg-white flex flex-col gap-4 text-center">
      <p>{dummy.name} - {dayjs(dummy.created_at).format('DD/MM/YYYY HH:mm:ss')}</p>
    </div>
  );
};
