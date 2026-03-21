"use client";
import Card from "@/components/Card";
import { useParams, useRouter } from "next/navigation";
import { useGetActivityCostSheets } from "@/features/programs/controllers/activityCostSheetController";
import BreadcrumbCard, { TBreadcrumbList } from "@/components/Breadcrumb";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/hooks/useStore";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dailogs";
import { getCostSheetStatusStyling } from "@/features/programs/types/activity-cost-sheet";
import DataTable from "@/components/Table/DataTable";
import { costSheetSubActivitiesColumns } from "@/features/programs/components/table-columns/plan/cost-sheet-sub-activities";
import { useGetSingleActivityPlan } from "@/features/programs/controllers/activityPlanController";

export default function UnplannedCostSheetDetail() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const activityPlanId = params?.activityPlanId as string;

    const { data: activityPlanData, isLoading: loadingActivityPlan } = useGetSingleActivityPlan(activityPlanId);
    const { data: costSheetsData, isLoading: loadingCostSheets } = useGetActivityCostSheets(
        undefined,
        activityPlanId
    );

    const activityPlan = activityPlanData?.data;
    const costSheets = costSheetsData?.results || [];

    const breadcrumbs: TBreadcrumbList[] = [
        { name: "Programs", icon: true },
        { name: "Plans", icon: true },
        { name: "Activity Plan", icon: true },
        { name: "Unplanned Activities", icon: true, link: `/dashboard/programs/plan/activity/${activityPlan?.work_plan}/unplanned` },
        { name: activityPlan?.work_plan_activity_identifier || "Activity", icon: false },
    ];

    if (loadingActivityPlan || loadingCostSheets) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner />
            </div>
        );
    }

    if (!activityPlan) {
        return (
            <div className="space-y-5">
                <BreadcrumbCard list={breadcrumbs} />
                <Card>
                    <div className="p-8 text-center text-gray-500">
                        Unplanned activity not found
                    </div>
                </Card>
            </div>
        );
    }

    // For unplanned activities, we might not have a budget, so we calculate from cost sheets
    const budgetTotal = 0; // Unplanned activities don't have predefined budgets
    const costSheetTotal = costSheets.reduce((sum, sheet) => sum + sheet.total_cost_ngn, 0);

    // Determine validation status
    let validationStatus: 'VALIDATED' | 'REVIEW' | 'MISMATCH' | 'MISSING' = 'MISSING';
    if (costSheets.length > 0) {
        validationStatus = 'REVIEW'; // Always review status for unplanned since no predefined budget
    }

    const statusStyling = getCostSheetStatusStyling(validationStatus);

    const handleAddCostSheet = () => {
        dispatch(
            openDialog({
                type: DialogType.ACTIVITY_COST_SHEET_MODAL,
                dialogProps: {
                    header: "Add Sub-Activity",
                    width: "max-w-2xl",
                    activityPlanId,
                    isUnplanned: true,
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
                    activityPlanId,
                    activityNumber: activityPlan?.work_plan_activity_identifier,
                    isUnplanned: true,
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
                    onClick={() => router.push(`/dashboard/programs/plan/activity/${activityPlan?.work_plan}/unplanned`)}
                    className="flex gap-2"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Unplanned Activities
                </Button>
            </div>

            {/* Activity Information Card */}
            <Card>
                <div className="p-6 border-b bg-gradient-to-r from-orange-50 to-amber-50">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                                    UNPLANNED
                                </Badge>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {activityPlan.work_plan_activity_identifier || "Unplanned Activity"}
                                </h2>
                            </div>
                            <p className="text-gray-700 text-sm mb-1">
                                <strong>Budget Line:</strong> {activityPlan.budget_line || "N/A"}
                            </p>
                        </div>
                        <Badge className={statusStyling.className} variant="outline">
                            {statusStyling.icon} {costSheets.length > 0 ? "Has Cost Sheets" : "No Cost Sheets"}
                        </Badge>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                        <p className="text-sm text-gray-800">
                            <strong>Description:</strong> {activityPlan.activity_description || activityPlan.activity_name || "N/A"}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                        <div className="bg-white p-3 rounded-lg border">
                            <p className="text-xs text-gray-600">Responsible Person</p>
                            <p className="font-semibold text-gray-800 mt-1">
                                {activityPlan.responsible_person || "N/A"}
                            </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                            <p className="text-xs text-gray-600">Start Date</p>
                            <p className="font-semibold text-gray-800 mt-1">
                                {activityPlan.start_date ? new Date(activityPlan.start_date).toLocaleDateString() : "N/A"}
                            </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                            <p className="text-xs text-gray-600">End Date</p>
                            <p className="font-semibold text-gray-800 mt-1">
                                {activityPlan.end_date ? new Date(activityPlan.end_date).toLocaleDateString() : "N/A"}
                            </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                            <p className="text-xs text-gray-600">Status</p>
                            <p className="font-semibold text-gray-800 mt-1">
                                {activityPlan.status || "N/A"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Budget Summary */}
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Cost Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Total Cost (from Cost Sheets)</p>
                            <p className="text-2xl font-bold text-green-700">
                                ₦{costSheetTotal.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Sub-Activities Count</p>
                            <p className="text-2xl font-bold text-blue-700">
                                {costSheets.length}
                            </p>
                        </div>
                    </div>
                    {costSheets.length === 0 && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                <strong>Note:</strong> No cost sheets created yet. Add sub-activities to define the cost breakdown for this unplanned activity.
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
                            <p className="text-gray-600 font-medium mb-2">No cost sheets created yet</p>
                            <p className="text-sm text-gray-500 mb-4">
                                Create sub-activities to break down the total cost for this unplanned activity
                            </p>
                            <Button onClick={handleAddCostSheet}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add First Sub-Activity
                            </Button>
                        </div>
                    ) : (
                        <DataTable
                            data={costSheets}
                            columns={costSheetSubActivitiesColumns(undefined, undefined, activityPlanId)}
                            isLoading={false}
                            footer={true}
                        />
                    )}
                </div>
            </Card>
        </div>
    );
}
