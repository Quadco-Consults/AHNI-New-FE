import { Suspense as ReactSuspense } from "react";
import { Loading } from "./Loading";

/**
 *
 * @param {import('react').SuspenseProps} props
 */

function Suspense({ fallback = <Loading />, ...props }: any) {
  return <ReactSuspense fallback={fallback} {...props} />;
}

export default Suspense;
