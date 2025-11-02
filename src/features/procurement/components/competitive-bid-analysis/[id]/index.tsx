"use client";

import { Button } from "components/ui/button";
import { useParams } from "next/navigation";
import Link from "next/link";
import { LoadingSpinner } from "components/Loading";
import BreadcrumbCard from "components/Breadcrumb";
import CbaAPI from "@/features/procurement/controllers/cbaController";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import { Icon } from "@iconify/react";
import { SolicitationItems } from "definations/procurement-types/solicitation";
import GoBack from "components/GoBack";
import { CommitteeMemberData } from "definations/procurement-types/cba";
import { RouteEnum } from "constants/RouterConstants";
import { cn } from "lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "components/ui/dialog";
import { Form } from "components/ui/form";
import FormSelect from "components/atoms/FormSelectField";
import { useForm } from "react-hook-form";
import { SelectContent, SelectItem } from "components/ui/select";
import FormTextArea from "components/atoms/FormTextArea";
import FormButton from "@/components/FormButton";
import { z } from "zod";
import { CbaApprovalSchema } from "@/features/procurement/types/procurement-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { useGetSolicitationSubmission } from "@/features/procurement/controllers/vendorBidSubmissionsController";
import { useGetSingleSolicitation } from "@/features/procurement/controllers/solicitationController";
import AnalysisResults from "./AnalysisResults";
import SignatureWorkflowAPI from "@/features/procurement/controllers/signatureWorkflowController";
import { useQueryClient } from "@tanstack/react-query";
import { useGetMemberParticipation, useCurrentUser } from "@/features/procurement/controllers/committeeEvaluationController";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import CommitteeParticipationBanner from "./committee-evaluation/CommitteeParticipationBanner";
import MemberEvaluationDashboard from "./committee-evaluation/MemberEvaluationDashboard";
import ConsensusAnalysis from "./committee-evaluation/ConsensusAnalysis";
import { useMemo } from "react";

const generatePath = (route: string, params?: Record<string, any>): string => {
  let path = route;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, String(value));
    });
  }
  return path;
};

const CompetitiveBidAnalysisDetail = () => {
    const { id } = useParams();
    const [open, setOpen] = useState(false);
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

    // Fetch vendor submissions
    const { data: submissionsData } = useGetSolicitationSubmission(solicitationId as string, !!solicitationId);

    // Use signature workflow for approvals instead of the old approval system
    const { data: workflowStatus } = SignatureWorkflowAPI.useCbaWorkflowStatus(id as string);
    const { approveWorkflowStep, isLoading: createApprovalCbaIsLoading } = SignatureWorkflowAPI.useApproveCbaWorkflowStep(id as string);

    // Get current approval step and role
    const getCurrentApprovalStep = () => {
        const cbaData = data?.data;
        const status = cbaData?.status;

        if (status === 'PENDING') {
            const currentStepNumber = 1;

            switch (currentStepNumber) {
                case 1:
                    return { step: 1, role: 'Reviewer', isComplete: false };
                case 2:
                    return { step: 2, role: 'Authoriser', isComplete: false };
                case 3:
                    return { step: 3, role: 'Approver', isComplete: false };
                default:
                    return { step: 1, role: 'Reviewer', isComplete: false };
            }
        } else if (status === 'APPROVED') {
            return { step: 4, role: 'Completed', isComplete: true };
        } else {
            return { step: 1, role: 'Reviewer', isComplete: false };
        }
    };

    const currentStep = getCurrentApprovalStep();

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

    const { handleSubmit } = form;

    const onSubmit = async (formData: z.infer<typeof CbaApprovalSchema>) => {
        try {
            // Map step number to workflow step name
            const stepMapping: Record<number, 'reviewed' | 'authorized' | 'approved'> = {
                1: 'reviewed',
                2: 'authorized',
                3: 'approved'
            };

            const workflowStep = stepMapping[currentStep.step];

            const submissionData = {
                step: workflowStep,
                remarks: formData.remarks,
                signature: '' // Optional signature field
            };

            if (formData.status === 'APPROVED') {
                await approveWorkflowStep(submissionData);

                // Invalidate queries to refresh CBA data
                await queryClient.invalidateQueries({ queryKey: ["cba", id] });
                await queryClient.invalidateQueries({ queryKey: ["cbas"] });
                await queryClient.invalidateQueries({ queryKey: ["cba-workflow-status", id] });
                await queryClient.invalidateQueries({ queryKey: ["cba-signature-workflow", id] });

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

    if (isLoading) return <LoadingSpinner />;

    const breadcrumbs = [
        { name: "Procurement", icon: true },
        { name: "Competitive Bid Analysis", icon: true },
        { name: "Detail", icon: false },
    ];

    return (
        <div className="space-y-6 pb-8">
            <BreadcrumbCard list={breadcrumbs} />

            <div className="flex items-center justify-between">
                <GoBack />
                <Link href={generatePath(RouteEnum.PROCUREMENT_CBA_REPORT, { id: id as string })}>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Icon icon="solar:document-text-bold-duotone" fontSize={18} />
                        Download Report
                    </Button>
                </Link>
            </div>

            {/* Hero Header Section */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl p-8 text-white shadow-lg">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <Icon icon="solar:chart-square-bold-duotone" fontSize={28} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">
                                    {isCommitteeCBA
                                        ? 'Committee-Based CBA Analysis'
                                        : (data?.data?.title || 'Competitive Bid Analysis')
                                    }
                                </h1>
                                <p className="text-blue-100 text-sm mt-1">
                                    Analysis ID: {(id as string).slice(0, 8)}...
                                    {isCommitteeCBA && (
                                        <span className="ml-2 bg-white/20 px-2 py-1 rounded text-xs">
                                            Committee Evaluation
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-4">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                                <Icon icon="solar:document-text-bold-duotone" fontSize={18} />
                                <span className="text-sm">RFQ: {rfqData?.data?.rfq_id || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                                <Icon icon="solar:case-minimalistic-bold-duotone" fontSize={18} />
                                <span className="text-sm">{data?.data?.cba_type || 'Standard'}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                                <Icon icon="solar:calendar-bold-duotone" fontSize={18} />
                                <span className="text-sm">{data?.data?.cba_date ? new Date(data.data.cba_date).toLocaleDateString() : 'Date Not Set'}</span>
                            </div>
                            {data?.data?.lot && (
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                                    <Icon icon="solar:layers-minimalistic-bold-duotone" fontSize={18} />
                                    <span className="text-sm">Lot: {data.data.lot}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <Badge
                        className={cn(
                            "px-4 py-2 text-base font-semibold shadow-lg",
                            data?.data?.status === "APPROVED" && "bg-green-500 text-white hover:bg-green-600",
                            data?.data?.status === "REJECTED" && "bg-red-500 text-white hover:bg-red-600",
                            data?.data?.status === "PENDING" && "bg-amber-500 text-white hover:bg-amber-600",
                            data?.data?.status === "COMPLETED" && "bg-blue-500 text-white hover:bg-blue-600"
                        )}
                    >
                        <Icon icon="solar:verified-check-bold" className="mr-2" fontSize={18} />
                        {data?.data?.status || 'DRAFT'}
                    </Badge>
                </div>

                {data?.data?.remarks && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <div className="flex items-start gap-2">
                            <Icon icon="solar:notes-bold-duotone" fontSize={20} className="text-blue-200 mt-0.5" />
                            <div>
                                <p className="text-xs text-blue-200 font-semibold mb-1">Remarks</p>
                                <p className="text-sm text-white">{data.data.remarks}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Committee Participation Banner - Only for Committee CBAs */}
            {isCommitteeCBA && (
                <CommitteeParticipationBanner
                    memberParticipation={memberParticipation}
                    allSubmitted={allMembersSubmitted}
                    onSendReminders={handleSendReminders}
                />
            )}

            {/* Committee Evaluation Tabs - Only for Committee CBAs */}
            {isCommitteeCBA && (
                <Tabs defaultValue={isCommitteeMember ? "my-evaluation" : "committee-overview"} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        {isCommitteeMember && (
                            <TabsTrigger value="my-evaluation">My Evaluation</TabsTrigger>
                        )}
                        <TabsTrigger value="committee-overview">Committee Overview</TabsTrigger>
                        <TabsTrigger
                            value="consensus-analysis"
                            disabled={!allMembersSubmitted}
                            className="disabled:opacity-50"
                        >
                            Consensus Analysis
                        </TabsTrigger>
                        <TabsTrigger
                            value="final-results"
                            disabled={!allMembersSubmitted}
                            className="disabled:opacity-50"
                        >
                            Final Results
                        </TabsTrigger>
                    </TabsList>

                    {/* Individual Member Evaluation Tab */}
                    {isCommitteeMember && (
                        <TabsContent value="my-evaluation" className="space-y-6">
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

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bid Analysis Action */}
                <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                            <Icon icon="solar:chart-square-bold" fontSize={28} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Bid Analysis & Selection</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Compare vendor quotes, evaluate bids, and select winning proposals
                            </p>
                            <Link
                                href={`/dashboard/procurement/competitive-bid-analysis/${id}/vendor-analysis?id=${typeof data?.data?.solicitation === 'object' ? (data?.data?.solicitation as any)?.id : data?.data?.solicitation}&cba=${id}`}
                            >
                                <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md">
                                    <Icon icon="solar:chart-square-bold" className="mr-2" fontSize={18} />
                                    Perform Analysis
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>

                {/* View Analysis Results */}
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                            <Icon icon="solar:clipboard-check-bold" fontSize={28} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">View Analysis Results</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Review submitted analysis results and award details
                            </p>
                            <Link
                                href={`/dashboard/procurement/competitive-bid-analysis/${id}/analysis-results?id=${typeof data?.data?.solicitation === 'object' ? (data?.data?.solicitation as any)?.id : data?.data?.solicitation}&cba=${id}`}
                            >
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                                    <Icon icon="solar:eye-bold" className="mr-2" fontSize={18} />
                                    View Results
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>

                {/* Approval Workflow Action */}
                <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                            <Icon icon="solar:shield-check-bold" fontSize={28} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Approval Workflow</h3>
                            <p className="text-sm text-gray-600 mb-2">
                                3-step approval process
                            </p>

                            {/* Mini Progress Indicator */}
                            <div className="flex items-center gap-2 mb-4">
                                {[1, 2, 3].map((step) => (
                                    <div key={step} className="flex items-center">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                                            currentStep.step > step ? "bg-green-500 text-white" :
                                            currentStep.step === step ? "bg-purple-600 text-white ring-4 ring-purple-200" :
                                            "bg-gray-200 text-gray-500"
                                        )}>
                                            {currentStep.step > step ? <Icon icon="solar:check-circle-bold" fontSize={16} /> : step}
                                        </div>
                                        {step < 3 && (
                                            <div className={cn(
                                                "w-6 h-0.5 transition-all",
                                                currentStep.step > step ? "bg-green-500" : "bg-gray-200"
                                            )} />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {data?.data?.status === "PENDING" && !currentStep.isComplete ? (
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-md">
                                            <Icon icon="solar:shield-check-bold" className="mr-2" fontSize={18} />
                                            {currentStep.role} Approval
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-semibold mb-5">
                                                CBA {currentStep.role} Approval
                                            </DialogTitle>
                                            <div className="text-sm text-gray-600 mb-4">
                                                Step {currentStep.step} of 3: {currentStep.role} Review
                                            </div>
                                        </DialogHeader>
                                        <Form {...form}>
                                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                                <FormSelect
                                                    name="status"
                                                    label="Decision"
                                                    placeholder="Select approval decision"
                                                    required
                                                >
                                                    <SelectContent>
                                                        <SelectItem value="APPROVED">
                                                            ✅ {currentStep.step === 3 ? 'Approve & Generate Purchase Orders' : `Approve & Forward to ${currentStep.step === 1 ? 'Authoriser' : 'Approver'}`}
                                                        </SelectItem>
                                                        <SelectItem value="REJECTED">
                                                            ❌ Reject & Request CBA Redo
                                                        </SelectItem>
                                                    </SelectContent>
                                                </FormSelect>

                                                <FormTextArea
                                                    name="remarks"
                                                    label={`${currentStep.role} Remarks`}
                                                    placeholder={`Enter ${currentStep.role.toLowerCase()} comments and justification`}
                                                    rows={4}
                                                />

                                                <div className="flex justify-end">
                                                    <FormButton
                                                        loading={createApprovalCbaIsLoading}
                                                        disabled={createApprovalCbaIsLoading}
                                                        type="submit"
                                                    >
                                                        Submit Decision
                                                    </FormButton>
                                                </div>
                                            </form>
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                            ) : (
                                <Button variant="outline" disabled className="w-full">
                                    <Icon icon="solar:check-circle-bold" className="mr-2" fontSize={18} />
                                    {currentStep.isComplete ? "All Approvals Complete" : "Awaiting Approval"}
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* RFQ Items Section */}
            {solicitationId && (
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Icon icon="solar:box-bold-duotone" fontSize={22} className="text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">RFQ Items</h2>
                                <p className="text-sm text-gray-500">Items from RFQ: {rfqData?.data?.rfq_id || 'N/A'}</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 px-3 py-1">
                            {rfqData?.data?.solicitation_items?.length || 0} Items
                        </Badge>
                    </div>

                    {(!rfqData?.data?.solicitation_items || rfqData?.data?.solicitation_items?.length === 0) ? (
                        <div className="py-12 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-dashed border-yellow-300 rounded-xl text-center">
                            <Icon icon="solar:box-bold-duotone" fontSize={56} className="mx-auto mb-4 text-yellow-500 opacity-50" />
                            <p className="text-yellow-800 font-semibold text-lg">No items found</p>
                            <p className="text-yellow-600 text-sm mt-1">The RFQ may not have items assigned yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse bg-white">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <Icon icon="solar:box-bold-duotone" fontSize={16} />
                                                Item Name
                                            </div>
                                        </th>
                                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-700">Description</th>
                                        <th className="border border-gray-200 px-4 py-3 text-center text-sm font-bold text-gray-700">Quantity</th>
                                        <th className="border border-gray-200 px-4 py-3 text-center text-sm font-bold text-gray-700">UOM</th>
                                        <th className="border border-gray-200 px-4 py-3 text-center text-sm font-bold text-gray-700">Lot</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rfqData.data.solicitation_items.map((item: any, index: number) => (
                                        <tr key={index} className="hover:bg-blue-50 transition-colors">
                                            <td className="border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-900">
                                                {item?.item?.name || item?.description || 'N/A'}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                                                {item?.description || 'No description'}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-center font-semibold">
                                                {item?.quantity || 0}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-center">
                                                <Badge variant="outline" className="bg-gray-50">
                                                    {item?.item?.uom || 'N/A'}
                                                </Badge>
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-center">
                                                <Badge className="bg-blue-100 text-blue-700 border-0">
                                                    {item?.lot || 'N/A'}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            )}

            {/* Analysis Results Section */}
            <AnalysisResults cbaId={id as string} />

            {/* Vendor Submissions Section */}
            {solicitationId && (
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Icon icon="solar:users-group-two-rounded-bold-duotone" fontSize={22} className="text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Vendor Submissions</h2>
                                <p className="text-sm text-gray-500">Competing bids for this RFQ</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 px-3 py-1">
                            {submissionsData?.data?.data?.results?.length || 0} Vendors
                        </Badge>
                    </div>

                    {!submissionsData?.data?.data?.results || submissionsData.data.data.results.length === 0 ? (
                        <div className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-xl text-center">
                            <Icon icon="solar:users-group-two-rounded-bold-duotone" fontSize={56} className="mx-auto mb-4 text-blue-500 opacity-50" />
                            <p className="text-blue-800 font-semibold text-lg">No vendor submissions yet</p>
                            <p className="text-blue-600 text-sm mt-1">Vendors haven't submitted their bids for this RFQ.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {submissionsData.data.data.results.map((submission: any, index: number) => (
                                <div
                                    key={index}
                                    className="border-2 border-gray-200 rounded-xl p-5 bg-gradient-to-br from-white to-green-50 hover:shadow-xl hover:border-green-300 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                                                <Icon icon="solar:user-bold" fontSize={22} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-base">
                                                    {submission?.vendor?.name ||
                                                     submission?.vendor?.business_name ||
                                                     submission?.vendor?.company_name ||
                                                     submission?.vendor_name ||
                                                     'Unknown Vendor'}
                                                </h3>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    ID: {(submission?.vendor?.id || submission?.vendor_id || 'N/A').toString().slice(0, 8)}...
                                                </p>
                                            </div>
                                        </div>
                                        <Badge className="bg-green-600 text-white border-0 shadow-sm">
                                            <Icon icon="solar:check-circle-bold" className="mr-1" fontSize={12} />
                                            Submitted
                                        </Badge>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm bg-white rounded-lg p-2 border border-gray-100">
                                            <Icon icon="solar:calendar-bold-duotone" fontSize={18} className="text-gray-400" />
                                            <span className="text-gray-700 font-medium">
                                                {submission?.submitted_date || submission?.submission_date || submission?.created_at || submission?.submitted_at
                                                    ? new Date(submission.submitted_date || submission.submission_date || submission.created_at || submission.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                    : 'Date N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm bg-white rounded-lg p-2 border border-gray-100">
                                            <Icon icon="solar:document-bold-duotone" fontSize={18} className="text-gray-400" />
                                            <span className="text-gray-700 font-medium">
                                                {submission?.items?.length ||
                                                 submission?.vendor_bid_items?.length ||
                                                 submission?.bid_items?.length ||
                                                 submission?.submission_items?.length ||
                                                 0} item(s) quoted
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-gray-200">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-amber-50 p-2 rounded-lg">
                                            <Icon icon="solar:lock-password-bold-duotone" fontSize={16} className="text-amber-600" />
                                            <span className="font-medium text-amber-700">Pricing details confidential</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            )}

            {/* Team Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Assignee */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Icon icon="solar:user-id-bold-duotone" fontSize={22} className="text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Assignee</h2>
                            <p className="text-sm text-gray-500">Responsible person</p>
                        </div>
                    </div>

                    {!data?.data?.assignee ? (
                        <div className="py-8 bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-dashed border-gray-300 rounded-xl text-center">
                            <Icon icon="solar:user-id-bold-duotone" fontSize={40} className="mx-auto mb-3 text-gray-400 opacity-50" />
                            <p className="text-gray-600 font-medium">No assignee assigned</p>
                        </div>
                    ) : (
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md">
                                    <span className="text-2xl font-bold text-white">
                                        {data.data.assignee.name?.split(' ')[0]?.[0]}{data.data.assignee.name?.split(' ')[1]?.[0] || ''}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {data.data.assignee.name || 'N/A'}
                                    </h3>
                                    <p className="text-sm text-gray-600">Assignee</p>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Committee Members */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Icon icon="solar:users-group-rounded-bold-duotone" fontSize={22} className="text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Committee</h2>
                                <p className="text-sm text-gray-500">Evaluation team</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300 px-3 py-1">
                            {data?.data?.committee_members?.length || 0} Members
                        </Badge>
                    </div>

                    {(!data?.data?.committee_members || data?.data?.committee_members?.length === 0) ? (
                        <div className="py-8 bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-dashed border-gray-300 rounded-xl text-center">
                            <Icon icon="solar:users-group-rounded-bold-duotone" fontSize={40} className="mx-auto mb-3 text-gray-400 opacity-50" />
                            <p className="text-gray-600 font-medium">No committee members assigned</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {data.data.committee_members.map((member: CommitteeMemberData) => (
                                <div
                                    key={member.id}
                                    className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                                            <span className="text-lg font-bold text-white">
                                                {member.first_name?.[0]}{member.last_name?.[0]}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">
                                                {member.first_name} {member.last_name}
                                            </h4>
                                            <p className="text-sm text-gray-600">{member.designation || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default CompetitiveBidAnalysisDetail;