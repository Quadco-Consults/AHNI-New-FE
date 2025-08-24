"use client";

import { cn } from "lib/utils";
import { useFormContext } from "react-hook-form";

type TProps = {
    children: React.ReactNode;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    multiple?: boolean;
    className?: string;
};

export default function Upload({
    children,
    onChange,
    multiple = false,
    className,
}: TProps) {
    return (
        <div className={cn("inline-block relative", className)}>
            {children}
            <input
                type="file"
                multiple={multiple}
                className="absolute w-full h-full left-0 top-0 right-0 bottom-0 cursor-pointer opacity-0"
                onChange={onChange}
            />
        </div>
    );
}
