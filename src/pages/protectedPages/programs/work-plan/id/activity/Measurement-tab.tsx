import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import { useMemo } from "react";

type MeasurementData = {
  objective: string;
  subObjective: string;
  accNumber: string;
  activities: string;
  justification: string;
  result: string;
  indicator: string;
};

const data: MeasurementData[] = [
  {
    objective:
      "To Increase resiliency, responsiveness, and accountability of the health system",
    subObjective: "Increased equity to access to HIV services",
    accNumber: "PHO/IR/1.1.1",
    activities:
      "Develop context specific implementation plans to guide state teams to implement innovative, high impact decentralized HIV service delivery (e.g Super-Hub Cluster Model) in FCV and hard-to-reach areas",
    justification:
      "To fit to the different and  changing security context in BAY states",
    result: "ART coverage",
    indicator: "NDR",
  },
  {
    objective:
      "To Increase resiliency, responsiveness, and accountability of the health system",
    subObjective: "Increased equity to access to HIV services",
    accNumber: "PHO/IR/1.1.1",
    activities:
      "Develop context specific implementation plans to guide state teams to implement innovative, high impact decentralized HIV service delivery (e.g Super-Hub Cluster Model) in FCV and hard-to-reach areas",
    justification:
      "To fit to the different and  changing security context in BAY states",
    result: "ART coverage",
    indicator: "NDR",
  },
  {
    objective:
      "To Increase resiliency, responsiveness, and accountability of the health system",
    subObjective: "Increased equity to access to HIV services",
    accNumber: "PHO/IR/1.1.1",
    activities:
      "Develop context specific implementation plans to guide state teams to implement innovative, high impact decentralized HIV service delivery (e.g Super-Hub Cluster Model) in FCV and hard-to-reach areas",
    justification:
      "To fit to the different and  changing security context in BAY states",
    result: "ART coverage",
    indicator: "NDR",
  },
];

const MeasurementTab = () => {
  const columns = useMemo<ColumnDef<MeasurementData>[]>(
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
        header: "Activity Justification",
        accessorKey: "justification",
        size: 300,
      },
      {
        header: "Expected Result",
        accessorKey: "result",
        size: 200,
      },
      {
        header: "Indicator",
        accessorKey: "indicator",
        size: 200,
      },
    ],
    []
  );

  return <DataTable data={data} columns={columns} />;
};

export default MeasurementTab;
