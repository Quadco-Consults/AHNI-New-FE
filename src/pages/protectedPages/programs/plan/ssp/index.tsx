import { Link, generatePath } from "react-router-dom";
import Card from "components/shared/Card";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { RouteEnum } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import ApproveIcon from "components/icons/ApproveIcon";
import ApprovalStatusIcon from "components/icons/ApprovalStatusIcon";
import ArrowDownIcon from "components/icons/ArrowDownIcon";
import { useAppDispatch } from "hooks/useStore";
import { DialogType } from "constants/dailogs";
import { openDialog } from "store/ui";
import UploadIcon from "components/icons/UploadIcon";
import DataTable from "components/Table/DataTable";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import SupportiveSupervisionAPI from "services/programsApi/suportive-supervision";
import { SupportiveSupervisionData } from "definations/program-types/supportive-supervision";
import { toast } from "sonner";

const SupportiveSupervisionPlan = () => {
  const dispatch = useAppDispatch();

  const { data, isLoading } = SupportiveSupervisionAPI.useGetSupportiveSupervisionsQuery();

  const columns = useMemo<ColumnDef<SupportiveSupervisionData>[]>(
    () => [
      {
        header: "Facility",
        id: "facility",
        accessorFn: (data) => `${data.facility.name}`,
        size: 200,
      },
      {
        header: "State",
        id: "state",
        accessorFn: (data) => `${data.facility.state}`,
        size: 200,
      },
      {
        header: "LGA",
        id: "lga",
        accessorFn: (data) => `${data.facility.local_govt}`,
        size: 200,
      },
      {
        header: "Month/Year",
        accessorKey: "month_year",
        size: 200,
      },
      {
        header: "Status",
        accessorKey: "status",
        size: 150,
        cell: ({ getValue }) => {
          return (
            <Badge variant="default" className={cn("p-1 rounded-lg", getValue() === "Approved" && "bg-green-100 text-green-500", getValue() === "Reject" && "bg-red-100 text-red-500", getValue() === "Pending" && "bg-yellow-100 text-yellow-500", getValue() === "On Hold" && "text-gray-100 bg-gray-500")}>
              {getValue() as string}
            </Badge>
          );
        },
      },
      {
        header: "",
        id: "actions",
        cell: ({ row }) => <ActionListAction data={row.original} />,
      },
    ],
    []
  );

  const ActionListAction = ({ data }: any) => {
    const [deleteRiskPlanMutation] = SupportiveSupervisionAPI.useDeleteSupportiveSupervisionMutation();
    const deleteHandler = async () => {
      try {
        await deleteRiskPlanMutation({ path: { id: data?.id } }).unwrap();
        toast.success("Successfully deleted");
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
                  to={generatePath(RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_DETAILS, {
                    id: data?.id,
                  })}
                >
                  <Button className="w-full flex items-center justify-start gap-2" variant="ghost">
                    <EyeIcon />
                    View
                  </Button>
                </Link>
                <Button
                  className="w-full flex items-center justify-start gap-2"
                  variant="ghost"
                  onClick={() => {
                    dispatch(
                      openDialog({
                        type: DialogType.SspApproveModal,
                        dialogProps: {
                          header: "Request Approval",
                          width: "max-w-2xl",
                        },
                      })
                    );
                  }}
                >
                  <ApproveIcon />
                  Approve
                </Button>
                <Link to={RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_DETAILS_APPROVAL}>
                  <Button className="w-full flex items-center justify-start gap-2" variant="ghost">
                    <ApprovalStatusIcon />
                    Approval Status
                  </Button>
                </Link>
                <Button className="w-full flex items-center justify-start gap-2" variant="ghost" onClick={deleteHandler}>
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
    <div className="space-y-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Programs</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Plans</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon="iconoir:slash" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Supportive Supervision Plan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="flex gap-2 py-6">
              <AddSquareIcon />
              New Supervision plan
              <ArrowDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className=" w-fit">
            <div className="flex flex-col items-start justify-between gap-1">
              <Button
                className="w-full flex gap-2 items-center justify-start"
                variant="ghost"
                type="button"
                onClick={() => {
                  dispatch(
                    openDialog({
                      type: DialogType.SspUpload,
                      dialogProps: {
                        header: "Upload New Document",
                        width: "max-w-md",
                      },
                    })
                  );
                }}
              >
                <UploadIcon />
                Upload
              </Button>

              <Link to={RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_COMPOSITION}>
                <Button className="w-full flex gap-2 items-center justify-start" variant="ghost">
                  <AddSquareIcon fillColor="#FF0000" />
                  Create Manually
                </Button>
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Card className="space-y-5">
        <div className="flex items-center justify-start gap-2">
          <span className="flex items-center w-1/3 px-2 py-2 border rounded-lg">
            <SearchIcon />
            <input placeholder="Search" type="text" className="ml-2 h-6 border-none bg-none focus:outline-none outline-none" />
          </span>
          <Button className="shadow-sm" variant="ghost">
            <FilterIcon />
          </Button>
        </div>

        <DataTable data={data || []} columns={columns} isLoading={isLoading} />
      </Card>
    </div>
  );
};

export default SupportiveSupervisionPlan;
