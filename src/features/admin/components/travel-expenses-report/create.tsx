"use client";

import Card from "@/components/Card";
import { CardContent, CardHeader } from "@/components/ui/card";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/atoms/FormInput";
import FormSelect from "@/components/atoms/FormSelect";
import FormButton from "@/components/FormButton";
import FileUpload from "@/components/FileUpload";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminRoutes } from "@/constants/RouterConstants";
import BackNavigation from "@/components/atoms/BackNavigation";
import { Separator } from "@/components/ui/separator";
import { useEffect, useMemo, useCallback, useState } from "react";
import { toast } from "sonner";
import AddSquareIconFaded from "@/components/icons/AddSquareIconFaded";
import DeleteIcon from "@/components/icons/DeleteIcon";
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
import { getCurrentUser } from "@/utils/auth";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import {
  getReviewerOptions,
  getAuthorizerOptions,
  getApproverOptions
} from "@/utils/approvalFilters";
import { filterAhniStaffOnly } from "@/utils/userFilters";

export default function SimpleTravelExpenseReportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");

  // Note: Removed unused currentUserData state - user data is handled directly in useEffect

  const form = useForm<TTravelExpenseFormData>({
    resolver: zodResolver(TravelExpenseSchema),
    mode: "onChange", // Validate on change to get real-time validation state
    defaultValues: {
      expense_authorization: "",
      user: "",
      staff_id: "",
      travel_purpose: "",
      document: null, // Use null instead of undefined for controlled inputs
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
  const { data: expenseAuth, isLoading: isExpenseAuthLoading, error: expenseAuthError } = useGetAllExpenseAuthorizations({
    page: 1,
    size: 100, // Reduced from 1000 to avoid potential issues
    status: "" // Show all statuses - user should be able to create TER for approved, pending, or submitted EAs
  });
  const { data: travelExpense, isLoading: isTravelExpenseLoading, error: travelExpenseError } = useGetSingleTravelExpense(id || "", !!id);
  const { createTravelExpense, isLoading: isCreateLoading } = useCreateTravelExpense();
  const { isLoading: isModifyLoading } = useModifyTravelExpense(id || ""); // modifyTravelExpense not used, we call API directly

  // Debug expense auth loading
  useEffect(() => {
    console.log('🔍 EXPENSE AUTH STATUS:', {
      isLoading: isExpenseAuthLoading,
      hasData: !!expenseAuth,
      error: expenseAuthError,
      data: expenseAuth
    });
  }, [expenseAuth, isExpenseAuthLoading, expenseAuthError]);

  // Get logged-in user on component mount and when users data loads
  useEffect(() => {
    const user = getCurrentUser();
    if (user && !id) { // Only for create mode, not edit mode
      // Auto-populate form with current user data

      // Wait for users data to be loaded before setting the value
      if (users) {
        console.log('🔍 AUTO-POPULATING USER:', user);
        form.setValue('user', user.id);

        // Also auto-populate staff_id
        const userResults = (users as any)?.data?.results || users?.results;
        const foundUser = userResults?.find((u: any) => u.id === user.id);
        if (foundUser) {
          const employeeId = (foundUser as any)?.employee_id || (foundUser as any)?.staff_id || foundUser?.id?.slice(0, 8);
          if (employeeId) {
            form.setValue('staff_id', employeeId);
          }
        }
      }
    }
  }, [id, users, form]);

  // Debug API calls
  useEffect(() => {
    console.log('🔍 API CALLS STATUS:', {
      id: id,
      isEditMode: !!id,
      travelExpenseLoading: isTravelExpenseLoading,
      travelExpenseData: !!travelExpense,
      travelExpenseError: travelExpenseError,
      apiCallEnabled: !!id
    });
  }, [id, isTravelExpenseLoading, travelExpense, travelExpenseError]);

  // Options for select fields
  const userOptions = useMemo(() => {
    console.log('🔍 USERS DATA STRUCTURE:', users);
    // API actually returns data.results structure
    const userResults = (users as any)?.data?.results || users?.results;
    // Filter for AHNI staff only (exclude vendors, consultants, external users)
    const ahniStaff = filterAhniStaffOnly(userResults || []);
    return ahniStaff.map((user: any) => ({
      label: `${user.first_name} ${user.last_name}`,
      value: user.id,
    }));
  }, [users]);

  // Filtered options for approval workflow - only users with appropriate permissions
  const reviewerOptions = useMemo(() => {
    const userResults = (users as any)?.data?.results || users?.results;
    const ahniStaff = filterAhniStaffOnly(userResults || []) as any;
    return getReviewerOptions(ahniStaff);
  }, [users]);

  const authorizerOptions = useMemo(() => {
    const userResults = (users as any)?.data?.results || users?.results;
    const ahniStaff = filterAhniStaffOnly(userResults || []) as any;
    return getAuthorizerOptions(ahniStaff);
  }, [users]);

  const approverOptions = useMemo(() => {
    const userResults = (users as any)?.data?.results || users?.results;
    const ahniStaff = filterAhniStaffOnly(userResults || []) as any;
    return getApproverOptions(ahniStaff);
  }, [users]);

  const expenseAuthorizationOptions = useMemo(() => {
    console.log('🔍 EXPENSE AUTH DATA STRUCTURE:', expenseAuth);
    // API actually returns data.results structure
    const authResults = (expenseAuth as any)?.data?.results || expenseAuth?.results;
    return authResults?.map((auth: any) => ({
      label: `${auth.ta_number || `EA-${auth.id?.slice(0, 8)}`} - ${auth.status || 'No Status'} - ${auth.staff_name || 'Unknown Staff'}`,
      value: auth.id,
    })) || [];
  }, [expenseAuth]);

  const visaFreeOptions = [
    { label: "Yes", value: "true" },
    { label: "No", value: "false" },
  ];

  // Function to calculate total amount for an activity
  const calculateTotalAmount = useCallback((index: number) => {
    const activity = form.watch(`activities.${index}`);
    if (!activity) return;

    const airportTaxi = parseFloat(activity.airport_taxi_fee || "0") || 0;
    const registration = parseFloat(activity.registration_fee || "0") || 0;
    const interCityTaxi = parseFloat(activity.inter_city_taxi_fee || "0") || 0;
    const others = parseFloat(activity.others || "0") || 0;

    const total = airportTaxi + registration + interCityTaxi + others;

    console.log('💰 CALCULATING TOTAL:', {
      index,
      airportTaxi,
      registration,
      interCityTaxi,
      others,
      total
    });

    form.setValue(`activities.${index}.total_amount`, total.toFixed(2));
  }, [form]);

  // Watch for changes in expense fields to auto-calculate total
  const watchedActivities = form.watch('activities');
  const selectedUserId = form.watch('user');

  // Watch all form values for debugging
  const allFormValues = form.watch();
  const selectedExpenseAuthId = form.watch('expense_authorization');

  // Debug: Log form values whenever they change
  useEffect(() => {
    if (Object.keys(allFormValues).length > 0) {
      console.log('🔄 FORM VALUES UPDATED:', {
        basic_info: {
          expense_authorization: allFormValues.expense_authorization,
          user: allFormValues.user,
          staff_id: allFormValues.staff_id,
          travel_purpose: allFormValues.travel_purpose,
          reviewer: allFormValues.reviewer,
          authorizer: allFormValues.authorizer,
          approver: allFormValues.approver,
        },
        document: allFormValues.document ? 'FILE SELECTED' : 'NO FILE',
        activities_count: allFormValues.activities?.length || 0,
        activities_summary: allFormValues.activities?.map((act, i) => `Day ${i+1}: ${act.activity || 'Empty'} (${act.date || 'No date'})`),
      });
    }
  }, [allFormValues]);

  useEffect(() => {
    if (watchedActivities) {
      watchedActivities.forEach((_, index) => {
        const activity = watchedActivities[index];
        if (activity) {
          calculateTotalAmount(index);
        }
      });
    }
  }, [watchedActivities, calculateTotalAmount]);

  // Auto-populate Staff ID when user is selected
  useEffect(() => {
    if (selectedUserId && users) {
      const userResults = (users as any)?.data?.results || users?.results;
      const selectedUser = userResults?.find((user: any) => user.id === selectedUserId);
      console.log('🔍 SELECTED USER DATA:', selectedUser);

      // Try different possible field names for employee ID
      // Since IUser interface doesn't have employee_id or staff_id, use id as fallback
      const employeeId = (selectedUser as any)?.employee_id || (selectedUser as any)?.staff_id || selectedUser?.id?.slice(0, 8);

      if (employeeId) {
        form.setValue('staff_id', employeeId);
      }
    }
  }, [selectedUserId, users, form]);

  // Auto-populate Travel Purpose from selected Expense Authorization
  useEffect(() => {
    if (selectedExpenseAuthId && expenseAuth) {
      const authResults = (expenseAuth as any)?.data?.results || expenseAuth?.results;
      const selectedAuth = authResults?.find((auth: any) => auth.id === selectedExpenseAuthId);
      console.log('🔍 SELECTED EXPENSE AUTH DATA:', selectedAuth);

      // Get travel purpose from destinations if available
      if (selectedAuth?.destinations && selectedAuth.destinations.length > 0) {
        const firstDestination = selectedAuth.destinations[0];
        const purpose = firstDestination.purpose || selectedAuth.justification || "";
        if (purpose) {
          form.setValue('travel_purpose', purpose);
        }
      }
    }
  }, [selectedExpenseAuthId, expenseAuth, form]);

  // Helper function to convert ISO datetime to date format
  const convertToDateFormat = (isoString: string) => {
    if (!isoString) return "";
    return isoString.split('T')[0]; // Extract YYYY-MM-DD part from ISO string
  };

  // Load existing data for edit mode
  useEffect(() => {
    console.log('🔄 EDIT MODE CHECK:', {
      hasTravelExpenseData: !!travelExpense?.data,
      hasId: !!id,
      travelExpenseData: travelExpense?.data
    });

    if (travelExpense?.data && id) {
      console.log('✅ LOADING EDIT MODE DATA');
      const data = travelExpense.data;

      console.log('📊 RAW API DATA FOR EDIT:', data);

      const formData = {
        expense_authorization: "", // Not needed for edit
        user: data.user?.id || "",
        staff_id: data.staff_id || "",
        travel_purpose: data.travel_purpose || "",
        document: null, // Use null for consistency
        reviewer: data.approvals?.find(a => a.approval_level === "REVIEW")?.user?.id || "",
        authorizer: data.approvals?.find(a => a.approval_level === "AUTHORIZE")?.user?.id || "",
        approver: data.approvals?.find(a => a.approval_level === "APPROVE")?.user?.id || "",
        activities: (data.activities || []).map(activity => ({
          id: activity.id, // Preserve the activity ID for updates
          date: activity.date,
          activity: activity.activity,
          departure_datetime: convertToDateFormat(activity.departure_datetime),
          departure_point: activity.departure_point,
          arrival_datetime: convertToDateFormat(activity.arrival_datetime),
          assignment_location: activity.assignment_location,
          visa_free: String(activity.visa_free),
          airport_taxi_fee: activity.airport_taxi_fee,
          registration_fee: activity.registration_fee,
          inter_city_taxi_fee: activity.inter_city_taxi_fee,
          total_amount: activity.total_amount,
          others: activity.others || "",
        })),
      };

      console.log('🔄 PROCESSED FORM DATA FOR EDIT:', formData);
      console.log('📋 APPROVALS FOUND:', {
        reviewer: data.approvals?.find(a => a.approval_level === "REVIEW"),
        authorizer: data.approvals?.find(a => a.approval_level === "AUTHORIZE"),
        approver: data.approvals?.find(a => a.approval_level === "APPROVE"),
      });
      console.log('🏃 ACTIVITIES CONVERTED:', formData.activities);

      form.reset(formData);
      console.log('✅ FORM RESET WITH EDIT DATA COMPLETE');
    } else if (id && !travelExpense?.data) {
      console.log('⏳ WAITING FOR API DATA... ID exists but no data yet');
    } else {
      console.log('➕ CREATE MODE - No ID provided');
    }
  }, [travelExpense, form, id]);

  const onSubmit = async (data: TTravelExpenseFormData) => {
    console.log('🚨 SUBMIT BUTTON CLICKED - FUNCTION TRIGGERED');
    console.log('🔍 Raw Form Data:', data);
    try {
      console.log('📝 TER FORM SUBMISSION STARTED');
      console.log('🔍 Form Data:', data);

      // Validate activities
      if (!data.activities || data.activities.length === 0) {
        toast.error("Please add at least one activity");
        return;
      }

      const cleanActivities = data.activities.filter(activity =>
        activity.activity?.trim() && activity.date?.trim()
      );

      if (cleanActivities.length === 0) {
        toast.error("Please add at least one complete activity with date and description");
        return;
      }

      // Prepare activities in backend format
      const activitiesForBackend = cleanActivities.map(activity => {
        const activityData: any = {
          date: activity.date,
          activity: activity.activity,
          departure_datetime: `${activity.departure_datetime}T00:00:00Z`,
          departure_point: activity.departure_point,
          arrival_datetime: `${activity.arrival_datetime}T00:00:00Z`,
          assignment_location: activity.assignment_location,
          visa_free: activity.visa_free === "true",
          airport_taxi_fee: activity.airport_taxi_fee,
          registration_fee: activity.registration_fee,
          inter_city_taxi_fee: activity.inter_city_taxi_fee,
          total_amount: activity.total_amount,
          others: activity.others || "",
        };

        // Include ID if present (for updates)
        if ((activity as any).id) {
          activityData.id = (activity as any).id;
        }

        return activityData;
      });

      if (id) {
        // UPDATE MODE - Use JSON payload, not FormData
        console.log('🔄 UPDATE MODE - ID:', id);

        const updatePayload = {
          user: data.user,
          staff_id: data.staff_id,
          travel_purpose: data.travel_purpose,
          reviewer: data.reviewer,
          authorizer: data.authorizer,
          approver: data.approver,
          activities: activitiesForBackend,
        };

        console.log('📦 Update Payload:', JSON.stringify(updatePayload, null, 2));

        // Send as JSON, not FormData
        const response = await AxiosWithToken.patch(
          `/admins/reports/travel-expenses/${id}/`,
          updatePayload
        );

        console.log('✅ UPDATE SUCCESS:', response.data);

        // Upload document separately if provided
        // Handle both File and FileList
        let fileToUpload = null;
        if (data.document) {
          if (data.document instanceof File) {
            fileToUpload = data.document;
          } else if (data.document instanceof FileList && data.document.length > 0) {
            fileToUpload = data.document[0];
          }
        }

        if (fileToUpload) {
          console.log('📎 Uploading document separately...', fileToUpload);
          const docFormData = new FormData();
          docFormData.append('document', fileToUpload);

          await AxiosWithToken.post(
            `/admins/reports/travel-expenses/${id}/upload-document/`,
            docFormData
          );
          console.log('✅ DOCUMENT UPLOADED');
        }

        toast.success("Travel Expense Report updated successfully");
        router.push(AdminRoutes.TRAVEL_EXPENSE_REPORT);
      } else {
        // CREATE MODE - Use FormData
        console.log('➕ CREATE MODE');

        const formData = new FormData();
        if (data.expense_authorization) {
          formData.append('expense_authorization', data.expense_authorization);
        }
        if (data.user) {
          formData.append('user', data.user);
        }
        if (data.staff_id) {
          formData.append('staff_id', data.staff_id);
        }
        formData.append('travel_purpose', data.travel_purpose);
        formData.append('reviewer', data.reviewer);
        formData.append('authorizer', data.authorizer);
        formData.append('approver', data.approver);
        formData.append('activities', JSON.stringify(activitiesForBackend));

        // Handle document - could be File or FileList
        if (data.document) {
          if (data.document instanceof File) {
            formData.append('document', data.document);
          } else if (data.document instanceof FileList && data.document.length > 0) {
            formData.append('document', data.document[0]);
          }
        }

        console.log('📦 Create FormData prepared');

        await createTravelExpense(formData as any);
        console.log('✅ CREATE SUCCESS');

        toast.success("Travel Expense Report created successfully");
        router.push(AdminRoutes.TRAVEL_EXPENSE_REPORT);
      }
    } catch (error: any) {
      console.error('❌ SUBMISSION ERROR:', error);
      console.error('❌ Error Response Data:', error?.response?.data);
      console.error('❌ Error Response Status:', error?.response?.status);
      console.error('❌ Error Response Headers:', error?.response?.headers);
      console.error('❌ Full Error Object:', JSON.stringify(error, null, 2));

      let errorMessage = "Something went wrong";
      if (error?.response?.data) {
        const responseData = error.response.data;
        if (typeof responseData === 'string') {
          errorMessage = responseData;
        } else if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        } else if (responseData.detail) {
          errorMessage = responseData.detail;
        } else {
          const firstKey = Object.keys(responseData)[0];
          if (firstKey && responseData[firstKey]) {
            errorMessage = `${firstKey}: ${JSON.stringify(responseData[firstKey])}`;
          }
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  // Log form errors whenever they change
  useEffect(() => {
    const errors = form.formState.errors;
    if (Object.keys(errors).length > 0) {
      console.error('❌ FORM HAS VALIDATION ERRORS:', errors);
    }
  }, [form.formState.errors]);

  // Custom submit handler with error logging
  const handleFormSubmit = form.handleSubmit(
    onSubmit,
    (errors) => {
      console.error('❌ FORM VALIDATION FAILED ON SUBMIT:', errors);
      toast.error('Please fix the validation errors before submitting');
    }
  );

  return (
    <div>
      <BackNavigation />

      <FormProvider {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <Card>
            <CardHeader className="font-bold">
              {id ? "Edit Travel Expense Report" : "Create Travel Expense Report"}
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Debug info for development */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Debug Info:</strong> Found {expenseAuthorizationOptions.length} Expense Authorizations (all statuses).
                    {expenseAuthError && <span className="text-red-600"> Error: {String(expenseAuthError)}</span>}
                    {isExpenseAuthLoading && <span className="text-yellow-600"> Loading...</span>}
                  </p>
                </div>
              )}

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
                  label="User (Logged-in User)"
                  name="user"
                  placeholder="Select User"
                  required
                  disabled={!id} // Disabled in create mode (auto-populated)
                  options={userOptions}
                />

                <FormInput
                  label="Staff ID (Auto-populated)"
                  name="staff_id"
                  placeholder="Select user to auto-populate"
                  required
                  readOnly
                  className="bg-gray-50"
                />

                <FormInput
                  label="Purpose of Travel"
                  name="travel_purpose"
                  placeholder="Auto-populated from Expense Authorization"
                  required
                />

                <FormSelect
                  label="Reviewer"
                  name="reviewer"
                  placeholder="Select Reviewer"
                  required
                  options={reviewerOptions}
                />

                <FormSelect
                  label="Authorizer"
                  name="authorizer"
                  placeholder="Select Authorizer"
                  required
                  options={authorizerOptions}
                />

                <FormSelect
                  label="Approver"
                  name="approver"
                  placeholder="Select Approver"
                  required
                  options={approverOptions}
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
                        label="Total Amount (Auto-calculated)"
                        name={`activities.${index}.total_amount`}
                        placeholder="Auto-calculated"
                        required
                        readOnly
                        className="bg-gray-50"
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
                  onClick={async () => {
                    console.log('🖱️ SUBMIT BUTTON CLICKED (onClick event)');
                    console.log('📋 Current form state:', form.getValues());

                    // Trigger validation to get accurate state
                    const isValid = await form.trigger();
                    console.log('❓ Form is valid after trigger?:', isValid);
                    console.log('🔍 Form errors after trigger:', form.formState.errors);
                  }}
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