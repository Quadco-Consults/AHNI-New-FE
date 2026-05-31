"use client";

import { useState, useRef, DragEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BackNavigation from "@/components/atoms/BackNavigation";
import { Upload, FileText, CheckCircle, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { AdminRoutes } from "@/constants/RouterConstants";
import { UPLOAD_DESIGN } from "@/components/uploads/design-tokens";
import {
  useGetSinglePaymentRequest,
  useUploadPaymentDocument,
} from "@/features/admin/controllers/paymentRequestController";
import { LoadingSpinner } from "@/components/Loading";

export default function UploadPaymentDocument() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  // Fetch payment request details
  const { data: paymentRequestData, isLoading: isLoadingRequest } =
    useGetSinglePaymentRequest(id, !!id);

  // Upload hook
  const { uploadDocument, isLoading: isUploading, isSuccess, error } =
    useUploadPaymentDocument(id);

  // Handle successful upload
  useEffect(() => {
    if (isSuccess) {
      setUploadComplete(true);
      toast.success("Document uploaded successfully!");

      // Redirect to payment request detail page after delay
      const timer = setTimeout(() => {
        router.push(`${AdminRoutes.PAYMENT_REQUEST}/${id}`);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, id, router]);

  // Handle file selection
  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedExtensions = [
      ".pdf",
      ".jpg",
      ".jpeg",
      ".png",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
    ];
    const fileExtension =
      "." + file.name.split(".").pop()?.toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      toast.error(
        `Invalid file format. Allowed: ${allowedExtensions.join(", ")}`
      );
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size exceeds 10MB limit");
      return;
    }

    setSelectedFile(file);
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    try {
      await uploadDocument(selectedFile);
    } catch (err) {
      toast.error("Failed to upload document. Please try again.");
    }
  };

  // Handle skip
  const handleSkip = () => {
    router.push(`${AdminRoutes.PAYMENT_REQUEST}/${id}`);
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
    "flex flex-col items-center justify-center p-8 transition-all duration-200 cursor-pointer min-h-[300px]",
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

  if (isLoadingRequest) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <BackNavigation />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Upload Supporting Document
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Upload invoices, receipts, or other supporting documents for this payment request
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Payment Request Details
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Request ID: {id}
              </p>
            </div>
            {paymentRequestData?.data && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Payment Type</p>
                <p className="font-medium text-gray-900">
                  {paymentRequestData.data.payment_type_display}
                </p>
              </div>
            )}
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div
            className={dropZoneClasses.join(" ")}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
            />

            {selectedFile ? (
              <div className="text-center">
                <FileText className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {formatFileSize(selectedFile.size)}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop your file here, or click to browse
                </p>
                <p className="text-sm text-gray-600">
                  Supported formats: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Maximum file size: 10MB
                </p>
              </div>
            )}

            {uploadComplete && (
              <div className="mt-4 flex items-center justify-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">Document uploaded successfully!</span>
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-center justify-center text-red-600">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">Upload failed. Please try again.</span>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handleSkip}
              disabled={isUploading}
            >
              Skip for Now
            </Button>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading || uploadComplete}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUploading ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You can skip this step and upload documents later
              from the payment request detail page.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
