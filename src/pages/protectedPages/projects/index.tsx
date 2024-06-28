import { Link, generatePath } from "react-router-dom";
import Card from "components/shared/Card";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { RouteEnum } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import DataTable from "components/Table/DataTable";
import projectsAPi from "services/projectsApi";
import { ProjectsResultsData } from "definations/projects";
import { useMemo } from "react";

const FundRequest = () => {
  const projectsQueryResult = projectsAPi.useGetProjectsQuery(
    useMemo(
      () => ({
        params: {
          // fields: "id, logo, name, state",
          // page_size: pagination.pageSize,
          // page: pagination.pageIndex + 1,
        },
      }),
      []
    )
  );

  const projects = projectsQueryResult?.data?.results;

  const columns: ColumnDef<ProjectsResultsData>[] = [
    {
      header: "Title",
      accessorKey: "title",
      size: 150,
    },
    {
      header: "ProjectID",
      accessorKey: "project_id",
      size: 200,
    },
    {
      header: "Start Date",
      accessorKey: "start_date",
      size: 200,
    },
    {
      header: "End Date",
      accessorKey: "end_date",
      size: 200,
    },
    {
      header: "Status",
      accessorKey: "status",
      size: 150,
      cell: ({ getValue }) => {
        return (
          <Badge
            variant="default"
            className={cn(
              "p-1 rounded-lg",
              getValue() === "Approved" && "bg-green-50 text-green-500",
              getValue() === "Reject" && "bg-red-50 text-red-500",
              getValue() === "Review Pending" && "bg-yellow-50 text-yellow-500",
              getValue() === "On Hold" && "text-grey-50 bg-grey-500"
            )}
          >
            {getValue() as string}
          </Badge>
        );
      },
    },
    {
      header: "Budget",
      accessorKey: "budget",
      size: 150,
    },
    {
      header: "Funding Source",
      cell: ({ row }) => <ProjectFundingSource data={row.original} />,
      size: 150,
    },
    {
      header: "Manager",
      accessorKey: "project_manager",
      size: 150,
    },
    {
      header: "Outcome/Impact",
      accessorKey: "goal",
      size: 150,
    },
    {
      header: "Beneficiaries",
      cell: ({ row }) => <ProjectBeneficiaries data={row.original} />,
      size: 150,
    },
    {
      header: "",
      id: "actions",
      cell: ({ row }) => <ActionListAction data={row.original} />,
    },
  ];
  const ProjectBeneficiaries = ({ data }: any) => {
    return (
      <div className="flex gap-2 flex-wrap">
        {data?.project_funding_source.map((el: any) => (
          <Badge key={el.id} className="bg-[#EBE8E1] text-[#1a0000ad]">
            {el.name}
          </Badge>
        ))}
      </div>
    );
  };
  const ProjectFundingSource = ({ data }: any) => {
    return (
      <div className="flex gap-2 flex-wrap">
        {data?.project_beneficiaries.map((el: any) => (
          <Badge key={el.id} className="bg-[#EBE8E1] text-[#1a0000ad]">
            {el.name}
          </Badge>
        ))}
      </div>
    );
  };

  const ActionListAction = ({ data }: any) => {
    return (
      <div className="flex items-center gap-2">
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="flex gap-2 py-6">
                <MoreOptionsHorizontalIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className=" w-fit">
              <div className="flex flex-col items-start justify-between gap-1">
                <Link
                  className="w-full"
                  to={generatePath(RouteEnum.PROJECTS_DETAILS, {
                    id: data?.id,
                  })}
                >
                  <Button
                    className="w-full flex items-center justify-start gap-2"
                    variant="ghost"
                  >
                    <EyeIcon />
                    View
                  </Button>
                </Link>
                <Button
                  className="w-full flex items-center justify-start gap-2"
                  variant="ghost"
                >
                  <DeleteIcon />
                  delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Link to={RouteEnum.PROJECTS_CREATE_SUMMARY}>
          <Button className="flex gap-2 py-6">
            <AddSquareIcon />
            New Project
          </Button>
        </Link>
      </div>

      <Card className="space-y-5">
        <div className="flex items-center justify-start gap-2">
          <span className="flex items-center w-1/3 px-2 py-2 border rounded-lg">
            <SearchIcon />
            <input
              placeholder="Search"
              type="text"
              className="ml-2 h-6 border-none bg-none focus:outline-none outline-none"
            />
          </span>
          <Button className="shadow-sm" variant="ghost">
            <FilterIcon />
          </Button>
        </div>

        <DataTable
          data={projects || []}
          columns={columns}
          isLoading={projectsQueryResult?.isLoading}
        />
      </Card>
    </div>
  );
};

export default FundRequest;
