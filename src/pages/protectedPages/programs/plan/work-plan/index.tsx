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
import { useMemo } from "react";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import DataTable from "components/Table/DataTable";

type WorkPlanData = {
  name: string;
  partners: string;
  year: string;
  budget: number;
};

const data: WorkPlanData[] = [
  {
    name: "Accelerating Control of the HIV Epidemic in Nigeria (ACE 5 AKS & CRS)",
    partners: "PHO",
    year: "10/2022 - 09/2023",
    budget: 200000,
  },
  {
    name: "Partners for Learning for All Nigeria (PLANE)",
    partners: "ADSO",
    year: "10/2022 - 09/2023",
    budget: 200000,
  },
  {
    name: "Accelerating Control of the HIV Epidemic in Nigeria (ACE 5 AKS & CRS)",
    partners: "PHO",
    year: "10/2022 - 09/2023",
    budget: 200000,
  },
  {
    name: "Partners for Learning for All Nigeria (PLANE)",
    partners: "ADSO",
    year: "10/2022 - 09/2023",
    budget: 200000,
  },
  {
    name: "Accelerating Control of the HIV Epidemic in Nigeria (ACE 5 AKS & CRS)",
    partners: "PHO",
    year: "10/2022 - 09/2023",
    budget: 200000,
  },
  {
    name: "Partners for Learning for All Nigeria (PLANE)",
    partners: "ADSO",
    year: "10/2022 - 09/2023",
    budget: 200000,
  },
];

const WorkPlan = () => {
  const dispatch = useAppDispatch();
  const columns = useMemo<ColumnDef<WorkPlanData>[]>(
    () => [
      {
        header: "Project Name",
        accessorKey: "name",
        size: 400,
      },
      {
        header: "Project Partners",
        accessorKey: "partners",
        size: 200,
      },
      {
        header: "Financial Year",
        accessorKey: "year",
        size: 250,
      },
      {
        header: "Budget ($)",
        accessorKey: "budget",
        size: 150,
      },
      {
        header: "",
        id: "actions",
        cell: ({ row }) => <ActionListAction data={row.original} />,
      },
    ],
    []
  );

  const ActionListAction = ({ data }: any) => {
    console.log(data);
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
                  to={generatePath(RouteEnum.PROGRAM_WORK_PLAN_DETAILS, {
                    id: "1",
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
        <Button
          className="flex gap-2 py-6"
          type="button"
          onClick={() => {
            dispatch(
              openDialog({
                type: DialogType.WorkPlanUpload,
                dialogProps: {
                  header: "Upload New Work plan",
                  width: "max-w-2xl",
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

        <DataTable data={data} columns={columns} />
      </Card>
    </div>
  );
};

export default WorkPlan;
