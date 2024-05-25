import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import { useMemo } from "react";

type ChartData = {
  objective: string;
  subObjective: string;
  accNumber: string;
  activities: string;
  oct: number;
  nov: number;
  dec: number;
  jan: number;
  feb: number;
  mar: number;
};

const data: ChartData[] = [
  {
    objective:
      "To Increase resiliency, responsiveness, and accountability of the health system",
    subObjective: "Increased equity to access to HIV services",
    accNumber: "PHO/IR/1.1.1",
    activities:
      "Develop context specific implementation plans to guide state teams to implement innovative, high impact decentralized HIV service delivery (e.g Super-Hub Cluster Model) in FCV and hard-to-reach areas",
    oct: 4,
    nov: 1,
    dec: 6,
    jan: 2,
    feb: 2,
    mar: 8,
  },
  {
    objective:
      "To Increase resiliency, responsiveness, and accountability of the health system",
    subObjective: "Increased equity to access to HIV services",
    accNumber: "PHO/IR/1.1.1",
    activities:
      "Develop context specific implementation plans to guide state teams to implement innovative, high impact decentralized HIV service delivery (e.g Super-Hub Cluster Model) in FCV and hard-to-reach areas",
    oct: 4,
    nov: 1,
    dec: 6,
    jan: 2,
    feb: 2,
    mar: 8,
  },
  {
    objective:
      "To Increase resiliency, responsiveness, and accountability of the health system",
    subObjective: "Increased equity to access to HIV services",
    accNumber: "PHO/IR/1.1.1",
    activities:
      "Develop context specific implementation plans to guide state teams to implement innovative, high impact decentralized HIV service delivery (e.g Super-Hub Cluster Model) in FCV and hard-to-reach areas",
    oct: 4,
    nov: 1,
    dec: 6,
    jan: 2,
    feb: 2,
    mar: 8,
  },
];

const ChartTab = () => {
  const columns = useMemo<ColumnDef<ChartData>[]>(
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
      {
        header: "Oct",
        accessorKey: "oct",
        size: 50,
      },
      {
        header: "Nov",
        accessorKey: "nov",
        size: 50,
      },
      {
        header: "Dec",
        accessorKey: "dec",
        size: 50,
      },
      {
        header: "Jan",
        accessorKey: "jan",
        size: 50,
      },
      {
        header: "Feb",
        accessorKey: "feb",
        size: 50,
      },
      {
        header: "Mar",
        accessorKey: "mar",
        size: 50,
      },
    ],
    []
  );

  return <DataTable data={data} columns={columns} />;
};

export default ChartTab;
