import RfpHeading from "molecules/RfpHeading";
import { FC, ReactNode } from "react";

type IPageProps = {
  children: ReactNode;
};

const RfqLayout: FC<IPageProps> = ({ children }) => {
  return (
    <div>
      {/* <RfpHeading /> */}
      <div className='px-4 py-8 bg-white'>{children}</div>
    </div>
  );
};

export default RfqLayout;
