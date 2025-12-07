"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Alert, AlertDescription } from "components/ui/alert";
import {
  Building2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle,
  Edit,
  LogOut
} from "lucide-react";
import { useVendorProfile, useVendorLogout, VendorAuthUtils } from "@/features/vendor-portal/controllers/vendorAuthController";
import { LoadingSpinner } from "components/Loading";

export default function VendorProfilePage() {
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { data: vendorProfile, isLoading, error } = useVendorProfile();
  const { mutate: logout, isPending: isLoggingOut } = useVendorLogout();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading profile...</span>
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

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.push('/vendor-portal/login');
      },
      onError: (error) => {
        console.error('Logout error:', error);
        // Still redirect even if logout API fails
        router.push('/vendor-portal/login');
      }
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'default';
      case 'PENDING':
        return 'secondary';
      case 'REJECTED':
        return 'destructive';
      case 'SUSPENDED':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4" />;
      case 'PENDING':
        return <AlertCircle className="h-4 w-4" />;
      case 'REJECTED':
        return <AlertCircle className="h-4 w-4" />;
      case 'SUSPENDED':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your company information and credentials
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLogoutConfirm(true)}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">Logging out...</span>
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Are you sure you want to logout?</span>
            <div className="flex gap-2 ml-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                Logout
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Profile Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{vendorProfile.company_name}</h2>
                <p className="text-gray-600">{vendorProfile.type_of_business || 'Business type not specified'}</p>
              </div>
            </div>
            <Badge
              variant={getStatusBadgeVariant(vendorProfile.status)}
              className="flex items-center gap-1 text-sm"
            >
              {getStatusIcon(vendorProfile.status)}
              {vendorProfile.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Basic details about your company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Company Name
                  </label>
                  <p className="text-gray-900 mt-1">{vendorProfile.company_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </label>
                  <p className="text-gray-900 mt-1">{vendorProfile.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </label>
                  <p className="text-gray-900 mt-1">{vendorProfile.phone_number || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Registration Date
                  </label>
                  <p className="text-gray-900 mt-1">{formatDate(vendorProfile.registration_date)}</p>
                </div>
              </div>

              {vendorProfile.last_login && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Login</label>
                  <p className="text-gray-900 mt-1">{formatDate(vendorProfile.last_login)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>
                Your bidding and contract performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{vendorProfile.submitted_bids}</div>
                  <p className="text-sm text-gray-600">Total Bids Submitted</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{vendorProfile.awarded_contracts}</div>
                  <p className="text-sm text-gray-600">Contracts Awarded</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {vendorProfile.submitted_bids > 0
                      ? Math.round((vendorProfile.awarded_contracts / vendorProfile.submitted_bids) * 100)
                      : 0}%
                  </div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Approved Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Approved Categories</CardTitle>
              <CardDescription>
                Categories you're qualified to bid on
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vendorProfile.approved_categories && vendorProfile.approved_categories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {vendorProfile.approved_categories.map((category, index) => (
                    <Badge key={index} variant="default" className="text-xs">
                      {typeof category === 'string' ? category : category.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No categories approved yet</p>
              )}
            </CardContent>
          </Card>

          {/* Submitted Categories */}
          {vendorProfile.submitted_categories && vendorProfile.submitted_categories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Submitted Categories</CardTitle>
                <CardDescription>
                  Categories under review
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {vendorProfile.submitted_categories.map((category, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {typeof category === 'string' ? category : category.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active RFQs */}
          {vendorProfile.active_rfqs && vendorProfile.active_rfqs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Active RFQs</CardTitle>
                <CardDescription>
                  RFQs you're currently participating in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {vendorProfile.active_rfqs.slice(0, 5).map((rfqId, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">RFQ #{rfqId}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/vendor-portal/rfqs/${rfqId}`)}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                  {vendorProfile.active_rfqs.length > 5 && (
                    <p className="text-xs text-gray-500 pt-2">
                      +{vendorProfile.active_rfqs.length - 5} more
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/vendor-portal/rfqs')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Browse RFQs
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/vendor-portal/submissions')}
              >
                <FileText className="h-4 w-4 mr-2" />
                View Submissions
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/vendor-portal/dashboard')}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}