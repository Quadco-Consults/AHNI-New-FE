"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Eye, FileText, Image as ImageIcon, File as FileIcon, Download } from "lucide-react";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  uploaded: boolean;
}

interface EnhancedFileUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string[];
  showPreview?: boolean;
  existingFiles?: { id: string; name: string; url: string; size?: number }[];
}

export default function EnhancedFileUpload({
  onFilesChange,
  maxFiles = 10,
  maxFileSize = 10, // 10MB default
  acceptedFileTypes = ["image/*", "application/pdf", ".doc", ".docx", ".xls", ".xlsx"],
  showPreview = true,
  existingFiles = [],
}: EnhancedFileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [previewFile, setPreviewFile] = useState<{ file?: File; url?: string; name: string; type: string } | null>(null);

  const MAX_SIZE_BYTES = maxFileSize * 1024 * 1024;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (uploadedFiles.length + files.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} files at once`);
      return;
    }

    const validFiles: UploadedFile[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      // Check file size
      if (file.size > MAX_SIZE_BYTES) {
        errors.push(`${file.name} is too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Max: ${maxFileSize}MB`);
        return;
      }

      // Create preview for images
      const fileWithPreview: UploadedFile = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        uploaded: false,
      };

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          fileWithPreview.preview = reader.result as string;
          setUploadedFiles((prev) => [...prev, fileWithPreview]);
        };
        reader.readAsDataURL(file);
      } else {
        validFiles.push(fileWithPreview);
      }
    });

    if (validFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...validFiles]);
    }

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
    }

    // Notify parent
    const allFiles = [...uploadedFiles.map((f) => f.file), ...validFiles.map((f) => f.file)];
    onFilesChange(allFiles);

    // Clear input
    event.target.value = "";
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      onFilesChange(updated.map((f) => f.file));
      return updated;
    });
    toast.success("File removed");
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")) {
      return <ImageIcon className="text-blue-500" size={24} />;
    }
    if (extension === "pdf") {
      return <FileText className="text-red-500" size={24} />;
    }
    return <FileIcon className="text-gray-500" size={24} />;
  };

  const handlePreview = (file: File) => {
    const fileType = file.type;
    const fileName = file.name;

    if (fileType.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewFile({ url: reader.result as string, name: fileName, type: "image" });
      };
      reader.readAsDataURL(file);
    } else if (fileType === "application/pdf") {
      const url = URL.createObjectURL(file);
      setPreviewFile({ url, name: fileName, type: "pdf" });
    } else {
      toast.info("Preview not available for this file type");
    }
  };

  const handlePreviewExisting = (fileUrl: string, fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")) {
      setPreviewFile({ url: fileUrl, name: fileName, type: "image" });
    } else if (extension === "pdf") {
      setPreviewFile({ url: fileUrl, name: fileName, type: "pdf" });
    } else {
      toast.info("Preview not available for this file type");
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center gap-3">
        <input
          type="file"
          id="enhanced-file-upload"
          multiple
          accept={acceptedFileTypes.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />
        <label htmlFor="enhanced-file-upload">
          <Button type="button" asChild>
            <span className="cursor-pointer">
              <FileIcon className="mr-2" size={16} />
              Select Files ({uploadedFiles.length}/{maxFiles})
            </span>
          </Button>
        </label>
        <p className="text-xs text-gray-500">
          Max {maxFiles} files, {maxFileSize}MB each
        </p>
      </div>

      {/* Existing Files */}
      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">Existing Files</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {existingFiles.map((existing) => (
              <div
                key={existing.id}
                className="flex items-center gap-3 p-3 border rounded-lg bg-green-50 border-green-200"
              >
                {getFileIcon(existing.name)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{existing.name}</p>
                  {existing.size && (
                    <p className="text-xs text-gray-500">
                      {(existing.size / (1024 * 1024)).toFixed(2)}MB
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  {showPreview && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePreviewExisting(existing.url, existing.name)}
                    >
                      <Eye size={16} />
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(existing.url, "_blank")}
                  >
                    <Download size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">New Files to Upload</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {uploadedFiles.map((fileItem) => (
              <div
                key={fileItem.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:border-blue-400 transition-colors"
              >
                {fileItem.preview ? (
                  <img
                    src={fileItem.preview}
                    alt={fileItem.file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  getFileIcon(fileItem.file.name)
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{fileItem.file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(fileItem.file.size / (1024 * 1024)).toFixed(2)}MB
                  </p>
                </div>
                <div className="flex gap-1">
                  {showPreview && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePreview(fileItem.file)}
                    >
                      <Eye size={16} />
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeFile(fileItem.id)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Preview: {previewFile?.name}</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto max-h-[70vh]">
            {previewFile?.type === "image" && (
              <img
                src={previewFile.url}
                alt={previewFile.name}
                className="w-full h-auto"
              />
            )}
            {previewFile?.type === "pdf" && (
              <iframe
                src={previewFile.url}
                className="w-full h-[600px] border-0"
                title={previewFile.name}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
