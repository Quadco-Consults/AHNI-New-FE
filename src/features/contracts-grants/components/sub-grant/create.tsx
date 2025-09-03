"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import BackNavigation from "components/atoms/BackNavigation";
import Card from "components/Card";
import FormButton from "components/FormButton";
import FormInput from "components/FormInput";
import FormSelect from "components/FormSelect";
import { Form } from "components/ui/form";
import { SubGrantSchema, TSubGrantFormData } from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";
import { useCreateSubGrant } from "@/features/contracts-grants/controllers/subGrantController";
import { useGetAllGrants } from "@/features/contracts-grants/controllers/grantController";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useGetAllDepartments } from "@/features/modules/controllers/config/departmentController";
import { CG_ROUTES } from "constants/RouterConstants";

const CreateSubGrant: React.FC = () => {
  const router = useRouter();
  
  const form = useForm<TSubGrantFormData>({
    resolver: zodResolver(SubGrantSchema),
    defaultValues: {
      project: "",
      title: "",
      award_type: "",
      amount_usd: "",
      amount_ngn: "",
      submission_start_date: "",
      submission_end_date: "",
      sub_grant_administrator: "",
      technical_staff: "",
      business_unit: "",
    },
  });

  const { createSubGrant, isLoading, isSuccess } = useCreateSubGrant();
  
  
  // Fetch data for dropdowns
  const { data: grantsData, isLoading: grantsLoading, error: grantsError } = useGetAllGrants({ size: 100, enabled: true });
  const { data: usersData, isLoading: usersLoading, error: usersError } = useGetAllUsers({ size: 100, enabled: true });
  const { data: departmentsData, isLoading: departmentsLoading, error: departmentsError } = useGetAllDepartments({ size: 100, enabled: true });


  // Transform data for select options
  const grantOptions = grantsData?.data?.results?.map((grant: any) => ({
    value: grant.id,
    label: grant.title || grant.name // Use title from API, fallback to name
  })) || [];

  const userOptions = (usersData?.data?.results || usersData?.results)
    ?.filter((user: any) => user.first_name && user.last_name) // Filter out users with null names
    ?.map((user: any) => ({
      value: user.id,
      label: `${user.first_name} ${user.last_name}`
    })) || [];

  const departmentOptions = (departmentsData?.data?.results || departmentsData?.results)?.map((department: any) => ({
    value: department.id,
    label: department.name
  })) || [];

  // Temporary debugging to see API responses
  console.log("=== TEMP DEBUG ===");
  console.log("Grants API Response:", grantsData);
  console.log("Users API Response:", usersData);
  console.log("Departments API Response:", departmentsData);
  console.log("API Loading States:", { grantsLoading, usersLoading, departmentsLoading });
  console.log("API Errors:", { grantsError, usersError, departmentsError });
  console.log("Processed Options:");
  console.log("- Grant Options:", grantOptions, `(${grantOptions.length} items)`);
  console.log("- User Options:", userOptions, `(${userOptions.length} items)`);
  console.log("- Department Options:", departmentOptions, `(${departmentOptions.length} items)`);
  console.log("=== END DEBUG ===");

  // Currency conversion rate (USD to NGN) - you might want to fetch this from an API
  const USD_TO_NGN_RATE = 1600; // Example rate

  // Watch for changes in USD amount and convert to NGN
  const usdAmount = form.watch("amount_usd");
  
  useEffect(() => {
    if (usdAmount && !isNaN(parseFloat(usdAmount))) {
      const ngnAmount = (parseFloat(usdAmount) * USD_TO_NGN_RATE).toString();
      form.setValue("amount_ngn", ngnAmount, { shouldValidate: false });
    }
  }, [usdAmount, form]);

  const onSubmit: SubmitHandler<TSubGrantFormData> = async (data) => {
    try {
      await createSubGrant(data);
      toast.success("Sub-Grant created successfully");
      form.reset();
      router.push(CG_ROUTES.SUBGRANT_ADVERT || "/dashboard/c-and-g/sub-grant/adverts");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.data?.message || error?.message || "Failed to create sub-grant";
      toast.error(errorMessage);
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <BackNavigation />
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Create Sub-Grant</h2>

          {/* Display API errors */}
          {(grantsError || usersError || departmentsError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-medium text-red-800 mb-2">API Connection Issues:</h3>
              {grantsError && (
                <p className="text-red-600 text-sm">• Grants: {grantsError.message}</p>
              )}
              {usersError && (
                <p className="text-red-600 text-sm">• Users: {usersError.message}</p>
              )}
              {departmentsError && (
                <p className="text-red-600 text-sm">• Departments: {departmentsError.message}</p>
              )}
              <p className="text-red-600 text-sm mt-2">Please check your authentication or contact support.</p>
            </div>
          )}

          {/* Display loading status */}
          {(grantsLoading || usersLoading || departmentsLoading) && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">
                Loading form data...
                {grantsLoading && " • Grants"}
                {usersLoading && " • Users"}
                {departmentsLoading && " • Departments"}
              </p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Project */}
              <FormSelect
                label="Project"
                name="project"
                required
                placeholder={grantsLoading ? "Loading projects..." : grantOptions.length > 0 ? "Select a project" : "No projects available"}
                options={grantOptions}
                disabled={grantsLoading}
              />

              {/* Title */}
              <FormInput
                label="Title"
                name="title"
                required
                placeholder="Enter sub-grant title"
              />

              {/* Staff Selection */}
              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="Sub-Grant Administrator"
                  name="sub_grant_administrator"
                  required
                  placeholder={usersLoading ? "Loading users..." : userOptions.length > 0 ? "Select administrator" : "No users available"}
                  options={userOptions}
                  disabled={usersLoading}
                />
                <FormSelect
                  label="Technical Staff"
                  name="technical_staff"
                  required
                  placeholder={usersLoading ? "Loading users..." : userOptions.length > 0 ? "Select technical staff" : "No users available"}
                  options={userOptions}
                  disabled={usersLoading}
                />
              </div>

              {/* Award Type and Business Unit */}
              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="Award Type"
                  name="award_type"
                  required
                  placeholder="Select award type"
                  options={[
                    { value: "COMPETITIVE_GRANT", label: "Competitive Grant" },
                    { value: "FIXED_AMOUNT", label: "Fixed Amount" },
                    { value: "COST_REIMBURSEMENT", label: "Cost Reimbursement" },
                    { value: "COOPERATIVE_AGREEMENT", label: "Cooperative Agreement" },
                  ]}
                />
                <FormSelect
                  label="Department"
                  name="business_unit"
                  required
                  placeholder={departmentsLoading ? "Loading departments..." : departmentOptions.length > 0 ? "Select department" : "No departments available"}
                  options={departmentOptions}
                  disabled={departmentsLoading}
                />
              </div>

              {/* Amounts */}
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Amount (USD)"
                  name="amount_usd"
                  required
                  type="number"
                  placeholder="Enter amount in USD"
                />
                <FormInput
                  label="Amount (NGN) - Auto calculated"
                  name="amount_ngn"
                  required
                  type="number"
                  placeholder="Auto-calculated from USD"
                  readOnly
                  className="bg-gray-50"
                />
              </div>


              {/* Submission Dates */}
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Submission Start Date"
                  name="submission_start_date"
                  required
                  type="date"
                  placeholder="Select submission start date"
                />
                <FormInput
                  label="Submission End Date"
                  name="submission_end_date"
                  required
                  type="date"
                  placeholder="Select submission end date"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <FormButton loading={isLoading} disabled={isLoading}>
                  Create Sub-Grant
                </FormButton>
                <FormButton
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={isLoading}
                >
                  Reset Form
                </FormButton>
              </div>
            </form>
          </Form>
        </div>
      </Card>
    </section>
  );
};

export default CreateSubGrant;