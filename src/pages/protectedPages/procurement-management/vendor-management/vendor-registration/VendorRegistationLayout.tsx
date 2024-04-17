import VendorRegistrationHeading from "molecules/VendorRegistrationHeading";
import { FC, ReactNode } from "react";

type IPageProps = {
  children: ReactNode;
};

const VendorRegistationLayout: FC<IPageProps> = ({ children }) => {
  return (
    <div>
      <VendorRegistrationHeading />
      <div>{children}</div>
    </div>
  );
};

export default VendorRegistationLayout;
