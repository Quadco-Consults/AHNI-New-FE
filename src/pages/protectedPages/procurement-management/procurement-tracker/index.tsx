import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import TotalProcurementIcon from "components/icons/TotalProcurementIcon";
import OngoingProcurementIcon from "components/icons/OngoingProcurementIcon";
import CompletedProcurementIcon from "components/icons/CompletedProcurementIcon";
import DataTable from "components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";

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
      header: "Progress",
      accessorKey: "progress",
      cell: ({ row }: any) => {
        const progressPercentage = parseInt(row.original.progress); // Parse the progress string to an integer
        return <ProgressBar widthPercentage={progressPercentage} />;
      },
    },
  ];

  // eslint-disable-next-line react/prop-types
  const ProgressBar = ({ widthPercentage }: any) => {
    const progressBarStyle = {
      width: `${widthPercentage}%`,
    };

    return (
      <div className="flex w-full items-center justify-center gap-2">
        <div className="w-full rounded-full bg-gradient-to-r from-[#FD4A36] via-[#FFE100] to-[#0DD138] p-[1.5px]">
          <div className="relative h-3 overflow-hidden rounded-full border bg-white">
            <div
              className="absolute bottom-0 left-0 top-0 rounded-full bg-gradient-to-r from-[#FD4A36] via-[#FFE100] to-[#0DD138]"
              style={progressBarStyle}
            ></div>
          </div>
        </div>
        <span className="text-black/50 text-xs font-semibold">
          {widthPercentage}%
        </span>
      </div>
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

  // eslint-disable-next-line react/prop-types
  const SummaryCard = ({ color, icon, title, value }: any) => {
    return (
      <div
        className={`text-primaryWhite relative flex h-[8rem] w-full select-none  items-center justify-between gap-5 rounded-md p-4`}
        style={{ backgroundColor: color }}
      >
        <div className="absolute right-0 top-0"></div>
        <div className="rounded border border-white/70 text-white">{icon}</div>
        <div className="flex flex-col items-start justify-start gap-y-2 text-white">
          <p className="font-light text-base">{title}</p>
          <h4 className="text-3xl font-bold">{value}</h4>
        </div>
      </div>
    );
  };

  return (
    <section className="min-h-screen space-y-8">
      <div className="flex items-center justify-between gap-10">
        <SummaryCard
          title="Total"
          value={24}
          color="#3E3574"
          icon={<TotalProcurementIcon />}
        />
        <SummaryCard
          title="Ongoing"
          value={24}
          color="#B14F05"
          icon={<OngoingProcurementIcon />}
        />
        <SummaryCard
          title="Completed"
          value={24}
          color="#077373"
          icon={<CompletedProcurementIcon />}
        />
      </div>
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
