"use client";

import CheckIcon from "assets/svgs/CheckIcon";
import PendingIcon from "assets/svgs/PendingIcon";
import { Separator } from "components/ui/separator";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { RouteEnum } from "constants/RouterConstants";
import { Icon } from "@iconify/react";
import GoBack from "components/GoBack";

interface Step {
  step: number;
  stepName: string;
  route: string;
}

const steps: Step[] = [
  { step: 1, stepName: "Employee Information", route: "employee-information" },
 /*  {
    step: 2,
    stepName: "Additional Information",
    route: "additional-information",
  },
  {
    step: 3,
    stepName: "Beneficiary Designation ",
    route: "beneficiary-designation",
  },
  { step: 4, stepName: "ID Card Information", route: "id-card-information" },
  {
    step: 5,
    stepName: "Salary Account Details",
    route: "salary-account-details",
  },
  {
    step: 6,
    stepName: "Pension Scheme Enrolment",
    route: "pension-scheme-enrolment",
  }, */
];

const EmployeeRegistrationHeading = () => {
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(() => {
    // Retrieve the completion state from local storage or initialize if not present
    const savedSteps = sessionStorage.getItem("employeeCompletedSteps");
    return savedSteps
      ? JSON.parse(savedSteps)
      : new Array(steps.length).fill(false);
  });
  const { pathname } = useLocation();

  const currentPath = pathname.split("/").at(-1);

  useEffect(() => {
    const currentStepIndex = steps.findIndex(
      (step) => step.route === currentPath
    );
    // Mark the previous step as completed when navigating to a new step
    if (currentStepIndex > 0) {
      setCompletedSteps((prev) => {
        const updatedSteps = [...prev];
        updatedSteps[currentStepIndex - 1] = true; // Mark the previous step as completed
        sessionStorage.setItem(
          "employeeCompletedSteps",
          JSON.stringify(updatedSteps)
        );
        return updatedSteps;
      });
    }
  }, [currentPath]);

  return (
    <section className="space-y-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>HR</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href={RouteEnum.VENDOR_MANAGEMENT}>
              Onboarding
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Add New Employee</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <GoBack />

      <div className="grid justify-between w-full grid-cols-6 px-4 py-2 gap-y-4">
        {steps.map((_, i) => {
          return (
            <div className="flex items-center" key={i}>
              {completedSteps[i] ? <CheckIcon /> : <PendingIcon />}

              {i !== steps.length - 1 && (
                <div className="flex items-center justify-center w-full text-center ">
                  <Separator className="w-[70%] text-center h-[2px] bg-[#756D6D] " />
                </div>
              )}
            </div>
          );
        })}
        {steps.map((step, index) => {
          return (
            <div className="flex items-center " key={index}>
              <div className="text-sm ">
                <div className="space-y-1">
                  <div className="text-xs">STEP {step.step}</div>
                  <div className="text-sm font-semibold">{step.stepName}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default EmployeeRegistrationHeading;
