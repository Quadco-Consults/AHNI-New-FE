"use client";

import logoPng from "assets/imgs/logo.png";
import { useSearchParams } from "next/navigation";
import { skipToken } from "@tanstack/react-query";
import Card from "components/Card";
import FundActivityTable from "./FundActivityTable";
import { LoadingSpinner } from "components/Loading";
import { useGetSingleFundRequest } from "@/features/programs/controllers";
import { useGetSingleProject } from "@/features/projects/controllers";
import FundRequestWorkflowStatus from "../components/FundRequestWorkflowStatus";
import { useAppSelector } from "@/hooks/useStore";
import { useMemo } from "react";
import { useGetUserProfile } from "@/features/auth/controllers";
import ApprovalDisplay, { ApprovalInfo } from "components/ApprovalDisplay";

export default function ViewFundRequestActivity() {
  const searchParams = useSearchParams();
  const currentUser = useAppSelector((state) => state.auth.user);
  const { data: profile } = useGetUserProfile();
  const id = searchParams?.get("fundRequestId");

  const { data: fundRequest, isLoading } = useGetSingleFundRequest(
    id ? id : skipToken
  );

  const { data: project } = useGetSingleProject(fundRequest?.data.project?.id || skipToken);

  // Calculate permissions based on current user and fund request status
  const permissions = useMemo(() => {
    if (!fundRequest || !profile?.data?.id) return {
      canReview: false,
      canLocationReview: false,
      canLocationAuthorize: false,
      canStateReview: false,
      canStateAuthorize: false,
      canReject: false,
    };

    const userId = profile.data.id;
    const request = fundRequest.data;
    console.log({ userId, request: request });

    return {
      canReview: false, // No longer used - location office does initial review
      canLocationReview:
        userId === request.location_reviewer && request.status === "PENDING",
      canLocationAuthorize:
        userId === request.location_authorizer &&
        request.status === "LOCATION_REVIEWED",
      canStateReview: false, // No state review - goes directly to HQ
      canStateAuthorize: false, // No state authorization - goes directly to HQ
      canReject:
        request.status !== "REJECTED" &&
        request.status !== "HQ_APPROVED" &&
        (userId === request.location_reviewer ||
          userId === request.location_authorizer) &&
        ["PENDING", "LOCATION_REVIEWED", "LOCATION_AUTHORIZED"].includes(request.status),
    };
  }, [fundRequest, profile?.data?.id]);

  // Generate basic approval information
  const approvalHistory: ApprovalInfo[] = useMemo(() => {
    if (!fundRequest?.data) return [];

    const data = fundRequest.data;
    const approvals: ApprovalInfo[] = [];

    // Creator
    if (data.created_by) {
      approvals.push({
        id: "creator",
        name: "Request Creator",
        position: "Fund Request Initiator",
        status: "APPROVED",
        level: "Creation",
        creationDate: data.created_datetime,
        approvalDate: data.created_datetime,
        comments: "Fund request created and submitted for review"
      });
    }

    return approvals;
  }, [fundRequest]);

  console.log({ permissions, fundRequest, currentUser, profile });

  return (
    <Card className='py-16'>
      <div className='flex flex-col items-center'>
        <img src={(logoPng as any).src || logoPng} alt='logo' width={150} />
        <h4 className='mt-5 text-lg font-bold'>
          Achieving Health Nigeria Initiative (AHNI)
        </h4>

        <h4 className='text-red-500 font-bold mt-2'>
          {fundRequest?.data.project?.title || 'Project Title'}
        </h4>
      </div>

      <div className='border-[#DEA004] border-solid border-[2px] rounded-lg p-5 grid grid-cols-3 gap-8 mt-10'>
        <div className='space-y-3'>
          <h3 className='font-semibold'>Location:</h3>

          <p className='text-sm font-semibold text-[#DEA004]'>
            {fundRequest?.data.location?.name || fundRequest?.data.location || 'N/A'}
          </p>
        </div>

        <div className='space-y-3'>
          <h3 className='font-semibold'>ID Code/Project Code:</h3>

          <p className='text-sm text-gray-500'>{project?.data?.project_id || 'N/A'}</p>
        </div>

        <div className='space-y-3'>
          <h3 className='font-semibold'>Unique Identifier Code</h3>

          <p className='text-sm text-gray-500'>{fundRequest?.data?.uuid_code || 'N/A'}</p>
        </div>

        <div className='space-y-3'>
          <h3 className='font-semibold'>Award/Project Title:</h3>

          <p className='text-sm font-semibold text-[#DEA004]'>
            {fundRequest?.data.project?.title || 'Project Title'}
          </p>
        </div>

        <div className='space-y-3'>
          <h3 className='font-semibold'>Award/Project ID</h3>

          <p className='text-sm text-gray-500'>{project?.data?.project_id || 'N/A'}</p>
        </div>

        <div className='space-y-3'>
          <h3 className='font-semibold'>Currency</h3>

          <p className='text-sm text-gray-500'>{fundRequest?.data?.currency || 'N/A'}</p>
        </div>

        <div className='space-y-3'>
          <h3 className='font-semibold'>Month</h3>

          <p className='text-sm text-gray-500'>{fundRequest?.data?.month || 'N/A'}</p>
        </div>

        <div className='space-y-3'>
          <h3 className='font-semibold'>Project Start Date</h3>

          <p className='text-sm text-gray-500'>{project?.data?.start_date || 'N/A'}</p>
        </div>

        <div className='space-y-3'>
          <h3 className='font-semibold'>Project End Date</h3>

          <p className='text-sm text-gray-500'>{project?.data?.end_date || 'N/A'}</p>
        </div>
      </div>

      <h2 className='text-gray-700 font-bold text-center my-8 text-lg'>
        Fund Request Details
      </h2>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        fundRequest && (
          <FundActivityTable
            data={fundRequest.data.activities}
            availableBalance={fundRequest.data.available_balance}
            currency={fundRequest.data.currency}
          />
        )
      )}

      {/* Approval History Section */}
      {approvalHistory.length > 0 && (
        <div className='mt-8'>
          <ApprovalDisplay
            approvals={approvalHistory}
            title="Approval History & Status"
            showTimeline={true}
            className="border-0 p-0"
          />
        </div>
      )}

      {/* Approval Workflow Section */}
      {fundRequest && (
        <div className='mt-8'>
          <FundRequestWorkflowStatus
            fundRequestId={fundRequest.data.id}
            currentStatus={fundRequest.data.status}
            canReview={permissions.canReview}
            canLocationReview={permissions.canLocationReview}
            canLocationAuthorize={permissions.canLocationAuthorize}
            canStateReview={permissions.canStateReview}
            canStateAuthorize={permissions.canStateAuthorize}
            canReject={permissions.canReject}
          />
        </div>
      )}
    </Card>
  );
}
