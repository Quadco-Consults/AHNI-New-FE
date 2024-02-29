import { forwardRef } from "react";

const LoadingIndicator = forwardRef(function LoadingIndicator(props, ref) {
  return <Loader ref={ref} {...props} />;
});

export default LoadingIndicator;
