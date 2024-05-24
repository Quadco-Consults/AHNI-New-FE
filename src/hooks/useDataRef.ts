import { useRef } from "react";

function useDataRef(data: any) {
  const ref = useRef(data);
  ref.current = data;
  return ref;
}

export default useDataRef;
