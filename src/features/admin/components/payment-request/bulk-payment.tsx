"use client";

import { useState, useRef } from "react";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useDownloadPaymentTemplate,
  useUploadPaymentTemplate,
} from "@/features/admin/controllers/paymentRequestController";

export default function BulkPaymentComponent() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Template download state
  const [downloadFilters, setDownloadFilters] = useState({
    payment_type: "CONSULTANT" as "CONSULTANT" | "ADHOC_STAFF",
    cluster_id: "",
    location_id: "",
  });

  // Upload state
  const [uploadData, setUploadData] = useState({
    file: null as File | null,
    payment_type: "CONSULTANT" as "CONSULTANT" | "ADHOC_STAFF",
    payment_date: "",
    payment_reason: "",
    reviewer: "",
    authorizer: "",
    approver: "",
  });

  const { downloadTemplate } = useDownloadPaymentTemplate();
  const { uploadTemplate, isLoading: isUploading, isSuccess: uploadSuccess } = useUploadPaymentTemplate();

  const [isDownloading, setIsDownloading] = useState(false);

  // Handle template download
  const handleDownload = async () => {
    if (!downloadFilters.cluster_id && !downloadFilters.location_id) {
      toast.error("Please select either a cluster or location to filter staff");
      return;
    }

    setIsDownloading(true);
    try {
      await downloadTemplate(downloadFilters);
      toast.success("Excel template has been downloaded successfully");
    } catch (error) {
      toast.error("Failed to download template. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadData({ ...uploadData, file: e.target.files[0] });
    }
  };

  // Handle template upload
  const handleUpload = async () => {
    if (!uploadData.file) {
      toast.error("Please select an Excel file to upload");
      return;
    }

    if (!uploadData.payment_date || !uploadData.payment_reason) {
      toast.error("Please fill in payment date and reason");
      return;
    }

    if (!uploadData.reviewer || !uploadData.authorizer || !uploadData.approver) {
      toast.error("Please select reviewer, authorizer, and approver");
      return;
    }

    try {
      await uploadTemplate(uploadData);

      if (uploadSuccess) {
        toast.success("Bulk payment request created successfully");

        // Reset form
        setUploadData({
          file: null,
          payment_type: "CONSULTANT",
          payment_date: "",
          payment_reason: "",
          reviewer: "",
          authorizer: "",
          approver: "",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      toast.error("Failed to create bulk payment. Please check the file and try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Download Template Section */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            1. Download Payment Template
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Download a pre-filled Excel template with staff information based on your filters.
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="download-payment-type">Payment Type</Label>
                <Select
                  value={downloadFilters.payment_type}
                  onValueChange={(value: "CONSULTANT" | "ADHOC_STAFF") =>
                    setDownloadFilters({ ...downloadFilters, payment_type: value })
                  }
                >
                  <SelectTrigger id="download-payment-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONSULTANT">Consultant</SelectItem>
                    <SelectItem value="ADHOC_STAFF">Adhoc Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cluster">Cluster (Optional)</Label>
                <Input
                  id="cluster"
                  placeholder="Enter cluster ID"
                  value={downloadFilters.cluster_id}
                  onChange={(e) =>
                    setDownloadFilters({
                      ...downloadFilters,
                      cluster_id: e.target.value,
                      location_id: "", // Clear location if cluster is set
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  placeholder="Enter location ID"
                  value={downloadFilters.location_id}
                  onChange={(e) =>
                    setDownloadFilters({
                      ...downloadFilters,
                      location_id: e.target.value,
                      cluster_id: "", // Clear cluster if location is set
                    })
                  }
                />
              </div>
            </div>

            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full md:w-auto"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Template
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Upload Template Section */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            2. Upload Filled Template
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Fill in the downloaded template with payment details and upload it to create bulk payment requests.
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="upload-payment-type">Payment Type</Label>
                <Select
                  value={uploadData.payment_type}
                  onValueChange={(value: "CONSULTANT" | "ADHOC_STAFF") =>
                    setUploadData({ ...uploadData, payment_type: value })
                  }
                >
                  <SelectTrigger id="upload-payment-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONSULTANT">Consultant</SelectItem>
                    <SelectItem value="ADHOC_STAFF">Adhoc Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="payment-date">Payment Date</Label>
                <Input
                  id="payment-date"
                  type="date"
                  value={uploadData.payment_date}
                  onChange={(e) =>
                    setUploadData({ ...uploadData, payment_date: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="payment-reason">Payment Reason</Label>
              <Input
                id="payment-reason"
                placeholder="Enter reason for payment"
                value={uploadData.payment_reason}
                onChange={(e) =>
                  setUploadData({ ...uploadData, payment_reason: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="reviewer">Reviewer ID</Label>
                <Input
                  id="reviewer"
                  placeholder="Enter reviewer ID"
                  value={uploadData.reviewer}
                  onChange={(e) =>
                    setUploadData({ ...uploadData, reviewer: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="authorizer">Authorizer ID</Label>
                <Input
                  id="authorizer"
                  placeholder="Enter authorizer ID"
                  value={uploadData.authorizer}
                  onChange={(e) =>
                    setUploadData({ ...uploadData, authorizer: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="approver">Approver ID</Label>
                <Input
                  id="approver"
                  placeholder="Enter approver ID"
                  value={uploadData.approver}
                  onChange={(e) =>
                    setUploadData({ ...uploadData, approver: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="file-upload">Excel File</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {uploadData.file && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {uploadData.file.name}
                </p>
              )}
            </div>

            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full md:w-auto"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload & Create Payment Requests
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <Card>
        <div className="p-6 bg-blue-50">
          <h3 className="font-semibold mb-2">Instructions</h3>
          <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
            <li>Select payment type and filter (cluster or location) to download template</li>
            <li>Open the downloaded Excel file and fill in payment details for each staff member</li>
            <li>Fill in the required fields: Days for This Payment, Payment Period Start/End, and verify Deduction amounts</li>
            <li>Save the Excel file after making changes</li>
            <li>Upload the filled template along with payment date, reason, and approvers</li>
            <li>The system will create payment requests for all staff in the template</li>
          </ol>
        </div>
      </Card>
    </div>
  );
}
