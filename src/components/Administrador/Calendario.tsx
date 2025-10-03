import React, { useEffect, useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Label } from '@/components/ui/label';
import { Button } from '../ui/button';

type CalendarioProps = {
  label: string;
  date?: string;
  setDate: (d: string) => void;
};

function Calendario({ label, date, setDate }: CalendarioProps) {
  const [open, setOpen] = useState(false);
  const [realDate, setRealDate] = useState(new Date());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    setDate(realDate.toISOString().split('T')[0]);
  }, [realDate]);

  useEffect(() => {
    if (date) {
      const [year, month, day] = date.split('-').map(Number);
      setRealDate(new Date(year, month - 1, day));
    }
  }, [date]);

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {realDate.toLocaleDateString('es-AR')}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={realDate}
            captionLayout="dropdown"
            onSelect={(d) => {
              setRealDate(d);
              setOpen(false);
            }}
            disabled={(realDate) => realDate < today}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default Calendario;
