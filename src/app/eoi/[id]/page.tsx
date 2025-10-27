"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Registration from "@/features/procurement/components/vendor-management/vendor-registration/Registration";
import EoiAPI, { useGetPublicEoi } from "@/features/procurement/controllers/eoiController";
import { useGetPublicOpportunity } from "@/features/procurement/controllers/solicitationController";
import { LoadingSpinner } from "components/Loading";
import { Card as UICard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function PublicEOIPage() {
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
        <UICard>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">EOI Not Found</h2>
            <p className="text-muted-foreground">The Expression of Interest you're looking for could not be found or may have expired.</p>
          </CardContent>
        </UICard>
      </div>
    );
  }

  const eoiData = data.data;

  // Check if EOI is still open for submissions
  const isOpen = eoiData.status === "OPEN" && new Date(eoiData.closing_date) > new Date();

  // If EOI is closed, we'll still show details but disable submissions

  const isProcurementWithRegistration = eoiData.type === 'PROCUREMENT_WITH_REGISTRATION';
  const isNewVendorOnly = eoiData.type === 'NEW_VENDOR';
  const isOpenTender = eoiData.type === 'OPEN_TENDER';

  // Common EOI Details Component - Always shown
  const EOIDetailsSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header - Matching main EOI page style */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-light text-foreground mb-4">{eoiData.name}</h1>
            <p className="text-lg text-muted-foreground font-light max-w-3xl mx-auto mb-6">
              {eoiData.description}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {!isOpen && (
                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                  <Clock className="h-4 w-4 mr-1" />
                  Closed
                </Badge>
              )}
              {isOpen && (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  <Clock className="h-4 w-4 mr-1" />
                  {getDaysRemaining()} days remaining
                </Badge>
              )}
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                <FileText className="h-4 w-4 mr-1" />
                {getTypeDisplay(eoiData.type || '')}
              </Badge>
              {eoiData.eoi_number && (
                <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                  ID: {eoiData.eoi_number}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Status Alert */}
        {!isOpen && (
          <UICard className="mb-6">
            <CardContent className="p-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>This opportunity is closed.</strong> Submissions are no longer being accepted.
                  {eoiData.closing_date && (
                    <span> This EOI closed on {formatDate(eoiData.closing_date)}.</span>
                  )}
                </AlertDescription>
              </Alert>
            </CardContent>
          </UICard>
        )}

        {/* EOI Information */}
        <UICard className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">Opportunity Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="font-medium">Opens:</span>
                <span>{formatDate(eoiData.opening_date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-red-600" />
                <span className="font-medium">Closes:</span>
                <span className={!isOpen ? 'text-red-600' : ''}>{formatDate(eoiData.closing_date)}</span>
              </div>
              {(eoiData.department || eoiData.project || eoiData.location) && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">Department:</span>
                  <span>
                    {eoiData.department ||
                     (typeof eoiData.project === 'string' ? eoiData.project : eoiData.project?.title) ||
                     (Array.isArray(eoiData.location) ? eoiData.location.join(', ') : eoiData.location) ||
                     'AHNI'}
                  </span>
                </div>
              )}
              {eoiData.eoi_number && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">Reference:</span>
                  <span>{eoiData.eoi_number}</span>
                </div>
              )}
            </div>

            {eoiData.categories && eoiData.categories.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-foreground mb-2">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {eoiData.categories.map((category, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                      {typeof category === 'string' ? category : category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </UICard>

        {/* Procurement Details if available */}
        {eoiData.procurement_details && (
          <UICard className="mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold">Procurement Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eoiData.procurement_details.technical_requirements && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Technical Requirements</h4>
                    <p className="text-muted-foreground text-sm">{eoiData.procurement_details.technical_requirements}</p>
                  </div>
                )}
                {eoiData.procurement_details.financial_requirements && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Financial Requirements</h4>
                    <p className="text-muted-foreground text-sm">{eoiData.procurement_details.financial_requirements}</p>
                  </div>
                )}
                {eoiData.procurement_details.min_vendor_experience_years && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Experience Required</h4>
                    <p className="text-muted-foreground text-sm">Minimum {eoiData.procurement_details.min_vendor_experience_years} years</p>
                  </div>
                )}
              </div>
            </CardContent>
          </UICard>
        )}
      </div>
    </div>
  );

  const getTypeDisplay = (type: string) => {
    switch (type) {
      case 'NEW_VENDOR':
        return 'New Vendor Registration';
      case 'OPEN_TENDER':
        return 'Open Tender';
      case 'PROCUREMENT_WITH_REGISTRATION':
        return 'Procurement with Registration';
      default:
        return 'Expression of Interest';
    }
  };

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

  // Always show details first
  if (!isOpen) {
    // For closed EOIs, show details with submission disabled
    return (
      <>
        <EOIDetailsSection />
        <div className="bg-muted/20 py-8">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <UICard>
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold text-foreground mb-2">Submission Period Closed</h2>
                <p className="text-muted-foreground">This Expression of Interest is no longer accepting submissions.</p>
              </CardContent>
            </UICard>
          </div>
        </div>
      </>
    );
  }

  // For dual-purpose EOI, show details then path selection
  if (isProcurementWithRegistration && !selectedPath) {
    return (
      <>
        <EOIDetailsSection />
        <div className="bg-muted/20 py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Path Selection */}
            <div className="mb-12">
              <h2 className="text-2xl font-light text-foreground text-center mb-8">Choose Your Participation Path</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* New Vendor Path */}
                <UICard className="hover:shadow-lg transition-all">
                  <CardContent className="p-8 text-center">
                    <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <UserPlus className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">New Vendor Registration + Bid</h3>
                    <p className="text-muted-foreground mb-6">
                      First time working with AHNI? Register as a new vendor and submit your bid for this procurement opportunity simultaneously.
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Complete vendor registration</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Submit procurement bid</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
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
                  </CardContent>
                </UICard>

                {/* Existing Vendor Path */}
                <UICard className="hover:shadow-lg transition-all">
                  <CardContent className="p-8 text-center">
                    <div className="bg-blue-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <Briefcase className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Existing Vendor Login + Bid</h3>
                    <p className="text-muted-foreground mb-6">
                      Already registered with AHNI? Login to your vendor portal and submit your bid for this procurement opportunity.
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span>Access vendor portal</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span>Submit procurement bid</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span>Track submission status</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
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
                  </CardContent>
                </UICard>
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
      </>
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
    <>
      <EOIDetailsSection />
      <div className="bg-muted/20 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <UICard className="mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-light">
                {isProcurementWithRegistration ? "Vendor Registration & Procurement Bid" : "Submit Your Response"}
              </CardTitle>
              <p className="text-muted-foreground">{getEOITypeDescription()}</p>

              {isProcurementWithRegistration && (
                <Button
                  variant="outline"
                  onClick={() => setSelectedPath(null)}
                  className="mt-4"
                >
                  ← Back to path selection
                </Button>
              )}
            </CardHeader>
          </UICard>

          <Registration />
        </div>
      </div>
    </>
  );
}