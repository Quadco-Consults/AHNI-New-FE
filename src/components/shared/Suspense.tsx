import { Suspense as ReactSuspense } from "react";
import Loading from "./Loading";

/**
 *
 * @param {import('react').SuspenseProps} props
 */
function Suspense(props: any) {
  return <ReactSuspense {...props} />;
}

Suspense.defaultProps = {
  fallback: <Loading />,
};

export default Suspense;
