import { Component, createElement, isValidElement } from "react";
import { ErrorBoundaryContext } from "./ErrorBoundaryContext";

/**
 * @extends {React.Component<ErrorBoundaryProps, ErrorBoundaryState>}
 */
class ErrorBoundary extends Component {
  static defaultProps = {};

  /**
   *
   * @param {ErrorBoundaryProps} props
   */
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  /**
   *
   * @param {Error} error
   * @returns {ErrorBoundaryState}
   */
  static getDerivedStateFromError(error) {
    return { error };
  }

  /**
   *
   * @param  {...any} args
   */
  reset(...args) {
    if (this.state.error !== null) {
      this.props.onReset?.({
        args,
        reason: "imperative-api",
      });

      this.setState(initialState);
    }
  }

  componentDidCatch(error, info) {
    this.props.onError?.(error, info);
  }

  /**
   *
   * @param {ErrorBoundaryProps} prevProps
   * @param {ErrorBoundaryState} prevState
   */
  componentDidUpdate(prevProps, prevState) {
    const { error } = this.state;
    const { resetKeys } = this.props;
    if (
      error !== null &&
      prevState.error !== null &&
      changedArray(prevProps.resetKeys, resetKeys)
    ) {
      this.props.onReset?.({
        next: resetKeys,
        prev: prevProps.resetKeys,
        reason: "keys",
      });

      this.setState(initialState);
    }
  }

  render() {
    const { error } = this.state;
    const { children, fallbackRender, FallbackComponent, fallback } =
      this.props;

    let childToRender = children;

    if (error !== null) {
      const props = { error, reset: this.reset };

      if (fallback === null || isValidElement(fallback)) {
        childToRender = fallback;
      } else if (typeof fallbackRender === "function") {
        childToRender = fallbackRender(props);
      } else if (typeof FallbackComponent === "function") {
        childToRender = createElement(FallbackComponent, props);
      } else {
        throw new Error(
          "error-boundary requires either a fallback, fallbackRender, or FallbackComponent prop"
        );
      }
    }

    return createElement(
      ErrorBoundaryContext.Provider,
      { value: { error, reset: this.reset } },
      childToRender
    );
  }
}

export default ErrorBoundary;

/** @type {ErrorBoundaryState} */
const initialState = { error: null, info: null };

const changedArray = (a = [], b = []) =>
  a.length !== b.length || a.some((item, index) => !Object.is(item, b[index]));

/**
 * @typedef {object} FallbackProps
 * @prop {Error} error
 * @prop {(...args: any[]) => void} reset
 */

/**
 * @callback FallbackRender
 * @param {FallbackProps} props
 */

/**
 * @typedef {import("react").PropsWithChildren<{
 * onError?: (error: Error, info: import("react").ErrorInfo) => void;
 * onReset?: (details: { reason: "imperative-api"; args: any[] } | { reason: "keys"; prev: any[] | undefined; next: any[] | undefined }) => void;
 * resetKeys?: any[];
 * }>} ErrorBoundarySharedProps
 */

/**
 * @typedef {{
 * fallback?: never;
 * FallbackComponent: import("react").ComponentType<FallbackProps>;
 * fallbackRender?: never;
 * } & ErrorBoundarySharedProps} ErrorBoundaryPropsWithComponent
 */

/**
 * @typedef {{
 * fallback?: never;
 * FallbackComponent?: never;
 * fallbackRender: typeof FallbackRender;
 * } & ErrorBoundarySharedProps} ErrorBoundaryPropsWithRender
 */

/**
 * @typedef {{
 * fallback: import("react").ReactElement<unknown, string | import("react").FunctionComponent | typeof Component> | null;
 * FallbackComponent?: never;
 * fallbackRender?: never;
 * } & ErrorBoundarySharedProps} ErrorBoundaryPropsWithFallback
 */

/**
 * @typedef {ErrorBoundaryPropsWithComponent | ErrorBoundaryPropsWithRender | ErrorBoundaryPropsWithFallback} ErrorBoundaryProps
 */

/**
 * @typedef {{error: Error}} ErrorBoundaryState
 */
