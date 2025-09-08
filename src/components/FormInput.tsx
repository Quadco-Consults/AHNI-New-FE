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
            <FormLabel className='mb-1.5'>
              {label}
              {required && (
                <span className='text-red-500' title='required'>
                  *
                </span>
              )}
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
                  onChange={onChange}
                  value={value || ""} // Ensure value is never undefined
                  className={cn(
                    "font-medium bg-[#F9F9F9] placeholder:text-black/30",
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
