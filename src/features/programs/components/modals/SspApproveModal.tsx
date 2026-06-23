"use client";

import FormButton from "@/components/FormButton";
import FormTextArea from "@/components/FormTextArea";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, User, Calendar, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    useApproveSupervisionPlan,
    useGetSingleSupervisionPlan,
} from "@/features/programs/controllers/supervisionPlanController";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { closeDialog } from "@/store/ui";
import { Badge } from "@/components/ui/badge";
import Card from "@/components/Card";

const SspApproveModal = () => {
    const { dialog } = useAppSelector((state) => state.ui);
    const dispatch = useAppDispatch();

    const id = dialog?.dialogProps?.id as string;

    const [action, setAction] = useState<"approve" | "reject" | "">("");

    const { data: supervisionPlan, isLoading: isPlanLoading } =
        useGetSingleSupervisionPlan(id, !!id);

    const form = useForm({
        defaultValues: {
            comments: "",
        },
    });

    const { handleSubmit } = form;
    const { mutateAsync: approveSupervisionPlan, isPending } =
        useApproveSupervisionPlan(id);

    const onSubmit = async (data: { comments: string }) => {
        if (!action) {
            toast.error("Please select Approve or Reject");
            return;
        }

        if (!id) {
            toast.error("Supervision plan ID not found");
            return;
        }

        try {
            await approveSupervisionPlan({
                action,
                comments: data.comments,
            });
            toast.success(
                `Supervision plan ${action === "approve" ? "approved" : "rejected"} successfully`
            );
            dispatch(closeDialog());
        } catch (error: any) {
            toast.error(error?.message ?? "Something went wrong");
        }
    };

    // Get current approval level and approver info
    const currentLevel = supervisionPlan?.data?.current_approval_level || 1;
    const approvals = supervisionPlan?.data?.approvals || [];
    const levelApprovers = {
        1: supervisionPlan?.data?.level1_approver,
        2: supervisionPlan?.data?.level2_approver,
        3: supervisionPlan?.data?.level3_approver,
    };

    // Determine how many approval levels are configured
    const configuredLevels = [
        supervisionPlan?.data?.level1_approver,
        supervisionPlan?.data?.level2_approver,
        supervisionPlan?.data?.level3_approver,
    ].filter(Boolean).length;

    const currentApprover = levelApprovers[currentLevel as 1 | 2 | 3];

    if (isPlanLoading) {
        return (
            <div className="w-full flex justify-center py-10">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-sm text-gray-600">Loading approval information...</p>
                </div>
            </div>
        );
    }

    if (configuredLevels === 0) {
        return (
            <div className="w-full flex justify-center py-10">
                <div className="flex flex-col items-center gap-3">
                    <p className="text-sm text-gray-600">No approvers have been configured for this supervision plan.</p>
                    <p className="text-xs text-gray-500">Please edit the plan to assign approvers before approval.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            {/* Approval Workflow Progress */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Approval Workflow Progress ({configuredLevels} Level{configuredLevels !== 1 ? 's' : ''})
                </h3>
                <div className="flex items-center justify-between gap-2">
                    {Array.from({ length: configuredLevels }, (_, i) => i + 1).map((level, index) => {
                        const approval = approvals.find((a) => a.level === level);
                        const isCompleted = approval?.status === "APPROVED";
                        const isRejected = approval?.status === "REJECTED";
                        const isCurrent = level === currentLevel;

                        return (
                            <div key={level} className="flex items-center flex-1">
                                <div className="flex flex-col items-center w-full">
                                    <div
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all",
                                            isCompleted && "bg-green-500 text-white",
                                            isRejected && "bg-red-500 text-white",
                                            isCurrent && !isCompleted && !isRejected && "bg-blue-500 text-white animate-pulse",
                                            !isCurrent && !isCompleted && !isRejected && "bg-gray-200 text-gray-500"
                                        )}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-5 h-5" />
                                        ) : isRejected ? (
                                            <XCircle className="w-5 h-5" />
                                        ) : (
                                            level
                                        )}
                                    </div>
                                    <p className="text-xs mt-1 font-medium text-gray-600">Level {level}</p>
                                </div>
                                {index < configuredLevels - 1 && (
                                    <ChevronRight
                                        className={cn(
                                            "w-4 h-4 mx-1",
                                            isCompleted ? "text-green-500" : "text-gray-300"
                                        )}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Current Approver Info */}
            {currentApprover && (
                <Card className="border-yellow-500 bg-yellow-50">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-yellow-500">Pending Your Action</Badge>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-yellow-100 p-2 rounded-full">
                                <User className="w-5 h-5 text-yellow-700" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">
                                    {currentApprover.first_name} {currentApprover.last_name}
                                </p>
                                <p className="text-sm text-gray-600">{currentApprover.email}</p>
                                <Badge variant="outline" className="mt-1">
                                    Level {currentLevel} Approver
                                </Badge>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Previous Approvals */}
            {approvals.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700">Approval History</h4>
                    {approvals.map((approval) => (
                        <Card
                            key={approval.id}
                            className={cn(
                                "border-l-4",
                                approval.status === "APPROVED" && "border-l-green-500 bg-green-50",
                                approval.status === "REJECTED" && "border-l-red-500 bg-red-50"
                            )}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                    <div
                                        className={cn(
                                            "p-2 rounded-full",
                                            approval.status === "APPROVED" && "bg-green-100",
                                            approval.status === "REJECTED" && "bg-red-100"
                                        )}
                                    >
                                        {approval.status === "APPROVED" ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-600" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-sm">
                                                {approval.approver.first_name} {approval.approver.last_name}
                                            </p>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-xs",
                                                    approval.status === "APPROVED" && "border-green-500 text-green-700",
                                                    approval.status === "REJECTED" && "border-red-500 text-red-700"
                                                )}
                                            >
                                                {approval.status}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-gray-600">Level {approval.level}</p>
                                        {approval.comments && (
                                            <p className="text-sm text-gray-700 mt-2 p-2 bg-white rounded">
                                                {approval.comments}
                                            </p>
                                        )}
                                        {approval.approval_date && (
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(approval.approval_date).toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Decision Buttons */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700">Your Decision</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setAction("approve")}
                                className={cn(
                                    "p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg group",
                                    action === "approve"
                                        ? "border-green-500 bg-green-50 shadow-md"
                                        : "border-gray-200 hover:border-green-300"
                                )}
                            >
                                <CheckCircle2
                                    className={cn(
                                        "mx-auto mb-2 transition-all",
                                        action === "approve" ? "w-8 h-8 text-green-600" : "w-7 h-7 text-gray-400 group-hover:text-green-500"
                                    )}
                                />
                                <h4
                                    className={cn(
                                        "font-semibold",
                                        action === "approve" ? "text-green-700" : "text-gray-600 group-hover:text-green-600"
                                    )}
                                >
                                    Approve
                                </h4>
                            </button>
                            <button
                                type="button"
                                onClick={() => setAction("reject")}
                                className={cn(
                                    "p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg group",
                                    action === "reject"
                                        ? "border-red-500 bg-red-50 shadow-md"
                                        : "border-gray-200 hover:border-red-300"
                                )}
                            >
                                <XCircle
                                    className={cn(
                                        "mx-auto mb-2 transition-all",
                                        action === "reject" ? "w-8 h-8 text-red-600" : "w-7 h-7 text-gray-400 group-hover:text-red-500"
                                    )}
                                />
                                <h4
                                    className={cn(
                                        "font-semibold",
                                        action === "reject" ? "text-red-700" : "text-gray-600 group-hover:text-red-600"
                                    )}
                                >
                                    Reject
                                </h4>
                            </button>
                        </div>
                    </div>

                    {/* Comments */}
                    <FormTextArea
                        name="comments"
                        label="Comments"
                        placeholder="Add your comments about this decision..."
                        rows={4}
                    />

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <FormButton
                            type="button"
                            onClick={() => dispatch(closeDialog())}
                            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                            Cancel
                        </FormButton>
                        <FormButton
                            type="submit"
                            loading={isPending}
                            disabled={isPending || !action}
                            className={cn(
                                action === "approve" && "bg-green-600 hover:bg-green-700",
                                action === "reject" && "bg-red-600 hover:bg-red-700"
                            )}
                        >
                            {isPending ? "Submitting..." : `Confirm ${action === "approve" ? "Approval" : action === "reject" ? "Rejection" : "Decision"}`}
                        </FormButton>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default SspApproveModal;