import { Briefcase } from 'lucide-react';import { Icon } from "@iconify/react";
import { ColumnDef } from "@tanstack/react-table";
import Card from "@/components/Card";
import DataTable from "@/components/Table/DataTable";
import { Badge } from "@/components/ui/badge";
import { ISolicitationRFQData } from "@/features/procurement/types/solicitation";
import { cn } from "@/lib/utils";

const DetailsContent = (props: ISolicitationRFQData) => {
  const {
    title,
    status,
    tender_type,
    background,
    rfq_id,
    solicitation_items,
    opening_date,
    closing_date,
  } = props;

  // Enhanced Debug: Log the items data
  console.log("🔍 RFQ Details - FULL PROPS:", props);
  console.log("🔍 RFQ Details - solicitation_items:", solicitation_items);
  console.log("🔍 RFQ Details - solicitation_items length:", solicitation_items?.length);
  console.log("🔍 RFQ Details - solicitation_items type:", typeof solicitation_items);

  // Check if items exist in other possible field names
  console.log("🔍 RFQ Details - props.items:", (props as any).items);
  console.log("🔍 RFQ Details - all props keys:", Object.keys(props));

  // Deep inspection of first item
  if (solicitation_items && solicitation_items.length > 0) {
    console.log("🔍 RFQ Details - First item full structure:", JSON.stringify(solicitation_items[0], null, 2));
    console.log("🔍 RFQ Details - First item keys:", Object.keys(solicitation_items[0]));
  }

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

        {(opening_date || closing_date) && (
          <div className='flex items-center gap-10'>
            {opening_date && (
              <div className='flex gap-3 items-center'>
                <Icon icon='mdi:calendar-start' fontSize={18} />
                <h6>Opening: {new Date(opening_date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}</h6>
              </div>
            )}
            {closing_date && (
              <div className='flex gap-3 items-center'>
                <Icon icon='mdi:calendar-end' fontSize={18} />
                <h6>Closing: {new Date(closing_date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}</h6>
              </div>
            )}
          </div>
        )}

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
    cell: ({ row }) => {
      let itemName = "N/A";

      // Check item_detail first
      if (row.original?.item_detail && typeof row.original.item_detail === 'object' && typeof row.original.item_detail.name === 'string') {
        itemName = row.original.item_detail.name;
      }
      // Check item object (from API)
      else if (row.original?.item && typeof row.original.item === 'object' && typeof row.original.item.name === 'string') {
        itemName = row.original.item.name;
      }
      // Check direct name field
      else if (typeof row.original?.name === 'string') {
        itemName = row.original.name;
      }

      return (
        <div className='text-left space-y-2'>
          {String(itemName)}
        </div>
      );
    },
  },
  {
    header: "Description",
    size: 300,
    accessorKey: "description",
    cell: ({ row }) => {
      let description = "N/A";

      // Check item_detail
      if (row.original?.item_detail && typeof row.original.item_detail === 'object' && typeof row.original.item_detail.description === 'string') {
        description = row.original.item_detail.description;
      }
      // Check item object
      else if (row.original?.item && typeof row.original.item === 'object' && typeof row.original.item.description === 'string') {
        description = row.original.item.description;
      }
      // Check direct specifications field
      else if (typeof row.original?.specifications === 'string') {
        description = row.original.specifications;
      }
      // Check direct description field (but only if it's a string, not an object)
      else if (typeof row.original?.description === 'string') {
        description = row.original.description;
      }

      return (
        <div className='text-left space-y-2'>
          {String(description)}
        </div>
      );
    },
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
    size: 120,
    cell: ({ row }) => {
      const quantity = row.original?.quantity;
      return (
        <div className='text-center space-y-2'>
          {typeof quantity === 'number' || typeof quantity === 'string' ? quantity : "N/A"}
        </div>
      );
    },
  },
  {
    header: "UOM",
    size: 120,
    accessorKey: "uom",
    cell: ({ row }) => {
      let uom = "pieces";

      // Check item_detail
      if (row.original?.item_detail && typeof row.original.item_detail === 'object' && typeof row.original.item_detail.uom === 'string') {
        uom = row.original.item_detail.uom;
      }
      // Check item object
      else if (row.original?.item && typeof row.original.item === 'object' && typeof row.original.item.uom === 'string') {
        uom = row.original.item.uom;
      }
      // Check direct unit field
      else if (typeof row.original?.unit === 'string') {
        uom = row.original.unit;
      }

      return (
        <div className='text-center space-y-2'>
          {String(uom)}
        </div>
      );
    },
  },
  {
    header: "Lot",
    size: 150,
    accessorKey: "lot",
    cell: ({ row }) => {
      let lot = "No Lot";

      if (typeof row.original?.lot_detail?.name === 'string') {
        lot = row.original.lot_detail.name;
      } else if (typeof row.original?.lot === 'string' && row.original.lot !== "no-lot") {
        lot = row.original.lot;
      } else if (typeof row.original?.lot === 'number') {
        lot = `Lot ${row.original.lot}`;
      } else if (typeof row.original?.lot === 'object' && row.original?.lot?.name) {
        lot = row.original.lot.name;
      }

      return (
        <div className='text-center space-y-2'>
          {lot}
        </div>
      );
    },
  },
  {
    header: "Specification",
    size: 250,
    accessorKey: "specification",
    cell: ({ row }) => {
      let spec = "N/A";

      // Check direct specification field
      if (typeof row.original?.specification === 'string') {
        spec = row.original.specification;
      }
      // Check direct specifications field
      else if (typeof row.original?.specifications === 'string') {
        spec = row.original.specifications;
      }
      // Check item_detail
      else if (row.original?.item_detail && typeof row.original.item_detail === 'object' && typeof row.original.item_detail.description === 'string') {
        spec = row.original.item_detail.description;
      }
      // Check item object
      else if (row.original?.item && typeof row.original.item === 'object' && typeof row.original.item.description === 'string') {
        spec = row.original.item.description;
      }

      return (
        <div className='text-left space-y-2'>
          {String(spec)}
        </div>
      );
    },
  },
];
