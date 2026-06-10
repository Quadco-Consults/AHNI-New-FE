"use client";

import { Check, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WorkflowStep {
  id: string;
  label: string;
  description?: string;
  status: "completed" | "current" | "pending";
}

interface WorkflowStepperProps {
  steps: WorkflowStep[];
  className?: string;
}

/**
 * Workflow Stepper Component
 * Shows the current progress through a multi-step workflow
 */
export const WorkflowStepper = ({ steps, className }: WorkflowStepperProps) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";
          const isPending = step.status === "pending";

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    isCompleted &&
                      "bg-emerald-500 border-emerald-500 text-white",
                    isCurrent &&
                      "bg-blue-500 border-blue-500 text-white animate-pulse",
                    isPending && "bg-white border-slate-300 text-slate-400"
                  )}
                >
                  {isCompleted && <Check className="w-5 h-5" />}
                  {isCurrent && <Clock className="w-5 h-5" />}
                  {isPending && <Circle className="w-5 h-5" />}
                </div>

                {/* Step Label */}
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCompleted && "text-emerald-700",
                      isCurrent && "text-blue-700 font-semibold",
                      isPending && "text-slate-500"
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 transition-all duration-300",
                    isCompleted ? "bg-emerald-500" : "bg-slate-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Get workflow steps based on CBA status and type
 */
export const getCBAWorkflowSteps = (
  status: string,
  cbaType: string
): WorkflowStep[] => {
  const isCommittee = cbaType === "COMMITTEE";

  // Committee-based CBA has 6 stages
  if (isCommittee) {
    const committeeSteps: WorkflowStep[] = [
      {
        id: "setup",
        label: "CBA Created",
        description: "Initial setup",
        status: "completed",
      },
      {
        id: "committee",
        label: "Committee Analysis",
        description: "Vendor evaluation",
        status: "pending",
      },
      {
        id: "review",
        label: "Review",
        description: "First approval",
        status: "pending",
      },
      {
        id: "authorise",
        label: "Authorise",
        description: "Second approval",
        status: "pending",
      },
      {
        id: "final_approval",
        label: "Final Approval",
        description: "Final sign-off",
        status: "pending",
      },
      {
        id: "completed",
        label: "Completed",
        description: "Process complete",
        status: "pending",
      },
    ];

    // Update steps based on current status
    switch (status) {
      case "PENDING":
      case "IN_PROGRESS":
        // Committee members are scoring
        committeeSteps[1].status = "current";
        break;

      case "DONE":
        // Committee scoring complete, awaiting review
        committeeSteps[1].status = "completed";
        committeeSteps[2].status = "current";
        break;

      case "UNDER_REVIEW":
        // In review stage
        committeeSteps[1].status = "completed";
        committeeSteps[2].status = "current";
        break;

      case "AUTHORISING":
        // In authorise stage
        committeeSteps[1].status = "completed";
        committeeSteps[2].status = "completed";
        committeeSteps[3].status = "current";
        break;

      case "AWAITING_APPROVAL":
        // In final approval stage
        committeeSteps[1].status = "completed";
        committeeSteps[2].status = "completed";
        committeeSteps[3].status = "completed";
        committeeSteps[4].status = "current";
        break;

      case "APPROVED":
        // Approved, moving to completed
        committeeSteps[1].status = "completed";
        committeeSteps[2].status = "completed";
        committeeSteps[3].status = "completed";
        committeeSteps[4].status = "completed";
        committeeSteps[5].status = "current";
        break;

      case "COMPLETED":
        // All stages complete
        committeeSteps.forEach((step) => (step.status = "completed"));
        break;

      case "REJECTED":
        // Rejected - show appropriate stage as current
        committeeSteps[1].status = "completed";
        committeeSteps[2].status = "current";
        committeeSteps[2].description = "Rejected";
        break;

      default:
        committeeSteps[1].status = "current";
    }

    return committeeSteps;
  }

  // Non-committee CBA has 4 stages
  const baseSteps: WorkflowStep[] = [
    {
      id: "setup",
      label: "CBA Created",
      description: "Initial setup",
      status: "completed",
    },
    {
      id: "evaluation",
      label: "Evaluation",
      description: "Bid review",
      status: "pending",
    },
    {
      id: "approval",
      label: "Approval",
      description: "Final approval",
      status: "pending",
    },
    {
      id: "completed",
      label: "Completed",
      description: "Analysis done",
      status: "pending",
    },
  ];

  // Update steps based on current status
  switch (status) {
    case "PENDING":
    case "IN_PROGRESS":
      baseSteps[1].status = "current";
      break;

    case "DONE":
      baseSteps[1].status = "completed";
      baseSteps[2].status = "current";
      break;

    case "APPROVED":
      baseSteps[1].status = "completed";
      baseSteps[2].status = "completed";
      baseSteps[3].status = "current";
      break;

    case "COMPLETED":
      baseSteps.forEach((step) => (step.status = "completed"));
      break;

    case "REJECTED":
      baseSteps[1].status = "completed";
      baseSteps[2].status = "current";
      baseSteps[2].description = "Rejected";
      break;

    default:
      baseSteps[1].status = "current";
  }

  return baseSteps;
};
