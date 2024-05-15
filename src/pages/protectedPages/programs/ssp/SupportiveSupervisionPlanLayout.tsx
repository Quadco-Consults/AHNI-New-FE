import SupportiveSupervisionPlanHeading from "molecules/SupportiveSupervisionPlanHeading";
import { FC, ReactNode } from "react";

type IPageProps = {
  children: ReactNode;
};

const SupportiveSupervisionPlanLayout: FC<IPageProps> = ({ children }) => {
  return (
    <div>
      <SupportiveSupervisionPlanHeading />
      <div className="px-4 py-8 bg-white">{children}</div>
    </div>
  );
};

export default SupportiveSupervisionPlanLayout;
