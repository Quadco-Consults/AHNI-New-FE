"use client";

import BackNavigation from "components/atoms/BackNavigation";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { Button } from "components/ui/button";
import { ProgramRoutes } from "constants/RouterConstants";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { LoadingSpinner } from "components/Loading";
import { useState } from "react";
import Card from "components/Card";
import { useGetSingleAdhocAdvertisement } from "@/features/programs/controllers/adhocAdvertisementController";
import AdhocJobDetails from "./AdhocJobDetails";
import AdhocApplicantsList from "./AdhocApplicantsList";
import AdhocShortlistedApplicants from "./AdhocShortlistedApplicants";
import AdhocInterviewedApplicants from "./AdhocInterviewedApplicants";
import AdhocAcceptedApplicants from "./AdhocAcceptedApplicants";

export default function AdhocAdvertisementDetails() {
  const [tabValue, setTabValue] = useState("job-details");

  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading } = useGetSingleAdhocAdvertisement(id || "", !!id);

  const advertisement = data?.data;

  // Debug logging for details page
  if (process.env.NODE_ENV === 'development') {
    console.log('📄 AdhocAdvertisementDetails Debug:', {
      id,
      tabValue,
      isLoading,
      hasData: !!advertisement,
      advertisementNumber: advertisement?.advertisement_number,
      startDate: advertisement?.start_date,
      endDate: advertisement?.end_date,
    });
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!advertisement) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Advertisement not found</p>
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
              Submitted Applications
            </TabsTrigger>

            <TabsTrigger value='shortlisted'>Shortlist</TabsTrigger>

            <TabsTrigger value='interviewed'>Interviewed</TabsTrigger>

            <TabsTrigger value='accepted'>Accepted Candidates</TabsTrigger>
          </TabsList>
        </div>
        {tabValue === "applications" && (
          <div>
            <Link className='w-full' href={ProgramRoutes.CREATE_ADHOC_APPLICANT.replace(":id", id)}>
              <Button className='flex gap-2 py-6' type='button'>
                <AddSquareIcon />
                Add Applicant
              </Button>
            </Link>
          </div>
        )}

        {tabValue === "shortlisted" && (
          <div>
            <Link className='w-full' href={ProgramRoutes.CREATE_ADHOC_INTERVIEW.replace(":id", id)}>
              <Button className='flex gap-2 py-6' type='button'>
                <AddSquareIcon />
                Create Interview
              </Button>
            </Link>
          </div>
        )}
      </section>
      <section>
        <Card>
          <TabsContent value='job-details'>
            <AdhocJobDetails advertisement={advertisement} />
          </TabsContent>

          <TabsContent value='applications'>
            <AdhocApplicantsList
              advertisementId={id}
              advertisementStartDate={advertisement.start_date}
              advertisementEndDate={advertisement.end_date}
            />
          </TabsContent>

          <TabsContent value='shortlisted'>
            <AdhocShortlistedApplicants advertisementId={id} />
          </TabsContent>

          <TabsContent value='interviewed'>
            <AdhocInterviewedApplicants advertisementId={id} />
          </TabsContent>

          <TabsContent value='accepted'>
            <AdhocAcceptedApplicants advertisementId={id} />
          </TabsContent>
        </Card>
      </section>
    </Tabs>
  );
}
