"use client";

import BackNavigation from "components/atoms/BackNavigation";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { Button } from "components/ui/button";
import { CG_ROUTES } from "constants/RouterConstants";
import SubGrantAwardDetails from "./SubGrantAwardDetails";
import SubGrantSubmissionDetails from "./submission";
import ShortlistedSubmissionsList from "./shortlisted";
import AssessmentResults from "./assessment-results";
import SubGrantExpenditureHistory from "./_components/SubGrantExpenditureHistory";
import SubGrantObligationHistory from "./_components/SubGrantObligationHistory";
import SubGrantModificationHistory from "./_components/SubGrantModificationHistory";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useGetSingleSubGrant } from "@/features/contracts-grants/controllers/subGrantController";
import { skipToken } from "@reduxjs/toolkit/query";
import { LoadingSpinner } from "components/Loading";
import { useState } from "react";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";

const SubGrantDetails = () => {
    const [tabValue, setTabValue] = useState("details");

    const params = useParams();
    const id = params?.id as string;
    const dispatch = useAppDispatch();

    const { data, isLoading } = useGetSingleSubGrant(id ?? skipToken);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <section className="space-y-5">
            <div className="flex items-center justify-between">
                <BackNavigation />

                {tabValue === "submissions" && (
                    <div>
                        <Link
                            className="w-full"
                            href={CG_ROUTES.CREATE_SUBGRANT_SUBMISSION_DETAILS.replace(':id', id || '')}
                        >
                            <Button className="flex gap-2 py-6" type="button">
                                <AddSquareIcon />
                                Manual Submission
                            </Button>
                        </Link>
                    </div>
                )}

                {tabValue === "shortlisted" && (
                    <div className="flex items-center gap-3">
                        <Link
                            href={CG_ROUTES.SUBGRANT_CREATE_PRE_AWARD_ASSESSMENT.replace(':id', id || '')}
                            className="w-full"
                        >
                            <Button className="flex gap-2 py-6" type="button">
                                <AddSquareIcon />
                                Create Pre-award Assessment
                            </Button>
                        </Link>
                    </div>
                )}

                {tabValue === "assessment-results" && (
                    <div>
                        <Link
                            href={`/dashboard/c-and-g/sub-grant/awards/${id}/multi-award`}
                            className="w-full"
                        >
                            <Button className="flex gap-2 py-6 bg-green-600 hover:bg-green-700" type="button">
                                <AddSquareIcon />
                                Award to Multiple Beneficiaries
                            </Button>
                        </Link>
                    </div>
                )}

                {(tabValue === "expenditure" ||
                    tabValue === "obligation" ||
                    tabValue === "modifications") &&
                    id && (
                        <Button
                            className="flex gap-2 py-6"
                            type="button"
                            onClick={() => {
                                dispatch(
                                    openDialog({
                                        type:
                                            tabValue === "expenditure"
                                                ? DialogType.ExpenditureModal
                                                : tabValue === "obligation"
                                                ? DialogType.ADD_SUBGRANT_OBLIGATION_MODAL
                                                : DialogType.MODIFY_SUBGRANT,
                                        dialogProps: {
                                            header:
                                                tabValue === "expenditure"
                                                    ? "Add Expenditure"
                                                    : tabValue === "obligation"
                                                    ? "Add Obligation"
                                                    : "Add Modification",
                                            width: "max-w-lg",
                                            subGrantId: id,
                                            data: { id: id, title: data?.data?.title },
                                        },
                                    })
                                );
                            }}
                        >
                            <AddSquareIcon />
                            {tabValue === "expenditure"
                                ? "Add Expenditure"
                                : tabValue === "obligation"
                                ? "Add Obligation"
                                : "Add Modification"}
                        </Button>
                    )}
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <Tabs
                    defaultValue={tabValue}
                    value={tabValue}
                    onValueChange={(value) => setTabValue(value)}
                    className="space-y-5"
                >
                    <TabsList className="ml-10">
                        <TabsTrigger value="details">Details</TabsTrigger>

                        <TabsTrigger value="submissions">Submissions</TabsTrigger>

                        <TabsTrigger value="shortlisted">Shortlisted Sub-Grantees</TabsTrigger>

                        <TabsTrigger value="assessment-results">Assessment Results</TabsTrigger>

                        <TabsTrigger value="expenditure">Expenditure History</TabsTrigger>

                        <TabsTrigger value="obligation">Obligations</TabsTrigger>

                        <TabsTrigger value="modifications">Modifications</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details">
                        {data && <SubGrantAwardDetails {...data?.data} />}
                    </TabsContent>

                    <TabsContent value="submissions">
                        {data && <SubGrantSubmissionDetails {...data?.data} />}
                    </TabsContent>

                    <TabsContent value="shortlisted">
                        {data && <ShortlistedSubmissionsList {...data?.data} />}
                    </TabsContent>

                    <TabsContent value="assessment-results">
                        <AssessmentResults />
                    </TabsContent>

                    <TabsContent value="expenditure">
                        {data && <SubGrantExpenditureHistory {...data?.data} />}
                    </TabsContent>

                    <TabsContent value="obligation">
                        {data && <SubGrantObligationHistory {...data?.data} />}
                    </TabsContent>

                    <TabsContent value="modifications">
                        <SubGrantModificationHistory />
                    </TabsContent>
                </Tabs>
            )}
        </section>
    );
};

export default SubGrantDetails;
