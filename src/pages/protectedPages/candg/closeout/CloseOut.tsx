import { ColumnDef } from "@tanstack/react-table";
import SearchBar from "atoms/SearchBar";
import AddSquareIcon from "components/icons/AddSquareIcon";
import DataTable from "components/Table/DataTable";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { CandGRoutes } from "constants/RouterConstants";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { closeoutPlanAPis } from "services/cAndGApi/closeOutPlan";

const CloseOut: React.FC = () => {
  const navigate = useNavigate();
  const getCloseOutPlan = closeoutPlanAPis.useGetCloseOutPlansQuery({});
  const closeOutArray = useMemo(() => {
    return getCloseOutPlan?.data?.results || [];
  }, [getCloseOutPlan]);

  console.log(closeOutArray);

  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      size: 50,
      header: ({ table }) => {
        return (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
            }}
          />
        );
      },
      cell: ({ row }) => {
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
            }}
          />
        );
      },
    },
    // {
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={table.getIsAllRowsSelected()}
    //       onCheckedChange={table.getToggleAllRowsSelectedHandler()}
    //     />
    //   ),
    //   accessorKey: "isSelected",
    //   size: 50,
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={row.getToggleSelectedHandler()}
    //     />
    //   ),
    // },
    {
      header: "Project Name",
      accessorKey: "project_id",
      size: 250,
      cell: ({ row }) => <p>{row?.original?.project_id}</p>,
    },
    {
      header: "Task ID/ No",
      accessorKey: "closeout_task_count",
      size: 250,
      cell: ({ row }) => <p>{row?.original?.closeout_task_count}</p>,
    },
    {
      header: "Duration",
      accessorKey: "closeout_duration",
      size: 250,
      cell: ({ row }) => <p>{row?.original?.closeout_duration}</p>,
    },
    {
      header: "Status",
      accessorKey: "closeout_status",
      size: 250,
      cell: ({ row }) => <p>{row?.original?.closeout_status}</p>,
    },
  ];

  return (
    <main className="w-full flex flex-col justify-center items-center gap-y-[1.5rem]">
      <section className="flex items-center w-full justify-between">
        <SearchBar onchange={() => ""} />
        <Button
          onClick={() => {
            navigate(CandGRoutes.NEW_CLOSE_OUT_PLAN);
          }}
        >
          <AddSquareIcon />
          <p>Create New Close Out Plan</p>
        </Button>
      </section>
      <div className="w-full">
        <DataTable
          columns={columns}
          onRowClick={(row) => {
            navigate("/c-and-g/close-out-plan/details/" + row?.original?.id);
          }}
          data={closeOutArray}
          isLoading={getCloseOutPlan.isLoading}
        />
      </div>
    </main>
  );
};

export default CloseOut;
