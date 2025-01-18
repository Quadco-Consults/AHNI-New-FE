import BackNavigation from "atoms/BackNavigation";
import { Button } from "components/ui/button";
import TabState from "components/ui/TabState";
import { CG_GROUTES } from "constants/RouterConstants";
import { useState } from "react";
import { generatePath, Link, useParams } from "react-router-dom";
import SubmittedApplicationDetails from "../SubmittedApplicationDetails";
import SubmittedDocsUpload from "../SubmittedDocsUpload";
import { PreAwardAssessmentIcon } from "assets/svgs/CAndGSvgs";
import PreAwardAssessmentResult from "./PreAwardAssessmentResult";

const PreAwardAssessmentSingle = () => {
    const params = useParams();
    const tabDetails = [
        {
            id: 1,
            state: "organisation-details",
            name: "Organization’s Details",
            tabComponent: <SubmittedApplicationDetails />,
        },
        {
            id: 2,
            state: "document-upload",
            name: "Document Uploads",
            tabComponent: <SubmittedDocsUpload />,
        },
        {
            id: 2,
            state: "pre-award-assessment-result",
            name: "Pre-award Assessment Result",
            tabComponent: <PreAwardAssessmentResult />,
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
                    <Link
                        className="w-full"
                        to={generatePath(
                            CG_GROUTES.PRE_AWARD_ASSESSMENT_STEP_1,
                            {
                                id: params?.id,
                            }
                        )}
                    >
                        <Button className="flex gap-2 py-6" type="button">
                            <PreAwardAssessmentIcon />
                            <p>Start Pre-award Assessment</p>
                        </Button>
                    </Link>
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

export default PreAwardAssessmentSingle;
