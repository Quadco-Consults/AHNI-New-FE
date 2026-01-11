import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/Loading";
import { ComponentProps, FC, ReactNode } from "react";

interface ButtonProps extends ComponentProps<typeof Button> {
    children: ReactNode;
    loading?: boolean;
    suffix?: ReactNode;
    preffix?: ReactNode;
}

const FadedButton: FC<ButtonProps> = ({
    loading,
    children,
    suffix,
    preffix,
    className,
    ...rest
}) => {
    return (
        <Button variant="custom" className={cn("gap-x-1", className)} disabled={loading} {...rest}>
            {preffix ? preffix : undefined}
            {loading ? (
                <LoadingSpinner size="sm" text="" className="mr-1" />
            ) : undefined}
            {loading ? <span>Please wait...</span> : children}
            {suffix ? suffix : undefined}
        </Button>
    );
};

export default FadedButton;
