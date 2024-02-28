import { createContext } from "react";

/** @type {React.Context<ErrorBoundaryContextType>} */
export const ErrorBoundaryContext = createContext();

/**
 * @typedef {{
 *  error: Error;
 *  reset: (...args: any[]) => void
 * }} ErrorBoundaryContextType
 */
