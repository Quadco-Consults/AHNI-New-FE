"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Building2,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { useConsultantProfile } from "@/features/consultant-portal/controllers/consultantAuthController";
import { LoadingSpinner } from "@/components/Loading";

export default function ConsultantProfilePage() {
  const router = useRouter();
  const { data: profile, isLoading, error } = useConsultantProfile();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getContractStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'EXPIRING_SOON':
        return <Badge className="bg-orange-500">Expiring Soon</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-gray-500">Completed</Badge>;
      case 'NOT_STARTED':
        return <Badge className="bg-blue-500">Not Started</Badge>;
      case 'INCOMPLETE':
        return <Badge variant="destructive">Incomplete</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load profile. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-600 mt-1">View and manage your profile information</p>
        </div>
      </div>

      {/* Profile Completion */}
      {profile.profile_completion && (
        <Card className={
          profile.profile_completion.percentage === 100
            ? "border-green-200 bg-green-50"
            : "border-orange-200 bg-orange-50"
        }>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {profile.profile_completion.percentage === 100 ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-orange-600" />
              )}
              Profile Completion: {profile.profile_completion.percentage}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={profile.profile_completion.percentage} className="mb-2" />
            <div className="text-sm">
              {profile.profile_completion.completed_fields} of {profile.profile_completion.total_fields} required fields completed
            </div>
            {profile.profile_completion.missing_fields.length > 0 && (
              <div className="mt-4">
                <div className="font-semibold text-sm">Missing fields:</div>
                <ul className="list-disc list-inside text-sm mt-2">
                  {profile.profile_completion.missing_fields.map((field) => (
                    <li key={field}>{field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</li>
                  ))}
                </ul>
                <Alert className="mt-4 border-orange-300 bg-orange-100">
                  <AlertDescription className="text-orange-900">
                    Please contact HR to update missing information: <a href="mailto:hr@ahni.org" className="underline font-semibold">hr@ahni.org</a>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-600">Full Name</div>
            <div className="font-semibold mt-1">{profile.full_name}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </div>
            <div className="font-semibold mt-1">{profile.email}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </div>
            <div className="font-semibold mt-1">{profile.phone_number || 'Not provided'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              State of Origin
            </div>
            <div className="font-semibold mt-1">{profile.state_of_origin || 'Not provided'}</div>
          </div>
          <div className="md:col-span-2">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Qualifications
            </div>
            <div className="font-semibold mt-1">{profile.qualifications || 'Not provided'}</div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Contract Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Contract Status</div>
            {getContractStatusBadge(profile.contract_status)}
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Start Date
              </div>
              <div className="font-semibold mt-1">
                {profile.contract_start_date ? formatDate(profile.contract_start_date) : 'Not set'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                End Date
              </div>
              <div className="font-semibold mt-1">
                {profile.contract_end_date ? formatDate(profile.contract_end_date) : 'Not set'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Monthly Pay
              </div>
              <div className="font-semibold mt-1">
                {profile.monthly_pay ? formatCurrency(profile.monthly_pay) : 'Not set'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Assignment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-600">Health Facility</div>
            <div className="font-semibold mt-1">{profile.health_facility_assignment || 'Not assigned'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Spoke Site</div>
            <div className="font-semibold mt-1">{profile.spoke_site_name || 'Not assigned'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">LGA</div>
            <div className="font-semibold mt-1">{profile.lga || 'Not assigned'}</div>
          </div>
          {profile.lga2 && (
            <div>
              <div className="text-sm text-gray-600">LGA 2</div>
              <div className="font-semibold mt-1">{profile.lga2}</div>
            </div>
          )}
          <div>
            <div className="text-sm text-gray-600">Cluster</div>
            <div className="font-semibold mt-1">{profile.cluster || 'Not assigned'}</div>
          </div>
        </CardContent>
      </Card>

      {/* Supervision Information */}
      {(profile.qmap_backstop || profile.programs_officer || profile.stl || profile.seo) && (
        <Card>
          <CardHeader>
            <CardTitle>Supervision Structure</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.qmap_backstop && (
              <div>
                <div className="text-sm text-gray-600">QMAP Backstop</div>
                <div className="font-semibold mt-1">{profile.qmap_backstop}</div>
              </div>
            )}
            {profile.programs_officer && (
              <div>
                <div className="text-sm text-gray-600">Programs Officer</div>
                <div className="font-semibold mt-1">{profile.programs_officer}</div>
              </div>
            )}
            {profile.stl && (
              <div>
                <div className="text-sm text-gray-600">STL</div>
                <div className="font-semibold mt-1">{profile.stl}</div>
              </div>
            )}
            {profile.seo && (
              <div>
                <div className="text-sm text-gray-600">SEO</div>
                <div className="font-semibold mt-1">{profile.seo}</div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Banking Information */}
      <Card className={
        profile.account_number && profile.bank_name
          ? "border-green-200 bg-green-50"
          : "border-red-200 bg-red-50"
      }>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {profile.account_number && profile.bank_name ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            Banking Information
          </CardTitle>
          {(!profile.account_number || !profile.bank_name) && (
            <CardDescription className="text-red-700">
              Banking information is required to receive payments. Please contact HR to update.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-600">Account Name</div>
            <div className="font-semibold mt-1">{profile.account_name || 'Not provided'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Bank Name</div>
            <div className="font-semibold mt-1">{profile.bank_name || 'Not provided'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Account Number</div>
            <div className="font-semibold mt-1">{profile.account_number || 'Not provided'}</div>
          </div>
          {profile.sort_code && (
            <div>
              <div className="text-sm text-gray-600">Sort Code</div>
              <div className="font-semibold mt-1">{profile.sort_code}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Statistics */}
      {profile.stats && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Request Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{profile.stats.total_payment_requests}</div>
                <div className="text-sm text-gray-600 mt-1">Total Requests</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{profile.stats.pending_payment_requests}</div>
                <div className="text-sm text-gray-600 mt-1">Pending</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{profile.stats.approved_payment_requests}</div>
                <div className="text-sm text-gray-600 mt-1">Approved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{profile.stats.total_payments_received}</div>
                <div className="text-sm text-gray-600 mt-1">Payments Received</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Information */}
      {profile.user_info && (
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-600">Email</div>
              <div className="font-semibold mt-1">{profile.user_info.email}</div>
            </div>
            {profile.user_info.last_login && (
              <div>
                <div className="text-sm text-gray-600">Last Login</div>
                <div className="font-semibold mt-1">{formatDate(profile.user_info.last_login)}</div>
              </div>
            )}
            {profile.user_info.date_joined && (
              <div>
                <div className="text-sm text-gray-600">Account Created</div>
                <div className="font-semibold mt-1">{formatDate(profile.user_info.date_joined)}</div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Contact HR */}
      <Alert>
        <AlertDescription>
          <div className="font-semibold mb-2">Need to update your information?</div>
          <p className="text-sm">
            Please contact HR at <a href="mailto:hr@ahni.org" className="underline font-semibold">hr@ahni.org</a> to update your profile information, banking details, or contract information.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
