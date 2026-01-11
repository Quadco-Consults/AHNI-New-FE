"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type TOption = {
  label: string;
  value: string;
};

interface ComboboxProps {
  name: string;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  required?: boolean;
  options?: TOption[];
  disabled?: boolean;
  emptyText?: string;
}

const FormCombobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      name,
      label,
      required,
      placeholder = "Select option...",
      searchPlaceholder = "Search...",
      options = [],
      disabled = false,
      emptyText = "No option found.",
    },
    ref
  ) => {
    const { control } = useFormContext();
    const [open, setOpen] = React.useState(false);

    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          const selectedOption = options.find(
            (option) => option.value === field.value
          );

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
                      ref={ref}
                      variant="outline"
                      role="combobox"
                      disabled={disabled}
                      aria-expanded={open}
                      className={cn(
                        "w-full justify-between font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {selectedOption ? selectedOption.label : placeholder}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandList>
                      <CommandEmpty>{emptyText}</CommandEmpty>
                      <CommandGroup>
                        {options
                          .filter((item) => item.value !== "" && item.value != null)
                          .map((option) => (
                            <CommandItem
                              key={option.value}
                              value={option.label}
                              onSelect={() => {
                                field.onChange(option.value);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === option.value
                                    ? "opacity-100"
                                    : "opacity-0"
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
);

FormCombobox.displayName = "FormCombobox";

export default FormCombobox;
