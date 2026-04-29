"use client";

import { useParams } from "next/navigation";
import { useGetVendorActivity } from "@/features/procurement/controllers/vendorsController";
import { LoadingSpinner } from "@/components/Loading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  ClipboardList,
  DollarSign,
  ShoppingCart,
  Star,
  Upload,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

const VendorActivity = () => {
  const { id } = useParams();
  const { data: activityData, isLoading, error } = useGetVendorActivity(id as string);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-red-500">Error loading vendor activity: {error.message}</p>
      </Card>
    );
  }

  const activity = activityData?.data;

  if (!activity) {
    return (
      <Card className="p-6">
        <p className="text-gray-500">No activity data available</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Activity Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          icon={<ClipboardList className="h-5 w-5" />}
          label="RFQs Received"
          value={activity.summary.rfqs_received}
          color="blue"
        />
        <SummaryCard
          icon={<DollarSign className="h-5 w-5" />}
          label="Bids Submitted"
          value={activity.summary.bids_submitted}
          subValue={`${activity.summary.win_rate.toFixed(1)}% win rate`}
          color="purple"
        />
        <SummaryCard
          icon={<ShoppingCart className="h-5 w-5" />}
          label="Purchase Orders"
          value={activity.summary.purchase_orders}
          subValue={`₦${activity.summary.total_business_value.toLocaleString()}`}
          color="green"
        />
        <SummaryCard
          icon={<Star className="h-5 w-5" />}
          label="Evaluations"
          value={activity.summary.evaluations_count}
          subValue={activity.summary.average_evaluation_score > 0 ? `Avg: ${activity.summary.average_evaluation_score.toFixed(1)}/25` : undefined}
          color="orange"
        />
      </div>

      {/* EOI & Registration Section */}
      <EOIRegistrationSection data={activity.eoi_registration} />

      {/* RFQs Received Section */}
      <RFQsReceivedSection data={activity.rfqs_received} />

      {/* Bids Submitted Section */}
      <BidsSubmittedSection data={activity.bids_submitted} />

      {/* Purchase Orders Section */}
      <PurchaseOrdersSection data={activity.purchase_orders} />

      {/* Evaluations Section */}
      <EvaluationsSection data={activity.evaluations} />

      {/* Documents Section */}
      <DocumentsSection data={activity.documents} />
    </div>
  );
};

export default VendorActivity;

// Summary Card Component
interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  subValue?: string;
  color: "blue" | "purple" | "green" | "orange";
}

const SummaryCard = ({ icon, label, value, subValue, color }: SummaryCardProps) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    green: "bg-green-50 text-green-600 border-green-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
  };

  return (
    <Card className={cn("p-4 border-2", colorClasses[color])}>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex-1">
          <p className="text-sm font-medium opacity-80">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subValue && <p className="text-xs mt-1 opacity-70">{subValue}</p>}
        </div>
      </div>
    </Card>
  );
};

// EOI & Registration Section
const EOIRegistrationSection = ({ data }: any) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">EOI & Registration</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Registration Date</p>
            <p className="font-medium">{new Date(data.registration_date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Registration Method</p>
            <p className="font-medium">{data.registration_method}</p>
          </div>
        </div>

        {data.eoi_details && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">EOI Details</p>
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <p><span className="font-medium">EOI Number:</span> {data.eoi_details.eoi_number}</p>
              <p><span className="font-medium">Name:</span> {data.eoi_details.name}</p>
              <p><span className="font-medium">Type:</span> {data.eoi_details.type}</p>
              <p><span className="font-medium">Status:</span> <Badge>{data.eoi_details.status}</Badge></p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Submitted Categories ({data.submitted_categories.length})
            </p>
            <div className="space-y-1">
              {data.submitted_categories.map((cat: any) => (
                <Badge key={cat.id} variant="outline" className="mr-2">
                  {cat.name}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Approved Categories ({data.approved_categories.length})
            </p>
            <div className="space-y-1">
              {data.approved_categories.map((cat: any) => (
                <Badge key={cat.id} className="mr-2 bg-green-100 text-green-700">
                  {cat.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// RFQs Received Section
const RFQsReceivedSection = ({ data }: any) => {
  if (data.total_rfqs === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">RFQs Received</h3>
        </div>
        <p className="text-gray-500 text-center py-4">No RFQs received yet</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">RFQs Received ({data.total_rfqs})</h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr className="text-left">
              <th className="pb-2 font-medium">RFQ Number</th>
              <th className="pb-2 font-medium">Name</th>
              <th className="pb-2 font-medium">Type</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Response</th>
              <th className="pb-2 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.rfqs.map((rfq: any) => (
              <tr key={rfq.id} className="border-b last:border-0">
                <td className="py-3 font-medium">{rfq.rfq_number}</td>
                <td className="py-3">{rfq.name}</td>
                <td className="py-3">
                  <Badge variant="outline">{rfq.type}</Badge>
                </td>
                <td className="py-3">
                  <Badge className={cn(
                    rfq.status === 'OPEN' && 'bg-green-100 text-green-700',
                    rfq.status === 'CLOSED' && 'bg-gray-100 text-gray-700'
                  )}>
                    {rfq.status}
                  </Badge>
                </td>
                <td className="py-3">
                  {rfq.has_responded ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                </td>
                <td className="py-3 text-gray-600">
                  {new Date(rfq.created_date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// Bids Submitted Section
const BidsSubmittedSection = ({ data }: any) => {
  if (data.total_bids === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Bids Submitted</h3>
        </div>
        <p className="text-gray-500 text-center py-4">No bids submitted yet</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Bids Submitted ({data.total_bids})</h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr className="text-left">
              <th className="pb-2 font-medium">Bid Number</th>
              <th className="pb-2 font-medium">RFQ</th>
              <th className="pb-2 font-medium">Amount</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Evaluation</th>
              <th className="pb-2 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.bids.map((bid: any) => (
              <tr key={bid.id} className="border-b last:border-0">
                <td className="py-3 font-medium">{bid.bid_number}</td>
                <td className="py-3">
                  {bid.rfq ? (
                    <div>
                      <p className="font-medium">{bid.rfq.rfq_number}</p>
                      <p className="text-xs text-gray-500">{bid.rfq.name}</p>
                    </div>
                  ) : '-'}
                </td>
                <td className="py-3 font-medium">
                  {bid.currency} {bid.total_amount.toLocaleString()}
                </td>
                <td className="py-3">
                  <Badge className={cn(
                    bid.status === 'PASSED' && 'bg-green-100 text-green-700',
                    bid.status === 'FAILED' && 'bg-red-100 text-red-700',
                    bid.status === 'PENDING' && 'bg-yellow-100 text-yellow-700'
                  )}>
                    {bid.status}
                  </Badge>
                </td>
                <td className="py-3">
                  <Badge variant="outline">{bid.evaluation_status}</Badge>
                </td>
                <td className="py-3 text-gray-600">
                  {new Date(bid.submitted_date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// Purchase Orders Section
const PurchaseOrdersSection = ({ data }: any) => {
  if (data.total_pos === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold">Purchase Orders</h3>
        </div>
        <p className="text-gray-500 text-center py-4">No purchase orders yet</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold">
            Purchase Orders ({data.total_pos})
          </h3>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Business Value</p>
          <p className="text-lg font-bold text-green-600">
            ₦{data.total_business_value.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr className="text-left">
              <th className="pb-2 font-medium">PO Number</th>
              <th className="pb-2 font-medium">PR Number</th>
              <th className="pb-2 font-medium">Amount</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Delivery</th>
              <th className="pb-2 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.purchase_orders.map((po: any) => (
              <tr key={po.id} className="border-b last:border-0">
                <td className="py-3 font-medium">{po.po_number}</td>
                <td className="py-3 text-gray-600">{po.pr_number || '-'}</td>
                <td className="py-3 font-medium">₦{po.total_amount.toLocaleString()}</td>
                <td className="py-3">
                  <Badge className={cn(
                    po.status === 'APPROVED' && 'bg-blue-100 text-blue-700',
                    po.status === 'DELIVERED' && 'bg-green-100 text-green-700',
                    po.status === 'CANCELLED' && 'bg-red-100 text-red-700'
                  )}>
                    {po.status}
                  </Badge>
                </td>
                <td className="py-3">
                  <Badge variant="outline">{po.delivery_status}</Badge>
                </td>
                <td className="py-3 text-gray-600">
                  {new Date(po.order_date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// Evaluations Section
const EvaluationsSection = ({ data }: any) => {
  if (data.total_evaluations === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold">Performance Evaluations</h3>
        </div>
        <p className="text-gray-500 text-center py-4">No evaluations yet</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Star className="h-5 w-5 text-orange-600" />
        <h3 className="text-lg font-semibold">
          Performance Evaluations ({data.total_evaluations})
        </h3>
      </div>

      <div className="space-y-4">
        {data.evaluations.map((evaluation: any) => (
          <div key={evaluation.id} className="border rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <div>
                <p className="text-sm text-gray-600">Service</p>
                <p className="font-medium">{evaluation.service}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium">{evaluation.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Score</p>
                <p className="font-bold text-lg">{evaluation.total_score}/25</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Recommendation</p>
                <Badge className={cn(
                  evaluation.supervisor_recommendation === 'RETAIN' && 'bg-green-100 text-green-700',
                  evaluation.supervisor_recommendation === 'BARRED' && 'bg-red-100 text-red-700'
                )}>
                  {evaluation.supervisor_recommendation}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Evaluation Date</p>
                <p>{new Date(evaluation.evaluation_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Review Period</p>
                <p>
                  {new Date(evaluation.reviewed_period_start).toLocaleDateString()} -{" "}
                  {new Date(evaluation.reviewed_period_end).toLocaleDateString()}
                </p>
              </div>
            </div>

            {evaluation.comments && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm text-gray-600">Comments</p>
                <p className="text-sm mt-1">{evaluation.comments}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

// Documents Section
const DocumentsSection = ({ data }: any) => {
  if (data.total_documents === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Documents</h3>
        </div>
        <p className="text-gray-500 text-center py-4">No documents uploaded yet</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Upload className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold">Documents ({data.total_documents})</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.documents.map((doc: any) => (
          <div key={doc.id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="font-medium text-sm">{doc.document_type}</p>
              <Badge className={cn(
                "text-xs",
                doc.status === 'Valid' && 'bg-green-100 text-green-700',
                doc.status === 'Expired' && 'bg-red-100 text-red-700',
                doc.status === 'Expiring Soon' && 'bg-yellow-100 text-yellow-700'
              )}>
                {doc.status}
              </Badge>
            </div>
            {doc.expiry_date && (
              <p className="text-xs text-gray-600 mb-2">
                Expires: {new Date(doc.expiry_date).toLocaleDateString()}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Uploaded: {new Date(doc.uploaded_date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};
