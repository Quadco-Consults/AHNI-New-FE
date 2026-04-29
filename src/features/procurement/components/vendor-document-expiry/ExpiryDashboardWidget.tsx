"use client";

import { AlertCircle, Clock, FileWarning, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetVendorDocuments } from "@/features/procurement/controllers/vendorDocumentController";
import { useRouter } from "next/navigation";

interface ExpiringDocument {
  id: string;
  vendor_name: string;
  document_type: string;
  expiry_date: string;
  days_until_expiry: number;
  urgency: "expired" | "urgent" | "warning" | "normal";
}

export default function VendorDocumentExpiryWidget() {
  const router = useRouter();

  // Fetch all vendor documents
  const { vendorDocuments, isLoading } = useGetVendorDocuments({ page: 1, size: 100 });

  // Calculate expiring documents
  const getExpiringDocuments = (): ExpiringDocument[] => {
    if (!vendorDocuments?.results) return [];

    const today = new Date();
    const expiringDocs: ExpiringDocument[] = [];

    vendorDocuments.results.forEach((doc: any) => {
      if (!doc.expiry_date) return;

      const expiryDate = new Date(doc.expiry_date);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      let urgency: "expired" | "urgent" | "warning" | "normal" = "normal";

      if (daysUntilExpiry < 0) {
        urgency = "expired";
      } else if (daysUntilExpiry <= 3) {
        urgency = "urgent";
      } else if (daysUntilExpiry <= 7) {
        urgency = "warning";
      } else if (daysUntilExpiry <= 30) {
        urgency = "normal";
      } else {
        return; // Don't include documents expiring after 30 days
      }

      expiringDocs.push({
        id: doc.id,
        vendor_name: doc.vendor?.company_name || "Unknown Vendor",
        document_type: doc.document_type,
        expiry_date: doc.expiry_date,
        days_until_expiry: daysUntilExpiry,
        urgency
      });
    });

    // Sort by urgency and days until expiry
    return expiringDocs.sort((a, b) => {
      const urgencyOrder = { expired: 0, urgent: 1, warning: 2, normal: 3 };
      if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      }
      return a.days_until_expiry - b.days_until_expiry;
    });
  };

  const expiringDocuments = getExpiringDocuments();

  // Count by urgency
  const counts = {
    expired: expiringDocuments.filter(d => d.urgency === "expired").length,
    urgent: expiringDocuments.filter(d => d.urgency === "urgent").length,
    warning: expiringDocuments.filter(d => d.urgency === "warning").length,
    total: expiringDocuments.length,
  };

  // Get urgency badge color and icon
  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "expired":
        return {
          color: "bg-red-600 text-white",
          icon: <AlertCircle className="h-3 w-3" />,
          label: "EXPIRED"
        };
      case "urgent":
        return {
          color: "bg-orange-600 text-white",
          icon: <FileWarning className="h-3 w-3" />,
          label: "URGENT"
        };
      case "warning":
        return {
          color: "bg-yellow-600 text-white",
          icon: <Clock className="h-3 w-3" />,
          label: "WARNING"
        };
      default:
        return {
          color: "bg-blue-600 text-white",
          icon: <CheckCircle className="h-3 w-3" />,
          label: "NOTICE"
        };
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileWarning className="h-5 w-5 text-orange-600" />
              Vendor Document Expiry
            </CardTitle>
            <CardDescription>
              Monitor documents expiring in the next 30 days
            </CardDescription>
          </div>
          {counts.total > 0 && (
            <Badge variant="outline" className="text-sm">
              {counts.total} Document{counts.total !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            Loading documents...
          </div>
        ) : counts.total === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="text-sm text-gray-600 font-medium mb-1">
              All documents are up to date
            </p>
            <p className="text-xs text-gray-500">
              No documents expiring in the next 30 days
            </p>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {counts.expired > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-xs font-medium text-red-900">Expired</span>
                  </div>
                  <p className="text-2xl font-bold text-red-700">{counts.expired}</p>
                </div>
              )}
              {counts.urgent > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <FileWarning className="h-4 w-4 text-orange-600" />
                    <span className="text-xs font-medium text-orange-900">Urgent (≤3d)</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-700">{counts.urgent}</p>
                </div>
              )}
              {counts.warning > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-xs font-medium text-yellow-900">Warning (≤7d)</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-700">{counts.warning}</p>
                </div>
              )}
            </div>

            {/* Document List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {expiringDocuments.slice(0, 5).map((doc) => {
                const badge = getUrgencyBadge(doc.urgency);
                return (
                  <div
                    key={doc.id}
                    className={cn(
                      "border rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer",
                      doc.urgency === "expired" && "bg-red-50 border-red-200",
                      doc.urgency === "urgent" && "bg-orange-50 border-orange-200",
                      doc.urgency === "warning" && "bg-yellow-50 border-yellow-200",
                      doc.urgency === "normal" && "bg-blue-50 border-blue-200"
                    )}
                    onClick={() => router.push(`/dashboard/procurement/vendor-management/prequalification`)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {doc.vendor_name}
                          </p>
                          <Badge className={cn("text-[10px] px-1.5 py-0.5 flex items-center gap-1", badge.color)}>
                            {badge.icon}
                            {badge.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 truncate">
                          {doc.document_type}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={cn(
                            "text-xs font-medium",
                            doc.urgency === "expired" && "text-red-700",
                            doc.urgency === "urgent" && "text-orange-700",
                            doc.urgency === "warning" && "text-yellow-700",
                            doc.urgency === "normal" && "text-blue-700"
                          )}>
                            {doc.days_until_expiry < 0
                              ? `Expired ${Math.abs(doc.days_until_expiry)} day${Math.abs(doc.days_until_expiry) !== 1 ? "s" : ""} ago`
                              : doc.days_until_expiry === 0
                                ? "Expires today"
                                : doc.days_until_expiry === 1
                                  ? "Expires tomorrow"
                                  : `${doc.days_until_expiry} days left`
                            }
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {new Date(doc.expiry_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {expiringDocuments.length > 5 && (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3"
                onClick={() => router.push("/dashboard/procurement/vendor-management/prequalification")}
              >
                View All {expiringDocuments.length} Documents
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
