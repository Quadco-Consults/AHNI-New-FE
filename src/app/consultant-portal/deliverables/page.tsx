"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  TrendingUp,
  Target
} from "lucide-react";
import { useDeliverables } from "@/features/consultant-portal/controllers/deliverablesController";
import { LoadingSpinner } from "@/components/Loading";

export default function DeliverablesPage() {
  const router = useRouter();
  const { data: deliverablesData, isLoading, error } = useDeliverables();

  const deliverables = deliverablesData?.data?.deliverables || [];
  const statistics = deliverablesData?.data?.statistics;
  const contractInfo = deliverablesData?.data?.contract_info;

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-gray-500">Pending</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-500">Submitted</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getFrequencyBadge = (frequency: string) => {
    const colors: Record<string, string> = {
      'Monthly': 'bg-purple-500',
      'Quarterly': 'bg-blue-500',
      'Annually': 'bg-green-500',
      'One-time': 'bg-orange-500',
    };

    return <Badge className={colors[frequency] || 'bg-gray-500'}>{frequency}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysUntilDueText = (dueDate: string) => {
    const days = calculateDaysUntilDue(dueDate);
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `${days} days remaining`;
  };

  const getDaysUntilDueColor = (dueDate: string) => {
    const days = calculateDaysUntilDue(dueDate);
    if (days < 0) return 'text-red-600';
    if (days <= 7) return 'text-orange-600';
    return 'text-gray-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading deliverables...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load deliverables. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  const completionRate = statistics ? (statistics.approved / statistics.total * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Contract Deliverables</h1>
        <p className="text-gray-600 mt-1">Track and manage your contract deliverables</p>
      </div>

      {/* Contract Status Banner */}
      {contractInfo && (
        <Alert className={
          contractInfo.contract_status === 'ACTIVE' ? 'border-green-200 bg-green-50' :
          contractInfo.contract_status === 'EXPIRING_SOON' ? 'border-orange-200 bg-orange-50' :
          'border-gray-200 bg-gray-50'
        }>
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold">Contract Period:</span>{' '}
                {contractInfo.contract_start && contractInfo.contract_end ? (
                  <>
                    {formatDate(contractInfo.contract_start)} - {formatDate(contractInfo.contract_end)}
                  </>
                ) : (
                  'Not set'
                )}
              </div>
              <Badge className={
                contractInfo.contract_status === 'ACTIVE' ? 'bg-green-500' :
                contractInfo.contract_status === 'EXPIRING_SOON' ? 'bg-orange-500' :
                'bg-gray-500'
              }>
                {contractInfo.contract_status}
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Deliverables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Target className="h-8 w-8 text-blue-500" />
                <div className="text-2xl font-bold">{statistics.total}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-gray-500" />
                <div className="text-2xl font-bold">{statistics.pending}</div>
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
                <div className="text-2xl font-bold">{statistics.approved}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div className="text-2xl font-bold">{completionRate.toFixed(0)}%</div>
              </div>
              <Progress value={completionRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Deliverables List */}
      <Card>
        <CardHeader>
          <CardTitle>Deliverables</CardTitle>
          <CardDescription>
            All contract deliverables and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {deliverables.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Deliverables</h3>
              <p className="text-gray-600">
                No deliverables have been assigned to your contract yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {deliverables.map((deliverable) => {
                const daysUntilDue = calculateDaysUntilDue(deliverable.due_date);
                const isUrgent = daysUntilDue >= 0 && daysUntilDue <= 7;
                const isOverdue = daysUntilDue < 0;

                return (
                  <div
                    key={deliverable.id}
                    className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                      isOverdue ? 'border-red-300 bg-red-50' :
                      isUrgent ? 'border-orange-300 bg-orange-50' :
                      ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{deliverable.title}</h3>
                          {getStatusBadge(deliverable.status)}
                          {getFrequencyBadge(deliverable.frequency)}
                        </div>
                        <p className="text-gray-600 mb-3">{deliverable.description}</p>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">Due: {formatDate(deliverable.due_date)}</span>
                          </div>
                          <div className={`flex items-center gap-2 ${getDaysUntilDueColor(deliverable.due_date)}`}>
                            {isOverdue ? (
                              <AlertTriangle className="h-4 w-4" />
                            ) : (
                              <Clock className="h-4 w-4" />
                            )}
                            <span className="font-semibold">{getDaysUntilDueText(deliverable.due_date)}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/consultant-portal/deliverables/${deliverable.id}`)}
                        className="ml-4"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          <div className="font-semibold mb-2">About Deliverables</div>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Review each deliverable's requirements carefully before submission</li>
            <li>Submit deliverables before the due date to avoid delays</li>
            <li>Track the approval status of your submitted deliverables</li>
            <li>Contact your approver if you have questions about requirements</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
