import { Checkbox } from "components/ui/checkbox";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import useTable from "hooks/useTable";
import Table from "lib/react-table/Table";
import { Plus } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { cn } from "lib/utils";
import { Badge } from "components/ui/badge";
import IconButton from "components/shared/IconButton";
import { Icon } from "@iconify/react";

const PurchaseRequest = () => {
  const tableInstance = useTable({
    columns,
    data,
    //  state: { pagination },
    //  pageCount: customersQueryResult?.data?.number_of_pages,
    //  manualPagination: true,
    //  onPaginationChange: setPagination,
  });
  return (
    <div className="space-y-10">
      <div>
        <h4 className="text-lg font-bold">Purchase Request</h4>
        <h6>
          Precurement -{" "}
          <span className="text-black font-medium">Purchase Request</span>
        </h6>
      </div>

      <Card className="space-y-10">
        <div className="flex justify-between items-center">
          <h4 className="text-base font-bold">Purchase Request</h4>

          <div>
            <Dialog>
              <DialogTrigger>
                <Button>
                  <span>
                    <Plus size={20} />
                  </span>
                  New PR
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Table
          instance={tableInstance}
          // loading={customersQueryResult.isFetching}
          // error={customersQueryResult.isError}
          // onReload={customersQueryResult.refetch}
        />
      </Card>
    </div>
  );
};

export default PurchaseRequest;
const columns = [
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
    header: "Requisition Name",
    accessorKey: "requisition",
    size: 300,
  },
  {
    header: "Requested Project",
    accessorKey: "requested_project",
    size: 300,
  },
  {
    header: "Unit",
    accessorKey: "unit",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      return (
        <Badge
          className={cn(
            "p-1 rounded-lg",
            getValue() === "Approved" && "bg-green-light text-green-dark",
            getValue() === "Reject" && "bg-red-light text-red-dark",
            getValue() === "Pending" && "bg-yellow-light text-yellow-dark",
            getValue() === "On Hold" && "text-grey-light bg-grey-dark"
          )}
        >
          {getValue()}
        </Badge>
      );
    },
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <ActionListAction data={row.original} />,
  },
];

const data = [
  {
    requisition: "HIV/AIDS Testing Kit Order",
    requested_project: "Project LifeGuard: Comprehensive HIV/AIDS Intervention",
    status: "Pending",
    unit: "HR Department",
  },
  {
    requisition: "Reproductive Health Survey Equipment",
    requested_project: "VitalVision: A Study on Child Nutrition and Health",
    status: "Approved",
    unit: "Finance Department",
  },
  {
    requisition: "Mobile Health Unit Vehicle Purchase",
    requested_project: "BeatTheBite: Malaria Eradication Initiative",
    status: "Rejected",
    unit: "IT Department",
  },
  {
    requisition: "HIV/AIDS Awareness Campaign Materials",
    requested_project: "HarvestHope: Sustainable Agriculture and Food Security",
    status: "Pending",
    unit: "Sales Department",
  },
  {
    requisition: "Women's Shelter Establishment Fund ",
    requested_project: "ShieldShe: Women's Safety and Empowerment Drive",
    status: "Approved",
    unit: "Marketing Department",
  },
  {
    requisition: "Health Awareness Poster Design",
    requested_project: "UnitedForHealth: AHNi-UNICEF Joint Initiative",
    status: "On Hold",
    unit: "Operations Department",
  },
];

const ActionListAction = ({ data }) => {
  return (
    <div className="flex items-center gap-2">
      <IconButton className="bg-[#F9F9F9] hover:text-primary">
        <Icon icon="solar:pen-bold-duotone" fontSize={15} />
      </IconButton>
      <IconButton className="bg-[#F9F9F9] hover:text-primary">
        <Icon icon="ant-design:delete-twotone" fontSize={15} />
      </IconButton>
    </div>
  );
};
