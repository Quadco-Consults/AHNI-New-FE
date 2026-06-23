import { StepperHeading } from "@/components/StepperHeading";
import { FC, ReactNode } from "react";

type IPageProps = {
  children: ReactNode;
};

const procurementPlanSteps = [
  { step: 1, stepName: "Procurement Plans", route: "procurement-plan" },
  { step: 2, stepName: "Procurement Milestones", route: "procurement-milestones" },
];

const breadcrumbs = [
  { name: "Procurement", icon: true },
  { name: "Procurement Plan", icon: true },
  { name: "Create", icon: false },
];

const ProcurementPlanLayout: FC<IPageProps> = ({ children }) => {
  return (
    <div className="space-y-4">
      <StepperHeading
        steps={procurementPlanSteps}
        storageKey="procurementPlanSteps"
        breadcrumbs={breadcrumbs}
        showGoBack={true}
        width="md"
      />
      <div className="px-4 py-8 bg-white">{children}</div>
    </div>
  );
};

export default ProcurementPlanLayout;
