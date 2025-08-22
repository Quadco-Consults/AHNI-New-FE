import { PaginationParamsDefault } from "constants/Global";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { urlSearchParamsExtractor } from "utils/URLUtils";

function usePaginationParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const state = useMemo(() => getParams(searchParams), [searchParams]);

  const setState = useCallback(
    (args: any) => {
      setSearchParams((searchParams) => {
        const {
          offset = PaginationParamsDefault.offset,
          limit = PaginationParamsDefault.limit,
        } =
          (typeof args === "function" ? args(getParams(searchParams)) : args) ||
          {};
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("offset", offset);
        newSearchParams.set("limit", limit);
        return newSearchParams;
      });
    },
    [setSearchParams]
  );

  return /** @type {[typeof state, typeof setState]} */ [state, setState];
}

export default usePaginationParams;

function getParams(searchParams: any) {
  const { offset, limit } = urlSearchParamsExtractor(
    searchParams,
    PaginationParamsDefault
  );
  return {
    offset: parseInt(offset),
    limit: parseInt(limit),
  };
}
