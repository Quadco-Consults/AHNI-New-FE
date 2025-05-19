import { useGetSingleConsultancyStaffQuery } from "services/c&g/contract-management/consultancy-management/consultancy-applicants";
import SingleConsultancyStaffDetails from "../../consultant-management/id/applicants/SingleConsultancyStaffDetails";
import Card from "components/shared/Card";
import BackNavigation from "atoms/BackNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import ScopeOfWork from "../../consultant-management/id/ScopeOfWork";
import { useGetSingleConsultantManagementQuery } from "services/c&g/contract-management/consultancy-management/consultant-management";
import JobDetails from "../../consultant-management/id/JobDetails";
import AcceptanceForm from "./AcceptanceForm";

export default function ConsultancyAcceptance() {
    const { data: consultant } = useGetSingleConsultancyStaffQuery(
        "f7207dcd-92fc-46dd-8a23-f719f275b3ef"
    );

    const { data: jobAdvert } = useGetSingleConsultantManagementQuery(
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
