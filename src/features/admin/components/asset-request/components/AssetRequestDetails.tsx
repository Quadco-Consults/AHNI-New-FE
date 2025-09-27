"use client";

import { LoadingSpinner } from "components/Loading";
import DescriptionCard from "components/DescriptionCard";
import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { useSearchParams } from "next/navigation";
import { useGetSingleAssetRequestQuery, useGetAssetRequestDocuments } from "@/features/admin/controllers/assetRequestController";
import { useGetSingleUser } from "@/features/auth/controllers/userController";
import { Separator } from "components/ui/separator";
import { Button } from "components/ui/button";
import { FileText, Download } from "lucide-react";

// Component to display user information
function UserDisplay({ userId, action, className }: { userId: string; action: string; className?: string }) {
  const { data: user, isLoading: userLoading } = useGetSingleUser(userId, !!userId);

  if (userLoading) {
    return (
      <p className={`text-sm ${className || "text-gray-600"}`}>
        Loading user details...
      </p>
    );
  }

  if (!user?.data) {
    return (
      <p className={`text-sm ${className || "text-gray-600"}`}>
        {action} by {userId}
      </p>
    );
  }

  const userData = user.data;

  // Ensure all values are strings, not objects
  const firstName = typeof userData.first_name === 'string' ? userData.first_name : '';
  const lastName = typeof userData.last_name === 'string' ? userData.last_name : '';
  const fullName = typeof userData.fullName === 'string' ? userData.fullName : '';
  const email = typeof userData.email === 'string' ? userData.email : '';

  const displayName = fullName || `${firstName} ${lastName}`.trim() || email || 'Unknown User';

  const position = typeof userData.position === 'string' ? userData.position :
                  typeof userData.designation === 'string' ? userData.designation :
                  typeof userData.user_type === 'string' ? userData.user_type : '';

  const departmentName = (userData.department as any)?.name;
  const department = typeof departmentName === 'string' ? departmentName : '';

  // Debug logging
  console.log('UserDisplay debug:', {
    userId,
    userData,
    displayName,
    position,
    department,
    departmentRaw: userData.department
  });

  // Final safety check - ensure all values are primitives
  const safeDisplayName = String(displayName);
  const safePosition = String(position);
  const safeDepartment = String(department);
  const safeAction = String(action);

  return (
    <div className={`text-sm ${className || "text-gray-600"}`}>
      <p>
        {safeAction} by <span className="font-medium">{safeDisplayName}</span>
      </p>
      {(safePosition || safeDepartment) && (
        <p className="text-xs mt-1">
          {safePosition}{safeDepartment && safePosition && " • "}{safeDepartment}
        </p>
      )}
    </div>
  );
}

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

  // Debug logging to see the actual data structure
  console.log("Asset request data:", assetRequest);
  console.log("Created by data:", assetRequest?.data?.created_by);
  console.log("Approvals data:", assetRequest?.data?.approvals);

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

      {/* Workflow Tracking Section */}
      <CardHeader className='font-bold'>
        <Separator className='mt-4' />
        Workflow Tracking
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          assetRequest?.data && (
            <div className="space-y-4">
              {/* Created */}
              <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-blue-800">Created</p>
                    <div>
                      <UserDisplay
                        userId={typeof assetRequest.data.created_by === 'string' ? assetRequest.data.created_by : assetRequest.data.created_by?.id || ''}
                        action="Request initiated"
                        className="text-blue-600"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-sm text-blue-600">
                  {format(new Date(assetRequest.data.created_datetime), "MMM dd, yyyy HH:mm")}
                </div>
              </div>

              {/* Approvals from workflow */}
              {assetRequest.data.approvals?.map((approval) => {
                // Debug log each approval
                console.log('Approval debug:', approval);

                const getApprovalInfo = (level: string) => {
                  switch (level.toLowerCase()) {
                    case 'reviewer':
                    case 'review':
                      return { color: 'yellow', label: 'Reviewed', bgColor: 'bg-yellow-50', textColor: 'text-yellow-800', dotColor: 'bg-yellow-500' };
                    case 'authorizer':
                    case 'authorize':
                      return { color: 'orange', label: 'Authorized', bgColor: 'bg-orange-50', textColor: 'text-orange-800', dotColor: 'bg-orange-500' };
                    case 'approver':
                    case 'approve':
                      return { color: 'green', label: 'Approved', bgColor: 'bg-green-50', textColor: 'text-green-800', dotColor: 'bg-green-500' };
                    default:
                      return { color: 'gray', label: level, bgColor: 'bg-gray-50', textColor: 'text-gray-800', dotColor: 'bg-gray-500' };
                  }
                };

                const approvalInfo = getApprovalInfo(approval.approval_level);

                return (
                  <div key={approval.id} className={`flex items-center justify-between p-4 border rounded-lg ${approvalInfo.bgColor}`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 ${approvalInfo.dotColor} rounded-full`}></div>
                      <div>
                        <p className={`font-medium ${approvalInfo.textColor}`}>{approvalInfo.label}</p>
                        <div>
                          {/* Check if approval has user information */}
                          {(approval as any).user_id || (approval as any).user ? (
                            <UserDisplay
                              userId={typeof (approval as any).user_id === 'string' ? (approval as any).user_id :
                                      typeof (approval as any).user === 'string' ? (approval as any).user :
                                      (approval as any).user?.id || ''}
                              action={`Request ${approvalInfo.label.toLowerCase()}`}
                              className={approvalInfo.textColor}
                            />
                          ) : (
                            <p className={`text-sm ${approvalInfo.textColor}`}>
                              {approval.comments || `Request ${approvalInfo.label.toLowerCase()} by system`}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={`text-sm ${approvalInfo.textColor}`}>
                      {format(new Date(approval.created_datetime), "MMM dd, yyyy HH:mm")}
                    </div>
                  </div>
                );
              })}

              {/* Current Status */}
              <div className="flex items-center justify-between p-4 border-2 border-dashed rounded-lg bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-700">Current Status</p>
                    <p className="text-sm text-gray-600">
                      {assetRequest.data.status}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {format(new Date(assetRequest.data.updated_datetime), "MMM dd, yyyy HH:mm")}
                </div>
              </div>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
