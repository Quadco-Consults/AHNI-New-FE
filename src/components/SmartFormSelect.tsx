"use client";

import React, { forwardRef, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Check, ChevronsUpDown, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// UI Components
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Button } from "@/components/ui/button";

type TOption = {
  label: string;
  value: string;
};

// Support for legacy IOptions interface
type IOptions = {
  label: string;
  value: string | number | boolean;
};

interface SmartFormSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  required?: boolean;
  options?: TOption[] | IOptions[]; // Support both option types
  disabled?: boolean;
  children?: React.ReactNode;
  onValueChange?: (value: string) => void;
  // Smart behavior configuration
  searchThreshold?: number; // When to switch to searchable (default: 10)
  forceSearch?: boolean;     // Force searchable mode regardless of count
  forceSelect?: boolean;     // Force regular select mode regardless of count
  className?: string;        // Support for className prop
}

const SmartFormSelect = forwardRef<HTMLButtonElement, SmartFormSelectProps>(
  (
    {
      name,
      label,
      required,
      placeholder = "Select option...",
      searchPlaceholder = "Search...",
      emptyMessage = "No option found.",
      options = [],
      disabled = false,
      children,
      onValueChange: externalOnValueChange,
      searchThreshold = 10, // Auto-enable search when 10+ options
      forceSearch = false,
      forceSelect = false,
      className,
      ...props
    },
    ref
  ) => {
    const { control } = useFormContext();
    const [open, setOpen] = useState(false);

    // Smart decision: Use searchable combobox for large lists
    const shouldUseSearch = useMemo(() => {
      if (forceSearch) return true;
      if (forceSelect) return false;
      return options.length >= searchThreshold;
    }, [options.length, searchThreshold, forceSearch, forceSelect]);

    // Filter out empty/null values and normalize value to string
    const filteredOptions = useMemo(() => {
      return options
        .filter((item) => item.value !== "" && item.value != null)
        .map((item) => ({
          label: item.label,
          value: String(item.value), // Normalize to string for consistent handling
        }));
    }, [options]);

    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          const { value, onChange, ...rest } = field;

          // Common form structure with optional className wrapper
          const formWrapper = (children: React.ReactNode) => {
            const formItem = (
              <FormItem className="flex flex-col w-full gap-0 mb-1.5">
                {label && (
                  <FormLabel className="mb-1">
                    {label}
                    {required && (
                      <span className="text-red-500" title="required">
                        *
                      </span>
                    )}
                  </FormLabel>
                )}
                {children}
                <FormMessage />
              </FormItem>
            );

            // Wrap with className div if provided (for legacy FormSelect compatibility)
            return className ? (
              <div className={className}>{formItem}</div>
            ) : (
              formItem
            );
          };

          // Handle value change
          const handleValueChange = (newValue: string) => {
            onChange(newValue);
            if (externalOnValueChange) {
              externalOnValueChange(newValue);
            }
          };

          // Render searchable combobox for large lists
          if (shouldUseSearch) {
            const selectedOption = filteredOptions.find(
              (option) => option.value === value
            );

            return formWrapper(
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
                        !value && "text-muted-foreground"
                      )}
                    >
                      <span className="truncate">
                        {selectedOption ? selectedOption.label : placeholder}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandList>
                      <CommandEmpty>{emptyMessage}</CommandEmpty>
                      <CommandGroup>
                        {filteredOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.label}
                            onSelect={() => {
                              handleValueChange(option.value);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === option.value
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
            );
          }

          // Render regular select for small lists
          return formWrapper(
            <Select
              onValueChange={handleValueChange}
              value={value || ""}
              disabled={disabled}
              {...rest}
              {...props}
            >
              <FormControl>
                <SelectTrigger ref={ref} disabled={disabled}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>

              {filteredOptions.length > 0 ? (
                <SelectContent>
                  {filteredOptions.map((item) => (
                    <SelectItem
                      className="cursor-pointer"
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              ) : (
                children
              )}
            </Select>
          );
        }}
      />
    );
  }
);

SmartFormSelect.displayName = "SmartFormSelect";

export default SmartFormSelect;