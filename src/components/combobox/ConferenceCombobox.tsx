import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Conference } from "@/services/conferenceServices";

type ConferenceComboboxProps = {
  conferences: Conference[];
  onValueChange?: (conferenceId: number) => void;
};

export function ConferenceCombobox({ conferences, onValueChange }: ConferenceComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedConferenceId, setSelectedConferenceId] = React.useState<number | null>(null);
  const [query, setQuery] = React.useState("");

  const filteredConferences = conferences.filter(
    (c) => 
      c.title.toLowerCase().includes(query.toLowerCase()) 
  );

  const selectedConference = conferences.find((c) => c.id === selectedConferenceId) || null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between font-normal text-sm",
            !selectedConference ? "text-gray-500" : "text-gray-900"
          )}
        >
          {selectedConference
            ? `${selectedConference.title}`
            : "Seleccione una conferencia..."}
          <ChevronsUpDown className="opacity-25" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto max-w-sm p-0">
        <Command>
          <CommandInput
            placeholder="Buscar conferencias..."
            className="h-9"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No hay conferencias...</CommandEmpty>
            <CommandGroup>
              {filteredConferences.map((c) => (
                <CommandItem
                  key={c.id}
                  value={`${c.title}`}
                  onSelect={() => {
                    setSelectedConferenceId(c.id);
                    setOpen(false);
                    if (onValueChange) onValueChange(c.id);
                  }}
                >
                  {c.title}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedConferenceId === c.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
