import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  calculateCostSavings,
  formatCurrency,
  formatPercentage,
  getVendorEvaluationStatus,
  getVendorStatusStyling,
  getSavingsIndicator
} from "../../utils/costCalculations";
import {
  extractPRReference,
  extractProcurementOfficer,
  extractVendor,
  extractProcurementTimeline,
  extractRelatedPRReference,
  extractRelatedRFQReference,
  extractRelatedPOReference,
  extractGRNReference,
  getFieldValue,
  getNestedValue
} from "../../utils/dataExtraction";

interface ExpandedRowProps {
  item: any; // Will be properly typed based on ProcurementTrackerResults
  vendorEvaluations?: any[];
}

const ExpandedRow = ({ item, vendorEvaluations = [] }: ExpandedRowProps) => {
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
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>Complete Procurement Journey</h3>

          {/* Procurement Timeline */}
          <ProcurementTimelineComponent item={item} />
          
          <h4 className='text-md font-semibold text-gray-700 mt-6 mb-4'>Stage Details</h4>
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
                <p><span className='font-medium'>Reference:</span> {extractPRReference(item)}</p>
                <p><span className='font-medium'>Date:</span> {formatDate(getNestedValue(item, 'purchase_request.request_date') || item.request_date)}</p>
                <p><span className='font-medium'>Department:</span> {getFieldValue(item.deparment) || getFieldValue(item.department) || getFieldValue(item.office, 'N/A')}</p>
                <p><span className='font-medium'>Required Date:</span> {formatDate(getNestedValue(item, 'purchase_request.required_date') || item.required_date)}</p>
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
                  <p><span className='font-medium'>Reference:</span> {getNestedValue(item, 'solicitation.solicitaion_ref') || getNestedValue(item, 'solicitation.reference', 'N/A')}</p>
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
                  <p><span className='font-medium'>PO Reference:</span> {getNestedValue(item, 'purchase_order.po_reference') || getNestedValue(item, 'purchase_order.reference', 'N/A')}</p>
                  <p><span className='font-medium'>Vendor:</span> {extractVendor(item)}</p>
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

          {/* Cost Analysis */}
          <CostAnalysisCard item={item} />

          {/* Vendor Evaluation */}
          <VendorEvaluationCard item={item} vendorEvaluations={vendorEvaluations} />

          {/* Item Details */}
          <Card className='p-4 bg-blue-50'>
            <h4 className='font-semibold text-gray-800 mb-3'>Item Details</h4>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm'>
              <div>
                <span className='font-medium text-gray-600'>Item Name:</span>
                <p className='text-gray-800'>{getFieldValue(item.item_name) || getFieldValue(item.name) || getFieldValue(item.description, 'N/A')}</p>
              </div>
              <div>
                <span className='font-medium text-gray-600'>Category:</span>
                <p className='text-gray-800'>{getFieldValue(item.item_category) || getFieldValue(item.category, 'N/A')}</p>
              </div>
              <div>
                <span className='font-medium text-gray-600'>Quantity:</span>
                <p className='text-gray-800'>{Number(getFieldValue(item.quantity) || getFieldValue(item.qty) || 0).toLocaleString()}</p>
              </div>
              {item.purchase_order?.uom && (
                <div>
                  <span className='font-medium text-gray-600'>Unit:</span>
                  <p className='text-gray-800'>{item.purchase_order.uom}</p>
                </div>
              )}
              <div>
                <span className='font-medium text-gray-600'>Procurement Officer:</span>
                <p className='text-gray-800'>{extractProcurementOfficer(item)}</p>
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

const CostAnalysisCard = ({ item }: { item: any }) => {
  const { prValue, poValue, actualPayment, savingsAmount, savingsPercentage, paymentSavings, paymentSavingsPercentage } = calculateCostSavings(item);

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  if (prValue === 0 && poValue === 0) {
    return (
      <Card className='p-4 border-l-4 border-l-gray-300'>
        <h4 className='font-semibold text-gray-500 mb-2'>Cost Analysis</h4>
        <p className='text-sm text-gray-500'>Cost information not available</p>
      </Card>
    );
  }

  const prSavingsIndicator = getSavingsIndicator(savingsPercentage);
  const paymentSavingsIndicator = getSavingsIndicator(paymentSavingsPercentage);

  return (
    <Card className='p-4 border-l-4 border-l-indigo-500'>
      <h4 className='font-semibold text-indigo-700 mb-3'>Cost Analysis & Savings</h4>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Original PR Value */}
        <div className='bg-blue-50 p-3 rounded'>
          <div className='text-xs text-gray-600 mb-1'>Purchase Request Value</div>
          <div className='text-lg font-semibold text-blue-700'>
            {prValue > 0 ? formatCurrency(prValue) : 'N/A'}
          </div>
        </div>

        {/* PO Value */}
        <div className='bg-orange-50 p-3 rounded'>
          <div className='text-xs text-gray-600 mb-1'>Purchase Order Value</div>
          <div className='text-lg font-semibold text-orange-700'>
            {poValue > 0 ? formatCurrency(poValue) : 'N/A'}
          </div>
        </div>

        {/* Actual Payment */}
        <div className='bg-green-50 p-3 rounded'>
          <div className='text-xs text-gray-600 mb-1'>
            {actualPayment !== poValue ? 'Actual Payment' : 'Expected Payment'}
          </div>
          <div className='text-lg font-semibold text-green-700'>
            {formatCurrency(actualPayment)}
          </div>
          {item.payment_date && (
            <div className='text-xs text-gray-500 mt-1'>
              Paid: {formatDate(item.payment_date)}
            </div>
          )}
        </div>

        {/* PR vs PO Savings */}
        {prValue > 0 && (
          <div className={`p-3 rounded ${prSavingsIndicator.className}`}>
            <div className='text-xs mb-1'>Procurement Savings</div>
            <div className='flex items-center gap-1'>
              <span className='text-lg font-semibold'>
                {prSavingsIndicator.icon} {formatCurrency(Math.abs(savingsAmount))}
              </span>
            </div>
            <div className='text-xs opacity-75'>
              {formatPercentage(savingsPercentage)} vs PR
            </div>
          </div>
        )}

        {/* PO vs Payment Savings */}
        {poValue > 0 && actualPayment !== poValue && (
          <div className={`p-3 rounded ${paymentSavingsIndicator.className}`}>
            <div className='text-xs mb-1'>Payment Savings</div>
            <div className='flex items-center gap-1'>
              <span className='text-lg font-semibold'>
                {paymentSavingsIndicator.icon} {formatCurrency(Math.abs(paymentSavings))}
              </span>
            </div>
            <div className='text-xs opacity-75'>
              {formatPercentage(paymentSavingsPercentage)} vs PO
            </div>
          </div>
        )}

        {/* Total Savings Summary */}
        {prValue > 0 && (
          <div className='bg-purple-50 p-3 rounded md:col-span-1'>
            <div className='text-xs text-gray-600 mb-1'>Total AHNI Savings</div>
            <div className='text-lg font-semibold text-purple-700'>
              {formatCurrency(prValue - actualPayment)}
            </div>
            <div className='text-xs text-purple-600'>
              {formatPercentage(((prValue - actualPayment) / prValue) * 100)} total
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

const VendorEvaluationCard = ({ item, vendorEvaluations = [] }: { item: any; vendorEvaluations?: any[] }) => {
  const rating = item.vendor_performance_score || item.purchase_order?.service_quality_rating;
  const status = getVendorEvaluationStatus(item, vendorEvaluations);
  const styling = getVendorStatusStyling(status);
  const vendorName = extractVendor(item);

  return (
    <Card className='p-4 border-l-4 border-l-amber-500'>
      <h4 className='font-semibold text-amber-700 mb-3'>Vendor Evaluation Status</h4>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Vendor Info */}
        <div>
          <div className='text-sm font-medium text-gray-600 mb-2'>Vendor</div>
          <div className='text-lg font-semibold text-gray-800'>{vendorName}</div>
        </div>

        {/* Performance Rating */}
        <div>
          <div className='text-sm font-medium text-gray-600 mb-2'>Performance Rating</div>
          {rating ? (
            <div className='flex items-center gap-2'>
              <span className='text-lg font-semibold text-gray-800'>{rating}/5</span>
              <div className='flex'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-sm ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className='text-gray-500'>Not rated</div>
          )}
        </div>

        {/* Evaluation Status */}
        <div>
          <div className='text-sm font-medium text-gray-600 mb-2'>Evaluation Status</div>
          <Badge className={styling.className} variant="outline">
            {styling.label}
          </Badge>
          <div className='text-xs text-gray-500 mt-1'>
            {status === 'RETAIN' && 'Approved for future contracts'}
            {status === 'ON_PROBATION' && 'Under review, limited contracts'}
            {status === 'BARRED' && 'Not eligible for new contracts'}
            {status === 'PENDING' && 'Evaluation in progress'}
          </div>
        </div>

        {/* Performance Breakdown */}
        {rating && (
          <div className='md:col-span-3 mt-4'>
            <div className='text-sm font-medium text-gray-600 mb-2'>Performance Analysis</div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
              <div className='flex justify-between'>
                <span>Quality:</span>
                <span className='font-medium'>{rating >= 4 ? 'Excellent' : rating >= 3 ? 'Good' : 'Needs Improvement'}</span>
              </div>
              <div className='flex justify-between'>
                <span>Delivery:</span>
                <span className='font-medium'>
                  {item.purchase_order?.date_of_grn || item.purchase_order?.date_of_service_delivery ? 'On Time' : 'Pending'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span>Overall:</span>
                <span className={`font-medium ${rating >= 4 ? 'text-green-600' : rating >= 3 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {rating >= 4 ? 'Excellent' : rating >= 3 ? 'Satisfactory' : 'Poor'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

const ProcurementTimelineComponent = ({ item }: { item: any }) => {
  const timeline = extractProcurementTimeline(item);

  if (timeline.length === 0) {
    return (
      <Card className='p-4 bg-gray-50'>
        <p className='text-gray-500 text-sm'>No procurement timeline data available</p>
      </Card>
    );
  }

  return (
    <Card className='p-4 bg-gradient-to-r from-blue-50 to-indigo-50'>
      <h5 className='font-semibold text-gray-800 mb-4'>Procurement Journey Timeline</h5>
      <div className='relative'>
        {/* Timeline line */}
        <div className='absolute left-6 top-0 bottom-0 w-0.5 bg-blue-200'></div>

        {timeline.map((stage, index) => (
          <div key={index} className='relative flex items-start mb-6 last:mb-0'>
            {/* Timeline dot */}
            <div className={`
              relative z-10 w-3 h-3 rounded-full mr-4 mt-1.5
              ${stage.completed ? 'bg-green-500' : 'bg-blue-500'}
            `}>
              {stage.completed && (
                <div className='absolute inset-0 bg-green-500 rounded-full animate-pulse'></div>
              )}
            </div>

            {/* Timeline content */}
            <div className='flex-1 min-w-0'>
              <div className='flex items-center justify-between'>
                <h6 className='text-sm font-semibold text-gray-800'>{stage.stage}</h6>
                <span className={`
                  px-2 py-1 text-xs rounded-full
                  ${stage.completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                `}>
                  {stage.status}
                </span>
              </div>

              <div className='mt-1 flex items-center gap-4 text-sm text-gray-600'>
                <span className='font-medium'>{stage.reference}</span>
                {stage.date !== 'N/A' && (
                  <span>{stage.date}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cross-references */}
      <div className='mt-6 pt-4 border-t border-gray-200'>
        <h6 className='font-semibold text-gray-700 mb-2'>Related References</h6>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 text-sm'>
          <div>
            <span className='text-gray-500'>PR:</span>
            <span className='ml-1 font-medium'>{extractRelatedPRReference(item)}</span>
          </div>
          <div>
            <span className='text-gray-500'>RFQ:</span>
            <span className='ml-1 font-medium'>{extractRelatedRFQReference(item)}</span>
          </div>
          <div>
            <span className='text-gray-500'>PO:</span>
            <span className='ml-1 font-medium'>{extractRelatedPOReference(item)}</span>
          </div>
          <div>
            <span className='text-gray-500'>GRN:</span>
            <span className='ml-1 font-medium'>{extractGRNReference(item)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ExpandedRow;