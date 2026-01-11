import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/Table/DataTable";
import { useMemo } from "react";
import { TFundRequestResponseData } from "@/features/programs/types/fund-request";

type ActivityData = {
  objective: string;
  subObjective: string;
  accNumber: string;
  activities: string;
};

interface ActivityTabProps {
  fundRequest?: TFundRequestResponseData;
}

const ActivityTab = ({ fundRequest }: ActivityTabProps) => {
  const data = useMemo<ActivityData[]>(() => {
    if (!fundRequest?.project?.objectives) return [];

    const activities: ActivityData[] = [];
    fundRequest.project.objectives.forEach((obj, index) => {
      obj.sub_objectives.forEach((subObj) => {
        activities.push({
          objective: obj.objective,
          subObjective: subObj,
          accNumber: `${fundRequest.project.project_id || 'N/A'}/${index + 1}`,
          activities: "Work plan activities to be added",
        });
      });
    });

    return activities;
  }, [fundRequest]);

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
        No objectives or activities found for this project
      </div>
    );
  }

  return (
    <div>
      <DataTable data={data} columns={columns} />
    </div>
  );
};

export default ActivityTab;
