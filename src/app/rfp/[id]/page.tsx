"use client";

export const dynamic = "force-dynamic";
import { useParams } from "next/navigation";
import { useState } from "react";
import Registration from "@/features/procurement/components/vendor-management/vendor-registration/Registration";
import { useGetPublicOpportunity } from "@/features/procurement/controllers/solicitationController";
import { LoadingSpinner } from "components/Loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Calendar,
  Download
} from "lucide-react";

export default function PublicRFPPage() {
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
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">RFP Not Found</h2>
            <p className="text-muted-foreground">The Request for Proposal you're looking for could not be found or may have expired.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const rfpData = data.data;

  // Check if RFP is still open for submissions
  const isOpen = rfpData.status === "OPEN" && new Date(rfpData.closing_date) > new Date();

  // Common RFP Details Component - Always shown
  const RFPDetailsSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header - Matching main EOI page style */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-light text-foreground mb-4">{rfpData.name || rfpData.title}</h1>
            <p className="text-lg text-muted-foreground font-light max-w-3xl mx-auto mb-6">
              {rfpData.description || rfpData.background}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {!isOpen && (
                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                  <Clock className="h-4 w-4 mr-1" />
                  Closed
                </Badge>
              )}
              {isOpen && rfpData.days_remaining && (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  <Clock className="h-4 w-4 mr-1" />
                  {rfpData.days_remaining} days remaining
                </Badge>
              )}
              {isOpen && !rfpData.days_remaining && (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  <Clock className="h-4 w-4 mr-1" />
                  {getDaysRemaining()} days remaining
                </Badge>
              )}
              <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                <FileText className="h-4 w-4 mr-1" />
                Request for Proposal
              </Badge>
              {rfpData.reference_number && (
                <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                  ID: {rfpData.reference_number}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">

        {/* RFP Information */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">Proposal Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="font-medium">Opens:</span>
                <span>{formatDate(rfpData.opening_date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-red-600" />
                <span className="font-medium">Closes:</span>
                <span className={!isOpen ? 'text-red-600' : ''}>{formatDate(rfpData.closing_date)}</span>
              </div>
              {rfpData.financial_year && (
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Financial Year:</span>
                  <span>{rfpData.financial_year}</span>
                </div>
              )}
            </div>

            {/* Categories */}
            {rfpData.categories && rfpData.categories.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {rfpData.categories.map((category, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {typeof category === 'string' ? category : category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Status Alert */}
            {!isOpen && (
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>This request is closed.</strong> Submissions are no longer being accepted.
                  {rfpData.closing_date && (
                    <span> This RFP closed on {formatDate(rfpData.closing_date)}.</span>
                  )}
                </AlertDescription>
                </Alert>
            )}
          </CardContent>
        </Card>

        {/* Documents if available */}
        {rfpData.documents && rfpData.documents.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">Related Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {rfpData.documents.map((document, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{document.name || `Document ${index + 1}`}</p>
                        {document.description && (
                          <p className="text-sm text-gray-600">{document.description}</p>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Document Download if single document */}
        {rfpData.document && !rfpData.documents && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">RFP Document</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">RFP Document</p>
                    <p className="text-sm text-gray-600">Download the complete Request for Proposal document</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => window.open(rfpData.document, '_blank')}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardContent>
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
    const closing = new Date(rfpData.closing_date);
    const diffTime = closing.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // If RFP is closed, show details with submission disabled
  if (!isOpen) {
    return (
      <>
        <RFPDetailsSection />
        <div className="bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <Card>
              <CardContent className="p-8 text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Submission Period Closed</h2>
                <p className="text-gray-600">This Request for Proposal is no longer accepting submissions.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  // For open RFPs, show details then path selection
  if (!selectedPath) {
    return (
      <>
        <RFPDetailsSection />
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Path Selection */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Choose Your Participation Path</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* New Vendor Path */}
                <Card className="p-8 hover:shadow-lg transition-shadow border-2 hover:border-purple-200">
                  <div className="text-center">
                    <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <UserPlus className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">New Vendor Registration + Proposal</h3>
                    <p className="text-gray-600 mb-6">
                      First time working with AHNI? Register as a new vendor and submit your proposal for this RFP simultaneously.
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Complete vendor registration</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Submit detailed proposal</span>
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
                      Register & Submit Proposal
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>

                {/* Existing Vendor Path */}
                <Card className="p-8 hover:shadow-lg transition-shadow border-2 hover:border-purple-200">
                  <div className="text-center">
                    <div className="bg-purple-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <Briefcase className="h-10 w-10 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Existing Vendor Login + Proposal</h3>
                    <p className="text-gray-600 mb-6">
                      Already registered with AHNI? Login to your vendor portal and submit your proposal for this RFP.
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-purple-600" />
                        <span>Access vendor portal</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-purple-600" />
                        <span>Submit detailed proposal</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-purple-600" />
                        <span>Track submission status</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-purple-600" />
                        <span>Faster processing</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => setSelectedPath('existing_vendor')}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      Login & Submit Proposal
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
                <strong>Important:</strong> This proposal request is open to both new and existing vendors.
                {rfpData.closing_date && (
                  <span> Proposals must be received by {formatDate(rfpData.closing_date)}.</span>
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
    window.location.href = `/vendor-portal/login?redirect=/vendor-portal/rfps&rfp=${id}`;
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
        <span className="ml-2">Redirecting to vendor portal...</span>
      </div>
    );
  }

  // Show vendor registration form for new vendors
  const getTypeDescription = () => {
    return "Register as a new vendor and submit your proposal for this RFP";
  };

  return (
    <>
      <RFPDetailsSection />
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Vendor Registration & Proposal Submission
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