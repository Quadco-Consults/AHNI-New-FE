"use client";

import Card from "components/Card";
import { closeOutPlanColumns } from "@/features/contracts-grants/components/table-columns/closeout-plan/closeout-plan";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { CG_ROUTES } from "constants/RouterConstants";
import { PlusIcon } from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useGetAllCloseoutPlans } from "@/features/contracts-grants/controllers/closeoutPlanController";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";

export default function CloseOutPlan() {
    const [page, setPage] = useState(1);

    const { data, isFetching } = useGetAllCloseoutPlans({
        page,
        size: 10,
    });

    // Fetch all projects to get funding sources
    const { data: projectsData, isFetching: isLoadingProjects } = useGetAllProjects({
        page: 1,
        size: 1000,
    });

    // Merge project details with close-out plans
    const enrichedResults = useMemo(() => {
        const closeoutPlans = data?.data?.results || [];
        const projects = projectsData?.data?.results || [];

        return closeoutPlans.map(plan => {
            // If project is already an object, return as is
            if (typeof plan.project === 'object') {
                return plan;
            }

            // Project is a string - try to match by both ID and title/name
            const projectDetails = projects.find(p =>
                p.id === plan.project ||
                p.title === plan.project ||
                p.project_id === plan.project
            );

            return {
                ...plan,
                project: projectDetails || plan.project,
            };
        });
    }, [data?.data?.results, projectsData?.data?.results]);

    const isLoading = isFetching || isLoadingProjects;

    return (
        <section className="space-y-10">
            <div className="flex justify-end">
                <Link href={CG_ROUTES.NEW_CLOSE_OUT_PLAN}>
                    <Button size="lg">
                        <PlusIcon />
                        New Plan
                    </Button>
                </Link>
            </div>

            <Card>
                <TableFilters>
                    <DataTable
                        columns={closeOutPlanColumns}
                        data={enrichedResults}
                        isLoading={isLoading}
                        pagination={{
                            total: data?.data?.pagination?.count ?? 0,
                            pageSize: data?.data?.pagination?.page_size ?? 10,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
                </TableFilters>
            </Card>
        </section>
    );
}
