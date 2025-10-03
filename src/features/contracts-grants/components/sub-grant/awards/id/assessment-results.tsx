"use client";

import Card from "components/Card";
import { Badge } from "components/ui/badge";
import { Award, FileText, TrendingUp } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetAssessedSubmissions } from "@/features/contracts-grants/controllers/preAwardAssessmentController";
import Link from "next/link";
import { Button } from "components/ui/button";
import { Loading } from "components/Loading";

export default function AssessmentResults() {
    const params = useParams();
    const subGrantId = params?.id as string;

    const { data, isFetching } = useGetAssessedSubmissions(subGrantId);

    if (isFetching) {
        return <Loading />;
    }

    // Get assessed submissions from the dedicated endpoint (already ranked by backend)
    const assessedSubmissions = data?.data || [];

    const getRiskLevel = (riskLevel: string) => {
        switch(riskLevel) {
            case "LOW":
                return { label: "Low Risk", color: "bg-green-100 text-green-700" };
            case "MEDIUM":
                return { label: "Medium Risk", color: "bg-yellow-100 text-yellow-700" };
            case "HIGH":
                return { label: "High Risk", color: "bg-orange-100 text-orange-700" };
            case "EXTREMELY_HIGH":
                return { label: "Extremely High Risk", color: "bg-red-100 text-red-700" };
            default:
                return { label: "Unknown", color: "bg-gray-100 text-gray-700" };
        }
    };

    if (assessedSubmissions.length === 0) {
        return (
            <Card>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText size={48} className="text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        No Assessment Results Yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Complete pre-award assessments for shortlisted applicants to see results here.
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Assessment Results */}
            <Card>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Assessment Results & Rankings</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {assessedSubmissions.length} applicant(s) assessed and ranked
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="text-green-600" size={20} />
                        <span className="text-sm font-medium text-gray-600">
                            Sorted by Score (Lower is Better)
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    {assessedSubmissions.map((item: any) => {
                        const riskLevel = getRiskLevel(item.risk_level);
                        const isTopRanked = item.rank === 1;

                        return (
                            <Card
                                key={item.submission.id}
                                className={`p-6 ${
                                    isTopRanked
                                        ? "border-2 border-green-500 bg-green-50"
                                        : "border border-gray-200"
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Badge
                                                variant="default"
                                                className={`px-3 py-1 ${
                                                    isTopRanked
                                                        ? "bg-green-600 text-white"
                                                        : "bg-gray-600 text-white"
                                                }`}
                                            >
                                                Rank #{item.rank}
                                            </Badge>
                                            {isTopRanked && (
                                                <Badge className="bg-yellow-500 text-white px-3 py-1">
                                                    <Award size={14} className="mr-1" />
                                                    Top Ranked
                                                </Badge>
                                            )}
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                                            {item.submission.organisation_name}
                                        </h3>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-600">Email:</span>
                                                <span className="ml-2 font-medium">{item.submission.email}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Phone:</span>
                                                <span className="ml-2 font-medium">{item.submission.phone_number}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Address:</span>
                                                <span className="ml-2 font-medium">{item.submission.address}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Organization Type:</span>
                                                <span className="ml-2 font-medium">
                                                    {item.submission.organisation_type || "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-3 ml-6">
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-gray-800">
                                                {item.score || 0}
                                            </div>
                                            <div className="text-sm text-gray-600">Risk Score</div>
                                        </div>

                                        <Badge variant="default" className={riskLevel.color}>
                                            {riskLevel.label}
                                        </Badge>

                                        <div className="flex gap-2 mt-2">
                                            <Link
                                                href={`/dashboard/c-and-g/sub-grant/awards/submission/${item.submission.id}/assessment/${item.assessment.id}`}
                                            >
                                                <Button variant="outline" size="sm">
                                                    <FileText size={14} className="mr-1" />
                                                    View Assessment
                                                </Button>
                                            </Link>

                                            <Link
                                                href={`/dashboard/c-and-g/sub-grant/awards/${subGrantId}/award-selection/${item.submission.id}`}
                                            >
                                                <Button
                                                    size="sm"
                                                    className={`${
                                                        isTopRanked
                                                            ? "bg-green-600 hover:bg-green-700"
                                                            : "bg-blue-600 hover:bg-blue-700"
                                                    }`}
                                                >
                                                    <Award size={14} className="mr-1" />
                                                    Award
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <TrendingUp className="text-blue-600" size={24} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">Risk Rating Scale</h4>
                        <div className="grid grid-cols-4 gap-4 text-sm mt-3">
                            <div>
                                <Badge className="bg-green-100 text-green-700 mb-1">Low Risk</Badge>
                                <p className="text-gray-600">0-29 points</p>
                            </div>
                            <div>
                                <Badge className="bg-yellow-100 text-yellow-700 mb-1">Medium Risk</Badge>
                                <p className="text-gray-600">30-59 points</p>
                            </div>
                            <div>
                                <Badge className="bg-orange-100 text-orange-700 mb-1">High Risk</Badge>
                                <p className="text-gray-600">60-89 points</p>
                            </div>
                            <div>
                                <Badge className="bg-red-100 text-red-700 mb-1">Extremely High</Badge>
                                <p className="text-gray-600">90-100 points</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
