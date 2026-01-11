"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClipboardCheck,
  Calendar,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Eye,
  FileText,
  Star,
  TrendingUp,
  ArrowRight,
  MessageSquare,
  RotateCcw
} from "lucide-react";
import {
  useVendorGRNs,
  POGRNUtils
} from "@/features/vendor-portal/controllers/purchaseOrderController";
import { GRNStatus } from "@/features/vendor-portal/types/purchase-orders";
import { LoadingSpinner } from "@/components/Loading";

export default function VendorGRNPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<GRNStatus | "all">("all");
  const [activeTab, setActiveTab] = useState("all");

  const { data: allGRNs, isLoading, error } = useVendorGRNs();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading goods received notes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load goods received notes. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  // Ensure allGRNs is an array
  const grnsArray = Array.isArray(allGRNs) ? allGRNs : (allGRNs?.results || []);
  const filteredGRNs = grnsArray.filter((grn) => {
    const matchesSearch = grn.grn_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grn.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grn.delivery_location.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || grn.status === statusFilter;
    const matchesTab = activeTab === "all" ||
                      (activeTab === "pending" && ['PENDING', 'PARTIALLY_RECEIVED'].includes(grn.status)) ||
                      (activeTab === "received" && ['RECEIVED', 'INSPECTED', 'ACCEPTED'].includes(grn.status)) ||
                      (activeTab === "issues" && ['REJECTED', 'RETURNED'].includes(grn.status));
    return matchesSearch && matchesStatus && matchesTab;
  }) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: GRNStatus) => {
    switch (status) {
      case 'PENDING':
        return <AlertCircle className="h-4 w-4" />;
      case 'PARTIALLY_RECEIVED':
        return <Package className="h-4 w-4" />;
      case 'RECEIVED':
        return <CheckCircle className="h-4 w-4" />;
      case 'INSPECTED':
        return <ClipboardCheck className="h-4 w-4" />;
      case 'ACCEPTED':
        return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />;
      case 'RETURNED':
        return <RotateCcw className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getQualityRatingStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">({rating}/5)</span>
      </div>
    );
  };

  const pendingGRNs = grnsArray.filter(grn => ['PENDING', 'PARTIALLY_RECEIVED'].includes(grn.status));
  const receivedGRNs = grnsArray.filter(grn => ['RECEIVED', 'INSPECTED', 'ACCEPTED'].includes(grn.status));
  const issuesGRNs = grnsArray.filter(grn => ['REJECTED', 'RETURNED'].includes(grn.status));

  // Calculate summary stats
  const totalValue = grnsArray.reduce((sum, grn) => sum + grn.value_received, 0);
  const acceptedValue = grnsArray.reduce((sum, grn) => sum + grn.value_accepted, 0);
  const averageRating = grnsArray.length ?
    grnsArray.reduce((sum, grn) => sum + (grn.quality_rating || 0), 0) / grnsArray.filter(grn => grn.quality_rating).length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Goods Received Notes</h1>
        <p className="text-gray-600 mt-1">
          Track the receipt and inspection of your delivered items
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total GRNs</p>
                <p className="text-2xl font-bold text-blue-600">{allGRNs?.length || 0}</p>
              </div>
              <ClipboardCheck className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Value Received</p>
                <p className="text-2xl font-bold text-green-600">
                  {POGRNUtils.formatCurrency(totalValue)}
                </p>
              </div>
              <Package className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Acceptance Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {totalValue > 0 ? Math.round((acceptedValue / totalValue) * 100) : 0}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Quality Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-orange-600">
                    {averageRating ? averageRating.toFixed(1) : 'N/A'}
                  </p>
                  {averageRating > 0 && <Star className="h-5 w-5 text-yellow-400 fill-current" />}
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issues Alert */}
      {issuesGRNs.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>{issuesGRNs.length} GRN{issuesGRNs.length !== 1 ? 's' : ''} require{issuesGRNs.length === 1 ? 's' : ''} attention.</strong>
            Some items were rejected or returned. Please review and take necessary action.
          </AlertDescription>
        </Alert>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by GRN number, PO number, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as GRNStatus | "all")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="PARTIALLY_RECEIVED">Partially Received</option>
                <option value="RECEIVED">Received</option>
                <option value="INSPECTED">Inspected</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
                <option value="RETURNED">Returned</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GRN Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All GRNs ({allGRNs?.length || 0})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingGRNs.length})</TabsTrigger>
          <TabsTrigger value="received">Received ({receivedGRNs.length})</TabsTrigger>
          <TabsTrigger value="issues">Issues ({issuesGRNs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredGRNs.length > 0 ? (
            filteredGRNs.map((grn) => (
              <Card key={grn.id} className={`hover:shadow-md transition-shadow ${
                ['REJECTED', 'RETURNED'].includes(grn.status) ? 'border-l-4 border-l-orange-500' : ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(grn.status)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                GRN #{grn.grn_number}
                              </h3>
                              <p className="text-sm text-gray-600">PO #{grn.po_number}</p>
                            </div>
                            <Badge
                              variant={POGRNUtils.getGRNStatusBadgeVariant(grn.status)}
                              className="ml-2 flex-shrink-0"
                            >
                              {POGRNUtils.getGRNStatusDisplayName(grn.status)}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Received: {formatDate(grn.received_date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              {grn.received_items.length} item{grn.received_items.length !== 1 ? 's' : ''}
                            </span>
                            <span className="flex items-center gap-1 font-medium text-green-600">
                              Value: {POGRNUtils.formatCurrency(grn.value_received)}
                            </span>
                          </div>

                          <div className="mb-3">
                            <p className="text-sm text-gray-600">
                              <strong>Location:</strong> {grn.delivery_location.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Received by:</strong> {grn.received_by.name} ({grn.received_by.department})
                            </p>
                          </div>

                          {/* Acceptance Rate Progress */}
                          <div className="mb-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-600">Acceptance Rate</span>
                              <span className="text-sm font-medium">
                                {POGRNUtils.calculateGRNAcceptanceRate(grn)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${POGRNUtils.calculateGRNAcceptanceRate(grn)}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Quality Rating */}
                          {grn.quality_rating && (
                            <div className="mb-3">
                              <span className="text-sm text-gray-600 mr-2">Quality Rating:</span>
                              {getQualityRatingStars(grn.quality_rating)}
                            </div>
                          )}

                          {/* Inspection Notes */}
                          {grn.inspection_notes && (
                            <div className="bg-blue-50 rounded-lg p-3 mb-3">
                              <p className="text-sm text-blue-800">
                                <strong>Inspection Notes:</strong> {grn.inspection_notes}
                              </p>
                            </div>
                          )}

                          {/* Issues Alert */}
                          {['REJECTED', 'RETURNED'].includes(grn.status) && (
                            <div className="bg-orange-50 rounded-lg p-3 mb-3">
                              <div className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-orange-800">
                                    {grn.status === 'REJECTED' ? 'Items Rejected' : 'Items Returned'}
                                  </p>
                                  {grn.return_reason && (
                                    <p className="text-sm text-orange-700 mt-1">
                                      Reason: {grn.return_reason}
                                    </p>
                                  )}
                                  <div className="flex gap-2 mt-2">
                                    {grn.return_required && (
                                      <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                                        Return Required
                                      </Badge>
                                    )}
                                    {grn.replacement_required && (
                                      <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                                        Replacement Required
                                      </Badge>
                                    )}
                                    {grn.credit_note_required && (
                                      <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                                        Credit Note Required
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Vendor Notification Status */}
                          {!grn.vendor_notified && (
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <MessageSquare className="h-3 w-3" />
                              <span>Notification pending</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        onClick={() => router.push(`/vendor-portal/grn/${grn.id}`)}
                        size="sm"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>

                      {['REJECTED', 'RETURNED'].includes(grn.status) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/vendor-portal/grn/${grn.id}?action=respond`)}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Respond
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <ClipboardCheck className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No GRNs Found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search criteria or filters"
                    : "No goods received notes available yet"}
                </p>
                {(searchTerm || statusFilter !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}