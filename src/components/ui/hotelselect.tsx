import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Hotel } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUserState } from "@/context/UserState";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";

export function HotelSelect() {
  const { hotels, dispatch } = useUserState();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const toggleValue = (currentValue: number) => {
    setSelected((prev) => {
      if (prev.includes(currentValue)) {
        return prev.filter((value) => value !== currentValue);
      } else {
        return [...prev, currentValue];
      }
    });
  };

  useEffect(() => {
    dispatch({ type: "SET_SELECTED_HOTEL_IDS", payload: selected });
  }, [selected]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="blueCircle"
          role="popover-trigger"
          aria-expanded={open}
          className="size-8 text-white"
        >
          <Hotel />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0 bg-white rounded-xl shadow-lg border border-[#397FA0]/30">
        <div className="flex items-center gap-2 px-3 py-2">
          <Hotel className="size-5 text-[#397FA0]" />
          <h3 className="text-md font-semibold text-[#397FA0]">
            Select Hotels
          </h3>
        </div>
        <Command>
          <CommandInput placeholder="Search hotels..." className="h-9" />
          <CommandList>
            <CommandEmpty>No hotels found.</CommandEmpty>
            <CommandGroup>
              {hotels.map((hotel) => (
                <CommandItem
                  key={hotel.id}
                  value={hotel.name}
                  onSelect={() => {
                    toggleValue(hotel.id);
                  }}
                >
                  {hotel.name}
                  {selected.includes(hotel.id) && (
                    <Check className="text-[#985db5]" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
