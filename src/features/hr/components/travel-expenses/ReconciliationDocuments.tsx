"use client";

import React from "react";
import { format } from "date-fns";
import { FileText, Download, Eye, Calendar, User, FileX } from "lucide-react";

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Types
import { IReconciliationDocument, ITravelReconciliation } from "@/features/admin/types/travel-expense";

interface ReconciliationDocumentsProps {
  reconciliation: ITravelReconciliation;
  className?: string;
}

const ReconciliationDocuments: React.FC<ReconciliationDocumentsProps> = ({
  reconciliation,
  className = "",
}) => {
  // Get document type badge
  const getDocumentTypeBadge = (type: string) => {
    const badges = {
      INVOICE: <Badge className="bg-red-100 text-red-800">Invoice</Badge>,
      RECEIPT: <Badge className="bg-orange-100 text-orange-800">Receipt</Badge>,
      BANK_STATEMENT: <Badge className="bg-blue-100 text-blue-800">Bank Statement</Badge>,
      OTHER: <Badge className="bg-gray-100 text-gray-800">Other</Badge>,
    };
    return badges[type as keyof typeof badges] || <Badge variant="outline">{type}</Badge>;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle document download
  const handleDownload = (document: IReconciliationDocument) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = document.document_url;
    link.download = document.document_name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle document preview
  const handlePreview = (document: IReconciliationDocument) => {
    // Open document in new tab for preview
    window.open(document.document_url, '_blank');
  };

  // Combine all documents
  const allDocuments: IReconciliationDocument[] = [
    ...(reconciliation.supporting_documents || []),
    ...(reconciliation.reimbursement_invoice ? [reconciliation.reimbursement_invoice] : []),
    ...(reconciliation.retirement_receipt ? [reconciliation.retirement_receipt] : []),
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-lg">Reconciliation Documents</h4>
        <Badge variant="outline" className="text-xs">
          {allDocuments.length} document{allDocuments.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {allDocuments.length > 0 ? (
        <div className="space-y-3">
          {/* Key Documents Section */}
          {(reconciliation.reimbursement_invoice || reconciliation.retirement_receipt) && (
            <div>
              <h5 className="font-medium text-sm text-gray-700 mb-2">Key Documents</h5>
              <div className="space-y-2">
                {reconciliation.reimbursement_invoice && (
                  <DocumentCard
                    document={reconciliation.reimbursement_invoice}
                    isKeyDocument={true}
                    onDownload={handleDownload}
                    onPreview={handlePreview}
                  />
                )}
                {reconciliation.retirement_receipt && (
                  <DocumentCard
                    document={reconciliation.retirement_receipt}
                    isKeyDocument={true}
                    onDownload={handleDownload}
                    onPreview={handlePreview}
                  />
                )}
              </div>
            </div>
          )}

          {/* Supporting Documents Section */}
          {reconciliation.supporting_documents && reconciliation.supporting_documents.length > 0 && (
            <div>
              <h5 className="font-medium text-sm text-gray-700 mb-2">Supporting Documents</h5>
              <div className="space-y-2">
                {reconciliation.supporting_documents.map((document) => (
                  <DocumentCard
                    key={document.id}
                    document={document}
                    isKeyDocument={false}
                    onDownload={handleDownload}
                    onPreview={handlePreview}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Document Summary */}
          <div className="bg-gray-50 border rounded-lg p-3">
            <div className="text-sm text-gray-600">
              <div className="flex justify-between items-center">
                <span>Total documents:</span>
                <span className="font-medium">{allDocuments.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total size:</span>
                <span className="font-medium">
                  {formatFileSize(allDocuments.reduce((sum, doc) => sum + doc.file_size, 0))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Last uploaded:</span>
                <span className="font-medium">
                  {allDocuments.length > 0
                    ? format(
                        new Date(
                          Math.max(...allDocuments.map(d => new Date(d.uploaded_datetime).getTime()))
                        ),
                        "MMM dd, yyyy"
                      )
                    : "N/A"
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Alert>
          <FileX className="h-4 w-4" />
          <AlertDescription>
            No documents have been uploaded for this reconciliation yet.
            {(reconciliation.requires_invoice || reconciliation.requires_receipt) && (
              <div className="mt-2 text-sm">
                <strong>Required documents:</strong>
                {reconciliation.requires_invoice && " Invoice/Receipt for reimbursement"}
                {reconciliation.requires_receipt && " Receipt for fund retirement"}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

// Document Card Component
const DocumentCard: React.FC<{
  document: IReconciliationDocument;
  isKeyDocument: boolean;
  onDownload: (doc: IReconciliationDocument) => void;
  onPreview: (doc: IReconciliationDocument) => void;
}> = ({ document, isKeyDocument, onDownload, onPreview }) => {
  const getDocumentTypeBadge = (type: string) => {
    const badges = {
      INVOICE: <Badge className="bg-red-100 text-red-800">Invoice</Badge>,
      RECEIPT: <Badge className="bg-orange-100 text-orange-800">Receipt</Badge>,
      BANK_STATEMENT: <Badge className="bg-blue-100 text-blue-800">Bank Statement</Badge>,
      OTHER: <Badge className="bg-gray-100 text-gray-800">Other</Badge>,
    };
    return badges[type as keyof typeof badges] || <Badge variant="outline">{type}</Badge>;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`border rounded-lg p-3 ${isKeyDocument ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-4 w-4 text-gray-600" />
            <span className="font-medium text-sm truncate">{document.document_name}</span>
            {getDocumentTypeBadge(document.document_type)}
            {isKeyDocument && (
              <Badge className="bg-blue-100 text-blue-800 text-xs">Key</Badge>
            )}
          </div>

          {document.description && (
            <p className="text-xs text-gray-600 mb-2">{document.description}</p>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(document.uploaded_datetime), "MMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{document.uploaded_by}</span>
            </div>
            <span>{formatFileSize(document.file_size)}</span>
          </div>
        </div>

        <div className="flex gap-1 ml-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onPreview(document)}
            className="h-7 px-2"
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDownload(document)}
            className="h-7 px-2"
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReconciliationDocuments;