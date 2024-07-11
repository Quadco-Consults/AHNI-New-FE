import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
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
        cell: ({ row }) => {
          return (
            <p>
              {row.original.workplans.map(
                (workplan: any) => workplan.identification
              )}
            </p>
          );
        },
        size: 150,
      },
      {
        header: "Activities",
        accessorKey: "activities",
        cell: ({ row }) => {
          return (
            <p>
              {row.original.workplans.map(
                (workplan: any) => workplan.description
              )}
            </p>
          );
        },
        size: 400,
      },
      {
        header: "Activities Justification",
        accessorKey: "activity_justification",
        cell: ({ row }) => {
          return (
            <p>
              {row.original.workplans.map(
                (workplan: any) => workplan.activity_justification
              )}
            </p>
          );
        },
        size: 400,
      },
    ],
    []
  );

  return <DataTable data={[data] || []} columns={columns} isLoading={false} />;
};

export default ActivityTab;
