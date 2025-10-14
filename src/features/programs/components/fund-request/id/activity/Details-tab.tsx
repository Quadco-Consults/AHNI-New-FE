import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import { useMemo } from "react";
import { TFundRequestResponseData } from "@/features/programs/types/fund-request";

type DetailData = {
  objective: string;
  subObjective: string;
  accNumber: string;
  activities: string;
  justification: string;
  leadDept: string;
  leadPerson: string;
};

interface DetailTabProps {
  fundRequest?: TFundRequestResponseData;
}

const DetailTab = ({ fundRequest }: DetailTabProps) => {
  const data = useMemo<DetailData[]>(() => {
    if (!fundRequest?.project?.objectives) return [];

    const details: DetailData[] = [];
    fundRequest.project.objectives.forEach((obj, index) => {
      obj.sub_objectives.forEach((subObj) => {
        details.push({
          objective: obj.objective,
          subObjective: subObj,
          accNumber: `${fundRequest.project.project_id || 'N/A'}/${index + 1}`,
          activities: "Work plan activities to be added",
          justification: fundRequest.project.narrative || "N/A",
          leadDept: "To be assigned",
          leadPerson: fundRequest.project.project_managers?.[0]
            ? `${fundRequest.project.project_managers[0].first_name} ${fundRequest.project.project_managers[0].last_name}`
            : "N/A",
        });
      });
    });

    return details;
  }, [fundRequest]);

  const columns = useMemo<ColumnDef<DetailData>[]>(
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
        header: "Lead Dept",
        accessorKey: "leadDept",
        size: 200,
      },
      {
        header: "Lead Person",
        accessorKey: "leadPerson",
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
        No details found for this project
      </div>
    );
  }

  return <DataTable data={data} columns={columns} />;
};

export default DetailTab;
