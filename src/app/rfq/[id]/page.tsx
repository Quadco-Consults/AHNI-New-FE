"use client";

export const dynamic = "force-dynamic";
import { useParams, useRouter } from "next/navigation";
import { useGetPublicOpportunity } from "@/features/procurement/controllers/solicitationController";
import BackNavigation from "@/components/BackNavigation";
import Card from "@/components/Card";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format, isValid } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  FileText,
  Mail,
  AlertCircle,
  ShieldCheck,
  LogIn
} from "lucide-react";

export default function RFQDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const { data, isLoading, error } = useGetPublicOpportunity(id as string);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <div className="p-8 text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold text-foreground mb-2">RFQ Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The Request for Quote you're looking for could not be found or may have expired.
            </p>
            <Button onClick={() => router.push('/opportunities')}>
              View All Opportunities
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const opportunity = data.data;

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy") : "Invalid date";
  };

  const getLocationDisplay = () => {
    if (opportunity.locations && Array.isArray(opportunity.locations) && opportunity.locations.length > 0) {
      return opportunity.locations.map((loc: any) => loc.name || loc.city || "Unknown").join(", ");
    }
    if (opportunity.location || opportunity.location_name) {
      return opportunity.location || opportunity.location_name;
    }
    return "Multiple Locations";
  };

  const isOpen = opportunity.status === "PUBLISHED" &&
                 opportunity.closing_date &&
                 new Date(opportunity.closing_date) > new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-12">
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <BackNavigation />
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                Request for Quote
              </Badge>
              {!isOpen && (
                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                  Closed
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {opportunity.name || opportunity.title}
            </h1>
            {opportunity.rfq_number && (
              <p className="text-muted-foreground">RFQ Number: {opportunity.rfq_number}</p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6 border-2 border-blue-500/50 bg-gradient-to-r from-blue-50 to-white">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 rounded-full p-3">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Vendor Portal Access Required
                </h3>
                <p className="text-muted-foreground mb-4">
                  To submit a quotation for this RFQ, you must be a prequalified vendor with an active vendor portal account.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => router.push('/vendor-portal/login')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login to Vendor Portal
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/opportunities?category=Procurement%20%26%20EOI')}
                  >
                    View EOI for Vendor Registration
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">RFQ Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="font-medium">Opening Date:</span>
                <span className="text-muted-foreground">{formatDate(opportunity.opening_date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-red-600" />
                <span className="font-medium">Closing Date:</span>
                <span className={!isOpen ? 'text-red-600' : 'text-muted-foreground'}>
                  {formatDate(opportunity.closing_date)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">Location:</span>
                <span className="text-muted-foreground">{getLocationDisplay()}</span>
              </div>
              {opportunity.project && (
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">Project:</span>
                  <span className="text-muted-foreground">
                    {typeof opportunity.project === 'string' ? opportunity.project : opportunity.project.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {opportunity.description && (
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Description</h2>
              <div className="text-muted-foreground whitespace-pre-wrap">
                {opportunity.description}
              </div>
            </div>
          </Card>
        )}

        {opportunity.categories && opportunity.categories.length > 0 && (
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {opportunity.categories.map((category: any, index: number) => (
                  <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                    {typeof category === 'string' ? category : category.name}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        )}

        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Contact Information</h2>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Email:</span>
              <a href="mailto:procurement@ahnigeria.org" className="text-blue-600 hover:underline">
                procurement@ahnigeria.org
              </a>
            </div>
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Quotations can only be submitted through the vendor portal by prequalified vendors.
              </AlertDescription>
            </Alert>
          </div>
        </Card>
      </div>
    </div>
  );
}
