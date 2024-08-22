import { ColumnDef } from "@tanstack/react-table";
import FilterIcon2 from "assets/svgs/FilterIcon2";
import SearchBar from "atoms/SearchBar";
import DeleteIcon from "components/icons/DeleteIcon";
import EditIcon from "components/icons/EditIcon";
import EyeIcon from "components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import DataTable from "components/Table/DataTable";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Link } from "react-router-dom";

const Sla = () => {
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
      header: "",
      accessorKey: "closeout_status",
      size: 250,
      cell: ({ row }) => <ActionListAction data={row?.original} />,
    },
  ];

  const ActionListAction = ({ data }: any) => {
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
                <Link className="w-full" to={""}>
                  <Button className="w-full flex items-center justify-start gap-2" variant="ghost">
                    <EyeIcon />
                    View
                  </Button>
                </Link>
                <Link className="w-full" to={""}>
                  <Button className="w-full flex items-center justify-start gap-2" variant="ghost">
                    <EditIcon />
                    Edit
                  </Button>
                </Link>
                <Button className="w-full flex items-center justify-start gap-2" variant="ghost" onClick={() => ""}>
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
    <main className="w-full flex flex-col items-center justify-center gap-y-[1rem] px-[4rem]">
      {" "}
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center justify-center">
          <SearchBar onchange={() => ""} />

          <Button variant="ghost" className="">
            <FilterIcon2 />
          </Button>
        </div>
        <div className="flex items-center"></div>
      </div>
      <div className="w-full">
        <DataTable columns={columns} data={[]} isLoading={false} />
      </div>
    </main>
  );
};

export default Sla;
