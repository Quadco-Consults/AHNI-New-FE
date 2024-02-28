import { useSearchParams } from "react-router-dom";
import { urlSearchParamsExtractor } from "utils/URLUtils";

/**
 *
 * @param {SearchParamStepStateHookOptions} options
 */
function useSearchParamStepState(options) {
  const {
    paramKey = "step",
    initialParam,
    toStep = (s) => parseInt(s),
    toParam = (s) => s,
  } = options;
  const [searchParams, setSearchParams] = useSearchParams();
  const extractedParams = urlSearchParamsExtractor(searchParams, {
    [paramKey]: initialParam,
  });

  const step = toStep(extractedParams[paramKey]);

  function onStateChange(updaterOrValue) {
    setSearchParams({
      [paramKey]: toParam(
        typeof updaterOrValue === "function"
          ? updaterOrValue(step)
          : updaterOrValue
      ),
    });
  }

  return /** @type {[typeof step, typeof onStateChange]} */ ([
    step,
    onStateChange,
  ]);
}

export default useSearchParamStepState;

/**
 * @typedef {{
 * initialParam: string;
 * paramKey: string;
 * toStep: (step: string) => number;
 * toParam: (step: number) => string
 * }} SearchParamStepStateHookOptions
 */
