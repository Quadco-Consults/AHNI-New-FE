"use client";

import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormSelect from "@/components/atoms/FormSelectField";
import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon, UserCheckIcon, ShieldIcon, AlertTriangleIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { TSiteVisitApplicationFormValues } from "@/features/programs/types/site-visit";
import {
  useGetReviewers,
  useGetAuthorizers,
  useGetApprovers
} from "@/features/auth/controllers/userController";

interface ApprovalWorkflowSectionProps {
  allStaff: any[];
}

const ApprovalWorkflowSection: React.FC<ApprovalWorkflowSectionProps> = ({
  allStaff,
}) => {
  const { control, watch } = useFormContext<TSiteVisitApplicationFormValues>();
  const reviewer = watch("reviewer");
  const authorizer = watch("authorizer");
  const approver = watch("approver");

  // Fetch users with specific permissions from dedicated endpoints
  const { data: reviewersData, isLoading: reviewersLoading, error: reviewersError } = useGetReviewers();
  const { data: authorizersData, isLoading: authorizersLoading, error: authorizersError } = useGetAuthorizers();
  const { data: approversData, isLoading: approversLoading, error: approversError } = useGetApprovers();


  // Get staff details by ID
  const getStaffDetails = (userId: string) => {
    return allStaff.find(staff => staff.id === userId);
  };

  // Check if same person is selected for multiple roles
  const hasDuplicateRoles = () => {
    const roles = [reviewer, authorizer, approver].filter(Boolean);
    return roles.length !== new Set(roles).size;
  };

  // Helper function to filter management-level staff
  const isManagementLevel = (staff: any): boolean => {
    // Check for super admin or staff privileges
    if (staff.is_superuser || staff.is_staff) return true;

    // Check for admin-level user types
    if (staff.user_type === 'ADMIN' || staff.user_type === 'SUPERADMIN') return true;

    // Check designation/position for management keywords
    const designation = (staff.designation || '').toLowerCase();
    const managementKeywords = [
      'manager', 'director', 'md', 'ceo', 'head', 'lead', 'supervisor',
      'coordinator', 'admin', 'chief', 'senior', 'principal', 'executive'
    ];

    return managementKeywords.some(keyword => designation.includes(keyword));
  };

  // Process API responses and apply strict filtering
  const filteredReviewers = useMemo(() => {
    const apiReviewers = reviewersData?.results || [];
    // If API returns users, use them; otherwise apply strict client-side filtering
    let result;
    if (apiReviewers.length > 0) {
      result = apiReviewers;
    } else {
      // Apply strict filtering for reviewers (management level)
      result = allStaff.filter(staff => isManagementLevel(staff));
    }

    // Optional: Enable for debugging
    // console.log('📋 Filtered Reviewers:', { apiCount: apiReviewers.length, finalCount: result.length });
    return result;
  }, [reviewersData, allStaff]);

  const filteredAuthorizers = useMemo(() => {
    const apiAuthorizers = authorizersData?.results || [];
    // If API returns users, use them; otherwise apply strict client-side filtering
    let result;
    if (apiAuthorizers.length > 0) {
      result = apiAuthorizers;
    } else {
      // Apply strict filtering for authorizers (senior management level)
      result = allStaff.filter(staff => {
        const designation = (staff.designation || '').toLowerCase();
        const seniorKeywords = ['director', 'md', 'ceo', 'head', 'chief', 'manager', 'admin'];
        return staff.is_superuser || staff.is_staff || staff.user_type === 'ADMIN' ||
               seniorKeywords.some(keyword => designation.includes(keyword));
      });
    }

    // Optional: Enable for debugging
    // console.log('🔒 Filtered Authorizers:', { apiCount: apiAuthorizers.length, finalCount: result.length });
    return result;
  }, [authorizersData, allStaff]);

  const filteredApprovers = useMemo(() => {
    const apiApprovers = approversData?.results || [];
    // If API returns users, use them; otherwise apply strict client-side filtering
    let result;
    if (apiApprovers.length > 0) {
      result = apiApprovers;
    } else {
      // Apply strict filtering for approvers (executive level only)
      result = allStaff.filter(staff => {
        const designation = (staff.designation || '').toLowerCase();
        const executiveKeywords = ['director', 'md', 'ceo', 'chief', 'executive'];
        return staff.is_superuser || staff.user_type === 'ADMIN' || staff.user_type === 'SUPERADMIN' ||
               executiveKeywords.some(keyword => designation.includes(keyword));
      });
    }

    // Optional: Enable for debugging
    // console.log('✅ Filtered Approvers:', { apiCount: apiApprovers.length, finalCount: result.length });
    return result;
  }, [approversData, allStaff]);

  // Convert filtered users to FormSelect options
  const reviewerOptions = useMemo(() => {
    return filteredReviewers.map((user: any) => ({
      label: `${user.first_name} ${user.last_name}`,
      value: user.id,
    }));
  }, [filteredReviewers]);

  const authorizerOptions = useMemo(() => {
    return filteredAuthorizers.map((user: any) => ({
      label: `${user.first_name} ${user.last_name}`,
      value: user.id,
    }));
  }, [filteredAuthorizers]);

  const approverOptions = useMemo(() => {
    return filteredApprovers.map((user: any) => ({
      label: `${user.first_name} ${user.last_name}`,
      value: user.id,
    }));
  }, [filteredApprovers]);

  // Show warning if using client-side filtering or API is loading
  const showPermissionWarning = useMemo(() => {
    const hasApiReviewers = (reviewersData?.results || []).length > 0;
    const hasApiAuthorizers = (authorizersData?.results || []).length > 0;
    const hasApiApprovers = (approversData?.results || []).length > 0;

    const usingClientSideFiltering = !hasApiReviewers || !hasApiAuthorizers || !hasApiApprovers;
    const isLoading = reviewersLoading || authorizersLoading || approversLoading;

    return usingClientSideFiltering || isLoading;
  }, [reviewersData, authorizersData, approversData, reviewersLoading, authorizersLoading, approversLoading]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheckIcon className="h-5 w-5 text-yellow-600" />
          Approval Workflow
        </CardTitle>
        <p className="text-sm text-gray-600">
          Select the AHNI staff members who will review, authorize, and approve this travel request application.
          You can leave this empty and an administrator will assign approvers later.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Permission Warning */}
        {showPermissionWarning && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangleIcon className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Permission Notice:</strong> {reviewersLoading || authorizersLoading || approversLoading
                ? "Loading user permissions..."
                : "Using role-based filtering. Showing only management-level staff (managers, directors, MD, super admin). API-based permission filtering will be used when available."}
            </AlertDescription>
          </Alert>
        )}

        {/* Approval Process Overview */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-3">Approval Process</h4>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">1</span>
              </div>
              <div className="text-sm">
                <div className="font-medium">Review</div>
                <div className="text-gray-600">Initial review and validation</div>
              </div>
            </div>

            <div className="w-4 h-px bg-gray-300" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-orange-600">2</span>
              </div>
              <div className="text-sm">
                <div className="font-medium">Authorization</div>
                <div className="text-gray-600">Budget and resource approval</div>
              </div>
            </div>

            <div className="w-4 h-px bg-gray-300" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-sm">
                <div className="font-medium">Final Approval</div>
                <div className="text-gray-600">Executive sign-off</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviewer Selection */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-blue-600">1</span>
            </div>
            Reviewer (Optional)
          </label>
          <FormSelect
            name="reviewer"
            placeholder="Select the first-level reviewer (optional)"
            options={reviewerOptions}
            searchPlaceholder="Search reviewers..."
            emptyMessage="No reviewers found."
            required={false}
          />
          {reviewer && (
            <div className="mt-2">
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                Selected: {getStaffDetails(reviewer)?.first_name} {getStaffDetails(reviewer)?.last_name}
              </Badge>
            </div>
          )}
        </div>

        {/* Authorizer Selection */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-orange-600">2</span>
            </div>
            Authorizer (Optional)
          </label>
          <FormSelect
            name="authorizer"
            placeholder="Select the second-level authorizer (optional)"
            options={authorizerOptions}
            searchPlaceholder="Search authorizers..."
            emptyMessage="No authorizers found."
            required={false}
          />
          {authorizer && (
            <div className="mt-2">
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                Selected: {getStaffDetails(authorizer)?.first_name} {getStaffDetails(authorizer)?.last_name}
              </Badge>
            </div>
          )}
        </div>

        {/* Final Approver Selection */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="h-4 w-4 text-green-600" />
            </div>
            Final Approver (Optional)
          </label>
          <FormSelect
            name="approver"
            placeholder="Select the final approver (optional)"
            options={approverOptions}
            searchPlaceholder="Search approvers..."
            emptyMessage="No approvers found."
            required={false}
          />
          {approver && (
            <div className="mt-2">
              <Badge variant="outline" className="text-green-600 border-green-200">
                Selected: {getStaffDetails(approver)?.first_name} {getStaffDetails(approver)?.last_name}
              </Badge>
            </div>
          )}
        </div>

        {/* Approval Summary */}
        {reviewer && authorizer && approver && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900 flex items-center gap-2">
                <ShieldIcon className="h-5 w-5" />
                Approval Workflow Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-100 text-blue-800">Reviewer</Badge>
                <span className="font-medium">
                  {getStaffDetails(reviewer)?.first_name} {getStaffDetails(reviewer)?.last_name}
                </span>
                <span className="text-sm text-gray-600">
                  ({getStaffDetails(reviewer)?.email})
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-orange-100 text-orange-800">Authorizer</Badge>
                <span className="font-medium">
                  {getStaffDetails(authorizer)?.first_name} {getStaffDetails(authorizer)?.last_name}
                </span>
                <span className="text-sm text-gray-600">
                  ({getStaffDetails(authorizer)?.email})
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-green-100 text-green-800">Final Approver</Badge>
                <span className="font-medium">
                  {getStaffDetails(approver)?.first_name} {getStaffDetails(approver)?.last_name}
                </span>
                <span className="text-sm text-gray-600">
                  ({getStaffDetails(approver)?.email})
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Guidelines */}
        <div className="bg-gray-50 p-3 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-2">Approval Guidelines</h4>
          <ul className="text-sm text-gray-700 space-y-1 list-disc ml-4">
            <li>Each approval level must be assigned (same person can handle multiple roles if needed)</li>
            <li>Reviewers validate technical and operational aspects</li>
            <li>Authorizers approve budgets and resource allocations</li>
            <li>Final approvers provide executive sign-off for travel authorization</li>
            <li>All approvers will receive email notifications when action is required</li>
            <li>Applications must pass through all three levels to be approved</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApprovalWorkflowSection;