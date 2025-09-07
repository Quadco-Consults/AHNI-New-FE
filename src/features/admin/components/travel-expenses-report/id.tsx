"use client";

import BackNavigation from "components/atoms/BackNavigation";
import FormButton from "@/components/FormButton";
import FormTextArea from "components/atoms/FormTextArea";
import Card from "components/Card";
import DescriptionCard from "components/DescriptionCard";
import { LoadingSpinner } from "components/Loading";
import { CardContent, CardHeader } from "components/ui/card";
import { format } from "date-fns";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import {
  useGetSingleTravelExpenseQuery,
  useReviewTravelExpense,
  useAuthorizeTravelExpense,
  useApproveTravelExpense,
} from "@/features/admin/controllers/travelExpenseController";
import { formatNumberCurrency } from "utils/utls";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import { toast } from "sonner";
import { Separator } from "components/ui/separator";
import { useState } from "react";

interface ApprovalFormData {
  comments: string;
}

export default function TravelExpenseDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [activeApprovalLevel, setActiveApprovalLevel] = useState<string | null>(
    null
  );

  const { data, isLoading, refetch } = useGetSingleTravelExpenseQuery(
    id as string,
    !!id
  );

  const { reviewTravelExpense, isLoading: isReviewing } =
    useReviewTravelExpense();
  const { authorizeTravelExpense, isLoading: isAuthorizing } =
    useAuthorizeTravelExpense();
  const { approveTravelExpense, isLoading: isApproving } =
    useApproveTravelExpense();

  const form = useForm<ApprovalFormData>({
    defaultValues: {
      comments: "",
    },
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-200 text-yellow-800";
      case "REVIEWED":
        return "bg-blue-200 text-blue-800";
      case "AUTHORIZED":
        return "bg-purple-200 text-purple-800";
      case "APPROVED":
        return "bg-green-200 text-green-800";
      case "REJECTED":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const handleApproval: SubmitHandler<ApprovalFormData> = async (formData) => {
    if (!activeApprovalLevel || !id) return;

    try {
      const payload = {
        id: id as string,
        body: { comments: formData.comments },
      };

      switch (activeApprovalLevel) {
        case "REVIEW":
          await reviewTravelExpense(payload);
          toast.success("Travel Expense Report Reviewed Successfully");
          break;
        case "AUTHORIZE":
          await authorizeTravelExpense(payload);
          toast.success("Travel Expense Report Authorized Successfully");
          break;
        case "APPROVE":
          await approveTravelExpense(payload);
          toast.success("Travel Expense Report Approved Successfully");
          break;
      }

      setActiveApprovalLevel(null);
      form.reset();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  const getNextApprovalLevel = () => {
    if (!data?.data.approvals) return null;

    const approvals = data.data.approvals;
    const reviewApproval = approvals.find(
      (approval) => approval.approval_level === "REVIEW"
    );
    const authorizeApproval = approvals.find(
      (approval) => approval.approval_level === "AUTHORIZE"
    );
    const approveApproval = approvals.find(
      (approval) => approval.approval_level === "APPROVE"
    );

    console.log({
      approvals,
      data,
      reviewApproval: reviewApproval?.is_executed,
    });
    if (!reviewApproval?.is_executed) return "REVIEW";
    if (!authorizeApproval?.is_executed) return "AUTHORIZE";
    if (!approveApproval?.is_executed) return "APPROVE";
    return null;
  };

  return (
    <div>
      <BackNavigation />

      <Card>
        <CardHeader className='font-bold'>
          Travel Expense Report Details
        </CardHeader>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          data && (
            <CardContent className='space-y-10'>
              <div className='grid grid-cols-4 gap-10'>
                <DescriptionCard
                  label='User'
                  description={`${data.data.user.first_name} ${data.data.user.last_name}`}
                />

                <DescriptionCard
                  label='Staff ID No'
                  description={data.data.staff_id}
                />

                <DescriptionCard
                  label='Purpose of Travel'
                  description={data.data.travel_purpose}
                />

                <div className='space-y-2'>
                  <h4 className='text-sm font-medium text-gray-600'>Status</h4>
                  <Badge
                    className={cn(
                      "px-3 py-1 text-sm font-medium",
                      getStatusBadgeColor(data.data.status)
                    )}
                  >
                    {data.data.status}
                  </Badge>
                </div>
              </div>

              {data?.data.activities.map(
                (
                  {
                    id: activityId,
                    date,
                    activity,
                    departure_datetime,
                    departure_point,
                    arrival_datetime,
                    assignment_location,
                    visa_free,
                    airport_taxi_fee,
                    registration_fee,
                    inter_city_taxi_fee,
                    total_amount,
                    others,
                  },
                  index
                ) => (
                  <div key={activityId} className='space-y-5'>
                    <h3 className='font-bold text-xl'>Day {index + 1}</h3>

                    <div className='grid grid-cols-3 gap-10'>
                      <DescriptionCard label='Date' description={date} />

                      <DescriptionCard
                        label='Activity'
                        description={activity}
                      />

                      <DescriptionCard
                        label='Departure Date'
                        description={format(departure_datetime, "dd-MMM-yyyy")}
                      />

                      <DescriptionCard
                        label='Point of Departure'
                        description={departure_point}
                      />

                      <DescriptionCard
                        label='Arrival Date'
                        description={format(arrival_datetime, "dd-MMM-yyyy")}
                      />

                      <DescriptionCard
                        label='Assignment Location'
                        description={assignment_location}
                      />

                      <DescriptionCard
                        label='Visa Free'
                        description={`${visa_free ? "YES" : "NO"}`}
                      />

                      <DescriptionCard
                        label='Airport Taxi Fee'
                        description={formatNumberCurrency(
                          airport_taxi_fee,
                          "USD"
                        )}
                      />

                      <DescriptionCard
                        label='Registration Fee'
                        description={formatNumberCurrency(
                          registration_fee,
                          "USD"
                        )}
                      />

                      <DescriptionCard
                        label='Taxi fare within /Between cities'
                        description={formatNumberCurrency(
                          inter_city_taxi_fee,
                          "USD"
                        )}
                      />

                      <DescriptionCard
                        label='Total Amount'
                        description={formatNumberCurrency(total_amount, "USD")}
                      />

                      <DescriptionCard label='Others' description={others} />

                      <DescriptionCard
                        label='Total Cost'
                        description={`$${
                          Number(airport_taxi_fee) +
                          Number(registration_fee) +
                          Number(inter_city_taxi_fee) +
                          Number(total_amount)
                        }`}
                      />
                    </div>
                  </div>
                )
              )}

              <Separator className='my-10' />

              {/* Approvals Section */}
              {data.data.approvals && data.data.approvals.length > 0 && (
                <div className='space-y-6'>
                  <h3 className='text-lg font-bold'>Approval Workflow</h3>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {data.data.approvals.map((approval) => (
                      <Card key={approval.id} className='p-4'>
                        <div className='space-y-4'>
                          <div className='flex items-center justify-between'>
                            <h4 className='font-semibold text-sm'>
                              {approval.approval_level === "REVIEW" && "Review"}
                              {approval.approval_level === "AUTHORIZE" &&
                                "Authorize"}
                              {approval.approval_level === "APPROVE" &&
                                "Approve"}
                            </h4>
                            <Badge
                              className={cn(
                                "text-xs px-2 py-1",
                                approval.is_executed
                                  ? "bg-green-200 text-green-800"
                                  : "bg-yellow-200 text-yellow-800"
                              )}
                            >
                              {approval.is_executed ? "COMPLETED" : "PENDING"}
                            </Badge>
                          </div>

                          <DescriptionCard
                            label='Assigned To'
                            description={approval.user.full_name}
                          />

                          {approval.comments && (
                            <DescriptionCard
                              label='Comments'
                              description={approval.comments}
                            />
                          )}

                          {approval.is_executed && (
                            <DescriptionCard
                              label='Date Completed'
                              description={format(
                                new Date(approval.updated_datetime),
                                "dd-MMM-yyyy HH:mm"
                              )}
                            />
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Approval Action Form */}
              {(() => {
                const nextLevel = getNextApprovalLevel();
                console.log({ nextLevel });

                if (!nextLevel) return null;

                return (
                  <div className='space-y-6'>
                    <Separator className='my-10' />

                    <div className='space-y-4'>
                      <h3 className='text-lg font-bold'>
                        {nextLevel === "REVIEW" &&
                          "Review Travel Expense Report"}
                        {nextLevel === "AUTHORIZE" &&
                          "Authorize Travel Expense Report"}
                        {nextLevel === "APPROVE" &&
                          "Approve Travel Expense Report"}
                      </h3>

                      <FormProvider {...form}>
                        <form
                          onSubmit={form.handleSubmit(handleApproval)}
                          className='space-y-5'
                        >
                          <FormTextArea
                            label='Comments'
                            name='comments'
                            placeholder='Enter your comments'
                            required
                          />

                          <div className='flex gap-4'>
                            <FormButton
                              size='lg'
                              type='submit'
                              onClick={() => setActiveApprovalLevel(nextLevel)}
                              loading={
                                isReviewing || isAuthorizing || isApproving
                              }
                              className='bg-green-600 hover:bg-green-700'
                            >
                              {nextLevel === "REVIEW" && "Review"}
                              {nextLevel === "AUTHORIZE" && "Authorize"}
                              {nextLevel === "APPROVE" && "Approve"}
                            </FormButton>
                          </div>
                        </form>
                      </FormProvider>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          )
        )}
      </Card>
    </div>
  );
}

/* 

  <table className="table-auto border-collapse w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-2">Travel Activities</th>
                                <th className="px-4 py-2">Day 1</th>
                                <th className="px-4 py-2">Day 2</th>
                                <th className="px-4 py-2">Day 3</th>
                                <th className="px-4 py-2">Day 4</th>
                                <th className="px-4 py-2">Cost Claimed</th>
                                <th className="px-4 py-2">Cost Allowed</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr className="border-b">
                                <td className="px-4 py-2">
                                    Point of Departure
                                </td>
                            </tr>

                            <tr className="border-b">
                                <td className="px-4 py-2">Time of Departure</td>
                            </tr>

                            <tr className="border-b">
                                <td className="px-4 py-2">
                                    Point of Departure
                                </td>
                            </tr>

                            <tr className="border-b">
                                <td className="px-4 py-2">Time of Arrival</td>
                            </tr>

                            <tr className="border-b">
                                <td className="px-4 py-2">
                                    Assignment Location
                                </td>
                            </tr>

                            <tr className="border-b">
                                <td className="px-4 py-2">Balance b/f</td>
                            </tr>

                            <tr className="border-b">
                                <td className="px-4 py-2">Mileage (#30KM)</td>
                            </tr>

                            <tr className="border-b">
                                <td className="px-4 py-2">Airport Taxi</td>
                            </tr>

                            <tr className="border-b">
                                <td className="px-4 py-2">Visa Free</td>
                            </tr>

                            <tr className="border-b">
                                <td className="px-4 py-2">
                                    Hotel Accomodation
                                </td>
                            </tr>

                            <tr className="border-b">
                                <td className="px-4 py-2">
                                    Per Diem (less provided meals)DSA
                                    </td>
                                    </tr>
        
                                    <tr className="border-b">
                                        <td className="px-4 py-2">Registration</td>
                                    </tr>
        
                                    <tr className="border-b">
                                        <td className="px-4 py-2">Communication</td>
                                    </tr>
        
                                    <tr className="border-b">
                                        <td className="px-4 py-2">
                                            Taxi Between Cities
                                        </td>
                                    </tr>
        
                                    <tr className="border-b">
                                        <td className="px-4 py-2">
                                            Taxi Within Cities
                                        </td>
                                    </tr>
        
                                    <tr className="border-b">
                                        <td className="px-4 py-2">
                                            Other (Group Launch)
                                        </td>
                                    </tr>
        
                                    <tr className="border-b"></tr>
        
                                    <tr className="border-b">
                                        <td className="px-4 py-2">TOTAL COST</td>
                                    </tr>
                                </tbody>
                            </table>

*/
