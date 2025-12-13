"use client";

import { Checkbox } from "components/ui/checkbox";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "components/ui/form";
import { FC, InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label?: string;
    reverse?: boolean;
    labelClassName?: string;
    checkboxClassName?: string;
    labelStyle?: object;
}

const FormCheckBox: FC<InputProps> = ({
    name,
    label,
    className = "flex items-center space-x-3 space-y-0",
    reverse = false,
    labelClassName = "space-y-1 leading-none",
    checkboxClassName = "app-checkbox",
    labelStyle,
}) => {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => (
                <FormItem className={className}>
                    {!reverse ? (
                        <>
                            <FormControl>
                                <Checkbox
                                    className={checkboxClassName}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            {label && (
                                <div
                                    className={labelClassName}
                                    style={labelStyle}
                                >
                                    <FormLabel>{label}</FormLabel>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {label && (
                                <div
                                    className={labelClassName}
                                    style={labelStyle}
                                >
                                    <FormLabel>{label}</FormLabel>
                                </div>
                            )}
                            <FormControl>
                                <Checkbox
                                    className={checkboxClassName}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </>
                    )}
                </FormItem>
            )}
        />
    );
};

export default FormCheckBox;
