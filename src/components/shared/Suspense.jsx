import { Suspense as ReactSuspense } from "react";
// import LoadingIndicator from "./LoadingIndicator";

/**
 *
 * @param {import('react').SuspenseProps} props
 */
function Suspense(props) {
  return <ReactSuspense {...props} />;
}

Suspense.defaultProps = {
  fallback: (
    <div className="flex justify-center items-center p-8">
      <p>Loading...</p>
    </div>
  ),
};

export default Suspense;
