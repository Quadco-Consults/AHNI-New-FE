"use client";

import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { formatCurrency } from "lib/utils";
import { formatDate } from "utils/date";

interface AwardDetailsTabProps {
    subGrantId: string;
    subgrant: any;
}

/**
 * Award Details Tab Component
 *
 * Displays the award decision details for an awarded subgrant.
 * The award_decision is a OneToOne relationship from SubGrant.
 */
const AwardDetailsTab = ({ subGrantId, subgrant }: AwardDetailsTabProps) => {
    const awardDecision = subgrant?.award_decision;

    if (!awardDecision) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-gray-500">
                        No award decision details available for this subgrant.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Award Summary Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Award Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">SubGrant Title</p>
                            <p className="font-semibold">{subgrant?.title}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <Badge>{subgrant?.status}</Badge>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Award Date</p>
                            <p className="font-semibold">
                                {awardDecision?.award_date
                                    ? formatDate(awardDecision.award_date)
                                    : "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Award Type</p>
                            <p className="font-semibold">{subgrant?.award_type || "N/A"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Award Amounts Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Award Amounts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Amount (USD)</p>
                            <p className="text-2xl font-bold text-green-600">
                                {formatCurrency(awardDecision?.award_amount_usd || 0, "USD")}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Amount (NGN)</p>
                            <p className="text-2xl font-bold text-green-600">
                                {formatCurrency(awardDecision?.award_amount_ngn || 0, "NGN")}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Awarded Submission Card */}
            {awardDecision?.awarded_submission && (
                <Card>
                    <CardHeader>
                        <CardTitle>Awarded Organization</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Organization Name</p>
                                <p className="font-semibold">
                                    {awardDecision.awarded_submission.organisation_name || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Organization Type</p>
                                <p className="font-semibold">
                                    {awardDecision.awarded_submission.organisation_type || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-semibold">
                                    {awardDecision.awarded_submission.email || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-semibold">
                                    {awardDecision.awarded_submission.phone_number || "N/A"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Award Justification Card */}
            {awardDecision?.award_justification && (
                <Card>
                    <CardHeader>
                        <CardTitle>Award Justification</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 whitespace-pre-wrap">
                            {awardDecision.award_justification}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Special Conditions Card */}
            {awardDecision?.special_conditions && (
                <Card>
                    <CardHeader>
                        <CardTitle>Special Conditions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 whitespace-pre-wrap">
                            {awardDecision.special_conditions}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Period Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Award Period</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Start Date</p>
                            <p className="font-semibold">
                                {subgrant?.start_date ? formatDate(subgrant.start_date) : "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">End Date</p>
                            <p className="font-semibold">
                                {subgrant?.end_date ? formatDate(subgrant.end_date) : "N/A"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AwardDetailsTab;
