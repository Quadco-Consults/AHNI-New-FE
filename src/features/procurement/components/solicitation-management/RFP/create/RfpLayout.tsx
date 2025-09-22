import RfpHeading from "@/components/RfpHeading";
import { FC, ReactNode } from "react";

type IPageProps = {
  children: ReactNode;
};

const RfpLayout: FC<IPageProps> = ({ children }) => {
  return (
    <div>
      {/* <RfpHeading /> */}
      <div className='px-4 py-8 bg-white'>{children}</div>
    </div>
  );
};

export default RfpLayout;
