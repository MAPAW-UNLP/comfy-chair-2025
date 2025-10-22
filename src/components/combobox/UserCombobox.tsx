import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { User } from "@/services/userServices";

type UserComboboxProps = {
  users: User[];
  onValueChange?: (userId: number) => void;
  isChair?: boolean;
  backgroundWhite?: boolean;
};

export function UserCombobox({ users, onValueChange, isChair = false, backgroundWhite = false }: UserComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState<number | null>(null);
  const [query, setQuery] = React.useState("");

  const filteredUsers = users.filter(
    (user) =>
    user.full_name.toLowerCase().includes(query.toLowerCase())
     /* user.first_name.toLowerCase().includes(query.toLowerCase()) ||
      user.last_name.toLowerCase().includes(query.toLowerCase())*/
  );

  const selectedUser = users.find((u) => u.id === selectedUserId) || null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between font-normal text-sm",
            !selectedUser ? "text-gray-500" : "text-gray-900",
            backgroundWhite && "bg-white hover:bg-gray-50"
          )}
        >
          {selectedUser
            ? `${selectedUser.full_name} `
            : `Seleccione al menos un ${isChair ? "chair" : "autor"}...`}
          <ChevronsUpDown className="opacity-25" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto max-w-sm p-0">
        <Command>
          <CommandInput
            placeholder="Buscar usuarios..."
            className="h-9"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No hay usuarios...</CommandEmpty>
            <CommandGroup>
              {filteredUsers.map((user) => (
                <CommandItem
                  key={user.id}
                  value={`${user.full_name}`}
                  onSelect={() => {
                    setSelectedUserId(null);
                    setOpen(false);
                    if (onValueChange) onValueChange(user.id);
                  }}
                >
                  {user.full_name} ({user.email})
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedUserId === user.id ? "opacity-100" : "opacity-0"
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
