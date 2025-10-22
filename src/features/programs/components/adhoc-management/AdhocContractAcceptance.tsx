"use client";

import { useState } from "react";
import Card from "components/Card";
import { useGetAllAdhocApplicants } from "@/features/programs/controllers/adhocApplicantController";
import { useGetAllAdhocAdvertisements } from "@/features/programs/controllers/adhocAdvertisementController";
import { useRouter } from "next/navigation";
import { FileText, Users, Calendar, Briefcase, Eye, CheckCircle, Clock } from "lucide-react";

export default function AdhocContractAcceptance() {
    const [page, setPage] = useState(1);
    const router = useRouter();

    // Fetch adhoc advertisements
    const { data: adhocAdvertisementsData, isFetching: isLoadingAdvertisements } = useGetAllAdhocAdvertisements({
        page,
        size: 100,
    });

    // Fetch ALL adhoc applicants (backend ensures these are adhoc-specific)
    const { data: adhocApplicantsData, isFetching: isLoadingApplicants } = useGetAllAdhocApplicants({
        page: 1,
        size: 1000,
    });

    const advertisements = adhocAdvertisementsData?.data?.results || [];
    const allApplicantsRaw = adhocApplicantsData?.data?.results || [];

    console.log("📊 Adhoc Contract Acceptance Debug:");
    console.log("- Total applicants fetched:", allApplicantsRaw.length);
    console.log("- All statuses:", allApplicantsRaw.map(a => a.status));

    // Filter for CONTRACT_ISSUED or APPROVED applicants only
    // Since we're using the adhoc-specific endpoint, we don't need type filtering
    const allApplicants = allApplicantsRaw.filter(applicant =>
        applicant.status === 'CONTRACT_ISSUED' || applicant.status === 'APPROVED'
    );

    console.log("- Contract issued/approved count:", allApplicants.length);

    // Group applicants by advertisement
    const groupedByAdvertisement = advertisements.map(advertisement => {
        const applicantsForAdvertisement = allApplicants.filter(applicant => {
            const advertisementId = typeof applicant.advertisement === 'object' && applicant.advertisement !== null
                ? (applicant.advertisement as any).id
                : applicant.advertisement;
            return advertisementId === advertisement.id;
        });

        // Count accepted vs pending
        const acceptedCount = applicantsForAdvertisement.filter(a => a.offer_accepted).length;
        const pendingCount = applicantsForAdvertisement.length - acceptedCount;

        return {
            ...advertisement,
            issuedContractsCount: applicantsForAdvertisement.length,
            acceptedCount,
            pendingCount,
            applicants: applicantsForAdvertisement,
        };
    }).filter(advert => advert.issuedContractsCount > 0); // Only show adverts with issued contracts

    // Handle applicants without an advertisement (legacy data)
    const uncategorizedApplicants = allApplicants.filter(applicant =>
        !applicant.advertisement || applicant.advertisement === null
    );

    const uncategorizedAccepted = uncategorizedApplicants.filter(a => a.offer_accepted).length;
    const uncategorizedPending = uncategorizedApplicants.length - uncategorizedAccepted;

    console.log("- Grouped advertisements:", groupedByAdvertisement.length);
    console.log("- Uncategorized applicants:", uncategorizedApplicants.length);

    const isLoading = isLoadingAdvertisements || isLoadingApplicants;

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Adhoc Contract Acceptance Portal</h1>
                    <p className="text-gray-600 mt-2">
                        Job adverts with issued contracts awaiting acceptance from adhoc staff
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
                        <span className="font-bold">{groupedByAdvertisement.length}</span> Active Adverts
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
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#DEA004]"></div>
                        <p className="mt-4 text-gray-600">Loading job adverts...</p>
                    </div>
                </div>
            ) : groupedByAdvertisement.length === 0 && uncategorizedApplicants.length === 0 ? (
                <Card className="py-12">
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Briefcase className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Contracts Issued Yet</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Once contracts are issued to adhoc applicants, they will appear here grouped by job advert for easy tracking.
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-6">
                    {/* Job Adverts Grid */}
                    {groupedByAdvertisement.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {groupedByAdvertisement.map((advertisement) => (
                                <Card
                                    key={advertisement.id}
                                    className="hover:shadow-lg transition-shadow duration-200 border-2 hover:border-[#DEA004]"
                                >
                                    <div className="space-y-4">
                                        {/* Header */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
                                                    {advertisement.position_title || 'Job Position'}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {advertisement.advertisement_number}
                                                </p>
                                            </div>
                                            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                                {advertisement.issuedContractsCount} {advertisement.issuedContractsCount === 1 ? 'Contract' : 'Contracts'}
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-green-50 rounded-lg p-3">
                                                <div className="flex items-center gap-2 text-green-700">
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span className="text-sm font-medium">Accepted</span>
                                                </div>
                                                <p className="text-2xl font-bold text-green-900 mt-1">
                                                    {advertisement.acceptedCount}
                                                </p>
                                            </div>
                                            <div className="bg-amber-50 rounded-lg p-3">
                                                <div className="flex items-center gap-2 text-amber-700">
                                                    <Clock className="h-4 w-4" />
                                                    <span className="text-sm font-medium">Pending</span>
                                                </div>
                                                <p className="text-2xl font-bold text-amber-900 mt-1">
                                                    {advertisement.pendingCount}
                                                </p>
                                            </div>
                                        </div>

                                        {/* View Details Button */}
                                        <button
                                            onClick={() => router.push(`/dashboard/programs/adhoc/adhoc-acceptance/details/${advertisement.id}`)}
                                            className="w-full bg-[#DEA004] hover:bg-[#C78F03] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                        >
                                            <Eye className="h-4 w-4" />
                                            View Contracts
                                        </button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Uncategorized Applicants */}
                    {uncategorizedApplicants.length > 0 && (
                        <Card className="mt-6">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Uncategorized Contracts ({uncategorizedApplicants.length})
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    These contracts are not associated with any job advert.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <p className="text-sm text-green-700 font-medium">Accepted</p>
                                        <p className="text-2xl font-bold text-green-900">{uncategorizedAccepted}</p>
                                    </div>
                                    <div className="bg-amber-50 rounded-lg p-4">
                                        <p className="text-sm text-amber-700 font-medium">Pending</p>
                                        <p className="text-2xl font-bold text-amber-900">{uncategorizedPending}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            )}
        </section>
    );
}
