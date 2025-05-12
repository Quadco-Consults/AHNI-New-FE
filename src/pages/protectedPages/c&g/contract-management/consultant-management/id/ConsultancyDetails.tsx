import BackNavigation from "atoms/BackNavigation";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { Button } from "components/ui/button";
import { CG_ROUTES, ProgramRoutes } from "constants/RouterConstants";
import { generatePath, Link, useLocation, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { skipToken } from "@reduxjs/toolkit/query";
import { LoadingSpinner } from "components/shared/Loading";
import { useState } from "react";
import JobDetails from "./JobDetails";
import Card from "components/shared/Card";
import { useGetSingleConsultantManagementQuery } from "services/c&g/contract-management/consultancy-management/consultant-management";
import ScopeOfWork from "./ScopeOfWork";
import Applications from "./applicants/ConsultancyStaffList";

export default function ConsultancyDetailsPage() {
    const [tabValue, setTabValue] = useState("job-details");

    const { id } = useParams();

    const { data, isLoading } = useGetSingleConsultantManagementQuery(
        id ?? skipToken
    );

    const { pathname } = useLocation();

    const type = pathname.includes("adhoc-management") ? "ADHOC" : "CONSULTANT";

    const path =
        type === "ADHOC"
            ? ProgramRoutes.CREATE_ADHOC_APPLICANT
            : CG_ROUTES.CREATE_CONSULTANCY_DETAILS;

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <Tabs
            defaultValue="details"
            value={tabValue}
            onValueChange={(value) => setTabValue(value)}
        >
            <section className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <BackNavigation />

                    <TabsList>
                        <TabsTrigger value="job-details">
                            Job Details
                        </TabsTrigger>

                        <TabsTrigger value="work-scope">
                            Scope Of Work
                        </TabsTrigger>

                        <TabsTrigger value="applications">
                            Submitted Applications
                        </TabsTrigger>

                        <TabsTrigger value="shortlist">Shortlist</TabsTrigger>

                        <TabsTrigger value="contract-form">
                            Contract Request Form
                        </TabsTrigger>
                    </TabsList>
                </div>
                {tabValue === "applications" && (
                    <div>
                        <Link
                            className="w-full"
                            to={generatePath(path, {
                                id,
                            })}
                        >
                            <Button className="flex gap-2 py-6" type="button">
                                <AddSquareIcon />
                                Add Applicant
                            </Button>
                        </Link>
                    </div>
                )}
            </section>
            <section>
                {data && (
                    <Card>
                        <TabsContent value="job-details">
                            <JobDetails {...data.data} />
                        </TabsContent>
                        <TabsContent value="work-scope">
                            <ScopeOfWork {...data.data} />
                        </TabsContent>

                        <TabsContent value="applications">
                            <Applications />
                        </TabsContent>
                    </Card>
                )}
            </section>
        </Tabs>
    );
}
