/**
 * StepperHeading Types
 * Generic step-based navigation component types
 */

export interface StepConfig {
  step: number;
  stepName: string;
  route: string;
}

export interface BreadcrumbItem {
  name: string;
  icon: boolean;
  href?: string;
}

export type LayoutVariant = 'horizontal' | 'vertical';

export type WidthSize = 'sm' | 'md' | 'lg' | 'full';

export interface StepperHeadingProps {
  /**
   * Array of step configurations
   * @required
   */
  steps: StepConfig[];

  /**
   * Unique key for sessionStorage persistence
   * @required
   * @example "rfqCompletedSteps"
   */
  storageKey: string;

  /**
   * Breadcrumb items for navigation
   * Can be an array of breadcrumb configs or a custom React element
   * @optional
   */
  breadcrumbs?: BreadcrumbItem[] | React.ReactNode;

  /**
   * Show back navigation button
   * @default false
   */
  showGoBack?: boolean;

  /**
   * Layout variant
   * @default 'horizontal'
   */
  variant?: LayoutVariant;

  /**
   * Component width preset
   * @default 'md'
   */
  width?: WidthSize;

  /**
   * Highlight the currently active step
   * @default false
   */
  showActiveHighlight?: boolean;

  /**
   * Additional className for the stepper container
   * @optional
   */
  className?: string;

  /**
   * Additional className for the wrapper section
   * @optional
   */
  wrapperClassName?: string;
}
