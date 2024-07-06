import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import { WorkPlanDetails } from "definations/program-types/program-workplan";
import { useMemo } from "react";

const ActivityTab = (data: any) => {
  const columns = useMemo<ColumnDef<any>[]>(
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
        accessorKey: "identification",
        cell: ({ row }) => <Identification data={row.original} />,
        size: 200,
      },
      {
        header: "Activities",
        cell: ({ row }) => <Activity data={row.original} />,
        size: 400,
      },
    ],
    []
  );

  return <DataTable data={data || []} columns={columns} isLoading={false} />;
};

export default ActivityTab;

const Identification = ({ data }: any) => {
  console.log(data);
  return <p>hello</p>;
};

const Activity = ({ data }: any) => {
  return data?.workplans?.map(
    (workplan: any) => workplan.activity_justification
  );
};
