import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import { useMemo } from "react";
import { TFundRequestResponseData } from "@/features/programs/types/fund-request";

type MeasurementData = {
  objective: string;
  subObjective: string;
  accNumber: string;
  activities: string;
  justification: string;
  result: string;
  indicator: string;
};

interface MeasurementTabProps {
  fundRequest?: TFundRequestResponseData;
}

const MeasurementTab = ({ fundRequest }: MeasurementTabProps) => {
  const data = useMemo<MeasurementData[]>(() => {
    if (!fundRequest?.project?.objectives) return [];

    const measurements: MeasurementData[] = [];
    fundRequest.project.objectives.forEach((obj, index) => {
      obj.sub_objectives.forEach((subObj) => {
        measurements.push({
          objective: obj.objective,
          subObjective: subObj,
          accNumber: `${fundRequest.project.project_id || 'N/A'}/${index + 1}`,
          activities: "Work plan activities to be added",
          justification: fundRequest.project.narrative || "N/A",
          result: fundRequest.project.expected_results || "To be defined",
          indicator: "Key Performance Indicator (KPI) to be defined",
        });
      });
    });

    return measurements;
  }, [fundRequest]);

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

  if (!fundRequest) {
    return (
      <div className="text-center text-gray-500 py-8">
        No fund request data available
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No measurements found for this project
      </div>
    );
  }

  return <DataTable data={data} columns={columns} />;
};

export default MeasurementTab;
