"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Card from "components/Card";
import BackNavigation from "components/atoms/BackNavigation";
import { Button } from "components/ui/button";
import { useGetSingleContractRequest } from "@/features/contracts-grants/controllers/contractController";
import { useGetAllConsultancyApplicants } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { Eye, CheckCircle, Clock, User, Mail, Phone, FileText, Calendar, Briefcase } from "lucide-react";

export default function ContractRequestDetails() {
    const params = useParams();
    const router = useRouter();
    const pathname = usePathname();
    const contractRequestId = params?.id as string;

    // Determine type based on pathname
    const applicantType = pathname?.includes("adhoc") ? "ADHOC" : "CONSULTANT";
    const staffLabel = applicantType === "ADHOC" ? "Adhoc Staff" : "Consultant";

    // Fetch contract request details
    const { data: contractRequestData, isLoading: isLoadingRequest } = useGetSingleContractRequest(
        contractRequestId || ""
    );

    // Fetch all applicants with CONTRACT_ISSUED or APPROVED status
    const { data: applicantsData, isLoading: isLoadingApplicants } = useGetAllConsultancyApplicants({
        page: 1,
        size: 1000,
    });

    const contractRequest = contractRequestData?.data;
    const allApplicantsRaw = applicantsData?.data?.results || [];

    console.log("📊 Contract Request Details - All Applicants:", allApplicantsRaw);
    console.log("📊 Contract Request ID:", contractRequestId);
    console.log("📊 Applicant Type:", applicantType);

    // Filter applicants for this contract request and type
    const applicants = useMemo(() => {
        return allApplicantsRaw.filter(applicant => {
            // Must have CONTRACT_ISSUED or APPROVED status
            if (!['CONTRACT_ISSUED', 'APPROVED'].includes(applicant.status)) {
                return false;
            }

            // Must match this contract request
            const contractReqId = typeof applicant.contract_request === 'object' && applicant.contract_request !== null
                ? applicant.contract_request.id
                : applicant.contract_request;

            if (contractReqId !== contractRequestId) {
                return false;
            }

            // Type matching logic - use type field as primary source of truth
            if (applicantType === "ADHOC") {
                return applicant.type === "ADHOC";
            }

            // For consultant route - match CONSULTANT type or no type
            return !applicant.type || applicant.type === "CONSULTANT";
        });
    }, [allApplicantsRaw, contractRequestId, applicantType]);

    console.log("🔍 Filtered Applicants for Contract Request:", applicants);

    const acceptedCount = applicants.filter(a => a.offer_accepted).length;
    const pendingCount = applicants.length - acceptedCount;

    const isLoading = isLoadingRequest || isLoadingApplicants;

    if (isLoading) {
        return (
            <div className="p-6">
                <BackNavigation />
                <Card className="mt-5 p-6">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#DEA004] mx-auto mb-4"></div>
                        <p>Loading contract details...</p>
                    </div>
                </Card>
            </div>
        );
    }

    if (!contractRequest) {
        return (
            <div className="p-6">
                <BackNavigation />
                <Card className="mt-5 p-6">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold mb-2 text-red-600">Contract Request Not Found</h2>
                        <p className="text-gray-600 mb-4">
                            Unable to find the contract request with ID: {contractRequestId}
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <section className="space-y-6">
            <BackNavigation />

            {/* Header Card */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
                <div className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-blue-500 text-white p-3 rounded-lg">
                                    <Briefcase className="h-6 w-6" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {contractRequest.title}
                                    </h1>
                                    <p className="text-sm text-gray-600">
                                        Ref: {contractRequest.id?.slice(0, 8)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-semibold">
                            {staffLabel.toUpperCase()}
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-blue-200">
                        <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                            <p className="text-2xl font-bold text-blue-600">{applicants.length}</p>
                            <p className="text-sm text-gray-600">Contracts Issued</p>
                        </div>
                        <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                            <p className="text-2xl font-bold text-green-600">{acceptedCount}</p>
                            <p className="text-sm text-gray-600">Accepted</p>
                        </div>
                        <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                            <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
                            <p className="text-sm text-gray-600">Pending</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-4 border-t border-blue-200">
                        <div className="flex justify-between text-sm text-gray-700 mb-2">
                            <span className="font-medium">Acceptance Progress</span>
                            <span className="font-bold">
                                {applicants.length > 0 ? Math.round((acceptedCount / applicants.length) * 100) : 0}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                                style={{
                                    width: `${applicants.length > 0 ? (acceptedCount / applicants.length) * 100 : 0}%`
                                }}
                            />
                        </div>
                    </div>

                    {/* Additional Info */}
                    {(contractRequest.department || contractRequest.created_datetime) && (
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-200">
                            {contractRequest.department && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Briefcase className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-700">
                                        {typeof contractRequest.department === 'object' ? contractRequest.department.name : contractRequest.department}
                                    </span>
                                </div>
                            )}
                            {contractRequest.created_datetime && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-700">
                                        Posted: {new Date(contractRequest.created_datetime).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Card>

            {/* Applicants List */}
            <Card>
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Contract Recipients ({applicants.length})
                    </h2>

                    {applicants.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FileText className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Contracts Issued Yet</h3>
                            <p className="text-gray-600">
                                Contracts have not been issued for this job advert yet.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {applicants.map((applicant, index) => (
                                <div
                                    key={applicant.id}
                                    className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${
                                        applicant.offer_accepted
                                            ? 'bg-green-50 border-green-200'
                                            : 'bg-white border-gray-200 hover:border-[#DEA004]'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="bg-gray-100 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                                                {index + 1}
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                                    {applicant.name}
                                                </h3>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4 text-gray-400" />
                                                        <span>{applicant.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4 text-gray-400" />
                                                        <span>{applicant.phone_number}</span>
                                                    </div>
                                                    {applicant.position_under_contract && (
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-4 w-4 text-gray-400" />
                                                            <span>{applicant.position_under_contract}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {applicant.offer_accepted ? (
                                                <div className="flex flex-col items-center">
                                                    <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-medium">
                                                        <CheckCircle className="h-4 w-4" />
                                                        <span>Accepted</span>
                                                    </div>
                                                    {applicant.offer_acceptance_date && (
                                                        <span className="text-xs text-green-600 mt-1">
                                                            {new Date(applicant.offer_acceptance_date).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg font-medium">
                                                    <Clock className="h-4 w-4" />
                                                    <span>Pending</span>
                                                </div>
                                            )}

                                            <Button
                                                size="sm"
                                                className={`flex items-center gap-2 ${
                                                    applicant.offer_accepted
                                                        ? 'bg-green-600 hover:bg-green-700'
                                                        : 'bg-[#DEA004] hover:bg-[#c48f04]'
                                                }`}
                                                onClick={() => {
                                                    const basePath = pathname?.includes("adhoc")
                                                        ? "/dashboard/programs/adhoc/adhoc-acceptance"
                                                        : "/dashboard/c-and-g/consultant/consultance-acceptance";
                                                    router.push(`${basePath}/applicant/${applicant.id}`);
                                                }}
                                            >
                                                <Eye className="h-4 w-4" />
                                                {applicant.offer_accepted ? 'View' : 'Review & Accept'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </section>
    );
}
