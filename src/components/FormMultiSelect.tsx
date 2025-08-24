"use client";

import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";

import { useDisableNumberInputScroll } from "../hooks/useDisableNumberInputScroll";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";

import { SelectHTMLAttributes } from "react";
import { IOptions } from "./schema";
// import { IOptions } from "definations/schema";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  options?: IOptions[];
  disabled?: boolean;
}
const FormMultiSelect: FC<SelectProps> = ({
  name,
  label,
  required,
  placeholder,
  options,
  className,
  disabled,
}) => {
  const { control, setValue, getValues } = useFormContext();

  useDisableNumberInputScroll();

  const handleSelect = (selectedValue: string) => {
    const currentValues: string[] = getValues(name) || [];
    if (!currentValues.includes(selectedValue)) {
      setValue(name, [...currentValues, selectedValue], {
        shouldValidate: true,
      });
    }
  };

  const handleRemove = (valueToRemove: string) => {
    const currentValues: string[] = getValues(name) || [];
    setValue(
      name,
      currentValues.filter((value) => value !== valueToRemove),
      { shouldValidate: true }
    );
  };

  return (
    <div className={className}>
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          const value = Array.isArray(field.value) ? field.value : [];

          return (
            <FormItem className='flex flex-col gap-0 mb-1.5'>
              <FormLabel>
                {label}
                {required && (
                  <span className='text-red-500 ' title='required'>
                    *
                  </span>
                )}
              </FormLabel>
              <Select onValueChange={handleSelect} value='' disabled={disabled}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options?.map((item) => (
                    <SelectItem
                      value={item.value as string}
                      key={item.value as string}
                      disabled={value.includes(item.value as string)}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {value.length > 0 && (
                <div className='mt-2 flex flex-wrap gap-2'>
                  {value.map((selectedValue: string) => {
                    const selectedOption = options?.find(
                      (opt) => opt.value === selectedValue
                    );
                    return (
                      <div
                        key={selectedValue}
                        className='flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-sm'
                      >
                        <span>{selectedOption?.label}</span>
                        <button
                          type='button'
                          onClick={() => handleRemove(selectedValue)}
                          className='text-gray-500 hover:text-gray-700'
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
};

export default FormMultiSelect;
