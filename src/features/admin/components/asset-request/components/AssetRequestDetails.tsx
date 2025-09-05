"use client";

import { LoadingSpinner } from "components/Loading";
import DescriptionCard from "components/DescriptionCard";
import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { useSearchParams } from "next/navigation";
import { useGetSingleAssetRequestQuery, useGetAssetRequestDocuments } from "@/features/admin/controllers/assetRequestController";
import { Separator } from "components/ui/separator";
import { Button } from "components/ui/button";
import { FileText, Download } from "lucide-react";

export default function AssetRequestDetails() {
  const searchParams = useSearchParams();
  const id = searchParams!.get("id");

  const { data: assetRequest, isLoading } = useGetSingleAssetRequestQuery(
    id || "",
    !!id
  );

  const { data: documents, isLoading: isDocumentsLoading } = useGetAssetRequestDocuments(
    id || "",
    !!id
  );

  return (
    <Card>
      <CardHeader className='font-bold'>
        Asset Details
        <Separator className='mt-4' />
      </CardHeader>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        assetRequest && (
          <CardContent className='grid grid-cols-3 gap-y-8 gap-x-4'>
            <DescriptionCard
              label='Asset Name'
              description={assetRequest?.data.asset.name}
            />

            <DescriptionCard
              label='Asset Code'
              description={assetRequest?.data.asset.asset_code}
            />

            <DescriptionCard
              label='Asset Type'
              description={assetRequest?.data.asset.asset_type?.name}
            />

            <DescriptionCard
              label='Asset Condition'
              description={assetRequest?.data.asset.asset_condition?.name}
            />

            <DescriptionCard
              label='Request Type'
              description={assetRequest?.data.type}
            />

            {assetRequest?.data.type === "MOVEMENT" && (
              <>
                <DescriptionCard
                  label='From'
                  description={assetRequest?.data.from_location.name}
                />

                <DescriptionCard
                  label='To'
                  description={assetRequest?.data.to_location.name}
                />
              </>
            )}

            <DescriptionCard
              label='Disposal Justification'
              description={assetRequest?.data.disposal_justification}
            />

            <DescriptionCard
              label='Disposal Justification'
              description={assetRequest?.data.disposal_justification}
            />

            <DescriptionCard
              label='Request Date'
              description={format(
                assetRequest?.data.created_datetime,
                "MMM dd, yyyy"
              )}
            />

            <DescriptionCard
              label='Recommendation'
              description={assetRequest?.data.recommendation}
            />

            <DescriptionCard
              label='Remark'
              description={assetRequest?.data.comments || "N/A"}
            />

            <DescriptionCard
              label='Description'
              description={assetRequest?.data.description}
            />
          </CardContent>
        )
      )}
      
      {/* Documents Section */}
      <CardHeader className='font-bold'>
        <Separator className='mt-4' />
        Uploaded Documents
      </CardHeader>
      
      <CardContent>
        {isDocumentsLoading ? (
          <LoadingSpinner />
        ) : documents?.data && documents.data.length > 0 ? (
          <div className="space-y-3">
            {documents.data.map((document: any, index: number) => (
              <div
                key={document.id || index}
                className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{document.title || document.name || `Document ${index + 1}`}</p>
                    <p className="text-sm text-gray-500">
                      Uploaded on {document.created_datetime ? format(new Date(document.created_datetime), "MMM dd, yyyy") : "Unknown date"}
                    </p>
                  </div>
                </div>
                {document.document && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = document.document;
                      link.download = document.title || document.name || `document_${index + 1}`;
                      link.target = '_blank';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No documents uploaded for this asset request</p>
        )}
      </CardContent>
    </Card>
  );
}
