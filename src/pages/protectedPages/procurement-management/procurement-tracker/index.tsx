import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import DataTable from "components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import BreadcrumbCard from "components/shared/Breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import ProcurementTrackerAPI from "services/procurementApi/procurement-tracker";
import { ProcurementTrackerResults } from "definations/procurement-types/procurementPlan";

function ProcurementTracker() {
  const { data, isLoading } =
    ProcurementTrackerAPI.useGetProcurementTrackersQuery({});

  const columns: ColumnDef<ProcurementTrackerResults>[] = [
    {
      header: "PR Reference",
      accessorKey: "pr_reference",
      size: 150,
    },
    {
      header: "PR Item",
      accessorKey: "item_name",
      size: 150,
    },
    {
      header: "Quantity",
      accessorKey: "quantity",
      size: 150,
    },
    {
      header: "Request Date",
      accessorKey: "request_date",
      size: 150,
    },
    {
      header: "Date Required",
      accessorKey: "required_date",
      size: 150,
    },
    {
      header: "Requesting Department",
      accessorKey: "deparment",
      size: 200,
    },
    {
      header: "",
      id: "action",
      size: 80,
      cell: ({ row }) => <Action data={row.original} />,
    },
  ];

  // eslint-disable-next-line react/prop-types
  const Action = ({ data }: any) => {
    return (
      <div>
        <Dialog>
          <DialogTrigger>View</DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[700px] overflow-auto">
            <DialogHeader className="mt-10 space-y-5 text-center">
              <DialogTitle className="text-2xl text-center"></DialogTitle>
            </DialogHeader>
            <Card className="space-y-10">
              <Card className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
                <div className="space-y-2">
                  <h4 className="font-bold">Solicitation Ref</h4>
                  <p className="text-sm">
                    {data?.solicitation?.solicitaion_ref}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold">Lot</h4>
                  <p className="text-sm">{data?.solicitation?.lot}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold">Solicitation Date</h4>
                  <p className="text-sm">{data?.solicitation?.opening_date}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold">Request Type</h4>
                  <p className="text-sm">{data?.solicitation?.request_type}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold">Tender Type</h4>
                  <p className="text-sm">{data?.solicitation?.tender_type}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold">Status</h4>
                  <p className="text-sm">{data?.solicitation?.status}</p>
                </div>
              </Card>
              <Card className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
                <div className="space-y-2">
                  <h4 className="font-bold">PO Ref</h4>
                  <p className="text-sm">{data?.purchse_order?.po_reference}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold">PO Date</h4>
                  <p className="text-sm">{data?.purchse_order?.po_date}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold">Vendor</h4>
                  <p className="text-sm">{data?.purchse_order?.vendor}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold">FCO</h4>
                  <p className="text-sm">{data?.purchse_order?.fco}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold">Unit Cost</h4>
                  <p className="text-sm">{data?.purchse_order?.unit_cost}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold">Total Amount</h4>
                  <p className="text-sm">
                    ₦{data?.purchse_order?.sub_total_amount.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold">Status</h4>
                  <p className="text-sm">{data?.purchse_order?.status}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold">Delivery Date</h4>
                  <p className="text-sm">Pending</p>
                </div>
              </Card>
            </Card>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Procurement Tracker", icon: false },
  ];

  return (
    <section className="min-h-screen space-y-8">
      <BreadcrumbCard list={breadcrumbs} />
      <Card className="space-y-5">
        <div className="flex items-center justify-start gap-2">
          <span className="flex w-1/3 items-center rounded-lg border px-2 py-2">
            <SearchIcon />
            <input
              placeholder="Search"
              type="text"
              className="ml-2 h-6 border-none bg-none outline-none focus:outline-none"
            />
          </span>
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

export default ProcurementTracker;
