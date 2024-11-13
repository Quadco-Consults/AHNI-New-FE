import React, { FC } from "react";
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

import { SelectHTMLAttributes } from "react";

type TOption = {
    label: string;
    value: string;
};
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    name: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    options?: TOption[];
    children?: React.ReactNode;
}
const FormSelect: FC<SelectProps> = ({
    name,
    label,
    required,
    placeholder,
    children,
    options,
}) => {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                const { value, onChange } = field;
                return (
                    <FormItem className="flex flex-col w-full gap-0">
                        {label && (
                            <FormLabel>
                                {label}
                                {required && (
                                    <span
                                        className="text-red-500 "
                                        title="required"
                                    >
                                        *
                                    </span>
                                )}
                            </FormLabel>
                        )}
                        <Select onValueChange={onChange} defaultValue={value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                            </FormControl>

                            {options ? (
                                <SelectContent>
                                    {options.map((item) => {
                                        return (
                                            <SelectItem
                                                className="cursor-pointer"
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
};

export default FormSelect;
