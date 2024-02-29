// import ErrorContentImg from "assets/images/ErrorContent.png";
import "./ErrorContent.css";
// import useLogout from "hooks/useLogout";
import { cn } from "lib/utils";
import { Button } from "components/ui/button";
import { Frown } from "lucide-react";

function ErrorContent(props) {
  const { title, description, className, onTryAgain, ...rest } = props;

  // const { logout } = useLogout();

  return (
    <div className={cn("ErrorContent", className)} {...rest}>
      <h4 className="text-center">{title}</h4>
      <div>
        <Frown />
      </div>
      <h6
        // color="secondary"
        className="text-center mb-4 font-bold"
      >
        {description}
      </h6>
      <div className="flex items-center gap-2 flex-wrap">
        {/* <Button variant='outlined'>Send Report</Button> */}
        <Button onClick={onTryAgain}>Try Again</Button>
      </div>
    </div>
  );
}

ErrorContent.defaultProps = {
  title: "Something went wrong",
  description: "We're quite sorry about this!",
  elevation: 0,
};

export default ErrorContent;
