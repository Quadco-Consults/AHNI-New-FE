"use client";

import DeleteIcon from "@/components/icons/DeleteIcon";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";
import {
  Image,
  FileSpreadsheet,
  FileText,
  FileImage,
  Eye,
  X
} from "lucide-react";
import { getFileExtension } from "@/utils/get-file-extension";
import Link from "next/link";
import ConfirmationDialog from "./ConfirmationDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import ConfirmationDialog from "@/components/ConfirmationDialog";

const FILE_TYPE_ICONS = {
  png: Image,

  jpeg: FileImage,
  jpg: FileImage,
  svg: FileImage,

  pdf: FileText,
  doc: FileText,
  docx: FileText,

  csv: FileSpreadsheet,
  xls: FileSpreadsheet,
  xlsx: FileSpreadsheet,
};

type TProps = {
  id?: string;
  file: string;
  name: string;
  documentType?: string;
  showDeleteIcon?: boolean;
  timestamp: string;
  isLoading?: boolean;
  onDeleteDocument?: (id: string) => void;
};

export default function FilePreview({
  id,
  file,
  name,
  documentType,
  timestamp,
  showDeleteIcon,
  isLoading,
  onDeleteDocument,
}: TProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isPreviewOpen, setPreviewOpen] = useState(false);

  const type = getFileExtension(file);

  const Icon = FILE_TYPE_ICONS[type as keyof typeof FILE_TYPE_ICONS];

  const onDelete = () => {
    if (onDeleteDocument) {
      onDeleteDocument(id ?? "");
      setDialogOpen(false);
    }
  };

  // Get file name from URL
  const getFileName = () => {
    try {
      const url = new URL(file);
      const pathname = url.pathname;
      const fileName = pathname.substring(pathname.lastIndexOf('/') + 1);
      return decodeURIComponent(fileName);
    } catch {
      return file.substring(file.lastIndexOf('/') + 1);
    }
  };

  // Check if file is an image
  const isImage = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(type?.toLowerCase() || '');

  // Check if file is a PDF
  const isPDF = type?.toLowerCase() === 'pdf';

  return (
    <>
      <div className='border space-y-4 rounded-2xl p-5 w-full overflow-hidden h-fit '>
        <div className='flex items-center justify-between gap-2 mb-2'>
          <div className='flex-1 min-w-0'>
            {/* Document Type - Main Title */}
            {documentType && (
              <h2 className='font-bold text-base line-clamp-1 text-gray-900'>{documentType}</h2>
            )}

            {/* Custom Title - More Prominent */}
            {name && (
              <p className='text-sm text-gray-800 line-clamp-1 mt-1 font-semibold'>{name}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type='button'
              onClick={() => setPreviewOpen(true)}
              variant='outline'
              size='icon'
              title="Preview document"
            >
              <Eye className="w-4 h-4" />
            </Button>

            {showDeleteIcon && (
              <Button
                type='button'
                onClick={() => setDialogOpen(true)}
                variant='outline'
                size='icon'
                title="Delete document"
              >
                <DeleteIcon />
              </Button>
            )}
          </div>
        </div>
        <Link href={file} target='_blank' title={getFileName()}>
          <div className='bg-black/10 py-2 w-full h-56 rounded-2xl flex items-center justify-center overflow-hidden'>
            {Icon && <Icon size={100} />}
          </div>
        </Link>
        <div className="space-y-1">
          <h6 className='text-xs text-gray-600 line-clamp-1' title={getFileName()}>
            File: <span className="font-medium">{getFileName()}</span>
          </h6>
          <h6 className='text-xs text-gray-600'>
            Created: <span className="font-medium">{format(timestamp, "MMM dd, yyyy")}</span>
          </h6>
        </div>
      </div>

      <ConfirmationDialog
        open={isDialogOpen}
        title='Are you sure you want to delete this file?'
        onCancel={() => setDialogOpen(false)}
        onOk={onDelete}
        loading={isLoading}
      />

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="truncate pr-4">Preview: {getFileName()}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPreviewOpen(false)}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {isImage ? (
              <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
                <img
                  src={file}
                  alt={name}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              </div>
            ) : isPDF ? (
              <iframe
                src={file}
                className="w-full h-[70vh] border-0 rounded-lg"
                title={name}
              />
            ) : (
              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8 space-y-4">
                {Icon && <Icon size={80} className="text-gray-400" />}
                <p className="text-gray-600">Preview not available for this file type</p>
                <Button asChild>
                  <a href={file} target="_blank" rel="noopener noreferrer" download>
                    Download File
                  </a>
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
