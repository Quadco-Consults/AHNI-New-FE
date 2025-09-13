"use client";

import React from "react";
import { Card } from "components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { Badge } from "components/ui/badge";
import { CheckCircle, Clock, User } from "lucide-react";
import { TFundRequestResponseData } from "@/features/programs/types/fund-request";

interface ApprovalSignatureData {
  preparedBy: string;
  preparedDate: string;
  reviewedBy: string | null;
  reviewedDate: string | null;
  authorizedBy: string | null;
  authorizedDate: string | null;
  approvedBy: string | null;
  approvedDate: string | null;
}

interface FundRequestApprovalSignatureFormProps {
  fundRequestData: TFundRequestResponseData;
  currentStatus: string;
  approvalHistory?: any[]; // This would contain the approval history with user info and timestamps
}

const FundRequestApprovalSignatureForm: React.FC<FundRequestApprovalSignatureFormProps> = ({
  fundRequestData,
  currentStatus,
  approvalHistory = []
}) => {
  // Extract approval data from fund request and approval history
  const getApprovalData = (): ApprovalSignatureData => {
    return {
      preparedBy: `${fundRequestData.created_by || "System User"}`, // Get from fund request creator
      preparedDate: new Date(fundRequestData.created_datetime).toLocaleDateString("en-US"),
      reviewedBy: currentStatus !== "PENDING" ? getApproverName("REVIEWED") : null,
      reviewedDate: currentStatus !== "PENDING" ? getApprovalDate("REVIEWED") : null,
      authorizedBy: ["ADMIN_APPROVED", "MANAGER_APPROVED"].includes(currentStatus) ? getApproverName("ADMIN_APPROVED") : null,
      authorizedDate: ["ADMIN_APPROVED", "MANAGER_APPROVED"].includes(currentStatus) ? getApprovalDate("ADMIN_APPROVED") : null,
      approvedBy: currentStatus === "MANAGER_APPROVED" ? getApproverName("MANAGER_APPROVED") : null,
      approvedDate: currentStatus === "MANAGER_APPROVED" ? getApprovalDate("MANAGER_APPROVED") : null,
    };
  };

  const getApproverName = (status: string): string => {
    // Get approver names from fund request data or approval history
    const projectId = fundRequestData.project?.project_id || "";
    const officeName = projectId.includes("ACE") ? "ACE" : 
                      projectId.includes("FYTN") ? "FYTN" : 
                      projectId.substring(0, 8).toUpperCase();
    
    switch (status) {
      case "REVIEWED":
        return `${officeName} Project Office`;
      case "ADMIN_APPROVED":
        return `${officeName} Project Head Office`;
      case "MANAGER_APPROVED":
        return "AHNI Head Office Abuja";
      default:
        return "";
    }
  };

  const getApprovalDate = (status: string): string => {
    // This would come from approval history timestamps
    // For now, return current date if status is reached
    if (
      (status === "REVIEWED" && currentStatus !== "PENDING") ||
      (status === "ADMIN_APPROVED" && ["ADMIN_APPROVED", "MANAGER_APPROVED"].includes(currentStatus)) ||
      (status === "MANAGER_APPROVED" && currentStatus === "MANAGER_APPROVED")
    ) {
      return new Date().toLocaleDateString("en-US");
    }
    return "";
  };

  const signatureData = getApprovalData();

  const getProjectOfficeName = () => {
    // Extract project office name from project data
    const projectId = fundRequestData.project?.project_id || "PROJECT";
    const projectTitle = fundRequestData.project?.title || "";
    
    // Format: AHNI [PROJECT_ID] PROJECT HEAD OFFICE AUTHORISATION
    // Example: AHNI ACE PROJECT HEAD OFFICE AUTHORISATION
    const officeName = projectId.includes("ACE") ? "ACE" : 
                      projectId.includes("FYTN") ? "FYTN" : 
                      projectId.toUpperCase();
    
    return `AHNI ${officeName} PROJECT HEAD OFFICE AUTHORISATION`;
  };

  const getStatusIcon = (stage: string) => {
    switch (stage) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStageStatus = (requiredStatus: string[]) => {
    if (requiredStatus.includes(currentStatus)) {
      return "completed";
    }
    if (currentStatus === "PENDING" && requiredStatus.includes("REVIEWED")) {
      return "pending";
    }
    if (currentStatus === "REVIEWED" && requiredStatus.includes("ADMIN_APPROVED")) {
      return "in_progress";
    }
    if (currentStatus === "ADMIN_APPROVED" && requiredStatus.includes("MANAGER_APPROVED")) {
      return "in_progress";
    }
    return "pending";
  };

  return (
    <div className="space-y-6">
      {/* Project Head Office Authorization Table */}
      <Card className="p-0">
        <div className="border-b bg-gray-50 px-4 py-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-center flex-1">
              {getProjectOfficeName()}
            </h3>
            {getStatusIcon(getStageStatus(["ADMIN_APPROVED", "MANAGER_APPROVED"]))}
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3 border-r font-semibold">Prepared By:</TableHead>
              <TableHead className="w-1/3 border-r font-semibold">Reviewed By:</TableHead>
              <TableHead className="w-1/3 font-semibold">Authorised By:</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="border-r p-2">
                <div className="text-sm font-medium">{signatureData.preparedBy}</div>
              </TableCell>
              <TableCell className="border-r p-2">
                <div className="text-sm font-medium">
                  {signatureData.reviewedBy || (
                    <span className="text-gray-400 italic">Pending Review</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="p-2">
                <div className="text-sm font-medium">
                  {signatureData.authorizedBy || (
                    <span className="text-gray-400 italic">Pending Authorization</span>
                  )}
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="border-r font-semibold">Sign & Date:</TableHead>
              <TableHead className="border-r font-semibold">Sign & Date:</TableHead>
              <TableHead className="font-semibold">Sign & Date:</TableHead>
            </TableRow>
            <TableRow>
              <TableCell className="border-r p-2 h-20 align-bottom">
                <div className="text-xs text-gray-600 mt-auto">
                  {signatureData.preparedDate}
                </div>
              </TableCell>
              <TableCell className="border-r p-2 h-20 align-bottom">
                <div className="text-xs text-gray-600 mt-auto">
                  {signatureData.reviewedDate || (
                    <span className="text-gray-400 italic">Pending</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="p-2 h-20 align-bottom">
                <div className="text-xs text-gray-600 mt-auto">
                  {signatureData.authorizedDate || (
                    <span className="text-gray-400 italic">Pending</span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      {/* AHNI Head Office Approval Table */}
      <Card className="p-0">
        <div className="border-b bg-gray-50 px-4 py-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-center flex-1">
              AHNI HEAD OFFICE ABUJA APPROVAL
            </h3>
            {getStatusIcon(getStageStatus(["MANAGER_APPROVED"]))}
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3 border-r font-semibold">Reviewed By:</TableHead>
              <TableHead className="w-1/3 border-r font-semibold">Authorised By:</TableHead>
              <TableHead className="w-1/3 font-semibold">Approved By:</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="border-r p-2">
                <div className="text-sm font-medium">AHNI HQ Reviewer</div>
              </TableCell>
              <TableCell className="border-r p-2">
                <div className="text-sm font-medium">AHNI HQ Authorizer</div>
              </TableCell>
              <TableCell className="p-2">
                <div className="text-sm font-medium">
                  {signatureData.approvedBy || (
                    <span className="text-gray-400 italic">Pending Final Approval</span>
                  )}
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="border-r font-semibold">Sign & Date:</TableHead>
              <TableHead className="border-r font-semibold">Sign & Date:</TableHead>
              <TableHead className="font-semibold">Sign & Date:</TableHead>
            </TableRow>
            <TableRow>
              <TableCell className="border-r p-2 h-20 align-bottom">
                <div className="text-xs text-gray-600 mt-auto">
                  <span className="text-gray-400 italic">System Signature</span>
                </div>
              </TableCell>
              <TableCell className="border-r p-2 h-20 align-bottom">
                <div className="text-xs text-gray-600 mt-auto">
                  <span className="text-gray-400 italic">System Signature</span>
                </div>
              </TableCell>
              <TableCell className="p-2 h-20 align-bottom">
                <div className="text-xs text-gray-600 mt-auto">
                  {signatureData.approvedDate || (
                    <span className="text-gray-400 italic">Pending</span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      {/* Status Summary */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold">Current Status</h4>
            <p className="text-sm text-gray-600">
              {currentStatus === "PENDING" && "Awaiting project office review"}
              {currentStatus === "REVIEWED" && "Awaiting project head office authorization"}
              {currentStatus === "ADMIN_APPROVED" && "Awaiting AHNI head office final approval"}
              {currentStatus === "MANAGER_APPROVED" && "Fund request fully approved"}
              {currentStatus === "REJECTED" && "Fund request rejected"}
            </p>
          </div>
          <Badge
            variant={
              currentStatus === "MANAGER_APPROVED" ? "default" :
              currentStatus === "REJECTED" ? "destructive" : "secondary"
            }
          >
            {currentStatus.replace("_", " ")}
          </Badge>
        </div>
      </Card>

    </div>
  );
};

export default FundRequestApprovalSignatureForm;