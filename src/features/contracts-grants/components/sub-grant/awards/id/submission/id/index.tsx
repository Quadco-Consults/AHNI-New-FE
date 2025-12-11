"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Button } from "components/ui/button";
import { CheckCircle, FileText, ArrowLeft, Award, FileCheck } from "lucide-react";
import { toast } from "sonner";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetSingleSubGrantManualSub } from "@/features/contracts-grants/controllers/submissionController";
import { useGetSingleSubGrant } from "@/features/contracts-grants/controllers/subGrantController";
import { useShortlistSubmissions } from "@/features/contracts-grants/controllers/subGrantWorkflowController";
import { useGetAllAssessments } from "@/features/contracts-grants/controllers/preAwardAssessmentController";
import OrganizationDetails from "./organization-details";
import SubGrantUploadDetail from "./uploads";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import { Loading } from "components/Loading";

export default function SubGrantSubmissionDetailWithTabs() {
    const [tabValue, setTabValue] = useState("organization");
    const [isShortlisted, setIsShortlisted] = useState(false);

    const params = useParams();
    const router = useRouter();
    const submissionId = params?.id as string;

    const { data: submissionData, isLoading: submissionLoading } = useGetSingleSubGrantManualSub(
        submissionId ?? skipToken
    );

    // Get sub-grant details
    const subGrantId = submissionData?.data?.sub_grant;
    const subGrantIdString = typeof subGrantId === 'string' ? subGrantId : (subGrantId as any)?.id || "";
    const { data: subGrantData } = useGetSingleSubGrant(
        subGrantIdString,
        !!subGrantId
    );

    const { shortlistSubmissions, isLoading: shortlistLoading } = useShortlistSubmissions(
        subGrantIdString
    );

    // Fetch assessments to check if this submission has been assessed
    const { data: assessmentsData } = useGetAllAssessments({
        submission: submissionId,
        page: 1,
        size: 10,
        enabled: !!submissionId,
    });

    // Check if submission has completed assessment
    const hasCompletedAssessment = assessmentsData?.data?.results?.some(
        (assessment: any) => assessment.status === "COMPLETED"
    );

    const handleShortlist = async () => {
        try {
            // Check sub-grant status before attempting to shortlist
            console.log("Sub-grant data:", subGrant);
            console.log("Sub-grant status:", subGrant?.status);

            // Enhanced workflow checking with testing bypass option
            if (subGrant?.status !== "SUBMISSION_CLOSED") {
                // Show detailed error with option to proceed for testing
                const proceedAnyway = window.confirm(
                    `⚠️ WARNING: Sub-grant status is "${subGrant?.status}" but normally requires "SUBMISSION_CLOSED".\n\n` +
                    `This may cause workflow issues and is not recommended for production use.\n\n` +
                    `Do you want to proceed anyway for testing purposes?`
                );

                if (!proceedAnyway) {
                    toast.error(`Cannot shortlist submissions. Sub-grant status is "${subGrant?.status}". Please close submissions first.`);
                    return;
                }

                // If user chose to proceed, show warning toast
                console.warn(`⚠️ WARNING: Shortlisting while status is "${subGrant?.status}". Normally requires "SUBMISSION_CLOSED".`);
                toast.warning(`Proceeding with shortlist despite status being "${subGrant?.status}". This may cause issues.`);
            }

            await shortlistSubmissions({ submission_ids: [submissionId] });
            setIsShortlisted(true);
            toast.success("Submission successfully shortlisted!");
        } catch (error: any) {
            console.error("Shortlist error:", error);
            const errorMessage = error?.data?.message ?? error?.message ?? "Failed to shortlist submission";
            toast.error(`Failed to shortlist submission: ${errorMessage}`);
        }
    };

    if (submissionLoading) {
        return <Loading />;
    }

    const submission = submissionData?.data;
    const subGrant = subGrantData?.data;

    return (
        <div className="w-full flex flex-col gap-y-6 p-6">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/c-and-g/sub-grant/awards/submission">
                    <Button
                        variant="ghost"
                        size="icon"
                    >
                        <ArrowLeft size={20} />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-800">Sub-Grant Application Review</h1>
                    <p className="text-gray-600 mt-1">
                        Review applicant details and manage submission
                    </p>
                </div>
            </div>

            {/* Sub-Grant Context */}
            {subGrant && (
                <Card className="bg-blue-50 border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-600">Sub-Grant Opportunity</h3>
                            <p className="text-lg font-semibold text-gray-800 mt-1">
                                {subGrant.title}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <span>Award Type: <span className="font-medium">{subGrant.award_type}</span></span>
                                <span>•</span>
                                <span>Amount: <span className="font-medium">${subGrant.amount_usd} USD</span></span>
                                <span>•</span>
                                <span>Status: <span className="font-medium">{subGrant.status}</span></span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Badge className={`${
                                subGrant.status === "SUBMISSION_CLOSED" ? "bg-green-600" :
                                subGrant.status === "SUBMISSION_OPEN" ? "bg-yellow-600" :
                                subGrant.status === "ADVERTISED" ? "bg-blue-600" :
                                "bg-gray-600"
                            } text-white`}>
                                {subGrant.status}
                            </Badge>
                            {subGrant.status !== "SUBMISSION_CLOSED" && (
                                <p className="text-xs text-red-600 text-right">
                                    Shortlisting requires submissions to be closed
                                </p>
                            )}
                        </div>
                    </div>
                </Card>
            )}

            {/* Submission Status & Actions */}
            <Card>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            {submission?.organisation_name}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                            <Badge
                                className={
                                    hasCompletedAssessment
                                        ? "bg-blue-100 text-blue-700"
                                        : isShortlisted
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-gray-100 text-gray-700"
                                }
                            >
                                {hasCompletedAssessment
                                    ? "Assessed"
                                    : isShortlisted
                                    ? "Shortlisted"
                                    : "Pending Review"}
                            </Badge>
                            {submission?.created_datetime && (
                                <span className="text-sm text-gray-600">
                                    Submitted: {new Date(submission.created_datetime).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href={`/dashboard/c-and-g/sub-grant/awards/submission/${submissionId}/preaward-assessment`}>
                            <Button variant="outline" className="flex items-center gap-2">
                                <FileCheck size={16} />
                                Pre-Award Assessment
                            </Button>
                        </Link>

                        <Link href={`/dashboard/c-and-g/sub-grant/awards/submission/${submissionId}/assessment`}>
                            <Button variant="outline" className="flex items-center gap-2">
                                <FileText size={16} />
                                View Assessment
                            </Button>
                        </Link>

                        <Button
                            onClick={handleShortlist}
                            disabled={
                                isShortlisted ||
                                shortlistLoading
                                // Removed status check to allow testing bypass
                            }
                            className={`flex items-center gap-2 ${
                                isShortlisted
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : subGrant?.status !== "SUBMISSION_CLOSED"
                                    ? 'bg-yellow-600 hover:bg-yellow-700 border-2 border-yellow-400'  // Enhanced: Yellow with border for caution
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                            title={
                                isShortlisted
                                    ? "This submission has already been shortlisted"
                                    : subGrant?.status !== "SUBMISSION_CLOSED"
                                    ? `⚠️ Warning: Sub-grant status is "${subGrant?.status}", normally requires "SUBMISSION_CLOSED". Click to proceed with confirmation for testing.`
                                    : "Shortlist this submission"
                            }
                        >
                            {shortlistLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <CheckCircle size={16} />
                            )}
                            {shortlistLoading ? 'Processing...' : isShortlisted ? 'Shortlisted' : 'Shortlist'}
                        </Button>

                        {isShortlisted && (
                            <Link href={`/dashboard/c-and-g/sub-grant/awards/${subGrantIdString}/award-selection/${submissionId}`}>
                                <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                                    <Award size={16} />
                                    Award Sub-Grant
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </Card>

            {/* Tabs for Details */}
            <Tabs
                value={tabValue}
                onValueChange={setTabValue}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="organization">
                        Organization Details
                    </TabsTrigger>
                    <TabsTrigger value="uploads">
                        Supporting Documents
                    </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="organization">
                        <OrganizationDetails />
                    </TabsContent>

                    <TabsContent value="uploads">
                        <SubGrantUploadDetail />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}