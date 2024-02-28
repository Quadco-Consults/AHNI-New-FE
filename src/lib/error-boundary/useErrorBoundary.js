import { useContext, useMemo, useRef, useState } from "react";
import { ErrorBoundaryContext } from "./ErrorBoundaryContext";

/**
 * @template {any} TError
 * @returns
 */
export function useErrorBoundary() {
  const context = useContext(ErrorBoundaryContext);

  if (context == null || typeof context.reset !== "function") {
    throw new Error("ErrorBoundaryContext not found");
  }

  const contextRef = useRef(context);
  contextRef.current = context;

  const [error, setError] = useState(null);

  const memoized = useMemo(
    () => ({
      /**
       *
       * @param  {...any} args
       */
      reset: (...args) => {
        contextRef.current.reset(...args);
        setError(null);
      },
      /**
       *
       * @param {TError} error
       */
      show: (error) => setError(error),
    }),
    []
  );

  if (error) throw error;

  return memoized;
}
