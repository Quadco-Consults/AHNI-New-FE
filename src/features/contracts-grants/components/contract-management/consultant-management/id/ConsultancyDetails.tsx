"use client";

import BackNavigation from "components/atoms/BackNavigation";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { Button } from "components/ui/button";
import { CG_ROUTES, ProgramRoutes } from "constants/RouterConstants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { skipToken } from "@reduxjs/toolkit/query";
import { LoadingSpinner } from "components/Loading";
import { useState } from "react";
import JobDetails from "./JobDetails";
import Card from "components/Card";
import { useGetSingleConsultantManagement } from "@/features/contracts-grants/controllers/consultantManagementController";
import Applications from "./applicants/ConsultancyStaffList";
import ShortlistedAppplicants from "./ShortlistedApplicants";

export default function ConsultancyDetailsPage() {
  const [tabValue, setTabValue] = useState("job-details");

  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading } = useGetSingleConsultantManagement(id ?? skipToken);

  const pathname = usePathname();

  const type = pathname.includes("adhoc-management") ? "ADHOC" : "CONSULTANT";

  const path =
    type === "ADHOC"
      ? ProgramRoutes.CREATE_ADHOC_APPLICANT
      : CG_ROUTES.CREATE_CONSULTANCY_APPLICANT;

  const interviewPath =
    type === "ADHOC" ? ProgramRoutes.CREATE_ADHOC_INTERVIEW : CG_ROUTES.CREATE_CONSULTANCY_INTERVIEW;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Tabs
      defaultValue='details'
      value={tabValue}
      onValueChange={(value) => setTabValue(value)}
    >
      <section className='flex items-center justify-between'>
        <div className='flex items-center gap-5'>
          <BackNavigation />

          <TabsList>
            <TabsTrigger value='job-details'>Job Details</TabsTrigger>

            <TabsTrigger value='applications'>
              Submitted Applications
            </TabsTrigger>

            <TabsTrigger value='shortlisted'>Shortlist</TabsTrigger>
          </TabsList>
        </div>
        {tabValue === "applications" && (
          <div>
            <Link className='w-full' href={path.replace(":id", id)}>
              <Button className='flex gap-2 py-6' type='button'>
                <AddSquareIcon />
                Add Applicant
              </Button>
            </Link>
          </div>
        )}

        {tabValue === "shortlisted" && (
          <div>
            <Link className='w-full' href={interviewPath.replace(":id", id)}>
              <Button className='flex gap-2 py-6' type='button'>
                <AddSquareIcon />
                Create Interview
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
              <Applications />
            </TabsContent>

            <TabsContent value='shortlisted'>
              <ShortlistedAppplicants />
            </TabsContent>
          </Card>
        )}
      </section>
    </Tabs>
  );
}
