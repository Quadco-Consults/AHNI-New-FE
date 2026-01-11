import { Briefcase } from 'lucide-react';import { Icon } from "@iconify/react";
import Card from "@/components/Card";
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
  console.log("🔍 RFP Details - FULL PROPS:", props);
  console.log("🔍 RFP Details - solicitation_items:", solicitation_items);
  console.log("🔍 RFP Details - solicitation_items length:", solicitation_items?.length);
  console.log("🔍 RFP Details - solicitation_items type:", typeof solicitation_items);

  // Check if items exist in other possible field names
  console.log("🔍 RFP Details - props.items:", (props as any).items);
  console.log("🔍 RFP Details - all props keys:", Object.keys(props));

  // Deep inspection of first item
  if (solicitation_items && solicitation_items.length > 0) {
    console.log("🔍 RFP Details - First item full structure:", JSON.stringify(solicitation_items[0], null, 2));
    console.log("🔍 RFP Details - First item keys:", Object.keys(solicitation_items[0]));
  }

  return (
    <div className='p-5'>
      <Card className='space-y-8 p-10'>
        <h2 className='font-semibold text-lg'>{title}</h2>

        <h4 className='text-blue-600 text-base font-medium'>
          Service Request for Proposal&nbsp;
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

        {/* Service Requirements Section */}
        <div className='space-y-6'>
          <h2 className='font-medium text-blue-600 text-lg'>Service Requirements</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Card className='p-6 border-blue-200'>
              <div className='space-y-3'>
                <h3 className='font-semibold text-gray-800 flex items-center gap-2'>
                  <Icon icon='carbon:service-desk' className='text-blue-500' />
                  Project Scope
                </h3>
                <p className='text-gray-600 text-sm'>
                  {background || 'Detailed project scope and requirements will be provided in the RFP document.'}
                </p>
              </div>
            </Card>

            <Card className='p-6 border-blue-200'>
              <div className='space-y-3'>
                <h3 className='font-semibold text-gray-800 flex items-center gap-2'>
                  <Icon icon='carbon:time' className='text-blue-500' />
                  Project Timeline
                </h3>
                <div className='text-sm text-gray-600'>
                  <div><strong>Opening Date:</strong> {opening_date ? new Date(opening_date).toLocaleDateString() : 'TBD'}</div>
                  <div><strong>Closing Date:</strong> {closing_date ? new Date(closing_date).toLocaleDateString() : 'TBD'}</div>
                </div>
              </div>
            </Card>

            <Card className='p-6 border-blue-200'>
              <div className='space-y-3'>
                <h3 className='font-semibold text-gray-800 flex items-center gap-2'>
                  <Icon icon='carbon:document' className='text-blue-500' />
                  Submission Requirements
                </h3>
                <ul className='text-sm text-gray-600 space-y-1'>
                  <li>• Technical Proposal</li>
                  <li>• Commercial Proposal</li>
                  <li>• Company Profile & Experience</li>
                  <li>• Team Qualifications</li>
                </ul>
              </div>
            </Card>

            <Card className='p-6 border-blue-200'>
              <div className='space-y-3'>
                <h3 className='font-semibold text-gray-800 flex items-center gap-2'>
                  <Icon icon='carbon:analytics' className='text-blue-500' />
                  Evaluation Criteria
                </h3>
                <div className='text-sm text-gray-600 space-y-1'>
                  <div><strong>Technical Proposal:</strong> 70%</div>
                  <div><strong>Commercial Proposal:</strong> 30%</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Service Specifications */}
        {solicitation_items && solicitation_items.length > 0 && (
          <div className='space-y-4'>
            <h2 className='font-medium text-blue-600 text-lg'>Service Specifications</h2>
            <div className='space-y-3'>
              {solicitation_items.map((item, index) => (
                <Card key={item?.id || index} className='p-4 border-blue-100'>
                  <div className='space-y-2'>
                    <h4 className='font-semibold text-gray-800'>{item?.item_detail?.name || `Service Specification ${index + 1}`}</h4>
                    <p className='text-gray-600 text-sm'>{item?.item_detail?.description || item?.specification || 'Service specification details'}</p>
                    {item?.quantity && (
                      <div className='text-xs text-blue-600'>
                        <strong>Required Quantity/Duration:</strong> {item.quantity} {item?.item_detail?.uom || 'units'}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DetailsContent;
