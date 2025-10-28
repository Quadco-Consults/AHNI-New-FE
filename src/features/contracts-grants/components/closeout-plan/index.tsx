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

    // Merge project details with close-out plans with optimized matching
    const enrichedResults = useMemo(() => {
        const closeoutPlans = data?.data?.results || [];
        // Try both possible data structures
        const projects = (projectsData as any)?.data?.results || projectsData?.results || [];

        // Debug logging (only in development)
        if (process.env.NODE_ENV === 'development') {
            console.log('Close out plans enrichment:', {
                closeoutPlansCount: closeoutPlans.length,
                projectsCount: projects.length,
                samplePlan: closeoutPlans[0],
                sampleProject: projects[0]
            });
        }

        // Create lookup map for better performance
        const projectLookup = new Map();
        projects.forEach((p: any) => {
            const id = String(p.id || '').toLowerCase();
            const title = String(p.title || '').toLowerCase();
            const projectId = String(p.project_id || '').toLowerCase();

            if (id) projectLookup.set(id, p);
            if (title) projectLookup.set(title, p);
            if (projectId) projectLookup.set(projectId, p);
        });

        let matchedCount = 0;
        let unmatchedPlans: string[] = [];

        const enrichedPlans = closeoutPlans.map(plan => {
            // If project is already an object, return as is
            if (typeof plan.project === 'object') {
                matchedCount++;
                return plan;
            }

            // Project is a string - try to match using lookup map
            const projectString = String(plan.project || '').trim().toLowerCase();
            const projectDetails = projectLookup.get(projectString);

            if (projectDetails) {
                matchedCount++;
                if (process.env.NODE_ENV === 'development') {
                    console.log(`✓ Matched "${plan.project}" → "${projectDetails.title}"`);
                }
                return {
                    ...plan,
                    project: projectDetails,
                };
            } else {
                unmatchedPlans.push(plan.project);
                return {
                    ...plan,
                    project: plan.project, // Keep original if no match found
                };
            }
        });

        // Summary logging
        if (process.env.NODE_ENV === 'development' && closeoutPlans.length > 0) {
            console.log(`Close out plan matching summary: ${matchedCount}/${closeoutPlans.length} matched`);
            if (unmatchedPlans.length > 0) {
                console.warn('Unmatched plans:', unmatchedPlans.slice(0, 5));
            }
        }

        return enrichedPlans;
    }, [data?.data?.results, projectsData]);

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
                            total: data?.data?.paginator?.count ?? 0,
                            pageSize: data?.data?.paginator?.page_size ?? 10,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
                </TableFilters>
            </Card>
        </section>
    );
}
