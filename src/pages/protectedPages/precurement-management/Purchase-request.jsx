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

        <div className=" overflow-auto">
          <Table
            instance={tableInstance}
            // loading={customersQueryResult.isFetching}
            // error={customersQueryResult.isError}
            // onReload={customersQueryResult.refetch}
          />
        </div>
      </Card>
    </div>
  );
};

export default PurchaseRequest;
const columns = [
  // {
  //   header: "Merchant Name",
  //   accessorFn: (data) => `${data?.first_name} ${data?.last_name}`,
  // },
  {
    header: "Select",
    cell: ({ row }) => <CheckboxAction data={row.original} />,
  },
  {
    header: "Requisition Name",
    accessorKey: "requisition",
  },
  {
    header: "Requested Project",
    accessorKey: "requested_project",
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
            getValue() === "Approved"
              ? "bg-green-light text-green-dark"
              : "bg-red-light text-red-dark"
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
    // cell: ({ row }) => <CustomerListAction data={row.original} />,
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

const CheckboxAction = () => {
  return <Checkbox className="" />;
};
