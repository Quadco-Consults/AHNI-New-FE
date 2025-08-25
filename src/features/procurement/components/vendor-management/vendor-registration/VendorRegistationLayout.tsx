import VendorRegistrationHeading from "components/VendorRegistrationHeading";
import { FC, ReactNode } from "react";

type IPageProps = {
  children: ReactNode;
};

const VendorRegistationLayout: FC<IPageProps> = ({ children }) => {
  return (
    <div>
      <VendorRegistrationHeading />
      <div className="px-4 py-8 bg-white">{children}</div>
    </div>
  );
};

export default VendorRegistationLayout;
