import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import { useMemo } from "react";

const MeasurementTab = (data: any) => {
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
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
        header: "Expected Result",
        accessorKey: "result",
        cell: ({ row }) => {
          return (
            <p>
              {row.original.workplans.map(
                (workplan: any) => workplan.expected_result
              )}
            </p>
          );
        },
        size: 250,
      },
      {
        header: "Indicator",
        accessorKey: "indicator",
        cell: ({ row }) => {
          return (
            <p>
              {row.original.workplans.map(
                (workplan: any) => workplan.indicator
              )}
            </p>
          );
        },
        size: 200,
      },
      {
        header: "MoV",
        accessorKey: "mov",
        cell: ({ row }) => {
          return (
            <p>{row.original.workplans.map((workplan: any) => workplan.mov)}</p>
          );
        },
        size: 100,
      },
    ],
    []
  );

  return <DataTable data={[data] || []} columns={columns} isLoading={false} />;
};

export default MeasurementTab;
