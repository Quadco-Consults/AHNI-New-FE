"use client";

import ApprovalDisplay, { ApprovalInfo } from "components/ApprovalDisplay";
import { useState } from "react";

type Props = {};

const ApprovalStatus = (props: Props) => {
  // Mock approval data - replace with actual data from your API
  const approvals: ApprovalInfo[] = [
    {
      id: "1",
      name: "John Admin",
      position: "System Administrator",
      email: "john.admin@company.com",
      status: "APPROVED",
      level: "Admin Level",
      creationDate: "2024-01-15T09:00:00Z",
      reviewDate: "2024-01-15T10:30:00Z",
      approvalDate: "2024-01-15T11:00:00Z",
      comments: "Initial approval completed. All documents verified."
    },
    {
      id: "2",
      name: "Sarah Manager",
      position: "Program Manager",
      email: "sarah.manager@company.com",
      status: "UNDER_REVIEW",
      level: "Manager Level",
      creationDate: "2024-01-15T11:00:00Z",
      reviewDate: "2024-01-16T14:00:00Z",
      comments: "Currently reviewing the supervision plan details."
    },
    {
      id: "3",
      name: "Dr. Michael HOD",
      position: "Head of Department",
      email: "michael.hod@company.com",
      status: "PENDING",
      level: "HOD Level",
      creationDate: "2024-01-15T11:00:00Z",
      comments: "Awaiting manager approval before review."
    },
    {
      id: "4",
      name: "Director Jane",
      position: "Principal Officer",
      email: "jane.director@company.com",
      status: "PENDING",
      level: "Director Level",
      creationDate: "2024-01-15T11:00:00Z",
      comments: "Final approval pending completion of previous stages."
    },
    {
      id: "5",
      name: "CEO Robert",
      position: "Chief Executive Officer",
      email: "robert.ceo@company.com",
      status: "PENDING",
      level: "Executive Level",
      creationDate: "2024-01-15T11:00:00Z",
      comments: "Awaiting all prior approvals for final authorization."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-primary text-xl font-semibold">
          Approval Status & History
        </h3>
        <p className="text-gray-600 mt-2">
          Track the approval process through all levels with detailed information about each approver.
        </p>
      </div>

      <ApprovalDisplay
        approvals={approvals}
        title="Approval Workflow"
        showTimeline={true}
      />
    </div>
  );
};

export default ApprovalStatus;
