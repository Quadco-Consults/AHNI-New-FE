import Card from "@/components/Card";
import { StepperHeading } from "@/components/StepperHeading";
import { FC, ReactNode } from "react";

type IPageProps = {
  children: ReactNode;
};

const projectSteps = [
  { step: 1, stepName: "Project Summary", route: "summary" },
  { step: 2, stepName: "Performance Targets", route: "targets" },
  { step: 3, stepName: "Uploads", route: "uploads" },
];

const ProjectLayout: FC<IPageProps> = ({ children }) => {
  return (
    <div className="space-y-5">
      <StepperHeading
        steps={projectSteps}
        storageKey="projectsCompletedSteps"
        width="lg"
      />
      <Card>{children}</Card>
    </div>
  );
};

export default ProjectLayout;
