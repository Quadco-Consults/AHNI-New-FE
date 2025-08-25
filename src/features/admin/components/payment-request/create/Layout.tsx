import Card from "components/Card";
import { FC, ReactNode } from "react";
import PaymentRequestLayoutHeading from "./LayoutHeading";

type IPageProps = {
    children: ReactNode;
};

const PaymentRequestLayout: FC<IPageProps> = ({ children }) => {
    return (
        <div className="space-y-5">
            <PaymentRequestLayoutHeading />
            <Card>{children}</Card>
        </div>
    );
};

export default PaymentRequestLayout;
