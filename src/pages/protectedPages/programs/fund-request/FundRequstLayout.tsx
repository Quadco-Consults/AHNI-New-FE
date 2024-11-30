import BackNavigation from "atoms/BackNavigation";
import Card from "components/shared/Card";
import FundRequestHeading from "molecules/FundRequestHeading";
import { FC, ReactNode } from "react";

type IPageProps = {
    children: ReactNode;
};

const FundRequstLayout: FC<IPageProps> = ({ children }) => {
    return (
        <div className="space-y-5">
            <BackNavigation />
            <FundRequestHeading />
            <Card>{children}</Card>
        </div>
    );
};

export default FundRequstLayout;
