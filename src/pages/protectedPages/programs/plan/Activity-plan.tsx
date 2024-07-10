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

type ActivityPlanData = {
  name: string;
  partners: string;
  objectives: string;
  code: string;
  description: string;
};

const data: ActivityPlanData[] = [
  {
    name: "Accelerating Control of the HIV Epidemic in Nigeria (ACE 5 AKS & CRS)",
    partners: "PHO",
    objectives:
      "A project focused on advancing community education and health.",
    code: "PHO/IR/1.1.1",
    description:
      "Develop context specific implementation plans to guide state teams to implement innovative, high impact decentralized HIV service delivery (e.g Super-Hub Cluster Model) in FCV and hard-to-reach areas",
  },
  {
    name: "Partners for Learning for All Nigeria (PLANE)",
    partners: "ADSO",
    objectives:
      "A project focused on advancing community education and health.",
    code: "PHO/IR/1.1.1",
    description:
      "Develop context specific implementation plans to guide state teams to implement innovative, high impact decentralized HIV service delivery (e.g Super-Hub Cluster Model) in FCV and hard-to-reach areas",
  },
  {
    name: "Accelerating Control of the HIV Epidemic in Nigeria (ACE 5 AKS & CRS)",
    partners: "PHO",
    objectives:
      "A project focused on advancing community education and health.",
    code: "PHO/IR/1.1.1",
    description:
      "Develop context specific implementation plans to guide state teams to implement innovative, high impact decentralized HIV service delivery (e.g Super-Hub Cluster Model) in FCV and hard-to-reach areas",
  },
  {
    name: "Partners for Learning for All Nigeria (PLANE)",
    partners: "ADSO",
    objectives:
      "A project focused on advancing community education and health.",
    code: "PHO/IR/1.1.1",
    description:
      "Develop context specific implementation plans to guide state teams to implement innovative, high impact decentralized HIV service delivery (e.g Super-Hub Cluster Model) in FCV and hard-to-reach areas",
  },
];

const ActivityPlan = () => {
  const dispatch = useAppDispatch();

  const columns = useMemo<ColumnDef<ActivityPlanData>[]>(
    () => [
      {
        header: "Project Name",
        accessorKey: "name",
        size: 300,
      },
      {
        header: "Project Partners",
        accessorKey: "partners",
        size: 200,
      },
      {
        header: "Objectives",
        accessorKey: "objectives",
        size: 300,
      },
      {
        header: "Activity Code",
        accessorKey: "code",
        size: 200,
      },
      {
        header: "Activity Description",
        accessorKey: "description",
        size: 400,
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
                  width: "max-w-2xl",
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

        <DataTable data={data} columns={columns} isLoading={false} />
      </Card>
    </div>
  );
};

export default ActivityPlan;
