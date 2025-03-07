import BackNavigation from "atoms/BackNavigation";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { Button } from "components/ui/button";
import { CG_ROUTES } from "constants/RouterConstants";
import { generatePath, Link, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { skipToken } from "@reduxjs/toolkit/query";
import { LoadingSpinner } from "components/shared/Loading";
import { useState } from "react";
import JobDetails from "./JobDetails";
import Card from "components/shared/Card";
import ScopeOfWork from "./ScopeOfWork";
import { useGetSingleFacilitatorQuery } from "services/c&g/contract-management/facilitator-management";

export default function FacilitatorDetails() {
    const [tabValue, setTabValue] = useState("job-details");

    const { id } = useParams();

    const { data, isLoading } = useGetSingleFacilitatorQuery(id ?? skipToken);

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

                        <TabsTrigger value="contract-form">
                            Contract Request Form
                        </TabsTrigger>
                    </TabsList>
                </div>
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
                    </Card>
                )}
            </section>
        </Tabs>
    );
}
