import { Link } from "react-router-dom";
import Card from "components/shared/Card";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import DataTable from "components/Table/DataTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import { WorkPlanList } from "definations/program-types/program-workplan";
import WorkPlanAPi from "services/programsApi/work-plan";

const WorkPlan = () => {
  const dispatch = useAppDispatch();

  const workPlanQueryResult = WorkPlanAPi.useGetWorkPlansListQuery();

  const data = workPlanQueryResult?.data?.results;

  const columns = useMemo<ColumnDef<WorkPlanList>[]>(
    () => [
      {
        header: "Project Name",
        accessorKey: "project_title",
        size: 300,
      },
      {
        header: "Project Partners",
        accessorKey: "partner_name",
        size: 300,
      },
      {
        header: "Financial Year",
        accessorKey: "financial_year",
        accessorFn: (data) => `${data?.financial_year?.year}`,
        size: 200,
      },
      {
        header: "Budget ($)",
        accessorKey: "budget",
        size: 150,
      },
      {
        header: "",
        size: 80,
        id: "actions",
        cell: ({ row }) => <ActionListAction data={row.original} />,
      },
    ],
    []
  );

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
                  to={`/program/plan/work-plan/${data.partner_id}/${
                    data.project_id
                  }/${encodeURIComponent(data.financial_year.id)}`}
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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Programs</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Plans</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Work Plan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-end">
        <Button
          className="flex gap-2 py-6"
          type="button"
          onClick={() => {
            dispatch(
              openDialog({
                type: DialogType.WorkPlanUpload,
                dialogProps: {
                  header: "Upload New Work plan",
                  width: "max-w-lg",
                },
              })
            );
          }}
        >
          <AddSquareIcon />
          Upload New Work Plan
        </Button>
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
          data={data || []}
          columns={columns}
          isLoading={workPlanQueryResult?.isLoading}
        />
      </Card>
    </div>
  );
};

export default WorkPlan;
