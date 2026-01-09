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
import { useGetUserProfile, useGetAllUsers } from "@/features/auth/controllers";
import ApprovalDisplay, { ApprovalInfo } from "components/ApprovalDisplay";
import { Button } from "components/ui/button";
import { Download, FileText, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ViewFundRequestActivity() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUser = useAppSelector((state) => state.auth.user);
  const { data: profile } = useGetUserProfile();
  const { data: usersData } = useGetAllUsers({ page: 1, size: 1000, search: "" });
  const id = searchParams?.get("fundRequestId");

  const { data: fundRequest, isLoading } = useGetSingleFundRequest(
    id ? id : skipToken
  );

  const { data: project } = useGetSingleProject(fundRequest?.data.project?.id || skipToken);

  // Helper function to get user details by ID
  const getUserDetails = (userId: string | null) => {
    if (!userId || !usersData?.data?.results) return null;
    return usersData.data.results.find((user: any) => user.id === userId);
  };

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
      canStateReview: false, // State review removed
      canStateAuthorize: false, // State authorize removed
      canReject:
        request.status !== "REJECTED" &&
        request.status !== "HQ_APPROVED" &&
        (userId === request.location_reviewer ||
          userId === request.location_authorizer) &&
        ["PENDING", "LOCATION_REVIEWED"].includes(request.status),
    };
  }, [fundRequest, profile?.data?.id]);

  // Generate comprehensive approval information
  const approvalHistory: ApprovalInfo[] = useMemo(() => {
    if (!fundRequest?.data) return [];

    const data = fundRequest.data;
    const approvals: ApprovalInfo[] = [];

    // Creator
    if (data.created_by) {
      const creatorDetails = getUserDetails(data.created_by);
      approvals.push({
        id: "creator",
        name: creatorDetails ? `${creatorDetails.first_name} ${creatorDetails.last_name}` : "Request Creator",
        position: "Fund Request Initiator",
        status: "APPROVED",
        level: "Creation",
        email: creatorDetails?.email,
        creationDate: data.created_datetime,
        approvalDate: data.created_datetime,
        signDate: data.created_datetime,
        comments: "Fund request created and submitted for review"
      });
    }

    // Location Reviewer
    if (data.location_reviewer) {
      const reviewerDetails = getUserDetails(data.location_reviewer);
      const isLocationReviewed = ["LOCATION_REVIEWED", "LOCATION_AUTHORIZED", "HQ_REVIEWED", "HQ_AUTHORIZED", "HQ_APPROVED"].includes(data.status);
      approvals.push({
        id: "location_reviewer",
        name: reviewerDetails ? `${reviewerDetails.first_name} ${reviewerDetails.last_name}` : "Location Reviewer",
        position: "Location Level Review",
        status: isLocationReviewed ? "APPROVED" : data.status === "REJECTED" ? "REJECTED" : "PENDING",
        level: "Location Review",
        email: reviewerDetails?.email,
        signDate: isLocationReviewed ? data.updated_datetime : null,
        comments: isLocationReviewed ? "Fund request reviewed at location level" : "Awaiting location review"
      });
    }

    // Location Authorizer
    if (data.location_authorizer) {
      const authorizerDetails = getUserDetails(data.location_authorizer);
      const isLocationAuthorized = ["LOCATION_AUTHORIZED", "HQ_REVIEWED", "HQ_AUTHORIZED", "HQ_APPROVED"].includes(data.status);
      const isLocationReviewed = ["LOCATION_REVIEWED", "LOCATION_AUTHORIZED", "HQ_REVIEWED", "HQ_AUTHORIZED", "HQ_APPROVED"].includes(data.status);
      approvals.push({
        id: "location_authorizer",
        name: authorizerDetails ? `${authorizerDetails.first_name} ${authorizerDetails.last_name}` : "Location Authorizer",
        position: "Location Level Authorization",
        status: isLocationAuthorized ? "APPROVED" : data.status === "REJECTED" ? "REJECTED" : !isLocationReviewed ? "UNDER_REVIEW" : "PENDING",
        level: "Location Authorization",
        email: authorizerDetails?.email,
        signDate: isLocationAuthorized ? data.updated_datetime : null,
        comments: isLocationAuthorized ? "Fund request authorized at location level" : !isLocationReviewed ? "Waiting for location review" : "Awaiting location authorization"
      });
    }

    // State Reviewer and State Authorizer removed - workflow now goes directly to HQ

    // HQ Reviewer
    if (data.hq_reviewer) {
      const hqReviewerDetails = getUserDetails(data.hq_reviewer);
      const isHQReviewed = ["HQ_REVIEWED", "HQ_AUTHORIZED", "HQ_APPROVED"].includes(data.status);
      const isLocationAuthorized = ["LOCATION_AUTHORIZED", "HQ_REVIEWED", "HQ_AUTHORIZED", "HQ_APPROVED"].includes(data.status);
      approvals.push({
        id: "hq_reviewer",
        name: hqReviewerDetails ? `${hqReviewerDetails.first_name} ${hqReviewerDetails.last_name}` : "HQ Reviewer",
        position: "Headquarters Review",
        status: isHQReviewed ? "APPROVED" : data.status === "REJECTED" ? "REJECTED" : !isLocationAuthorized ? "UNDER_REVIEW" : "PENDING",
        level: "HQ Review",
        email: hqReviewerDetails?.email,
        comments: isHQReviewed ? "Fund request reviewed at headquarters level" : !isLocationAuthorized ? "Waiting for location authorization" : "Awaiting HQ review",
        signDate: isHQReviewed ? data.updated_datetime : null
      });
    }

    // HQ Authorizer
    if (data.hq_authorizer) {
      const hqAuthorizerDetails = getUserDetails(data.hq_authorizer);
      const isHQAuthorized = ["HQ_AUTHORIZED", "HQ_APPROVED"].includes(data.status);
      const isHQReviewed = ["HQ_REVIEWED", "HQ_AUTHORIZED", "HQ_APPROVED"].includes(data.status);
      approvals.push({
        id: "hq_authorizer",
        name: hqAuthorizerDetails ? `${hqAuthorizerDetails.first_name} ${hqAuthorizerDetails.last_name}` : "HQ Authorizer",
        position: "Headquarters Authorization",
        status: isHQAuthorized ? "APPROVED" : data.status === "REJECTED" ? "REJECTED" : !isHQReviewed ? "UNDER_REVIEW" : "PENDING",
        level: "HQ Authorization",
        email: hqAuthorizerDetails?.email,
        comments: isHQAuthorized ? "Fund request authorized at headquarters level" : !isHQReviewed ? "Waiting for HQ review" : "Awaiting HQ authorization",
        signDate: isHQAuthorized ? data.updated_datetime : null
      });
    }

    // HQ Approver (Final Approval)
    if (data.hq_approver) {
      const hqApproverDetails = getUserDetails(data.hq_approver);
      const isHQApproved = data.status === "HQ_APPROVED";
      const isHQAuthorized = ["HQ_AUTHORIZED", "HQ_APPROVED"].includes(data.status);
      approvals.push({
        id: "hq_approver",
        name: hqApproverDetails ? `${hqApproverDetails.first_name} ${hqApproverDetails.last_name}` : "HQ Approver",
        position: "Final Approval",
        status: isHQApproved ? "APPROVED" : data.status === "REJECTED" ? "REJECTED" : !isHQAuthorized ? "UNDER_REVIEW" : "PENDING",
        level: "Final Approval",
        email: hqApproverDetails?.email,
        comments: isHQApproved ? "Fund request fully approved and ready for disbursement" : !isHQAuthorized ? "Waiting for HQ authorization" : "Awaiting final approval",
        signDate: isHQApproved ? data.updated_datetime : null
      });
    }

    return approvals;
  }, [fundRequest, usersData]);

  console.log('=== APPROVAL WORKFLOW DEBUG ===');
  console.log('Current User ID:', profile?.data?.id);
  console.log('Fund Request Status:', fundRequest?.data?.status);
  console.log('Permissions:', permissions);
  console.log('Fund Request Data:', {
    location_reviewer: fundRequest?.data?.location_reviewer,
    location_authorizer: fundRequest?.data?.location_authorizer,
  });
  console.log('Should show workflow:', fundRequest && fundRequest.data.status !== "HQ_APPROVED");
  console.log({ permissions, fundRequest, currentUser, profile });

  // Download functionality
  const handleDownload = () => {
    if (!fundRequest?.data) return;

    const data = fundRequest.data;
    const state = typeof data.location === 'object' ? data.location?.state : 'Unknown State';

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fund Request - ${data.project?.title || 'Project'} - ${state}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .header img { max-width: 150px; }
          .header h1 { color: #000; margin: 10px 0; }
          .header h2 { color: #dc2626; margin: 5px 0; }
          .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; border: 2px solid #DEA004; padding: 20px; border-radius: 8px; }
          .info-item h3 { font-weight: bold; margin-bottom: 8px; }
          .info-item p { color: #666; margin: 0; }
          .info-item .highlight { color: #DEA004; font-weight: bold; }
          .section-title { text-align: center; font-weight: bold; font-size: 18px; margin: 30px 0 20px; color: #374151; }
          .activity-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .activity-table th, .activity-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .activity-table th { background-color: #f5f5f5; font-weight: bold; }
          .approval-section { margin: 30px 0; }
          .approval-item { margin: 15px 0; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
          .approval-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
          .approval-status { padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; }
          .status-approved { background-color: #dcfce7; color: #166534; }
          .status-pending { background-color: #fef3c7; color: #92400e; }
          .status-under-review { background-color: #dbeafe; color: #1e40af; }
          .status-rejected { background-color: #fecaca; color: #991b1b; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Achieving Health Nigeria Initiative (AHNI)</h1>
          <h2>${data.project?.title || 'Project Title'}</h2>
          <p><strong>Downloaded on:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>State:</strong> ${state}</p>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <h3>Location:</h3>
            <p class="highlight">${typeof data.location === 'object' ? data.location?.name : data.location || 'N/A'}</p>
          </div>
          <div class="info-item">
            <h3>Project Code:</h3>
            <p>${project?.data?.project_id || 'N/A'}</p>
          </div>
          <div class="info-item">
            <h3>Unique Identifier:</h3>
            <p>${data.uuid_code || 'N/A'}</p>
          </div>
          <div class="info-item">
            <h3>Currency:</h3>
            <p>${data.currency || 'N/A'}</p>
          </div>
          <div class="info-item">
            <h3>Month:</h3>
            <p>${data.month || 'N/A'}</p>
          </div>
          <div class="info-item">
            <h3>Status:</h3>
            <p class="highlight">${data.status || 'N/A'}</p>
          </div>
        </div>

        <h2 class="section-title">Fund Request Activities</h2>
        <table class="activity-table">
          <thead>
            <tr>
              <th>Activity</th>
              <th>Description</th>
              <th>Budget Code</th>
              <th>Amount (${data.currency})</th>
            </tr>
          </thead>
          <tbody>
            ${data.activities?.map(activity => `
              <tr>
                <td>${activity.activity || 'N/A'}</td>
                <td>${activity.description || 'N/A'}</td>
                <td>${activity.budget_code || 'N/A'}</td>
                <td>${Number(activity.amount || 0).toLocaleString()}</td>
              </tr>
            `).join('') || '<tr><td colspan="4">No activities found</td></tr>'}
            <tr style="font-weight: bold; background-color: #f9fafb;">
              <td colspan="3">Total Amount</td>
              <td>${Number(data.activities?.reduce((sum, act) => sum + Number(act.amount || 0), 0) || 0).toLocaleString()} ${data.currency}</td>
            </tr>
          </tbody>
        </table>

        <div class="approval-section">
          <h2 class="section-title">Approval History & Status</h2>
          ${approvalHistory.map(approval => `
            <div class="approval-item">
              <div class="approval-header">
                <div>
                  <strong>${approval.name}</strong> - ${approval.position}
                </div>
                <span class="approval-status status-${approval.status.toLowerCase().replace('_', '-')}">${approval.status}</span>
              </div>
              <p><strong>Level:</strong> ${approval.level}</p>
              <p><strong>Comments:</strong> ${approval.comments}</p>
            </div>
          `).join('')}
        </div>

        <div style="margin-top: 50px; text-align: center; color: #666; font-size: 12px;">
          <p>Generated by AHNI Fund Request System - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    // Trigger print dialog
    printWindow.focus();
    printWindow.print();
  };

  // Download as file
  const handleDownloadFile = () => {
    if (!fundRequest?.data) return;

    const data = fundRequest.data;
    const state = typeof data.location === 'object' ? data.location?.state : 'Unknown State';
    const fileName = `fund-request-${state.replace(/\s+/g, '-').toLowerCase()}-${data.uuid_code || 'unknown'}-${new Date().toISOString().split('T')[0]}.txt`;

    const content = `
ACHIEVING HEALTH NIGERIA INITIATIVE (AHNI)
FUND REQUEST DETAILS - ${state.toUpperCase()}

Project: ${data.project?.title || 'N/A'}
Location: ${typeof data.location === 'object' ? data.location?.name : data.location || 'N/A'}
State: ${state}
Project Code: ${project?.data?.project_id || 'N/A'}
Unique Identifier: ${data.uuid_code || 'N/A'}
Currency: ${data.currency || 'N/A'}
Month: ${data.month || 'N/A'}
Status: ${data.status || 'N/A'}
Available Balance: ${Number(data.available_balance || 0).toLocaleString()} ${data.currency}

FUND REQUEST ACTIVITIES:
${data.activities?.map((activity, index) => `
${index + 1}. Activity: ${activity.activity || 'N/A'}
   Description: ${activity.description || 'N/A'}
   Budget Code: ${activity.budget_code || 'N/A'}
   Amount: ${Number(activity.amount || 0).toLocaleString()} ${data.currency}
`).join('') || 'No activities found'}

Total Amount: ${Number(data.activities?.reduce((sum, act) => sum + Number(act.amount || 0), 0) || 0).toLocaleString()} ${data.currency}

APPROVAL HISTORY:
${approvalHistory.map(approval => `
- ${approval.name} (${approval.position})
  Level: ${approval.level}
  Status: ${approval.status}
  Comments: ${approval.comments}
`).join('')}

Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className='py-16'>
      {/* Back Button */}
      <div className='mb-6 px-6'>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <div className='flex flex-col items-center'>
        <img src={(logoPng as any).src || logoPng} alt='logo' width={150} />
        <h4 className='mt-5 text-lg font-bold'>
          Achieving Health Nigeria Initiative (AHNI)
        </h4>

        <h4 className='text-red-500 font-bold mt-2'>
          {fundRequest?.data.project?.title || 'Project Title'}
        </h4>

        {/* Download Buttons */}
        <div className='flex gap-4 mt-6'>
          <Button onClick={handleDownload} variant="outline" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Print/Save as PDF
          </Button>
          <Button onClick={handleDownloadFile} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Report
          </Button>
        </div>
      </div>

      <div className='border-[#DEA004] border-solid border-[2px] rounded-lg p-5 grid grid-cols-3 gap-8 mt-10'>
        <div className='space-y-3'>
          <h3 className='font-semibold'>Location:</h3>

          <p className='text-sm font-semibold text-[#DEA004]'>
            {typeof fundRequest?.data.location === 'object' ? fundRequest?.data.location?.name : fundRequest?.data.location || 'N/A'}
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

      {/* Approval History Section - Formal Signature Table */}
      {approvalHistory.length > 0 && (
        <div className='mt-8'>
          <h2 className='text-lg font-bold text-center mb-6'>Approval History & Status</h2>

          {/* AHNI ACE PROJECT HEAD OFFICE AUTHORIZATION */}
          <div className='border-2 border-black mb-6'>
            <div className='bg-gray-100 text-center font-bold py-2 border-b border-black'>
              AHNI ACE PROJECT {typeof fundRequest?.data.location === 'object' ? (fundRequest?.data.location?.name || 'HEAD OFFICE').toUpperCase() : (fundRequest?.data.location || 'HEAD OFFICE').toUpperCase()} AUTHORIZATION
            </div>
            <table className='w-full border-collapse'>
              <tr>
                <td className='border-r border-black p-4 w-1/3'>
                  <div className='space-y-2'>
                    <div className='font-bold'>Prepared By:</div>
                    <div className='text-sm'>{approvalHistory.find(a => a.id === 'creator')?.name || 'N/A'}</div>
                  </div>
                </td>
                <td className='border-r border-black p-4 w-1/3'>
                  <div className='space-y-2'>
                    <div className='font-bold'>Reviewed By:</div>
                    <div className='text-sm'>{approvalHistory.find(a => a.id === 'location_reviewer')?.name || 'N/A'}</div>
                  </div>
                </td>
                <td className='p-4 w-1/3'>
                  <div className='space-y-2'>
                    <div className='font-bold'>Authorised By:</div>
                    <div className='text-sm'>{approvalHistory.find(a => a.id === 'location_authorizer')?.name || 'N/A'}</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className='border-r border-t border-black p-4'>
                  <div className='space-y-4'>
                    <div className='font-bold'>Sign & Date:</div>
                    <div className='h-16 flex items-center'>
                      {(() => {
                        const approval = approvalHistory.find(a => a.id === 'creator');
                        const signDate = (approval as any)?.signDate;
                        return signDate ?
                          new Date(signDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : '_________________';
                      })()}
                    </div>
                    <div className='text-xs text-gray-600'>
                      Status: {approvalHistory.find(a => a.id === 'creator')?.status || 'N/A'}
                    </div>
                  </div>
                </td>
                <td className='border-r border-t border-black p-4'>
                  <div className='space-y-4'>
                    <div className='font-bold'>Sign & Date:</div>
                    <div className='h-16 flex items-center'>
                      {(() => {
                        const approval = approvalHistory.find(a => a.id === 'location_reviewer');
                        const signDate = (approval as any)?.signDate;
                        return signDate ?
                          new Date(signDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : '_________________';
                      })()}
                    </div>
                    <div className='text-xs text-gray-600'>
                      Status: {approvalHistory.find(a => a.id === 'location_reviewer')?.status || 'N/A'}
                    </div>
                  </div>
                </td>
                <td className='border-t border-black p-4'>
                  <div className='space-y-4'>
                    <div className='font-bold'>Sign & Date:</div>
                    <div className='h-16 flex items-center'>
                      {(() => {
                        const approval = approvalHistory.find(a => a.id === 'location_authorizer');
                        const signDate = (approval as any)?.signDate;
                        return signDate ?
                          new Date(signDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : '_________________';
                      })()}
                    </div>
                    <div className='text-xs text-gray-600'>
                      Status: {approvalHistory.find(a => a.id === 'location_authorizer')?.status || 'N/A'}
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          {/* AHNI HEAD OFFICE ABUJA APPROVAL */}
          <div className='border-2 border-black'>
            <div className='bg-gray-100 text-center font-bold py-2 border-b border-black'>
              AHNI HEAD OFFICE ABUJA APPROVAL
            </div>
            <table className='w-full border-collapse'>
              <tr>
                <td className='border-r border-black p-4 w-1/3'>
                  <div className='space-y-2'>
                    <div className='font-bold'>Reviewed By:</div>
                    <div className='text-sm'>{approvalHistory.find(a => a.id === 'hq_reviewer')?.name || 'N/A'}</div>
                  </div>
                </td>
                <td className='border-r border-black p-4 w-1/3'>
                  <div className='space-y-2'>
                    <div className='font-bold'>Authorised By:</div>
                    <div className='text-sm'>{approvalHistory.find(a => a.id === 'hq_authorizer')?.name || 'N/A'}</div>
                  </div>
                </td>
                <td className='p-4 w-1/3'>
                  <div className='space-y-2'>
                    <div className='font-bold'>Approved By:</div>
                    <div className='text-sm'>{approvalHistory.find(a => a.id === 'hq_approver')?.name || 'N/A'}</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className='border-r border-t border-black p-4'>
                  <div className='space-y-4'>
                    <div className='font-bold'>Sign & Date:</div>
                    <div className='h-16 flex items-center'>
                      {(() => {
                        const approval = approvalHistory.find(a => a.id === 'hq_reviewer');
                        const signDate = (approval as any)?.signDate;
                        return signDate ?
                          new Date(signDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : '_________________';
                      })()}
                    </div>
                    <div className='text-xs text-gray-600'>
                      Status: {approvalHistory.find(a => a.id === 'hq_reviewer')?.status || 'N/A'}
                    </div>
                  </div>
                </td>
                <td className='border-r border-t border-black p-4'>
                  <div className='space-y-4'>
                    <div className='font-bold'>Sign & Date:</div>
                    <div className='h-16 flex items-center'>
                      {(() => {
                        const approval = approvalHistory.find(a => a.id === 'hq_authorizer');
                        const signDate = (approval as any)?.signDate;
                        return signDate ?
                          new Date(signDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : '_________________';
                      })()}
                    </div>
                    <div className='text-xs text-gray-600'>
                      Status: {approvalHistory.find(a => a.id === 'hq_authorizer')?.status || 'N/A'}
                    </div>
                  </div>
                </td>
                <td className='border-t border-black p-4'>
                  <div className='space-y-4'>
                    <div className='font-bold'>Sign & Date:</div>
                    <div className='h-16 flex items-center'>
                      {(() => {
                        const approval = approvalHistory.find(a => a.id === 'hq_approver');
                        const signDate = (approval as any)?.signDate;
                        return signDate ?
                          new Date(signDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : '_________________';
                      })()}
                    </div>
                    <div className='text-xs text-gray-600'>
                      Status: {approvalHistory.find(a => a.id === 'hq_approver')?.status || 'N/A'}
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      )}

      {/* Approval Workflow Section - Hidden when fully approved */}
      {fundRequest && fundRequest.data.status !== "HQ_APPROVED" && (
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
