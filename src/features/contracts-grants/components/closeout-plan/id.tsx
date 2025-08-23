"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import BackNavigation from "components/atoms/BackNavigation";
import Card from "components/Card";
import DescriptionCard from "components/DescriptionCard";
import { LoadingSpinner } from "components/Loading";
import { closeOutPlanTaskColumns } from "@/features/contracts-grants/components/table-columns/closeout-plan/closeout-plan-tasks";
import DataTable from "components/Table/DataTable";
import { useParams } from "next/navigation";
import { useGetSingleCloseOutPlan } from "@/features/contracts-grants/controllers/closeoutPlanController";

export default function CloseOutPlan() {
    const { id } = useParams();

    const { data, isLoading } = useGetSingleCloseOutPlan(id ?? skipToken);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (data) {
        return (
            <main className="space-y-5">
                <BackNavigation />

                <Card className="space-y-10">
                    <div className="grid grid-cols-4 gap-5">
                        <DescriptionCard
                            label="Project"
                            description={data.data.project.title}
                        />

                        <DescriptionCard
                            label="Location"
                            description={data.data.location.name}
                        />
                    </div>

                    <div className="space-y-5">
                        <DataTable
                            columns={closeOutPlanTaskColumns}
                            data={data.data.tasks || []}
                            isLoading={isLoading}
                        />
                    </div>
                </Card>
            </main>
        );
    }
}
