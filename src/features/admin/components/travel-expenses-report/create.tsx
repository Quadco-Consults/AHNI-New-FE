"use client";

import Card from "components/Card";
import { CardContent, CardHeader } from "components/ui/card";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import FormButton from "@/components/FormButton";
import FileUpload from "components/FileUpload";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import BackNavigation from "components/atoms/BackNavigation";
import { Separator } from "components/ui/separator";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import AddSquareIconFaded from "components/icons/AddSquareIconFaded";
import DeleteIcon from "components/icons/DeleteIcon";
import {
  TravelExpenseSchema,
  TTravelExpenseFormData
} from "@/features/admin/types/travel-expense";
import {
  useCreateTravelExpense,
  useModifyTravelExpense,
  useGetSingleTravelExpense
} from "@/features/admin/controllers/travelExpenseController";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useGetAllExpenseAuthorizations } from "@/features/admin/controllers/expenseAuthorizationController";

export default function SimpleTravelExpenseReportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");

  const form = useForm<TTravelExpenseFormData>({
    resolver: zodResolver(TravelExpenseSchema),
    defaultValues: {
      expense_authorization: "",
      user: "",
      staff_id: "",
      travel_purpose: "",
      document: undefined,
      reviewer: "",
      authorizer: "",
      approver: "",
      activities: [], // Start with empty array to avoid validation errors
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "activities",
    control: form.control,
  });

  // API Hooks
  const { data: users } = useGetAllUsers({ page: 1, size: 1000 });
  const { data: expenseAuth } = useGetAllExpenseAuthorizations({ page: 1, size: 1000 });
  const { data: travelExpense } = useGetSingleTravelExpense(id || "", !!id);
  const { createTravelExpense, isLoading: isCreateLoading } = useCreateTravelExpense();
  const { modifyTravelExpense, isLoading: isModifyLoading } = useModifyTravelExpense(id || "");

  // Options for select fields
  const userOptions = useMemo(() => {
    console.log('🔍 USERS DATA STRUCTURE:', users);
    // Users API likely follows the same structure pattern
    const userResults = users?.results || users?.data?.results;
    return userResults?.map((user: any) => ({
      label: `${user.first_name} ${user.last_name}`,
      value: user.id,
    })) || [];
  }, [users]);

  const expenseAuthorizationOptions = useMemo(() => {
    console.log('🔍 EXPENSE AUTH DATA STRUCTURE:', expenseAuth);
    // Based on the API response, use data.results
    const authResults = expenseAuth?.data?.results;
    return authResults?.map((auth: any) => ({
      label: auth.authorization_number || auth.id || `Auth ${auth.id?.slice(0, 8)}`,
      value: auth.id,
    })) || [];
  }, [expenseAuth]);

  const visaFreeOptions = [
    { label: "Yes", value: "true" },
    { label: "No", value: "false" },
  ];

  // Load existing data for edit mode
  useEffect(() => {
    if (travelExpense?.data && id) {
      const data = travelExpense.data;

      const formData = {
        expense_authorization: "", // Not needed for edit
        user: data.user.id,
        staff_id: data.staff_id,
        travel_purpose: data.travel_purpose,
        document: undefined,
        reviewer: data.approvals?.find(a => a.approval_level === "REVIEW")?.user.id || "",
        authorizer: data.approvals?.find(a => a.approval_level === "AUTHORIZE")?.user.id || "",
        approver: data.approvals?.find(a => a.approval_level === "APPROVE")?.user.id || "",
        activities: data.activities.map(activity => ({
          date: activity.date,
          activity: activity.activity,
          departure_datetime: activity.departure_datetime,
          departure_point: activity.departure_point,
          arrival_datetime: activity.arrival_datetime,
          assignment_location: activity.assignment_location,
          visa_free: String(activity.visa_free),
          airport_taxi_fee: activity.airport_taxi_fee,
          registration_fee: activity.registration_fee,
          inter_city_taxi_fee: activity.inter_city_taxi_fee,
          total_amount: activity.total_amount,
          others: activity.others || "",
        })),
      };

      form.reset(formData);
    }
  }, [travelExpense, form, id]);

  const onSubmit = async (data: TTravelExpenseFormData) => {
    try {
      console.log('📝 TER SUBMISSION:', data);

      // Clean and validate activities
      const cleanActivities = data.activities.filter(activity =>
        activity.activity.trim() && activity.date.trim()
      );

      if (cleanActivities.length === 0) {
        toast.error("Please add at least one complete activity");
        return;
      }

      // Create FormData as expected by backend
      const formData = new FormData();

      // Add main fields (excluding activities and document)
      formData.append('user', data.user);
      formData.append('staff_id', data.staff_id);
      formData.append('travel_purpose', data.travel_purpose);
      formData.append('reviewer', data.reviewer);
      formData.append('authorizer', data.authorizer);
      formData.append('approver', data.approver);

      // Add expense_authorization only for create
      if (!id && data.expense_authorization) {
        formData.append('expense_authorization', data.expense_authorization);
      }

      // Convert activities to JSON string with proper boolean values
      const activitiesForBackend = cleanActivities.map(activity => ({
        date: activity.date,
        activity: activity.activity,
        departure_datetime: activity.departure_datetime,
        departure_point: activity.departure_point,
        arrival_datetime: activity.arrival_datetime,
        assignment_location: activity.assignment_location,
        visa_free: activity.visa_free === "true", // Convert to boolean
        airport_taxi_fee: activity.airport_taxi_fee,
        registration_fee: activity.registration_fee,
        inter_city_taxi_fee: activity.inter_city_taxi_fee,
        total_amount: activity.total_amount,
        others: activity.others || "",
      }));

      // Add activities as JSON string
      formData.append('activities', JSON.stringify(activitiesForBackend));

      console.log('🚀 SUBMITTING FORMDATA with activities as JSON string');
      console.log('Activities JSON:', JSON.stringify(activitiesForBackend, null, 2));

      // Submit the main TER data
      if (id) {
        await modifyTravelExpense(formData as any);
      } else {
        await createTravelExpense(formData as any);
      }

      // Handle document upload separately if provided
      if (data.document && data.document instanceof File) {
        console.log('📎 Uploading document separately...');
        // TODO: Implement separate document upload endpoint when TER ID is available
        // This would require the backend to provide the TER ID after creation
      }

      toast.success(id ? "Travel Expense Report updated successfully" : "Travel Expense Report created successfully");
      router.push(AdminRoutes.TRAVEL_EXPENSE_REPORT);
    } catch (error: any) {
      console.error('❌ TER ERROR:', error);
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <BackNavigation />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader className="font-bold">
              {id ? "Edit Travel Expense Report" : "Create Travel Expense Report"}
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-6">
                {!id && (
                  <FormSelect
                    label="Expense Authorization"
                    name="expense_authorization"
                    placeholder="Select Expense Authorization"
                    required
                    options={expenseAuthorizationOptions}
                  />
                )}

                <FormSelect
                  label="User"
                  name="user"
                  placeholder="Select User"
                  required
                  options={userOptions}
                />

                <FormInput
                  label="Staff ID"
                  name="staff_id"
                  placeholder="Enter Staff ID"
                  required
                />

                <FormInput
                  label="Purpose of Travel"
                  name="travel_purpose"
                  placeholder="Enter Purpose"
                  required
                />

                <FormSelect
                  label="Reviewer"
                  name="reviewer"
                  placeholder="Select Reviewer"
                  required
                  options={userOptions}
                />

                <FormSelect
                  label="Authorizer"
                  name="authorizer"
                  placeholder="Select Authorizer"
                  required
                  options={userOptions}
                />

                <FormSelect
                  label="Approver"
                  name="approver"
                  placeholder="Select Approver"
                  required
                  options={userOptions}
                />

                <FileUpload
                  label="Supporting Document (Optional)"
                  name="document"
                />
              </div>

              <Separator />

              {/* Activities Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">Travel Activities</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-primary"
                    onClick={() => append({
                      date: "",
                      activity: "",
                      departure_datetime: "",
                      departure_point: "",
                      arrival_datetime: "",
                      assignment_location: "",
                      visa_free: "",
                      airport_taxi_fee: "",
                      registration_fee: "",
                      inter_city_taxi_fee: "",
                      total_amount: "",
                      others: "",
                    })}
                  >
                    <AddSquareIconFaded />
                    Add Activity
                  </Button>
                </div>

                {fields.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-600 mb-4">No activities added yet. Click "Add Activity" to get started.</p>
                  </div>
                )}

                {fields.map((field, index) => (
                  <div key={field.id} className="border p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Day {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-red-500"
                        onClick={() => remove(index)}
                      >
                        <DeleteIcon />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        label="Date"
                        name={`activities.${index}.date`}
                        type="date"
                        required
                      />

                      <FormInput
                        label="Activity"
                        name={`activities.${index}.activity`}
                        placeholder="Enter Activity"
                        required
                      />

                      <FormInput
                        label="Departure Date"
                        name={`activities.${index}.departure_datetime`}
                        type="date"
                        required
                      />

                      <FormInput
                        label="Departure Point"
                        name={`activities.${index}.departure_point`}
                        placeholder="Enter Departure Point"
                        required
                      />

                      <FormInput
                        label="Arrival Date"
                        name={`activities.${index}.arrival_datetime`}
                        type="date"
                        required
                      />

                      <FormInput
                        label="Assignment Location"
                        name={`activities.${index}.assignment_location`}
                        placeholder="Enter Assignment Location"
                        required
                      />

                      <FormSelect
                        label="Visa Free?"
                        name={`activities.${index}.visa_free`}
                        placeholder="Select Option"
                        required
                        options={visaFreeOptions}
                      />

                      <FormInput
                        label="Airport Taxi Fee"
                        name={`activities.${index}.airport_taxi_fee`}
                        placeholder="Enter Amount"
                        required
                      />

                      <FormInput
                        label="Registration Fee"
                        name={`activities.${index}.registration_fee`}
                        placeholder="Enter Amount"
                        required
                      />

                      <FormInput
                        label="Inter-City Taxi Fee"
                        name={`activities.${index}.inter_city_taxi_fee`}
                        placeholder="Enter Amount"
                        required
                      />

                      <FormInput
                        label="Total Amount"
                        name={`activities.${index}.total_amount`}
                        placeholder="Enter Total"
                        required
                      />

                      <FormInput
                        label="Others"
                        name={`activities.${index}.others`}
                        placeholder="Other expenses (optional)"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-between pt-6">
                <Link href={AdminRoutes.TRAVEL_EXPENSE_REPORT}>
                  <Button variant="outline" type="button" size="lg">
                    Cancel
                  </Button>
                </Link>

                <FormButton
                  size="lg"
                  type="submit"
                  loading={isCreateLoading || isModifyLoading}
                  className="bg-primary"
                >
                  {id ? "Update Report" : "Create Report"}
                </FormButton>
              </div>
            </CardContent>
          </Card>
        </form>
      </FormProvider>
    </div>
  );
}