"use client";

import { FC } from "react";
import { useFormContext } from "react-hook-form";

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
import { IOptions } from "definations/schema";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  options?: IOptions[];
}
const FormSelect: FC<SelectProps> = ({
  name,
  label,
  required,
  placeholder,
  options,
  className,
}) => {
  const { control } = useFormContext();

  useDisableNumberInputScroll();

  return (
    <div className={className}>
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          const { value, onChange } = field;

          return (
            <FormItem className='flex flex-col gap-0 mb-1.5'>
              <FormLabel className='mb-1'>
                {label}
                {required && (
                  <span className='text-red-500 ' title='required'>
                    *
                  </span>
                )}
              </FormLabel>
              <Select
                onValueChange={onChange}
                value={value}
                defaultValue={value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options?.filter((item) => item.value !== "" && item.value != null).map((item) => {
                    return (
                      <SelectItem
                        value={item.value as string}
                        key={item.value as string}
                      >
                        {item.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
};

export default FormSelect;
