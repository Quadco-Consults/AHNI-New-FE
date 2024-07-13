import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import { useMemo } from "react";

const BudgetTab = (data: any) => {
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
        header: "Unit Cost",
        accessorKey: "cost",
        cell: ({ row }) => {
          return (
            <p>
              {row.original.workplans.map(
                (workplan: any) => workplan.unit_cost_ngn
              )}
            </p>
          );
        },
        size: 100,
      },
      {
        header: "Oct",
        accessorKey: "oct",
        cell: ({ row }) => {
          return (
            <p>
              {row.original.workplans.map(
                (workplan: any) => workplan.monthly_budget[0].monthly_total
              )}
            </p>
          );
        },
        size: 100,
      },
      {
        header: "Nov",
        accessorKey: "nov",
        cell: ({ row }) => {
          return (
            <p>
              {row.original.workplans.map(
                (workplan: any) => workplan.monthly_budget[1].monthly_total
              )}
            </p>
          );
        },
        size: 100,
      },
      {
        header: "Dec",
        accessorKey: "dec",
        cell: ({ row }) => {
          return (
            <p>
              {row.original.workplans.map(
                (workplan: any) => workplan.monthly_budget[2].monthly_total
              )}
            </p>
          );
        },
        size: 100,
      },
      {
        header: "Jan",
        accessorKey: "jan",
        cell: ({ row }) => {
          return (
            <p>
              {row.original.workplans.map(
                (workplan: any) => workplan.monthly_budget[3].monthly_total
              )}
            </p>
          );
        },
        size: 100,
      },
      {
        header: "Feb",
        accessorKey: "feb",
        cell: ({ row }) => {
          return (
            <p>
              {row.original.workplans.map(
                (workplan: any) => workplan.monthly_budget[4].monthly_total
              )}
            </p>
          );
        },
        size: 100,
      },
      {
        header: "Mar",
        accessorKey: "mar",
        cell: ({ row }) => {
          return (
            <p>
              {row.original.workplans.map(
                (workplan: any) => workplan.monthly_budget[5].monthly_total
              )}
            </p>
          );
        },
        size: 100,
      },
      {
        header: "Apr",
        accessorKey: "apr",
        cell: ({ row }) => {
          return (
            <p>
              {row.original.workplans.map(
                (workplan: any) => workplan.monthly_budget[6].monthly_total
              )}
            </p>
          );
        },
        size: 100,
      },
      {
        header: "May",
        accessorKey: "may",
        cell: ({ row }) => {
          return (
            <p>
              {row.original.workplans.map(
                (workplan: any) => workplan.monthly_budget[7].monthly_total
              )}
            </p>
          );
        },
        size: 100,
      },
      {
        header: "Jun",
        accessorKey: "jun",
        cell: ({ row }) => {
          return (
            <p>
              {row.original.workplans.map(
                (workplan: any) => workplan.monthly_budget[8].monthly_total
              )}
            </p>
          );
        },
        size: 100,
      },
      {
        header: "Jul",
        accessorKey: "jul",
        cell: ({ row }) => {
          return (
            <p>
              {row.original.workplans.map(
                (workplan: any) => workplan.monthly_budget[9].monthly_total
              )}
            </p>
          );
        },
        size: 100,
      },
      {
        header: "Aug",
        accessorKey: "aug",
        cell: ({ row }) => {
          return (
            <p>
              {row.original.workplans.map(
                (workplan: any) => workplan.monthly_budget[10].monthly_total
              )}
            </p>
          );
        },
        size: 100,
      },
      {
        header: "Sep",
        accessorKey: "sep",
        cell: ({ row }) => {
          return (
            <p>
              {row.original.workplans.map(
                (workplan: any) => workplan.monthly_budget[11].monthly_total
              )}
            </p>
          );
        },
        size: 100,
      },
      {
        header: "Total (NGN)",
        accessorKey: "ngn",
        cell: ({ row }) => {
          return (
            <p>
              ₦
              {row.original.workplans.map(
                (workplan: any) => workplan.annual_total_in_ngn
              )}
            </p>
          );
        },
        size: 100,
      },
      {
        header: "Total (USD)",
        accessorKey: "usd",
        // cell: ({ row }) => {
        //   return (
        //     <p>
        //       {row.original.workplans.map(
        //         (workplan: any) => workplan.monthly_budget[0].month
        //       )}
        //     </p>
        //   );
        // },
        size: 100,
      },
    ],
    []
  );

  return <DataTable data={[data] || []} columns={columns} isLoading={false} />;
};

export default BudgetTab;
