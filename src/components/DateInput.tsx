"use client";

import { Button } from "components/ui/button";
import { Calendar } from "components/ui/calendar";
import { Label } from "components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { format } from "date-fns";
import { cn } from "lib/utils";
import { CalendarIcon } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

type TProps = {
    label?: string;
    name: string;
    required?: boolean;
};

export default function DateInput({ label, name }: TProps) {
    const { control } = useFormContext();

    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => {
                const { onChange, value } = field;

                return (
                    <div>
                        <Label>{label}</Label>
                        <br />
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="space-y-1">
                                    <Button
                                        variant={"outline"}
                                        type="button"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !value && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />

                                        {value ? (
                                            format(value, "yyy-MM-dd")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                    {error && (
                                        <span className="text-sm text-red-500 font-medium">
                                            {error.message}
                                        </span>
                                    )}
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={value}
                                    onSelect={(value) => {
                                        onChange(String(value));
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                );
            }}
        />
    );
}
