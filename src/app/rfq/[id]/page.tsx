"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Registration from "@/features/procurement/components/vendor-management/vendor-registration/Registration";
import { useGetPublicOpportunity } from "@/features/procurement/controllers/solicitationController";
import { LoadingSpinner } from "components/Loading";
import Card from "components/Card";
import BackNavigation from "components/atoms/BackNavigation";
import DataTable from "components/Table/DataTable";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Alert, AlertDescription } from "components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Icon } from "@iconify/react";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "lib/utils";
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
  AlertCircle,
  Mail
} from "lucide-react";

// Define the columns for the solicitation items table (matching staff portal)
const columns: ColumnDef<any>[] = [
  {
    header: "Item Name",
    size: 240,
    accessorKey: "item_name",
    cell: ({ row }) => {
      let itemName = "N/A";
      if (row.original?.item_detail?.name) {
        itemName = row.original.item_detail.name;
      } else if (row.original?.item?.name) {
        itemName = row.original.item.name;
      } else if (row.original?.name) {
        itemName = row.original.name;
      }
      return <div className='text-left space-y-2'>{itemName}</div>;
    },
  },
  {
    header: "Description",
    size: 300,
    accessorKey: "description",
    cell: ({ row }) => {
      let description = "N/A";
      if (row.original?.item_detail?.description) {
        description = row.original.item_detail.description;
      } else if (row.original?.item?.description) {
        description = row.original.item.description;
      } else if (row.original?.specifications) {
        description = row.original.specifications;
      } else if (row.original?.description) {
        description = row.original.description;
      }
      return <div className='text-left space-y-2'>{description}</div>;
    },
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
    size: 120,
    cell: ({ row }) => {
      const quantity = row.original?.quantity;
      return (
        <div className='text-center space-y-2'>
          {quantity || "N/A"}
        </div>
      );
    },
  },
  {
    header: "UOM",
    size: 120,
    accessorKey: "uom",
    cell: ({ row }) => {
      let uom = "pieces";
      if (row.original?.item_detail?.uom) {
        uom = row.original.item_detail.uom;
      } else if (row.original?.item?.uom) {
        uom = row.original.item.uom;
      } else if (row.original?.unit) {
        uom = row.original.unit;
      }
      return <div className='text-center space-y-2'>{uom}</div>;
    },
  },
  {
    header: "Lot",
    size: 150,
    accessorKey: "lot",
    cell: ({ row }) => {
      let lot = "No Lot";
      if (row.original?.lot_detail?.name) {
        lot = row.original.lot_detail.name;
      } else if (row.original?.lot && typeof row.original.lot === 'string' && row.original.lot !== "no-lot") {
        lot = row.original.lot;
      } else if (typeof row.original?.lot === 'number') {
        lot = `Lot ${row.original.lot}`;
      }
      return <div className='text-center space-y-2'>{lot}</div>;
    },
  },
  {
    header: "Specification",
    size: 250,
    accessorKey: "specification",
    cell: ({ row }) => {
      let spec = "N/A";
      if (row.original?.specification) {
        spec = row.original.specification;
      } else if (row.original?.specifications) {
        spec = row.original.specifications;
      } else if (row.original?.item_detail?.description) {
        spec = row.original.item_detail.description;
      }
      return <div className='text-left space-y-2'>{spec}</div>;
    },
  },
];

export default function PublicRFQPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [tabValue, setTabValue] = useState("rfq-details");
  const [selectedPath, setSelectedPath] = useState<'new_vendor' | 'existing_vendor' | null>(null);

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
              The Request for Quotation you're looking for could not be found or may have expired.
            </p>
            <Button onClick={() => router.push('/opportunities')}>
              View All Opportunities
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const rfqData = data.data;

  // Check if RFQ is still open for submissions
  const isOpen = rfqData.status === "OPEN" && new Date(rfqData.closing_date) > new Date();

  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // RFQ Details Content matching staff portal design
  const RFQDetailsContent = () => (
    <div className='p-5'>
      <Card className='space-y-8 p-10'>
        <h2 className='font-semibold text-lg'>{rfqData.title}</h2>

        <h4 className='text-green-dark text-base font-medium'>
          Request for Quotation&nbsp;
          <Badge
            className={cn(
              rfqData.status === "OPEN" && "bg-green-200 text-green-800",
              rfqData.status === "CLOSED" && "bg-red-200 text-red-800",
              rfqData.status === "Pending" && "bg-yellow-200 text-yellow-800"
            )}
          >
            {rfqData.status}
          </Badge>
        </h4>

        <div className='flex items-center gap-10'>
          {rfqData.rfq_id && (
            <div className='flex gap-3 items-center'>
              <Icon icon='ooui:reference' fontSize={18} />
              <h6>{rfqData.rfq_id}</h6>
            </div>
          )}
          {rfqData.tender_type && (
            <div className='flex gap-3 items-center'>
              <Icon icon='solar:case-minimalistic-bold-duotone' fontSize={18} />
              <h6>{rfqData.tender_type}</h6>
            </div>
          )}
        </div>

        {(rfqData.opening_date || rfqData.closing_date) && (
          <div className='flex items-center gap-10'>
            {rfqData.opening_date && (
              <div className='flex gap-3 items-center'>
                <Icon icon='mdi:calendar-start' fontSize={18} />
                <h6>Opening: {formatDate(rfqData.opening_date)}</h6>
              </div>
            )}
            {rfqData.closing_date && (
              <div className='flex gap-3 items-center'>
                <Icon icon='mdi:calendar-end' fontSize={18} />
                <h6>Closing: {formatDate(rfqData.closing_date)}</h6>
              </div>
            )}
          </div>
        )}

        {rfqData.background && (
          <div className='space-y-4'>
            <h2 className='font-medium text-base'>Background</h2>
            <h4 className='text-gray-500'>{rfqData.background}</h4>
          </div>
        )}

        <div className='space-y-4'>
          <h2 className='font-medium text-yellow-darker text-base'>Items</h2>
          <div className=''>
            {(!rfqData.solicitation_items || rfqData.solicitation_items.length === 0) && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  ⚠️ No items specified for this RFQ.
                </p>
              </div>
            )}
            <DataTable
              data={rfqData.solicitation_items || []}
              columns={columns}
            />
          </div>
        </div>
      </Card>
    </div>
  );

  // Vendor Submission Content
  const VendorSubmissionContent = () => (
    <div className='p-5'>
      <Card className='space-y-8 p-10'>
        {isOpen ? (
          <div className="space-y-6">
            <h2 className='font-semibold text-lg'>Submit Your Quotation</h2>

            {!selectedPath && (
              <>
                <p className="text-gray-600 mb-6">
                  Choose how you would like to participate in this Request for Quotation.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* New Vendor Path */}
                  <Card className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-blue-200">
                    <div className="text-center">
                      <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <UserPlus className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">New Vendor</h3>
                      <p className="text-gray-600 mb-4 text-sm">
                        Register and submit quotation simultaneously.
                      </p>
                      <Button
                        onClick={() => setSelectedPath('new_vendor')}
                        className="w-full"
                      >
                        Register & Submit Quote
                      </Button>
                    </div>
                  </Card>

                  {/* Existing Vendor Path */}
                  <Card className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-blue-200">
                    <div className="text-center">
                      <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Briefcase className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Existing Vendor</h3>
                      <p className="text-gray-600 mb-4 text-sm">
                        Login to vendor portal and submit quotation.
                      </p>
                      <Button
                        onClick={() => setSelectedPath('existing_vendor')}
                        variant="outline"
                        className="w-full"
                      >
                        Login & Submit Quote
                      </Button>
                    </div>
                  </Card>
                </div>
              </>
            )}

            {selectedPath === 'existing_vendor' && (
              <div className="text-center">
                <LoadingSpinner />
                <p className="mt-2">Redirecting to vendor portal...</p>
                {setTimeout(() => {
                  window.location.href = `/vendor-portal/login?redirect=/vendor-portal/rfqs&rfq=${id}`;
                }, 1000)}
              </div>
            )}

            {selectedPath === 'new_vendor' && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Vendor Registration & Quotation</h3>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedPath(null)}
                    size="sm"
                  >
                    ← Back to options
                  </Button>
                </div>
                <Registration />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Submission Period Closed</h3>
            <p className="text-gray-600 mb-4">
              This RFQ is no longer accepting quotation submissions.
            </p>
            <p className="text-sm text-gray-500">
              Closed on: {formatDate(rfqData.closing_date)}
            </p>
          </div>
        )}
      </Card>
    </div>
  );

  // Public Information Tab
  const PublicInformationContent = () => (
    <div className='p-5'>
      <Card className='space-y-6 p-10'>
        <h2 className='font-semibold text-lg'>How to Participate</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-base">Contact Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>procurement@ahnigeria.org</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <span>Procurement Department</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-base">Important Notes</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• AHNI does not charge any fees for participation</li>
              <li>• Only shortlisted vendors will be contacted</li>
              <li>• Ensure all required documents are submitted</li>
              <li>• Late submissions will not be accepted</li>
            </ul>
          </div>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> AHNI has Zero Tolerance to Sexual Abuse and is committed to safeguarding and child protection. We are an equal opportunity organization.
          </AlertDescription>
        </Alert>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Header with Back Navigation and Tabs */}
      <Tabs
        defaultValue='rfq-details'
        value={tabValue}
        onValueChange={(value) => setTabValue(value)}
      >
        <section className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-5'>
            <BackNavigation />
            <TabsList>
              <TabsTrigger value='rfq-details'>RFQ Details</TabsTrigger>
              <TabsTrigger value='vendor-submission'>Submit Quotation</TabsTrigger>
              <TabsTrigger value='information'>Information</TabsTrigger>
            </TabsList>
          </div>
        </section>

        <section>
          <TabsContent value='rfq-details'>
            <RFQDetailsContent />
          </TabsContent>

          <TabsContent value='vendor-submission'>
            <VendorSubmissionContent />
          </TabsContent>

          <TabsContent value='information'>
            <PublicInformationContent />
          </TabsContent>
        </section>
      </Tabs>
    </div>
  );
}