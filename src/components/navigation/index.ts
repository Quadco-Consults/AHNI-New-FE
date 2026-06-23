/**
 * Navigation components
 * Breadcrumbs, back buttons and navigation-related components
 * Re-exports from original locations for backward compatibility
 */

export { default as Breadcrumb } from '@/components/Breadcrumb';
export { default as BackNavigation } from '@/components/BackNavigation';
export { default as GoBack } from '@/components/GoBack';
export { default as StepHeader } from '@/components/StepHeader';

// Page heading components - Migrated to StepperHeading
// See /components/StepperHeading for the generic step-based navigation component
export { StepperHeading } from '@/components/StepperHeading';
export type { StepperHeadingProps, StepConfig, BreadcrumbItem, LayoutVariant, WidthSize } from '@/components/StepperHeading';
