import { Link } from "react-router-dom";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import { RouteEnum } from "constants/RouterConstants";
import DataTable from "components/Table/DataTable";
import { useGetAllProjectsQuery } from "services/project";
import { useAppDispatch } from "hooks/useStore";
import { useEffect, useState } from "react";
import BreadcrumbCard, { TBreadcrumbList } from "components/shared/Breadcrumb";
import { clearPartners } from "store/formData/project-values";
import { clearObjectives } from "store/formData/project-objective";
import { projectColumns } from "components/Table/columns/project/project-columns";

const breadcrumbs: TBreadcrumbList[] = [{ name: "Projects", icon: false }];

export default function ProjectHomePage() {
    const [page, setPage] = useState(1);

    const { data: project, isFetching } = useGetAllProjectsQuery({
        page,
        size: 10,
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
                    <Link to={RouteEnum.PROJECTS_CREATE_SUMMARY}>
                        <Button className="flex gap-2 py-6">
                            <AddSquareIcon />
                            New Project
                        </Button>
                    </Link>
                </div>

                <Card className="space-y-5">
                    <div className="flex items-center justify-start gap-2">
                        <span className="flex items-center px-2 py-2 border rounded-lg">
                            <SearchIcon />
                            <input
                                placeholder="Search"
                                type="text"
                                className="ml-2 h-6 border-none bg-none focus:outline-none outline-none w-[350px]"
                            />
                        </span>
                        <Button className="shadow-sm" variant="ghost">
                            <FilterIcon />
                        </Button>
                    </div>

                    <DataTable
                        data={project?.data?.results || []}
                        columns={projectColumns}
                        isLoading={isFetching}
                        pagination={{
                            total: project?.data.pagination.count ?? 0,
                            pageSize: project?.data.pagination.page_size ?? 0,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
                </Card>
            </div>
        </section>
    );
}
