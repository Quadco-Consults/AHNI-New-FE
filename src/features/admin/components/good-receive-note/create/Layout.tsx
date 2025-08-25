import Card from "components/Card";
import { FC, ReactNode } from "react";
import GoodReceiveNoteLayoutHeading from "./LayoutHeading";

type IPageProps = {
    children: ReactNode;
};

const GoodReceiveNoteLayout: FC<IPageProps> = ({ children }) => {
    return (
        <div className="space-y-5">
            <GoodReceiveNoteLayoutHeading />
            <Card>{children}</Card>
        </div>
    );
};

export default GoodReceiveNoteLayout;
