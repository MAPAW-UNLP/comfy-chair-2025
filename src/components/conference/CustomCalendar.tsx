import { Calendar } from '../ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';

type CustomCalendarProps = {
  date?: Date;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

function CustomCalendar({ date, setDate }: CustomCalendarProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="border rounded px-2 py-1 text-left bg-white flex items-center justify-between hover:bg-gray-50"
        >
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, 'dd/MM/yyyy', { locale: es })
            ) : (
              <span className="text-gray-500">dd/mm/aaaa</span>
            )}
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => setDate(d)}
          locale={es}
          disabled={{ before: new Date() }}
        />
      </PopoverContent>
    </Popover>
  );
}

export default CustomCalendar;
