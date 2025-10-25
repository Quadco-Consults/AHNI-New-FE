"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "components/ui/popover";
import { Button } from "components/ui/button";

type TOption = {
  label: string;
  value: string;
};

interface FormComboboxProps {
  name: string;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  required?: boolean;
  options?: TOption[];
  disabled?: boolean;
  onValueChange?: (value: string) => void;
}

export default function FormCombobox({
  name,
  label,
  required,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  options = [],
  disabled = false,
  onValueChange: externalOnValueChange,
}: FormComboboxProps) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const { value, onChange } = field;

        // Find the selected option label
        const selectedOption = options.find((option) => option.value === value);
        const displayValue = selectedOption?.label || placeholder;

        return (
          <FormItem className="flex flex-col w-full gap-0">
            {label && (
              <FormLabel className="mb-1.5">
                {label}
                {required && (
                  <span className="text-red-500" title="required">
                    *
                  </span>
                )}
              </FormLabel>
            )}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                      "w-full justify-between font-normal",
                      !value && "text-muted-foreground"
                    )}
                  >
                    <span className="truncate">{displayValue}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder={searchPlaceholder} />
                  <CommandList>
                    <CommandEmpty>{emptyMessage}</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.label}
                          onSelect={() => {
                            const newValue = option.value;
                            onChange(newValue);
                            if (externalOnValueChange) {
                              externalOnValueChange(newValue);
                            }
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === option.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
