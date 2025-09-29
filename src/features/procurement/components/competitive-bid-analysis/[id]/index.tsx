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

    const { data, isLoading, error } = CbaAPI.useGetSingleCba(id as string);

    const { approveCba, isLoading: createApprovalCbaIsLoading } = CbaAPI.useApproveCba(id as string);

    // Debug: Log the CBA data to see what we're getting
    console.log("🔍 CBA Detail Data FULL:", {
        data,
        isLoading,
        cbaData: data?.data,
        lot: data?.data?.lot,
        remarks: data?.data?.remarks,
        items: data?.data?.items,
        itemsLength: data?.data?.items?.length,
        itemsType: typeof data?.data?.items,
        assignee: data?.data?.assignee,
        committee_members: data?.data?.committee_members,
        committeeMembersLength: data?.data?.committee_members?.length,
        committeeMembersType: typeof data?.data?.committee_members,
        solicitation: data?.data?.solicitation,
        solicitationType: typeof data?.data?.solicitation,
        fullDataStructure: JSON.stringify(data, null, 2)
    });

    console.log("🔍 CBA API Response Raw:", data);
    console.log("🔍 CBA API Error:", error);
    console.log("🔍 CBA API ID:", id);
    console.log("🔍 CBA API Loading:", isLoading);

    // Get current approval step and role
    const getCurrentApprovalStep = () => {
        const cbaData = data?.data;

        // For now, we'll simulate the workflow based on status
        // In production, this should be based on actual approval workflow data
        const status = cbaData?.status;

        if (status === 'PENDING') {
            // Determine current step based on existing approvals (simulate workflow)
            // This should be replaced with actual workflow data from API
            const currentStepNumber = 1; // Default to first step for now

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
            // Add the current approval step to the submission
            const submissionData = {
                ...formData,
                approval_step: currentStep.role.toLowerCase(),
                step_number: currentStep.step
            };

            await approveCba(submissionData);
            toast.success(`${currentStep.role} approval submitted successfully.`);
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
        <div className="space-y-5">
            <BreadcrumbCard list={breadcrumbs} />

            <GoBack />

            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
                <Card className="border-2 border-orange-200 bg-orange-50 p-4 mb-4">
                    <h4 className="font-semibold text-orange-800 mb-2">🐛 Debug Info</h4>
                    <div className="text-xs text-orange-700 space-y-1">
                        <p>CBA ID: {id}</p>
                        <p>API Loading: {isLoading ? 'Yes' : 'No'}</p>
                        <p>API Error: {error ? JSON.stringify(error) : 'None'}</p>
                        <p>Data Available: {data ? 'Yes' : 'No'}</p>
                        <p>CBA Data: {data?.data ? 'Yes' : 'No'}</p>
                        <p>Lot: {data?.data?.lot || 'Empty'}</p>
                        <p>Assignee: {data?.data?.assignee ? 'Available' : 'Empty'}</p>
                        <p>Committee Members: {data?.data?.committee_members?.length || 0} (Type: {typeof data?.data?.committee_members})</p>
                        <p>Items: {data?.data?.items?.length || 0} (Type: {typeof data?.data?.items})</p>
                        <p>Status: {data?.data?.status || 'Unknown'}</p>
                        <p>Solicitation: {typeof data?.data?.solicitation === 'object' ? 'Object' : data?.data?.solicitation || 'Empty'}</p>
                        {data?.data?.committee_members && data.data.committee_members.length === 0 && (
                            <p className="text-red-600">⚠️ Committee Members array is empty - check CBA creation process</p>
                        )}
                        {data?.data?.items && data.data.items.length === 0 && (
                            <p className="text-red-600">⚠️ Items array is empty - check items assignment in CBA</p>
                        )}
                    </div>
                </Card>
            )}

            {/* CBA Header Section */}
            <Card className="space-y-6 p-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {data?.data?.title || 'Competitive Bid Analysis'}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            RFQ ID: {typeof data?.data?.solicitation === 'object' ? (data?.data?.solicitation as any)?.rfq_id : data?.data?.solicitation || 'N/A'} |
                            CBA Type: {data?.data?.cba_type || 'Standard'}
                        </p>
                    </div>

                    <Badge
                        className={cn(
                            "px-3 py-1 text-sm font-medium",
                            data?.data?.status === "APPROVED" && "bg-green-100 text-green-800",
                            data?.data?.status === "REJECTED" && "bg-red-100 text-red-800",
                            data?.data?.status === "PENDING" && "bg-yellow-100 text-yellow-800",
                            data?.data?.status === "COMPLETED" && "bg-blue-100 text-blue-800"
                        )}
                    >
                        {data?.data?.status || 'DRAFT'}
                    </Badge>
                </div>
            </Card>

            {/* CBA Workflow Progress */}
            <Card className="p-6">
                <h2 className="text-lg font-semibold mb-6 text-gray-900">CBA Process Workflow</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Step 1: Bid Analysis */}
                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                                1
                            </div>
                            <h3 className="font-semibold text-gray-900">Bid Analysis & Selection</h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                            Compare vendor quotes and select winning bids
                        </p>
                        <Link
                            href={`/dashboard/procurement/competitive-bid-analysis/${id}/vendor-analysis?id=${typeof data?.data?.solicitation === 'object' ? (data?.data?.solicitation as any)?.id : data?.data?.solicitation}&cba=${id}`}
                        >
                            <Button className="w-full">
                                <Icon icon="heroicons:chart-bar" className="mr-2" />
                                Perform CBA Analysis
                            </Button>
                        </Link>
                    </div>

                    {/* Step 2: Approval Workflow */}
                    <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                                2
                            </div>
                            <h3 className="font-semibold text-gray-900">Approval Workflow</h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                            Complete approval flow through designated committee members and generate purchase orders
                        </p>

                        {/* Approval Flow Steps */}
                        <div className="space-y-3 mb-4">
                            <div className="text-xs space-y-2">
                                <div className="flex items-center">
                                    <div className={cn(
                                        "w-4 h-4 rounded-full mr-2 text-white text-xs flex items-center justify-center",
                                        currentStep.step > 1 ? "bg-green-500" :
                                        currentStep.step === 1 ? "bg-blue-500" : "bg-gray-300"
                                    )}>1</div>
                                    <span className={cn(
                                        currentStep.step > 1 ? "text-green-600 font-semibold" :
                                        currentStep.step === 1 ? "text-blue-600 font-semibold" : "text-gray-500"
                                    )}>Reviewer</span>
                                    {currentStep.step > 1 && (
                                        <Icon icon="heroicons:check-circle" className="ml-2 text-green-500" fontSize={16} />
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <div className={cn(
                                        "w-4 h-4 rounded-full mr-2 text-white text-xs flex items-center justify-center",
                                        currentStep.step > 2 ? "bg-green-500" :
                                        currentStep.step === 2 ? "bg-blue-500" : "bg-gray-300"
                                    )}>2</div>
                                    <span className={cn(
                                        currentStep.step > 2 ? "text-green-600 font-semibold" :
                                        currentStep.step === 2 ? "text-blue-600 font-semibold" : "text-gray-500"
                                    )}>Authoriser</span>
                                    {currentStep.step > 2 && (
                                        <Icon icon="heroicons:check-circle" className="ml-2 text-green-500" fontSize={16} />
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <div className={cn(
                                        "w-4 h-4 rounded-full mr-2 text-white text-xs flex items-center justify-center",
                                        currentStep.step > 3 || currentStep.isComplete ? "bg-green-500" :
                                        currentStep.step === 3 ? "bg-blue-500" : "bg-gray-300"
                                    )}>3</div>
                                    <span className={cn(
                                        currentStep.step > 3 || currentStep.isComplete ? "text-green-600 font-semibold" :
                                        currentStep.step === 3 ? "text-blue-600 font-semibold" : "text-gray-500"
                                    )}>Approver</span>
                                    {(currentStep.step > 3 || currentStep.isComplete) && (
                                        <Icon icon="heroicons:check-circle" className="ml-2 text-green-500" fontSize={16} />
                                    )}
                                </div>
                            </div>
                        </div>
                        {data?.data?.status === "PENDING" && !currentStep.isComplete ? (
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="default" className="w-full">
                                        <Icon icon="heroicons:check-circle" className="mr-2" />
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
                                                    Submit {currentStep.role} Decision
                                                </FormButton>
                                            </div>
                                        </form>
                                    </Form>
                                </DialogContent>
                            </Dialog>
                        ) : (
                            <Button variant="outline" disabled className="w-full">
                                <Icon icon="heroicons:check-circle" className="mr-2" />
                                {currentStep.isComplete ? "All Approvals Complete ✅" : "Awaiting Next Approval"}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex justify-center mt-6 pt-6 border-t">
                    <Link
                        href={generatePath(RouteEnum.PROCUREMENT_CBA_REPORT, { id: id as string })}
                    >
                        <Button variant="outline">
                            <Icon icon="heroicons:document-text" className="mr-2" />
                            Download CBA Report
                        </Button>
                    </Link>
                </div>
            </Card>

            {/* CBA Details Information */}
            <Card className="space-y-6 p-8">

                <h4 className="text-green-dark text-base font-semibold">
                    Status{" "}
                    <Badge
                        className={cn(
                            data?.data?.status === "APPROVED" &&
                                "bg-green-200 text-green-500",
                            data?.data?.status === "REJECTED" &&
                                "bg-red-200 text-red-500",
                            data?.data?.status === "PENDING" &&
                                "bg-yellow-200 text-yellow-500",
                            data?.data?.status === "COMPLETED" &&
                                "bg-blue-200 text-blue-500"
                        )}
                    >
                        {data?.data?.status.toLowerCase()}
                    </Badge>
                </h4>

                <div className="flex items-center gap-10">
                    <div className="flex gap-3 items-center">
                        <Icon icon="ooui:reference" fontSize={18} />
                        <h6>{data?.data?.lot || 'No Lot Assigned'}</h6>
                    </div>
                    <div className="flex gap-3 items-center">
                        <Icon
                            icon="lets-icons:date-today-duotone"
                            fontSize={18}
                        />
                        <h6>{data?.data?.cba_date || 'Date Not Set'}</h6>
                    </div>
                    <div className="flex gap-3 items-center">
                        <Icon
                            icon="solar:case-minimalistic-bold-duotone"
                            fontSize={18}
                        />
                        <h6>{data?.data?.cba_type || 'Standard'}</h6>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="font-semibold text-base">Remarks:</h2>
                    <h4 className=" text-gray-500">{data?.data?.remarks || 'No remarks provided'}</h4>
                </div>

                <div className="space-y-4">
                    <h2 className="font-semibold text-yellow-darker text-base">
                        Items:
                    </h2>

                    {(!data?.data?.items || data?.data?.items?.length === 0) ? (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-yellow-800 text-sm">No items assigned to this CBA</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-5">
                            {data?.data?.items?.map((item: SolicitationItems) => (
                            <Card
                                key={item?.id}
                                className="border-yellow-darker space-y-3"
                            >
                                <div className="flex items-center gap-5">
                                    <h4 className="w-1/4 font-semibold">
                                        Item:
                                    </h4>
                                    <h4>{item?.item?.name}</h4>
                                </div>
                                <div className="flex items-center gap-5">
                                    <h4 className="w-1/4 font-semibold">
                                        Quantity:
                                    </h4>
                                    <h4>{item?.quantity}</h4>
                                </div>
                                <div className="flex items-center gap-5">
                                    <h4 className="w-1/4 font-semibold">
                                        Lot:
                                    </h4>
                                    <h4>{item?.lot}</h4>
                                </div>
                            </Card>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <h2 className="font-semibold text-yellow-darker text-base">
                        Assignee:
                    </h2>

                    {!data?.data?.assignee ? (
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="text-gray-600 text-sm">No assignee assigned to this CBA</p>
                        </div>
                    ) : (
                        <Card className="border-yellow-darker space-y-3 w-full md:w-1/2">
                            <div className="flex items-center gap-5">
                                <h4 className="w-1/3 font-semibold">First Name:</h4>
                                <h4>{data?.data?.assignee?.first_name || 'N/A'}</h4>
                            </div>
                            <div className="flex items-center gap-5">
                                <h4 className="w-1/3 font-semibold">Last Name:</h4>
                                <h4>{data?.data?.assignee?.last_name || 'N/A'}</h4>
                            </div>
                            <div className="flex items-center gap-5">
                                <h4 className="w-1/3 font-semibold">
                                    Designation:
                                </h4>
                                <h4>{data?.data?.assignee?.designation || 'N/A'}</h4>
                            </div>
                        </Card>
                    )}
                </div>

                <div className="space-y-4">
                    <h2 className="font-semibold text-yellow-darker text-base">
                        Committee Members:
                    </h2>

                    {(!data?.data?.committee_members || data?.data?.committee_members?.length === 0) ? (
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="text-gray-600 text-sm">No committee members assigned to this CBA</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-5">
                            {data?.data?.committee_members?.map(
                                (member: CommitteeMemberData) => (
                                <Card
                                    key={member?.id}
                                    className="border-yellow-darker space-y-3"
                                >
                                    <div className="flex items-center gap-5">
                                        <h4 className="w-1/3 font-semibold">
                                            First Name:
                                        </h4>
                                        <h4>{member?.first_name || 'N/A'}</h4>
                                    </div>
                                    <div className="flex items-center gap-5">
                                        <h4 className="w-1/3 font-semibold">
                                            Last Name:
                                        </h4>
                                        <h4>{member?.last_name || 'N/A'}</h4>
                                    </div>
                                    <div className="flex items-center gap-5">
                                        <h4 className="w-1/3 font-semibold">
                                            Designation:
                                        </h4>
                                        <h4>{member?.designation || 'N/A'}</h4>
                                    </div>
                                </Card>
                                )
                            )}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default CompetitiveBidAnalysisDetail;
