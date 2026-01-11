"use client";

import BackNavigation from "@/components/atoms/BackNavigation";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import { Button } from "@/components/ui/button";
import { CG_ROUTES, ProgramRoutes } from "@/constants/RouterConstants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { skipToken } from "@reduxjs/toolkit/query";
import { LoadingSpinner } from "@/components/Loading";
import { useState } from "react";
import JobDetails from "./JobDetails";
import Card from "@/components/Card";
import { useGetSingleConsultantManagement } from "@/features/contracts-grants/controllers/consultantManagementController";
import { useGetSingleAdhocAdvertisement } from "@/features/programs/controllers/adhocAdvertisementController";
import { IAdhocAdvertisement } from "@/features/programs/types/adhoc-management";
import Applications from "./applicants/ConsultancyStaffList";
import ShortlistedAppplicants from "./ShortlistedApplicants";
import InterviewedApplicants from "./InterviewedApplicants";
import AcceptedApplicants from "./AcceptedApplicants";

export default function ConsultancyDetailsPage() {
  const [tabValue, setTabValue] = useState("job-details");

  const params = useParams();
  const id = params?.id as string;

  const pathname = usePathname();
  const type = (pathname && pathname.includes("adhoc-management")) ? "ADHOC" : "CONSULTANT";

  // Use the appropriate API hook based on the type
  const consultantQuery = useGetSingleConsultantManagement(
    type === "CONSULTANT" && id ? id : skipToken
  );
  const adhocQuery = useGetSingleAdhocAdvertisement(
    id || "",
    type === "ADHOC" && !!id
  );

  // Get data from the appropriate query
  const isLoading = type === "ADHOC" ? adhocQuery.isLoading : consultantQuery.isLoading;
  const rawData = type === "ADHOC" ? adhocQuery.data : consultantQuery.data;

  // Transform adhoc data to match consultant data structure
  const data = (() => {
    if (!rawData || !rawData.data) return rawData;

    if (type === "ADHOC") {
      const adhocData = rawData.data as IAdhocAdvertisement;

      // Extract location info - handle both string ID and object
      const locationObj = typeof adhocData.location === 'object' ? adhocData.location : null;
      const locationName = locationObj?.name || adhocData.location_name || "Not specified";

      return {
        ...rawData,
        data: {
          ...adhocData,
          type: "ADHOC" as const,
          title: adhocData.position_title,
          consultants_number: adhocData.number_of_positions,
          duration: adhocData.duration_months || Math.ceil(
            (new Date(adhocData.end_date).getTime() - new Date(adhocData.start_date).getTime()) /
            (1000 * 60 * 60 * 24 * 30)
          ),
          commencement_date: adhocData.start_date,
          end_date: adhocData.end_date,
          locations: locationObj ? [{
            id: locationObj.id,
            name: locationObj.name,
            city: locationObj.city || locationObj.name,
            state: locationObj.state,
            address: locationObj.address,
          }] : [],
          scope_of_work: {
            id: adhocData.id,
            description: adhocData.job_description || "",
            background: adhocData.qualifications_required || adhocData.qualifications || "",
            objectives: adhocData.key_responsibilities || "",
            deliverables: [],
            advertisement_document: "",
            scope_of_work_document: "",
            created_datetime: adhocData.created_datetime,
            updated_datetime: adhocData.updated_datetime || adhocData.created_datetime,
            location: locationName,
            fee_rate: parseFloat(adhocData.proposed_salary || "0"),
            payment_frequency: "Monthly",
          },
          advertisement_document: "",
          evaluation_comments: adhocData.additional_notes || adhocData.status_display || "",
          extra_info: adhocData.additional_requirements || "",
          background: adhocData.qualifications_required || adhocData.qualifications || "",
          status: adhocData.status,
          grade_level: adhocData.grade_level || "",
          created_by: typeof adhocData.created_by === 'string' ? adhocData.created_by : (adhocData.created_by?.id || ""),
          updated_by: adhocData.updated_by || null,
          supervisor: typeof adhocData.supervisor === 'object' ? adhocData.supervisor : {} as any,
          requisition: adhocData.requisition_details || adhocData.requisition,
        }
      };
    }

    return rawData;
  })();

  const path =
    type === "ADHOC"
      ? ProgramRoutes.CREATE_ADHOC_APPLICANT
      : CG_ROUTES.CREATE_CONSULTANCY_APPLICANT;

  const interviewPath =
    type === "ADHOC" ? ProgramRoutes.CREATE_ADHOC_INTERVIEW : CG_ROUTES.CREATE_CONSULTANCY_INTERVIEW;

  // Debug logging for details page
  if (process.env.NODE_ENV === 'development') {
    console.log('📄 ConsultancyDetails Debug:', {
      type,
      id,
      pathname,
      tabValue,
      isLoading,
      hasData: !!data,
      dataKeys: data ? Object.keys(data) : [],
    });
  }

  if (isLoading) {
    return <LoadingSpinner />;
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

            <TabsContent value='interviewed'>
              <InterviewedApplicants />
            </TabsContent>

            <TabsContent value='accepted'>
              <AcceptedApplicants />
            </TabsContent>
          </Card>
        )}
      </section>
    </Tabs>
  );
}
