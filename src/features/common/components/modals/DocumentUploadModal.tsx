"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import FormInput from "@/components/FormInput";
import FormTextArea from "@/components/FormTextArea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import useApiManager from "@/constants/mainController";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/useStore";
import { closeDialog } from "@/store/ui";
import { Upload as UploadFile, FileText, X } from "lucide-react";

interface DocumentUploadModalProps {
  onClose?: () => void;
  onUpload?: (files: File[], data: any) => void;
}

export default function DocumentUploadModal({ onClose, onUpload }: DocumentUploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const params = useParams();
  const dispatch = useAppDispatch();

  const form = useForm();

  // Check for agreement ID from params or query string
  let agreementId = params.id;

  // If no ID in params, check query string or session storage
  if (!agreementId && typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    agreementId = urlParams.get('id') || sessionStorage.getItem('agreementId');
  }

  console.log("Agreement ID:", agreementId);

  // Agreement document upload API - only initialize if we have an ID
  const { callApi, isLoading } = useApiManager<any, Error, FormData>({
    endpoint: agreementId ? `/contract-grants/agreements/${agreementId}/upload_document/` : '',
    queryKey: ["agreement-documents"],
    isAuth: true,
    method: "POST",
    contentType: "multipart/form-data",
  });

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB (server limit)
  const MAX_FILES = 10;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (files.length + selectedFiles.length > MAX_FILES) {
      toast.error(`You can only upload up to ${MAX_FILES} files at once`);
      return;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    selectedFiles.forEach((file) => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        errors.push(`${file.name} is too large (${fileSizeMB}MB). Max: 5MB`);
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} file(s) selected`);
    }

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
    }

    // Clear input
    event.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    toast.success("File removed");
  };

  const handleSubmit = async (data: any) => {
    console.log("handleSubmit called with data:", data);
    console.log("Current files:", files);
    console.log("Agreement ID:", agreementId);

    if (files.length === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }

    if (!agreementId) {
      // If no agreement ID, store documents temporarily in session storage
      const tempDocuments = files.map((file, index) => ({
        file: file,
        title: files.length === 1 ? data.name : `${data.name} - ${file.name}`,
        description: data.description,
        document_type: "contract",
        timestamp: Date.now() + index
      }));

      // Store in session storage for later upload
      const existingDocs = JSON.parse(sessionStorage.getItem('tempAgreementDocuments') || '[]');
      const allDocs = [...existingDocs, ...tempDocuments];
      sessionStorage.setItem('tempAgreementDocuments', JSON.stringify(allDocs));

      toast.success(`${files.length} document(s) prepared for upload!`);

      // Call the onUpload callback if provided
      onUpload?.(files, data);

      // Close the modal
      onClose?.() || dispatch(closeDialog());
      return;
    }

    setIsUploading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      // Upload each file separately
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();

        // Use file name as title if multiple files
        const fileTitle = files.length === 1 ? data.name : `${data.name} - ${file.name}`;

        formData.append("file", file);
        formData.append("title", fileTitle);
        if (data.description) {
          formData.append("description", data.description);
        }
        formData.append("document_type", "contract");

        try {
          console.log(`Uploading document ${i + 1}/${files.length}...`);
          await callApi(formData);
          successCount++;
          toast.success(`${file.name} uploaded (${i + 1}/${files.length})`);
        } catch (error) {
          errorCount++;
          console.error(`Failed to upload ${file.name}:`, error);
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      // Summary notification
      if (successCount > 0) {
        toast.success(`✅ Successfully uploaded ${successCount} of ${files.length} document(s)`);
      }

      if (errorCount > 0) {
        toast.error(`❌ Failed to upload ${errorCount} document(s)`);
      }

      // Call the onUpload callback if provided
      if (successCount > 0) {
        onUpload?.(files, data);
      }

      // Close modal if at least one file was uploaded successfully
      if (successCount > 0) {
        onClose?.() || dispatch(closeDialog());
      }

    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload documents. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormInput
          label="Document Name"
          name="name"
          placeholder={files.length > 1 ? 'Base name (file names will be appended)' : 'Enter Name'}
          required
        />

        <FormTextArea
          label="Document Description"
          name="description"
          placeholder="Enter Description"
        />

        {/* File Upload Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">
            Upload Files <span className="text-red-500">*</span>
          </label>

          {/* Upload Area */}
          <div className='w-full relative border-2 border-dashed rounded-lg hover:border-blue-500 transition-colors'>
            <input
              type='file'
              id="document-file-upload"
              multiple
              onChange={handleFileChange}
              className='hidden'
              accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
            />
            <label htmlFor="document-file-upload" className="cursor-pointer">
              <div className='flex items-center justify-center gap-3 h-[120px] px-4 py-6'>
                <div className="text-center space-y-2">
                  <div className="flex justify-center">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                      <UploadFile className="text-blue-600" size={24} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Max {MAX_FILES} files • 5MB per file
                    </p>
                    <p className="text-xs text-gray-400">
                      PDF, Images, Word, Excel, Text
                    </p>
                  </div>
                </div>
              </div>
            </label>
          </div>

          {/* Selected Files List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Selected Files ({files.length}/{MAX_FILES})
              </p>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-400 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <FileText className="text-blue-600" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeFile(index)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onClose?.() || dispatch(closeDialog())}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || isUploading || files.length === 0}
          >
            {isUploading
              ? "Uploading..."
              : isLoading
              ? "Processing..."
              : files.length > 1
              ? `Upload ${files.length} Files`
              : "Upload"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
