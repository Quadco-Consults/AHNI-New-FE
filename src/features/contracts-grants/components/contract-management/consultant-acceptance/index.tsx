"use client";

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { useGetAllConsultantManagements } from "@/features/contracts-grants/controllers/consultantManagementController";
import { useGetAllConsultancyApplicants } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { useGetAllAdhocApplicants } from "@/features/programs/controllers/adhocApplicantController";
import { useGetAllAdhocAdvertisements } from "@/features/programs/controllers/adhocAdvertisementController";
import { useRouter } from "next/navigation";
import { FileText, Users, Calendar, Briefcase, Eye, CheckCircle, Clock } from "lucide-react";

export default function ConsultantContractDashboard() {
    const [page, setPage] = useState(1);
    const router = useRouter();
    const pathname = usePathname();


    // Determine type based on pathname
    const applicantType = pathname?.includes("adhoc") ? "ADHOC" : "CONSULTANT";

    // Fetch all consultant advertisements/adhoc advertisements based on type
    const { data: consultantsData, isFetching: isLoadingConsultants } = useGetAllConsultantManagements({
        page,
        size: 100,
        enabled: applicantType === "CONSULTANT",
    });

    const { data: adhocAdvertisementsData, isFetching: isLoadingAdhocAdvertisements } = useGetAllAdhocAdvertisements({
        page,
        size: 100,
        enabled: applicantType === "ADHOC",
    });

    const isLoadingRequests = applicantType === "ADHOC" ? isLoadingAdhocAdvertisements : isLoadingConsultants;

    // Fetch applicants based on type - use different endpoints for AdHoc vs Consultancy
    const { data: consultancyApplicantsData, isFetching: isLoadingConsultancyApplicants } = useGetAllConsultancyApplicants({
        page: 1,
        size: 1000,
        enabled: applicantType === "CONSULTANT",
    });

    const { data: adhocApplicantsData, isFetching: isLoadingAdhocApplicants } = useGetAllAdhocApplicants({
        page: 1,
        size: 1000,
        enabled: applicantType === "ADHOC",
    });

    // Use correct data source based on applicant type
    const applicantsData = applicantType === "ADHOC" ? adhocApplicantsData : consultancyApplicantsData;
    const isLoadingApplicants = applicantType === "ADHOC" ? isLoadingAdhocApplicants : isLoadingConsultancyApplicants;

    // Use correct data source for advertisements
    const rawAdvertisements = applicantType === "ADHOC"
        ? adhocAdvertisementsData?.data?.results || []
        : consultantsData?.data?.results || [];

    const consultantAdvertisements = rawAdvertisements;
    const allApplicantsRaw = applicantsData?.data?.results || [];

    console.log("📊 All Applicants Raw Data:", allApplicantsRaw);
    console.log("📊 Total Applicants Fetched:", allApplicantsRaw.length);
    console.log("📊 Applicants with CONTRACT_ISSUED:", allApplicantsRaw.filter(a => a.status === 'CONTRACT_ISSUED').length);
    console.log("📊 Applicants with APPROVED:", allApplicantsRaw.filter(a => a.status === 'APPROVED').length);

    // Log first applicant structure to understand the data
    if (allApplicantsRaw.length > 0) {
        console.log("📋 Sample Applicant Structure:", allApplicantsRaw[0]);
        console.log("📋 Sample Applicant Type Field:", allApplicantsRaw[0].type);
        console.log("📋 Sample Applicant Has Consultants:", (allApplicantsRaw[0] as any).consultants);
        console.log("📋 Sample Applicant Has Consultancy:", (allApplicantsRaw[0] as any).consultancy);
        console.log("📋 Sample Applicant Contract Request:", allApplicantsRaw[0].contract_request);
    }

    // Filter applicants by type with backward compatibility
    const allApplicants = useMemo(() => {
        return allApplicantsRaw.filter(applicant => {
            // Only show applicants who have been accepted or have contracts issued
            if (!['ACCEPTED', 'CONTRACT_ISSUED'].includes(applicant.status)) {
                return false;
            }

            // Use the type field as primary source of truth
            // The consultants array stores the consultancy management ID, not adhoc indicator
            if (applicantType === "ADHOC") {
                return applicant.type === "ADHOC";
            }

            // For consultant route - match CONSULTANT type or no type
            return !applicant.type || applicant.type === "CONSULTANT";
        });
    }, [allApplicantsRaw, applicantType]);

    console.log("🔍 Filtered Applicants (after type filtering):", allApplicants);
    console.log("🔍 Filtered Applicants Count:", allApplicants.length);
    console.log("🔍 Applicant Type:", applicantType);
    console.log("🔍 Applicants by Type:", {
        CONSULTANT: allApplicantsRaw.filter(a => a.type === "CONSULTANT").length,
        ADHOC: allApplicantsRaw.filter(a => a.type === "ADHOC").length,
        FACILITATOR: allApplicantsRaw.filter(a => a.type === "FACILITATOR").length,
        NoType: allApplicantsRaw.filter(a => !a.type).length,
    });

    // Group applicants by consultant advertisement (for consultancy) or advertisement (for adhoc)
    const groupedByContractRequest = consultantAdvertisements.map(advertisement => {
        const applicantsForRequest = allApplicants.filter(applicant => {
            if (applicantType === "ADHOC") {
                // For AdHoc, match by advertisement field
                const advertisementId = typeof (applicant as any).advertisement === 'object' && (applicant as any).advertisement !== null
                    ? ((applicant as any).advertisement as any).id
                    : (applicant as any).advertisement;
                return advertisementId === advertisement.id;
            } else {
                // For Consultancy, match by consultants array (many-to-many relationship)
                const consultantsArray = (applicant as any).consultants || [];
                // Check if this consultant advertisement ID is in the applicant's consultants array
                return consultantsArray.includes(advertisement.id);
            }
        });

        // Count accepted vs pending
        const acceptedCount = applicantsForRequest.filter(a => a.offer_accepted).length;
        const pendingCount = applicantsForRequest.length - acceptedCount;

        return {
            ...advertisement,
            issuedContractsCount: applicantsForRequest.length,
            acceptedCount,
            pendingCount,
            applicants: applicantsForRequest,
        };
    }).filter(advert => advert.issuedContractsCount > 0); // Only show advertisements with issued contracts

    // Handle applicants without a consultant/advertisement link (legacy data)
    const uncategorizedApplicants = allApplicants.filter(applicant => {
        if (applicantType === "ADHOC") {
            return !(applicant as any).advertisement || (applicant as any).advertisement === null;
        } else {
            // For consultancy, check if consultants array is empty or missing
            const consultantsArray = (applicant as any).consultants || [];
            return consultantsArray.length === 0;
        }
    });

    const uncategorizedAccepted = uncategorizedApplicants.filter(a => a.offer_accepted).length;
    const uncategorizedPending = uncategorizedApplicants.length - uncategorizedAccepted;

    console.log("Grouped Consultant Advertisements:", groupedByContractRequest);
    console.log("Uncategorized Applicants:", uncategorizedApplicants);

    const isLoading = isLoadingRequests || isLoadingApplicants;

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Consultant Contract Dashboard</h1>
                    <p className="text-gray-600 mt-2">
                        Issued Contracts
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
                        <span className="font-bold">{groupedByContractRequest.length}</span> {applicantType === "ADHOC" ? "Adhoc Adverts" : "Consultant Adverts"}
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-500 text-white p-3 rounded-lg">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-blue-700 font-medium">Total Contracts Issued</p>
                            <p className="text-3xl font-bold text-blue-900">
                                {allApplicants.length}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-500 text-white p-3 rounded-lg">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-green-700 font-medium">Accepted Contracts</p>
                            <p className="text-3xl font-bold text-green-900">
                                {allApplicants.filter(a => a.offer_accepted).length}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-amber-500 text-white p-3 rounded-lg">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-amber-700 font-medium">Pending Acceptance</p>
                            <p className="text-3xl font-bold text-amber-900">
                                {allApplicants.filter(a => !a.offer_accepted).length}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-darker"></div>
                        <p className="mt-4 text-gray-600">Loading job adverts...</p>
                    </div>
                </div>
            ) : groupedByContractRequest.length === 0 && uncategorizedApplicants.length === 0 ? (
                <Card className="py-12">
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Briefcase className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Contracts Issued Yet</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Once contracts are issued to applicants, they will appear here grouped by {applicantType === "ADHOC" ? "adhoc advertisement" : "consultant advertisement"} for easy tracking.
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-6">
                {/* Job Adverts Grid */}
                {groupedByContractRequest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {groupedByContractRequest.map((advertisement) => (
                        <Card key={advertisement.id} className="hover:shadow-lg transition-shadow duration-200 border-2 hover:border-yellow-darker">
                            <div className="space-y-4">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
                                            {applicantType === "ADHOC"
                                                ? ((advertisement as any).position_title || 'Job Position')
                                                : ((advertisement as any).title || 'Job Position')
                                            }
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Ref: {applicantType === "ADHOC"
                                                ? ((advertisement as any).advertisement_number || advertisement.id?.slice(0, 8))
                                                : advertisement.id?.slice(0, 8)
                                            }
                                        </p>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-xs font-semibold ${
                                        applicantType === "ADHOC"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-purple-100 text-purple-800"
                                    }`}>
                                        {applicantType === "ADHOC" ? "ADHOC" : "CONSULTANT"}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-200">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-600">
                                            {advertisement.issuedContractsCount}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">Issued</p>
                                    </div>
                                    <div className="text-center border-x border-gray-200">
                                        <p className="text-2xl font-bold text-green-600">
                                            {advertisement.acceptedCount}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">Accepted</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-amber-600">
                                            {advertisement.pendingCount}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">Pending</p>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-2">
                                    {(advertisement as any).supervisor && (
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <Briefcase className="h-4 w-4 text-gray-400" />
                                            <span>Supervisor: {typeof (advertisement as any).supervisor === 'object' ? (advertisement as any).supervisor.first_name + ' ' + (advertisement as any).supervisor.last_name : 'N/A'}</span>
                                        </div>
                                    )}
                                    {((advertisement as any).created_datetime || (advertisement as any).publication_date) && (
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span>Posted: {new Date(
                                                (advertisement as any).publication_date || (advertisement as any).created_datetime
                                            ).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-gray-600">
                                        <span>Acceptance Progress</span>
                                        <span>{advertisement.issuedContractsCount > 0 ? Math.round((advertisement.acceptedCount / advertisement.issuedContractsCount) * 100) : 0}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${advertisement.issuedContractsCount > 0 ? (advertisement.acceptedCount / advertisement.issuedContractsCount) * 100 : 0}%`
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Action Button */}
                                <Button
                                    className="w-full flex items-center justify-center gap-2 bg-yellow-darker hover:bg-[#c48f04]"
                                    onClick={() => {
                                        const detailsPath = applicantType === "ADHOC"
                                            ? `/dashboard/programs/adhoc/adhoc-acceptance/details/${advertisement.id}`
                                            : `/dashboard/c-and-g/consultant/consultance-acceptance/details/${advertisement.id}`;
                                        router.push(detailsPath);
                                    }}
                                >
                                    <Eye className="h-4 w-4" />
                                    View Applicants ({advertisement.issuedContractsCount})
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
                )}

                {/* Uncategorized Contracts Section */}
                {uncategorizedApplicants.length > 0 && (
                    <>
                        <div className="pt-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Uncategorized Contracts</h2>
                            <p className="text-gray-600 text-sm mb-4">
                                These contracts were issued before {applicantType === "ADHOC" ? "adhoc advertisements" : "consultant advertisements"} were linked. Click "View Contract" for each applicant to review and accept.
                            </p>
                        </div>

                        <Card className="bg-amber-50 border-2 border-amber-200">
                            <div className="space-y-4">
                                <div className="flex items-start justify-between pb-4 border-b border-amber-300">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="bg-amber-500 text-white p-2 rounded-lg">
                                                <Briefcase className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    Legacy Contracts (No Job Advert Linked)
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Contracts issued before job advert tracking
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-white rounded-lg p-3 shadow-sm">
                                        <p className="text-sm text-gray-600 mb-1">Total Issued</p>
                                        <p className="text-2xl font-bold text-blue-600">{uncategorizedApplicants.length}</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 shadow-sm">
                                        <p className="text-sm text-gray-600 mb-1">Accepted</p>
                                        <p className="text-2xl font-bold text-green-600">{uncategorizedAccepted}</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 shadow-sm">
                                        <p className="text-sm text-gray-600 mb-1">Pending</p>
                                        <p className="text-2xl font-bold text-amber-600">{uncategorizedPending}</p>
                                    </div>
                                </div>

                                {/* Applicants List */}
                                <div className="space-y-2 pt-4 border-t border-amber-300">
                                    {uncategorizedApplicants.map((applicant, index) => (
                                        <div
                                            key={applicant.id}
                                            className={`border-2 rounded-lg p-3 hover:shadow-md transition-all ${
                                                applicant.offer_accepted
                                                    ? 'bg-green-50 border-green-200'
                                                    : 'bg-white border-gray-200'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="bg-gray-100 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-900">
                                                            {applicant.name}
                                                        </h4>
                                                        <div className="flex items-center gap-3 text-xs text-gray-600">
                                                            <span>{applicant.email}</span>
                                                            {applicant.position_under_contract && (
                                                                <span>• {applicant.position_under_contract}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {applicant.offer_accepted ? (
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                                                                ✓ Accepted
                                                            </span>
                                                            {applicant.offer_acceptance_date && (
                                                                <span className="text-xs text-green-600 mt-1">
                                                                    {new Date(applicant.offer_acceptance_date).toLocaleDateString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded">
                                                            ⏰ Pending
                                                        </span>
                                                    )}

                                                    <Button
                                                        size="sm"
                                                        className={`flex items-center gap-1 ${
                                                            applicant.offer_accepted
                                                                ? 'bg-green-600 hover:bg-green-700'
                                                                : 'bg-yellow-darker hover:bg-[#c48f04]'
                                                        }`}
                                                        onClick={() => {
                                                            const basePath = pathname?.includes("adhoc")
                                                                ? "/dashboard/programs/adhoc/adhoc-acceptance"
                                                                : "/dashboard/c-and-g/consultant/consultance-acceptance";
                                                            router.push(`${basePath}/applicant/${applicant.id}`);
                                                        }}
                                                    >
                                                        <Eye className="h-3 w-3" />
                                                        {applicant.offer_accepted ? 'View' : 'Accept'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </>
                )}
                </div>
            )}
        </section>
    );
}
