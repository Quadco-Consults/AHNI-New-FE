"use client";

import ApprovalDisplay, { ApprovalInfo } from "components/ApprovalDisplay";
import { useGetSingleSupervisionPlan } from "@/features/programs/controllers/supervisionPlanController";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { LoadingSpinner } from "components/Loading";

type Props = {};

const ApprovalStatus = (props: Props) => {
  const params = useParams();
  const id = params?.id as string;

  const { data: supervisionPlan, isLoading } = useGetSingleSupervisionPlan(
    id,
    !!id
  );

  // Transform supervision plan data to ApprovalInfo format
  const approvals: ApprovalInfo[] = useMemo(() => {
    if (!supervisionPlan?.data) return [];

    const plan = supervisionPlan.data;
    const approvalsList: ApprovalInfo[] = [];

    // Level 1 Approver
    if (plan.level1_approver) {
      const level1Approval = plan.approvals?.find((a) => a.level === 1);
      approvalsList.push({
        id: level1Approval?.id || "level1",
        name: `${plan.level1_approver.first_name} ${plan.level1_approver.last_name}`,
        position: plan.level1_approver.role || "Level 1 Approver",
        email: plan.level1_approver.email,
        status: level1Approval?.status || "PENDING",
        level: "Level 1",
        creationDate: plan.created_datetime,
        approvalDate: level1Approval?.approval_date,
        comments: level1Approval?.comments || "",
      });
    }

    // Level 2 Approver
    if (plan.level2_approver) {
      const level2Approval = plan.approvals?.find((a) => a.level === 2);
      approvalsList.push({
        id: level2Approval?.id || "level2",
        name: `${plan.level2_approver.first_name} ${plan.level2_approver.last_name}`,
        position: plan.level2_approver.role || "Level 2 Approver",
        email: plan.level2_approver.email,
        status: level2Approval?.status || "PENDING",
        level: "Level 2",
        creationDate: plan.created_datetime,
        approvalDate: level2Approval?.approval_date,
        comments:
          level2Approval?.comments ||
          (level2Approval?.status === "PENDING"
            ? "Awaiting Level 1 approval"
            : ""),
      });
    }

    // Level 3 Approver
    if (plan.level3_approver) {
      const level3Approval = plan.approvals?.find((a) => a.level === 3);
      approvalsList.push({
        id: level3Approval?.id || "level3",
        name: `${plan.level3_approver.first_name} ${plan.level3_approver.last_name}`,
        position: plan.level3_approver.role || "Level 3 Approver",
        email: plan.level3_approver.email,
        status: level3Approval?.status || "PENDING",
        level: "Level 3",
        creationDate: plan.created_datetime,
        approvalDate: level3Approval?.approval_date,
        comments:
          level3Approval?.comments ||
          (level3Approval?.status === "PENDING"
            ? "Awaiting Level 1 & 2 approvals"
            : ""),
      });
    }

    return approvalsList;
  }, [supervisionPlan]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-primary text-xl font-semibold">
          Approval Status & History
        </h3>
        <p className="text-gray-600 mt-2">
          Track the approval process through all levels with detailed
          information about each approver.
        </p>
        {supervisionPlan?.data?.current_approval_level && (
          <p className="text-sm text-gray-500 mt-1">
            Current Approval Level:{" "}
            <span className="font-semibold">
              Level {supervisionPlan.data.current_approval_level}
            </span>
          </p>
        )}
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
