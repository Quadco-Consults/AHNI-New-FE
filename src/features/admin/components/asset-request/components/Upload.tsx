"use client";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Separator } from "components/ui/separator";
import { useSearchParams } from "next/navigation";
import { useGetSingleAssetRequestQuery, useGetAssetRequestDocuments } from "@/features/admin/controllers/assetRequestController";
import { FileText, Download, Eye } from "lucide-react";
import { Button } from "components/ui/button";
import { Loading } from "components/Loading";

export default function Upload() {
  const searchParams = useSearchParams();
  const id = searchParams!.get("id");

  const { data: assetRequest, isLoading: isAssetRequestLoading } =
    useGetSingleAssetRequestQuery(id || "", !!id);

  const { data: documents, isLoading: isDocumentsLoading } = useGetAssetRequestDocuments(
    id || "",
    !!id
  );

  const documentUrl = assetRequest?.data?.document;

  const getFileNameFromUrl = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 1] || 'Document';
  };

  const openDocument = (url: string) => {
    window.open(url, '_blank');
  };

  const downloadDocument = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isAssetRequestLoading || isDocumentsLoading) {
    return (
      <Card>
        <CardHeader className='font-bold'>
          Uploads
          <Separator className='mt-4' />
        </CardHeader>
        <CardContent>
          <Loading />
        </CardContent>
      </Card>
    );
  }

  const hasDocuments = documentUrl || (documents?.data && documents.data.length > 0);

  return (
    <Card>
      <CardHeader className='font-bold'>
        Uploads
        <Separator className='mt-4' />
      </CardHeader>
      <CardContent>
        {hasDocuments ? (
          <div className="space-y-6">
            {/* Single Document from AssetRequest */}
            {documentUrl && (
              <div>
                <h4 className="font-semibold mb-3">Main Document</h4>
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-gray-500" />
                    <div className="flex-1">
                      <p className="font-medium">{getFileNameFromUrl(documentUrl)}</p>
                      <p className="text-sm text-gray-500">Primary Document</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDocument(documentUrl)}
                      className="flex items-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadDocument(documentUrl, getFileNameFromUrl(documentUrl))}
                      className="flex items-center space-x-1"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Multiple Documents from AssetRequestDocument */}
            {documents?.data && documents.data.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Additional Documents ({documents.data.length})</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {documents.data.map((document: any, index: number) => (
                    <div key={document.id || index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-gray-500" />
                        <div className="flex-1">
                          <p className="font-medium">{document.title || document.name || `Document ${index + 1}`}</p>
                          <p className="text-sm text-gray-500">
                            {document.file_size_mb ? `${document.file_size_mb} MB` : 'Supporting Document'}
                          </p>
                        </div>
                      </div>
                      {document.document && (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDocument(document.document)}
                            className="flex items-center space-x-1"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadDocument(document.document, document.title || document.name || `document_${index + 1}`)}
                            className="flex items-center space-x-1"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No documents uploaded yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
