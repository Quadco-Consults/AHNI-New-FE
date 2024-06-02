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
import DataTable from "components/Table/DataTable";

type WorkPlanData = {
  name: string;
  location: string;
  start_date: string;
  end_date: string;
};

const data: WorkPlanData[] = Array(10).fill({
  name: "ACEBAY",
  location: "Borno, Adamawa, Yobe",
  start_date: "20-04-2024",
  end_date: "20-04-2024",
});

const AnalysisMapping = () => {
  const columns: ColumnDef<WorkPlanData>[] = [
    {
      header: "Project Name",
      accessorKey: "name",
      size: 200,
    },
    {
      header: "Location",
      accessorKey: "location",
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
      header: "",
      id: "actions",
      cell: ({ row }) => <ActionListAction data={row.original} />,
    },
  ];

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
                  to={generatePath(
                    RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_ANALYSIS_DETAILS,
                    {
                      id: "1",
                    }
                  )}
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
        <Link to={RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_ANALYSIS_CREATE}>
          <Button className="flex gap-2 py-6">
            <AddSquareIcon />
            New Risk Analysis Plan
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

        <DataTable data={data} columns={columns} />
      </Card>
    </div>
  );
};

export default AnalysisMapping;
