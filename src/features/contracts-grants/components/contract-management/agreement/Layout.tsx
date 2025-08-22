import Card from "components/Card";
import { FC, ReactNode } from "react";
import ServiceLevelAgreementLayoutHeading from "./LayoutHeading";

type IPageProps = {
    children: ReactNode;
};

const ServiceLevelAgreementLayout: FC<IPageProps> = ({ children }) => {
    return (
        <div className="space-y-5">
            <ServiceLevelAgreementLayoutHeading />
            <Card>{children}</Card>
        </div>
    );
};

export default ServiceLevelAgreementLayout;
