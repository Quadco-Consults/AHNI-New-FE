"use client";

import Card from "@/components/Card";
import BackNavigation from "@/components/atoms/BackNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetSingleConsultancyApplicant } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import ApplicantDetails from "./ApplicantDetails";
import AcceptanceForm from "./AcceptanceForm";
import { useParams } from "next/navigation";

export default function ApplicantAcceptance() {
    const params = useParams();
    const applicantId = params?.id as string;

    // Debug logging
    console.log("ApplicantAcceptance - URL params:", params);
    console.log("ApplicantAcceptance - Applicant ID:", applicantId);

    // Validate applicant ID - must be a proper UUID format
    const isValidId = applicantId &&
        applicantId.length > 10 &&
        applicantId !== 'undefined' &&
        applicantId !== 'null' &&
        !applicantId.includes('[object') &&
        applicantId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

    console.log("ApplicantAcceptance - Is valid ID:", isValidId);

    // Only fetch data if we have valid IDs from URL parameters
    const { data: applicant, error: applicantError, isLoading: applicantLoading } = useGetSingleConsultancyApplicant(
        applicantId || "",
        !!isValidId // Only enable the query if we have a valid applicant ID
    );

    const applicantData = applicant?.data;

    console.log("ApplicantAcceptance - Applicant data:", applicant);
    console.log("ApplicantAcceptance - Applicant error:", applicantError);

    // Handle cases where we don't have the required parameters
    if (!applicantId || !isValidId) {
        return (
            <div className="p-6">
                <BackNavigation />
                <Card className="mt-5 p-6">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold mb-2">Invalid Applicant ID</h2>
                        <p className="text-gray-600 mb-4">
                            {!applicantId
                                ? "No applicant ID provided in the URL. Please select an applicant from the acceptance list."
                                : "Invalid applicant ID format. Please check the URL or select an applicant from the acceptance list."
                            }
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                            Received ID: {applicantId || 'None'}
                        </p>
                        <button
                            onClick={() => window.history.back()}
                            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                        >
                            Go Back
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    // Handle loading states
    if (applicantLoading) {
        return (
            <div className="p-6">
                <BackNavigation />
                <Card className="mt-5 p-6">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Loading applicant details...</p>
                    </div>
                </Card>
            </div>
        );
    }

    // Handle error states
    if (applicantError && !applicant) {
        return (
            <div className="p-6">
                <BackNavigation />
                <Card className="mt-5 p-6">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold mb-2 text-red-600">Data Not Found</h2>
                        <div className="space-y-2 text-left">
                            {applicantError && !applicant && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded">
                                    <h3 className="font-medium text-red-800">Applicant Error:</h3>
                                    <p className="text-sm text-red-600">
                                        {applicantError?.message || "Unable to fetch applicant details"}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded text-left">
                            <h3 className="font-medium text-gray-800">Debug Information:</h3>
                            <p className="text-sm text-gray-600">Applicant ID: {applicantId}</p>
                            <p className="text-sm text-gray-600">URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
                        </div>
                        <button
                            onClick={() => window.history.back()}
                            className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                        >
                            Go Back
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    const isAccepted = applicantData?.offer_accepted;

    return (
        <div className="p-6">
            {/* Acceptance Status Banner */}
            {isAccepted && applicantData && (
                <div className="mb-5 bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-500 text-white p-2 rounded-lg">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-green-900 text-lg">Contract Accepted</h3>
                            <p className="text-sm text-green-700">
                                This contract was accepted on {applicantData.offer_acceptance_date
                                    ? new Date(applicantData.offer_acceptance_date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })
                                    : 'N/A'}
                            </p>
                        </div>
                        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
                            ✓ ACCEPTED
                        </div>
                    </div>
                </div>
            )}

            <Tabs defaultValue="applicant-details">
                <div className="flex items-center gap-2">
                    <BackNavigation />
                    <TabsList>
                        <TabsTrigger value="applicant-details">
                            Applicant Details
                        </TabsTrigger>

                        <TabsTrigger value="acceptance-form">
                            {isAccepted ? 'Acceptance Details' : 'Contract Acceptance'}
                        </TabsTrigger>
                    </TabsList>
                </div>

                <Card className="mt-5">
                    <TabsContent value="applicant-details">
                        {applicantData ? (
                            <ApplicantDetails {...applicantData} />
                        ) : (
                            <div className="p-6 text-center">
                                <p className="text-gray-600">Applicant details not available</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="acceptance-form">
                        <AcceptanceForm />
                    </TabsContent>
                </Card>
            </Tabs>
        </div>
    );
}