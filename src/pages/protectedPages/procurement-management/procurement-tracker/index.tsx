// import Card from "components/shared/Card";
import { Button } from "components/ui/button";
// import SearchIcon from "components/icons/SearchIcon";
// import FilterIcon from "components/icons/FilterIcon";
// import DataTable from "components/Table/DataTable";
// import { ColumnDef } from "@tanstack/react-table";
import BreadcrumbCard from "components/shared/Breadcrumb";
// import {
//   Dialog,
//   //   DialogClose,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "components/ui/dialog";
import ProcurementTrackerAPI from "services/procurementApi/procurement-tracker";
// import { ProcurementTrackerResults } from "definations/procurement-types/procurementPlan";
// import BackNavigation from "atoms/BackNavigation";
import TabState from "components/ui/TabState";
import { useState } from "react";
import { FileDown } from "lucide-react";
import { Loading } from "components/shared/Loading";
import SummaryCard from "./SummaryCard";
import DeliveryStageCard from "./DeliveryStageCard";
import ProcurementProcessCard from "./ProcurementProcessCard";

// interface TableDataType {
//   solicitationRef: string;
//   lot: string;
//   solicitationDate: string;
//   requestType: string;
//   tenderType: string;
//   status: string;
//   poRef: string;
//   poDate: string;
//   vendor: string;
//   unitCost: number;
//   totalAmount: string;
//   deliveryDate: string;
// }

// const tableColumns: ColumnDef<TableDataType>[] = [
//   {
//     header: "Solicitation Ref",
//     accessorKey: "solicitationRef",
//     size: 120,
//   },

//   {
//     header: "Lot",
//     accessorKey: "lot",
//     size: 120,
//   },

//   {
//     header: "Solicitation Date",
//     accessorKey: "solicitationDate",
//     size: 120,
//   },

//   {
//     header: "Request Type",
//     accessorKey: "requestType",
//     size: 120,
//   },

//   {
//     header: "Tender Type",
//     accessorKey: "tenderType",
//     size: 120,
//   },

//   {
//     header: "Status",
//     accessorKey: "status",
//     size: 120,
//   },

//   {
//     header: "PO Ref",
//     accessorKey: "poRef",
//     size: 120,
//   },

//   {
//     header: "PO Date",
//     accessorKey: "poDate",
//     size: 120,
//   },

//   {
//     header: "Vendor",
//     accessorKey: "vendor",
//     size: 120,
//   },

//   {
//     header: "Unit Cost",
//     accessorKey: "unitCost",
//     size: 120,
//   },

//   {
//     header: "Total Amount",
//     accessorKey: "totalAmount",
//     size: 120,
//   },

//   {
//     header: "Delivery Date",
//     accessorKey: "deliveryDate",
//     size: 120,
//   },
// ];

// const dataSource: TableDataType[] = [
//   {
//     solicitationRef: "65568862579+8",
//     lot: "24/10/2024",
//     solicitationDate: "24/10/2024",
//     requestType: "Incoming Type",
//     tenderType: "Open Tender",
//     status: "Pending",
//     poRef: "65568862579+8",
//     poDate: "24/10/2024",
//     vendor: "Dave Wilson",
//     unitCost: 100,
//     totalAmount: "$500,000",
//     deliveryDate: "24/10/2024",
//   },

//   {
//     solicitationRef: "65568862579+8",
//     lot: "24/10/2024",
//     solicitationDate: "24/10/2024",
//     requestType: "Incoming Type",
//     tenderType: "Open Tender",
//     status: "Cancelled",
//     poRef: "65568862579+8",
//     poDate: "24/10/2024",
//     vendor: "Dave Wilson",
//     unitCost: 100,
//     totalAmount: "$500,000",
//     deliveryDate: "24/10/2024",
//   },
// ];

function ProcurementTracker() {
  const { isLoading } = ProcurementTrackerAPI.useGetProcurementTrackersQuery(
    {}
  );

  //   const columns: ColumnDef<ProcurementTrackerResults>[] = [
  //     {
  //       header: "PR Reference",
  //       accessorKey: "pr_reference",
  //       size: 150,
  //     },
  //     {
  //       header: "PR Item",
  //       accessorKey: "item_name",
  //       size: 150,
  //     },
  //     {
  //       header: "Quantity",
  //       accessorKey: "quantity",
  //       size: 150,
  //     },
  //     {
  //       header: "Request Date",
  //       accessorKey: "request_date",
  //       size: 150,
  //     },
  //     {
  //       header: "Date Required",
  //       accessorKey: "required_date",
  //       size: 150,
  //     },
  //     {
  //       header: "Requesting Department",
  //       accessorKey: "deparment",
  //       size: 200,
  //     },
  //     {
  //       header: "",
  //       id: "action",
  //       size: 80,
  //       cell: ({ row }) => <Action data={row.original} />,
  //     },
  //   ];

  // eslint-disable-next-line react/prop-types
  //   const Action = ({ data }: any) => {
  //     return (
  //       <div>
  //         <Dialog>
  //           <DialogTrigger>View</DialogTrigger>
  //           <DialogContent className='max-w-6xl max-h-[700px] overflow-auto'>
  //             <DialogHeader className='mt-10 space-y-5 text-center'>
  //               <DialogTitle className='text-2xl text-center'>
  //                 Procurement Plan Tracker
  //               </DialogTitle>
  //               {/* <DialogClose></DialogClose> */}
  //             </DialogHeader>
  //             <Card className='space-y-10'>
  //               <DataTable columns={tableColumns} data={dataSource} />
  //             </Card>
  //           </DialogContent>
  //         </Dialog>
  //       </div>
  //     );
  //   };

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Procurement Tracker", icon: false },
  ];

  const tabDetails = [
    {
      id: 1,
      state: "summary",
      name: "Summary",

      tabComponent: <SummaryCard />,
      // tabComponent: <GrantDetailsCard grantDetails={getGrant?.data} />,
    },
    {
      id: 2,
      state: "procurement_process_stage",
      name: "Procurement Process Stage",
      tabComponent: <ProcurementProcessCard />,
      // tabComponent: <ExpenditureHistory grantDetails={getGrant?.data} />,
    },

    {
      id: 1,
      state: "delivery_stage_and_vendor_performance_mangement",
      name: "Delivery Stage and Vendor Performance Mangement",
      tabComponent: <DeliveryStageCard />,
      // tabComponent: <GrantDetailsCard grantDetails={getGrant?.data} />,
    },
  ];
  const [tabState, setTabState] = useState<string | number>(
    tabDetails[0].state
  );

  return (
    <main className='min-h-screen space-y-8'>
      <BreadcrumbCard list={breadcrumbs} />
      <section className='w-full flex items-center justify-between'>
        <div className='w-auto flex gap-x-[1.25rem] items-center justify-start'>
          {/* <BackNavigation /> */}
          <TabState
            tabArray={tabDetails}
            setState={setTabState}
            tabState={tabState}
          />
        </div>
        <div className='flex items-center gap-x-3'>
          {/* <Button variant='custom'>
            2021/2022
            <span>
              <ChevronDown size={18} />
            </span>
          </Button> */}
          <Button variant='default'>
            <span>
              <FileDown size={18} />
            </span>
            Download xlsx
          </Button>
        </div>
      </section>
      {isLoading ? (
        <Loading />
      ) : (
        <section className='w-full'>
          {tabDetails.map((item, index) => {
            return (
              tabState === item.state && (
                <div key={index}>{item.tabComponent}</div>
              )
            );
          })}
        </section>
      )}
      {/* <Card className='space-y-5'>
        <div className='flex items-center justify-start gap-2'>
          <span className='flex w-1/3 items-center rounded-lg border px-2 py-2'>
            <SearchIcon />
            <input
              placeholder='Search'
              type='text'
              className='ml-2 h-6 border-none bg-none outline-none focus:outline-none'
            />
          </span>
          <Button className='shadow-sm' variant='ghost'>
            <FilterIcon />
          </Button>
        </div>

        <DataTable
          data={data?.results || []}
          columns={columns}
          isLoading={isLoading}
        />
      </Card> */}
    </main>
  );
}

export default ProcurementTracker;

/*   <Card className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
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
              </Card> */
