import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { User } from "@/services/users";

type UserComboboxProps = {
  users: User[];
};

export function UserCombobox({ users }: UserComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState<number | null>(null);
  const [query, setQuery] = React.useState("");

  // Filtramos usuarios según lo que escriba el usuario
  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(query.toLowerCase()) ||
      user.last_name.toLowerCase().includes(query.toLowerCase())
  );

  const selectedUser = users.find((u) => u.id === selectedUserId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between font-normal text-sm",
            !selectedUser ? "text-gray-500" : "text-gray-900"
          )}
        >
          {selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : "Seleccione un autor..."}
          <ChevronsUpDown className="opacity-25" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-100 p-0">
        <Command>
          <CommandInput
            placeholder="Buscar usuarios..."
            className="h-9"
            value={query}
            onValueChange={setQuery} // actualizar el query
          />
          <CommandList>
            <CommandEmpty>No hay usuarios...</CommandEmpty>
            <CommandGroup>
              {filteredUsers.map((user) => (
                <CommandItem
                  key={user.id}
                  value={`${user.first_name} ${user.last_name}`} // valor visible en CommandItem
                  onSelect={() => {
                    setSelectedUserId(user.id);
                    setOpen(false);
                  }}
                >
                  {user.first_name} {user.last_name}
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
