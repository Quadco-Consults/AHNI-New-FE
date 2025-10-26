"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import EOIVendorSubmission from "@/features/procurement/components/vendor-management/eoi/EOIVendorSubmission";
import EoiAPI from "@/features/procurement/controllers/eoiController";
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
  Briefcase
} from "lucide-react";

export default function PublicEOIPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [selectedPath, setSelectedPath] = useState<'new_vendor' | 'existing_vendor' | null>(null);
  const { data, isLoading, error } = EoiAPI.useGetEoi(id as string);

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
          <h2 className="text-xl font-semibold text-gray-800 mb-2">EOI Not Found</h2>
          <p className="text-gray-600">The Expression of Interest you're looking for could not be found or may have expired.</p>
        </Card>
      </div>
    );
  }

  const eoiData = data.data;

  // Check if EOI is still open for submissions
  const isOpen = eoiData.status === "OPEN" && new Date(eoiData.closing_date) > new Date();

  if (!isOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">EOI Closed</h2>
          <p className="text-gray-600">This Expression of Interest is no longer accepting submissions.</p>
          {eoiData.closing_date && (
            <p className="text-sm text-gray-500 mt-2">
              Closed on: {new Date(eoiData.closing_date).toLocaleDateString("en-US")}
            </p>
          )}
        </Card>
      </div>
    );
  }

  const isProcurementWithRegistration = eoiData.type === 'PROCUREMENT_WITH_REGISTRATION';
  const isNewVendorOnly = eoiData.type === 'NEW_VENDOR';
  const isOpenTender = eoiData.type === 'OPEN_TENDER';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysRemaining = () => {
    const now = new Date();
    const closing = new Date(eoiData.closing_date);
    const diffTime = closing.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // For dual-purpose EOI, show vendor path selection first
  if (isProcurementWithRegistration && !selectedPath) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="bg-white p-3 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{eoiData.name}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{eoiData.description}</p>

            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Badge variant="default" className="text-sm px-3 py-1">
                <Clock className="h-4 w-4 mr-1" />
                {getDaysRemaining()} days remaining
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <FileText className="h-4 w-4 mr-1" />
                Procurement + Registration
              </Badge>
              {eoiData.procurement_details?.solicitation_id && (
                <Badge variant="outline" className="text-sm px-3 py-1">
                  ID: {eoiData.procurement_details.solicitation_id}
                </Badge>
              )}
            </div>
          </div>

          {/* Opportunity Overview */}
          {eoiData.procurement_details && (
            <Card className="p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Procurement Opportunity</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eoiData.procurement_details.technical_requirements && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Technical Requirements</h4>
                    <p className="text-gray-600 text-sm">{eoiData.procurement_details.technical_requirements}</p>
                  </div>
                )}
                {eoiData.procurement_details.financial_requirements && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Financial Requirements</h4>
                    <p className="text-gray-600 text-sm">{eoiData.procurement_details.financial_requirements}</p>
                  </div>
                )}
                {eoiData.procurement_details.min_vendor_experience_years && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Experience Required</h4>
                    <p className="text-gray-600 text-sm">Minimum {eoiData.procurement_details.min_vendor_experience_years} years</p>
                  </div>
                )}
              </div>
            </Card>
          )}

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
                  <h3 className="text-xl font-bold text-gray-900 mb-4">New Vendor Registration + Bid</h3>
                  <p className="text-gray-600 mb-6">
                    First time working with AHNI? Register as a new vendor and submit your bid for this procurement opportunity simultaneously.
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Complete vendor registration</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Submit procurement bid</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>One-step process</span>
                    </div>
                    {eoiData.registration_settings?.expedited_review && (
                      <div className="flex items-center gap-3 text-sm text-green-700 font-medium">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Expedited review process</span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => setSelectedPath('new_vendor')}
                    className="w-full"
                    size="lg"
                  >
                    Register & Submit Bid
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
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Existing Vendor Login + Bid</h3>
                  <p className="text-gray-600 mb-6">
                    Already registered with AHNI? Login to your vendor portal and submit your bid for this procurement opportunity.
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span>Access vendor portal</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span>Submit procurement bid</span>
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
                    Login & Submit Bid
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
              <strong>Important:</strong> This procurement opportunity is open to both new and existing vendors.
              {eoiData.procurement_details?.auto_qualify_vendors && (
                <span> Qualified vendors will be automatically considered for the bid evaluation.</span>
              )}
              {eoiData.closing_date && (
                <span> Submissions must be received by {formatDate(eoiData.closing_date)}.</span>
              )}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Redirect existing vendors to vendor portal
  if (selectedPath === 'existing_vendor') {
    window.location.href = `/vendor-portal/login?redirect=/vendor-portal/rfqs&eoi=${id}`;
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
        <span className="ml-2">Redirecting to vendor portal...</span>
      </div>
    );
  }

  // Show regular EOI form for new vendors or non-dual-purpose EOIs
  const getEOITypeDescription = () => {
    if (isProcurementWithRegistration) {
      return "Register as a new vendor and submit your bid for this procurement opportunity";
    } else if (isNewVendorOnly) {
      return "Register to become a qualified vendor for future opportunities";
    } else {
      return "Submit your response to this EOI opportunity";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isProcurementWithRegistration ? "Vendor Registration & Procurement Bid" : "Expression of Interest"}
          </h1>
          <p className="text-gray-600">{getEOITypeDescription()}</p>

          {isProcurementWithRegistration && (
            <Button
              variant="outline"
              onClick={() => setSelectedPath(null)}
              className="mt-4"
            >
              ← Back to path selection
            </Button>
          )}
        </div>

        <EOIVendorSubmission eoiData={eoiData} isProcurementWithRegistration={isProcurementWithRegistration} />
      </div>
    </div>
  );
}