"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BackNavigation from "components/atoms/BackNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Separator } from "components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import ContractRequestReview from "./ContractRequestReview";
import WorkflowHistory from "./WorkflowHistory";
import { useGetSingleContractRequest } from "@/features/contracts-grants/controllers/contractController";
import { LoadingSpinner } from "components/Loading";

export default function ContractRequestDetail() {
  const params = useParams();
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  
  const contractId = params.id as string;
  
  // Mock current user - in real app this would come from auth context
  const currentUser = {
    id: "current-user-id",
    name: "John Doe",
    email: "john@example.com"
  };

  const { data: response, isLoading, error, refetch } = useGetSingleContractRequest(contractId);
  const contractRequest = response?.data;

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
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Contract Request</h2>
        <p className="text-gray-600 mb-4">
          {errorMessage.includes('Authentication') || errorMessage.includes('401') 
            ? 'Please log in to view contract request details.'
            : 'The requested contract could not be loaded.'}
        </p>
        <div className="space-x-2">
          <Button onClick={() => router.back()}>Go Back</Button>
          {errorMessage.includes('Authentication') || errorMessage.includes('401') ? (
            <Button onClick={() => router.push('/auth/login')}>Login</Button>
          ) : null}
        </div>
        <details className="mt-4 text-left max-w-md mx-auto">
          <summary className="cursor-pointer text-sm text-gray-500">Error Details</summary>
          <pre className="text-xs text-gray-400 mt-2 p-2 bg-gray-100 rounded">
            {JSON.stringify(error, null, 2)}
          </pre>
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
          <TabsTrigger value="workflow">Workflow & Review</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
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
                    <p>{contractRequest.department?.name}</p>
                  </div>
                  <div>
                    <strong>Location:</strong>
                    <p>{contractRequest.location_detail?.name}</p>
                  </div>
                  <div>
                    <strong>Number of Consultants:</strong>
                    <p>{contractRequest.consultants_count}</p>
                  </div>
                  <div>
                    <strong>FCO Number:</strong>
                    <p>{contractRequest.fco || "Not specified"}</p>
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
                    <p>{contractRequest.email}</p>
                  </div>
                  <div>
                    <strong>Phone Number:</strong>
                    <p>{contractRequest.phone_number}</p>
                  </div>
                  <div>
                    <strong>Technical Monitor:</strong>
                    <p>{contractRequest.technical_monitor || "Not assigned"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Workflow Assignments */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <strong>Reviewer:</strong>
                    <p>{contractRequest.current_reviewer_detail ? 
                       `${contractRequest.current_reviewer_detail.first_name} ${contractRequest.current_reviewer_detail.last_name}` :
                       "Not assigned"}</p>
                  </div>
                  <div>
                    <strong>Authorizer:</strong>
                    <p>{contractRequest.authorizer_detail ? 
                       `${contractRequest.authorizer_detail.first_name} ${contractRequest.authorizer_detail.last_name}` :
                       "Not assigned"}</p>
                  </div>
                  <div>
                    <strong>Approver:</strong>
                    <p>{contractRequest.approver_detail ? 
                       `${contractRequest.approver_detail.first_name} ${contractRequest.approver_detail.last_name}` :
                       "Not assigned"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

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

        {/* Workflow & Review Tab */}
        <TabsContent value="workflow">
          <ContractRequestReview
            contractRequest={contractRequest}
            currentUser={currentUser}
            onWorkflowUpdate={handleWorkflowUpdate}
          />
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <WorkflowHistory 
            contractRequest={contractRequest}
          />
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Supporting Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No documents uploaded yet.</p>
                <Button variant="outline">Upload Documents</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}