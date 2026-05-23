"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import Card from "@/components/Card";
import { LoadingSpinner } from "@/components/Loading";
import { useParams } from "next/navigation";
import { useGetSingleSubGrantManualSub } from "@/features/contracts-grants/controllers/submissionController";
import { Badge } from "@/components/ui/badge";
import {
    Building2,
    User,
    MapPin,
    Phone,
    Mail,
    Globe,
    FileText,
    AlertCircle,
    Briefcase
} from "lucide-react";

export default function PartnerSubmissionDetails() {
    const params = useParams();
    const submissionId = params?.id as string;

    const { data, isLoading } = useGetSingleSubGrantManualSub(
        submissionId ?? skipToken
    );

    if (isLoading) {
        return <LoadingSpinner />;
    }

    const submission = data?.data;

    const getOrganizationType = (type: string) => {
        const types: Record<string, { label: string; color: string }> = {
            FOR_PROFIT: { label: "For-Profit", color: "bg-blue-100 text-blue-700" },
            NON_PROFIT: { label: "Non-Profit", color: "bg-green-100 text-green-700" },
            GOVERNMENT: { label: "Government", color: "bg-purple-100 text-purple-700" },
            UNIVERSITY: { label: "University", color: "bg-orange-100 text-orange-700" },
            OTHER: { label: "Other", color: "bg-gray-100 text-gray-700" },
        };
        return types[type] || types.OTHER;
    };

    const orgType = getOrganizationType(submission?.organisation_type || "");

    return (
        <div className="space-y-6">
            {/* Organization Header */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-600 rounded-lg">
                            <Building2 className="text-white" size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {submission?.organisation_name}
                            </h2>
                            <div className="flex items-center gap-3">
                                <Badge className={orgType.color}>
                                    {orgType.label}
                                </Badge>
                                {submission?.created_datetime && (
                                    <span className="text-sm text-gray-600">
                                        Submitted: {new Date(submission.created_datetime).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Contact Information */}
            <Card>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Phone size={20} className="text-blue-600" />
                    Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                        <MapPin size={20} className="text-gray-400 mt-1" />
                        <div>
                            <label className="text-sm font-medium text-gray-600">Address</label>
                            <p className="text-base text-gray-800 mt-1">{submission?.address || "N/A"}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Phone size={20} className="text-gray-400 mt-1" />
                        <div>
                            <label className="text-sm font-medium text-gray-600">Telephone</label>
                            <p className="text-base text-gray-800 mt-1">{submission?.phone_number || "N/A"}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Mail size={20} className="text-gray-400 mt-1" />
                        <div>
                            <label className="text-sm font-medium text-gray-600">Email</label>
                            <p className="text-base text-gray-800 mt-1">{submission?.email || "N/A"}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Phone size={20} className="text-gray-400 mt-1" />
                        <div>
                            <label className="text-sm font-medium text-gray-600">Fax</label>
                            <p className="text-base text-gray-800 mt-1">{submission?.fax || "N/A"}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 col-span-2">
                        <Globe size={20} className="text-gray-400 mt-1" />
                        <div>
                            <label className="text-sm font-medium text-gray-600">Website</label>
                            <a
                                href={submission?.web_address}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-base text-blue-600 hover:text-blue-800 mt-1 block"
                            >
                                {submission?.web_address || "N/A"}
                            </a>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Principal Officers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <User size={20} className="text-blue-600" />
                        MD/CEO
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Name</label>
                            <p className="text-base font-semibold text-gray-800 mt-1">
                                {submission?.principal_one_name || "N/A"}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Designation</label>
                            <p className="text-base text-gray-800 mt-1">
                                {submission?.principal_one_designaation || "N/A"}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <User size={20} className="text-blue-600" />
                        Director
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Name</label>
                            <p className="text-base font-semibold text-gray-800 mt-1">
                                {submission?.principal_two_name || "N/A"}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Designation</label>
                            <p className="text-base text-gray-800 mt-1">
                                {submission?.principal_two_designation || "N/A"}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Additional Information */}
            <Card>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-blue-600" />
                    Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                        <Briefcase size={20} className="text-gray-400 mt-1" />
                        <div>
                            <label className="text-sm font-medium text-gray-600">
                                DUNS Number (for USG awards only)
                            </label>
                            <p className="text-base text-gray-800 mt-1 font-mono">
                                {submission?.duns_number || "N/A"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <AlertCircle size={20} className="text-gray-400 mt-1" />
                        <div>
                            <label className="text-sm font-medium text-gray-600">
                                Financial Conflict of Interest Policy
                            </label>
                            <div className="mt-1">
                                <Badge
                                    className={
                                        submission?.has_conflict_of_interest
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }
                                >
                                    {submission?.has_conflict_of_interest ? "Yes" : "No"}
                                </Badge>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                As applicable to U.S. PHS agencies' funding
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Partner Information (if available) */}
            {submission?.partner && (
                <Card className="bg-blue-50 border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Building2 size={20} className="text-blue-600" />
                        Partner Organization
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Partner Name</label>
                            <p className="text-base text-gray-800 mt-1">
                                {typeof submission.partner === 'object'
                                    ? (submission.partner as any)?.name
                                    : submission.partner}
                            </p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
