import { useGetSingleConsultancyStaff } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import SingleConsultancyStaffDetails from "../../consultant-management/id/applicants/SingleConsultancyStaffDetails";
import Card from "components/Card";
import BackNavigation from "components/atoms/BackNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import ScopeOfWork from "../../consultant-management/id/ScopeOfWork";
import { useGetSingleConsultantManagement } from "@/features/contracts-grants/controllers/consultantManagementController";
import JobDetails from "../../consultant-management/id/JobDetails";
import AcceptanceForm from "./AcceptanceForm";

export default function ConsultancyAcceptance() {
    const { data: consultant } = useGetSingleConsultancyStaff(
        "f7207dcd-92fc-46dd-8a23-f719f275b3ef"
    );

    const { data: jobAdvert } = useGetSingleConsultantManagement(
        "d47b2cbc-5561-412f-b86d-24fd9f571954"
    );

    return (
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

            {consultant && jobAdvert && (
                <Card className="mt-5">
                    <TabsContent value="consultant-details">
                        <SingleConsultancyStaffDetails {...consultant.data} />
                    </TabsContent>

                    <TabsContent value="job-details">
                        <JobDetails {...jobAdvert.data} />
                    </TabsContent>

                    <TabsContent value="work-scope">
                        <ScopeOfWork {...jobAdvert.data} />
                    </TabsContent>

                    <TabsContent value="acceptance-form">
                        <AcceptanceForm />
                    </TabsContent>
                </Card>
            )}
        </Tabs>
    );
}
