"use client";

import BackNavigation from "components/atoms/BackNavigation";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { Button } from "components/ui/button";
import { CG_ROUTES } from "constants/RouterConstants";
import SubGrantAwardDetails from "./SubGrantAwardDetails";
import SubGrantSubmissionDetails from "./submission";
import ShortlistedSubmissionsList from "./shortlisted";
import AssessmentResults from "./assessment-results";
import AwardedPartnersView from "./awarded-partners";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useGetSingleSubGrant } from "@/features/contracts-grants/controllers/subGrantController";
import { useOpenSubmissions, useCloseSubmissions, usePublishSubGrant } from "@/features/contracts-grants/controllers/subGrantWorkflowController";
import { skipToken } from "@reduxjs/toolkit/query";
import { LoadingSpinner } from "components/Loading";
import { useState } from "react";
import { toast } from "sonner";

const SubGrantDetails = () => {
    const [tabValue, setTabValue] = useState("details");

    const params = useParams();
    const id = params?.id as string;

    const { data, isLoading, refetch } = useGetSingleSubGrant(id ?? skipToken);

    // Get current sub-grant status for workflow validation
    const subGrantStatus = data?.data?.status;

    // Workflow control hooks
    const { openSubmissions, isLoading: openingSubmissions } = useOpenSubmissions(id || "");
    const { closeSubmissions, isLoading: closingSubmissions } = useCloseSubmissions(id || "");
    const { publishSubGrant, isLoading: isPublishing } = usePublishSubGrant(id || "");

    // Debug logging for button visibility
    console.log("🔍 SUB-GRANT DEBUG INFO - BUTTON VISIBILITY:", {
        subGrantId: id,
        subGrantStatus,
        isLoading,
        hasData: !!data?.data,
        rawStatusFromAPI: data?.data?.status,
        showOpenButton: subGrantStatus === "ADVERTISED",
        showCloseButton: subGrantStatus === "SUBMISSION_OPEN",
        allStatuses: ["DRAFT", "ADVERTISED", "SUBMISSION_OPEN", "SUBMISSION_CLOSED", "AWARDED"]
    });

    // More prominent debug
    if (data?.data) {
        console.log("✅ SUB-GRANT DATA LOADED:", data.data);
        console.log("🎯 CURRENT STATUS:", subGrantStatus);
        console.log("🔘 SHOW BUTTONS?", {
            openSubmissions: subGrantStatus === "ADVERTISED",
            closeSubmissions: subGrantStatus === "SUBMISSION_OPEN"
        });
    } else {
        console.log("❌ NO SUB-GRANT DATA YET, isLoading:", isLoading);
    }

    // Workflow control handlers
    const handleOpenSubmissions = async () => {
        try {
            await openSubmissions();
            toast.success("Submissions opened successfully!");
            refetch(); // Refresh data to show updated status
        } catch (error: any) {
            toast.error(error?.message || "Failed to open submissions");
        }
    };

    const handleCloseSubmissions = async () => {
        try {
            await closeSubmissions();
            toast.success("Submissions closed successfully!");
            refetch(); // Refresh data to show updated status
        } catch (error: any) {
            toast.error(error?.message || "Failed to close submissions");
        }
    };

    const handlePublishSubGrant = async () => {
        try {
            await publishSubGrant();
            toast.success("Sub-Grant published successfully!");
            refetch(); // Refresh data to show updated status
        } catch (error: any) {
            toast.error(error?.message || "Failed to publish sub-grant");
        }
    };

    // Workflow progress indicator
    const getWorkflowStep = () => {
        switch (subGrantStatus) {
            case "DRAFT":
                return { step: 1, title: "Draft", description: "Sub-grant is being prepared" };
            case "ADVERTISED":
                return { step: 2, title: "Advertised", description: "Sub-grant has been published" };
            case "SUBMISSION_OPEN":
                return { step: 3, title: "Submissions Open", description: "Accepting applications" };
            case "SUBMISSION_CLOSED":
                return { step: 4, title: "Submissions Closed", description: "Ready for shortlisting and assessment" };
            case "AWARDED":
                return { step: 5, title: "Awarded", description: "Sub-grants have been awarded" };
            default:
                return { step: 0, title: "Unknown", description: "Status not recognized" };
        }
    };

    const currentStep = getWorkflowStep();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <section className="space-y-5">
            {/* Workflow Status Indicator */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-semibold text-blue-900">Workflow Status</h4>
                        <p className="text-blue-700">{currentStep.title} - {currentStep.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Admin Control Buttons */}
                        {subGrantStatus === "DRAFT" && (
                            <Button
                                onClick={handlePublishSubGrant}
                                disabled={isPublishing}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm"
                            >
                                {isPublishing ? "Publishing..." : "Publish Sub-Grant"}
                            </Button>
                        )}

                        {subGrantStatus === "ADVERTISED" && (
                            <Button
                                onClick={handleOpenSubmissions}
                                disabled={openingSubmissions}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm"
                            >
                                {openingSubmissions ? "Opening..." : "Open Submissions"}
                            </Button>
                        )}

                        {subGrantStatus === "SUBMISSION_OPEN" && (
                            <Button
                                onClick={handleCloseSubmissions}
                                disabled={closingSubmissions}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm"
                            >
                                {closingSubmissions ? "Closing..." : "Close Submissions"}
                            </Button>
                        )}

                        {/* Progress Indicator */}
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((step) => (
                                <div
                                    key={step}
                                    className={`w-3 h-3 rounded-full ${
                                        step <= currentStep.step
                                            ? 'bg-blue-600'
                                            : 'bg-gray-300'
                                    }`}
                                    title={`Step ${step}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

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

                        {subGrantStatus === "AWARDED" && (
                            <TabsTrigger value="awarded-partners">Awarded Partners</TabsTrigger>
                        )}
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

                    {subGrantStatus === "AWARDED" && (
                        <TabsContent value="awarded-partners">
                            <AwardedPartnersView subGrantId={id} />
                        </TabsContent>
                    )}
                </Tabs>
            )}
        </section>
    );
};

export default SubGrantDetails;
