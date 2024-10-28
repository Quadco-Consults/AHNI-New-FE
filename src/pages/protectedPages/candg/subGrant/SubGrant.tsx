import { ColumnDef } from "@tanstack/react-table";
import FilterIcon2 from "assets/svgs/FilterIcon2";
import FormButton from "atoms/FormButton";
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
import { useMemo } from "react";
import { generatePath, Link, useNavigate } from "react-router-dom";
import { SubGrantApi } from "services/cAndGApi/subGrant";
import { toast } from "sonner";

const SubGrant = () => {
  const navigate = useNavigate();
  const getSubGrants = SubGrantApi.useGetSubGrantsQuery({
    params: { no_paginate: false },
  });

  const subGrantsArray = useMemo(() => {
    return getSubGrants?.data?.results || [];
  }, [getSubGrants]);
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

    {
      header: "Project Title",
      accessorKey: "project_title",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.project_title}</p>,
    },
    {
      header: "Business Unit",
      accessorKey: "business_unit",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.business_unit}</p>,
    },
    {
      header: "Award Amount",
      accessorKey: "project_value_usd",
      size: 200,
      cell: ({ row }) => <p>${row?.original?.project_value_usd}</p>,
    },
    {
      header: "Start Date",
      accessorKey: "start_date",
      size: 200,
    },
    {
      header: "End Date",
      accessorKey: "end_date",
      size: 200,
    },
    {
      header: "Status",
      accessorKey: "status",
      size: 200,
      cell: ({ row }) => <p>{row?.original?.status || "-"}</p>,
    },
    {
      header: "Action",
      id: "actions",
      size: 50,
      cell: ({ row }) => <ActionListAction data={row.original} />,
    },
  ];
  const ActionListAction = ({ data }: any) => {
    const [subgrantDeleteMutation] = SubGrantApi.useDeleteSingleSubGrantsMutation();
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
                  to={generatePath(CandGRoutes.SUB_GRANT_DETAILS, {
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
    <main className="flex flex-col justify-center items-center gap-y-[1rem]">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center justify-center">
          <SearchBar onchange={() => ""} />

          <Button variant="ghost" className="">
            <FilterIcon2 />
          </Button>
        </div>
        <div className="flex items-center">
          <FormButton
            onClick={() => {
              navigate(CandGRoutes.NEW_SUB_GRANT);
            }}
          >
            <AddSquareIcon />
            <p>New Sub Grant</p>
          </FormButton>
        </div>
      </div>
      <div className="w-full">
        <DataTable columns={columns} data={subGrantsArray} isLoading={false} />
      </div>
    </main>
  );
};

export default SubGrant;
