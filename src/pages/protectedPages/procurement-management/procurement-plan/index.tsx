import { Link, generatePath } from "react-router-dom";
import Card from "components/shared/Card";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import ArrowDownIcon from "components/icons/ArrowDownIcon";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { RouteEnum } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";

type Data = {
  budgetLine: string;
  owner: string;
  approvedBudget: string;
  responsiblePRStaff: string;
};

function ProcurementPlan() {
  const columns: ColumnDef<Data>[] = [
    {
      header: "Budget Line",
      accessorKey: "budgetLine",
      size: 150,
    },
    {
      header: "Owner",
      accessorKey: "owner",
      size: 250,
    },
    {
      header: "Approved Budget ($)",
      accessorKey: "approvedBudget",
      size: 250,
    },
    {
      header: "Responsible PR Staff",
      accessorKey: "responsiblePRStaff",
      size: 250,
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
                  to={generatePath(RouteEnum.PROCUREMENT_DETAILS, { id: "1" })}
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

  const data: Data[] = [
    {
      budgetLine: "1",
      owner: "AHNi",
      approvedBudget: "204,375.79 ",
      responsiblePRStaff: "M&E Team Lead",
    },
    {
      budgetLine: "1",
      owner: "AHNi",
      approvedBudget: "204,375.79 ",
      responsiblePRStaff: "M&E Team Lead",
    },
    {
      budgetLine: "1",
      owner: "AHNi",
      approvedBudget: "204,375.79 ",
      responsiblePRStaff: "M&E Team Lead",
    },
    {
      budgetLine: "1",
      owner: "AHNi",
      approvedBudget: "204,375.79 ",
      responsiblePRStaff: "M&E Team Lead",
    },
    {
      budgetLine: "1",
      owner: "AHNi",
      approvedBudget: "204,375.79 ",
      responsiblePRStaff: "M&E Team Lead",
    },
    {
      budgetLine: "1",
      owner: "AHNi",
      approvedBudget: "204,375.79 ",
      responsiblePRStaff: "M&E Team Lead",
    },
    {
      budgetLine: "1",
      owner: "AHNi",
      approvedBudget: "204,375.79 ",
      responsiblePRStaff: "M&E Team Lead",
    },
    {
      budgetLine: "1",
      owner: "AHNi",
      approvedBudget: "204,375.79 ",
      responsiblePRStaff: "M&E Team Lead",
    },
    {
      budgetLine: "1",
      owner: "AHNi",
      approvedBudget: "204,375.79 ",
      responsiblePRStaff: "M&E Team Lead",
    },
    {
      budgetLine: "1",
      owner: "AHNi",
      approvedBudget: "204,375.79 ",
      responsiblePRStaff: "M&E Team Lead",
    },
    {
      budgetLine: "1",
      owner: "AHNi",
      approvedBudget: "204,375.79 ",
      responsiblePRStaff: "M&E Team Lead",
    },
    {
      budgetLine: "1",
      owner: "AHNi",
      approvedBudget: "204,375.79 ",
      responsiblePRStaff: "M&E Team Lead",
    },
  ];

  return (
    <section className="min-h-screen space-y-8">
      <div className="flex items-center justify-end gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="flex gap-2 py-6">
              <AddSquareIcon />
              New Procurement Plan
              <ArrowDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className=" w-fit">
            <div className="flex flex-col items-start justify-between gap-1">
              <Link
                className="w-full"
                to={generatePath(RouteEnum.CREATE_PROCUREMENT)}
              >
                <Button
                  className="w-full flex items-center justify-start"
                  variant="ghost"
                >
                  Create from scratch
                </Button>
              </Link>
              <Button
                className="w-full flex items-center justify-start"
                variant="ghost"
              >
                Upload Procurement plan
              </Button>
            </div>
          </PopoverContent>
        </Popover>
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
    </section>
  );
}

export default ProcurementPlan;
