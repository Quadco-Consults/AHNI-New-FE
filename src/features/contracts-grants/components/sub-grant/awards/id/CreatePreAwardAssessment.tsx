"use client";

import BackNavigation from "@/components/BackNavigation";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams, useRouter } from "next/navigation";
import { useGetSingleSubGrant } from "@/features/contracts-grants/controllers/subGrantController";
import { useGetAllSubGrantManualSub } from "@/features/contracts-grants/controllers/submissionController";
import { Loading } from "@/components/Loading";
import { FileCheck, Award, User } from "lucide-react";
import Link from "next/link";

export default function CreatePreAwardAssessment() {
    const { id } = useParams();
    const router = useRouter();

    const { data: subGrantData, isLoading: subGrantLoading } = useGetSingleSubGrant(id as string);
    const { data: submissionsData, isLoading: submissionsLoading } = useGetAllSubGrantManualSub({
        sub_grant: id as string,
        page: 1,
        size: 100,
    });

    // Filter for shortlisted submissions
    const shortlistedSubmissions = (submissionsData?.data?.results || []).filter(
        (submission: any) => submission.status === "SHORTLISTED" || submission.is_shortlisted
    );

    if (subGrantLoading || submissionsLoading) {
        return <Loading />;
    }

    return (
        <section className="space-y-6">
            <BackNavigation />

            <div className="flex items-center gap-3">
                <FileCheck className="text-blue-600" size={32} />
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Create Pre-Award Assessment</h1>
                    <p className="text-gray-600">
                        Select a shortlisted submission to conduct pre-award assessment
                    </p>
                </div>
            </div>

            {/* Sub-Grant Info */}
            <Card className="bg-blue-50 border-blue-200">
                <div>
                    <label className="text-sm font-medium text-blue-800">Sub-Grant Title</label>
                    <p className="text-lg font-semibold text-gray-800 mt-1">
                        {subGrantData?.data?.title}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>Award Type: <span className="font-medium">{subGrantData?.data?.award_type}</span></span>
                        <span>Amount: <span className="font-medium">${subGrantData?.data?.amount_usd} USD</span></span>
                    </div>
                </div>
            </Card>

            {/* Assessment Type Info */}
            <div className="grid grid-cols-2 gap-6">
                <Card className="p-6 border-2 border-blue-200">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded">
                            <FileCheck className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">Technical Capacity Assessment</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Evaluates programming capacity, M&E capabilities, and data management
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-2 border-green-200">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded">
                            <Award className="text-green-600" size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">Financial Pre-Award (PAT)</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                For subawards {'>'} $150,000. Evaluates financial management and compliance
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Shortlisted Submissions */}
            <Card>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Shortlisted Submissions ({shortlistedSubmissions.length})
                </h2>

                {shortlistedSubmissions.length === 0 ? (
                    <div className="text-center py-12">
                        <Award className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-600">No shortlisted submissions found</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Please shortlist submissions from the Submissions tab first
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {shortlistedSubmissions.map((submission: any) => {
                            const subawardAmount = parseFloat(subGrantData?.data?.amount_usd || "0");
                            const requiresPAT = subawardAmount > 150000;

                            return (
                                <Card
                                    key={submission.id}
                                    className="p-4 border border-gray-200 hover:border-blue-400 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-100 rounded-lg">
                                                <User className="text-blue-600" size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {submission.organisation_name}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {submission.organisation_type?.replace(/_/g, ' ') || 'N/A'}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge className="bg-green-100 text-green-700">
                                                        SHORTLISTED
                                                    </Badge>
                                                    {submission.has_assessment && (
                                                        <Badge className="bg-blue-100 text-blue-700">
                                                            Already Assessed
                                                        </Badge>
                                                    )}
                                                    {requiresPAT && (
                                                        <Badge className="bg-yellow-100 text-yellow-700">
                                                            PAT Required
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Link
                                                href={`/dashboard/c-and-g/sub-grant/awards/submission/${submission.id}/preaward-assessment?type=technical`}
                                            >
                                                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                                                    <FileCheck size={16} className="mr-2" />
                                                    Technical Assessment
                                                </Button>
                                            </Link>

                                            {requiresPAT && (
                                                <Link
                                                    href={`/dashboard/c-and-g/sub-grant/awards/submission/${submission.id}/preaward-assessment?type=financial`}
                                                >
                                                    <Button className="bg-green-600 hover:bg-green-700">
                                                        <Award size={16} className="mr-2" />
                                                        Financial (PAT)
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </Card>

            <div className="flex justify-between">
                <Button variant="outline" size="lg" onClick={() => router.back()}>
                    Cancel
                </Button>
            </div>
        </section>
    );
}
