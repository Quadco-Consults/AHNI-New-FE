"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { Badge } from "components/ui/badge";
import { CheckCircleIcon, UserCheckIcon, ShieldIcon } from "lucide-react";
import { Alert, AlertDescription } from "components/ui/alert";

import { TSiteVisitApplicationFormValues } from "@/features/programs/types/site-visit";

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

  // Get staff details by ID
  const getStaffDetails = (userId: string) => {
    return allStaff.find(staff => staff.id === userId);
  };

  // Check if same person is selected for multiple roles
  const hasDuplicateRoles = () => {
    const roles = [reviewer, authorizer, approver].filter(Boolean);
    return roles.length !== new Set(roles).size;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheckIcon className="h-5 w-5 text-yellow-600" />
          Approval Workflow
        </CardTitle>
        <p className="text-sm text-gray-600">
          Select the AHNI staff members who will review, authorize, and approve this site visit application.
          A three-level approval process is required.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
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
        <FormField
          control={control}
          name="reviewer"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="required flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                Reviewer
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the first-level reviewer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {allStaff.map((staff: any) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">
                          {`${staff.first_name} ${staff.last_name}`}
                        </span>
                        <span className="text-xs text-gray-600">
                          {staff.email}
                          {staff.designation && ` • ${staff.designation}`}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
              {reviewer && (
                <div className="mt-2">
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    Selected: {getStaffDetails(reviewer)?.first_name} {getStaffDetails(reviewer)?.last_name}
                  </Badge>
                </div>
              )}
            </FormItem>
          )}
        />

        {/* Authorizer Selection */}
        <FormField
          control={control}
          name="authorizer"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="required flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-orange-600">2</span>
                </div>
                Authorizer
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the second-level authorizer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {allStaff.map((staff: any) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">
                          {`${staff.first_name} ${staff.last_name}`}
                        </span>
                        <span className="text-xs text-gray-600">
                          {staff.email}
                          {staff.designation && ` • ${staff.designation}`}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
              {authorizer && (
                <div className="mt-2">
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    Selected: {getStaffDetails(authorizer)?.first_name} {getStaffDetails(authorizer)?.last_name}
                  </Badge>
                </div>
              )}
            </FormItem>
          )}
        />

        {/* Final Approver Selection */}
        <FormField
          control={control}
          name="approver"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="required flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                </div>
                Final Approver
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the final approver" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {allStaff.map((staff: any) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">
                          {`${staff.first_name} ${staff.last_name}`}
                        </span>
                        <span className="text-xs text-gray-600">
                          {staff.email}
                          {staff.designation && ` • ${staff.designation}`}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
              {approver && (
                <div className="mt-2">
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    Selected: {getStaffDetails(approver)?.first_name} {getStaffDetails(approver)?.last_name}
                  </Badge>
                </div>
              )}
            </FormItem>
          )}
        />

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