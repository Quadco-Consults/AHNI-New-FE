import { Icon } from "@iconify/react";
import { ColumnDef } from "@tanstack/react-table";
import Card from "components/Card";
import DataTable from "components/Table/DataTable";
import { Badge } from "components/ui/badge";
import { ISolicitationRFQData } from "@/features/procurement/types/solicitation";
import { cn } from "lib/utils";

const DetailsContent = (props: ISolicitationRFQData) => {
  const {
    title,
    status,
    tender_type,
    background,
    rfq_id,
    solicitation_items,
  } = props;

  // Enhanced Debug: Log the items data
  console.log("🔍 RFQ Details - FULL PROPS:", props);
  console.log("🔍 RFQ Details - solicitation_items:", solicitation_items);
  console.log("🔍 RFQ Details - solicitation_items length:", solicitation_items?.length);
  console.log("🔍 RFQ Details - solicitation_items type:", typeof solicitation_items);

  // Check if items exist in other possible field names
  console.log("🔍 RFQ Details - props.items:", (props as any).items);
  console.log("🔍 RFQ Details - all props keys:", Object.keys(props));

  return (
    <div className='p-5'>
      <Card className='space-y-8 p-10'>
        <h2 className='font-semibold text-lg'>{title}</h2>

        <h4 className='text-green-dark text-base font-medium'>
          Competitive bid analysis&nbsp;
          <Badge
            className={cn(
              status === "OPEN" && "bg-green-200 text-green-800",
              status === "CLOSED" && "bg-red-200 text-red-800",
              status === "Pending" && "bg-yellow-200 text-yellow-800"
            )}
          >
            {status}
          </Badge>
        </h4>

        <div className='flex items-center gap-10'>
          <div className='flex gap-3 items-center'>
            <Icon icon='ooui:reference' fontSize={18} />
            <h6>{rfq_id}</h6>
          </div>
          {/* <div className='flex gap-3 items-center'>
            <Icon icon='iconamoon:location-pin-duotone' fontSize={18} />
            <h6>HEAD OFFICE ABUJA</h6>
          </div> */}
          <div className='flex gap-3 items-center'>
            <Icon icon='solar:case-minimalistic-bold-duotone' fontSize={18} />
            <h6>{tender_type}</h6>
          </div>
        </div>

        <div className='space-y-4'>
          <h2 className='font-medium text-base'>Background</h2>
          <h4 className=' text-gray-500'>{background}</h4>
        </div>

        <div className='space-y-4'>
          <h2 className='font-medium text-yellow-darker text-base'>Items</h2>

          <div className=''>
            {/* Enhanced debugging for items */}
            {(!solicitation_items || solicitation_items.length === 0) && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  ⚠️ No items found. Check browser console for debugging info.
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  Expected: solicitation_items array with item data
                </p>
              </div>
            )}

            <DataTable
              data={solicitation_items || (props as any).items || []}
              columns={columns}
              // isLoading={isLoading}
            />
            {/* {solicitation_items?.map((item) => {
              console.log({ item });

              return (
                <Card key={item?.id} className='border-yellow-darker space-y-3'>
                  <div className='flex items-center gap-5'>
                    <h4 className='w-1/4 font-medium'>Item:</h4>
                    <h4>{item?.item_detail?.name}</h4>
                  </div>
                  <div className='flex items-center gap-5'>
                    <h4 className='w-1/4 font-medium'>Quantity:</h4>
                    <h4>{item?.quantity}</h4>
                  </div>
                  <div className='flex items-center gap-5'>
                    <h4 className='w-1/4 font-medium'>Lot:</h4>
                    <h4>{item?.lot_detail?.name}</h4>
                  </div>
                  <div className='flex items-center gap-5'>
                    <h4 className='w-1/4 font-medium'>Description:</h4>
                    <h4>{item?.item_detail?.description}</h4>
                  </div>
                  <div className='flex items-center gap-5'>
                    <h4 className='w-1/4 font-medium'>UOM:</h4>
                    <h4>{item?.item_detail?.uom}</h4>
                  </div>
                </Card>
              );
            })} */}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DetailsContent;

const columns: ColumnDef<any>[] = [
  {
    header: "Item Name",
    size: 240,
    accessorKey: "item_name",
    cell: ({ row }) => (
      <div className='text-left space-y-2'>
        {row.original?.item_detail?.name || row.original?.description || "N/A"}
      </div>
    ),
  },
  {
    header: "Description",
    size: 300,
    accessorKey: "description",
    cell: ({ row }) => (
      <div className='text-left space-y-2'>
        {row.original?.item_detail?.description ||
         row.original?.description ||
         row.original?.specifications || "N/A"}
      </div>
    ),
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
    size: 120,
    cell: ({ row }) => (
      <div className='text-center space-y-2'>{row.original?.quantity || "N/A"}</div>
    ),
  },
  {
    header: "UOM",
    size: 120,
    accessorKey: "uom",
    cell: ({ row }) => (
      <div className='text-center space-y-2'>
        {row.original?.item_detail?.uom || row.original?.unit || "pieces"}
      </div>
    ),
  },
  {
    header: "Lot",
    size: 150,
    accessorKey: "lot",
    cell: ({ row }) => (
      <div className='text-center space-y-2'>
        {row.original?.lot_detail?.name ||
         (row.original?.lot && row.original?.lot !== "no-lot" ? row.original?.lot : "No Lot")}
      </div>
    ),
  },
  {
    header: "Specification",
    size: 250,
    accessorKey: "specification",
    cell: ({ row }) => (
      <div className='text-left space-y-2'>
        {row.original?.specification ||
         row.original?.specifications ||
         row.original?.item_detail?.description || "N/A"}
      </div>
    ),
  },
  {
    header: "Frequency",
    size: 100,
    accessorKey: "frequency",
    cell: ({ row }) => (
      <div className='text-center space-y-2'>
        {row.original?.frequency || "1"}
      </div>
    ),
  },
  {
    header: "Days",
    size: 100,
    accessorKey: "number_of_days",
    cell: ({ row }) => (
      <div className='text-center space-y-2'>
        {row.original?.number_of_days || "1"}
      </div>
    ),
  },
];
