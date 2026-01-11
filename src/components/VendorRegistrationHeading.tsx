"use client";

import CheckIcon from "assets/svgs/CheckIcon";
import PendingIcon from "assets/svgs/PendingIcon";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RouteEnum } from "@/constants/RouterConstants";
import { Icon } from "@iconify/react";
import GoBack from "@/components/GoBack";
import { cn } from "@/lib/utils";

interface Step {
  step: number;
  stepName: string;
  route: string;
}

const steps: Step[] = [
  { step: 1, stepName: "Vendor Registration", route: "vendor-registration" },
  { step: 2, stepName: "Branch Offices", route: "the-company" },
  { step: 3, stepName: "Reference", route: "reference" },
  { step: 4, stepName: "Upload", route: "upload" },
  { step: 5, stepName: "Attestation", route: "attestation" },
];

const VendorRegistrationHeading = () => {
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(() => {
    // Retrieve the completion state from session storage or initialize if not present
    if (typeof window !== 'undefined') {
      const savedSteps = sessionStorage.getItem("completedSteps");
      return savedSteps
        ? JSON.parse(savedSteps)
        : new Array(steps.length).fill(false);
    }
    return new Array(steps.length).fill(false);
  });
  const pathname = usePathname();

  const currentPath = pathname.split("/").at(-1);

  useEffect(() => {
    const currentStepIndex = steps.findIndex(
      (step) => step.route === currentPath
    );
    // Mark the previous step as completed when navigating to a new step
    if (currentStepIndex > 0 && typeof window !== 'undefined') {
      setCompletedSteps((prev) => {
        const updatedSteps = [...prev];
        updatedSteps[currentStepIndex - 1] = true; // Mark the previous step as completed
        sessionStorage.setItem("completedSteps", JSON.stringify(updatedSteps));
        return updatedSteps;
      });
    }
  }, [currentPath]);

  return (
    <section className='space-y-5'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Procurement</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon='iconoir:slash' />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href={RouteEnum.VENDOR_MANAGEMENT}>
              Prequalification
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon='iconoir:slash' />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Create Vendor</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <GoBack />

      <div className='flex items-start justify-between w-full px-4 py-6'>
        {steps.map((step, index) => {
          const isActive = currentPath === step.route;
          const isCompleted = completedSteps[index];

          return (
            <div key={index} className='flex items-center flex-1'>
              <div className='flex flex-col items-center flex-1'>
                {/* Icon */}
                <div className='mb-3'>
                  {isCompleted ? <CheckIcon /> : <PendingIcon />}
                </div>

                {/* Step info */}
                <div className='text-center space-y-1'>
                  <div className={cn(
                    'text-xs font-medium',
                    isActive ? 'text-primary' : 'text-gray-500'
                  )}>
                    STEP {step.step}
                  </div>
                  <div className={cn(
                    'text-sm font-semibold',
                    isActive ? 'text-primary' : 'text-gray-700'
                  )}>
                    {step.stepName}
                  </div>
                </div>
              </div>

              {/* Separator line between steps */}
              {index !== steps.length - 1 && (
                <div className='flex items-center justify-center px-2 -mt-8'>
                  <Separator className='w-12 h-[2px] bg-gray-300' />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default VendorRegistrationHeading;
