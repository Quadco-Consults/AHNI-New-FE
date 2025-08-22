import EmployeeRegistrationHeading from "components/EmployeeRegistrationHeading";
import { FC, ReactNode } from "react";

type IPageProps = {
  children: ReactNode;
};

const EmployeeRegistrationLayout: FC<IPageProps> = ({ children }) => {
  return (
    <div>
      <EmployeeRegistrationHeading />
      <div className="px-4 py-8 bg-white">{children}</div>
    </div>
  );
};

export default EmployeeRegistrationLayout;
