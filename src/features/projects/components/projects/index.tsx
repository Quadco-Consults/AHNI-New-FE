import Link from "next/link";
import Card from "components/Card";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import DataTable from "components/Table/DataTable";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { useAppDispatch } from "hooks/useStore";
import { useEffect, useState } from "react";
import BreadcrumbCard, { TBreadcrumbList } from "components/Breadcrumb";
import { clearPartners } from "store/formData/project-values";
import { clearObjectives } from "store/formData/project-objective";
import { projectColumns } from "@/features/projects/components/table-columns/project-columns";
import TableFilters from "components/Table/TableFilters";
import { useDebounce } from "ahooks";

const breadcrumbs: TBreadcrumbList[] = [{ name: "Projects", icon: false }];

export default function ProjectHomePage() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const debounceSearchQuery = useDebounce(searchQuery, {
        wait: 500,
    });

    const { data: project, isLoading } = useGetAllProjects({
        page,
        size: 10,
        search: debounceSearchQuery,
    });

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(clearPartners());
        dispatch(clearObjectives());
    }, []);

    return (
        <section>
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <BreadcrumbCard list={breadcrumbs} />
                    <Link href="/dashboard/projects/create">
                        <Button className="flex gap-2 py-6">
                            <AddSquareIcon />
                            New Project
                        </Button>
                    </Link>
                </div>

                <Card>
                    <TableFilters
                        onSearchChange={(e) => setSearchQuery(e.target.value)}
                    >
                        <DataTable
                            data={project?.data?.results || []}
                            columns={projectColumns}
                            isLoading={isLoading}
                            pagination={{
                                total: project?.data.pagination.count ?? 0,
                                pageSize:
                                    project?.data.pagination.page_size ?? 0,
                                onChange: (page: number) => setPage(page),
                            }}
                        />
                    </TableFilters>
                </Card>
            </div>
        </section>
    );
}
