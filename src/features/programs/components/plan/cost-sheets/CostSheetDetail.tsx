"use client";
import Card from "@/components/Card";
import { useParams, useRouter } from "next/navigation";
import { useGetSingleWorkPlan } from "@/features/programs/controllers/workPlanController";
import { useGetActivityCostSheets } from "@/features/programs/controllers/activityCostSheetController";
import BreadcrumbCard, { TBreadcrumbList } from "@/components/Breadcrumb";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/hooks/useStore";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dailogs";
import { getCostSheetStatusStyling, calculateTotalCost } from "@/features/programs/types/activity-cost-sheet";
import DataTable from "@/components/Table/DataTable";
import { costSheetSubActivitiesColumns } from "@/features/programs/components/table-columns/plan/cost-sheet-sub-activities";

export default function CostSheetDetail() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const workPlanId = params?.workPlanId as string;
    const activityId = params?.activityId as string;

    const { data: workPlanData, isLoading: loadingWorkPlan } = useGetSingleWorkPlan(workPlanId);
    const { data: costSheetsData, isLoading: loadingCostSheets } = useGetActivityCostSheets(activityId);

    const workPlan = workPlanData?.data;
    const activity = workPlan?.activities?.find((a) => a.id === activityId);
    const costSheets = costSheetsData?.results || [];

    const breadcrumbs: TBreadcrumbList[] = [
        { name: "Programs", icon: true },
        { name: "Plans", icon: true },
        { name: "Cost Sheets", icon: true, link: "/dashboard/programs/plan/cost-sheets" },
        {
            name: workPlan?.project?.title || "Loading...",
            icon: true,
            link: `/dashboard/programs/plan/cost-sheets/${workPlanId}`
        },
        { name: activity?.activity_number || "Activity", icon: false },
    ];

    if (loadingWorkPlan || loadingCostSheets) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner />
            </div>
        );
    }

    if (!workPlan || !activity) {
        return (
            <div className="space-y-5">
                <BreadcrumbCard list={breadcrumbs} />
                <Card>
                    <div className="p-8 text-center text-gray-500">
                        Activity not found
                    </div>
                </Card>
            </div>
        );
    }

    // Calculate totals and validation status
    const budgetTotal = Number(activity.total_amount_ngn) || 0;
    const costSheetTotal = costSheets.reduce((sum, sheet) => sum + sheet.total_cost_ngn, 0);
    const variance = budgetTotal - costSheetTotal;
    const variancePercentage = budgetTotal > 0 ? Math.abs((variance / budgetTotal) * 100) : 0;

    // Determine validation status
    let validationStatus: 'VALIDATED' | 'REVIEW' | 'MISMATCH' | 'MISSING' = 'MISSING';
    if (costSheets.length > 0) {
        if (variancePercentage < 0.01) {
            validationStatus = 'VALIDATED';
        } else if (variancePercentage < 5) {
            validationStatus = 'REVIEW';
        } else {
            validationStatus = 'MISMATCH';
        }
    }

    const statusStyling = getCostSheetStatusStyling(validationStatus);

    const handleAddCostSheet = () => {
        dispatch(
            openDialog({
                type: DialogType.ACTIVITY_COST_SHEET_MODAL,
                dialogProps: {
                    header: "Add Sub-Activity",
                    width: "max-w-2xl",
                    activityId,
                    workPlanId,
                },
            })
        );
    };

    const handleUploadCostSheet = () => {
        dispatch(
            openDialog({
                type: DialogType.COST_SHEET_UPLOAD_MODAL,
                dialogProps: {
                    header: "Bulk Upload Sub-Activities",
                    width: "max-w-4xl",
                    activityId,
                    activityNumber: activity?.activity_number,
                },
            })
        );
    };

    return (
        <div className="space-y-5">
            <BreadcrumbCard list={breadcrumbs} />

            {/* Back Button */}
            <div>
                <Button
                    variant="outline"
                    onClick={() => router.push(`/dashboard/programs/plan/cost-sheets/${workPlanId}`)}
                    className="flex gap-2"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Activities
                </Button>
            </div>

            {/* Activity Information Card */}
            <Card>
                <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Activity: {activity.activity_number}
                            </h2>
                            <p className="text-gray-700 text-sm mb-1">
                                <strong>Budget Line:</strong> {typeof activity.budget_line === 'object' && activity.budget_line
                                    ? (activity.budget_line?.name || activity.budget_line?.code || "N/A")
                                    : (activity.budget_line || "N/A")}
                            </p>
                        </div>
                        <Badge className={statusStyling.className} variant="outline">
                            {statusStyling.icon} {statusStyling.label}
                        </Badge>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                        <p className="text-sm text-gray-800">
                            <strong>Description:</strong> {activity.activity}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                        <div className="bg-white p-3 rounded-lg border">
                            <p className="text-xs text-gray-600">Lead Department</p>
                            <p className="font-semibold text-gray-800 mt-1">
                                {typeof activity.lead_dept === 'object' && activity.lead_dept
                                    ? (activity.lead_dept?.name || activity.lead_dept?.code || "N/A")
                                    : (activity.lead_dept || "N/A")}
                            </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                            <p className="text-xs text-gray-600">Lead Person</p>
                            <p className="font-semibold text-gray-800 mt-1">
                                {typeof activity.lead_person === 'object' && activity.lead_person
                                    ? (activity.lead_person?.name || activity.lead_person?.code || "N/A")
                                    : (activity.lead_person || "N/A")}
                            </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                            <p className="text-xs text-gray-600">Intervention Area</p>
                            <p className="font-semibold text-gray-800 mt-1">
                                {typeof activity.intervention_area === 'object' && activity.intervention_area
                                    ? (activity.intervention_area?.name || activity.intervention_area?.code || "N/A")
                                    : (activity.intervention_area || "N/A")}
                            </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                            <p className="text-xs text-gray-600">Location</p>
                            <p className="font-semibold text-gray-800 mt-1">
                                {typeof activity.location === 'object' && activity.location
                                    ? (activity.location?.name || activity.location?.code || "N/A")
                                    : (activity.location || "N/A")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Budget Summary */}
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Total Budget</p>
                            <p className="text-2xl font-bold text-blue-700">
                                ₦{budgetTotal.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Cost Sheet Total</p>
                            <p className="text-2xl font-bold text-green-700">
                                ₦{costSheetTotal.toLocaleString()}
                            </p>
                        </div>
                        <div className={`p-4 rounded-lg ${variance >= 0 ? 'bg-orange-50' : 'bg-red-50'}`}>
                            <p className="text-xs text-gray-600 mb-1">Variance</p>
                            <p className={`text-2xl font-bold ${variance >= 0 ? 'text-orange-700' : 'text-red-700'}`}>
                                {variance >= 0 ? '+' : ''}₦{variance.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Variance %</p>
                            <p className="text-2xl font-bold text-purple-700">
                                {variancePercentage.toFixed(2)}%
                            </p>
                        </div>
                    </div>
                    {validationStatus !== 'VALIDATED' && costSheets.length > 0 && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                <strong>Note:</strong> {statusStyling.description}. Please review the sub-activities.
                            </p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Cost Sheet Sub-Activities */}
            <Card>
                <div className="p-6 border-b flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Cost Sheet Breakdown</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            {costSheets.length} sub-{costSheets.length === 1 ? 'activity' : 'activities'}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={handleUploadCostSheet}
                            variant="outline"
                            className="flex gap-2"
                        >
                            <Upload className="w-4 h-4" />
                            Bulk Upload
                        </Button>
                        <Button
                            onClick={handleAddCostSheet}
                            className="flex gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Sub-Activity
                        </Button>
                    </div>
                </div>

                <div className="p-4">
                    {costSheets.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg
                                    className="w-16 h-16 mx-auto"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <p className="text-gray-600 font-medium mb-2">No cost sheet created yet</p>
                            <p className="text-sm text-gray-500 mb-4">
                                Create sub-activities to break down the total cost
                            </p>
                            <Button onClick={handleAddCostSheet}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add First Sub-Activity
                            </Button>
                        </div>
                    ) : (
                        <DataTable
                            data={costSheets}
                            columns={costSheetSubActivitiesColumns(activityId, workPlanId)}
                            isLoading={false}
                            footer={true}
                        />
                    )}
                </div>
            </Card>
        </div>
    );
}
