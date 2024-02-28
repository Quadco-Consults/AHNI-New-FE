import { useEffect } from "react";
import useDataRef from "./useDataRef";
import useLazyRef from "./useLazyRef";

/**
 * @param {ResizeObserverCallback} callback
 * @param {ResizeObserverOptions} options
 */
export function useResizeObserver(callback, elementRef, options) {
  const dataRef = useDataRef({ callback, options });

  const observer = useLazyRef(
    () =>
      new ResizeObserver((entries, observer) => {
        if (dataRef.current.callback) {
          dataRef.current.callback(entries, observer);
        }
      })
  ).current;

  useEffect(() => {
    if (elementRef) {
      const element = elementRef.current;
      if (element) {
        observer.observe(element, dataRef.current.options);
      }
      return () => {
        if (element) {
          observer.unobserve(element);
        }
      };
    }
  }, [dataRef, elementRef, observer]);

  return observer;
}

export default useResizeObserver;
