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
}

const FormTextArea: FC<InputProps> = ({ name, label, ...rest }) => {
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
          <FormControl>
            <Textarea
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
