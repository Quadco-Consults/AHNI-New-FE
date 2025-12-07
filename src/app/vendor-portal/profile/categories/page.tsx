"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Alert, AlertDescription } from "components/ui/alert";
import { Progress } from "components/ui/progress";
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  FileText,
  TrendingUp,
  Target,
  Award
} from "lucide-react";
import { useVendorProfile } from "@/features/vendor-portal/controllers/vendorAuthController";
import { LoadingSpinner } from "components/Loading";

export default function VendorCategoriesPage() {
  const router = useRouter();
  const { data: vendorProfile, isLoading, error } = useVendorProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading categories...</span>
      </div>
    );
  }

  if (error || !vendorProfile) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load vendor profile. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const prequalificationSummary = vendorProfile.prequalification_summary || {
    total_categories_applied: 0,
    categories_approved: 0,
    categories_rejected: 0,
    approval_rate: 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories & Qualifications</h1>
          <p className="text-gray-600 mt-1">
            Manage your approved categories and prequalification status
          </p>
        </div>
        <Button onClick={() => router.push('/vendor-portal/rfqs')}>
          View Available RFQs
        </Button>
      </div>

      {/* Prequalification Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applied</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prequalificationSummary.total_categories_applied}</div>
            <p className="text-xs text-muted-foreground">Categories submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{prequalificationSummary.categories_approved}</div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{prequalificationSummary.categories_rejected}</div>
            <p className="text-xs text-muted-foreground">Not qualified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{prequalificationSummary.approval_rate}%</div>
            <Progress value={prequalificationSummary.approval_rate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Approved Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-green-600" />
            Approved Categories
          </CardTitle>
          <CardDescription>
            Categories you are qualified to bid on
          </CardDescription>
        </CardHeader>
        <CardContent>
          {vendorProfile.approved_categories && vendorProfile.approved_categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vendorProfile.approved_categories.map((category: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 border rounded-lg bg-green-50 border-green-200"
                >
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {typeof category === 'string' ? category : category.name}
                    </div>
                    <div className="text-sm text-gray-600">Approved</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No approved categories yet</p>
              <p className="text-sm">Submit your prequalification documents to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submitted Categories (if different from approved) */}
      {vendorProfile.submitted_categories && vendorProfile.submitted_categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              Submitted Categories
            </CardTitle>
            <CardDescription>
              Categories under review or awaiting approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vendorProfile.submitted_categories.map((category: any, index: number) => {
                const categoryName = typeof category === 'string' ? category : category.name;
                const isApproved = vendorProfile.approved_categories?.some((approved: any) => {
                  const approvedName = typeof approved === 'string' ? approved : approved.name;
                  return approvedName === categoryName;
                });

                const status = isApproved ? 'approved' : 'pending';

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-4 border rounded-lg ${getStatusColor(status)}`}
                  >
                    {getStatusIcon(status)}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {categoryName}
                      </div>
                      <div className="text-sm capitalize">
                        {status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Performance */}
      {vendorProfile.approved_categories && vendorProfile.approved_categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>
              Your bidding success rate by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vendorProfile.approved_categories.slice(0, 5).map((category: any, index: number) => {
                // Mock performance data - replace with real data when available
                const mockSuccess = Math.floor(Math.random() * 100);
                const mockBids = Math.floor(Math.random() * 20) + 1;

                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {typeof category === 'string' ? category : category.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {mockBids} bids submitted
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32">
                        <Progress value={mockSuccess} className="h-2" />
                      </div>
                      <div className="text-sm font-medium text-gray-900 w-12 text-right">
                        {mockSuccess}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>
            Manage your category qualifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => router.push('/eoi')}>
              Apply for New Categories
            </Button>
            <Button variant="outline" onClick={() => router.push('/vendor-portal/profile/certifications')}>
              Manage Certifications
            </Button>
            <Button variant="outline" onClick={() => router.push('/vendor-portal/rfqs')}>
              Browse RFQs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}