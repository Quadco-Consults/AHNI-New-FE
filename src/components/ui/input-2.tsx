"use client";

import React from "react";
import { FieldValues, UseFormRegister, UseFormGetValues, Validate } from "react-hook-form";

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  register: UseFormRegister<FieldValues & any>;
  required?: boolean;
  error: any;
  type?: "text" | "number" | "password" | "email";
  validate?: (value: string) => boolean | string;
  disabled?: boolean;
};

export const Input: React.FC<Props> = ({ name, label, placeholder, register, required, error, type = "text", validate, disabled }) => {
  const classes = {
    inputContainer: "w-full",
    label: "block mb-1 font-semibold text-gray-700 text-sm",
    input: "w-full p-2 border-2 border-gray-300 rounded-md caret-black text-small focus:outline-none bg-gray-100 text-gray-600",
    asterisk: "text-red-400",
    error: "text-red-400 border-2 border-red-400",
    errorMessage: "text-red-400 font-semibold text-xs",
  };

  return (
    <div className={classes.inputContainer}>
      <label htmlFor={name} className={classes.label}>
        {label}
        {required ? <span className={classes.asterisk}>&nbsp;*</span> : ""}
      </label>
      <input
        id={name}
        className={[classes.input, error && classes.error].filter(Boolean).join(" ")}
        placeholder={placeholder}
        type={type}
        {...register(name, {
          required,
          validate,
          ...(type === "email"
            ? {
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please enter a valid email",
                },
              }
            : {}),
        })}
        autoComplete={type === "password" ? "new-password" : "off"}
        disabled={disabled}
      />
      {error && <div className={classes.errorMessage}>{!error?.message && error?.type === "required" ? "This field is required" : error?.message}</div>}
    </div>
  );
};
