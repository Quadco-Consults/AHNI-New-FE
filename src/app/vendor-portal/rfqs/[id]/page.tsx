"use client";

export const dynamic = "force-dynamic";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Alert, AlertDescription } from "components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import {

Calendar,
  Clock,
  FileText,
  Building2,
  AlertCircle,
  CheckCircle,
  Download,
  Upload,
  DollarSign,
  Users,
  ArrowLeft
} from "lucide-react";
import { useVendorRFQDetails } from "@/features/vendor-portal/controllers/vendorDashboardController";
import { LoadingSpinner } from "components/Loading";

export default function VendorRFQDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const rfqId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [activeTab, setActiveTab] = useState("overview");

  const { data: rfqDetails, isLoading, error } = useVendorRFQDetails(rfqId as string);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading RFQ details...</span>
      </div>
    );
  }

  if (error || !rfqDetails) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load RFQ details. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysRemaining = () => {
    const now = new Date();
    const closing = new Date(rfqDetails.closing_date);
    const diffTime = closing.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'default';
      case 'CLOSING_SOON':
        return 'secondary';
      case 'CLOSED':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getEligibilityBadgeVariant = (status: string) => {
    switch (status) {
      case 'ELIGIBLE':
        return 'default';
      case 'NOT_ELIGIBLE':
        return 'destructive';
      case 'PENDING_REVIEW':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const daysRemaining = getDaysRemaining();
  const isClosingSoon = daysRemaining <= 7 && daysRemaining > 0;
  const isClosed = daysRemaining <= 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/vendor-portal/rfqs')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to RFQs
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{rfqDetails.title}</h1>
          <p className="text-gray-600 mt-1">RFQ #{rfqDetails.reference_number}</p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <Badge variant={getStatusBadgeVariant(rfqDetails.status)}>
                  {rfqDetails.status}
                </Badge>
              </div>
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Eligibility</p>
                <Badge variant={getEligibilityBadgeVariant(rfqDetails.eligibility_status)}>
                  {rfqDetails.eligibility_status === 'ELIGIBLE' ? 'Eligible to Bid' :
                   rfqDetails.eligibility_status === 'NOT_ELIGIBLE' ? 'Not Eligible' : 'Under Review'}
                </Badge>
              </div>
              <CheckCircle className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Closing Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {isClosed ? 'Closed' : isClosingSoon ? `${daysRemaining} days left` : formatDate(rfqDetails.closing_date)}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Closing Soon Alert */}
      {isClosingSoon && !isClosed && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Closing Soon:</strong> This RFQ closes in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}.
            Submit your bid before {formatDate(rfqDetails.closing_date)}.
          </AlertDescription>
        </Alert>
      )}

      {/* Closed Alert */}
      {isClosed && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This RFQ is closed. No further submissions are accepted.
          </AlertDescription>
        </Alert>
      )}

      {/* Not Eligible Alert */}
      {rfqDetails.eligibility_status === 'NOT_ELIGIBLE' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You are not eligible to bid on this RFQ. Please contact support if you believe this is an error.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="submission">
            {rfqDetails.submission_status === 'SUBMITTED' ? 'View Submission' : 'Submit Bid'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>RFQ Overview</CardTitle>
              <CardDescription>
                Complete information about this procurement opportunity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700">{rfqDetails.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Key Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Opening Date:</span>
                      <span className="font-medium">{formatDate(rfqDetails.opening_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Closing Date:</span>
                      <span className="font-medium">{formatDate(rfqDetails.closing_date)}</span>
                    </div>
                    {rfqDetails.estimated_value && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estimated Value:</span>
                        <span className="font-medium">{formatCurrency(rfqDetails.estimated_value)}</span>
                      </div>
                    )}
                    {rfqDetails.contract_duration && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{rfqDetails.contract_duration}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {rfqDetails.categories?.map((category: any, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {typeof category === 'string' ? category : category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {rfqDetails.procurement_method && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Procurement Method</h4>
                  <p className="text-gray-700">{rfqDetails.procurement_method}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Technical Requirements</CardTitle>
              <CardDescription>
                Detailed specifications and requirements for this RFQ
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rfqDetails.technical_requirements ? (
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: rfqDetails.technical_requirements }} />
                </div>
              ) : (
                <p className="text-gray-500">No technical requirements specified.</p>
              )}
            </CardContent>
          </Card>

          {rfqDetails.evaluation_criteria && (
            <Card>
              <CardHeader>
                <CardTitle>Evaluation Criteria</CardTitle>
                <CardDescription>
                  How submissions will be evaluated
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: rfqDetails.evaluation_criteria }} />
                </div>
              </CardContent>
            </Card>
          )}

          {rfqDetails.terms_conditions && (
            <Card>
              <CardHeader>
                <CardTitle>Terms & Conditions</CardTitle>
                <CardDescription>
                  Legal terms and conditions for this procurement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: rfqDetails.terms_conditions }} />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>RFQ Documents</CardTitle>
              <CardDescription>
                Download and review all relevant documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rfqDetails.documents && rfqDetails.documents.length > 0 ? (
                <div className="space-y-3">
                  {rfqDetails.documents.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-500">{doc.type} • {doc.size}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(doc.url, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No documents available for this RFQ.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submission" className="space-y-6">
          {rfqDetails.eligibility_status === 'ELIGIBLE' && !isClosed ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {rfqDetails.submission_status === 'SUBMITTED' ? 'Your Submission' : 'Submit Your Bid'}
                </CardTitle>
                <CardDescription>
                  {rfqDetails.submission_status === 'SUBMITTED'
                    ? 'Review your submitted bid details'
                    : 'Complete and submit your bid for this RFQ'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {rfqDetails.submission_status === 'SUBMITTED'
                      ? 'Submission Complete'
                      : 'Ready to Submit?'
                    }
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {rfqDetails.submission_status === 'SUBMITTED'
                      ? 'Your bid has been successfully submitted. You can view or modify it below.'
                      : 'Use our guided submission form to prepare and submit your bid.'
                    }
                  </p>
                  <Button
                    size="lg"
                    onClick={() => router.push(`/vendor-portal/rfqs/${rfqId}/submit`)}
                  >
                    {rfqDetails.submission_status === 'SUBMITTED' ? 'View/Edit Submission' : 'Start Bid Submission'}
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <AlertCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Submission Not Available</h3>
                  <p className="text-gray-500">
                    {rfqDetails.eligibility_status !== 'ELIGIBLE'
                      ? 'You are not eligible to submit a bid for this RFQ.'
                      : 'This RFQ is closed and no longer accepting submissions.'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}