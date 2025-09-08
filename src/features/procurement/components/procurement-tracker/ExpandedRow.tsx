import { Card } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { format } from "date-fns";

interface ExpandedRowProps {
  item: any; // Will be properly typed based on ProcurementTrackerResults
}

const ExpandedRow = ({ item }: ExpandedRowProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <tr className='expanded-row bg-gray-50'>
      <td colSpan={8} className='p-0'>
        <div className='p-6 space-y-6'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>Procurement Timeline</h3>
          
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {/* Purchase Request Stage */}
            <Card className='p-4 border-l-4 border-l-blue-500'>
              <div className='flex items-center justify-between mb-3'>
                <h4 className='font-semibold text-blue-700'>Purchase Request</h4>
                <Badge variant="outline" className='text-blue-600 border-blue-600'>
                  Stage 1
                </Badge>
              </div>
              <div className='space-y-2 text-sm'>
                <p><span className='font-medium'>Reference:</span> {item.pr_reference || 'N/A'}</p>
                <p><span className='font-medium'>Date:</span> {formatDate(item.request_date)}</p>
                <p><span className='font-medium'>Department:</span> {item.deparment || item.department || item.office || 'N/A'}</p>
                <p><span className='font-medium'>Required Date:</span> {formatDate(item.required_date)}</p>
                {item.purchase_request_value && (
                  <p><span className='font-medium'>Value:</span> ${Number(item.purchase_request_value).toLocaleString()}</p>
                )}
              </div>
            </Card>

            {/* Solicitation/RFQ Stage */}
            {item.solicitation ? (
              <Card className='p-4 border-l-4 border-l-orange-500'>
                <div className='flex items-center justify-between mb-3'>
                  <h4 className='font-semibold text-orange-700'>Solicitation/RFQ</h4>
                  <Badge variant="outline" className='text-orange-600 border-orange-600'>
                    Stage 2
                  </Badge>
                </div>
                <div className='space-y-2 text-sm'>
                  <p><span className='font-medium'>Reference:</span> {item.solicitation.solicitaion_ref || item.solicitation.reference || 'N/A'}</p>
                  <p><span className='font-medium'>Opening Date:</span> {formatDate(item.solicitation.opening_date)}</p>
                  <p><span className='font-medium'>Status:</span> 
                    <Badge className='ml-2' variant={item.solicitation.status === 'OPEN' ? 'default' : 'secondary'}>
                      {item.solicitation.status || 'Unknown'}
                    </Badge>
                  </p>
                  {item.solicitation.date_procurement_initiated && (
                    <p><span className='font-medium'>Initiated:</span> {formatDate(item.solicitation.date_procurement_initiated)}</p>
                  )}
                </div>
              </Card>
            ) : (
              <Card className='p-4 border-l-4 border-l-gray-300'>
                <div className='flex items-center justify-between mb-3'>
                  <h4 className='font-semibold text-gray-500'>Solicitation/RFQ</h4>
                  <Badge variant="outline" className='text-gray-500 border-gray-300'>
                    Pending
                  </Badge>
                </div>
                <p className='text-sm text-gray-500'>RFQ process not yet initiated</p>
              </Card>
            )}

            {/* Purchase Order Stage */}
            {item.purchase_order ? (
              <Card className='p-4 border-l-4 border-l-green-500'>
                <div className='flex items-center justify-between mb-3'>
                  <h4 className='font-semibold text-green-700'>Purchase Order</h4>
                  <Badge variant="outline" className='text-green-600 border-green-600'>
                    Stage 3
                  </Badge>
                </div>
                <div className='space-y-2 text-sm'>
                  <p><span className='font-medium'>PO Reference:</span> {item.purchase_order.po_reference || item.purchase_order.reference || 'N/A'}</p>
                  <p><span className='font-medium'>Vendor:</span> {item.purchase_order.vendor || item.purchase_order.vendor_name || 'N/A'}</p>
                  <p><span className='font-medium'>PO Date:</span> {formatDate(item.purchase_order.po_date)}</p>
                  <p><span className='font-medium'>Delivery Due:</span> {formatDate(item.purchase_order.delivery_due_date)}</p>
                  {item.purchase_order.fco_number && (
                    <p><span className='font-medium'>FCO:</span> {item.purchase_order.fco_number}</p>
                  )}
                </div>
              </Card>
            ) : (
              <Card className='p-4 border-l-4 border-l-gray-300'>
                <div className='flex items-center justify-between mb-3'>
                  <h4 className='font-semibold text-gray-500'>Purchase Order</h4>
                  <Badge variant="outline" className='text-gray-500 border-gray-300'>
                    Pending
                  </Badge>
                </div>
                <p className='text-sm text-gray-500'>Purchase order not yet created</p>
              </Card>
            )}
          </div>

          {/* Delivery/Service Details */}
          {item.purchase_order && (
            <div className='mt-6'>
              {item.is_service ? (
                <ServiceDeliveryDetails item={item} />
              ) : (
                <GRNDetails item={item} />
              )}
            </div>
          )}

          {/* Item Details */}
          <Card className='p-4 bg-blue-50'>
            <h4 className='font-semibold text-gray-800 mb-3'>Item Details</h4>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm'>
              <div>
                <span className='font-medium text-gray-600'>Item Name:</span>
                <p className='text-gray-800'>{item.item_name || item.name || item.description || 'N/A'}</p>
              </div>
              <div>
                <span className='font-medium text-gray-600'>Category:</span>
                <p className='text-gray-800'>{item.item_category || item.category || 'N/A'}</p>
              </div>
              <div>
                <span className='font-medium text-gray-600'>Quantity:</span>
                <p className='text-gray-800'>{Number(item.quantity || item.qty || 0).toLocaleString()}</p>
              </div>
              {item.purchase_order?.uom && (
                <div>
                  <span className='font-medium text-gray-600'>Unit:</span>
                  <p className='text-gray-800'>{item.purchase_order.uom}</p>
                </div>
              )}
              <div>
                <span className='font-medium text-gray-600'>Procurement Officer:</span>
                <p className='text-gray-800'>{item.procurement_officer || 'N/A'}</p>
              </div>
            </div>
          </Card>
        </div>
      </td>
    </tr>
  );
};

const ServiceDeliveryDetails = ({ item }: { item: any }) => {
  if (!item.purchase_order?.service_delivery_details && !item.purchase_order?.date_of_service_delivery) {
    return (
      <Card className='p-4 border-l-4 border-l-gray-300'>
        <h4 className='font-semibold text-gray-500 mb-2'>Service Delivery</h4>
        <p className='text-sm text-gray-500'>Service delivery not yet completed</p>
      </Card>
    );
  }

  const delivery = item.purchase_order.service_delivery_details || {};
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <Card className='p-4 border-l-4 border-l-purple-500'>
      <h4 className='font-semibold text-purple-700 mb-3'>Service Delivery</h4>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
        <div>
          <span className='font-medium text-gray-600'>Status:</span>
          <Badge className='ml-2' variant={
            delivery.delivery_status === 'COMPLETED' ? 'default' : 
            delivery.delivery_status === 'IN_PROGRESS' ? 'secondary' : 'outline'
          }>
            {delivery.delivery_status || item.purchase_order.service_status || 'Unknown'}
          </Badge>
        </div>
        {item.purchase_order.date_of_service_delivery && (
          <div>
            <span className='font-medium text-gray-600'>Completion Date:</span>
            <p className='text-gray-800'>{formatDate(item.purchase_order.date_of_service_delivery)}</p>
          </div>
        )}
        {item.purchase_order.service_quality_rating && (
          <div>
            <span className='font-medium text-gray-600'>Quality Rating:</span>
            <p className='text-gray-800'>{item.purchase_order.service_quality_rating}/5</p>
          </div>
        )}
      </div>
    </Card>
  );
};

const GRNDetails = ({ item }: { item: any }) => {
  if (!item.purchase_order?.grn_details && !item.purchase_order?.date_of_grn) {
    return (
      <Card className='p-4 border-l-4 border-l-gray-300'>
        <h4 className='font-semibold text-gray-500 mb-2'>Goods Receipt</h4>
        <p className='text-sm text-gray-500'>Goods not yet received</p>
      </Card>
    );
  }

  const grn = item.purchase_order.grn_details || {};
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <Card className='p-4 border-l-4 border-l-teal-500'>
      <h4 className='font-semibold text-teal-700 mb-3'>Goods Receipt (GRN)</h4>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
        {item.purchase_order.date_of_grn && (
          <div>
            <span className='font-medium text-gray-600'>Receipt Date:</span>
            <p className='text-gray-800'>{formatDate(item.purchase_order.date_of_grn)}</p>
          </div>
        )}
        {grn.invoice_number && (
          <div>
            <span className='font-medium text-gray-600'>Invoice:</span>
            <p className='text-gray-800'>{grn.invoice_number}</p>
          </div>
        )}
        {grn.waybill_number && (
          <div>
            <span className='font-medium text-gray-600'>Waybill:</span>
            <p className='text-gray-800'>{grn.waybill_number}</p>
          </div>
        )}
        {grn.accepted_datetime && (
          <div className='md:col-span-2'>
            <span className='font-medium text-gray-600'>Accepted by:</span>
            <p className='text-gray-800'>
              {grn.accepted_by_name} on {formatDate(grn.accepted_datetime)}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ExpandedRow;