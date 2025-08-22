import Card from "components/Card";
import SupportiveSupervisionPlanHeading from "components/SupportiveSupervisionPlanHeading";
import { FC, ReactNode } from "react";

type IPageProps = {
  children: ReactNode;
};

const SupportiveSupervisionPlanLayout: FC<IPageProps> = ({ children }) => {
  return (
    <div className="space-y-5">
      <SupportiveSupervisionPlanHeading />
      <Card>{children}</Card>
    </div>
  );
};

export default SupportiveSupervisionPlanLayout;
