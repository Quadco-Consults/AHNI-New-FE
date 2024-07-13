import Card from "components/shared/Card";
// import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import DataTable from "components/Table/DataTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import WeeklyActivityAPI from "services/programsApi/weekly-activity";
import { WeeklyActivityResultsData } from "definations/program-types/weekly-activity";

const ActivityPlan = () => {
  const dispatch = useAppDispatch();

  const { data, isLoading } = WeeklyActivityAPI.useGetWeeklyActivitiesQuery(
    useMemo(() => ({ params: {} }), [])
  );

  const columns = useMemo<ColumnDef<WeeklyActivityResultsData>[]>(
    () => [
      {
        header: "Objectives",
        accessorKey: "objectives",
        size: 150,
      },
      {
        header: "IR",
        accessorKey: "ir",
        size: 150,
      },
      {
        header: "Activity Code",
        accessorKey: "activity_code",
        size: 150,
      },
      {
        header: "Activity Description",
        accessorKey: "activity_description",
        size: 400,
      },
      {
        header: "Start Date",
        accessorKey: "start_date",
        size: 150,
      },
      {
        header: "End Date",
        accessorKey: "end_date",
        size: 150,
      },
      {
        header: "Responsible Person",
        accessorKey: "responsible_person",
        size: 200,
      },
      {
        header: "Resources/Vehicle Required",
        accessorKey: "resources_required",
        size: 200,
      },
      {
        header: "Memo Required",
        accessorKey: "memo_required",
        size: 150,
      },
      {
        header: "EA Required",
        accessorKey: "ea_required",
        size: 150,
      },
      {
        header: "Results Achieved",
        accessorKey: "results_achieved",
        size: 300,
      },
      {
        header: "Follow Up Action",
        accessorKey: "follow_up_action",
        size: 200,
      },
      {
        header: "Comments",
        accessorKey: "comments",
        size: 300,
      },
    ],
    []
  );

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
            <BreadcrumbPage>Activity Plan</BreadcrumbPage>
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
                type: DialogType.ActivityUpload,
                dialogProps: {
                  header: "Upload An Activity",
                  width: "max-w-lg",
                },
              })
            );
          }}
        >
          <AddSquareIcon />
          Upload Activity Plan
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
          data={data?.results || []}
          columns={columns}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};

export default ActivityPlan;
