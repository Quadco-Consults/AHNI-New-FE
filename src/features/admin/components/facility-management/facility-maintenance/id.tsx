"use client";

import BackNavigation from "components/atoms/BackNavigation";
import { Card } from "components/ui/card";
import { useParams } from "next/navigation";
import DescriptionCard from "components/DescriptionCard";
import {
  useGetSingleFacilityMaintenanceQuery,
  useReviewFacilityMaintenance,
  useAuthorizeFacilityMaintenance,
  useApproveFacilityMaintenance,
} from "@/features/admin/controllers/facilityMaintenanceController";
import { LoadingSpinner } from "components/Loading";
import { Textarea } from "components/ui/textarea";
import { Button } from "components/ui/button";
import FormButton from "@/components/FormButton";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { formatNumberCurrency } from "utils/utls";
import { Download, FileText } from "lucide-react";

export default function ViewFacilityMaintenance() {
  const { id } = useParams();

  const [comments, setComments] = useState("");
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [approvalAction, setApprovalAction] = useState<
    "review" | "authorize" | "approve" | null
  >(null);

  const {
    data: facilityMaintenance,
    isLoading,
    refetch,
  } = useGetSingleFacilityMaintenanceQuery(id as string, !!id);

  const {
    reviewFacilityMaintenance,
    isLoading: isReviewing,
    isSuccess: reviewSuccess,
  } = useReviewFacilityMaintenance(id as string);

  const {
    authorizeFacilityMaintenance,
    isLoading: isAuthorizing,
    isSuccess: authorizeSuccess,
  } = useAuthorizeFacilityMaintenance(id as string);

  const {
    approveFacilityMaintenance,
    isLoading: isApproving,
    isSuccess: approveSuccess,
  } = useApproveFacilityMaintenance(id as string);

  const currentStatus = facilityMaintenance?.data?.status;

  const handleApproval = async () => {
    if (!comments.trim()) {
      toast.error("Please enter approval comments");
      return;
    }

    try {
      const payload = { comments: comments.trim() };

      switch (approvalAction) {
        case "review":
          await reviewFacilityMaintenance(payload);
          break;
        case "authorize":
          await authorizeFacilityMaintenance(payload);
          break;
        case "approve":
          await approveFacilityMaintenance(payload);
          break;
      }
    } catch (error) {
      console.error("Approval failed:", error);
      toast.error("Failed to process approval. Please try again.");
    }
  };

  const openApprovalForm = (action: "review" | "authorize" | "approve") => {
    setApprovalAction(action);
    setShowApprovalForm(true);
    setComments("");
  };

  const closeApprovalForm = () => {
    setShowApprovalForm(false);
    setApprovalAction(null);
    setComments("");
  };

  // Handle success for all approval actions
  useEffect(() => {
    if (reviewSuccess || authorizeSuccess || approveSuccess) {
      closeApprovalForm();
      refetch(); // Refresh data to show updated status
    }
  }, [reviewSuccess, authorizeSuccess, approveSuccess, refetch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Reviewed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Authorized":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getNextAction = () => {
    switch (currentStatus) {
      case "Pending":
        return {
          action: "review",
          label: "Review",
          color: "bg-blue-500 hover:bg-blue-600",
        };
      case "Reviewed":
        return {
          action: "authorize",
          label: "Authorize",
          color: "bg-purple-500 hover:bg-purple-600",
        };
      case "Authorized":
        return {
          action: "approve",
          label: "Approve",
          color: "bg-green-500 hover:bg-green-600",
        };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  console.log({ facilityMaintenance, currentStatus });

  const generatePDF = () => {
    if (!facilityMaintenance?.data) return;

    const data = facilityMaintenance.data;
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      toast.error("Please allow popups to generate PDF");
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Facility Maintenance Request - ${data.facility?.name || 'N/A'}</title>
          <style>
            @page { size: A4; margin: 15mm; }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.5;
              color: #1F2937;
              max-width: 210mm;
              margin: 0 auto;
              background: white;
            }
            .page-wrapper {
              padding: 15px;
              background: white;
            }
            .header {
              background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%);
              padding: 25px;
              border-radius: 10px 10px 0 0;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              margin-bottom: 25px;
            }
            .header-content {
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .logo-section {
              background: white;
              padding: 10px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .logo {
              width: 80px;
              height: auto;
              display: block;
            }
            .company-info {
              flex: 1;
              text-align: center;
              padding: 0 20px;
            }
            .company-name {
              font-size: 22px;
              font-weight: 700;
              color: white;
              margin: 0 0 5px 0;
              letter-spacing: 1.5px;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            .company-tagline {
              font-size: 11px;
              color: #FEE2E2;
              font-weight: 500;
              letter-spacing: 0.5px;
            }
            .status-badge {
              background: white;
              padding: 10px 20px;
              border-radius: 25px;
              font-weight: 700;
              font-size: 13px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
              ${data.status === 'Approved' ?
                'color: #065F46; border: 2px solid #10B981;' :
                'color: #92400E; border: 2px solid #F59E0B;'
              }
            }
            .document-title {
              text-align: center;
              font-size: 18px;
              font-weight: 700;
              margin: 20px 0;
              padding: 12px;
              background: linear-gradient(to right, #FEE2E2, #FECACA, #FEE2E2);
              color: #991B1B;
              border-radius: 6px;
              text-transform: uppercase;
              letter-spacing: 2px;
              border-left: 4px solid #DC2626;
              border-right: 4px solid #DC2626;
            }
            .info-section {
              margin: 20px 0;
              border: 1px solid #E5E7EB;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            .section-title {
              font-size: 14px;
              font-weight: 700;
              color: white;
              background: linear-gradient(135deg, #DC2626, #B91C1C);
              padding: 10px 15px;
              margin: 0;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .section-content {
              padding: 15px;
              background: white;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
            }
            .info-item {
              padding: 12px;
              background: linear-gradient(to bottom, #F9FAFB, #FFFFFF);
              border: 1px solid #E5E7EB;
              border-radius: 6px;
              border-left: 3px solid #DC2626;
              transition: all 0.2s;
            }
            .info-item:hover {
              box-shadow: 0 2px 4px rgba(220, 38, 38, 0.1);
              border-left-width: 4px;
            }
            .info-label {
              font-weight: 600;
              font-size: 11px;
              color: #6B7280;
              text-transform: uppercase;
              letter-spacing: 0.8px;
              margin-bottom: 6px;
            }
            .info-value {
              font-size: 13px;
              color: #1F2937;
              font-weight: 500;
            }
            .full-width {
              grid-column: span 2;
            }
            .highlight-item {
              background: linear-gradient(135deg, #FEF3C7, #FDE68A) !important;
              border-left-color: #F59E0B !important;
              border-left-width: 4px !important;
            }
            .highlight-item .info-value {
              font-size: 18px;
              font-weight: 700;
              color: #92400E;
            }
            .approval-history {
              margin-top: 20px;
              border: 1px solid #BFDBFE;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            .approval-header {
              background: linear-gradient(135deg, #3B82F6, #2563EB);
              color: white;
              padding: 10px 15px;
              font-weight: 700;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .approval-content {
              padding: 15px;
              background: #F0F9FF;
            }
            .approval-item {
              padding: 15px;
              background: white;
              margin-bottom: 12px;
              border-left: 4px solid #3B82F6;
              border-radius: 6px;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
            }
            .approval-level {
              display: inline-block;
              padding: 5px 14px;
              border-radius: 15px;
              font-size: 10px;
              font-weight: 700;
              margin-bottom: 10px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .level-review { background: linear-gradient(135deg, #DBEAFE, #BFDBFE); color: #1E40AF; border: 1px solid #3B82F6; }
            .level-authorize { background: linear-gradient(135deg, #E9D5FF, #D8B4FE); color: #6B21A8; border: 1px solid #A855F7; }
            .level-approve { background: linear-gradient(135deg, #D1FAE5, #A7F3D0); color: #065F46; border: 1px solid #10B981; }
            .approval-user {
              font-weight: 600;
              color: #1F2937;
              margin-bottom: 5px;
            }
            .approval-comments {
              margin-top: 10px;
              padding: 10px;
              background: #F9FAFB;
              border-radius: 4px;
              border-left: 2px solid #3B82F6;
              font-size: 12px;
              color: #4B5563;
            }
            .footer {
              margin-top: 30px;
              padding: 20px;
              background: linear-gradient(to right, #FEE2E2, #FECACA, #FEE2E2);
              border-top: 3px solid #DC2626;
              border-radius: 8px;
              text-align: center;
            }
            .footer-text {
              font-size: 11px;
              color: #991B1B;
              font-weight: 600;
              margin: 5px 0;
            }
            .print-date {
              text-align: center;
              font-size: 10px;
              color: #9CA3AF;
              margin-top: 15px;
              padding: 8px;
              background: #F9FAFB;
              border-radius: 4px;
            }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="page-wrapper">
            <div class="header">
              <div class="header-content">
                <div class="logo-section">
                  <img src="/imgs/logo.png" alt="AHNI Logo" class="logo" />
                </div>
                <div class="company-info">
                  <h1 class="company-name">ACHIEVING HEALTH NIGERIA INITIATIVE</h1>
                  <p class="company-tagline">(AHNI) - Excellence in Healthcare Delivery</p>
                </div>
                <div class="status-badge">${data.status || 'Pending'}</div>
              </div>
            </div>

            <h2 class="document-title">Facility Maintenance Request Form</h2>

            <div class="info-section">
              <h3 class="section-title">Request Information</h3>
              <div class="section-content">
                <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Request ID</div>
                <div class="info-value">${data.id?.substring(0, 8) || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Date Created</div>
                <div class="info-value">${format(new Date(data.created_datetime), 'dd-MMM-yyyy HH:mm')}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Requested By</div>
                <div class="info-value">${data.created_by?.full_name || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Department</div>
                <div class="info-value">${data.department?.name || 'N/A'}</div>
              </div>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h3 class="section-title">Facility Details</h3>
              <div class="section-content">
                <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Facility Name</div>
                <div class="info-value">${data.facility?.name || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Location</div>
                <div class="info-value">${data.location?.name || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Maintenance Type</div>
                <div class="info-value">${data.maintenance_type || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Maintenance Date</div>
                <div class="info-value">${data.maintenance_datetime ? format(new Date(data.maintenance_datetime), 'dd-MMM-yyyy') : 'N/A'}</div>
              </div>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h3 class="section-title">Cost Information</h3>
              <div class="section-content">
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Rate</div>
                    <div class="info-value">${formatNumberCurrency(data.rate, 'NGN')}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Cost Estimate</div>
                    <div class="info-value">${formatNumberCurrency(data.cost_estimate, 'NGN')}</div>
                  </div>
                  <div class="info-item full-width highlight-item">
                    <div class="info-label">Total Cost Estimate</div>
                    <div class="info-value">
                      ${formatNumberCurrency(data.total_cost_estimate, 'NGN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h3 class="section-title">Problem Description</h3>
              <div class="section-content">
                <div class="info-item full-width">
                  <div class="info-label">Type</div>
                  <div class="info-value">${data.description || 'N/A'}</div>
                </div>
                <div class="info-item full-width" style="margin-top: 12px;">
                  <div class="info-label">Details</div>
                  <div class="info-value">${data.problem_description || 'N/A'}</div>
                </div>
              </div>
            </div>

            ${data.approvals && data.approvals.length > 0 ? `
              <div class="approval-history">
                <h3 class="approval-header">Approval History</h3>
                <div class="approval-content">
              ${data.approvals.sort((a, b) =>
                new Date(a.created_datetime).getTime() - new Date(b.created_datetime).getTime()
              ).map(approval => `
                <div class="approval-item">
                  <span class="approval-level level-${approval.approval_level.toLowerCase()}">
                    ${approval.approval_level}
                  </span>
                  <div class="approval-user">
                    ${approval.user?.full_name || 'N/A'}
                    ${approval.user?.email ? `<span style="color: #6B7280; font-weight: 400;"> (${approval.user.email})</span>` : ''}
                    ${approval.user?.employee_id ? `<span style="color: #6B7280; font-weight: 400;"> - ID: ${approval.user.employee_id}</span>` : ''}
                  </div>
                  <div style="font-size: 11px; color: #9CA3AF;">
                    ${format(new Date(approval.created_datetime), 'dd-MMM-yyyy HH:mm')}
                  </div>
                  ${approval.comments ? `
                    <div class="approval-comments">
                      <strong style="font-size: 11px; color: #374151;">Comments:</strong>
                      <p style="margin: 5px 0 0 0;">${approval.comments}</p>
                    </div>
                  ` : ''}
                </div>
              `).join('')}
                </div>
              </div>
            ` : ''}

            <div class="footer">
              <p class="footer-text" style="font-size: 13px; font-weight: 700;">Achieving Health Nigeria Initiative (AHNI)</p>
              <p class="footer-text">Facility Management System - Maintenance Request Form</p>
              <p class="footer-text" style="font-style: italic;">This is a computer-generated document and does not require a signature.</p>
            </div>

            <div class="print-date">
              <strong>Generated on:</strong> ${format(new Date(), 'dd-MMM-yyyy HH:mm:ss')}
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 100);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className='space-y-4'>
      <BackNavigation extraText='View Facility Maintenance Ticket' />
      <Card className='p-6 mx-auto space-y-5'>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          facilityMaintenance && (
            <>
              {/* Status Badge */}
              <div className='flex justify-between items-center'>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    currentStatus || ""
                  )}`}
                >
                  Status: {currentStatus}
                </div>
                <div className='text-sm text-gray-500'>
                  Created:{" "}
                  {format(
                    new Date(facilityMaintenance.data.created_datetime),
                    "dd-MMM-yyyy HH:mm"
                  )}
                </div>
              </div>

              {/* Main Details */}
              <div className='grid grid-cols-3 gap-5 mb-6'>
                <DescriptionCard
                  label='Name of Staff'
                  description={`${facilityMaintenance?.data?.created_by?.full_name}`}
                />

                <DescriptionCard
                  label='Department'
                  description={
                    facilityMaintenance?.data.department?.name || "N/A"
                  }
                />

                <DescriptionCard
                  label='Location'
                  description={facilityMaintenance?.data.location?.name}
                />

                <DescriptionCard
                  label='Facility'
                  description={facilityMaintenance?.data.facility.name}
                />

                <DescriptionCard
                  label='Maintenance Type'
                  description={facilityMaintenance?.data.maintenance_type}
                />

                <DescriptionCard
                  label='Rate'
                  description={formatNumberCurrency(
                    facilityMaintenance?.data.rate,
                    "NGN"
                  )}
                />

                <DescriptionCard
                  label='Cost Estimate'
                  description={formatNumberCurrency(
                    facilityMaintenance?.data.cost_estimate,
                    "NGN"
                  )}
                />

                <DescriptionCard
                  label='Total Cost Estimate'
                  description={formatNumberCurrency(
                    facilityMaintenance?.data.total_cost_estimate,
                    "NGN"
                  )}
                />

                <DescriptionCard
                  label='Updated'
                  description={
                    facilityMaintenance?.data.updated_datetime
                      ? format(
                          new Date(facilityMaintenance.data.updated_datetime),
                          "dd-MMM-yyyy"
                        )
                      : "N/A"
                  }
                />
              </div>

              <DescriptionCard
                label='Description'
                description={facilityMaintenance?.data.description}
              />

              <DescriptionCard
                label='Description of Problem'
                description={facilityMaintenance?.data.problem_description}
              />

              {/* Approvals History */}
              {facilityMaintenance?.data.approvals &&
                facilityMaintenance.data.approvals.length > 0 && (
                  <div className='mt-6'>
                    <h3 className='text-lg font-semibold mb-3'>
                      Approval History
                    </h3>
                    <div className='space-y-3'>
                      {facilityMaintenance.data.approvals
                        .sort(
                          (a, b) =>
                            new Date(a.created_datetime).getTime() -
                            new Date(b.created_datetime).getTime()
                        )
                        .map((approval) => (
                          <div
                            key={approval.id}
                            className='bg-gray-50 p-4 rounded-lg border-l-4 border-l-blue-400'
                          >
                            <div className='flex justify-between items-start'>
                              <div className='flex-1'>
                                <div className='flex items-center gap-2 mb-2'>
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      approval.approval_level === "REVIEW"
                                        ? "bg-blue-100 text-blue-800"
                                        : approval.approval_level ===
                                          "AUTHORIZE"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    {approval.approval_level}
                                  </span>
                                </div>

                                {approval.user && (
                                  <div className='text-sm text-gray-700 mb-1'>
                                    <span className='font-medium'>
                                      {approval.approval_level === "REVIEW"
                                        ? "Reviewed by:"
                                        : approval.approval_level ===
                                          "AUTHORIZE"
                                        ? "Authorized by:"
                                        : "Approved by:"}
                                    </span>{" "}
                                    {approval.user.full_name}
                                    {approval.user.email && (
                                      <span className='text-gray-500 ml-2'>
                                        ({approval.user.email})
                                      </span>
                                    )}
                                    {approval.user.employee_id && (
                                      <span className='text-gray-500 ml-1'>
                                        - ID: {approval.user.employee_id}
                                      </span>
                                    )}
                                  </div>
                                )}

                                {approval.comments ? (
                                  <div className='mt-2'>
                                    <span className='text-sm font-medium text-gray-700'>
                                      Comments:
                                    </span>
                                    <p className='text-sm text-gray-600 mt-1 bg-white p-2 rounded border'>
                                      {approval.comments}
                                    </p>
                                  </div>
                                ) : (
                                  <p className='text-sm text-gray-500 italic'>
                                    No comments provided
                                  </p>
                                )}
                              </div>

                              <div className='text-right ml-4'>
                                <span className='text-xs text-gray-500'>
                                  {format(
                                    new Date(approval.created_datetime),
                                    "dd-MMM-yyyy"
                                  )}
                                </span>
                                <br />
                                <span className='text-xs text-gray-400'>
                                  {format(
                                    new Date(approval.created_datetime),
                                    "HH:mm"
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              {/* Approval Actions */}
              {nextAction && (
                <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                  <p className='text-sm text-blue-700 mb-3'>
                    This ticket is ready for {nextAction.label.toLowerCase()}.
                  </p>
                  <Button
                    onClick={() => openApprovalForm(nextAction.action as any)}
                    className={`${nextAction.color} text-white`}
                  >
                    {nextAction.label} Ticket
                  </Button>
                </div>
              )}

              {/* Approval Form Modal */}
              {showApprovalForm && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                  <Card className='p-6 w-96 max-w-md'>
                    <h3 className='text-lg font-semibold mb-4'>
                      {approvalAction === "review" && "Review Ticket"}
                      {approvalAction === "authorize" && "Authorize Ticket"}
                      {approvalAction === "approve" && "Approve Ticket"}
                    </h3>

                    <div className='space-y-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Comments *
                        </label>
                        <Textarea
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          placeholder='Enter your approval comments...'
                          rows={4}
                          className='w-full'
                        />
                      </div>

                      <div className='flex gap-3 justify-end'>
                        <Button
                          variant='outline'
                          onClick={closeApprovalForm}
                          disabled={isReviewing || isAuthorizing || isApproving}
                        >
                          Cancel
                        </Button>
                        <FormButton
                          onClick={handleApproval}
                          loading={isReviewing || isAuthorizing || isApproving}
                          disabled={!comments.trim()}
                          className={nextAction?.color}
                        >
                          Confirm {nextAction?.label}
                        </FormButton>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {currentStatus === "Approved" && (
                <div className='mt-6 space-y-4'>
                  <div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
                    <p className='text-green-700 font-medium'>
                      ✅ This maintenance ticket has been fully approved and can
                      proceed to execution.
                    </p>
                  </div>

                  {/* PDF Generation Buttons */}
                  <div className='flex gap-3'>
                    <Button
                      onClick={generatePDF}
                      className='bg-red-600 hover:bg-red-700 text-white flex items-center gap-2'
                    >
                      <FileText size={18} />
                      Generate PDF Form
                    </Button>
                    <Button
                      onClick={generatePDF}
                      variant='outline'
                      className='border-red-600 text-red-600 hover:bg-red-50 flex items-center gap-2'
                    >
                      <Download size={18} />
                      Download & Print
                    </Button>
                  </div>
                </div>
              )}
            </>
          )
        )}
      </Card>
    </div>
  );
}
