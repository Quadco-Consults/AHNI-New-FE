import { useCallback, useMemo } from "react";
import usePaginationParams from "./usePaginationParams";

function useTablePaginationParams() {
  const [paginationParams, setPaginationParams] = usePaginationParams();

  const state = useMemo(() => getState(paginationParams), [paginationParams]);

  const setState = useCallback(
    (args) => {
      setPaginationParams((previousParam) => {
        const { pageIndex, pageSize } =
          typeof args === "function"
            ? args(getState(previousParam))
            : args || {};
        return { offset: pageIndex * pageSize, limit: pageSize };
      });
    },
    [setPaginationParams]
  );

  return /** @type {[typeof state, typeof setState, typeof paginationParams, typeof setPaginationParams]} */ ([
    state,
    setState,
    paginationParams,
    setPaginationParams,
  ]);
}

export default useTablePaginationParams;

/**
 * @param {{offset: number; limit: number}} params
 */
function getState({ limit, offset }) {
  return { pageSize: limit, pageIndex: offset / limit };
}
