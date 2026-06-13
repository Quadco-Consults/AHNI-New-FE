"use client";
import Card from "@/components/Card";
import { useParams, useRouter } from "next/navigation";
import { useGetSingleWorkPlan } from "@/features/programs/controllers/workPlanController";
import DataTable from "@/components/Table/DataTable";
import BreadcrumbCard, { TBreadcrumbList } from "@/components/Breadcrumb";
import { costSheetsActivitiesColumns } from "@/features/programs/components/table-columns/plan/cost-sheets-activities";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatNumberCurrency } from "@/utils/utls";
import { useAppDispatch } from "@/hooks/useStore";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dialogs";

export default function CostSheetsActivitiesList() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const workPlanId = params?.workPlanId as string;

    const { data: workPlanData, isLoading } = useGetSingleWorkPlan(workPlanId);
    const workPlan = workPlanData?.data;

    const handleBulkUpload = () => {
        dispatch(
            openDialog({
                type: DialogType.WORKPLAN_COST_SHEET_UPLOAD_MODAL,
                dialogProps: {
                    header: "Bulk Upload Cost Sheets",
                    width: "max-w-5xl",
                    workPlanId,
                    workPlanTitle: workPlan?.project?.title,
                    activitiesCount: workPlan?.activities?.length || 0,
                },
            })
        );
    };

    const breadcrumbs: TBreadcrumbList[] = [
        { name: "Programs", icon: true },
        { name: "Plans", icon: true },
        { name: "Cost Sheets", icon: true, link: "/dashboard/programs/plan/cost-sheets" },
        { name: workPlan?.project?.title || "Loading...", icon: false },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner />
            </div>
        );
    }

    if (!workPlan) {
        return (
            <div className="space-y-5">
                <BreadcrumbCard list={breadcrumbs} />
                <Card>
                    <div className="p-8 text-center text-gray-500">
                        Work plan not found
                    </div>
                </Card>
            </div>
        );
    }

    const activities = workPlan.activities || [];

    return (
        <div className="space-y-5">
            <BreadcrumbCard list={breadcrumbs} />

            {/* Header Section */}
            <Card className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <Button
                                variant="ghost"
                                onClick={() => router.push("/dashboard/programs/plan/cost-sheets")}
                                className="flex items-center gap-2 -ml-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back to Work Plans
                            </Button>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {workPlan.project?.title || workPlan.project}
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            View and manage cost sheets for work plan activities. Click on an activity to view or create its detailed cost breakdown.
                        </p>
                    </div>
                    <Button
                        onClick={handleBulkUpload}
                        className="flex items-center gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        Bulk Upload Cost Sheets
                    </Button>
                </div>
            </Card>

            {/* Work Plan Summary */}
            <Card className="p-6">
                <div className="border-b pb-4 mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                        Work Plan Summary
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 uppercase">Financial Year</p>
                        <Badge variant="outline" className="text-sm">
                            {workPlan.financial_year?.year || workPlan.financial_year || "N/A"}
                        </Badge>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 uppercase">Total Budget</p>
                        <p className="text-lg font-bold text-green-700">
                            {formatNumberCurrency(
                                workPlan.project?.budget || workPlan.budget || 0,
                                workPlan.project?.currency || workPlan.currency || "NGN"
                            )}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 uppercase">Total Activities</p>
                        <p className="text-lg font-bold text-gray-900">
                            {activities.length}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 uppercase">Project Partners</p>
                        <p className="text-sm text-gray-700">
                            {workPlan.project?.partners?.map((p: any) => p.name).join(", ") ||
                             workPlan.project_partners?.join(", ") || "N/A"}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Activities Table */}
            <Card>
                <div className="p-6 border-b">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                        Activities List
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Click on an activity to view or create its cost sheet. Each cost sheet breaks down the total cost into sub-activities with detailed calculations.
                    </p>
                </div>

                <div className="p-6">
                    {activities.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 font-medium">No activities found for this work plan.</p>
                            <p className="text-sm text-gray-400 mt-2">Please upload activities first.</p>
                        </div>
                    ) : (
                        <DataTable
                            data={activities}
                            columns={costSheetsActivitiesColumns(workPlanId)}
                            isLoading={false}
                        />
                    )}
                </div>
            </Card>
        </div>
    );
}
