import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import TotalProcurementIcon from "components/icons/TotalProcurementIcon";
import OngoingProcurementIcon from "components/icons/OngoingProcurementIcon";
import CompletedProcurementIcon from "components/icons/CompletedProcurementIcon";
import DataTable from "components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Link, generatePath } from "react-router-dom";
import { RouteEnum } from "constants/RouterConstants";
import BreadcrumbCard from "components/shared/Breadcrumb";

type Data = {
  budgetLine: string;
  owner: string;
  approvedBudget: string;
  responsiblePRStaff: string;
  progress: string;
};

function ProcurementTracker() {
  const columns: ColumnDef<Data>[] = [
    {
      header: "PR Reference",
      accessorKey: "budgetLine",
      size: 150,
    },
    {
      header: "PR Item",
      accessorKey: "owner",
      size: 150,
    },
    {
      header: "Quantity",
      accessorKey: "approvedBudget",
      size: 150,
    },
    {
      header: "Request Date",
      accessorKey: "responsiblePRStaff",
      size: 150,
    },
    {
      header: "Date Required",
      accessorKey: "responsiblePRStaff",
      size: 150,
    },
    {
      header: "Requesting Department",
      accessorKey: "responsiblePRStaff",
      size: 200,
    },
    {
      header: "",
      id: "action",
      size: 80,
      cell: ({ row }) => <Action data={row.original} />,
    },
  ];

  // eslint-disable-next-line react/prop-types
  const Action = ({ data }: any) => {
    return (
      <Link
        to={generatePath(RouteEnum.PROCUREMENT_TRACKER_DETAIL, { id: "1" })}
      >
        <Button variant="ghost">View</Button>
      </Link>
    );
  };

  const data: Data[] = [
    {
      budgetLine: "1",
      owner: "AHNi",
      approvedBudget: "204,375.79 ",
      responsiblePRStaff: "M&E Team Lead",
      progress: "85%",
    },
    {
      budgetLine: "1",
      owner: "AHNi",
      approvedBudget: "204,375.79 ",
      responsiblePRStaff: "M&E Team Lead",
      progress: "35%",
    },
    {
      budgetLine: "1",
      owner: "AHNi",
      approvedBudget: "204,375.79 ",
      responsiblePRStaff: "M&E Team Lead",
      progress: "65%",
    },
    {
      budgetLine: "1",
      owner: "AHNi",
      approvedBudget: "204,375.79 ",
      responsiblePRStaff: "M&E Team Lead",
      progress: "10%",
    },
    {
      budgetLine: "1",
      owner: "AHNi",
      approvedBudget: "204,375.79 ",
      responsiblePRStaff: "M&E Team Lead",
      progress: "70%",
    },
    {
      budgetLine: "1",
      owner: "AHNi",
      approvedBudget: "204,375.79 ",
      responsiblePRStaff: "M&E Team Lead",
      progress: "85%",
    },
  ];

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Procurement Tracker", icon: false },
  ];

  return (
    <section className="min-h-screen space-y-8">
      <BreadcrumbCard list={breadcrumbs} />
      <Card className="space-y-5">
        <div className="flex items-center justify-start gap-2">
          <span className="flex w-1/3 items-center rounded-lg border px-2 py-2">
            <SearchIcon />
            <input
              placeholder="Search"
              type="text"
              className="ml-2 h-6 border-none bg-none outline-none focus:outline-none"
            />
          </span>
          <Button className="shadow-sm" variant="ghost">
            <FilterIcon />
          </Button>
        </div>

        <DataTable data={data} columns={columns} />
      </Card>
    </section>
  );
}

export default ProcurementTracker;
