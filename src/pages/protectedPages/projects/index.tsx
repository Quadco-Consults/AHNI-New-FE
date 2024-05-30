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

type projectData = {
  projectTitle: string;
  projectID: string;
  projectStartDate: string;
  projectEndDate: string;
  status: string;
  budget: string;
  source: string;
  manager: string;
  impact: string;
  beneficiarie: string;
};

const data: projectData[] = Array(10).fill({
  projectTitle:
    "Accelerating Control of the HIV Epidemic in Nigeria (ACE 5 AKS & CRS)",
  projectID: "ACE001",
  projectStartDate: "10/04/2023",
  projectEndDate: "10/04/2023",
  status: "Review Pending",
  budget: "$2,000,000",
  source: "External Global funding",
  manager: "Jane Doe",
  impact: "Increased literacy and reduced disease prevalence",
  beneficiaries: "Rural communities",
});

const FundRequest = () => {
  const columns: ColumnDef<projectData>[] = [
    {
      header: "Project Title",
      accessorKey: "projectTitle",
      size: 150,
    },
    {
      header: "ProjectID",
      accessorKey: "projectID",
      size: 200,
    },
    {
      header: "Project Start Date",
      accessorKey: "projectStartDate",
      size: 200,
    },
    {
      header: "Project End Date",
      accessorKey: "projectEndDate",
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
      accessorKey: "source",
      size: 150,
    },
    {
      header: "Project Manager",
      accessorKey: "manager",
      size: 150,
    },
    {
      header: "Outcome/Impact",
      accessorKey: "impact",
      size: 150,
    },
    {
      header: "Project Beneficiaries",
      accessorKey: "beneficiaries",
      size: 150,
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
                  to={generatePath(RouteEnum.PROJECTS_DETAILS, {
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

        <DataTable data={data} columns={columns} />
      </Card>
    </div>
  );
};

export default FundRequest;
