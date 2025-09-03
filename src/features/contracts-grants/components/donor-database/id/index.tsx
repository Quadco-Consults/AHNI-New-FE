"use client";

import BackNavigation from "components/atoms/BackNavigation";
import Card from "components/Card";
import DescriptionCard from "components/DescriptionCard";
import { LoadingSpinner } from "components/Loading";
import { projectColumns } from "@/features/projects/components/table-columns/project-columns";
import DataTable from "components/Table/DataTable";
import { Separator } from "components/ui/separator";
import { useParams } from "next/navigation";
import { useGetSingleFundingSourceManager } from "@/features/modules/controllers/project/fundingSourceController";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { useMemo } from "react";

export default function DonorDatabaseDetails() {
    const params = useParams();
    const id = params?.id as string;

    const { data, isLoading } = useGetSingleFundingSourceManager(
        id, 
        !!id
    );

    // Fetch all projects to filter by this donor
    const { data: projectsData, isLoading: projectsLoading } = useGetAllProjects({
        page: 1,
        size: 100, // Get more projects to ensure we capture all donor projects
        enabled: !!id
    });

    // Filter projects that include this funding source
    const donorProjects = useMemo(() => {
        if (!projectsData?.data?.results || !id) return [];
        
        return projectsData.data.results.filter((project) => 
            project.funding_sources?.some((source) => source.id === id)
        );
    }, [projectsData?.data?.results, id]);

    return (
        <section className="space-y-5">
            <BackNavigation extraText="Donor Information" />

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                data && (
                    <Card className="space-y-10">
                        <div className="grid grid-cols-3 gap-10">
                            <DescriptionCard
                                label="Donor Name"
                                description={data?.data.name || "N/A"}
                            />

                            <DescriptionCard
                                label="Donor Email"
                                description={
                                    (data?.data as any)?.contact_information?.email || 
                                    (data?.data as any)?.email_donor || 
                                    "N/A"
                                }
                            />

                            <DescriptionCard
                                label="Donor Address"
                                description={
                                    (data?.data as any)?.contact_information?.address || 
                                    (data?.data as any)?.address_donor || 
                                    "N/A"
                                }
                            />

                            <DescriptionCard
                                label="Contact Person Name"
                                description={
                                    (data?.data as any)?.contact_information?.contact_person || 
                                    (data?.data as any)?.contact_person_name || 
                                    "N/A"
                                }
                            />

                            <DescriptionCard
                                label="Contact Person Email"
                                description={
                                    (data?.data as any)?.contact_information?.email || 
                                    (data?.data as any)?.email_contact_person || 
                                    "N/A"
                                }
                            />

                            <DescriptionCard
                                label="Contact Person Phone Number"
                                description={
                                    (data?.data as any)?.contact_information?.phone || 
                                    (data?.data as any)?.contact_person_phone || 
                                    "N/A"
                                }
                            />
                        </div>

                        {data?.data.description && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="font-bold text-lg mb-4">Description</h3>
                                    <p className="text-gray-600">{data.data.description}</p>
                                </div>
                            </>
                        )}

                        <Separator />

                        <section className="space-y-5">
                            <h2 className="font-bold text-lg">
                                Projects by {data?.data.name} ({donorProjects.length} project{donorProjects.length !== 1 ? 's' : ''})
                            </h2>

                            {donorProjects.length === 0 && !projectsLoading ? (
                                <div className="text-center py-8 text-gray-500">
                                    No projects found for this donor
                                </div>
                            ) : (
                                <DataTable
                                    columns={projectColumns}
                                    data={donorProjects}
                                    isLoading={projectsLoading}
                                />
                            )}
                        </section>
                    </Card>
                )
            )}
        </section>
    );
}
