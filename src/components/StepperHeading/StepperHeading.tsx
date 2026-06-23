'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import CheckIcon from '@/assets/svgs/CheckIcon';
import PendingIcon from '@/assets/svgs/PendingIcon';
import { Separator } from '@/components/ui/separator';
import BreadcrumbCard from '@/components/Breadcrumb';
import GoBack from '@/components/GoBack';
import { cn } from '@/lib/utils';
import type { StepperHeadingProps } from './types';

const WIDTH_CLASSES = {
  sm: 'w-1/2',
  md: 'w-2/3',
  lg: 'w-full md:w-2/3',
  full: 'w-full',
} as const;

/**
 * Generic StepperHeading Component
 *
 * A reusable step-based navigation component that:
 * - Displays step progress with icons
 * - Persists completion state in sessionStorage
 * - Automatically marks previous steps as completed
 * - Supports horizontal and vertical layouts
 * - Integrates with breadcrumbs and back navigation
 *
 * @example
 * ```tsx
 * <StepperHeading
 *   steps={[
 *     { step: 1, stepName: "Quotation", route: "quotation" },
 *     { step: 2, stepName: "Items", route: "items" },
 *   ]}
 *   storageKey="rfqCompletedSteps"
 *   breadcrumbs={[{ name: "Home", icon: true }]}
 *   width="md"
 * />
 * ```
 */
export const StepperHeading = ({
  steps,
  storageKey,
  breadcrumbs,
  showGoBack = false,
  variant = 'horizontal',
  width = 'md',
  showActiveHighlight = false,
  className,
  wrapperClassName,
}: StepperHeadingProps) => {
  // Initialize completed steps from sessionStorage
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedSteps = sessionStorage.getItem(storageKey);
        if (savedSteps) {
          return JSON.parse(savedSteps);
        }
      } catch (error) {
        console.error('Error loading stepper state:', error);
      }
    }
    return new Array(steps.length).fill(false);
  });

  const pathname = usePathname();
  const currentPath = pathname?.split('/').at(-1);

  // Mark previous step as completed when navigating
  useEffect(() => {
    const currentStepIndex = steps.findIndex((step) => step.route === currentPath);

    if (currentStepIndex > 0) {
      setCompletedSteps((prev) => {
        const updatedSteps = [...prev];
        updatedSteps[currentStepIndex - 1] = true;

        // Persist to sessionStorage
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.setItem(storageKey, JSON.stringify(updatedSteps));
          } catch (error) {
            console.error('Error saving stepper state:', error);
          }
        }

        return updatedSteps;
      });
    }
  }, [currentPath, steps, storageKey]);

  // Render breadcrumbs
  const renderBreadcrumbs = () => {
    if (!breadcrumbs) return null;

    // Array of breadcrumb items
    if (Array.isArray(breadcrumbs)) {
      return <BreadcrumbCard list={breadcrumbs} />;
    }

    // Custom React element
    return breadcrumbs;
  };

  // Render horizontal layout (most common)
  const renderHorizontalLayout = () => {
    const gridColsClass = `grid-cols-${steps.length}`;

    return (
      <div
        className={cn(
          'grid justify-between px-4 py-2 gap-y-4',
          WIDTH_CLASSES[width],
          gridColsClass,
          className
        )}
      >
        {/* Icons row with separators */}
        {steps.map((_, i) => (
          <div className="flex items-center" key={`icon-${i}`}>
            {completedSteps[i] ? <CheckIcon /> : <PendingIcon />}
            {i !== steps.length - 1 && (
              <div className="flex items-center justify-center w-full text-center">
                <Separator className="w-[70%] text-center h-[2px] bg-gray-text" />
              </div>
            )}
          </div>
        ))}

        {/* Labels row */}
        {steps.map((step, index) => {
          const isActive = showActiveHighlight && currentPath === step.route;

          return (
            <div className="flex items-center" key={`label-${index}`}>
              <div className="text-sm">
                <div className="space-y-1">
                  <div
                    className={cn(
                      'text-xs',
                      isActive && 'text-primary font-semibold'
                    )}
                  >
                    STEP {step.step}
                  </div>
                  <div
                    className={cn(
                      'text-sm font-semibold',
                      isActive && 'text-primary'
                    )}
                  >
                    {step.stepName}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render vertical layout (VendorRegistration style)
  const renderVerticalLayout = () => (
    <div
      className={cn(
        'flex items-start justify-between px-4 py-6',
        WIDTH_CLASSES[width],
        className
      )}
    >
      {steps.map((step, index) => {
        const isActive = showActiveHighlight && currentPath === step.route;
        const isCompleted = completedSteps[index];

        return (
          <div key={index} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              {/* Icon */}
              <div className="mb-3">
                {isCompleted ? <CheckIcon /> : <PendingIcon />}
              </div>

              {/* Labels */}
              <div className="text-center space-y-1">
                <div
                  className={cn(
                    'text-xs font-medium',
                    isActive ? 'text-primary' : 'text-gray-500'
                  )}
                >
                  STEP {step.step}
                </div>
                <div
                  className={cn(
                    'text-sm font-semibold',
                    isActive ? 'text-primary' : 'text-gray-700'
                  )}
                >
                  {step.stepName}
                </div>
              </div>
            </div>

            {/* Separator between steps */}
            {index !== steps.length - 1 && (
              <div className="flex items-center justify-center px-2 -mt-8">
                <Separator className="w-12 h-[2px] bg-gray-300" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <section className={cn('space-y-5', wrapperClassName)}>
      {renderBreadcrumbs()}
      {showGoBack && <GoBack />}
      {variant === 'horizontal' ? renderHorizontalLayout() : renderVerticalLayout()}
    </section>
  );
};
