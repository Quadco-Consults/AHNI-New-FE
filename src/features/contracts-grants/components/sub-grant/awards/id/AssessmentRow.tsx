"use client";

import { useGetAllAssessments } from "@/features/contracts-grants/controllers/preAwardAssessmentController";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { TableCell, TableRow } from "components/ui/table";
import { CheckCircle2, XCircle, FileText } from "lucide-react";
import Link from "next/link";

interface AssessmentRowProps {
    submission: any;
    index: number;
    assessmentType: "technical" | "financial";
}

export function AssessmentRow({ submission, index, assessmentType }: AssessmentRowProps) {
    // Fetch assessments for this specific submission
    const { data: assessmentsData, isLoading } = useGetAllAssessments({
        submission: submission.id,
        page: 1,
        size: 10,
        enabled: true,
    });

    // Find the relevant assessment
    const assessment = (assessmentsData?.data?.results || []).find((a: any) => {
        console.log(`Checking assessment ${a.id} for submission ${submission.id}:`, {
            status: a.status,
            firstCategory: a.assessment_submission?.forms?.[0]?.category_name,
            total_score: a.total_score,
            assessment_submission_exists: !!a.assessment_submission
        });

        if (a.status !== 'COMPLETED') {
            console.log(`Skipping assessment ${a.id} - status is ${a.status}, not COMPLETED`);
            return false;
        }

        const firstCategory = a.assessment_submission?.forms?.[0]?.category_name || '';

        if (assessmentType === "technical") {
            const match = firstCategory.includes('PROGRAMMING') || firstCategory.includes('MONITORING');
            console.log(`Technical match for ${a.id}:`, match, firstCategory);
            return match;
        } else {
            const match = firstCategory.includes('General Organization') || firstCategory.includes('Internal Audits');
            console.log(`Financial match for ${a.id}:`, match, firstCategory);
            return match;
        }
    });

    console.log(`Assessment found for ${assessmentType} type:`, assessment?.id, assessment?.total_score);

    const score = assessment?.total_score || 0;
    const hasAssessment = !!assessment;

    const getRiskLevel = (score: number) => {
        if (score <= 29) return { label: "Low Risk", color: "bg-green-100 text-green-700" };
        if (score <= 59) return { label: "Medium Risk", color: "bg-yellow-100 text-yellow-700" };
        if (score <= 89) return { label: "High Risk", color: "bg-orange-100 text-orange-700" };
        return { label: "Extremely High Risk", color: "bg-red-100 text-red-700" };
    };

    const riskLevel = getRiskLevel(score);

    if (isLoading) {
        return (
            <TableRow>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-semibold">{submission.organisation_name}</TableCell>
                <TableCell>{submission.organisation_type?.replace(/_/g, ' ') || "N/A"}</TableCell>
                <TableCell className="text-center">Loading...</TableCell>
                <TableCell className="text-center">-</TableCell>
                <TableCell className="text-center">-</TableCell>
                <TableCell className="text-right">-</TableCell>
            </TableRow>
        );
    }

    return (
        <TableRow>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell className="font-semibold">{submission.organisation_name}</TableCell>
            <TableCell>{submission.organisation_type?.replace(/_/g, ' ') || "N/A"}</TableCell>
            <TableCell className="text-center">
                {hasAssessment ? (
                    <Badge className="bg-green-100 text-green-700">
                        <CheckCircle2 size={14} className="mr-1" />
                        Completed
                    </Badge>
                ) : (
                    <Badge className="bg-gray-100 text-gray-600">
                        <XCircle size={14} className="mr-1" />
                        Pending
                    </Badge>
                )}
            </TableCell>
            <TableCell className="text-center font-bold">
                {hasAssessment ? score : "-"}
            </TableCell>
            <TableCell className="text-center">
                {hasAssessment ? (
                    <Badge className={riskLevel.color}>
                        {riskLevel.label}
                    </Badge>
                ) : (
                    "-"
                )}
            </TableCell>
            <TableCell className="text-right">
                {hasAssessment ? (
                    <Link
                        href={`/dashboard/c-and-g/sub-grant/awards/submission/${submission.id}/preaward-assessment?type=${assessmentType}`}
                    >
                        <Button variant="outline" size="sm">
                            <FileText size={14} className="mr-1" />
                            View
                        </Button>
                    </Link>
                ) : (
                    <Link
                        href={`/dashboard/c-and-g/sub-grant/awards/submission/${submission.id}/preaward-assessment?type=${assessmentType}`}
                    >
                        <Button
                            size="sm"
                            className={assessmentType === "technical" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}
                        >
                            Start Assessment
                        </Button>
                    </Link>
                )}
            </TableCell>
        </TableRow>
    );
}
