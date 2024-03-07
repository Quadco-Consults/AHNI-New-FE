import { Suspense as ReactSuspense } from "react";
import logoPng from "assets/svgs/logo-bg.svg";
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
    <div className="flex justify-center h-screen items-center p-8">
      <div>
        <img
          src={logoPng}
          alt="logo"
          className="mx-auto animate-bounce"
          // width={200}
        />
        <p>Loading...</p>
      </div>
    </div>
  ),
};

export default Suspense;
