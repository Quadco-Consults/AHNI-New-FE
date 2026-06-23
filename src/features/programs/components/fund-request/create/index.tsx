"use client";

import { useRouter, usePathname } from "next/navigation";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import FormSelect from "@/components/FormSelectField";
import FormButton from "@/components/FormButton";
import { Button } from "@/components/ui/button";
import Card from "@/components/Card";
import FundRequstLayout from "./Layout";
import {
  FundRequestSchema,
  TFundRequestFormValues,
} from "@/features/programs/types/program-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import _ from "lodash";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangleIcon } from "lucide-react";

import FormInput from "@/components/FormInput";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
// import { useGetAllPartners } from "@/features/modules/controllers/project/partners";
import {
  useGetAllFinancialYearsManager,
  useGetFinancialYearPaginate,
} from "@/features/modules/controllers/config/financialYearController";
import {
  useGetAllLocationsManager,
  useGetLocationList,
} from "@/features/modules/controllers/config/locationController";
import {
  useGetAllUsers,
  useGetReviewers,
  useGetAuthorizers,
  useGetApprovers
} from "@/features/auth/controllers/userController";
import {
  filterUsersWithReviewPermission,
  filterUsersWithAuthorizePermission,
  filterUsersWithApprovePermission
} from "@/utils/approvalFilters";
import { filterAhniStaffOnly } from "@/utils/userFilters";
import { useMemo, useEffect, useState } from "react";
import {
  generateFundRequestIdentifierAuto,
  getLocationCode
} from "@/utils/fundRequestIdentifier";
import { useFundRequestValidation, useCurrencyValidationAlerts } from "@/hooks/useFundRequestValidation";

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 2000;
  return new Array(currentYear - startYear + 1).fill(_).map((_, i) => {
    const value = String(currentYear - i);
    return {
      label: value,
      value: value,
    };
  });
};

const getMonthOptions = () => {
  const monthsArr = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const months = monthsArr.map((month) => ({
    label: month,
    value: month,
  }));

  return months;
};

const CreateFundRequest = () => {
  const form = useForm<TFundRequestFormValues>({
    resolver: zodResolver(FundRequestSchema),
    defaultValues: {
      project: "",
      month: "",
      year: "",
      available_balance: "",
      currency: "",
      financial_year: "",
      type: "",
      location: "",
      uuid_code: "",
      location_reviewer: "",
      location_authorizer: "",
      // Removed state_reviewer and state_authorizer - not in backend model
      hq_reviewer: "",
      hq_authorizer: "",
      hq_approver: "",
    },
  });

  const router = useRouter();

  const pathname = usePathname();

  const goBack = () => {
    router.back();
  };

  const { data: project } = useGetAllProjects({
    page: 1,
    size: 2000000,
    search: "",
  });

  const projectOptions = useMemo(
    () =>
      project?.data.results.map(({ title, id }) => ({
        label: title,
        value: id,
      })),
    [project]
  );

  const { data: financialYear } = useGetAllFinancialYearsManager({
    page: 1,
    size: 2000000,
    search: "",
  });

  const financialYearOptions = useMemo(
    () =>
      financialYear?.data.results.map(({ year, id }) => ({
        label: year,
        value: id,
      })),
    [financialYear]
  );

  const { data: location } = useGetAllLocationsManager({
    page: 1,
    size: 2000000,
    search: "",
  });

  const locationOptions = useMemo(
    () =>
      location?.data.results.map(({ name, id, unique_code }) => ({
        label: unique_code ? `${unique_code} - ${name}` : name,
        value: id,
      })),
    [location]
  );

  // API-first approach for permission-based filtering
  const { data: reviewers } = useGetReviewers({ page: 1, size: 2000000, search: "" });
  const { data: authorizers } = useGetAuthorizers({ page: 1, size: 2000000, search: "" });
  const { data: approvers } = useGetApprovers({ page: 1, size: 2000000, search: "" });
  const { data: allUsers } = useGetAllUsers({ page: 1, size: 2000000, search: "" }); // Fallback

  // Reviewer options (API-first with role-based fallback)
  const reviewerOptions = useMemo(() => {
    // Primary: Use API endpoint (check both .results and .data.results structure)
    let reviewersList = reviewers?.results || reviewers?.data?.results || [];
    if (reviewersList.length > 0) {
      // SECURITY FIX: Filter out vendors and non-AHNI staff
      reviewersList = filterAhniStaffOnly(reviewersList);
      if (reviewersList.length > 0) {
        return reviewersList.map(user => ({
          label: `${user.first_name} ${user.last_name}`,
          value: user.id,
        }));
      }
    }
    // Fallback: Role-based filtering (already includes user type filtering)
    const allUsersList = allUsers?.data?.results || [];
    if (allUsersList.length > 0) {
      return filterUsersWithReviewPermission(allUsersList).map(user => ({
        label: `${user.first_name} ${user.last_name}`,
        value: user.id,
      }));
    }
    return [];
  }, [reviewers, allUsers]);

  // Authorizer options (API-first with role-based fallback)
  const authorizerOptions = useMemo(() => {
    // Primary: Use API endpoint (check both .results and .data.results structure)
    let authorizersList = authorizers?.results || authorizers?.data?.results || [];
    if (authorizersList.length > 0) {
      // SECURITY FIX: Filter out vendors and non-AHNI staff
      authorizersList = filterAhniStaffOnly(authorizersList);
      if (authorizersList.length > 0) {
        return authorizersList.map(user => ({
          label: `${user.first_name} ${user.last_name}`,
          value: user.id,
        }));
      }
    }
    // Fallback: Role-based filtering (already includes user type filtering)
    const allUsersList = allUsers?.data?.results || [];
    if (allUsersList.length > 0) {
      return filterUsersWithAuthorizePermission(allUsersList).map(user => ({
        label: `${user.first_name} ${user.last_name}`,
        value: user.id,
      }));
    }
    return [];
  }, [authorizers, allUsers]);

  // Approver options (API-first with role-based fallback)
  const approverOptions = useMemo(() => {
    // Primary: Use API endpoint (check both .results and .data.results structure)
    let approversList = approvers?.results || approvers?.data?.results || [];
    if (approversList.length > 0) {
      // SECURITY FIX: Filter out vendors and non-AHNI staff
      approversList = filterAhniStaffOnly(approversList);
      if (approversList.length > 0) {
        return approversList.map(user => ({
          label: `${user.first_name} ${user.last_name}`,
          value: user.id,
        }));
      }
    }
    // Fallback: Role-based filtering (already includes user type filtering)
    const allUsersList = allUsers?.data?.results || [];
    if (allUsersList.length > 0) {
      return filterUsersWithApprovePermission(allUsersList).map(user => ({
        label: `${user.first_name} ${user.last_name}`,
        value: user.id,
      }));
    }
    return [];
  }, [approvers, allUsers]);

  // Determine which filtering method is being used
  const filteringNotice = useMemo(() => {
    const hasApiData = (reviewers?.results?.length || reviewers?.data?.results?.length || 0) > 0 ||
                      (authorizers?.results?.length || authorizers?.data?.results?.length || 0) > 0 ||
                      (approvers?.results?.length || approvers?.data?.results?.length || 0) > 0;
    return {
      hasApiData,
      method: hasApiData ? 'API-based' : 'Role-based',
      totalReviewers: reviewerOptions.length,
      totalAuthorizers: authorizerOptions.length,
      totalApprovers: approverOptions.length
    };
  }, [reviewers, authorizers, approvers, reviewerOptions, authorizerOptions, approverOptions]);

  const { handleSubmit, watch, setValue } = form;
  const [isGeneratingUniqueCode, setIsGeneratingUniqueCode] = useState(false);

  // Watch the location and project fields for changes
  const selectedLocationId = watch("location");
  const selectedProjectId = watch("project");
  const selectedMonth = watch("month");
  const selectedYear = watch("year");

  // Watch form values for currency validation
  const selectedCurrency = watch("currency");
  const availableBalance = watch("available_balance");

  // Fund request validation with cross-currency support
  const { validateFundRequest, exchangeRates, isLoadingRates, hasExchangeRates } = useFundRequestValidation({
    availableBalance: availableBalance && selectedCurrency ? {
      amount: parseFloat(availableBalance) || 0,
      currency: "USD" // Assuming available balance is in USD based on user's scenario
    } : undefined
  });

  // Currency validation alerts
  const currencyAlert = useCurrencyValidationAlerts(
    selectedCurrency || "",
    "USD", // Available balance currency
    exchangeRates
  );

  // Auto-generate unique_code when location, project, month, or year changes
  useEffect(() => {
    const generateUniqueCode = async () => {
      if (selectedLocationId && selectedProjectId && location?.data.results && project?.data.results) {
        const selectedLocation = location.data.results.find(
          (loc) => loc.id === selectedLocationId
        );
        const selectedProject = project.data.results.find(
          (proj) => proj.id === selectedProjectId
        );

        if (selectedLocation && selectedProject?.project_id) {
          setIsGeneratingUniqueCode(true);

          try {
            // Get year and month (with defaults)
            const year = selectedYear ? parseInt(selectedYear) : new Date().getFullYear();
            const month = selectedMonth ? selectedMonth : String(new Date().getMonth() + 1);

            // Generate new format identifier
            // Format: {PROJECT_ID}-{LOCATION_CODE}-{YEAR}-{MONTH}-{SEQUENCE}
            const uniqueCode = await generateFundRequestIdentifierAuto(
              selectedProject,
              selectedLocation,
              year,
              parseInt(month)
            );

            setValue("uuid_code", uniqueCode);
          } catch (error) {
            console.error("Error generating unique code:", error);

            // Fallback to simpler format if API call fails
            const locationCode = getLocationCode(selectedLocation);
            const year = selectedYear ? selectedYear.slice(-2) : String(new Date().getFullYear()).slice(-2);
            const monthFormatted = selectedMonth ? String(parseInt(selectedMonth)).padStart(2, '0') : String(new Date().getMonth() + 1).padStart(2, '0');

            const fallbackCode = `${selectedProject.project_id}-${locationCode}-${year}-${monthFormatted}-01`;
            setValue("uuid_code", fallbackCode);
          } finally {
            setIsGeneratingUniqueCode(false);
          }
        }
      }
    };

    generateUniqueCode();
  }, [selectedLocationId, selectedProjectId, selectedMonth, selectedYear, location, project, setValue]);

  const onSubmit: SubmitHandler<TFundRequestFormValues> = async (data) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("programFundRequest", JSON.stringify(data));
    }

    let path = pathname || "";

    path = path.substring(0, path.lastIndexOf("/"));

    path += "/create/summary";
    router.push(path);
  };

  return (
    <FundRequstLayout>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className='space-y-10 py-5'>
            <FormSelect
              name='project'
              label='Project Name'
              placeholder='Select Project'
              required
              options={projectOptions}
            />

            <div className='grid grid-cols-2 gap-3 items-center'>
              <FormSelect
                label='Month'
                name='month'
                placeholder='Select Month'
                required
                options={getMonthOptions()}
              />
              <FormSelect
                label='Year'
                name='year'
                placeholder='Select Year'
                required
                options={getYearOptions()}
              />
            </div>

            <Separator />

            {/* Permission filtering notice */}
            {!filteringNotice.hasApiData && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangleIcon className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Permission Notice:</strong> Using role-based filtering for approval workflow. Showing only management-level staff (managers, directors, MD, super admin). Total: {filteringNotice.totalReviewers} reviewers, {filteringNotice.totalAuthorizers} authorizers, {filteringNotice.totalApprovers} approvers.
                </AlertDescription>
              </Alert>
            )}

            <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
              <FormInput
                label='Available Balance'
                name='available_balance'
                placeholder='Enter available balance'
                required
              />

              <FormSelect
                label='Currency'
                name='currency'
                required
                options={[
                  { label: "NGN", value: "NGN" },
                  { label: "USD", value: "USD" },
                ]}
                placeholder='Select Currency'
              />
            </div>

            {/* Cross-currency validation alert */}
            {currencyAlert && (
              <Alert className={currencyAlert.hasExchangeRate ? "border-blue-200 bg-blue-50" : "border-amber-200 bg-amber-50"}>
                {currencyAlert.hasExchangeRate ? (
                  <AlertTriangleIcon className="h-4 w-4 text-blue-600" />
                ) : (
                  <AlertTriangleIcon className="h-4 w-4 text-amber-600" />
                )}
                <AlertDescription className={currencyAlert.hasExchangeRate ? "text-blue-800" : "text-amber-800"}>
                  <strong>Currency Conversion:</strong> {currencyAlert.warning}
                  {isLoadingRates && " (Loading exchange rates...)"}
                  {!isLoadingRates && !hasExchangeRates && " Please ensure exchange rates are configured in the system."}
                </AlertDescription>
              </Alert>
            )}

            <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
              <FormSelect
                label='Financial Year'
                name='financial_year'
                required
                options={financialYearOptions}
                placeholder='Select Financial Year'
              />

              <FormSelect
                label='Location'
                name='location'
                required
                options={locationOptions}
                placeholder='Select Location'
              />
            </div>

            <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
              <FormInput
                label='Unique Identifier Code'
                name='uuid_code'
                required
                placeholder={isGeneratingUniqueCode ? 'Generating unique code...' : 'Auto-generated (e.g., ACE1-1001000-ASO-25-11-01)'}
                disabled
              />

              <FormSelect
                label='Location Reviewer'
                name='location_reviewer'
                required
                options={reviewerOptions}
                placeholder='Select Location Reviewer'
              />

              <FormSelect
                label='Location Authorizer'
                name='location_authorizer'
                required
                options={authorizerOptions}
                placeholder='Select Location Authorizer'
              />

              {/* CLAUDE-FIX-APPLIED: State Reviewer and State Authorizer fields removed - not in backend model */}
            </div>

            <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
              <FormSelect
                label='HQ Reviewer'
                name='hq_reviewer'
                required
                options={reviewerOptions}
                placeholder='Select HQ Reviewer'
              />

              <FormSelect
                label='HQ Authorizer'
                name='hq_authorizer'
                required
                options={authorizerOptions}
                placeholder='Select HQ Authorizer'
              />

              <FormSelect
                label='HQ Approver'
                name='hq_approver'
                required
                options={approverOptions}
                placeholder='Select HQ Approver'
              />
            </div>

            <FormSelect
              label='Type'
              name='type'
              required
              options={[
                { label: "Main", value: "MAIN" },
                {
                  label: "Supplementary",
                  value: "SUPPLEMENTARY",
                },
              ]}
              placeholder='Select Type'
            />
          </Card>

          <div className='flex justify-end gap-5 mt-16'>
            <Button
              type='button'
              className='bg-brand-light text-primary dark:text-gray-500'
              onClick={goBack}
            >
              Cancel
            </Button>
            <FormButton type='submit'>Next</FormButton>
          </div>
        </form>
      </Form>
    </FundRequstLayout>
  );
};

export default CreateFundRequest;
