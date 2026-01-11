"use client";

import BackNavigation from "@/components/atoms/BackNavigation";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import { Button } from "@/components/ui/button";
import { CG_ROUTES } from "@/constants/RouterConstants";
import SubGrantAwardDetails from "./SubGrantAwardDetails";
import SubGrantSubmissionDetails from "./submission";
import ShortlistedSubmissionsList from "./shortlisted";
import AssessmentResults from "./assessment-results";
import SubGrantExpenditureHistory from "./_components/SubGrantExpenditureHistory";
import SubGrantObligationHistory from "./_components/SubGrantObligationHistory";
import SubGrantModificationHistory from "./_components/SubGrantModificationHistory";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetSingleSubGrant } from "@/features/contracts-grants/controllers/subGrantController";
import { useGetAwardsBySubGrant } from "@/features/contracts-grants/controllers/subGrantAwardController";
import { useOpenSubmissions, useCloseSubmissions } from "@/features/contracts-grants/controllers/subGrantWorkflowController";
import { skipToken } from "@reduxjs/toolkit/query";
import { LoadingSpinner } from "@/components/Loading";
import { useState } from "react";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dailogs";
import { useAppDispatch } from "@/hooks/useStore";
import { toast } from "sonner";

const SubGrantDetails = () => {
    const [tabValue, setTabValue] = useState("details");

    const params = useParams();
    const id = params?.id as string;
    const dispatch = useAppDispatch();

    const { data, isLoading, refetch } = useGetSingleSubGrant(id ?? skipToken);

    // Get current sub-grant status for workflow validation
    const subGrantStatus = data?.data?.status;

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

    // Workflow control hooks
    const { openSubmissions, isLoading: openingSubmissions } = useOpenSubmissions(id || "");
    const { closeSubmissions, isLoading: closingSubmissions } = useCloseSubmissions(id || "");

    // Define workflow guards based on status
    const canAccessSubmissions = subGrantStatus === "SUBMISSION_OPEN" || subGrantStatus === "SUBMISSION_CLOSED" || subGrantStatus === "AWARDED";
    const canAccessShortlisted = subGrantStatus === "SUBMISSION_CLOSED" || subGrantStatus === "AWARDED";
    const canAccessAssessmentResults = subGrantStatus === "SUBMISSION_CLOSED" || subGrantStatus === "AWARDED";
    const canAccessFinancialTabs = subGrantStatus === "AWARDED";

    // Get the award for this subgrant
    const { data: awardData } = useGetAwardsBySubGrant(id || "", !!id);
    const awardId = awardData?.data?.[0]?.id;

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

    if (isLoading) {
        return <LoadingSpinner />;
    }

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

                {(tabValue === "expenditure" ||
                    tabValue === "obligation" ||
                    tabValue === "modifications") &&
                    awardId && (
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
                                                ? DialogType.ADD_OBLIGATION_MODAL
                                                : DialogType.MODIFY_GRANT,
                                        dialogProps: {
                                            header:
                                                tabValue === "expenditure"
                                                    ? "Add Expenditure"
                                                    : tabValue === "obligation"
                                                    ? "Add Obligation"
                                                    : "Add Modification",
                                            width: "max-w-lg",
                                            awardId: awardId,
                                            data: { id: awardId, title: data?.data?.title },
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
                        <TabsTrigger value="details">
                            Details
                        </TabsTrigger>

                        <TabsTrigger
                            value="submissions"
                            disabled={!canAccessSubmissions}
                            className={!canAccessSubmissions ? "opacity-50 cursor-not-allowed" : ""}
                            title={!canAccessSubmissions ? `Cannot access submissions. Current status: ${subGrantStatus}. Please open submissions first.` : ""}
                        >
                            Submissions
                        </TabsTrigger>

                        <TabsTrigger
                            value="shortlisted"
                            disabled={!canAccessShortlisted}
                            className={!canAccessShortlisted ? "opacity-50 cursor-not-allowed" : ""}
                            title={!canAccessShortlisted ? `Cannot access shortlisted applicants. Current status: ${subGrantStatus}. Please close submissions first.` : ""}
                        >
                            Shortlisted Sub-Grantees
                        </TabsTrigger>

                        <TabsTrigger
                            value="assessment-results"
                            disabled={!canAccessAssessmentResults}
                            className={!canAccessAssessmentResults ? "opacity-50 cursor-not-allowed" : ""}
                            title={!canAccessAssessmentResults ? `Cannot access assessment results. Current status: ${subGrantStatus}. Please complete shortlisting first.` : ""}
                        >
                            Assessment Results
                        </TabsTrigger>

                        <TabsTrigger
                            value="expenditure"
                            disabled={!canAccessFinancialTabs}
                            className={!canAccessFinancialTabs ? "opacity-50 cursor-not-allowed" : ""}
                            title={!canAccessFinancialTabs ? `Cannot access expenditure history. Current status: ${subGrantStatus}. Please complete award process first.` : ""}
                        >
                            Expenditure History
                        </TabsTrigger>

                        <TabsTrigger
                            value="obligation"
                            disabled={!canAccessFinancialTabs}
                            className={!canAccessFinancialTabs ? "opacity-50 cursor-not-allowed" : ""}
                            title={!canAccessFinancialTabs ? `Cannot access obligations. Current status: ${subGrantStatus}. Please complete award process first.` : ""}
                        >
                            Obligations
                        </TabsTrigger>

                        <TabsTrigger
                            value="modifications"
                            disabled={!canAccessFinancialTabs}
                            className={!canAccessFinancialTabs ? "opacity-50 cursor-not-allowed" : ""}
                            title={!canAccessFinancialTabs ? `Cannot access modifications. Current status: ${subGrantStatus}. Please complete award process first.` : ""}
                        >
                            Modifications
                        </TabsTrigger>
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
