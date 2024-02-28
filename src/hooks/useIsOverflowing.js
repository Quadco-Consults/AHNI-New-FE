import React from "react";
import useResizeObserver from "./useResizeObserver";

/**
 * @template {HTMLElement} T
 * @param {React.MutableRefObject<T>} ref
 */
export function useIsOverflowing(ref) {
  const [isOverflowing, setOverflowing] = React.useState(false);

  useResizeObserver(() => {
    if (ref && ref.current) {
      let overflow = ref.current.style.overflow;
      if (!overflow || overflow === "visible") {
        ref.current.style.overflow = "hidden";
      }
      setOverflowing(
        ref.current.clientWidth < ref.current.scrollWidth ||
          ref.current.clientHeight < ref.current.scrollHeight
      );
      ref.current.style.overflow = overflow;
    }
  }, ref);
  return isOverflowing;
}

export default useIsOverflowing;
