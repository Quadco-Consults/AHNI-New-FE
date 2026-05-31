"use client";

import { useState, useRef, DragEvent, useMemo, useEffect } from "react";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Download,
  Upload,
  Loader2,
  FileSpreadsheet,
  X,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import {
  useDownloadPaymentTemplate,
  useUploadPaymentTemplate,
} from "@/features/admin/controllers/paymentRequestController";
import { useRouter } from "next/navigation";
import { AdminRoutes } from "@/constants/RouterConstants";
import { UPLOAD_DESIGN } from "@/components/uploads/design-tokens";
import {
  useGetAllLocations,
} from "@/features/modules/controllers/config/locationController";
import {
  useGetClustersByLocation,
} from "@/features/modules/controllers/config/clusterController";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BulkUploadSectionProps {
  paymentType: "CONSULTANT" | "ADHOC_STAFF";
  reviewer: string;
  authorizer: string;
  approver: string;
}

export default function BulkUploadSection({
  paymentType,
  reviewer,
  authorizer,
  approver,
}: BulkUploadSectionProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Template download state
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedCluster, setSelectedCluster] = useState<string>("");
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  // Fetch locations
  const { data: locationsData } = useGetAllLocations({
    page: 1,
    size: 1000,
    search: "",
  });

  // Fetch clusters for selected location
  const { data: clustersData } = useGetClustersByLocation(
    selectedLocation,
    !!selectedLocation
  );

  // Upload state
  const [uploadData, setUploadData] = useState({
    file: null as File | null,
    payment_date: "",
    payment_reason: "",
  });
  const [isDragging, setIsDragging] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const { downloadTemplate } = useDownloadPaymentTemplate();
  const { uploadTemplate, isLoading: isUploading, isSuccess, error, data: uploadResponse } = useUploadPaymentTemplate();

  // Handle successful upload - redirect to document upload page
  useEffect(() => {
    if (isSuccess && uploadResponse?.data?.payment_request?.id) {
      setUploadComplete(true);
      toast.success("Bulk payment request created successfully. Please upload supporting documents.");

      // Navigate to document upload page after a short delay
      const paymentRequestId = uploadResponse.data.payment_request.id;
      const timer = setTimeout(() => {
        router.push(`${AdminRoutes.PAYMENT_REQUEST}/${paymentRequestId}/upload-document`);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, uploadResponse, router]);

  // Prepare location options
  const locationOptions = useMemo(
    () =>
      locationsData?.data?.results?.map((location: any) => ({
        label: location.name,
        value: location.id,
      })) || [],
    [locationsData]
  );

  // Prepare cluster options for selected location
  const clusterOptions = useMemo(() => {
    if (!clustersData || !Array.isArray(clustersData)) return [];
    return clustersData.map((cluster: any) => ({
      label: cluster.name,
      value: cluster.id,
    }));
  }, [clustersData]);

  // Reset cluster selection when location changes
  useEffect(() => {
    setSelectedCluster("");
  }, [selectedLocation]);

  // Handle template download
  const handleDownload = async () => {
    // Validation: Location is required
    if (!selectedLocation) {
      toast.error("Please select a location to download the template");
      return;
    }

    // Validation: If location has clusters, cluster selection is required
    if (clusterOptions.length > 0 && !selectedCluster) {
      toast.error("Please select a cluster for this location");
      return;
    }

    setIsDownloadingTemplate(true);
    try {
      const params: any = { payment_type: paymentType };

      // If cluster is selected, use cluster_id (preferred over location_id)
      if (selectedCluster) {
        params.cluster_id = selectedCluster;
      } else {
        // Otherwise use location_id
        params.location_id = selectedLocation;
      }

      await downloadTemplate(params);
      toast.success("Excel template has been downloaded successfully");
    } catch (error) {
      toast.error("Failed to download template. Please try again.");
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (file: File) => {
    // Validate file type
    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      toast.error(`Invalid file format. Please upload ${validExtensions.join(' or ')} files only.`);
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size exceeds 10MB limit");
      return;
    }

    setUploadData({ ...uploadData, file });
    setUploadComplete(false);
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Handle drag events
  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
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

    if (!reviewer || !authorizer || !approver) {
      toast.error("Please select reviewer, authorizer, and approver in the form above");
      return;
    }

    try {
      await uploadTemplate({
        file: uploadData.file,
        payment_type: paymentType,
        payment_date: uploadData.payment_date,
        payment_reason: uploadData.payment_reason,
        reviewer,
        authorizer,
        approver,
      });
      // Success handling is now done in useEffect watching isSuccess
    } catch (err) {
      toast.error("Failed to create bulk payment. Please check the file and try again.");
    }
  };

  // Handle reset
  const handleReset = () => {
    setUploadData({
      file: null,
      payment_date: "",
      payment_reason: "",
    });
    setUploadComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Determine drop zone classes
  const dropZoneClasses = [
    UPLOAD_DESIGN.dropZone.borderStyle,
    "flex flex-col items-center justify-center p-8 transition-all duration-200 cursor-pointer"
  ];

  if (isDragging) {
    dropZoneClasses.push(UPLOAD_DESIGN.dropZone.borderColor.active);
    dropZoneClasses.push(UPLOAD_DESIGN.dropZone.background.active);
  } else if (error) {
    dropZoneClasses.push(UPLOAD_DESIGN.dropZone.borderColor.error);
    dropZoneClasses.push(UPLOAD_DESIGN.dropZone.background.error);
  } else if (uploadComplete) {
    dropZoneClasses.push(UPLOAD_DESIGN.dropZone.borderColor.success);
    dropZoneClasses.push(UPLOAD_DESIGN.dropZone.background.success);
  } else {
    dropZoneClasses.push(UPLOAD_DESIGN.dropZone.borderColor.default);
    dropZoneClasses.push(UPLOAD_DESIGN.dropZone.background.default);
  }

  return (
    <div className="space-y-6 mt-6">
      {/* Combined Bulk Payment Upload Section */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">
            Bulk Payment Upload
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Download a pre-filled template, fill it with payment details, and upload to create bulk payment requests.
          </p>

          <div className="space-y-6">
            {/* Template Download with Filters */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Download Template</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Location Selection */}
                  <div>
                    <Label htmlFor="location">
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={selectedLocation}
                      onValueChange={setSelectedLocation}
                    >
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locationOptions.map((option: any) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Select the state/location
                    </p>
                  </div>

                  {/* Cluster Selection - Only show if clusters exist for selected location */}
                  {selectedLocation && (
                    <div>
                      <Label htmlFor="cluster">
                        Cluster
                        {clusterOptions.length > 0 && (
                          <span className="text-red-500">*</span>
                        )}
                      </Label>
                      {clusterOptions.length > 0 ? (
                        <>
                          <Select
                            value={selectedCluster}
                            onValueChange={setSelectedCluster}
                          >
                            <SelectTrigger id="cluster">
                              <SelectValue placeholder="Select cluster" />
                            </SelectTrigger>
                            <SelectContent>
                              {clusterOptions.map((option: any) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500 mt-1">
                            This location has clusters - please select one
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center h-10 px-3 py-2 text-sm bg-gray-100 border border-gray-200 rounded-md text-gray-500">
                            No clusters for this location
                          </div>
                          <p className="text-xs text-green-600 mt-1">
                            ✓ Proceed with location only
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isDownloadingTemplate || !selectedLocation}
                    className={UPLOAD_DESIGN.template.button}
                  >
                    <Download className={UPLOAD_DESIGN.template.icon} />
                    <span className={UPLOAD_DESIGN.template.text}>
                      {isDownloadingTemplate ? "Downloading..." : "Download Template"}
                    </span>
                  </button>
                  <span className="text-xs text-gray-500">
                    {selectedCluster
                      ? "Download template for selected cluster"
                      : selectedLocation
                      ? "Download template for selected location"
                      : "Select location to continue"}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="payment-date">Payment Date</Label>
                <Input
                  id="payment-date"
                  type="date"
                  value={uploadData.payment_date}
                  onChange={(e) =>
                    setUploadData({ ...uploadData, payment_date: e.target.value })
                  }
                  disabled={isUploading}
                />
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
                  disabled={isUploading}
                />
              </div>
            </div>

            {/* Drag & Drop Zone */}
            <div>
              <Label>Upload Filled Template</Label>
              <div
                className={dropZoneClasses.join(" ")}
                style={{ minHeight: UPLOAD_DESIGN.dropZone.height }}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => !uploadData.file && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />

                {!uploadData.file ? (
                  <>
                    <Upload className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Drag and drop your filled Excel file here
                    </p>
                    <p className="text-xs text-gray-500 mb-4">or</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className={UPLOAD_DESIGN.buttons.secondary}
                      disabled={isUploading}
                    >
                      Browse Files
                    </button>
                    <p className="text-xs text-gray-500 mt-4">
                      Accepted formats: .xlsx, .xls • Max size: 10MB
                    </p>
                  </>
                ) : (
                  <div className={UPLOAD_DESIGN.fileDisplay.container}>
                    <FileSpreadsheet className={UPLOAD_DESIGN.fileDisplay.icon} />
                    <div className="flex-1">
                      <p className={UPLOAD_DESIGN.fileDisplay.name}>
                        {uploadData.file.name}
                      </p>
                      <p className={UPLOAD_DESIGN.fileDisplay.size}>
                        {formatFileSize(uploadData.file.size)}
                      </p>
                    </div>
                    {!isUploading && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReset();
                        }}
                        className={UPLOAD_DESIGN.fileDisplay.removeButton}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Progress Indicator */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-600">Uploading and processing...</span>
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                </div>
                <div className={UPLOAD_DESIGN.progressBar.containerClass}>
                  <div
                    className={`${UPLOAD_DESIGN.progressBar.colors.fill} h-full ${UPLOAD_DESIGN.progressBar.animation}`}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            )}

            {/* Success Message */}
            {uploadComplete && isSuccess && (
              <div className={UPLOAD_DESIGN.success.container}>
                <div className="flex items-start space-x-3">
                  <CheckCircle className={UPLOAD_DESIGN.success.icon} />
                  <div>
                    <p className={UPLOAD_DESIGN.success.title}>Upload Successful!</p>
                    <p className={UPLOAD_DESIGN.success.text}>
                      Bulk payment request has been created successfully. Redirecting...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className={UPLOAD_DESIGN.errors.container}>
                <div className="flex items-start space-x-2">
                  <AlertCircle className={UPLOAD_DESIGN.errors.icon} />
                  <div>
                    <p className={UPLOAD_DESIGN.errors.title}>Upload Failed</p>
                    <p className="text-sm text-red-700 mt-1">
                      {typeof error === 'string' ? error : 'Failed to create bulk payment. Please check the file and try again.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3">
              {uploadComplete && (
                <button
                  type="button"
                  onClick={handleReset}
                  className={UPLOAD_DESIGN.buttons.secondary}
                >
                  Upload Another File
                </button>
              )}

              {!uploadComplete && uploadData.file && !isUploading && (
                <>
                  <button
                    type="button"
                    onClick={handleReset}
                    className={UPLOAD_DESIGN.buttons.secondary}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpload}
                    className={UPLOAD_DESIGN.buttons.primary}
                    disabled={!uploadData.payment_date || !uploadData.payment_reason}
                  >
                    Upload & Create Bulk Payment Request
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <Card>
        <div className="p-6 bg-blue-50">
          <h4 className="font-semibold mb-2">Quick Guide</h4>
          <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
            <li>Select a location (state) from the dropdown - this is required</li>
            <li>If the location has clusters, select the specific cluster you're uploading for</li>
            <li>If the location has no clusters, proceed without cluster selection</li>
            <li>Click "Download Template" to get the Excel file with staff data for your selected location/cluster</li>
            <li>Open the Excel file and fill in: Days for This Payment, Payment Period Start/End dates</li>
            <li>Verify deduction amounts (pre-filled from system defaults) and save the file</li>
            <li>Enter payment date and reason in the fields above</li>
            <li>Drag and drop the filled Excel file or browse to upload</li>
            <li>Click "Upload & Create Bulk Payment Request" to submit</li>
          </ol>
        </div>
      </Card>
    </div>
  );
}
