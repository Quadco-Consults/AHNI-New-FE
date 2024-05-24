import { PaginationDefault } from "constants/Global";
import { useCallback, useState } from "react";

function usePagination() {
  const [state, setState] = useState(PaginationDefault);

  const paramsState = {
    offset: state.pageSize * state.pageIndex,
    limit: state.pageSize,
  };

  const setParamState = useCallback(({ offset, limit }: any) => {
    setState({ pageIndex: offset / limit, pageSize: limit });
  }, []);

  return /** @type {[typeof state, typeof setState, typeof paramsState, typeof setParamState]} */ [
    state,
    setState,
    paramsState,
    setParamState,
  ];
}

export default usePagination;
