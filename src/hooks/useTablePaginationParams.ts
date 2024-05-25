import { useCallback, useMemo } from "react";
import usePaginationParams from "./usePaginationParams";

function useTablePaginationParams() {
  const [paginationParams, setPaginationParams] = usePaginationParams();

  const state = useMemo(() => getState(paginationParams), [paginationParams]);

  const setState = useCallback(
    (args: any) => {
      setPaginationParams((previousParam: any) => {
        const { pageIndex, pageSize } =
          typeof args === "function"
            ? args(getState(previousParam))
            : args || {};
        return { offset: pageIndex * pageSize, limit: pageSize };
      });
    },
    [setPaginationParams]
  );

  return /** @type {[typeof state, typeof setState, typeof paginationParams, typeof setPaginationParams]} */ [
    state,
    setState,
    paginationParams,
    setPaginationParams,
  ];
}

export default useTablePaginationParams;

function getState({ limit, offset }: any) {
  return { pageSize: limit, pageIndex: offset / limit };
}
