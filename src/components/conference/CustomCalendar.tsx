import { useEffect, useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Label } from '@/components/ui/label';
import { Button } from '../ui/button';

type CustomCalendarProps = {
  label: string;
  date?: string;
  setDate: (d: string) => void;
  validarFin?: (d: Date) => boolean;
};

function CustomCalendar({ label, date, setDate, validarFin }: CustomCalendarProps) {
  const [open, setOpen] = useState(false);
  const [realDate, setRealDate] = useState(new Date());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const seleccionarFecha = (d: Date) => {
    if (validarFin && !validarFin(d)) return;
    setRealDate(d);
    setOpen(false);
  };

  useEffect(() => {
    if (realDate) setDate(realDate.toISOString().split('T')[0]);
  }, [realDate]);

  useEffect(() => {
    if (date) {
      const [year, month, day] = date.split('-').map(Number);
      setRealDate(new Date(year, month - 1, day));
    }
  }, [date]);

  return (
    <div className="flex flex-col gap-3">
      <Label className="px-1 text-md"  >
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {realDate?.toLocaleDateString('es-AR')}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={realDate}
            captionLayout="dropdown"
            onSelect={(d) => seleccionarFecha(d!)}
            disabled={(realDate) => realDate < today}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default CustomCalendar;
