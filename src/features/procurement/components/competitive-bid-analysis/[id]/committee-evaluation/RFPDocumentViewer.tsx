"use client";

import { useState } from "react";
import { Download, CheckCircle, File } from 'lucide-react';
import { Icon } from "@iconify/react";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";

interface RFPDocument {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  uploaded_at: string;
}

interface RFPSubmission {
  id: string;
  vendor: {
    id: string;
    name: string;
  };
  technical_documents: RFPDocument[];
  commercial_documents: RFPDocument[];
  evaluations?: Array<{
    id: string;
    response: string;
    evaluation_criteria: string;
  }>;
  created_at: string;
}

interface RFPDocumentViewerProps {
  submission: RFPSubmission;
  onEvaluate?: (vendorId: string) => void;
  showEvaluateButton?: boolean;
}

const RFPDocumentViewer = ({
  submission,
  onEvaluate,
  showEvaluateButton = true
}: RFPDocumentViewerProps) => {
  const [activeTab, setActiveTab] = useState("technical");

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadDocument = (document: RFPDocument) => {
    window.open(document.file_url, '_blank');
  };

  const viewDocument = (document: RFPDocument) => {
    // Open in new tab for viewing
    window.open(document.file_url, '_blank');
  };

  return (
    <Card className="p-6">
      {/* Vendor Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{submission.vendor.name}</h3>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
            <span>
              Technical: {submission.technical_documents.length} documents
            </span>
            <span>
              Commercial: {submission.commercial_documents.length} documents
            </span>
            <span>
              Submitted: {new Date(submission.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {showEvaluateButton && (
          <Button
            onClick={() => onEvaluate?.(submission.vendor.id)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <BarChart size={16} />
            Evaluate Vendor
          </Button>
        )}
      </div>

      {/* Document Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="technical">
            Technical Documents ({submission.technical_documents.length})
          </TabsTrigger>
          <TabsTrigger value="commercial">
            Commercial Documents ({submission.commercial_documents.length})
          </TabsTrigger>
          <TabsTrigger value="evaluations">
            Evaluation Responses ({submission.evaluations?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Technical Documents */}
        <TabsContent value="technical" className="space-y-4">
          {submission.technical_documents.length > 0 ? (
            <div className="space-y-3">
              {submission.technical_documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      icon="vscode-icons:file-type-pdf2"
                      className="w-8 h-8"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{doc.file_name}</div>
                      <div className="text-sm text-gray-600">
                        {formatFileSize(doc.file_size)} • Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewDocument(doc)}
                    >
                      <Eye size={16} />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadDocument(doc)}
                    >
                      <Download size={16} />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <File size={16} />
              No technical documents submitted
            </div>
          )}
        </TabsContent>

        {/* Commercial Documents */}
        <TabsContent value="commercial" className="space-y-4">
          {submission.commercial_documents.length > 0 ? (
            <div className="space-y-3">
              {submission.commercial_documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      icon="vscode-icons:file-type-pdf2"
                      className="w-8 h-8"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{doc.file_name}</div>
                      <div className="text-sm text-gray-600">
                        {formatFileSize(doc.file_size)} • Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewDocument(doc)}
                    >
                      <Eye size={16} />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadDocument(doc)}
                    >
                      <Download size={16} />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <File size={16} />
              No commercial documents submitted
            </div>
          )}
        </TabsContent>

        {/* Evaluation Responses */}
        <TabsContent value="evaluations" className="space-y-4">
          {submission.evaluations && submission.evaluations.length > 0 ? (
            <div className="space-y-4">
              {submission.evaluations.map((evaluation) => (
                <div key={evaluation.id} className="p-4 border rounded-lg">
                  <div className="font-medium text-gray-900 mb-2">
                    Evaluation Criteria Response
                  </div>
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {evaluation.response}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ClipboardList size={16} />
              No evaluation responses provided
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <strong>Submission ID:</strong> {submission.id.slice(0, 8)}...
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="success" className="text-xs">
              <CheckCircle size={16} />
              Submitted
            </Badge>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Download all documents as ZIP (future feature)
                console.log("Download all documents for", submission.vendor.name);
              }}
            >
              <Download size={16} />
              Download All
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RFPDocumentViewer;