import "./EmptyContent.css";
import { cn } from "lib/utils";

export function EmptyContent(props) {
  const { title, className, ...rest } = props;
  return (
    <div className={clsx("EmptyContent", className)} {...rest}>
      {/* <CircularProgress color='primary' /> */}
      <h4 className={cn("EmptyContent__text")}>No Data</h4>
    </div>
  );
}

export default EmptyContent;
