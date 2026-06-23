import Card from "@/components/Card";
import { StepperHeading } from "@/components/StepperHeading";
import { FC, ReactNode } from "react";

type IPageProps = {
  children: ReactNode;
};

const supportiveSteps = [
  { step: 1, stepName: "Facility & Team Composition", route: "composition" },
  { step: 2, stepName: "Evaluation Checklist", route: "checklist" },
];

const SupportiveSupervisionPlanLayout: FC<IPageProps> = ({ children }) => {
  return (
    <div className="space-y-5">
      <StepperHeading
        steps={supportiveSteps}
        storageKey="supportiveCompletedSteps"
        width="sm"
      />
      <Card>{children}</Card>
    </div>
  );
};

export default SupportiveSupervisionPlanLayout;
