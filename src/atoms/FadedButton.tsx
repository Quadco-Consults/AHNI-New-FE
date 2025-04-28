import { Button } from "components/ui/button";
import { cn } from "lib/utils";
import { Loader2 } from "lucide-react";
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
        <Button className={cn("gap-x-1 bg-[#FFF2F2]", className)} {...rest}>
            {preffix ? preffix : undefined}
            {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : undefined}
            {loading ? <span className="mt-1">Please wait</span> : children}
            {suffix ? suffix : undefined}
        </Button>
    );
};

export default FadedButton;
