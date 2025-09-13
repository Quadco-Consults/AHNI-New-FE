"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import FormInput from "@/components/FormInput";
import FormTextArea from "@/components/FormTextArea";
import UploadIcon from "@/components/icons/UploadIcon";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import useApiManager from "@/constants/mainController";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { closeDialog } from "store/ui";

interface DocumentUploadModalProps {
  onClose?: () => void;
  onUpload?: (file: File, data: any) => void;
}

export default function DocumentUploadModal({ onClose, onUpload }: DocumentUploadModalProps) {
  const [file, setFile] = useState<File>();
  const [error, setError] = useState("");
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input changed", e.target.files);
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError("");
      console.log("File selected:", e.target.files[0].name);
    }
  };

  const handleSubmit = async (data: any) => {
    console.log("handleSubmit called with data:", data);
    console.log("Current file:", file);
    console.log("Agreement ID:", agreementId);
    
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    if (!agreementId) {
      // If no agreement ID, store document temporarily in session storage
      // This is for the creation flow where agreement doesn't exist yet
      const tempDocument = {
        file: file,
        title: data.name,
        description: data.description,
        document_type: "contract",
        timestamp: Date.now()
      };
      
      // Store in session storage for later upload
      const tempDocs = JSON.parse(sessionStorage.getItem('tempAgreementDocuments') || '[]');
      tempDocs.push(tempDocument);
      sessionStorage.setItem('tempAgreementDocuments', JSON.stringify(tempDocs));
      
      toast.success("Document prepared for upload! It will be uploaded when the agreement is created.");
      
      // Call the onUpload callback if provided
      onUpload?.(file, data);
      
      // Close the modal
      onClose?.() || dispatch(closeDialog());
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", data.name);
      if (data.description) {
        formData.append("description", data.description);
      }
      // Add default document_type if not provided
      formData.append("document_type", "contract");

      console.log("Uploading document...");
      await callApi(formData);
      
      toast.success("Document uploaded successfully!");
      
      // Call the onUpload callback if provided
      onUpload?.(file, data);
      
      // Close the modal
      onClose?.() || dispatch(closeDialog());
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload document. Please try again.");
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
          placeholder="Enter Name"
          required
        />

        <FormTextArea
          label="Document Description"
          name="description"
          placeholder="Enter Description"
        />

        <div className="space-y-2">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleChange}
          />
          <label 
            htmlFor="file-upload" 
            className="block w-full"
          >
            <div className="flex items-center justify-center gap-2 w-full h-10 px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
              <UploadIcon />
              Select Document
            </div>
          </label>
          {file && (
            <p className="text-sm text-gray-600">
              Selected: {file.name}
            </p>
          )}
          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </form>
    </Form>
  );
}