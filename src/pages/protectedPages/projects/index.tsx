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
import projectsAPi from "services/projectsApi/projectsApi";
import { ProjectsResultsData } from "definations/project-types/projects";
import { useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "components/ui/breadcrumb";
import { toast } from "sonner";

const FundRequest = () => {
  const projectsQueryResult = projectsAPi.useGetProjectsQuery(
    useMemo(
      () => ({
        params: {
          // fields: "id,name",
          no_paginate: false,
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
      size: 100,
    },
    {
      header: "Start Date",
      accessorKey: "start_date",
      size: 130,
    },
    {
      header: "End Date",
      accessorKey: "end_date",
      size: 130,
    },
    {
      header: "Status",
      accessorKey: "status",
      size: 100,
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
      size: 120,
    },
    {
      header: "Funding Source",
      cell: ({ row }) => <ProjectFundingSource data={row.original} />,
      size: 200,
    },
    {
      header: "Manager",
      accessorKey: "project_manager",
      size: 120,
    },
    {
      header: "Outcome/Impact",
      accessorKey: "goal",
      size: 150,
    },
    {
      header: "Beneficiaries",
      cell: ({ row }) => <ProjectBeneficiaries data={row.original} />,
      size: 200,
    },
    {
      header: "Action",
      id: "actions",
      size: 50,
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
    const [projectDeleteMutation] = projectsAPi.useDeleteProjectMutation();
    const deleteProjectHandler = async () => {
      try {
        await projectDeleteMutation({ path: { id: data?.id } }).unwrap();
        toast.success("Project deleted.");
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    };

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
                <Link
                  className="w-full"
                  to={generatePath(RouteEnum.PROJECTS_EDIT_SUMMARY, {
                    id: data?.id,
                  })}
                >
                  <Button
                    className="w-full flex items-center justify-start gap-2"
                    variant="ghost"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.manager/2000/svg"
                    >
                      <g clip-path="url(#clip0_6296_42527)">
                        <path
                          opacity="0.4"
                          d="M11.9863 0.892096C12.4252 0.702635 12.9228 0.702635 13.3617 0.892096C13.5381 0.968245 13.6863 1.07818 13.8297 1.20392C13.9671 1.3244 14.1238 1.48103 14.3099 1.66716L14.3325 1.68981L14.3325 1.68982C14.5187 1.87593 14.6753 2.03256 14.7958 2.16997C14.9215 2.31338 15.0314 2.4616 15.1076 2.638C15.297 3.0769 15.297 3.57452 15.1076 4.01342C15.0314 4.18983 14.9215 4.33805 14.7958 4.48146C14.6753 4.61886 14.5187 4.77548 14.3326 4.96158L14.3325 4.96162L10.9065 8.38767L10.9065 8.38767C10.1461 9.14833 9.67577 9.6188 9.08003 9.90064C8.48429 10.1825 7.72797 10.257 6.6576 10.3624L6.13211 10.4143C5.9831 10.429 5.83534 10.3761 5.72946 10.2702C5.62358 10.1643 5.57072 10.0166 5.58543 9.86757L5.63728 9.34208C5.74271 8.27171 5.81721 7.51539 6.09904 6.91965C6.38087 6.3239 6.85135 5.85359 7.61201 5.09319L11.038 1.66718L11.038 1.66717C11.2242 1.48103 11.3808 1.3244 11.5182 1.20392C11.6616 1.07818 11.8098 0.968245 11.9863 0.892096Z"
                          fill="#BE8800"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M0.75 11.0833C0.75 10.0708 1.57081 9.25 2.58333 9.25H4.08333C4.45152 9.25 4.75 9.54848 4.75 9.91667C4.75 10.2849 4.45152 10.5833 4.08333 10.5833H2.58333C2.30719 10.5833 2.08333 10.8072 2.08333 11.0833C2.08333 11.3595 2.30719 11.5833 2.58333 11.5833H8.91667C9.92919 11.5833 10.75 12.4041 10.75 13.4167C10.75 14.4292 9.92919 15.25 8.91667 15.25H7.41667C7.04848 15.25 6.75 14.9515 6.75 14.5833C6.75 14.2151 7.04848 13.9167 7.41667 13.9167H8.91667C9.19281 13.9167 9.41667 13.6928 9.41667 13.4167C9.41667 13.1405 9.19281 12.9167 8.91667 12.9167H2.58333C1.57081 12.9167 0.75 12.0959 0.75 11.0833Z"
                          fill="#BE8800"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_6296_42527">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    Edit
                  </Button>
                </Link>
                <Button
                  className="w-full flex items-center justify-start gap-2"
                  variant="ghost"
                  onClick={deleteProjectHandler}
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
    <section>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Projects</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
    </section>
  );
};

export default FundRequest;
