import Card from "components/shared/Card";
import ProjectsEditHeading from "molecules/ProjectsEditHeading";
import { FC, ReactNode } from "react";

type IPageProps = {
  children: ReactNode;
};

const ProjectLayout: FC<IPageProps> = ({ children }) => {
  return (
    <div className="space-y-5">
      <ProjectsEditHeading />
      <Card>{children}</Card>
    </div>
  );
};

export default ProjectLayout;
