"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BackNavigation from "@/components/BackNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContractRequestReview from "./ContractRequestReview";
import WorkflowHistory from "./WorkflowHistory";
import { useGetSingleContractRequest } from "@/features/contracts-grants/controllers/contractController";
import { LoadingSpinner } from "@/components/Loading";
import { usePermissions } from "@/hooks/usePermissions";

export default function ContractRequestDetail() {
  const params = useParams();
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  const contractId = params.id as string;

  // Get user permissions
  const { canManageApprovals, user } = usePermissions();

  console.log('🔒 CONTRACT REQUEST PERMISSIONS:', {
    canManageApprovals,
    userRole: user?.role,
    context: 'contract_request_detail_permissions'
  });
  
  // Get current user from localStorage or auth context
  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }

    // Return null if no user data found
    return null;
  };

  const currentUser = getCurrentUser();

  const { data: response, isLoading, error, refetch } = useGetSingleContractRequest(contractId);

  // Debug logging to understand data structure
  console.log("ContractRequestDetail - Full response:", response);
  console.log("ContractRequestDetail - Response type:", typeof response);
  console.log("ContractRequestDetail - Response keys:", response ? Object.keys(response) : 'No response');
  console.log("ContractRequestDetail - Has data property:", response && 'data' in response);

  // Handle both possible response structures
  let contractRequest;
  if (response && typeof response === 'object' && 'data' in response && 'status' in response) {
    // Response is wrapped in ApiResponse format
    contractRequest = (response as any).data;
  } else {
    // Response is direct contract data
    contractRequest = response;
  }

  console.log("ContractRequestDetail - Final contract request:", contractRequest);
  console.log("ContractRequestDetail - Department structure:", {
    department: contractRequest?.department,
    created_by_department: contractRequest?.created_by?.department,
  });
  console.log("ContractRequestDetail - FCO structure:", {
    fco: contractRequest?.fco,
    fco_detail: contractRequest?.fco_detail,
    allFields: Object.keys(contractRequest || {}).filter(key => key.toLowerCase().includes('fco'))
  });
  console.log("ContractRequestDetail - Authorizer detail:", contractRequest?.authorizer_detail);
  console.log("ContractRequestDetail - Approver detail:", contractRequest?.approver_detail);
  console.log("ContractRequestDetail - Reviewer detail:", contractRequest?.current_reviewer_detail);

  const handleWorkflowUpdate = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    const errorMessage = (error as any)?.message || 'Unknown error';
    console.log("ContractRequestDetail error:", error);

    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <span className="text-red-600 text-xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {errorMessage.includes('not found') || errorMessage.includes('404')
                ? 'Contract Request Not Found'
                : errorMessage.includes('Authentication') || errorMessage.includes('401')
                ? 'Authentication Required'
                : errorMessage.includes('permission') || errorMessage.includes('403')
                ? 'Access Denied'
                : 'Unable to Load Contract Request'}
            </h2>
            <p className="text-gray-600 mb-4">
              {errorMessage}
            </p>

            {/* Helpful suggestions */}
            <div className="text-sm text-gray-500 mb-4 text-left">
              <p className="font-medium mb-2">Possible solutions:</p>
              <ul className="list-disc list-inside space-y-1">
                {errorMessage.includes('not found') && (
                  <>
                    <li>Check if the contract request ID is correct</li>
                    <li>The contract request may have been deleted</li>
                    <li>Go back to the contract requests list to find the correct one</li>
                  </>
                )}
                {(errorMessage.includes('Authentication') || errorMessage.includes('401')) && (
                  <>
                    <li>Your session may have expired</li>
                    <li>Please log in again</li>
                  </>
                )}
                {(errorMessage.includes('permission') || errorMessage.includes('403')) && (
                  <>
                    <li>You don't have permission to view this contract request</li>
                    <li>Contact your administrator for access</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <div className="space-x-2">
            <Button onClick={() => router.push('/dashboard/c-and-g/contract-request')}>
              View All Contract Requests
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Go Back
            </Button>
            {(errorMessage.includes('Authentication') || errorMessage.includes('401')) && (
              <Button onClick={() => router.push('/auth/login')}>Login</Button>
            )}
          </div>
        </div>

        {/* Debug information for development */}
        <details className="mt-6 text-left max-w-2xl mx-auto">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            Debug Information (Development Only)
          </summary>
          <div className="mt-2 p-4 bg-gray-100 rounded-lg">
            <div className="text-sm space-y-2">
              <div><strong>Contract ID:</strong> {contractId}</div>
              <div><strong>API Endpoint:</strong> /contract-grants/contract-requests/{contractId}</div>
              <div><strong>Error Message:</strong> {errorMessage}</div>
            </div>
            <pre className="text-xs text-gray-400 mt-2 p-2 bg-white border rounded overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        </details>
      </div>
    );
  }

  if (!contractRequest) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Contract Request Not Found</h2>
        <p className="text-gray-600 mb-4">The requested contract could not be loaded.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackNavigation />
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{contractRequest.title}</h1>
          <p className="text-gray-600 mt-1">Contract Request Details</p>
        </div>
        <Badge className="text-sm">
          {contractRequest.status_display || contractRequest.status}
        </Badge>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Request Details</TabsTrigger>
          {canManageApprovals && (
            <>
              <TabsTrigger value="workflow">Workflow & Review</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </>
          )}
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Request Details Tab */}
        <TabsContent value="details">
          <div className="grid gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Request Title:</strong>
                    <p>{contractRequest.title}</p>
                  </div>
                  <div>
                    <strong>Request Type:</strong>
                    <p>{contractRequest.request_type_display || contractRequest.request_type}</p>
                  </div>
                  <div>
                    <strong>Department:</strong>
                    <p>{contractRequest.department?.name || contractRequest.created_by?.department?.name || "Not specified"}</p>
                  </div>
                  <div>
                    <strong>Location:</strong>
                    <p>{contractRequest.location_detail?.name}</p>
                  </div>
                  <div>
                    <strong>Number of Consultants:</strong>
                    <p>{contractRequest.consultants_count || 1} consultant{(contractRequest.consultants_count || 1) !== 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <strong>Service Type:</strong>
                    <p>{contractRequest.service_type || "Consultancy Service"}</p>
                  </div>
                  <div>
                    <strong>FCO Reference:</strong>
                    <p>{contractRequest.fco_detail?.name || contractRequest.fco_detail?.code || contractRequest.fco || "FCO not specified"}</p>
                  </div>
                  <div>
                    <strong>Award Amount:</strong>
                    <p>{contractRequest.award_amount ? `$${parseFloat(contractRequest.award_amount).toLocaleString()}` : "Amount to be determined"}</p>
                  </div>
                  <div>
                    <strong>Reference Number:</strong>
                    <p>{contractRequest.reference_number || contractRequest.award_reference_number || "To be assigned"}</p>
                  </div>
                  <div>
                    <strong>Status:</strong>
                    <p>{contractRequest.status_display || contractRequest.status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Email:</strong>
                    <p>{contractRequest.email || "Email not provided"}</p>
                  </div>
                  <div>
                    <strong>Phone Number:</strong>
                    <p>{contractRequest.phone_number || "Phone not provided"}</p>
                  </div>
                  <div>
                    <strong>Technical Monitor:</strong>
                    <p>{contractRequest.technical_monitor || contractRequest.project_manager || "Not assigned"}</p>
                  </div>
                  <div>
                    <strong>Department Contact:</strong>
                    <p>{contractRequest.department_contact || contractRequest.created_by?.email || "Department contact not specified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Information - Different views for regular users vs managers */}
            {!canManageApprovals ? (
              /* Simple status view for regular users */
              <Card>
                <CardHeader>
                  <CardTitle>Request Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <Badge className="text-lg px-4 py-2 mb-4">
                      {contractRequest.status_display || contractRequest.status}
                    </Badge>
                    <p className="text-gray-600">
                      Your contract request is currently being processed. You will be notified of any updates.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Detailed workflow view for managers */
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <strong>Reviewer:</strong>
                      <p>{contractRequest.current_reviewer ?
                         (contractRequest.current_reviewer.full_name ||
                          [contractRequest.current_reviewer.first_name, contractRequest.current_reviewer.last_name]
                           .filter(name => name && name.trim())
                           .join(" ")) || "Reviewer" :
                         "Not assigned"}</p>
                    </div>
                    <div>
                      <strong>Authorizer:</strong>
                      <p>{contractRequest.authorizer_detail ?
                         (contractRequest.authorizer_detail.full_name ||
                          [contractRequest.authorizer_detail.first_name, contractRequest.authorizer_detail.last_name]
                           .filter(name => name && name.trim())
                           .join(" ")) || "Authorizer" :
                         "Not assigned"}</p>
                    </div>
                    <div>
                      <strong>Approver:</strong>
                      <p>{contractRequest.approver_detail ?
                         (contractRequest.approver_detail.full_name ||
                          [contractRequest.approver_detail.first_name, contractRequest.approver_detail.last_name]
                           .filter(name => name && name.trim())
                           .join(" ")) || "Approver" :
                         "Not assigned"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Created:</strong>
                    <p>{new Date(contractRequest.created_datetime).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long", 
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</p>
                  </div>
                  <div>
                    <strong>Last Updated:</strong>
                    <p>{new Date(contractRequest.updated_datetime).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric", 
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</p>
                  </div>
                  <div>
                    <strong>Created By:</strong>
                    <p>{contractRequest.created_by?.full_name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Workflow & Review Tab - Only for users with approval permissions */}
        {canManageApprovals && (
          <TabsContent value="workflow">
            <ContractRequestReview
              contractRequest={contractRequest}
              currentUser={currentUser}
              onWorkflowUpdate={handleWorkflowUpdate}
            />
          </TabsContent>
        )}

        {/* History Tab - Only for users with approval permissions */}
        {canManageApprovals && (
          <TabsContent value="history">
            <WorkflowHistory
              contractRequest={contractRequest}
            />
          </TabsContent>
        )}

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Supporting Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Documents will be displayed here when implemented */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}