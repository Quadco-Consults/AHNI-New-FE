import { StepperHeading } from "@/components/StepperHeading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RouteEnum } from "@/constants/RouterConstants";
import { X } from "lucide-react";
import { FC, ReactNode } from "react";

type IPageProps = {
  children: ReactNode;
};

const employeeSteps = [
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

const EmployeeRegistrationLayout: FC<IPageProps> = ({ children }) => {
  const breadcrumbs = (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>HR</BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <X size={16} />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href={RouteEnum.VENDOR_MANAGEMENT}>
            Onboarding
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <X size={16} />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Add New Employee</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <div>
      <StepperHeading
        steps={employeeSteps}
        storageKey="employeeCompletedSteps"
        breadcrumbs={breadcrumbs}
        showGoBack={true}
        width="full"
      />
      <div className="px-4 py-8 bg-white">{children}</div>
    </div>
  );
};

export default EmployeeRegistrationLayout;
