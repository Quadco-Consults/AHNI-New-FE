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
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import { toast } from "sonner";
import { Separator } from "components/ui/separator";
import { useState, useEffect } from "react";
import DocumentCard from "@/features/projects/components/projects/create/DocumentCard";

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

  // Debug: Log the data we receive from the API
  useEffect(() => {
    if (data?.data) {
      console.log('📊 TER DETAILS PAGE DATA:', data.data);
      console.log('🔍 DETAILED TER BREAKDOWN:');
      console.log('  📋 Basic Info:', {
        id: data.data.id,
        user: data.data.user,
        staff_id: data.data.staff_id,
        travel_purpose: data.data.travel_purpose,
        status: data.data.status,
        created_datetime: data.data.created_datetime,
        updated_datetime: data.data.updated_datetime,
      });
      console.log('  📄 Document:', data.data.document || 'NO DOCUMENT');
      console.log('  👥 Approvals:', data.data.approvals?.map(approval => ({
        level: approval.approval_level,
        user: approval.user.full_name,
        is_executed: approval.is_executed,
        comments: approval.comments,
      })));
      console.log('  🏃 Activities Count:', data.data.activities?.length || 0);
      console.log('  🏃 Activities Details:', data.data.activities?.map((activity, index) => ({
        [`Day ${index + 1}`]: {
          id: activity.id,
          date: activity.date,
          activity: activity.activity,
          departure_datetime: activity.departure_datetime,
          departure_point: activity.departure_point,
          arrival_datetime: activity.arrival_datetime,
          assignment_location: activity.assignment_location,
          visa_free: activity.visa_free,
          airport_taxi_fee: activity.airport_taxi_fee,
          registration_fee: activity.registration_fee,
          inter_city_taxi_fee: activity.inter_city_taxi_fee,
          total_amount: activity.total_amount,
          others: activity.others,
        }
      })));
    }
  }, [data]);

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
                  description={data.data.user?.full_name || 'N/A'}
                />

                <DescriptionCard
                  label='Staff ID No'
                  description={data.data.staff_id || 'N/A'}
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

              {/* Document Section */}
              <div className='space-y-4'>
                <h3 className='font-bold text-xl text-center'>Supporting Documents</h3>

                {/* Debug Information */}
                <div className='bg-gray-100 p-4 rounded border'>
                  <h4 className='font-semibold mb-2'>Debug Info:</h4>
                  <p>Document exists: {(data?.data.document || data?.data.document_url) ? 'YES' : 'NO'}</p>
                  <p>Document URL: {data?.data.document || data?.data.document_url || 'null'}</p>
                  <p>Document type: {typeof (data?.data.document || data?.data.document_url)}</p>
                </div>

                {(data?.data.document || data?.data.document_url) ? (
                  <div className='border-2 border-black shadow-sm p-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                      <DocumentCard
                        id={data.data.id}
                        title='Travel Expense Report Document'
                        file={data.data.document || data.data.document_url || ''}
                        onLoadSuccess={() => {}}
                        pageNumber={1}
                        uploadedDateTime={data.data.created_datetime}
                        showDeleteIcon={false}
                      />
                    </div>
                  </div>
                ) : (
                  <div className='border-2 border-red-300 bg-red-50 shadow-sm p-4 text-center'>
                    <p className='text-red-600'>No document found for this travel expense report.</p>
                  </div>
                )}
              </div>

              {/* Travel Expense Report Table View */}
              <div className="space-y-6">
                <h3 className="font-bold text-xl text-center">Travel Expense Report</h3>

                {/* Header Information Table */}
                <div className="border-2 border-black shadow-sm">
                  <table className="w-full border-collapse table-fixed">
                    <tbody>
                      <tr>
                        <td className="border border-black px-3 py-2 font-semibold bg-gray-100 text-sm w-[15%]">Name:</td>
                        <td className="border border-black px-3 py-2 text-sm w-[20%]">{data.data.user?.full_name || 'N/A'}</td>
                        <td className="border border-black px-3 py-2 font-semibold bg-gray-100 text-sm w-[15%]">Staff ID No.:</td>
                        <td className="border border-black px-3 py-2 text-sm w-[15%]">{data.data.staff_id || 'N/A'}</td>
                        <td className="border border-black px-3 py-2 font-semibold bg-gray-100 text-sm w-[18%]">Date Submitted:</td>
                        <td className="border border-black px-3 py-2 text-sm w-[17%]">{format(new Date(data.data.created_datetime), "dd-MMM-yy")}</td>
                      </tr>
                      <tr>
                        <td className="border border-black px-3 py-2 font-semibold bg-gray-100 text-sm">Purpose of Travel:</td>
                        <td className="border border-black px-3 py-2 text-sm" colSpan={3}>{data.data.travel_purpose}</td>
                        <td className="border border-black px-3 py-2 font-semibold bg-gray-100 text-sm">Travel Dates:</td>
                        <td className="border border-black px-3 py-2 text-sm">
                          {data.data.activities && data.data.activities.length > 0 && `${data.data.activities[0].date} - ${data.data.activities[data.data.activities.length - 1].date}`}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Main Travel Activities Table */}
                <div className="border-2 border-black shadow-sm overflow-x-auto">
                  <table className="w-full border-collapse text-xs min-w-max">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-black px-2 py-3 font-semibold text-left min-w-[160px] sticky left-0 bg-gray-100 z-10">(Enter date) →</th>
                        {data.data.activities?.map((activity) => (
                          <th key={activity.id} className="border border-black px-2 py-3 font-semibold text-center min-w-[120px]">
                            <div className="text-xs">
                              <div className="font-bold">{format(new Date(activity.date), "EEEE")}</div>
                              <div className="text-[10px] mt-1">{format(new Date(activity.date), "dd-MMM-yy")}</div>
                            </div>
                          </th>
                        )) || []}
                        <th className="border border-black px-2 py-3 font-semibold bg-yellow-100 text-center min-w-[120px]">
                          <div className="text-xs font-bold">Costs Claimed</div>
                        </th>
                        <th className="border border-black px-2 py-3 font-semibold bg-yellow-100 text-center min-w-[120px]">
                          <div className="text-xs font-bold">Costs Allowed</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-black px-3 py-2 font-semibold bg-gray-50 text-xs sticky left-0 bg-gray-50">Point of Departure</td>
                        {data.data.activities?.map((activity) => (
                          <td key={activity.id} className="border border-black px-2 py-2 text-center text-xs">{activity.departure_point || "-"}</td>
                        )) || []}
                        <td className="border border-black px-2 py-2 bg-gray-50"></td>
                        <td className="border border-black px-2 py-2 bg-gray-50"></td>
                      </tr>
                      <tr>
                        <td className="border border-black px-3 py-2 font-semibold bg-gray-50 text-xs sticky left-0 bg-gray-50">Time of Departure</td>
                        {data.data.activities?.map((activity) => (
                          <td key={activity.id} className="border border-black px-2 py-2 text-center text-xs">
                            {activity.departure_datetime ? format(new Date(activity.departure_datetime), "H:mm") : "-"}
                          </td>
                        )) || []}
                        <td className="border border-black px-2 py-2 bg-gray-50"></td>
                        <td className="border border-black px-2 py-2 bg-gray-50"></td>
                      </tr>
                      <tr>
                        <td className="border border-black px-3 py-2 font-semibold bg-gray-50 text-xs sticky left-0 bg-gray-50">Point of Arrival</td>
                        {data.data.activities?.map((activity) => (
                          <td key={activity.id} className="border border-black px-2 py-2 text-center text-xs">{activity.assignment_location || "-"}</td>
                        )) || []}
                        <td className="border border-black px-2 py-2 bg-gray-50"></td>
                        <td className="border border-black px-2 py-2 bg-gray-50"></td>
                      </tr>
                      <tr>
                        <td className="border border-black px-3 py-2 font-semibold bg-gray-50 text-xs sticky left-0 bg-gray-50">Time of Arrival</td>
                        {data.data.activities?.map((activity) => (
                          <td key={activity.id} className="border border-black px-2 py-2 text-center text-xs">
                            {activity.arrival_datetime ? format(new Date(activity.arrival_datetime), "H:mm") : "-"}
                          </td>
                        )) || []}
                        <td className="border border-black px-2 py-2 bg-gray-50"></td>
                        <td className="border border-black px-2 py-2 bg-gray-50"></td>
                      </tr>
                      <tr>
                        <td className="border border-black px-3 py-2 font-semibold bg-gray-50 text-xs sticky left-0 bg-gray-50">Assignment Location</td>
                        {data.data.activities?.map((activity) => (
                          <td key={activity.id} className="border border-black px-2 py-2 text-center text-xs">{activity.assignment_location || "-"}</td>
                        )) || []}
                        <td className="border border-black px-2 py-2 bg-gray-50"></td>
                        <td className="border border-black px-2 py-2 bg-gray-50"></td>
                      </tr>
                      <tr>
                        <td className="border border-black px-3 py-2 font-semibold bg-gray-50 text-xs sticky left-0 bg-gray-50">Balance b/f</td>
                        {data.data.activities?.map((activity) => (
                          <td key={activity.id} className="border border-black px-2 py-2 text-center text-xs text-gray-600">NGN 0.00</td>
                        )) || []}
                        <td className="border border-black px-2 py-2 bg-gray-50"></td>
                        <td className="border border-black px-2 py-2 bg-gray-50"></td>
                      </tr>
                      <tr>
                        <td className="border border-black px-3 py-2 font-semibold bg-gray-50 text-xs sticky left-0 bg-gray-50">Airport Taxi</td>
                        {data.data.activities?.map((activity) => (
                          <td key={activity.id} className="border border-black px-2 py-2 text-center text-xs font-medium">
                            {activity.airport_taxi_fee ? `NGN ${Number(activity.airport_taxi_fee).toLocaleString()}` : "-"}
                          </td>
                        )) || []}
                        <td className="border border-black px-2 py-2 text-center bg-yellow-100 text-xs font-semibold">
                          NGN {(data.data.activities?.reduce((sum, act) => sum + Number(act.airport_taxi_fee || 0), 0) || 0).toLocaleString()}
                        </td>
                        <td className="border border-black px-2 py-2 bg-gray-50"></td>
                      </tr>
                      <tr>
                        <td className="border border-black px-3 py-2 font-semibold bg-gray-50 text-xs sticky left-0 bg-gray-50">Visa Free</td>
                        {data.data.activities?.map((activity) => (
                          <td key={activity.id} className="border border-black px-2 py-2 text-center text-xs font-medium">
                            <span className={`px-2 py-1 rounded ${activity.visa_free ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {activity.visa_free ? "YES" : "NO"}
                            </span>
                          </td>
                        )) || []}
                        <td className="border border-black px-2 py-2 bg-gray-50"></td>
                        <td className="border border-black px-2 py-2 bg-gray-50"></td>
                      </tr>
                      <tr>
                        <td className="border border-black px-3 py-2 font-semibold bg-gray-50 text-xs sticky left-0 bg-gray-50">Registration</td>
                        {data.data.activities?.map((activity) => (
                          <td key={activity.id} className="border border-black px-2 py-2 text-center text-xs font-medium">
                            {activity.registration_fee ? `NGN ${Number(activity.registration_fee).toLocaleString()}` : "-"}
                          </td>
                        )) || []}
                        <td className="border border-black px-2 py-2 text-center bg-yellow-100 text-xs font-semibold">
                          NGN {(data.data.activities?.reduce((sum, act) => sum + Number(act.registration_fee || 0), 0) || 0).toLocaleString()}
                        </td>
                        <td className="border border-black px-2 py-2 bg-gray-50"></td>
                      </tr>
                      <tr>
                        <td className="border border-black px-3 py-2 font-semibold bg-gray-50 text-xs sticky left-0 bg-gray-50">Taxi Between Cities</td>
                        {data.data.activities?.map((activity) => (
                          <td key={activity.id} className="border border-black px-2 py-2 text-center text-xs font-medium">
                            {activity.inter_city_taxi_fee ? `NGN ${Number(activity.inter_city_taxi_fee).toLocaleString()}` : "-"}
                          </td>
                        )) || []}
                        <td className="border border-black px-2 py-2 text-center bg-yellow-100 text-xs font-semibold">
                          NGN {(data.data.activities?.reduce((sum, act) => sum + Number(act.inter_city_taxi_fee || 0), 0) || 0).toLocaleString()}
                        </td>
                        <td className="border border-black px-2 py-2 bg-gray-50"></td>
                      </tr>
                      <tr>
                        <td className="border border-black px-3 py-2 font-semibold bg-gray-50 text-xs sticky left-0 bg-gray-50">Other ({data.data.activities?.some(act => act.others) ? "Various" : "Group Launch"})</td>
                        {data.data.activities?.map((activity) => (
                          <td key={activity.id} className="border border-black px-2 py-2 text-center text-xs font-medium">
                            {activity.others ? `NGN ${Number(activity.others).toLocaleString()}` : "-"}
                          </td>
                        )) || []}
                        <td className="border border-black px-2 py-2 text-center bg-yellow-100 text-xs font-semibold">
                          NGN {(data.data.activities?.reduce((sum, act) => sum + Number(act.others || 0), 0) || 0).toLocaleString()}
                        </td>
                        <td className="border border-black px-2 py-2 bg-gray-50"></td>
                      </tr>
                      <tr className="bg-yellow-200">
                        <td className="border border-black px-3 py-3 font-bold text-xs sticky left-0 bg-yellow-200">TOTAL COST</td>
                        {data.data.activities?.map((activity) => (
                          <td key={activity.id} className="border border-black px-2 py-3 text-center font-bold text-xs">
                            NGN {(
                              Number(activity.airport_taxi_fee || 0) +
                              Number(activity.registration_fee || 0) +
                              Number(activity.inter_city_taxi_fee || 0) +
                              Number(activity.others || 0)
                            ).toLocaleString()}
                          </td>
                        )) || []}
                        <td className="border border-black px-2 py-3 text-center font-bold text-xs bg-yellow-300">
                          NGN {(data.data.activities?.reduce((sum, act) =>
                            sum + Number(act.airport_taxi_fee || 0) + Number(act.registration_fee || 0) +
                            Number(act.inter_city_taxi_fee || 0) + Number(act.others || 0), 0
                          ) || 0).toLocaleString()}
                        </td>
                        <td className="border border-black px-2 py-3 bg-gray-50"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Signatures Section */}
                <div className="border-2 border-black shadow-sm">
                  <table className="w-full border-collapse table-fixed">
                    <tbody>
                      <tr>
                        <td className="border border-black px-4 py-6 w-1/3 align-top">
                          <div className="space-y-3">
                            <p className="font-semibold text-sm text-gray-700">Traveler's Signature:</p>
                            <div className="border-b-2 border-gray-400 h-12 mt-4"></div>
                            <p className="text-xs text-gray-500 mt-2">Date: ___________</p>
                          </div>
                        </td>
                        <td className="border border-black px-4 py-6 w-1/3 align-top">
                          <div className="space-y-3">
                            <p className="font-semibold text-sm text-gray-700">Reviewer's Signature:</p>
                            <div className="border-b-2 border-gray-400 h-12 mt-4"></div>
                            <p className="text-xs text-gray-500 mt-2">Date: ___________</p>
                          </div>
                        </td>
                        <td className="border border-black px-4 py-6 w-1/3 align-top">
                          <div className="space-y-3">
                            <p className="font-semibold text-sm text-gray-700">Authoriser's Signature:</p>
                            <div className="border-b-2 border-gray-400 h-12 mt-4"></div>
                            <p className="text-xs text-gray-500 mt-2">Date: ___________</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

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
                    )) || []}
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
