import type { Dummy } from '@/services/dummy';
import dayjs from 'dayjs';
import type React from 'react';

interface DummyProps {
  dummy: Dummy;
}

export const DummyItem: React.FC<DummyProps> = ({ dummy }) => {
  return (
    <div className="flex gap-2">
      <p>{dayjs(dummy.created_at).format('DD/MM/YYYY HH:mm:ss')}</p>
      <p>{dummy.name}</p>
    </div>
  );
};
