import { Link, generatePath } from "react-router-dom";
import Card from "components/shared/Card";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import ArrowDownIcon from "components/icons/ArrowDownIcon";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import MoreOptionsHorizontalIcon from "components/icons/MoreOptionsHorizontalIcon";
import { RouteEnum } from "constants/RouterConstants";
import EyeIcon from "components/icons/EyeIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import BreadcrumbCard from "components/shared/Breadcrumb";
import ProcurementPlanAPI from "services/procurementApi/procurement-plan";
import { ProcurementPlanResultsData } from "definations/procurement-types/procurementPlan";
import UploadIcon from "components/icons/UploadIcon";

function ProcurementPlan() {
  const { data, isLoading } = ProcurementPlanAPI.useGetProcurementPlansQuery(
    {}
  );

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Procurement Plan", icon: false },
  ];

  return (
    <section className="min-h-screen space-y-10">
      <BreadcrumbCard list={breadcrumbs} />

      <div className="flex items-center justify-end gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="flex gap-2 py-6">
              <AddSquareIcon />
              New Procurement Plan
              <ArrowDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className=" w-fit">
            <div className="flex flex-col items-start justify-between gap-1">
              <Link
                className="w-full"
                to={generatePath(RouteEnum.CREATE_PROCUREMENT)}
              >
                <Button
                  className="w-full flex items-center gap-2 justify-start"
                  variant="ghost"
                >
                  <AddSquareIcon fillColor="#FF0000" /> Create from scratch
                </Button>
              </Link>
              <Button
                className="w-full flex items-center gap-2 justify-start"
                variant="ghost"
              >
                <UploadIcon /> Upload Procurement plan
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Card className="space-y-5">
        <div className="flex items-center justify-start gap-2">
          <div className="flex items-center w-1/3 px-2 py-2 border rounded-lg">
            <SearchIcon />
            <input
              placeholder="Search"
              type="text"
              className="ml-2 h-full w-full border-none bg-none focus:outline-none outline-none"
            />
          </div>
          <Button className="shadow-sm" variant="ghost">
            <FilterIcon />
          </Button>
        </div>

        <DataTable
          data={data?.results || []}
          columns={columns}
          isLoading={isLoading}
        />
      </Card>
    </section>
  );
}

export default ProcurementPlan;

const columns: ColumnDef<ProcurementPlanResultsData>[] = [
  {
    header: "Budget Line",
    accessorKey: "budget_line",
    size: 120,
  },
  {
    header: "Owner",
    accessorKey: "owner",
    size: 100,
  },
  {
    header: "Work Plan Activity Reference",
    accessorFn: (data) => `${data?.workplan_activity_object?.description}`,
    size: 400,
  },
  {
    header: "BUDGET ALLOCATION",
    columns: [
      {
        header: "Approved Budget Amount - USD",
        accessorKey: "approved_budget_dollars",
        size: 250,
      },
      {
        header: "Total Quantity",
        accessorKey: "hhjt",
        size: 250,
      },
    ],
  },
  {
    header: "Description of Procurement Activities",
    accessorKey: "description",
    size: 250,
  },
  {
    header: "Approved Budget ($)",
    accessorKey: "approved_budget",
    size: 250,
  },
  {
    header: "Responsible PR Staff",
    accessorKey: "pr_staff",
    size: 250,
  },
  {
    header: "PPM",
    accessorFn: (data) => `${data?.is_ppm ? "Yes" : "No"}`,
    size: 100,
  },
  {
    header: "Mode Of Procurement",
    accessorKey: "mode_of_procurement",
    size: 250,
  },
  {
    header: "Procurement Process",
    accessorKey: "procurement_process",
    size: 200,
  },
  {
    header: "Start Date",
    accessorKey: "start_date",
    size: 200,
  },
  {
    header: "PROCUREMENT MILESTONE",
    columns: [
      {
        header: "Bid Document Finalization ",
        accessorKey: "approvedBudget",
        size: 200,
      },
      {
        header: "Advertise Bid",
        accessorKey: "approvedBudget",
        size: 300,
      },
      {
        header: "Evaluation",
        accessorKey: "approvedBudget",
        size: 200,
      },
      {
        header: "Negotiation",
        accessorKey: "gfd",
        size: 250,
      },
      {
        header: "Signing/Final Order",
        accessorKey: "eggf",
        size: 250,
      },
    ],
  },
  {
    header: "Selected Supplier",
    accessorKey: "selected_supplier",
    size: 250,
  },
  {
    header: "Expected Delivery Date 1",
    accessorKey: "expected_delivery_date_1",
    size: 200,
  },
  {
    header: "Expected Delivery Date 2",
    accessorKey: "expected_delivery_date_2",
    size: 200,
  },
  {
    header: "Delivery to",
    accessorKey: "ware_houses",
    size: 300,
  },
  {
    header: "Donor Remarks",
    accessorKey: "donor_remarks",
    size: 200,
  },
  {
    header: "Implementer Remarks",
    accessorKey: "implenter_remarks",
    size: 200,
  },
  {
    header: "",
    size: 80,
    id: "actions",
    cell: ({ row }) => <ActionListAction data={row.original} />,
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
              <Link
                className="w-full"
                to={generatePath(RouteEnum.PROCUREMENT_DETAILS, {
                  id: data?.id,
                })}
              >
                <Button
                  className="w-full flex items-center justify-start gap-2"
                  variant="ghost"
                >
                  <EyeIcon />
                  View
                </Button>
              </Link>
              <Button
                className="w-full flex items-center justify-start gap-2"
                variant="ghost"
              >
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
