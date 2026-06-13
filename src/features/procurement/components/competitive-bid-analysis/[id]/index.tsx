"use client";

import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import Link from "next/link";
import { LoadingSpinner } from "@/components/Loading";
import BreadcrumbCard from "@/components/Breadcrumb";
import CbaAPI from "@/features/procurement/controllers/cbaController";
import Card from "@/components/Card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileText, BarChart, Briefcase, CalendarDays, Layers, ClipboardList, ClipboardCheck, Eye, ShieldCheck, CheckCircle, Package, Users, User, UserCheck, Lock, XCircle } from 'lucide-react';
import { Icon } from "@iconify/react";
import { SolicitationItems } from "definitions/procurement-types/solicitation";
import GoBack from "@/components/GoBack";
import { CommitteeMemberData } from "definitions/procurement-types/cba";
import { RouteEnum } from "@/constants/RouterConstants";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import FormSelect from "@/components/atoms/FormSelectField";
import { useForm } from "react-hook-form";
import { SelectContent, SelectItem } from "@/components/ui/select";
import FormTextArea from "@/components/atoms/FormTextArea";
import FormButton from "@/components/FormButton";
import { z } from "zod";
import { CbaApprovalSchema } from "@/features/procurement/types/procurement-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { useGetSolicitationSubmission } from "@/features/procurement/controllers/vendorBidSubmissionsController";
import { useGetSingleSolicitation } from "@/features/procurement/controllers/solicitationController";
import { useGetPurchaseRequest } from "@/features/procurement/controllers/purchaseRequestController";
import AnalysisResults from "./AnalysisResults";
import SignatureWorkflowAPI from "@/features/procurement/controllers/signatureWorkflowController";
import { useQueryClient } from "@tanstack/react-query";
import { useGetMemberParticipation, useCurrentUser } from "@/features/procurement/controllers/committeeEvaluationController";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommitteeParticipationBanner from "./committee-evaluation/CommitteeParticipationBanner";
import MemberEvaluationDashboard from "./committee-evaluation/MemberEvaluationDashboard";
import ConsensusAnalysis from "./committee-evaluation/ConsensusAnalysis";
import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

const generatePath = (route: string, params?: Record<string, any>): string => {
  let path = route;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, String(value));
    });
  }
  return path;
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'APPROVED': return 'default';
    case 'REJECTED': return 'destructive';
    case 'PENDING': return 'secondary';
    case 'COMPLETED': return 'outline';
    default: return 'secondary';
  }
};

// Helper function to determine user role
const getUserRole = (user: any) => {
  const designation = user?.designation?.toLowerCase() || '';
  const role = user?.role?.toLowerCase() || '';
  const email = user?.email?.toLowerCase() || '';

  if (email.includes('admin@') || email === 'admin@mail.com') return 'ADMIN';
  if (designation.includes('admin') || role.includes('admin') ||
      designation.includes('managing director') || designation.includes('md') ||
      role.includes('managing director') || role.includes('md') ||
      designation.includes('director') || role.includes('director') ||
      designation.includes('administrator') || role.includes('administrator')) {
    return 'ADMIN';
  }
  if (designation.includes('procurement') || role.includes('procurement') ||
      designation.includes('officer') || role.includes('officer') ||
      designation.includes('manager') || role.includes('manager')) {
    return 'PROCUREMENT_STAFF';
  }
  return 'STAFF';
};

const CompetitiveBidAnalysisDetail = () => {
    const { id } = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const queryClient = useQueryClient();
    const currentUser = useCurrentUser();

    const { data, isLoading, error } = CbaAPI.useGetSingleCba(id as string);
    const { data: memberParticipation, isLoading: participationLoading } = useGetMemberParticipation(id as string);

    // Get RFQ/Solicitation ID from CBA data
    const solicitationId = typeof data?.data?.solicitation === 'object'
        ? (data?.data?.solicitation as any)?.id
        : data?.data?.solicitation;

    // Fetch RFQ/Solicitation details
    const { data: rfqData } = useGetSingleSolicitation(solicitationId as string, !!solicitationId);

    // Get Purchase Request ID from RFQ/Solicitation
    const purchaseRequestId = typeof rfqData?.data?.purchase_request === 'object'
        ? (rfqData?.data?.purchase_request as any)?.id
        : rfqData?.data?.purchase_request;

    // Fetch Purchase Request details to check if user is assigned
    const { data: prData } = useGetPurchaseRequest(purchaseRequestId as string, !!purchaseRequestId);

    // Fetch vendor submissions
    const { data: submissionsData } = useGetSolicitationSubmission(solicitationId as string, !!solicitationId);

    // Use new signature workflow hooks
    const { data: workflowStatus } = CbaAPI.useGetWorkflowStatus(id as string, !!id);
    const { data: signatureStatus } = CbaAPI.useGetSignatureStatus(id as string, !!id);
    const { submitForReview } = CbaAPI.useSubmitCbaForReview(id as string);
    const { reviewCba, isLoading: reviewLoading } = CbaAPI.useReviewCba(id as string);
    const { authoriseCba, isLoading: authoriseLoading } = CbaAPI.useAuthoriseCba(id as string);
    const { approveCba, isLoading: approveLoading } = CbaAPI.useApproveCba(id as string);

    // Rejection hooks
    const { reviewRejectCba, isLoading: reviewRejectLoading } = CbaAPI.useReviewRejectCba(id as string);
    const { authoriseRejectCba, isLoading: authoriseRejectLoading } = CbaAPI.useAuthoriseRejectCba(id as string);
    const { approveRejectCba, isLoading: approveRejectLoading } = CbaAPI.useApproveRejectCba(id as string);

    // Get current approval step and role dynamically from workflow status
    const getCurrentApprovalStep = () => {
        if (!workflowStatus?.data) {
            return { step: 0, role: 'Pending', isComplete: false };
        }

        const { current_step, step_name, is_completed, action_type } = workflowStatus.data;

        if (is_completed) {
            return { step: 4, role: 'Completed', isComplete: true };
        }

        // Map action_type to step and role
        const stepMapping: Record<string, { step: number; role: string }> = {
            'review': { step: 1, role: 'Reviewer' },
            'authorise': { step: 2, role: 'Authoriser' },
            'approve': { step: 3, role: 'Approver' }
        };

        if (action_type && stepMapping[action_type]) {
            return {
                step: stepMapping[action_type].step,
                role: stepMapping[action_type].role,
                isComplete: false
            };
        }

        return { step: current_step, role: step_name, isComplete: false };
    };

    const currentStep = getCurrentApprovalStep();
    const createApprovalCbaIsLoading = reviewLoading || authoriseLoading || approveLoading;
    const createRejectionCbaIsLoading = reviewRejectLoading || authoriseRejectLoading || approveRejectLoading;

    // Committee evaluation logic
    const isCommitteeCBA = data?.data?.cba_type === 'COMMITTEE';

    // Check if all committee members have submitted their evaluations
    const allMembersSubmitted = useMemo(() => {
        if (!data?.data?.committee_members || !memberParticipation) return false;

        return data.data.committee_members.every(member =>
            memberParticipation.submitted_members.includes(member.id)
        );
    }, [data, memberParticipation]);

    // Check if current user is a committee member
    const isCommitteeMember = useMemo(() => {
        if (!isCommitteeCBA || !data?.data?.committee_members) return false;

        return data.data.committee_members.some(member => member.id === currentUser.id);
    }, [isCommitteeCBA, data, currentUser.id]);

    // Determine user role for access control
    const userRole = useMemo(() => {
        if (!currentUser?.id) return 'STAFF';
        return getUserRole(currentUser);
    }, [currentUser]);

    // Check if user is the assigned evaluator for NON-COMMITTEE CBAs
    const isAssignedEvaluator = useMemo(() => {
        if (!data?.data) return false;
        const assigneeId = typeof data.data.assignee === 'string'
            ? data.data.assignee
            : (data.data.assignee as any)?.user_id || (data.data.assignee as any)?.id;
        return assigneeId === currentUser.id;
    }, [data, currentUser.id]);

    // Check if user is assigned to the Purchase Request
    const isAssignedToPR = useMemo(() => {
        if (!prData?.data) return false;
        return prData.data.assigned_to === currentUser.id;
    }, [prData, currentUser.id]);

    // Check if user is in the approval workflow (reviewers, authorisers, or approvers)
    const isApprover = useMemo(() => {
        if (!data?.data) return false;
        const cbaData = data.data;
        const currentUserId = currentUser.id;

        // Check if user is in reviewers array
        const isReviewer = cbaData.reviewers?.some((user: any) =>
            (typeof user === 'string' ? user : user?.id) === currentUserId
        );

        // Check if user is in authorisers array
        const isAuthoriser = cbaData.authorisers?.some((user: any) =>
            (typeof user === 'string' ? user : user?.id) === currentUserId
        );

        // Check if user is in approvers array
        const isApproverUser = cbaData.approvers?.some((user: any) =>
            (typeof user === 'string' ? user : user?.id) === currentUserId
        );

        return isReviewer || isAuthoriser || isApproverUser;
    }, [data, currentUser.id]);

    // ACCESS CONTROL: Check if user has permission to view this CBA
    useEffect(() => {
        if (isLoading || !data?.data) return;

        const hasAccess =
            userRole === 'ADMIN' ||  // Admin users
            userRole === 'PROCUREMENT_STAFF' ||  // Procurement admin officers
            isCommitteeMember ||  // Committee members for this CBA
            isAssignedEvaluator ||  // CBA evaluator
            isAssignedToPR ||  // Procurement officer assigned to the related PR
            isApprover;  // Users in review/authorise/approve workflow

        if (!hasAccess) {
            toast.error('You are not authorized to view this CBA');
            router.push('/dashboard/procurement/competitive-bid-analysis');
        }
    }, [isLoading, data, userRole, isCommitteeMember, isAssignedEvaluator, isAssignedToPR, isApprover, router]);

    const handleSendReminders = () => {
        // TODO: Implement reminder functionality
        console.log("Sending reminders to pending committee members");
    };

    const form = useForm<z.infer<typeof CbaApprovalSchema>>({
        resolver: zodResolver(CbaApprovalSchema),
        defaultValues: {
            status: "APPROVED" as const,
            remarks: "",
        },
    });

    // Rejection form
    const RejectSchema = z.object({
        comments: z.string().min(10, "Rejection reason must be at least 10 characters"),
    });

    const rejectForm = useForm<z.infer<typeof RejectSchema>>({
        resolver: zodResolver(RejectSchema),
        defaultValues: {
            comments: "",
        },
    });

    const { handleSubmit } = form;

    const onSubmit = async (formData: z.infer<typeof CbaApprovalSchema>) => {
        try {
            const submissionData = {
                signature: currentUser?.email || 'digital-signature', // Use user email or digital signature
                comments: formData.remarks
            };

            if (formData.status === 'APPROVED') {
                // Call appropriate hook based on current step
                switch (currentStep.step) {
                    case 1:
                        await reviewCba(submissionData);
                        break;
                    case 2:
                        await authoriseCba(submissionData);
                        break;
                    case 3:
                        await approveCba({ status: 'APPROVED', remarks: formData.remarks });
                        break;
                    default:
                        throw new Error('Invalid approval step');
                }

                // Invalidate queries to refresh CBA data
                await queryClient.invalidateQueries({ queryKey: ["cba", id] });
                await queryClient.invalidateQueries({ queryKey: ["cbas"] });
                await queryClient.invalidateQueries({ queryKey: ["cba-workflow-status", id] });
                await queryClient.invalidateQueries({ queryKey: ["cba-signature-status", id] });

                toast.success(`${currentStep.role} approval submitted successfully.`);
            } else {
                // For rejection, we'd use the reject endpoint
                toast.error("CBA rejected. Please use the reject workflow.");
            }

            setOpen(false);
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
        }
    };

    const onReject = async (formData: z.infer<typeof RejectSchema>) => {
        try {
            // Call appropriate reject hook based on current step
            switch (currentStep.step) {
                case 1:
                    await reviewRejectCba({ comments: formData.comments });
                    break;
                case 2:
                    await authoriseRejectCba({ comments: formData.comments });
                    break;
                case 3:
                    await approveRejectCba({ comments: formData.comments });
                    break;
                default:
                    throw new Error('Invalid rejection step');
            }

            // Invalidate queries to refresh CBA data
            await queryClient.invalidateQueries({ queryKey: ["cba", id] });
            await queryClient.invalidateQueries({ queryKey: ["cbas"] });
            await queryClient.invalidateQueries({ queryKey: ["cba-workflow-status", id] });
            await queryClient.invalidateQueries({ queryKey: ["cba-signature-status", id] });

            toast.success(`CBA rejected at ${currentStep.role} stage`);
            setRejectOpen(false);
            rejectForm.reset();
        } catch (error) {
            toast.error("Failed to reject CBA");
            console.log(error);
        }
    };

    if (isLoading) return <LoadingSpinner />;

    const breadcrumbs = [
        { name: "Procurement", icon: true },
        { name: "Competitive Bid Analysis", icon: true },
        { name: "Detail", icon: false },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Navigation Header */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <GoBack />
                            <div className="h-8 w-px bg-gray-300" />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Competitive Bid Analysis</h1>
                                <p className="text-sm text-gray-500">Analysis ID: {(id as string).slice(0, 13)}...</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Badge variant={getStatusVariant(data?.data?.status) as any} className="px-4 py-2 text-sm font-medium">
                                {data?.data?.status || 'PENDING'}
                            </Badge>
                            <Link href={generatePath(RouteEnum.PROCUREMENT_CBA_REPORT, { id: id as string })}>
                                <Button variant="outline" className="gap-2 hover:bg-blue-50">
                                    <FileText size={18} />
                                    Download Report
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">

                {/* Project Overview Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main CBA Info */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <BarChart size={24} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {isCommitteeCBA ? 'Committee-Based Analysis' : (data?.data?.title || 'Competitive Bid Analysis')}
                                        </h2>
                                        <p className="text-gray-600 text-sm mt-1">
                                            {isCommitteeCBA && 'Collaborative committee evaluation process'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-sm font-medium text-gray-600">RFQ ID</span>
                                        <span className="text-sm text-gray-900 font-mono">{rfqData?.data?.rfq_id || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-sm font-medium text-gray-600">CBA Type</span>
                                        <span className="text-sm text-gray-900">{data?.data?.cba_type || 'Standard'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-sm font-medium text-gray-600">Analysis Date</span>
                                        <span className="text-sm text-gray-900">
                                            {data?.data?.cba_date ? new Date(data.data.cba_date).toLocaleDateString() : 'Not Set'}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-sm font-medium text-gray-600">Items Count</span>
                                        <span className="text-sm text-gray-900 font-semibold">
                                            {rfqData?.data?.solicitation_items?.length || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <span className="text-sm font-medium text-gray-600">Submissions</span>
                                        <span className="text-sm text-gray-900 font-semibold">
                                            {submissionsData?.data?.data?.results?.length || 0}
                                        </span>
                                    </div>
                                    {data?.data?.lot && (
                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-sm font-medium text-gray-600">Lot</span>
                                            <span className="text-sm text-gray-900">{data.data.lot}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Sidebar */}
                    <div className="space-y-4">
                        {isCommitteeCBA && memberParticipation && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <Users size={20} className="mr-2 text-blue-600" />
                                    Committee Progress
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Completion Rate</span>
                                        <span className="text-lg font-bold text-green-600">
                                            {Math.round(((memberParticipation?.submitted_members?.length || 0) / (memberParticipation?.total_members || 1)) * 100)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${Math.round(((memberParticipation?.submitted_members?.length || 0) / (memberParticipation?.total_members || 1)) * 100)}%`
                                            }}
                                        ></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <div className="text-center p-3 bg-green-50 rounded-lg">
                                            <div className="text-xl font-bold text-green-600">
                                                {memberParticipation?.submitted_members?.length || 0}
                                            </div>
                                            <div className="text-xs text-gray-600">Submitted</div>
                                        </div>
                                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                            <div className="text-xl font-bold text-yellow-600">
                                                {memberParticipation?.pending_members?.length || 0}
                                            </div>
                                            <div className="text-xs text-gray-600">Pending</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Status Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <CheckCircle2 size={20} className="mr-2 text-blue-600" />
                                Current Status
                            </h3>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <Badge variant={getStatusVariant(data?.data?.status) as any} className="px-4 py-2 text-sm">
                                        {data?.data?.status || 'PENDING'}
                                    </Badge>
                                </div>
                                <div className="text-xs text-gray-500 text-center">
                                    Last updated: {data?.data?.updated_at ? new Date(data.data.updated_at).toLocaleDateString() : 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3-Level Approval Workflow Section */}
                {data?.data && (data.data.reviewers?.length > 0 || data.data.authorisers?.length > 0 || data.data.approvers?.length > 0) && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <ShieldCheck size={24} className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Approval Workflow</h3>
                                        <p className="text-gray-600 text-sm mt-1">3-Level signature approval process</p>
                                    </div>
                                </div>
                                {workflowStatus?.data?.can_user_act && (
                                    <div className="flex items-center gap-3">
                                        <Button
                                            onClick={() => setRejectOpen(true)}
                                            variant="outline"
                                            className="border-red-500 text-red-600 hover:bg-red-50 gap-2"
                                            disabled={createRejectionCbaIsLoading}
                                        >
                                            <XCircle size={18} />
                                            Reject
                                        </Button>
                                        <Button
                                            onClick={() => setOpen(true)}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                                            disabled={createApprovalCbaIsLoading}
                                        >
                                            <CheckCircle size={18} />
                                            {currentStep.role === 'Reviewer' && 'Review CBA'}
                                            {currentStep.role === 'Authoriser' && 'Authorise CBA'}
                                            {currentStep.role === 'Approver' && 'Approve CBA'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Workflow Progress */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                {/* Stage 1: Review */}
                                <div className={cn(
                                    "relative p-6 rounded-lg border-2 transition-all",
                                    signatureStatus?.data?.current_stage === 'review' || (currentStep.step === 1 && !currentStep.isComplete)
                                        ? "border-blue-500 bg-blue-50"
                                        : signatureStatus?.data?.reviewers?.signed === signatureStatus?.data?.reviewers?.total
                                        ? "border-green-500 bg-green-50"
                                        : "border-gray-200 bg-gray-50"
                                )}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                                                signatureStatus?.data?.reviewers?.signed === signatureStatus?.data?.reviewers?.total
                                                    ? "bg-green-500 text-white"
                                                    : "bg-blue-500 text-white"
                                            )}>
                                                {signatureStatus?.data?.reviewers?.signed === signatureStatus?.data?.reviewers?.total ? '✓' : '1'}
                                            </div>
                                            <h4 className="font-semibold text-gray-900">Review</h4>
                                        </div>
                                        <Badge variant={
                                            signatureStatus?.data?.reviewers?.signed === signatureStatus?.data?.reviewers?.total
                                                ? "default"
                                                : "secondary"
                                        }>
                                            {signatureStatus?.data?.reviewers?.signed || 0}/{signatureStatus?.data?.reviewers?.total || 0}
                                        </Badge>
                                    </div>
                                    <div className="space-y-2">
                                        {signatureStatus?.data?.reviewers?.users?.map((user: any) => (
                                            <div key={user.id} className="flex items-center justify-between text-sm">
                                                <span className="text-gray-700">{user.name}</span>
                                                {user.has_signed ? (
                                                    <CheckCircle size={16} className="text-green-600" />
                                                ) : (
                                                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Stage 2: Authorise */}
                                <div className={cn(
                                    "relative p-6 rounded-lg border-2 transition-all",
                                    signatureStatus?.data?.current_stage === 'authorise' || (currentStep.step === 2 && !currentStep.isComplete)
                                        ? "border-green-500 bg-green-50"
                                        : signatureStatus?.data?.authorisers?.signed === signatureStatus?.data?.authorisers?.total
                                        ? "border-green-500 bg-green-50"
                                        : "border-gray-200 bg-gray-50"
                                )}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                                                signatureStatus?.data?.authorisers?.signed === signatureStatus?.data?.authorisers?.total
                                                    ? "bg-green-500 text-white"
                                                    : "bg-green-500 text-white"
                                            )}>
                                                {signatureStatus?.data?.authorisers?.signed === signatureStatus?.data?.authorisers?.total ? '✓' : '2'}
                                            </div>
                                            <h4 className="font-semibold text-gray-900">Authorise</h4>
                                        </div>
                                        <Badge variant={
                                            signatureStatus?.data?.authorisers?.signed === signatureStatus?.data?.authorisers?.total
                                                ? "default"
                                                : "secondary"
                                        }>
                                            {signatureStatus?.data?.authorisers?.signed || 0}/{signatureStatus?.data?.authorisers?.total || 0}
                                        </Badge>
                                    </div>
                                    <div className="space-y-2">
                                        {signatureStatus?.data?.authorisers?.users?.map((user: any) => (
                                            <div key={user.id} className="flex items-center justify-between text-sm">
                                                <span className="text-gray-700">{user.name}</span>
                                                {user.has_signed ? (
                                                    <CheckCircle size={16} className="text-green-600" />
                                                ) : (
                                                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Stage 3: Approve */}
                                <div className={cn(
                                    "relative p-6 rounded-lg border-2 transition-all",
                                    signatureStatus?.data?.current_stage === 'approve' || (currentStep.step === 3 && !currentStep.isComplete)
                                        ? "border-purple-500 bg-purple-50"
                                        : signatureStatus?.data?.approvers?.signed === signatureStatus?.data?.approvers?.total
                                        ? "border-green-500 bg-green-50"
                                        : "border-gray-200 bg-gray-50"
                                )}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                                                signatureStatus?.data?.approvers?.signed === signatureStatus?.data?.approvers?.total
                                                    ? "bg-green-500 text-white"
                                                    : "bg-purple-500 text-white"
                                            )}>
                                                {signatureStatus?.data?.approvers?.signed === signatureStatus?.data?.approvers?.total ? '✓' : '3'}
                                            </div>
                                            <h4 className="font-semibold text-gray-900">Approve</h4>
                                        </div>
                                        <Badge variant={
                                            signatureStatus?.data?.approvers?.signed === signatureStatus?.data?.approvers?.total
                                                ? "default"
                                                : "secondary"
                                        }>
                                            {signatureStatus?.data?.approvers?.signed || 0}/{signatureStatus?.data?.approvers?.total || 0}
                                        </Badge>
                                    </div>
                                    <div className="space-y-2">
                                        {signatureStatus?.data?.approvers?.users?.map((user: any) => (
                                            <div key={user.id} className="flex items-center justify-between text-sm">
                                                <span className="text-gray-700">{user.name}</span>
                                                {user.has_signed ? (
                                                    <CheckCircle size={16} className="text-green-600" />
                                                ) : (
                                                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Workflow Status Info */}
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="text-sm text-gray-600">
                                            <span className="font-semibold">Current Stage:</span> {currentStep.role}
                                        </div>
                                        {signatureStatus?.data?.can_proceed && (
                                            <Badge className="bg-green-100 text-green-700">
                                                Ready to proceed
                                            </Badge>
                                        )}
                                    </div>
                                    {data?.data?.status === 'PENDING' && !workflowStatus?.data?.can_user_act && (
                                        <Button
                                            onClick={async () => {
                                                try {
                                                    await submitForReview();
                                                    await queryClient.invalidateQueries({ queryKey: ["cba", id] });
                                                    toast.success("CBA submitted for review");
                                                } catch (error) {
                                                    toast.error("Failed to submit for review");
                                                }
                                            }}
                                            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                                        >
                                            <CheckCircle size={18} />
                                            Submit for Review
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            {/* Committee Evaluation Tabs - Only for Committee CBAs */}
            {isCommitteeCBA && (
                <Tabs defaultValue={isCommitteeMember ? "my-evaluation" : "committee-overview"} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        {isCommitteeMember && (
                            <TabsTrigger value="my-evaluation">
                                <div className="flex items-center gap-2">
                                    <ClipboardCheck size={16} />
                                    My Tasks
                                </div>
                            </TabsTrigger>
                        )}
                        <TabsTrigger value="committee-overview">
                            <div className="flex items-center gap-2">
                                <Users size={16} />
                                Team Status
                            </div>
                        </TabsTrigger>
                        <TabsTrigger
                            value="consensus-analysis"
                            disabled={!allMembersSubmitted}
                            className="disabled:opacity-50"
                        >
                            <div className="flex items-center gap-2">
                                <BarChart size={16} />
                                Analysis
                            </div>
                        </TabsTrigger>
                        <TabsTrigger
                            value="final-results"
                            disabled={!allMembersSubmitted}
                            className="disabled:opacity-50"
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} />
                                Results
                            </div>
                        </TabsTrigger>
                    </TabsList>

                    {/* Individual Member Evaluation Tab */}
                    {isCommitteeMember && (
                        <TabsContent value="my-evaluation" className="space-y-6">
                            {/* Header Card for Committee Member */}
                            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <User className="text-blue-600" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Your Committee Evaluation Tasks
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Review vendors and provide your evaluation for: <span className="font-medium">{data?.data?.solicitation_title}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="outline" className="text-blue-700 border-blue-300">
                                            Committee Member
                                        </Badge>
                                    </div>
                                </div>
                            </Card>

                            <MemberEvaluationDashboard />
                        </TabsContent>
                    )}

                    {/* Committee Overview Tab */}
                    <TabsContent value="committee-overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Committee Members List */}
                            <div className="lg:col-span-2 space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Committee Members</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {data?.data?.committee_members?.map((member) => {
                                        const memberStatus = memberParticipation?.members?.find(m => m.id === member.id);
                                        const isCurrentUserMember = member.id === currentUser.id;

                                        return (
                                            <div
                                                key={member.id}
                                                className={`p-4 border rounded-lg ${
                                                    isCurrentUserMember
                                                        ? 'border-blue-300 bg-blue-50'
                                                        : memberStatus?.submitted
                                                        ? 'border-green-300 bg-green-50'
                                                        : 'border-gray-200 bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">
                                                            {member.first_name} {member.last_name}
                                                            {isCurrentUserMember && (
                                                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                    You
                                                                </span>
                                                            )}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">{member.designation}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        {memberStatus?.submitted ? (
                                                            <div className="text-green-600 text-sm font-semibold">
                                                                ✓ Submitted
                                                            </div>
                                                        ) : (
                                                            <div className="text-yellow-600 text-sm font-semibold">
                                                                ⏳ Pending
                                                            </div>
                                                        )}
                                                        {memberStatus?.submitted_at && (
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {new Date(memberStatus.submitted_at).toLocaleDateString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
                                <div className="space-y-3">
                                    <div className="bg-white p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">
                                            {memberParticipation?.submitted_members?.length || 0}
                                        </div>
                                        <div className="text-sm text-gray-600">Evaluations Submitted</div>
                                    </div>
                                    <div className="bg-white p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-yellow-600">
                                            {memberParticipation?.pending_members?.length || 0}
                                        </div>
                                        <div className="text-sm text-gray-600">Pending Evaluations</div>
                                    </div>
                                    <div className="bg-white p-4 border rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {Math.round(((memberParticipation?.submitted_members?.length || 0) / (memberParticipation?.total_members || 1)) * 100)}%
                                        </div>
                                        <div className="text-sm text-gray-600">Completion Rate</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Consensus Analysis Tab */}
                    <TabsContent value="consensus-analysis" className="space-y-6">
                        {allMembersSubmitted ? (
                            <ConsensusAnalysis cbaId={id as string} />
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-lg mb-4">
                                    Consensus analysis will be available once all committee members submit their evaluations.
                                </div>
                                <div className="text-sm text-gray-500">
                                    Currently waiting for {memberParticipation?.pending_members?.length || 0} more evaluation(s).
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    {/* Final Results Tab */}
                    <TabsContent value="final-results" className="space-y-6">
                        {allMembersSubmitted ? (
                            <div className="space-y-6">
                                {/* This would integrate with the existing CBA analysis results */}
                                <div className="bg-white border rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Final CBA Results</h3>
                                    <p className="text-gray-600 mb-4">
                                        Based on committee consensus analysis, the following results have been determined:
                                    </p>

                                    {/* This would show the original CBA analysis component but with consensus data */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-blue-800 text-sm">
                                            Integration with existing CBA analysis results will show here.
                                            This will display the final vendor selection based on committee consensus.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-lg mb-4">
                                    Final results will be available once consensus analysis is completed.
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            )}


                {/* RFQ Items Section */}
                {solicitationId && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Package size={24} className="text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">RFQ Items Breakdown</h3>
                                        <p className="text-gray-600 text-sm mt-1">
                                            Detailed procurement items from RFQ: {rfqData?.data?.rfq_id || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300 px-4 py-2">
                                        {rfqData?.data?.solicitation_items?.length || 0} Items
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {(!rfqData?.data?.solicitation_items || rfqData?.data?.solicitation_items?.length === 0) ? (
                            <div className="py-12 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-dashed border-yellow-300 rounded-xl text-center">
                                <Package size={16} />
                                <p className="text-yellow-800 font-semibold text-lg">No items found</p>
                                <p className="text-yellow-600 text-sm mt-1">The RFQ may not have items assigned yet.</p>
                            </div>
                        ) : (
                            <div className="p-6">
                                <div className="overflow-hidden bg-white rounded-lg border border-gray-200">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                                    <div className="flex items-center gap-2">
                                                        <Package size={16} className="text-gray-600" />
                                                        Item Name
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Quantity</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Unit</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Lot</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rfqData.data.solicitation_items.map((item: any, index: number) => (
                                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-semibold text-gray-900">
                                                                {item?.item?.name || item?.description || 'Unnamed Item'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-gray-600 line-clamp-2">
                                                            {item?.description || 'No description available'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="inline-flex items-center justify-center w-16 h-8 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full">
                                                            {item?.quantity || 0}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                            {item?.item?.uom || item?.item_detail?.uom || item?.uom || 'N/A'}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <Badge className="bg-purple-100 text-purple-700 border-0">
                                                            {item?.lot_detail?.name || item?.lot || item?.lot_number || 'N/A'}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Analysis Results Section */}
                <AnalysisResults cbaId={id as string} />

            </div>

            {/* Approval Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CheckCircle className="text-green-600" size={24} />
                            {currentStep.role === 'Reviewer' && 'Review CBA'}
                            {currentStep.role === 'Authoriser' && 'Authorise CBA'}
                            {currentStep.role === 'Approver' && 'Approve CBA'}
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <FormTextArea
                                form={form}
                                name="remarks"
                                label="Comments (Optional)"
                                placeholder="Add any remarks or comments..."
                                rows={4}
                            />
                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    disabled={createApprovalCbaIsLoading}
                                >
                                    Cancel
                                </Button>
                                <FormButton
                                    isLoading={createApprovalCbaIsLoading}
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                >
                                    <CheckCircle size={18} className="mr-2" />
                                    Confirm
                                </FormButton>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Rejection Dialog */}
            <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <XCircle size={24} />
                            Reject CBA at {currentStep.role} Stage
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...rejectForm}>
                        <form onSubmit={rejectForm.handleSubmit(onReject)} className="space-y-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                <p className="text-sm text-red-800">
                                    <strong>Warning:</strong> Rejecting this CBA will set its status to REJECTED and halt the approval workflow.
                                    Please provide a clear reason for rejection.
                                </p>
                            </div>
                            <FormTextArea
                                form={rejectForm}
                                name="comments"
                                label="Rejection Reason *"
                                placeholder="Please explain why you are rejecting this CBA..."
                                rows={5}
                            />
                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setRejectOpen(false);
                                        rejectForm.reset();
                                    }}
                                    disabled={createRejectionCbaIsLoading}
                                >
                                    Cancel
                                </Button>
                                <FormButton
                                    isLoading={createRejectionCbaIsLoading}
                                    type="submit"
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    <XCircle size={18} className="mr-2" />
                                    Confirm Rejection
                                </FormButton>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CompetitiveBidAnalysisDetail;