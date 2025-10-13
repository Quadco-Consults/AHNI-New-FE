"use client";

import BackNavigation from "components/atoms/BackNavigation";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { Button } from "components/ui/button";
import { CG_ROUTES } from "constants/RouterConstants";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { LoadingSpinner } from "components/Loading";
import { useState } from "react";
import JobDetails from "./JobDetails";
import Card from "components/Card";
import { useGetSingleFacilitator } from "@/features/contracts-grants/controllers/facilitatorManagementController";
import Applications from "./applicants/FacilitatorApplicantsList";
import AcceptedApplicants from "./AcceptedApplicants";

export default function FacilitatorDetailsPage() {
  const [tabValue, setTabValue] = useState("job-details");

  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading, error } = useGetSingleFacilitator(id, !!id);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Error loading facilitator details: {error.message}</p>
      </div>
    );
  }

  return (
    <Tabs
      defaultValue='job-details'
      value={tabValue}
      onValueChange={(value) => setTabValue(value)}
    >
      <section className='flex items-center justify-between'>
        <div className='flex items-center gap-5'>
          <BackNavigation />

          <TabsList>
            <TabsTrigger value='job-details'>Job Details</TabsTrigger>

            <TabsTrigger value='applications'>
              Submitted Applicants
            </TabsTrigger>

            <TabsTrigger value='accepted'>Accepted Candidates</TabsTrigger>
          </TabsList>
        </div>
        {tabValue === "applications" && (
          <div>
            <Link className='w-full' href={`/dashboard/c-and-g/facilitator-management/${id}/applicant/create`}>
              <Button className='flex gap-2 py-6' type='button'>
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
            <TabsContent value='job-details'>
              <JobDetails {...data.data} />
            </TabsContent>

            <TabsContent value='applications'>
              <Applications facilitatorId={id} />
            </TabsContent>

            <TabsContent value='accepted'>
              <AcceptedApplicants facilitatorId={id} />
            </TabsContent>
          </Card>
        )}
      </section>
    </Tabs>
  );
}
