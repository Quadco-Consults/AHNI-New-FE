import ProcurementPlanHeading from "components/ProcurementPlanHeading";
import { FC, ReactNode } from "react";

type IPageProps = {
  children: ReactNode;
};

const ProcurementPlanLayout: FC<IPageProps> = ({ children }) => {
  return (
    <div className="space-y-4">
      <ProcurementPlanHeading />
      <div className="px-4 py-8 bg-white">{children}</div>
    </div>
  );
};

export default ProcurementPlanLayout;
