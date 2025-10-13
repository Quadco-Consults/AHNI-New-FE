"use client";

import FormButton from "@/components/FormButton";
import FormTextArea from "components/atoms/FormTextArea";
import BackNavigation from "components/atoms/BackNavigation";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { LoadingSpinner } from "components/Loading";
import DataTable from "components/Table/DataTable";
import { Form } from "components/ui/form";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Separator } from "components/ui/separator";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useGetSingleExpenseAuthorizationQuery, useReviewExpenseAuthorization, useAuthorizeExpenseAuthorization, useApproveExpenseAuthorization, useSecurityClearanceExpenseAuthorization } from "@/features/admin/controllers/expenseAuthorizationController";
import { expenseAuthorizationDestinationColumns } from "../table-columns/expense-authorization/expense-authorization-destinations";
import { cn } from "lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import {
  UserIcon,
  BuildingIcon,
  MapPinIcon,
  PlaneIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  FileDownIcon,
  MailIcon,
  PhoneIcon,
  HomeIcon,
} from "lucide-react";
import { format } from "date-fns";

export default function ExpenseAuthorizationDetailsPage() {
  const { id } = useParams() as { id: string };

  const { data, isLoading } = useGetSingleExpenseAuthorizationQuery(
    id || "",
    !!id
  );

  const form = useForm();
  const [selectedAction, setSelectedAction] = useState<'review' | 'authorize' | 'approve' | 'security_clear' | 'security_reject' | null>(null);

  const { reviewExpenseAuthorization, isLoading: isReviewLoading } = useReviewExpenseAuthorization(id as string);
  const { authorizeExpenseAuthorization, isLoading: isAuthorizeLoading } = useAuthorizeExpenseAuthorization(id as string);
  const { approveExpenseAuthorization, isLoading: isApproveLoading } = useApproveExpenseAuthorization(id as string);
  const { securityClearanceExpenseAuthorization, isLoading: isSecurityLoading } = useSecurityClearanceExpenseAuthorization(id as string);

  const onSubmit = async (formData: any) => {
    if (!selectedAction) return;

    const comments = formData.comment || '';

    try {
      switch (selectedAction) {
        case 'review':
          await reviewExpenseAuthorization(comments);
          toast.success('Expense authorization reviewed successfully');
          break;
        case 'authorize':
          await authorizeExpenseAuthorization(comments);
          toast.success('Expense authorization authorized successfully');
          break;
        case 'approve':
          await approveExpenseAuthorization(comments);
          toast.success('Expense authorization approved successfully');
          break;
        case 'security_clear':
          await securityClearanceExpenseAuthorization('CLEARED', comments);
          toast.success('Security clearance approved successfully');
          break;
        case 'security_reject':
          await securityClearanceExpenseAuthorization('REJECTED', comments);
          toast.success('Security clearance rejected successfully');
          break;
      }

      form.reset();
      setSelectedAction(null);
      window.location.reload();

    } catch (error: any) {
      toast.error(error?.data?.message ?? 'Something went wrong');
    }
  };

  // Get status badge with icon
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any }> = {
      PENDING: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: ClockIcon },
      REVIEWED: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircleIcon },
      AUTHORIZED: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: CheckCircleIcon },
      APPROVED: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircleIcon },
      REJECTED: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircleIcon },
      COMPLETED: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircleIcon },
      CLOSED: { color: "bg-gray-100 text-gray-800 border-gray-200", icon: XCircleIcon },
      IN_PROGRESS: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircleIcon },
    };

    const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800 border-gray-200", icon: ClockIcon };
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={cn("font-medium", config.color)}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getSecurityBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any }> = {
      CLEARED: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircleIcon },
      REJECTED: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircleIcon },
      PENDING: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: ClockIcon },
    };

    const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800 border-gray-200", icon: ClockIcon };
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={cn("font-medium", config.color)}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  return (
    <div className='space-y-6'>
      <BackNavigation extraText='View Expense Authorization' />

      {isLoading ? (
        <Card>
          <CardContent className="py-20">
            <LoadingSpinner />
          </CardContent>
        </Card>
      ) : (
        data && (
          <>
            {/* Header Card with Summary */}
            <Card className="border-l-4 border-l-indigo-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-2xl font-bold text-gray-900">
                        Expense Authorization
                      </h1>
                      {getStatusBadge(data.data.status)}
                      {getSecurityBadge(data.data.security_clearance_status)}
                    </div>
                    <p className="text-sm text-gray-600">
                      EA Number: <span className="font-mono font-medium">{data.data.ta_number}</span>
                    </p>
                  </div>
                  <div className="text-right space-y-3">
                    {/* Generate EA Document Button - Only show when APPROVED */}
                    {data.data.status === "APPROVED" && (
                      <Link href={`/dashboard/admin/expense-authorization/${id}/ea-document`}>
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                          <FileDownIcon className="w-4 h-4 mr-2" />
                          Generate EA Document
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <UserIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Traveler Name</p>
                      <p className="font-medium text-gray-900">
                        {data.data.created_by.fullName || (data.data.created_by as any).full_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <MailIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">
                        {data.data.created_by.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <PhoneIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="font-medium text-gray-900">
                        {data.data.requestor_details?.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <BuildingIcon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="font-medium text-gray-900">
                        {data.data.department.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <PlaneIcon className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Traveler Type</p>
                      <p className="font-medium text-gray-900">
                        {data.data.traveler_type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <MapPinIcon className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">FCO</p>
                      <p className="font-medium text-gray-900">
                        {data.data.fco.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <HomeIcon className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium text-gray-900">
                        {data.data.address}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Destinations Section */}
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold text-gray-900">
                  Travel Destinations
                </h3>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <DataTable
                  columns={expenseAuthorizationDestinationColumns}
                  data={data.data.destinations || []}
                />
              </CardContent>
            </Card>

            {/* Special Requests */}
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold text-gray-900">
                  Special Requests
                </h3>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {[
                    { label: 'Travel advances based on State Department per diem rates', value: data.data.is_travel_advances_dependent },
                    { label: 'Documents needed more than 3 days prior to departure', value: data.data.is_document_needed },
                    { label: 'Car Rental', value: data.data.is_car_rental_allowed },
                    { label: 'Hotel Reservations', value: data.data.is_hotel_reservation_required },
                    { label: 'Hotel transfer/taxi/other transportation (International only)', value: data.data.is_hotel_transport_required },
                    { label: 'Managing Director Notified', value: data.data.is_managing_director_notified },
                  ].map((item, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-700 mb-2">{item.label}</p>
                      <Badge className={item.value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                        {item.value ? "Yes" : "No"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Approval History - Only show when there are approvals */}
            {data.data.approvals && data.data.approvals.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Approval History
                  </h3>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6 space-y-4">
                  {data.data.approvals.map((approval, index) => (
                    <div key={approval.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        {index < data.data.approvals.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 my-2" />
                        )}
                      </div>

                      <Card className="flex-1 border-l-4 border-l-blue-500">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <Badge variant="outline" className="mb-2">
                                {approval.approval_level}
                              </Badge>
                              <p className="font-semibold text-gray-900">
                                {approval.user.fullName || (approval.user as any).full_name || "N/A"}
                              </p>
                              <p className="text-sm text-gray-600">
                                {approval.user.email || ""}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                {format(new Date(approval.updated_datetime), "dd MMM yyyy")}
                              </p>
                              <p className="text-xs text-gray-500">
                                {format(new Date(approval.updated_datetime), "HH:mm")}
                              </p>
                            </div>
                          </div>
                          {approval.comments && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <p className="text-sm text-gray-700 italic">
                                "{approval.comments}"
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Approval Actions */}
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader className="bg-amber-50">
                <h3 className="text-xl font-semibold text-gray-900">
                  Approval Actions
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Select an action below to proceed with the approval workflow
                </p>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <Form {...form}>
                  <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
                    {/* Security Clearance Section */}
                    <div className='space-y-4'>
                      <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 rounded-full bg-green-100 flex items-center justify-center'>
                          <CheckCircleIcon className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className='text-md font-semibold text-gray-900'>Security Clearance (Optional)</h4>
                          <p className='text-xs text-gray-500'>Current Status: {data.data.security_clearance_status}</p>
                        </div>
                      </div>
                      <div className='pl-10 flex flex-wrap gap-3'>
                        <FormButton
                          type='button'
                          variant={selectedAction === 'security_clear' ? 'default' : 'outline'}
                          onClick={() => setSelectedAction('security_clear')}
                          disabled={data.data.security_clearance_status === 'CLEARED' || data.data.security_clearance_status === 'REJECTED'}
                          className={cn(
                            selectedAction === 'security_clear'
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'hover:bg-green-50 hover:text-green-700 hover:border-green-300'
                          )}
                        >
                          <CheckCircleIcon className="w-4 h-4 mr-2" />
                          Clear
                        </FormButton>

                        <FormButton
                          type='button'
                          variant={selectedAction === 'security_reject' ? 'default' : 'outline'}
                          onClick={() => setSelectedAction('security_reject')}
                          disabled={data.data.security_clearance_status === 'CLEARED' || data.data.security_clearance_status === 'REJECTED'}
                          className={cn(
                            selectedAction === 'security_reject'
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'hover:bg-red-50 hover:text-red-700 hover:border-red-300'
                          )}
                        >
                          <XCircleIcon className="w-4 h-4 mr-2" />
                          Reject
                        </FormButton>
                      </div>
                    </div>

                    <Separator />

                    {/* Regular Approval Section */}
                    <div className='space-y-4'>
                      <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center'>
                          <CheckCircleIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className='text-md font-semibold text-gray-900'>Workflow Approval</h4>
                          <p className='text-xs text-gray-500'>Current Status: {data.data.status}</p>
                        </div>
                      </div>
                      <div className='pl-10 grid grid-cols-1 md:grid-cols-3 gap-4'>
                        {/* Review Card */}
                        <button
                          type='button'
                          onClick={() => setSelectedAction('review')}
                          disabled={
                            data.data.status === 'REVIEWED' ||
                            data.data.status === 'AUTHORIZED' ||
                            data.data.status === 'APPROVED'
                          }
                          className={cn(
                            'p-4 rounded-lg border-2 text-left transition-all',
                            selectedAction === 'review'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50',
                            (data.data.status === 'REVIEWED' || data.data.status === 'AUTHORIZED' || data.data.status === 'APPROVED')
                              ? 'opacity-50 cursor-not-allowed'
                              : 'cursor-pointer'
                          )}
                        >
                          <div className='flex items-center gap-3 mb-2'>
                            <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center'>
                              <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className='font-semibold text-gray-900'>Review</p>
                              <p className='text-xs text-gray-500'>Step 1</p>
                            </div>
                          </div>
                          <p className='text-xs text-gray-600'>
                            {data.data.status === 'PENDING' ? 'Ready for review' : 'Already reviewed'}
                          </p>
                        </button>

                        {/* Authorize Card */}
                        <button
                          type='button'
                          onClick={() => setSelectedAction('authorize')}
                          disabled={
                            data.data.status !== 'REVIEWED' && data.data.status !== 'PENDING'
                          }
                          className={cn(
                            'p-4 rounded-lg border-2 text-left transition-all',
                            selectedAction === 'authorize'
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50',
                            (data.data.status !== 'REVIEWED' && data.data.status !== 'PENDING')
                              ? 'opacity-50 cursor-not-allowed'
                              : 'cursor-pointer'
                          )}
                        >
                          <div className='flex items-center gap-3 mb-2'>
                            <div className='w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center'>
                              <CheckCircleIcon className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className='font-semibold text-gray-900'>Authorize</p>
                              <p className='text-xs text-gray-500'>Step 2</p>
                            </div>
                          </div>
                          <p className='text-xs text-gray-600'>
                            {data.data.status === 'REVIEWED' || data.data.status === 'PENDING' ? 'Ready for authorization' : data.data.status === 'AUTHORIZED' ? 'Already authorized' : 'Needs review first'}
                          </p>
                        </button>

                        {/* Approve Card */}
                        <button
                          type='button'
                          onClick={() => setSelectedAction('approve')}
                          disabled={
                            data.data.status !== 'AUTHORIZED'
                          }
                          className={cn(
                            'p-4 rounded-lg border-2 text-left transition-all',
                            selectedAction === 'approve'
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-green-300 hover:bg-green-50',
                            data.data.status !== 'AUTHORIZED'
                              ? 'opacity-50 cursor-not-allowed'
                              : 'cursor-pointer'
                          )}
                        >
                          <div className='flex items-center gap-3 mb-2'>
                            <div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center'>
                              <CheckCircleIcon className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className='font-semibold text-gray-900'>Approve</p>
                              <p className='text-xs text-gray-500'>Step 3</p>
                            </div>
                          </div>
                          <p className='text-xs text-gray-600'>
                            {data.data.status === 'AUTHORIZED' ? 'Ready for final approval' : data.data.status === 'APPROVED' ? 'Already approved' : 'Needs authorization first'}
                          </p>
                        </button>
                      </div>
                    </div>

                    {selectedAction && (
                      <>
                        <Separator />

                        <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
                          <h5 className='font-semibold text-gray-900 mb-3'>
                            {selectedAction === 'review' && 'Submit Review'}
                            {selectedAction === 'authorize' && 'Submit Authorization'}
                            {selectedAction === 'approve' && 'Submit Approval'}
                            {selectedAction === 'security_clear' && 'Submit Security Clearance'}
                            {selectedAction === 'security_reject' && 'Submit Security Rejection'}
                          </h5>

                          <FormTextArea
                            label='Comment'
                            name='comment'
                            placeholder={`Enter your comment for ${selectedAction.replace('_', ' ')}`}
                            required
                          />

                          <div className='flex gap-3 mt-4'>
                            <FormButton
                              type='submit'
                              className={cn(
                                'flex-1',
                                selectedAction === 'security_clear' && 'bg-green-600 hover:bg-green-700',
                                selectedAction === 'security_reject' && 'bg-red-600 hover:bg-red-700',
                                (selectedAction === 'review' || selectedAction === 'authorize' || selectedAction === 'approve') && 'bg-blue-600 hover:bg-blue-700'
                              )}
                              size='lg'
                              loading={isReviewLoading || isAuthorizeLoading || isApproveLoading || isSecurityLoading}
                            >
                              <CheckCircleIcon className="w-4 h-4 mr-2" />
                              Confirm {selectedAction === 'review' && 'Review'}
                              {selectedAction === 'authorize' && 'Authorization'}
                              {selectedAction === 'approve' && 'Approval'}
                              {selectedAction === 'security_clear' && 'Security Clearance'}
                              {selectedAction === 'security_reject' && 'Security Rejection'}
                            </FormButton>

                            <FormButton
                              type='button'
                              variant='outline'
                              size='lg'
                              onClick={() => {
                                setSelectedAction(null);
                                form.reset();
                              }}
                            >
                              <XCircleIcon className="w-4 h-4 mr-2" />
                              Cancel
                            </FormButton>
                          </div>
                        </div>
                      </>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>
          </>
        )
      )}
    </div>
  );
}
