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
import { useGetSingleProject } from "@/features/projects/controllers/projectController";
import { useGetAllFundRequests } from "@/features/programs/controllers/fundRequestController";
import { RouteEnum } from "constants/RouterConstants";
import FundRequestSummary from "./FundRequestSummary";
import FundRequestWorkflowStatus from "../components/FundRequestWorkflowStatus";
import ProjectBatchApproval from "./ProjectBatchApproval";

export default function FundRequestDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data: project, isLoading: projectLoading } = useGetSingleProject(
    id ?? skipToken
  );
  const { data: fundRequests, isLoading: fundRequestsLoading } =
    useGetAllFundRequests({
      project: id || "",
      enabled: !!id,
    });

  const dispatch = useAppDispatch();

  const isLoading = projectLoading || fundRequestsLoading;
  const firstFundRequest = fundRequests?.data?.results?.[0];

  const goBack = () => {
    router.back();
  };

  if (isLoading) {
    return <LoadingSpinner />;
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
                variant='ghost'
                className='bg-[#FFF2F2] text-primary hover:bg-[#FFF2F2] hover:text-primary'
              >
                Preview
              </Button>
            </Link>
            {/* <Button
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
            </Button> */}
          </div>
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          project?.data && (
            <>
              <TabsContent value='summary'>
                <Card>
                  <Summary data={project.data} />
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
                <ProjectBatchApproval projectId={id || ""} />
              </TabsContent>
            </>
          )
        )}
      </Tabs>
    </div>
  );
}
