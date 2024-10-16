import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import { useMemo } from "react";

const DetailTab = (data: any) => {
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
        header: "Lead Dept",
        accessorKey: "leadDept",
        cell: ({ row }) => {
          return (
            <p>
              {row.original.workplans.map(
                (workplan: any) => workplan.lead_department
              )}
            </p>
          );
        },
        size: 150,
      },
      {
        header: "Lead Person",
        accessorKey: "leadPerson",
        cell: ({ row }) => {
          return (
            <p>
              {row.original.workplans.map(
                (workplan: any) => workplan.lead_person
              )}
            </p>
          );
        },
        size: 150,
      },
      {
        header: "Locations",
        accessorKey: "location",
        cell: ({ row }) => {
          return (
            <p>
              {row.original.workplans.map(
                (workplan: any) => workplan.locations
              )}
            </p>
          );
        },
        size: 200,
      },
      {
        header: "Module",
        accessorKey: "module",
        // cell: ({ row }) => {
        //   return (
        //     <p>
        //       {row.original.workplans.map(
        //         (workplan: any) => workplan.locations
        //       )}
        //     </p>
        //   );
        // },
        size: 200,
      },
      {
        header: "Interventions",
        accessorKey: "interventions",
        // cell: ({ row }) => {
        //   return (
        //     <p>
        //       {row.original.workplans.map(
        //         (workplan: any) => workplan.locations
        //       )}
        //     </p>
        //   );
        // },
        size: 200,
      },
      {
        header: "Cost Category",
        accessorKey: "cost_category",
        // cell: ({ row }) => {
        //   return (
        //     <p>
        //       {row.original.workplans.map(
        //         (workplan: any) => workplan.locations
        //       )}
        //     </p>
        //   );
        // },
        size: 200,
      },
    ],
    []
  );

  return <DataTable data={[data] || []} columns={columns} isLoading={false} />;
};

export default DetailTab;
