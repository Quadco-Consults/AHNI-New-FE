import React, { forwardRef, useRef, useState, useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, XCircle, ChevronDown, XIcon } from "lucide-react";
import { cn } from "lib/utils";
import { Separator } from "components/ui/separator";
import { Badge } from "components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "components/ui/command";

const multiSelectVariants = cva("m-1", {
  variants: {
    variant: {
      default:
        "border-foreground/10 drop-shadow-md text-foreground bg-card hover:bg-card/80",
      secondary:
        "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive:
        "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      inverted: "bg-yellow-darker text-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

// Generic option interface that can be extended
export interface MultiSelectOption {
  id: string;
  name: string;
}

interface UnifiedMultiSelectProps<T extends MultiSelectOption>
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  asChild?: boolean;
  options: T[];
  defaultValue?: string[];
  disabled?: boolean;
  placeholder: string;
  className?: string;
  onValueChange: (ids: string[]) => void;
  // Optional custom display function for complex objects
  getLabel?: (option: T) => string;
  getValue?: (option: T) => string;
}

const UnifiedMultiSelect = forwardRef<
  HTMLButtonElement,
  UnifiedMultiSelectProps<any>
>(
  (
    {
      className,
      variant,
      options,
      defaultValue,
      onValueChange,
      disabled,
      placeholder,
      getLabel = (option) => option.name,
      getValue = (option) => option.id,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = useState<string[]>(
      defaultValue || []
    );
    const selectedValuesSet = useRef(new Set(selectedValues));
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    useEffect(() => {
      const newDefaultValue = defaultValue || [];
      // Only update if the values actually changed
      const currentIds = selectedValues.sort().join(',');
      const newIds = [...newDefaultValue].sort().join(',');

      if (currentIds !== newIds) {
        setSelectedValues(newDefaultValue);
        selectedValuesSet.current = new Set(newDefaultValue);
      }
    }, [defaultValue, selectedValues]);

    const handleInputKeyDown = (event: any) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.target.value) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        selectedValuesSet.current.delete(
          selectedValues[selectedValues.length - 1]
        );
        onValueChange(newSelectedValues);
      }
    };

    const toggleOption = (optionValue: string) => {
      const newSelectedValues = selectedValuesSet.current.has(optionValue)
        ? selectedValues.filter((id) => id !== optionValue)
        : [...selectedValues, optionValue];
      setSelectedValues(newSelectedValues);
      selectedValuesSet.current = new Set(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const handleClear = () => {
      setSelectedValues([]);
      selectedValuesSet.current.clear();
      onValueChange([]);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(0, 3);
      setSelectedValues(newSelectedValues);
      selectedValuesSet.current = new Set(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <button
            ref={ref}
            {...props}
            onClick={handleTogglePopover}
            className={cn(
              "flex h-auto min-h-10 w-full items-center justify-between rounded-md border bg-gray-100 dark:bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            disabled={disabled}
          >
            {selectedValues.length > 0 ? (
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-wrap items-center">
                  {selectedValues.slice(0, 3).map((selectedValue) => {
                    const option = options.find((o) => getValue(o) === selectedValue);
                    if (!option) return null;
                    return (
                      <Badge
                        key={selectedValue}
                        className={cn(
                          multiSelectVariants({ variant }),
                          "hover:bg-gray-200 dark:hover:bg-gray-700"
                        )}
                      >
                        {getLabel(option)}
                        <button
                          className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleOption(selectedValue);
                            }
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleOption(selectedValue);
                          }}
                        >
                          <XIcon className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                      </Badge>
                    );
                  })}
                  {selectedValues.length > 3 && (
                    <Badge
                      className={cn(
                        multiSelectVariants({ variant }),
                        "bg-transparent text-foreground border-foreground/30 hover:bg-transparent"
                      )}
                    >
                      {`+ ${selectedValues.length - 3} more`}
                      <button
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            clearExtraOptions();
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          clearExtraOptions();
                        }}
                      >
                        <XIcon className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <button
                    className="mx-2"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleClear();
                    }}
                  >
                    <XCircle className="h-4 mx-2 cursor-pointer text-muted-foreground hover:text-foreground" />
                  </button>
                  <Separator orientation="vertical" className="flex min-h-6 h-full" />
                  <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground hover:text-foreground" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full mx-auto">
                <span className="text-sm text-muted-foreground mx-3">
                  {placeholder}
                </span>
                <ChevronDown className="h-4 cursor-pointer text-muted-foreground hover:text-foreground mx-2" />
              </div>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          side="bottom"
          align="start"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command>
            <CommandInput
              placeholder="Search..."
              onKeyDown={handleInputKeyDown}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const optionValue = getValue(option);
                  const isSelected = selectedValuesSet.current.has(optionValue);
                  return (
                    <CommandItem
                      key={optionValue}
                      onSelect={() => toggleOption(optionValue)}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      <span>{getLabel(option)}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between">
                  {selectedValues.length > 0 && (
                    <>
                      <CommandItem
                        onSelect={handleClear}
                        className="flex-1 justify-center cursor-pointer"
                      >
                        Clear All
                      </CommandItem>
                      <Separator orientation="vertical" className="flex min-h-6 h-full" />
                      <CommandItem
                        onSelect={() => setIsPopoverOpen(false)}
                        className="flex-1 justify-center cursor-pointer max-w-full"
                      >
                        Close
                      </CommandItem>
                    </>
                  )}
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

UnifiedMultiSelect.displayName = "UnifiedMultiSelect";

export { UnifiedMultiSelect, multiSelectVariants };