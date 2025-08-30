"use client";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Separator } from "components/ui/separator";
import { useSearchParams } from "next/navigation";
import { useGetSingleAssetRequestQuery } from "@/features/admin/controllers";
import { FileText, Download, Eye } from "lucide-react";
import { Button } from "components/ui/button";
import { Loading } from "components/Loading";

export default function Upload() {
  const searchParams = useSearchParams();
  const id = searchParams!.get("id");

  const { data: assetRequest, isLoading: isAssetRequestLoading } =
    useGetSingleAssetRequestQuery(id || "", !!id);

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

  if (isAssetRequestLoading) {
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

  return (
    <Card>
      <CardHeader className='font-bold'>
        Uploads
        <Separator className='mt-4' />
      </CardHeader>
      <CardContent>
        {documentUrl ? (
          <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-gray-500" />
                <div className="flex-1">
                  <p className="font-medium">{getFileNameFromUrl(documentUrl)}</p>
                  <p className="text-sm text-gray-500">Uploaded Document</p>
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
