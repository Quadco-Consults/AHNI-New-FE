import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import { useMemo } from "react";

type ActivityData = {
  objective: string;
  subObjective: string;
  accNumber: string;
  activities: string;
};

const data: ActivityData[] = [
  {
    objective:
      "To Increase resiliency, responsiveness, and accountability of the health system",
    subObjective: "Increased equity to access to HIV services",
    accNumber: "PHO/IR/1.1.1",
    activities:
      "Develop context specific implementation plans to guide state teams to implement innovative, high impact decentralized HIV service delivery (e.g Super-Hub Cluster Model) in FCV and hard-to-reach areas",
  },
  {
    objective:
      "To Increase resiliency, responsiveness, and accountability of the health system",
    subObjective: "Increased equity to access to HIV services",
    accNumber: "PHO/IR/1.1.1",
    activities:
      "Develop context specific implementation plans to guide state teams to implement innovative, high impact decentralized HIV service delivery (e.g Super-Hub Cluster Model) in FCV and hard-to-reach areas",
  },
  {
    objective:
      "To Increase resiliency, responsiveness, and accountability of the health system",
    subObjective: "Increased equity to access to HIV services",
    accNumber: "PHO/IR/1.1.1",
    activities:
      "Develop context specific implementation plans to guide state teams to implement innovative, high impact decentralized HIV service delivery (e.g Super-Hub Cluster Model) in FCV and hard-to-reach areas",
  },
];

const ActivityTab = () => {
  const columns = useMemo<ColumnDef<ActivityData>[]>(
    () => [
      {
        header: "Objective",
        accessorKey: "objective",
        size: 300,
      },
      {
        header: "Sub-Objective",
        accessorKey: "subObjective",
        size: 300,
      },
      {
        header: "ACT. No.",
        accessorKey: "accNumber",
        size: 200,
      },
      {
        header: "Activities",
        accessorKey: "activities",
        size: 400,
      },
    ],
    []
  );

  return (
    <div>
      <DataTable data={data} columns={columns} />
    </div>
  );
};

export default ActivityTab;
