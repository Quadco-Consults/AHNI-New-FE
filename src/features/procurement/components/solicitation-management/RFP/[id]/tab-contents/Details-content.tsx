import { Icon } from "@iconify/react";
import { ColumnDef } from "@tanstack/react-table";
import Card from "components/Card";
import DataTable from "components/Table/DataTable";
import { Badge } from "components/ui/badge";
import { ISolicitationRFQData } from "definations/procurement-types/solicitation";
import { cn } from "lib/utils";

const DetailsContent = ({
  title,
  status,
  tender_type,
  background,
  rfq_id,
  solicitation_items,
}: ISolicitationRFQData) => {
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
            <DataTable
              data={solicitation_items || []}
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
    accessorKey: "company_address",
    cell: ({ row }) => (
      <div className='text-center space-y-2'>
        {row.original?.item_detail?.name}
      </div>
    ),
  },
  {
    header: "Description",
    size: 200,
    accessorKey: "status",
    cell: ({ row }) => (
      <div className='text-center space-y-2'>
        {row.original?.item_detail?.description}
      </div>
    ),
  },

  {
    header: "Quantity",
    accessorKey: "quantity",
    size: 300,
    cell: ({ row }) => (
      <div className='text-center space-y-2'>{row.original?.quantity}</div>
    ),
  },
  {
    header: "UOM",
    size: 200,
    accessorKey: "status",
    cell: ({ row }) => (
      <div className='text-center space-y-2'>
        {row.original?.item_detail?.uom}
      </div>
    ),
  },
  {
    header: "Lot",
    size: 200,
    accessorKey: "status",
    cell: ({ row }) => (
      <div className='text-center space-y-2'>
        {row.original?.lot_detail?.name}
      </div>
    ),
  },
  {
    header: "Specification",
    size: 200,
    accessorKey: "status",
    cell: ({ row }) => (
      <div className='text-center space-y-2'>{row.original?.specification}</div>
    ),
  },
];
