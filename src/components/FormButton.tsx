import { Button } from "components/ui/button";
import { LoadingSpinner } from "components/Loading";
import { ComponentProps, FC, ReactNode } from "react";

interface ButtonProps extends ComponentProps<typeof Button> {
  children: ReactNode;
  loading?: boolean;
  suffix?: ReactNode;
  preffix?: ReactNode;
}

const FormButton: FC<ButtonProps> = ({
  loading,
  children,
  suffix,
  preffix,
  ...rest
}) => {
  return (
    <Button className="gap-x-1" disabled={loading} {...rest}>
      {preffix ? preffix : undefined}
      {loading ? (
        <LoadingSpinner size="sm" text="" className="mr-1" />
      ) : undefined}
      {loading ? <span>Please wait...</span> : children}
      {suffix ? suffix : undefined}
    </Button>
  );
};

export default FormButton;
