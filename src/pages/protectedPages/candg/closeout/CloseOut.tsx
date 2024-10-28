import { ColumnDef } from "@tanstack/react-table";
import SearchBar from "atoms/SearchBar";
import AddSquareIcon from "components/icons/AddSquareIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import EyeIcon from "components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DataTable from "components/Table/DataTable";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { CandGRoutes } from "constants/RouterConstants";
import React, { useMemo } from "react";
import { generatePath, Link, useNavigate } from "react-router-dom";
import { closeoutPlanAPis } from "services/cAndGApi/closeOutPlan";
import { toast } from "sonner";

const CloseOut: React.FC = () => {
  const navigate = useNavigate();
  const getCloseOutPlan = closeoutPlanAPis.useGetCloseOutPlansQuery({});
  const closeOutArray = useMemo(() => {
    return getCloseOutPlan?.data?.results || [];
  }, [getCloseOutPlan]);

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
    {
      header: "Action",
      id: "actions",
      size: 50,
      cell: ({ row }) => <ActionListAction data={row.original} />,
    },
  ];

  const ActionListAction = ({ data }: any) => {
    const [subgrantDeleteMutation] = closeoutPlanAPis.useAddCloseOutPlanMutation();
    const deleteSubgrantHandler = async () => {
      try {
        await subgrantDeleteMutation({ path: { id: data?.id } }).unwrap();
        toast.success("Project deleted.");
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    };

    return (
      <div className="flex items-center gap-2">
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="flex gap-2 py-6">
                <MoreOptionsHorizontalIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className=" w-fit">
              <div className="flex flex-col items-start justify-between gap-1">
                <Link
                  className="w-full"
                  to={generatePath("/c-and-g/close-out-plan/details/:id", {
                    id: data?.id,
                  })}
                >
                  <Button className="w-full flex items-center justify-start gap-2" variant="ghost">
                    <EyeIcon />
                    View
                  </Button>
                </Link>
                {/* <Link
                  className="w-full"
                  to={generatePath(RouteEnum.PROJECTS_EDIT_SUMMARY, {
                    id: data?.id,
                  })}
                >
                  <Button className="w-full flex items-center justify-start gap-2" variant="ghost">
                    <EditIcon />
                    Edit
                  </Button>
                </Link> */}
                <Button className="w-full flex items-center justify-start gap-2" variant="ghost" onClick={deleteSubgrantHandler}>
                  <DeleteIcon />
                  delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </>
      </div>
    );
  };

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
          // onRowClick={(row) => {
          //   navigate("/c-and-g/close-out-plan/details/" + row?.original?.id);
          // }}
          data={closeOutArray}
          isLoading={getCloseOutPlan.isLoading}
        />
      </div>
    </main>
  );
};

export default CloseOut;
