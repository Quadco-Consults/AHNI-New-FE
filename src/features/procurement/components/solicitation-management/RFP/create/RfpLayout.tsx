import { StepperHeading } from "@/components/StepperHeading";
import { FC, ReactNode } from "react";

type IPageProps = {
  children: ReactNode;
};

const rfpSteps = [
  { step: 1, stepName: "Proposal", route: "proposal" },
  { step: 2, stepName: "Uploads", route: "uploads" },
];

const breadcrumbs = [
  { name: "Procurement", icon: true },
  { name: "Solicitation Management", icon: true },
  { name: "RFP", icon: true },
  { name: "Create", icon: false },
];

const RfpLayout: FC<IPageProps> = ({ children }) => {
  return (
    <div>
      <StepperHeading
        steps={rfpSteps}
        storageKey="rfpCompletedSteps"
        breadcrumbs={breadcrumbs}
        width="sm"
      />
      <div className='px-4 py-8 bg-white'>{children}</div>
    </div>
  );
};

export default RfpLayout;
