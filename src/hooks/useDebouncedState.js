import { debounce } from "utils/FunctionUtils";
import { useEffect, useMemo, useState } from "react";

/**
 * @template V
 * @param {V} initialState
 * @param {{wait: 0, enableReInitialize: boolean}} options
 */
function useDebouncedState(initialState, options = {}) {
  const { wait = 0, enableReInitialize = false } = options;
  const [state, setState] = useState(initialState);

  const debouncedSetState = useMemo(() => debounce(setState, wait), [wait]);

  useEffect(() => {
    if (enableReInitialize) {
      debouncedSetState(initialState);
    }
  }, [debouncedSetState, enableReInitialize, initialState]);

  return /** @type {[typeof state, typeof debouncedSetState]} */ ([
    state,
    debouncedSetState,
  ]);
}

export default useDebouncedState;
