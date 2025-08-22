import BackNavigation from "components/atoms/BackNavigation";
import Card from "components/Card";
import FundRequestHeading from "components/FundRequestHeading";
import { FC, ReactNode } from "react";

type IPageProps = {
    children: ReactNode;
};

const FundReqeustLayout: FC<IPageProps> = ({ children }) => {
    return (
        <div className="space-y-5">
            <BackNavigation />
            <FundRequestHeading />
            <Card>{children}</Card>
        </div>
    );
};

export default FundReqeustLayout;
