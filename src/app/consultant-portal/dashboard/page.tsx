"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  User,
  AlertTriangle,
  LogOut,
  Settings
} from "lucide-react";
import { ConsultantAuthUtils, useConsultantProfile, useConsultantLogout } from "@/features/consultant-portal/controllers/consultantAuthController";
import { useConsultantDashboard } from "@/features/consultant-portal/controllers/consultantDashboardController";
import { LoadingSpinner } from "@/components/Loading";
import { toast } from "sonner";

export default function ConsultantDashboardPage() {
  const router = useRouter();
  const { data: consultantProfile, isLoading: profileLoading, error: profileError } = useConsultantProfile();
  const { data: dashboardData, isLoading: dashboardLoading } = useConsultantDashboard();
  const { mutate: logout, isPending: logoutPending } = useConsultantLogout();

  useEffect(() => {
    // Small delay to allow token storage after login before checking auth
    const checkAuth = setTimeout(() => {
      if (!ConsultantAuthUtils.isConsultantAuthenticated()) {
        console.log('🔒 Dashboard: No consultant token found, redirecting to login');
        router.push('/consultant-portal/login');
      } else {
        console.log('✅ Dashboard: Consultant authenticated, proceeding to load dashboard');
      }
    }, 200);

    return () => clearTimeout(checkAuth);
  }, [router]);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        router.push('/consultant-portal/login');
      },
      onError: () => {
        toast.error("Logout failed. Clearing local session.");
        ConsultantAuthUtils.removeConsultantToken();
        router.push('/consultant-portal/login');
      }
    });
  };

  if (profileLoading || dashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  if (profileError || !consultantProfile) {
    const isPermissionError = (profileError as any)?.response?.status === 403;

    return (
      <Alert variant={isPermissionError ? "default" : "destructive"} className={isPermissionError ? "border-orange-200 bg-orange-50" : ""}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {isPermissionError ? (
            <>
              <strong>Limited Access:</strong> Your consultant account has limited profile access.
              Contact HR at hr@ahni.org if you need full access.
            </>
          ) : (
            "Failed to load consultant profile. Please try refreshing the page or contact support if the issue persists."
          )}
        </AlertDescription>
      </Alert>
    );
  }

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

  const getPaymentStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'REVIEWED':
        return <Badge className="bg-blue-500">Reviewed</Badge>;
      case 'AUTHORIZED':
        return <Badge className="bg-purple-500">Authorized</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Logout */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {dashboardData?.consultant_info?.full_name || consultantProfile.full_name}</h1>
          <p className="text-gray-600 mt-1">{dashboardData?.consultant_info?.email || consultantProfile.email}</p>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          disabled={logoutPending}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Alerts */}
      {dashboardData?.alerts && dashboardData.alerts.length > 0 && (
        <div className="space-y-3">
          {dashboardData.alerts.map((alert, index) => (
            <Alert
              key={index}
              variant={alert.type === 'ERROR' ? 'destructive' : 'default'}
              className={
                alert.type === 'WARNING' ? 'border-orange-200 bg-orange-50' :
                alert.type === 'INFO' ? 'border-blue-200 bg-blue-50' : ''
              }
            >
              {alert.type === 'WARNING' && <AlertTriangle className="h-4 w-4" />}
              {alert.type === 'ERROR' && <AlertCircle className="h-4 w-4" />}
              {alert.type === 'INFO' && <FileText className="h-4 w-4" />}
              <AlertDescription>
                <div className="font-semibold">{alert.title}</div>
                <div className="text-sm mt-1">{alert.message}</div>
                <div className="text-xs mt-1 text-gray-600">{alert.action}</div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Contract Information */}
      {dashboardData?.contract && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Contract Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">Status</div>
                <div className="mt-1">{getContractStatusBadge(dashboardData.contract.status)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Start Date</div>
                <div className="mt-1 font-semibold">
                  {dashboardData.contract.start_date ? formatDate(dashboardData.contract.start_date) : 'Not set'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">End Date</div>
                <div className="mt-1 font-semibold">
                  {dashboardData.contract.end_date ? formatDate(dashboardData.contract.end_date) : 'Not set'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Monthly Pay</div>
                <div className="mt-1 font-semibold">
                  {dashboardData.contract.monthly_pay ? formatCurrency(dashboardData.contract.monthly_pay) : 'Not set'}
                </div>
              </div>
            </div>

            {dashboardData.contract.status === 'ACTIVE' || dashboardData.contract.status === 'EXPIRING_SOON' ? (
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Contract Progress</span>
                  <span className="text-sm font-semibold">{dashboardData.contract.completion_percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${dashboardData.contract.completion_percentage}%` }}
                  />
                </div>
                <div className="mt-2 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-600">Days Worked</div>
                    <div className="text-lg font-bold">{dashboardData.contract.days_worked}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Days Remaining</div>
                    <div className="text-lg font-bold">{dashboardData.contract.days_remaining}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Days</div>
                    <div className="text-lg font-bold">{dashboardData.contract.total_days}</div>
                  </div>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}

      {/* Payment Statistics */}
      {dashboardData?.payment_statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileText className="h-8 w-8 text-blue-500" />
                <div className="text-2xl font-bold">{dashboardData.payment_statistics.total_payment_requests}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div className="text-2xl font-bold">{dashboardData.payment_statistics.pending_requests}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="text-2xl font-bold">{dashboardData.payment_statistics.approved_requests}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Approval Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div className="text-2xl font-bold">{dashboardData.payment_statistics.approval_rate}%</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Amount Statistics */}
      {dashboardData?.payment_statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Total Amount Requested
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(dashboardData.payment_statistics.total_amount_requested)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Total Amount Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(dashboardData.payment_statistics.total_amount_approved)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Payments */}
      {dashboardData?.recent_payments && dashboardData.recent_payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Payment Requests</CardTitle>
            <CardDescription>Your latest 5 payment requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recent_payments.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-semibold">{payment.payment_reason}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Payment Date: {formatDate(payment.payment_date)}
                    </div>
                    {payment.created_at && (
                      <div className="text-xs text-gray-500 mt-1">
                        Submitted: {formatDate(payment.created_at)}
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-bold text-lg">{formatCurrency(payment.total_amount)}</div>
                    <div className="mt-1">{getPaymentStatusBadge(payment.status)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {dashboardData?.available_actions && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                disabled={!dashboardData.available_actions.can_submit_payment_request}
                onClick={() => router.push('/consultant-portal/payment-requests/create')}
                className="h-auto py-6 flex flex-col items-center gap-2"
              >
                <FileText className="h-6 w-6" />
                <span>Submit Payment Request</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push('/consultant-portal/profile')}
                className="h-auto py-6 flex flex-col items-center gap-2"
              >
                <User className="h-6 w-6" />
                <span>View Profile</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push('/consultant-portal/payment-requests')}
                className="h-auto py-6 flex flex-col items-center gap-2"
              >
                <DollarSign className="h-6 w-6" />
                <span>View All Payments</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
