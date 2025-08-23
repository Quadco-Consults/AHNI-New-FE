"use client";

import BackNavigation from "components/atoms/BackNavigation";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { Button } from "components/ui/button";
import { CG_ROUTES } from "constants/RouterConstants";
import SubGrantAwardDetails from "./SubGrantAwardDetails";
import SubGrantSubmissionDetails from "./submission";
import { generatePath, Link, useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useGetSingleSubGrant } from "@/features/contracts-grants/controllers/subGrantController";
import { skipToken } from "@reduxjs/toolkit/query";
import { LoadingSpinner } from "components/Loading";
import { useState } from "react";

const SubGrantDetails = () => {
    const [tabValue, setTabValue] = useState("details");

    const { id } = useParams();

    const { data, isLoading } = useGetSingleSubGrant(id ?? skipToken);

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

                        <TabsTrigger value="shortlisted">
                            Shortlisted Sub-Grantees
                        </TabsTrigger>
                    </TabsList>
                </div>
                {tabValue === "submissions" && (
                    <div>
                        <Link
                            className="w-full"
                            href={generatePath(
                                CG_ROUTES.CREATE_SUBGRANT_SUBMISSION_DETAILS,
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

                {tabValue === "shortlisted" && (
                    <div>
                        <Link
                            href={generatePath(
                                CG_ROUTES.SUBGRANT_CREATE_PRE_AWARD_ASSESSMENT,
                                { id }
                            )}
                            className="w-full"
                        >
                            <Button className="flex gap-2 py-6" type="button">
                                <AddSquareIcon />
                                Create Pre-award Assessment
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

                        <TabsContent value="shortlisted">
                            <></>
                        </TabsContent>
                    </>
                )}
            </section>
        </Tabs>
    );
};

export default SubGrantDetails;
