import BackNavigation from "@/components/BackNavigation";
import Card from "@/components/Card";
import { StepperHeading } from "@/components/StepperHeading";
import { FC, ReactNode } from "react";

type IPageProps = {
    children: ReactNode;
};

const fundRequestSteps = [
    { step: 1, stepName: "Project Details", route: "project-details" },
    { step: 2, stepName: "Fund Request Summary", route: "fund-request-summary" },
    { step: 3, stepName: "Fund Request Preview", route: "fund-request-preview" },
];

const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Fund Request", icon: true },
    { name: "Create", icon: false },
];

const FundReqeustLayout: FC<IPageProps> = ({ children }) => {
    return (
        <div className="space-y-5">
            <BackNavigation />
            <StepperHeading
                steps={fundRequestSteps}
                storageKey="fundRequestCompletedSteps"
                breadcrumbs={breadcrumbs}
                width="md"
                wrapperClassName="space-y-xl"
            />
            <Card>{children}</Card>
        </div>
    );
};

export default FundReqeustLayout;
