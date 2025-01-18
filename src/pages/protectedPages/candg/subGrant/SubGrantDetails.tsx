import BackNavigation from "atoms/BackNavigation";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { Button } from "components/ui/button";
import TabState from "components/ui/TabState";
import { useState } from "react";
import SubGrantAwardDetails from "./SubGrantAwardDetails";
import SubGrantSubmissionDetails from "./SubGrantSubmissionDetails";
import { generatePath, Link, useParams } from "react-router-dom";
import { CG_GROUTES } from "constants/RouterConstants";

const SubGrantDetails = () => {
    const params = useParams();
    const tabDetails = [
        {
            id: 1,
            state: "details",
            name: "details",
            tabComponent: <SubGrantAwardDetails />,
        },
        {
            id: 2,
            state: "submissions",
            name: "Submissions",
            tabComponent: <SubGrantSubmissionDetails />,
        },
        {
            id: 2,
            state: "awarded-beneficiaries",
            name: "Awarded Beneficiaries",
            tabComponent: <></>,
        },
    ];
    const [tabState, setTabState] = useState<string | number>(
        tabDetails[0].state
    );
    return (
        <main className="w-full flex flex-col items-center justify-center gap-y-[1.875rem]">
            <section className="w-full flex items-center justify-between">
                <div className="w-auto flex gap-x-[1.25rem] items-center justify-start">
                    <BackNavigation />
                    <TabState
                        tabArray={tabDetails}
                        setState={setTabState}
                        tabState={tabState}
                    />
                </div>
                <div>
                    {tabState === tabDetails[1].state && (
                        <Link
                            className="w-full"
                            to={generatePath(
                                CG_GROUTES.MANUAL_SUB_GRANT_SUBMISSION,
                                {
                                    id: params?.id,
                                }
                            )}
                        >
                            <Button className="flex gap-2 py-6" type="button">
                                <AddSquareIcon />
                                <p>Manual Submission</p>
                            </Button>
                        </Link>
                    )}
                </div>
            </section>
            <section className="w-full">
                {tabDetails.map((item, index) => {
                    return (
                        tabState === item.state && (
                            <div key={index}>{item.tabComponent}</div>
                        )
                    );
                })}
            </section>
        </main>
    );
};

export default SubGrantDetails;
