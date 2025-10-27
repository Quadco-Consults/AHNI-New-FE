"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Registration from "@/features/procurement/components/vendor-management/vendor-registration/Registration";
import { useGetPublicOpportunity } from "@/features/procurement/controllers/solicitationController";
import { LoadingSpinner } from "components/Loading";
import Card from "components/Card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Alert, AlertDescription } from "components/ui/alert";
import {
  Building2,
  FileText,
  Clock,
  CheckCircle,
  ArrowRight,
  Info,
  UserPlus,
  Briefcase,
  Calendar
} from "lucide-react";

export default function PublicRFQPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [selectedPath, setSelectedPath] = useState<'new_vendor' | 'existing_vendor' | null>(null);
  const { data, isLoading, error } = useGetPublicOpportunity(id as string);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">RFQ Not Found</h2>
          <p className="text-gray-600">The Request for Quotation you're looking for could not be found or may have expired.</p>
        </Card>
      </div>
    );
  }

  const rfqData = data.data;

  // Check if RFQ is still open for submissions
  const isOpen = rfqData.status === "OPEN" && new Date(rfqData.closing_date) > new Date();

  // Common RFQ Details Component - Always shown
  const RFQDetailsSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-white p-3 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{rfqData.title}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{rfqData.background}</p>

          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {!isOpen && (
              <Badge variant="destructive" className="text-sm px-3 py-1">
                <Clock className="h-4 w-4 mr-1" />
                Closed
              </Badge>
            )}
            {isOpen && (
              <Badge variant="default" className="text-sm px-3 py-1">
                <Clock className="h-4 w-4 mr-1" />
                {getDaysRemaining()} days remaining
              </Badge>
            )}
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <FileText className="h-4 w-4 mr-1" />
              {rfqData.request_type || 'Request for Quotation'}
            </Badge>
            {rfqData.rfq_id && (
              <Badge variant="outline" className="text-sm px-3 py-1">
                ID: {rfqData.rfq_id}
              </Badge>
            )}
          </div>
        </div>

        {/* RFQ Information */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Request Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="font-medium">Opens:</span>
              <span>{formatDate(rfqData.opening_date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-red-600" />
              <span className="font-medium">Closes:</span>
              <span className={!isOpen ? 'text-red-600' : ''}>{formatDate(rfqData.closing_date)}</span>
            </div>
            {rfqData.tender_type && (
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Tender Type:</span>
                <span>{rfqData.tender_type}</span>
              </div>
            )}
          </div>

          {/* Status Alert */}
          {!isOpen && (
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>This request is closed.</strong> Submissions are no longer being accepted.
                {rfqData.closing_date && (
                  <span> This RFQ closed on {formatDate(rfqData.closing_date)}.</span>
                )}
              </AlertDescription>
            </Alert>
          )}
        </Card>

        {/* Solicitation Items if available */}
        {rfqData.solicitation_items && rfqData.solicitation_items.length > 0 && (
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Required Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Item</th>
                    <th className="text-left p-3 font-semibold">Lot</th>
                    <th className="text-left p-3 font-semibold">Quantity</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {rfqData.solicitation_items.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">{item.item_detail?.name || 'N/A'}</td>
                      <td className="p-3">{item.lot_detail?.name || item.lot}</td>
                      <td className="p-3">{item.quantity} {item.item_detail?.uom || ''}</td>
                      <td className="p-3">{item.item_detail?.description || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysRemaining = () => {
    const now = new Date();
    const closing = new Date(rfqData.closing_date);
    const diffTime = closing.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTypeDisplay = (type: string) => {
    switch (type) {
      case 'REQUEST FOR QUOTATION':
        return 'Request for Quotation';
      case 'OPEN_TENDER':
        return 'Open Tender';
      default:
        return 'Procurement Request';
    }
  };

  // If RFQ is closed, show details with submission disabled
  if (!isOpen) {
    return (
      <>
        <RFQDetailsSection />
        <div className="bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <Card className="p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Submission Period Closed</h2>
              <p className="text-gray-600">This Request for Quotation is no longer accepting submissions.</p>
            </Card>
          </div>
        </div>
      </>
    );
  }

  // For open RFQs, show details then path selection
  if (!selectedPath) {
    return (
      <>
        <RFQDetailsSection />
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Path Selection */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Choose Your Participation Path</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* New Vendor Path */}
                <Card className="p-8 hover:shadow-lg transition-shadow border-2 hover:border-blue-200">
                  <div className="text-center">
                    <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <UserPlus className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">New Vendor Registration + Quote</h3>
                    <p className="text-gray-600 mb-6">
                      First time working with AHNI? Register as a new vendor and submit your quotation for this RFQ simultaneously.
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Complete vendor registration</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Submit quotation</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>One-step process</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => setSelectedPath('new_vendor')}
                      className="w-full"
                      size="lg"
                    >
                      Register & Submit Quote
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>

                {/* Existing Vendor Path */}
                <Card className="p-8 hover:shadow-lg transition-shadow border-2 hover:border-blue-200">
                  <div className="text-center">
                    <div className="bg-blue-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <Briefcase className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Existing Vendor Login + Quote</h3>
                    <p className="text-gray-600 mb-6">
                      Already registered with AHNI? Login to your vendor portal and submit your quotation for this RFQ.
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span>Access vendor portal</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span>Submit quotation</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span>Track submission status</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span>Faster processing</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => setSelectedPath('existing_vendor')}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      Login & Submit Quote
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Additional Information */}
            <Alert className="mb-8">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> This quotation request is open to both new and existing vendors.
                {rfqData.closing_date && (
                  <span> Submissions must be received by {formatDate(rfqData.closing_date)}.</span>
                )}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </>
    );
  }

  // Redirect existing vendors to vendor portal
  if (selectedPath === 'existing_vendor') {
    window.location.href = `/vendor-portal/login?redirect=/vendor-portal/rfqs&rfq=${id}`;
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
        <span className="ml-2">Redirecting to vendor portal...</span>
      </div>
    );
  }

  // Show vendor registration form for new vendors
  const getTypeDescription = () => {
    return "Register as a new vendor and submit your quotation for this RFQ";
  };

  return (
    <>
      <RFQDetailsSection />
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Vendor Registration & Quotation Submission
            </h1>
            <p className="text-gray-600">{getTypeDescription()}</p>

            <Button
              variant="outline"
              onClick={() => setSelectedPath(null)}
              className="mt-4"
            >
              ← Back to path selection
            </Button>
          </div>

          <Registration />
        </div>
      </div>
    </>
  );
}