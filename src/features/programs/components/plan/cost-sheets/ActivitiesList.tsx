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
import { DialogType } from "@/constants/dailogs";

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

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard/programs/plan/cost-sheets")}
                    className="flex gap-2"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Work Plans
                </Button>
                <Button
                    onClick={handleBulkUpload}
                    className="flex gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                    <Upload className="w-4 h-4" />
                    Bulk Upload All Cost Sheets
                </Button>
            </div>

            <Card>
                {/* Work Plan Summary Header */}
                <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                        {workPlan.project?.title || workPlan.project}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-gray-600 font-medium">Financial Year</p>
                            <Badge variant="outline" className="mt-1">
                                {workPlan.financial_year?.year || workPlan.financial_year || "N/A"}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-gray-600 font-medium">Total Budget</p>
                            <p className="text-lg font-semibold text-gray-800 mt-1">
                                {formatNumberCurrency(
                                    workPlan.project?.budget || workPlan.budget || 0,
                                    workPlan.project?.currency || workPlan.currency || "NGN"
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600 font-medium">Total Activities</p>
                            <p className="text-lg font-semibold text-gray-800 mt-1">
                                {activities.length}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600 font-medium">Project Partners</p>
                            <p className="text-sm text-gray-700 mt-1">
                                {workPlan.project?.partners?.map((p: any) => p.name).join(", ") ||
                                 workPlan.project_partners?.join(", ") || "N/A"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Activities Instructions */}
                <div className="p-4 border-b bg-yellow-50">
                    <p className="text-sm text-gray-700">
                        <strong>Instructions:</strong> Click on an activity to view or create its cost sheet.
                        Each activity's cost sheet should break down the total cost into sub-activities with detailed calculations.
                    </p>
                </div>

                {/* Activities Table */}
                <div className="p-4">
                    {activities.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>No activities found for this work plan.</p>
                            <p className="text-sm mt-2">Please upload activities first.</p>
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
