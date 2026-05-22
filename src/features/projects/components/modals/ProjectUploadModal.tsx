"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Upload as UploadFile, FileText, X } from "lucide-react";
import { toast } from "sonner";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { zodResolver } from "@hookform/resolvers/zod";
import { closeDialog } from "@/store/ui";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import {
  ProjectDocumentSchema,
  TProjectDocumentFormValues,
} from "@/features/projects/types/project/document";
import { useCreateProjectDocument } from "../../controllers";
import { useGetAllDocumentTypes } from "@/features/modules/controllers";

const ProjectUploadModal = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const dispatch = useAppDispatch();
  const { createProjectDocument, isLoading } = useCreateProjectDocument();

  const { data: documentTypes } = useGetAllDocumentTypes({
    page: 1,
    size: 2000000,
  });

  const documentTypeOptions = documentTypes?.data.results.map((doc) => ({
    label: doc.name,
    value: doc.id,
  }));

  const form = useForm<TProjectDocumentFormValues>({
    resolver: zodResolver(ProjectDocumentSchema),
    defaultValues: {
      title: "",
      document_type: "",
      file: "",
    },
  });

  const { dialogProps } = useAppSelector((state) => state.ui.dailog);
  const projectId = dialogProps?.projectId as string;

  const { handleSubmit, setValue } = form;

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB (server limit)
  const MAX_FILES = 5;

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
      setValue("file", "selected");
      toast.success(`${validFiles.length} file(s) selected`);
    }

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
    }

    // Clear input
    event.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) {
        setValue("file", "");
      }
      return updated;
    });
    toast.success("File removed");
  };

  const onSubmit: SubmitHandler<TProjectDocumentFormValues> = async (data) => {
    if (files.length === 0) {
      toast.error("Please select at least one file to upload");
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

        // Use file name as title if multiple files, or use the entered title for single file
        const fileTitle = files.length === 1 ? data.title : `${data.title} - ${file.name}`;

        formData.append("title", fileTitle);
        formData.append("file", file);
        formData.append("document_type", data.document_type);
        formData.append("project", projectId);

        try {
          await createProjectDocument(formData);
          successCount++;
          toast.success(`${file.name} uploaded (${i + 1}/${files.length})`);
        } catch (error: any) {
          errorCount++;
          console.error(`Failed to upload ${file.name}:`, error);
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      // Summary notification
      if (successCount > 0) {
        toast.success(`✅ Successfully uploaded ${successCount} of ${files.length} document(s)`);
        dispatch(closeDialog());
        // Reload to show new documents
        window.location.reload();
      }

      if (errorCount > 0) {
        toast.error(`❌ Failed to upload ${errorCount} document(s)`);
      }
    } catch (error: any) {
      toast.error(error?.message ?? "Something went wrong");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='w-full'>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          {/* Title */}
          <FormInput
            name='title'
            label='Document Title'
            placeholder={files.length > 1 ? 'Base title (file names will be appended)' : 'Enter Document Title'}
            required
          />

          {/* Document Type */}
          <FormSelect
            label='Document Type'
            name='document_type'
            placeholder='Select Document Type'
            required
            options={documentTypeOptions}
          />

          {/* File Upload Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Upload Files <span className="text-red-500">*</span>
            </label>

            {/* Upload Button */}
            <div className='w-full relative border-2 border-dashed rounded-lg hover:border-blue-500 transition-colors'>
              <input
                type='file'
                id="file-upload"
                multiple
                onChange={handleFileChange}
                className='hidden'
                accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
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

            <FormInput type='hidden' name='file' />
          </div>

          {/* Action Buttons */}
          <div className='flex justify-between gap-3 mt-4 pt-4 border-t'>
            <Button
              type='button'
              variant="outline"
              onClick={() => dispatch(closeDialog())}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <FormButton
              loading={isLoading || isUploading}
              disabled={isLoading || isUploading || files.length === 0}
              type='submit'
            >
              {isUploading
                ? "Uploading..."
                : files.length > 1
                ? `Upload ${files.length} Files`
                : "Upload"}
            </FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProjectUploadModal;
