import Card from "components/Card";
import { FC, ReactNode } from "react";
import AssetRequestLayoutHeading from "./LayoutHeading";

type IPageProps = {
    children: ReactNode;
};

const AssetRequestLayout: FC<IPageProps> = ({ children }) => {
    return (
        <div className="space-y-5">
            <AssetRequestLayoutHeading />
            <Card>{children}</Card>
        </div>
    );
};

export default AssetRequestLayout;
