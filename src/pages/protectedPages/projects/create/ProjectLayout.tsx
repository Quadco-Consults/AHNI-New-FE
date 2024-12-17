import Card from "components/shared/Card";
import ProjectsHeading from "molecules/ProjectsHeading";
import { FC, ReactNode } from "react";

type IPageProps = {
  children: ReactNode;
};

const ProjectLayout: FC<IPageProps> = ({ children }) => {
  return (
    <div className="space-y-5">
      <ProjectsHeading />
      <Card>{children}</Card>
    </div>
  );
};

export default ProjectLayout;
