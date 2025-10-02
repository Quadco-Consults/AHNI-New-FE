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
    const { data: subGrantData } = useGetSingleSubGrant(
        typeof subGrantId === 'string' ? subGrantId : (subGrantId as any)?.id || "",
        !!subGrantId
    );

    const { shortlistSubmissions, isLoading: shortlistLoading } = useShortlistSubmissions(
        typeof subGrantId === 'string' ? subGrantId : (subGrantId as any)?.id || ""
    );

    const handleShortlist = async () => {
        try {
            // Check sub-grant status before attempting to shortlist
            console.log("Sub-grant data:", subGrant);
            console.log("Sub-grant status:", subGrant?.status);

            if (subGrant?.status !== "SUBMISSION_CLOSED") {
                toast.error(`Cannot shortlist submissions. Sub-grant status is "${subGrant?.status}" but must be "SUBMISSION_CLOSED". Please close submissions first.`);
                return;
            }

            await shortlistSubmissions({ submission_ids: [submissionId] });
            setIsShortlisted(true);
            toast.success("Submission successfully shortlisted!");
        } catch (error: any) {
            console.error("Shortlist error:", error);
            toast.error(error?.data?.message ?? error?.message ?? "Failed to shortlist submission");
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
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                >
                    <ArrowLeft size={20} />
                </Button>
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
                                    isShortlisted
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                }
                            >
                                {isShortlisted
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
                                shortlistLoading ||
                                subGrant?.status !== "SUBMISSION_CLOSED"
                            }
                            className={`flex items-center gap-2 ${
                                isShortlisted
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : subGrant?.status !== "SUBMISSION_CLOSED"
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                            title={
                                subGrant?.status !== "SUBMISSION_CLOSED"
                                    ? `Cannot shortlist: Sub-grant status is "${subGrant?.status}", but must be "SUBMISSION_CLOSED"`
                                    : undefined
                            }
                        >
                            <CheckCircle size={16} />
                            {isShortlisted ? 'Shortlisted' : 'Shortlist'}
                        </Button>

                        {isShortlisted && (
                            <Link href={`/dashboard/c-and-g/sub-grant/awards/${subGrantId}/award-selection/${submissionId}`}>
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