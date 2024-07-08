import React, { FC } from "react";
import { useFormContext } from "react-hook-form";

import { useDisableNumberInputScroll } from "../hooks/useDisableNumberInputScroll";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import { Select, SelectTrigger, SelectValue } from "components/ui/select";

import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  children: React.ReactNode;
}
const FormSelect: FC<SelectProps> = ({
  name,
  label,
  required,
  placeholder,
  children,
}) => {
  const { control } = useFormContext();

  useDisableNumberInputScroll();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const { value, onChange } = field;
        return (
          <FormItem className="flex flex-col gap-0">
            <FormLabel className="font-semibold -mb-1">
              {label}
              {required && (
                <span className="text-red-500 " title="required">
                  *
                </span>
              )}
            </FormLabel>
            <Select onValueChange={onChange} defaultValue={value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              {children}
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default FormSelect;
