import { useMediaQuery as useMuiMediaQuery } from "@mui/material";

/**
 * @type {typeof useMuiMediaQuery}
 */
function useMediaQuery() {
  return useMuiMediaQuery(...arguments);
}

export default useMediaQuery;
