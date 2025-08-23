"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import FormInput from "@/components/FormInput";
import FormTextArea from "@/components/FormTextArea";
import UploadIcon from "@/components/icons/UploadIcon";
// import Upload from "@/components/shared/Upload"; // Component not found
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

interface DocumentUploadModalProps {
  onClose?: () => void;
  onUpload?: (file: File, data: any) => void;
}

export default function DocumentUploadModal({ onClose, onUpload }: DocumentUploadModalProps) {
  const [file, setFile] = useState<File>();
  const [error, setError] = useState("");

  const form = useForm();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleSubmit = (data: any) => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    onUpload?.(file, data);
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
          <Upload onChange={handleChange} multiple={false}>
            <Button variant="outline" className="w-full" size="lg" type="button">
              <UploadIcon />
              Select Document
            </Button>
          </Upload>
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
          <Button type="submit">
            Upload
          </Button>
        </div>
      </form>
    </Form>
  );
}