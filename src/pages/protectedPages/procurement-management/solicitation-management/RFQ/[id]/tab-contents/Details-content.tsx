import { Icon } from "@iconify/react";
import Card from "components/shared/Card";
import { Badge } from "components/ui/badge";
import { ISolicitationRFQData } from "definations/procurement-types/solicitation";
import { cn } from "lib/utils";

const DetailsContent = ({
  title,
  status,
  tender_type,
  background,
  items,
  rfq_id,
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
          <div className='flex gap-3 items-center'>
            <Icon icon='iconamoon:location-pin-duotone' fontSize={18} />
            <h6>HEAD OFFICE ABUJA</h6>
          </div>
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

          <div className='grid grid-cols-2 gap-5'>
            {items?.map((item) => (
              <Card key={item?.id} className='border-yellow-darker space-y-3'>
                <div className='flex items-center gap-5'>
                  <h4 className='w-1/4 font-medium'>Item:</h4>
                  <h4>{item?.item?.name}</h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-1/4 font-medium'>Quantity:</h4>
                  <h4>{item?.quantity}</h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-1/4 font-medium'>Lot:</h4>
                  <h4>{item?.lot}</h4>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DetailsContent;
