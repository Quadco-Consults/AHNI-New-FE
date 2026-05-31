"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGetVendorSolicitation } from "@/features/vendor-portal/controllers/vendorSolicitationController";
import { LoadingSpinner } from "@/components/Loading";
import { format, isValid } from "date-fns";
import {
  Calendar,
  Clock,
  FileText,
  AlertCircle,
  ArrowLeft,
  Send
} from "lucide-react";

export default function VendorSolicitationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data, isLoading, error } = useGetVendorSolicitation(id as string);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !data?.data) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold mb-2">Solicitation Not Found</h2>
          <Button onClick={() => router.push('/vendor-portal/solicitations')}>
            Back to Solicitations
          </Button>
        </CardContent>
      </Card>
    );
  }

  const solicitation = data.data;

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy") : "Invalid date";
  };

  const isOpen = solicitation.status === 'OPEN' &&
                 new Date(solicitation.closing_date) > new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push('/vendor-portal/solicitations')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Solicitations
        </Button>
        {isOpen && !solicitation.has_submitted && (
          <Button onClick={() => router.push(`/vendor-portal/bids/create?solicitation=${id}`)}>
            <Send className="h-4 w-4 mr-2" />
            Submit {solicitation.request_type === 'RFQ' ? 'Quote' : 'Proposal'}
          </Button>
        )}
      </div>

      {/* Title Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={isOpen ? 'default' : 'secondary'}>
            {solicitation.status}
          </Badge>
          <Badge variant="outline" className={
            solicitation.request_type === 'RFQ' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
          }>
            {solicitation.request_type}
          </Badge>
          {solicitation.has_submitted && (
            <Badge variant="outline" className="bg-green-100 text-green-800">
              SUBMITTED
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold mb-2">{solicitation.title}</h1>
        {solicitation.rfq_id && (
          <p className="text-muted-foreground">Reference: {solicitation.rfq_id}</p>
        )}
      </div>

      {/* Alert for submitted */}
      {solicitation.has_submitted && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have already submitted a {solicitation.request_type === 'RFQ' ? 'quote' : 'proposal'} for this solicitation.
            View your submission in the Bids section.
          </AlertDescription>
        </Alert>
      )}

      {/* Alert for closed */}
      {!isOpen && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This solicitation is closed and no longer accepting submissions.
          </AlertDescription>
        </Alert>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Timeline</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="font-medium">Opens:</span>
                <span>{formatDate(solicitation.opening_date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-red-600" />
                <span className="font-medium">Closes:</span>
                <span className={!isOpen ? 'text-red-600' : ''}>
                  {formatDate(solicitation.closing_date)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" />
                <span className="font-medium">Days Remaining:</span>
                <span className={solicitation.days_remaining <= 7 ? 'text-orange-600 font-semibold' : ''}>
                  {solicitation.days_remaining} days
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Project Information</h2>
            {solicitation.project && (
              <p className="text-sm mb-2">
                <span className="font-medium">Project:</span> {solicitation.project.name}
              </p>
            )}
            {solicitation.eoi_tender && (
              <p className="text-sm">
                <span className="font-medium">Tender:</span> {solicitation.eoi_tender.name}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <div className="text-muted-foreground whitespace-pre-wrap">
            {solicitation.description}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      {solicitation.categories && solicitation.categories.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {solicitation.categories.map((category) => (
                <Badge key={category.id} variant="outline">
                  {category.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
