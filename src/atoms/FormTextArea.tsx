"use client";

import { FC, InputHTMLAttributes } from "react";

import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import { Textarea } from "components/ui/textarea";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  rows?: number;
  label2?: string;
}

const FormTextArea: FC<InputProps> = ({
  name,
  label,
  label2,
  rows,
  ...rest
}) => {
  const { control } = useFormContext();
  const { required } = rest;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold -mb-1">
            {label}
            {required && (
              <span className="text-red-500" title="required">
                *
              </span>
            )}
          </FormLabel>
          <div>
            <FormLabel className="text-sm text-[#756D6D]">{label2}</FormLabel>
          </div>
          <FormControl>
            <Textarea
              rows={rows}
              className="resize-none font-medium bg-[#F9F9F9]"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormTextArea;
