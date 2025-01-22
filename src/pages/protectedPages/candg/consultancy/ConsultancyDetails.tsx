import BackNavigation from "atoms/BackNavigation";
import TabState from "components/ui/TabState";
import { useState } from "react";
import ConsultancyJobDetails from "./ConsultancyJobDetails";
import ConsultancyScopeOfWorkDetails from "./ConsultancyScopeOfWorkDetails";
import ConsultancySubmittedApplications from "./ConsultancySubmittedApplications";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { CG_GROUTES } from "constants/RouterConstants";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import ConsultancyShortList from "./ConsultancyShortList";

const ConsultancyDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const tabDetails = [
        {
            id: 1,
            state: "job-details",
            name: "Job Details",
            tabComponent: (
                <>
                    <ConsultancyJobDetails />
                </>
            ),
        },
        {
            id: 2,
            state: "scope-of-work",
            name: "Scope of Work",
            tabComponent: (
                <>
                    <ConsultancyScopeOfWorkDetails />
                </>
            ),
        },
        {
            id: 2,
            state: "submitted-applications",
            name: "Submitted Applications",
            tabComponent: (
                <>
                    <ConsultancySubmittedApplications />
                </>
            ),
        },
        {
            id: 2,
            state: "short-list",
            name: "Shortlist",
            tabComponent: (
                <>
                    <ConsultancyShortList />
                </>
            ),
        },
        {
            id: 2,
            state: "contract-request-form",
            name: "Contract Request Form",
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
                    {tabState === tabDetails[2].state && (
                        <Button
                            className="flex gap-2 py-6"
                            type="button"
                            onClick={() => {
                                navigate(
                                    generatePath(
                                        CG_GROUTES.ADD_CONSULTANCY_APPLICATION,
                                        {
                                            id: params.id,
                                        }
                                    )
                                );
                            }}
                        >
                            <AddSquareIcon />
                            <p>Add Applicant</p>
                        </Button>
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
            {/* )} */}
        </main>
    );
};

export default ConsultancyDetails;
