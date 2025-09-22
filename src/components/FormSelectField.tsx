"use client";

import React, { forwardRef } from "react";
import { useFormContext } from "react-hook-form";

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

type TOption = {
  label: string;
  value: string;
};
interface SelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  options?: TOption[];
  disabled?: boolean;
  children?: React.ReactNode;
  onValueChange?: (value: string) => void;
}
const FormSelect = forwardRef<HTMLButtonElement, SelectProps>(({
  name,
  label,
  required,
  placeholder,
  children,
  options,
  disabled,
  onValueChange: externalOnValueChange,
  ...props
}, ref) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const { value, onChange, ...rest } = field;
        return (
          <FormItem className='flex flex-col w-full gap-0'>
            {label && (
              <FormLabel className='mb-1.5'>
                {label}
                {required && (
                  <span className='text-red-500 ' title='required'>
                    *
                  </span>
                )}
              </FormLabel>
            )}
            <Select
              onValueChange={(newValue) => {
                onChange(newValue);
                if (externalOnValueChange) {
                  externalOnValueChange(newValue);
                }
              }}
              value={value}
              defaultValue={value}
              disabled={disabled}
              {...rest}
              {...props}
            >
              <FormControl>
                <SelectTrigger ref={ref} disabled={disabled}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>

              {options ? (
                <SelectContent>
                  {options.filter((item) => item.value !== "" && item.value != null).map((item) => {
                    return (
                      <SelectItem
                        className='cursor-pointer'
                        key={item.value}
                        value={item.value as string}
                      >
                        {item.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              ) : (
                children
              )}
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
});

FormSelect.displayName = "FormSelect";

export default FormSelect;
