import BackNavigation from "atoms/BackNavigation";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { Button } from "components/ui/button";
import { CG_GROUTES } from "constants/RouterConstants";
import SubGrantAwardDetails from "./SubGrantAwardDetails";
import SubGrantSubmissionDetails from "./PartnerSubmissionList";
import { generatePath, Link, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useGetSingleSubGrantQuery } from "services/c&g/subgrant/sub-grant";
import { skipToken } from "@reduxjs/toolkit/query";
import { LoadingSpinner } from "components/shared/Loading";
import { useState } from "react";
import { useDebounce } from "ahooks";

const SubGrantDetails = () => {
    const [tabValue, setTabValue] = useState("details");

    const { id } = useParams();

    const { data, isLoading } = useGetSingleSubGrantQuery(id ?? skipToken);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <Tabs
            defaultValue="details"
            value={tabValue}
            onValueChange={(value) => setTabValue(value)}
        >
            <section className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <BackNavigation />

                    <TabsList>
                        <TabsTrigger value="details">Details</TabsTrigger>

                        <TabsTrigger value="submissions">
                            Submissions
                        </TabsTrigger>

                        <TabsTrigger value="beneficiaries">
                            Awarded Beneficiaries
                        </TabsTrigger>
                    </TabsList>
                </div>
                {tabValue === "submissions" && (
                    <div>
                        <Link
                            className="w-full"
                            to={generatePath(
                                CG_GROUTES.CREATE_SUBGRANT_SUBMISSION_DETAILS,
                                {
                                    id,
                                }
                            )}
                        >
                            <Button className="flex gap-2 py-6" type="button">
                                <AddSquareIcon />
                                Manual Submission
                            </Button>
                        </Link>
                    </div>
                )}
            </section>
            <section>
                {data && (
                    <>
                        <TabsContent value="details">
                            <SubGrantAwardDetails {...data?.data} />
                        </TabsContent>
                        <TabsContent value="submissions">
                            <SubGrantSubmissionDetails {...data?.data} />
                        </TabsContent>

                        <TabsContent value="beneficiaries">
                            <></>
                        </TabsContent>
                    </>
                )}
            </section>
        </Tabs>
    );
};

export default SubGrantDetails;
