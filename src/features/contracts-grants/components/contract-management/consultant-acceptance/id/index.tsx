import { useGetSingleConsultancyStaff } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import SingleConsultancyStaffDetails from "../../consultant-management/id/applicants/SingleConsultancyStaffDetails";
import Card from "components/Card";
import BackNavigation from "components/atoms/BackNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import ScopeOfWork from "../../consultant-management/id/ScopeOfWork";
import { useGetSingleConsultantManagement } from "@/features/contracts-grants/controllers/consultantManagementController";
import JobDetails from "../../consultant-management/id/JobDetails";
import AcceptanceForm from "./AcceptanceForm";
import { useParams } from "next/navigation";

export default function ConsultancyAcceptance() {
    const params = useParams();
    const consultantId = params?.id as string;
    const jobAdvertId = params?.jobId as string;
    
    // Debug logging
    console.log("ConsultancyAcceptance - URL params:", params);
    console.log("ConsultancyAcceptance - Consultant ID:", consultantId);
    console.log("ConsultancyAcceptance - Job Advert ID:", jobAdvertId);
    
    // Validate consultant ID - must be a proper UUID format
    const isValidId = consultantId && 
        consultantId.length > 10 && 
        consultantId !== 'undefined' && 
        consultantId !== 'null' && 
        !consultantId.includes('[object') &&
        consultantId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    
    console.log("ConsultancyAcceptance - Is valid ID:", isValidId);
    
    // Only fetch data if we have valid IDs from URL parameters
    const { data: consultant, error: consultantError, isLoading: consultantLoading } = useGetSingleConsultancyStaff(
        consultantId || "",
        !!isValidId // Only enable the query if we have a valid consultant ID
    );

    const { data: jobAdvert, error: jobAdvertError, isLoading: jobAdvertLoading } = useGetSingleConsultantManagement(
        consultantId || "", // Use consultant ID as job advert ID for now
        !!isValidId // Only enable the query if we have a valid consultant ID
    );

    console.log("ConsultancyAcceptance - Consultant data:", consultant);
    console.log("ConsultancyAcceptance - Job advert data:", jobAdvert);
    console.log("ConsultancyAcceptance - Consultant error:", consultantError);
    console.log("ConsultancyAcceptance - Job advert error:", jobAdvertError);

    // Handle cases where we don't have the required parameters
    if (!consultantId || !isValidId) {
        return (
            <div className="p-6">
                <BackNavigation />
                <Card className="mt-5 p-6">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold mb-2">Invalid Consultant ID</h2>
                        <p className="text-gray-600 mb-4">
                            {!consultantId 
                                ? "No consultant ID provided in the URL. Please select a consultant from the consultant acceptance list."
                                : "Invalid consultant ID format. Please check the URL or select a consultant from the consultant acceptance list."
                            }
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                            Received ID: {consultantId || 'None'}
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
    if (consultantLoading || jobAdvertLoading) {
        return (
            <div className="p-6">
                <BackNavigation />
                <Card className="mt-5 p-6">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Loading consultant details...</p>
                    </div>
                </Card>
            </div>
        );
    }

    // Handle error states
    if ((consultantError && !consultant) || (jobAdvertError && !jobAdvert)) {
        return (
            <div className="p-6">
                <BackNavigation />
                <Card className="mt-5 p-6">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold mb-2 text-red-600">Data Not Found</h2>
                        <div className="space-y-2 text-left">
                            {consultantError && !consultant && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded">
                                    <h3 className="font-medium text-red-800">Consultant Error:</h3>
                                    <p className="text-sm text-red-600">
                                        {consultantError?.message || "Unable to fetch consultant details"}
                                    </p>
                                </div>
                            )}
                            {jobAdvertError && !jobAdvert && (
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                                    <h3 className="font-medium text-yellow-800">Job Details Error:</h3>
                                    <p className="text-sm text-yellow-600">
                                        {jobAdvertError?.message || "Unable to fetch job details"}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded text-left">
                            <h3 className="font-medium text-gray-800">Debug Information:</h3>
                            <p className="text-sm text-gray-600">Consultant ID: {consultantId}</p>
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

    return (
        <div className="p-6">
            <Tabs defaultValue="consultant-details">
                <div className="flex items-center gap-2">
                    <BackNavigation />
                    <TabsList>
                        <TabsTrigger value="consultant-details">
                            Consultant Details
                        </TabsTrigger>

                        <TabsTrigger value="job-details">Job Details</TabsTrigger>

                        <TabsTrigger value="work-scope">Scope Of Work</TabsTrigger>

                        <TabsTrigger value="acceptance-form">
                            Consultant Certification
                        </TabsTrigger>
                    </TabsList>
                </div>

                <Card className="mt-5">
                    <TabsContent value="consultant-details">
                        {consultant?.data ? (
                            <SingleConsultancyStaffDetails {...consultant.data} />
                        ) : (
                            <div className="p-6 text-center">
                                <p className="text-gray-600">Consultant details not available</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="job-details">
                        {jobAdvert?.data ? (
                            <JobDetails {...jobAdvert.data} />
                        ) : (
                            <div className="p-6 text-center">
                                <p className="text-gray-600">Job details not available</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="work-scope">
                        {jobAdvert?.data ? (
                            <ScopeOfWork {...jobAdvert.data} />
                        ) : (
                            <div className="p-6 text-center">
                                <p className="text-gray-600">Scope of work not available</p>
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
