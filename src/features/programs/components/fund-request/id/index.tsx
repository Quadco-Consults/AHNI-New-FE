"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/Card";
import Summary from "./Summary";
import { Button } from "components/ui/button";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { LoadingSpinner } from "components/Loading";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useGetSingleProject, useGetAllProjects } from "@/features/projects/controllers/projectController";
import { useGetAllFundRequests } from "@/features/programs/controllers/fundRequestController";
import { RouteEnum } from "constants/RouterConstants";
import FundRequestSummary from "./FundRequestSummary";
import FundRequestWorkflowStatus from "../components/FundRequestWorkflowStatus";
import ProjectBatchApproval from "./ProjectBatchApproval";

export default function FundRequestDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  // Decode the URL-encoded ID
  const decodedId = decodeURIComponent(id || "");

  // Helper function to check if string is a valid UUID
  const isValidUUID = (str: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  const isUUID = isValidUUID(decodedId);

  // Fetch project: if UUID, get by ID; if not, search by project_id
  const { data: project, isLoading: projectByIdLoading } = useGetSingleProject(
    isUUID ? decodedId : skipToken,
    isUUID
  );

  const { data: projectsBySearch, isLoading: projectsBySearchLoading } = useGetAllProjects({
    search: !isUUID ? decodedId : "",
    enabled: !!decodedId && !isUUID,
    size: 1,
  });

  const projectLoading = projectByIdLoading || projectsBySearchLoading;
  const projectFromSearch = projectsBySearch?.data?.results?.[0];
  const actualProject = project || (projectFromSearch ? { data: projectFromSearch } : null);
  const actualProjectId = actualProject?.data?.id;

  const { data: fundRequests, isLoading: fundRequestsLoading } =
    useGetAllFundRequests({
      // Use the actual project UUID from either direct fetch or search
      project: actualProjectId,
      enabled: !!actualProjectId,
      size: 1000,
    });

  const dispatch = useAppDispatch();

  const isLoading = projectLoading || fundRequestsLoading;
  const firstFundRequest = fundRequests?.data?.results?.[0];

  // If project data is not available but we have fund requests, extract project info from the first fund request
  const projectData = actualProject?.data || (firstFundRequest?.project && typeof firstFundRequest.project === 'object' ? firstFundRequest.project : null);

  // If we still don't have project data but have fund requests, create a fallback project object
  const fallbackProjectData = !projectData && fundRequests?.data?.results?.length ? {
    id: decodedId,
    title: decodedId,
    project_id: decodedId,
    start_date: firstFundRequest?.created_datetime?.split('T')[0] || 'N/A',
    end_date: 'N/A',
  } : null;

  const finalProjectData = projectData || fallbackProjectData;

  const goBack = () => {
    router.back();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If project is not found and we have no fund requests either
  if (!finalProjectData && !projectLoading && !fundRequests?.data?.results?.length) {
    return (
      <Card className='p-8 text-center space-y-4'>
        <p className='text-red-600 font-semibold'>No fund requests found</p>
        <p className='text-gray-600'>No fund requests found for project "{decodedId}".</p>
        <Button onClick={goBack}>Go Back</Button>
      </Card>
    );
  }

  return (
    <div className='space-y-6 relative min-h-screen'>
      <button
        onClick={goBack}
        className='w-[3rem] absolute top-0 left-0 aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center'
      >
        <LongArrowLeft />
      </button>

      <Tabs defaultValue='summary' className='space-y-10'>
        <div className='relative flex justify-between gap-5 ml-16'>
          <TabsList>
            <TabsTrigger value='summary'>Summary</TabsTrigger>
            <TabsTrigger value='fund Request Summary'>
              Fund Request Summary
            </TabsTrigger>
            {/* <TabsTrigger value='approval Status'>Approval Status</TabsTrigger> */}
            <TabsTrigger value='hq Approval'>HQ Project Approval</TabsTrigger>
          </TabsList>

          <div className='flex items-center gap-2'>
            <Link
              href={RouteEnum.PROGRAM_FUND_REQUEST_VIEW_ALL_FUND_REQUESTS.replace(
                ":id",
                id || ""
              )}
            >
              <Button
                variant='outline'
              >
                Preview
              </Button>
            </Link>
            <Button
              className='bg-primary text-white hover:bg-primary/90'
              onClick={() => {
                dispatch(
                  openDialog({
                    type: DialogType.SspApproveModal,
                    dialogProps: {
                      header: "Request Approval",
                      width: "max-w-2xl",
                    },
                  })
                );
              }}
            >
              Approval
            </Button>
          </div>
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          finalProjectData && (
            <>
              <TabsContent value='summary'>
                <Card>
                  <Summary data={finalProjectData} />
                </Card>
              </TabsContent>
              <TabsContent value='fund Request Summary'>
                <FundRequestSummary />
              </TabsContent>
              {/* <TabsContent value='approval Status'>
                {firstFundRequest ? (
                  <FundRequestWorkflowStatus
                    fundRequestId={firstFundRequest.id}
                    currentStatus={firstFundRequest.status || "PENDING"}
                    canReview={true}
                    canAdminApprove={false}
                    canManagerApprove={false}
                    canReject={true}
                  />
                ) : (
                  <Card className='p-6'>
                    <div className='text-center text-gray-500'>
                      <p>No fund requests found for this project.</p>
                    </div>
                  </Card>
                )}
              </TabsContent> */}
              <TabsContent value='hq Approval'>
                <ProjectBatchApproval projectId={finalProjectData.id || decodedId || ""} />
              </TabsContent>
            </>
          )
        )}
      </Tabs>
    </div>
  );
}
