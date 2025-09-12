"use client";

import FormButton from "@/components/FormButton";
import FormTextArea from "components/atoms/FormTextArea";
import Card from "components/Card";
import DescriptionCard from "components/DescriptionCard";
import GoBack from "components/GoBack";
import { LoadingSpinner } from "components/Loading";
// import { expenseAuthorizationDestinationColumns } from "components/Table/columns/admin/expense-authorization/expense-authorization-destinations";
import DataTable from "components/Table/DataTable";
import { CardContent, CardHeader } from "components/ui/card";
import { Form } from "components/ui/form";
import { Badge } from "components/ui/badge";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { useGetSingleExpenseAuthorizationQuery, useReviewExpenseAuthorization, useAuthorizeExpenseAuthorization, useApproveExpenseAuthorization, useSecurityClearanceExpenseAuthorization } from "@/features/admin/controllers/expenseAuthorizationController";
import { expenseAuthorizationDestinationColumns } from "../table-columns/expense-authorization/expense-authorization-destinations";
import { cn } from "lib/utils";
import { toast } from "sonner";
import { useState } from "react";

export default function ExpenseAuthorizationDetailsPage() {
  const { id } = useParams();

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
      
      // Reset form and selected action
      form.reset();
      setSelectedAction(null);
      
      // Refetch data to show updated status
      window.location.reload();
      
    } catch (error: any) {
      toast.error(error?.data?.message ?? 'Something went wrong');
    }
  };

  return (
    <div className='space-y-4'>
      <GoBack />

      <Card>
        <CardHeader className='font-bold text-lg'>
          Expense Authorization Details
        </CardHeader>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          data && (
            <CardContent className='space-y-10'>
              <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
                <DescriptionCard
                  label='Projects'
                  description={
                    data?.data?.destinations && data.data.destinations.length > 0
                      ? data.data.destinations.map(dest => dest.project?.title || 'N/A').join(', ')
                      : 'N/A'
                  }
                />

                <DescriptionCard 
                  label='Project IDs' 
                  description={
                    data?.data?.destinations && data.data.destinations.length > 0
                      ? data.data.destinations.map(dest => dest.project?.project_id || 'N/A').join(', ')
                      : 'N/A'
                  }
                />

                <DescriptionCard
                  label='Full Name'
                  description={data?.data.created_by.fullName || (data?.data.created_by as any).full_name}
                />
                <DescriptionCard
                  label='Email'
                  description={data?.data.created_by.email}
                />

                <DescriptionCard
                  label='Phone Number'
                  description={data?.data.requestor_details?.phone || 'N/A'}
                />

                <DescriptionCard
                  label='Address'
                  description={data?.data.address}
                />

                <DescriptionCard
                  label='EA Number'
                  description={data?.data.ta_number}
                />

                <DescriptionCard
                  label='Department'
                  description={data?.data.department.name}
                />

                <DescriptionCard
                  label='Cities'
                  description={
                    data?.data?.destinations && data.data.destinations.length > 0
                      ? data.data.destinations.map(dest => `${dest.city}, ${dest.state}`).join('; ')
                      : 'N/A'
                  }
                />

                <DescriptionCard
                  label='FCO'
                  description={data?.data.fco.name}
                />

                <DescriptionCard
                  label='Travel Dates'
                  description={
                    data?.data?.destinations && data.data.destinations.length > 0
                      ? data.data.destinations.map(dest => 
                          `${dest.arrival_date} to ${dest.departure_date}`
                        ).join('; ')
                      : 'N/A'
                  }
                />

                <DescriptionCard
                  label='Traveler Type'
                  description={data?.data.traveler_type}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div>
                    <Badge
                      variant='default'
                      className={cn(
                        "p-2 rounded-lg",
                        data?.data.status === "IN_PROGRESS" && "bg-green-200 text-green-700",
                        data?.data.status === "COMPLETED" && "bg-blue-200 text-blue-700", 
                        data?.data.status === "CLOSED" && "bg-red-200 text-red-700",
                        data?.data.status === "PENDING" && "bg-yellow-200 text-yellow-700",
                        data?.data.status === "APPROVED" && "bg-green-200 text-green-700",
                        data?.data.status === "REJECTED" && "bg-red-200 text-red-700",
                        data?.data.status === "REVIEWED" && "bg-blue-200 text-blue-700",
                        data?.data.status === "AUTHORIZED" && "bg-purple-200 text-purple-700",
                        data?.data.status === "On Hold" && "bg-gray-200 text-gray-700"
                      )}
                    >
                      {data?.data.status || "N/A"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Security Clearance</label>
                  <div>
                    <Badge
                      variant='default'
                      className={cn(
                        "p-2 rounded-lg",
                        data?.data.security_clearance_status === "CLEARED" && "bg-green-200 text-green-700",
                        data?.data.security_clearance_status === "REJECTED" && "bg-red-200 text-red-700",
                        data?.data.security_clearance_status === "PENDING" && "bg-yellow-200 text-yellow-700"
                      )}
                    >
                      {data?.data.security_clearance_status || "N/A"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className='space-y-5'>
                <h3 className='text-lg font-bold'>Special Requests</h3>

                <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
                  <DescriptionCard
                    label='Travel advances are based on current State Department per diem rates which are updated on a monthly basis or approved local rates for the projects'
                    description={
                      data?.data.is_travel_advances_dependent ? "Yes" : "No"
                    }
                  />

                  <DescriptionCard
                    label='Documents needed more than 3 days prior to departure?'
                    description={data?.data.is_document_needed ? "Yes" : "No"}
                  />

                  <DescriptionCard
                    label='Car Rental?'
                    description={
                      data?.data.is_car_rental_allowed ? "Yes" : "No"
                    }
                  />

                  <DescriptionCard
                    label='Hotel Reservations?'
                    description={
                      data?.data.is_hotel_reservation_required ? "Yes" : "No"
                    }
                  />

                  <DescriptionCard
                    label='Hotel transfer/taxi/other transportation needed (International travel only)'
                    description={
                      data?.data.is_hotel_transport_required ? "Yes" : "No"
                    }
                  />

                  <DescriptionCard
                    label='Is Managing Director Notified?'
                    description={
                      data?.data.is_managing_director_notified ? "Yes" : "No"
                    }
                  />
                </div>
              </div>

              {/* Approvals Section */}
              <div className='space-y-5'>
                <h3 className='text-lg font-bold'>Approval Status</h3>
                <div className='space-y-3'>
                  {data?.data?.approvals && data.data.approvals.length > 0 ? (
                    data.data.approvals.map((approval) => (
                      <div key={approval.id} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                        <div className='space-y-1'>
                          <div className='flex items-center gap-2'>
                            <span className='font-medium'>{approval.approval_level}</span>
                            <Badge
                              className={cn(
                                'text-xs',
                                approval.approved === true && 'bg-green-200 text-green-700',
                                approval.approved === false && 'bg-red-200 text-red-700',
                                approval.approved === null && 'bg-yellow-200 text-yellow-700'
                              )}
                            >
                              {approval.approved === true ? 'Approved' : approval.approved === false ? 'Rejected' : 'Pending'}
                            </Badge>
                          </div>
                          <p className='text-sm text-gray-600'>
                            {approval.user.fullName || (approval.user as any).full_name || 'Unknown User'}
                          </p>
                          {approval.comments && (
                            <p className='text-sm text-gray-500'>Comment: {approval.comments}</p>
                          )}
                        </div>
                        <span className='text-xs text-gray-400'>
                          {new Date(approval.updated_datetime).toLocaleDateString("en-US")}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className='text-gray-500'>No approvals yet</p>
                  )}
                </div>
              </div>

              <div className='space-y-5'>
                <h3 className='text-lg font-bold'>Destinations</h3>

                <DataTable
                  columns={expenseAuthorizationDestinationColumns}
                  data={data?.data?.destinations || []}
                />
              </div>

              <Form {...form}>
                <form
                  className='space-y-4'
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className='space-y-4'>
                    <h3 className='text-lg font-bold'>Approval Actions</h3>
                    
                    {/* Security Clearance Section */}
                    <div className='space-y-3'>
                      <h4 className='text-md font-semibold text-gray-700'>Security Clearance</h4>
                      <div className='flex flex-wrap gap-3'>
                        <FormButton
                          type='button'
                          variant={selectedAction === 'security_clear' ? 'default' : 'outline'}
                          onClick={() => setSelectedAction('security_clear')}
                          disabled={data?.data?.security_clearance_status === 'CLEARED' || data?.data?.security_clearance_status === 'REJECTED'}
                          className='bg-green-600 hover:bg-green-700 text-white'
                        >
                          Security Clear
                        </FormButton>
                        
                        <FormButton
                          type='button'
                          variant={selectedAction === 'security_reject' ? 'default' : 'outline'}
                          onClick={() => setSelectedAction('security_reject')}
                          disabled={data?.data?.security_clearance_status === 'CLEARED' || data?.data?.security_clearance_status === 'REJECTED'}
                          className='bg-red-600 hover:bg-red-700 text-white'
                        >
                          Security Reject
                        </FormButton>
                      </div>
                    </div>

                    {/* Regular Approval Section */}
                    <div className='space-y-3'>
                      <h4 className='text-md font-semibold text-gray-700'>Workflow Approval</h4>
                      <div className='flex flex-wrap gap-3'>
                        <FormButton
                          type='button'
                          variant={selectedAction === 'review' ? 'default' : 'outline'}
                          onClick={() => setSelectedAction('review')}
                          disabled={
                            data?.data?.status === 'REVIEWED' || 
                            data?.data?.status === 'AUTHORIZED' || 
                            data?.data?.status === 'APPROVED' ||
                            data?.data?.security_clearance_status !== 'CLEARED'
                          }
                        >
                          Review
                        </FormButton>
                        
                        <FormButton
                          type='button'
                          variant={selectedAction === 'authorize' ? 'default' : 'outline'}
                          onClick={() => setSelectedAction('authorize')}
                          disabled={
                            (data?.data?.status !== 'REVIEWED' && data?.data?.status !== 'PENDING') ||
                            data?.data?.security_clearance_status !== 'CLEARED'
                          }
                        >
                          Authorize
                        </FormButton>
                        
                        <FormButton
                          type='button'
                          variant={selectedAction === 'approve' ? 'default' : 'outline'}
                          onClick={() => setSelectedAction('approve')}
                          disabled={
                            data?.data?.status !== 'AUTHORIZED' ||
                            data?.data?.security_clearance_status !== 'CLEARED'
                          }
                        >
                          Approve
                        </FormButton>
                      </div>

                      {data?.data?.security_clearance_status !== 'CLEARED' && (
                        <div className='p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
                          <p className='text-sm text-yellow-800'>
                            ⚠️ Security clearance must be approved before proceeding with workflow approvals.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                    {selectedAction && (
                      <>
                        <FormTextArea
                          label='Comment'
                          name='comment'
                          placeholder={`Enter comment for ${selectedAction}`}
                          required
                        />

                        <div className='flex gap-3'>
                          <FormButton
                            type='submit'
                            className='bg-green-500 hover:bg-green-600'
                            size='lg'
                            loading={isReviewLoading || isAuthorizeLoading || isApproveLoading || isSecurityLoading}
                          >
                            {selectedAction === 'review' && 'Submit Review'}
                            {selectedAction === 'authorize' && 'Submit Authorization'}
                            {selectedAction === 'approve' && 'Submit Approval'}
                            {selectedAction === 'security_clear' && 'Submit Security Clearance'}
                            {selectedAction === 'security_reject' && 'Submit Security Rejection'}
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
                            Cancel
                          </FormButton>
                        </div>
                      </>
                    )}
                </form>
              </Form>
            </CardContent>
          )
        )}
      </Card>
    </div>
  );
}
