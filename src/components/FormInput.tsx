"use client";

import { FC, InputHTMLAttributes, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useDisableNumberInputScroll } from "../hooks/useDisableNumberInputScroll";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import { Input } from "components/ui/input";
import { cn } from "lib/utils";
import { FaRegEnvelope } from "react-icons/fa";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
}

const FormInput: FC<InputProps> = ({ name, label, disabled, ...rest }) => {
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const { control } = useFormContext();

  const { type, required } = rest;

  useDisableNumberInputScroll();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const { value, onChange } = field;
        return (
          <FormItem className='flex flex-col gap-0'>
            <FormLabel className={`mb-1.5 ${required ? 'required' : ''}`}>
              {label}
            </FormLabel>
            <FormControl>
              <div className='relative'>
                <Input
                  type={
                    type === "password"
                      ? isPasswordVisible
                        ? "text"
                        : "password"
                      : type
                  }
                  placeholder={rest.placeholder}
                  disabled={disabled}
                  onChange={(e) => {
                    // Convert to number for number inputs
                    if (type === 'number') {
                      const stringValue = e.target.value;
                      if (stringValue === '' || stringValue === null || stringValue === undefined) {
                        onChange(undefined); // Let validation handle empty values
                      } else {
                        const numericValue = parseFloat(stringValue);
                        // Only set valid numbers, otherwise keep as undefined
                        onChange(isNaN(numericValue) ? undefined : numericValue);
                      }
                    } else {
                      onChange(e);
                    }
                  }}
                  value={value || ""} // Ensure value is never undefined
                  className={cn(
                    "font-medium bg-gray-100 dark:bg-background placeholder:text-black/30 dark:placeholder:text-muted-foreground",
                    rest.className
                  )}
                />
                {rest.type === "password" && (
                  <div
                    className='absolute transform -translate-y-1/2 cursor-pointer top-1/2 right-4'
                    onClick={() => setPasswordVisibility(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? (
                      <EyeOff name='eye-off' className='text-primary' />
                    ) : (
                      <Eye name='eye' className='text-primary' />
                    )}
                  </div>
                )}

                {rest.type === "email" && (
                  <div className='absolute transform -translate-y-1/2 cursor-pointer top-1/2 right-4'>
                    <FaRegEnvelope className='text-primary' />
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage className='mt-1' />
          </FormItem>
        );
      }}
    />
  );
};

export default FormInput;
