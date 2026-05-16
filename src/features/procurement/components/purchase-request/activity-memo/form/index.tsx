"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/atoms/FormInput";
import FormSelect from "@/components/atoms/FormSelect";
import FormTextArea from "@/components/atoms/FormTextArea";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import LongArrowRight from "@/components/icons/LongArrowRight";

// import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import MultiSelectFormField from "@/components/ui/multiselect";

import { Separator } from "@/components/ui/separator";
import { RouteEnum } from "@/constants/RouterConstants";

import { SampleMemoSchema } from "@/features/procurement/types/procurement-validator";

// import { MinusCircle } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { store } from "@/store/index";
import React from "react";
// import { useGetAllConsumables } from "@/features/admin/controllers/inventory-management/consumableController";
import {
  useGetAllUsers,
  useGetUserProfile,
} from "@/features/auth/controllers/userController";
// NOTE: All old finance controller imports removed - using comprehensive backend endpoint

import { activityActions } from "@/store/formData/activity-memo";
import { z } from "zod";
import ExpensesForm from "./ExpensesForm";
import { useGetAllActivityPlans } from "@/features/programs/controllers/activityPlanController";
import { useCreateActivityMemo } from "@/features/procurement/controllers/activityMemoController";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dailogs";
import { toast } from "sonner";
import { useGetAllModules } from "@/features/modules/controllers/project/moduleController";
import { useGetSingleProject } from "@/features/projects/controllers/projectController";
import {
  mergeFallbackBudgetLines,
  mergeFallbackCostCategories,
  mergeFallbackCostInputs,
  mergeFallbackFCONumbers,
  mergeFallbackFundingSources,
  mergeFallbackInterventionAreas,
  type FallbackFinanceItem
} from "@/utils/financeConfigFallbackData";
import { useBypassedFinanceConfig } from "@/hooks/useBypassedFinanceConfig";
import {
  useGetAllConfigDropdown,
  useGetBudgetLinesDropdown,
  useGetCostGroupingsDropdown,
  useGetCostInputsDropdown,
  useGetFCONumbersDropdown,
  useGetFundingSourcesDropdown,
  useGetInterventionAreasDropdown
} from "@/features/modules/controllers/config/allConfigController";
import { useGetAllFCONumbersUnrestricted } from "@/features/modules/controllers/finance/fcoNumberController";
import { useGetSingleBudgetLine } from "@/features/finance/controllers/classificationsController";

const CreateActivityMemo = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createActivityMemo, isLoading: isCreating, data: createData, response: createResponse, isSuccess: isCreateSuccess } = useCreateActivityMemo();

  // Debug console.log commented to prevent render loops
  // if (isCreateSuccess || isCreating) {
  //   console.log("🔄 Hook status:", { isCreating, isCreateSuccess, hasCreateData: !!createData, hasCreateResponse: !!createResponse, isSubmitting });
  // }

  // Handle successful creation and navigation
  useEffect(() => {
    // Debug console.log commented to prevent render loops
    // console.log("=== NAVIGATION USEEFFECT DEBUG ===");
    // console.log("isCreateSuccess:", isCreateSuccess);
    // console.log("createResponse:", createResponse);
    // console.log("createData:", createData);
    // console.log("isSubmitting:", isSubmitting);
    // console.log("Full response object:", JSON.stringify(createResponse, null, 2));
    // console.log("Full data object:", JSON.stringify(createData, null, 2));

    if (isCreateSuccess && createResponse && !isSubmitting) {
      // console.log("✅ Activity memo created successfully!");
      // console.log("Full createResponse:", createResponse);

      // Extract memo ID from response - try multiple possible locations
      const memoId = createResponse?.data?.id || createData?.id || createResponse?.id;
      // console.log("Extracted memo ID:", memoId);
      // console.log("Memo ID type:", typeof memoId);

      if (memoId) {
        // console.log("📝 Updating Redux with memo ID:", memoId);
        // Update the latest activity in Redux with the memo ID
        const currentActivity = store.getState().activity.activity;
        const latestActivityIndex = currentActivity.length - 1;

        if (latestActivityIndex >= 0) {
          const updatedActivity = {
            ...currentActivity[latestActivityIndex],
            createdMemoId: memoId,
          };

          dispatch(activityActions.updateActivity({
            index: latestActivityIndex,
            data: updatedActivity
          }));

          // console.log("✅ Updated Redux with memo ID:", memoId);
        }

        // Navigate directly to final preview
        // console.log("🧭 Navigating to final preview with ID:", memoId);
        const finalUrl = `${RouteEnum.FINAL_PREVIEW}?id=${memoId}&created=true`;
        // console.log("Final URL:", finalUrl);
        router.push(finalUrl);
      } else {
        // console.warn("❌ No memo ID found in response, falling back to sample preview");
        // console.log("Available response keys:", Object.keys(createResponse || {}));
        // console.log("Available data keys:", Object.keys(createData || {}));
        router.push(RouteEnum.FINAL_PREVIEW);
      }
    } // else {
    //   console.log("❌ Navigation conditions not met:");
    //   console.log("- isCreateSuccess:", isCreateSuccess);
    //   console.log("- createResponse exists:", !!createResponse);
    //   console.log("- not submitting:", !isSubmitting);
    // }
  }, [isCreateSuccess, createResponse, createData, router, isSubmitting, dispatch]);

  // NOTE: Old funding source API call removed - using comprehensive backend endpoint

  // Keep original activity plans query for now (display purposes)
  const { data: activites, error: activitiesError, isLoading: activitiesLoading, refetch: refetchActivities } = useGetAllActivityPlans({
    page: 1,
    size: 2000000,
    search: "",
    enabled: true,
  });

  // Get all users first (remove user_type filter to debug)
  const { data: users } = useGetAllUsers({
    page: 1,
    size: 2000000,
    search: "",
    // Temporarily removed user_type filter to see all users
  });

  // DEBUG: Log raw user data
  React.useEffect(() => {
    if (users) {
      console.log('🔍 DEBUG: Raw users data from API:', users);
      console.log('🔍 DEBUG: Users results:', (users as any)?.data?.results);
      console.log('🔍 DEBUG: Number of users fetched:', (users as any)?.data?.results?.length || 0);
    }
  }, [users]);

  // Fetch modules
  const modulesQuery = useGetAllModules({
    page: 1,
    size: 2000000,
    search: "",
    enabled: true,
  });
  const modulesData = modulesQuery?.data;
  const modulesLoading = modulesQuery?.isLoading ?? false;
  const modulesError = modulesQuery?.error;
  const isModulesError = modulesQuery?.isError ?? false;

  // Debug modules data (only log once when data changes)
  React.useEffect(() => {
    if (!modulesLoading && modulesData) {
      const rawResults = (modulesData as any)?.results || (modulesData as any)?.data?.results || [];
      console.log("🔵 MODULES: Loaded", rawResults.length, "modules:", rawResults.map((m: any) => m.name).join(", "));
    }
  }, [modulesData]);

  // NOTE: Old cost input and cost categories API calls removed - using comprehensive backend endpoint

  // NOTE: Old API calls removed - now using comprehensive backend endpoint from allConfigController

  // NOTE: All old individual API calls removed - using comprehensive backend endpoint below

  const { data: profile } = useGetUserProfile();

  // Use new comprehensive backend endpoint for real config data
  const { data: allConfigData, isLoading: configLoading, error: configError } = useGetAllConfigDropdown();

  // Individual config hooks for convenience (using the same comprehensive endpoint)
  const {
    data: backendBudgetLines,
    count: budgetLinesCount,
    isLoading: backendBudgetLinesLoading,
    source: budgetLinesSource
  } = useGetBudgetLinesDropdown();

  const {
    data: backendCostGroupings,
    count: costGroupingsCount,
    isLoading: backendCostGroupingsLoading,
    source: costGroupingsSource
  } = useGetCostGroupingsDropdown();

  const {
    data: backendCostInputs,
    count: costInputsCount,
    isLoading: costInputLoading,  // renamed to avoid conflicts
    source: costInputsSource
  } = useGetCostInputsDropdown();

  const {
    data: backendFCONumbers,
    count: fcoNumbersCount,
    isLoading: fcoLoading,  // renamed to match existing usage
    source: fcoNumbersSource
  } = useGetFCONumbersDropdown();

  // Dedicated FCO Numbers API (more reliable than comprehensive config)
  const {
    data: dedicatedFCOData,
    isLoading: dedicatedFCOLoading,
    error: dedicatedFCOError
  } = useGetAllFCONumbersUnrestricted({
    page: 1,
    size: 1000,
    search: "",
    enabled: true
  });

  const {
    data: backendFundingSources,
    count: fundingSourcesCount,
    isLoading: fundingSourceLoading,
    source: fundingSourcesSource
  } = useGetFundingSourcesDropdown();

  const {
    data: backendInterventionAreas,
    count: interventionAreasCount,
    isLoading: interventionsLoading,  // renamed to match existing usage
    source: interventionAreasSource
  } = useGetInterventionAreasDropdown();

  // Fallback for bypass approach (remove once backend is confirmed working)
  const {
    data: bypassedFinanceData,
    isLoading: bypassLoading,
    errors: bypassErrors,
    sources: bypassSources
  } = useBypassedFinanceConfig();

  // Create formatted options for dropdowns - prioritize real backend data
  const budgetLinesOptions = React.useMemo(() => {
    let rawResults = [];
    let dataSource = '';

    // Priority 1: New comprehensive backend endpoint
    if (backendBudgetLines.length > 0) {
      rawResults = backendBudgetLines;
      dataSource = `🏆 REAL BACKEND DATA (${budgetLinesCount} items)`;
    }
    // Priority 2: Bypassed data (old approach)
    else if (bypassedFinanceData.budgetLines.length > 3) {
      rawResults = bypassedFinanceData.budgetLines;
      dataSource = `BYPASSED (${bypassSources.budgetLines})`;
    }
    // Priority 3: Legacy fallback data (for remaining gaps)
    else {
      rawResults = [];
      dataSource = 'NO DATA AVAILABLE';
    }

    // Debug console.log commented to prevent render loops
    // console.log(`🔍 BUDGET LINES DATA SOURCE: ${dataSource}`);
    // console.log("Budget Lines raw results:", rawResults);

    const apiOptions = rawResults.map((item: any) => ({
      id: item.id,
      name: item.name || item.description || 'Unnamed Item'
    }));

    // Only apply fallback merge if using non-backend sources
    const finalOptions = backendBudgetLines.length > 0 ? apiOptions : mergeFallbackBudgetLines(apiOptions);
    // console.log(`💰 Budget Lines: ${apiOptions.length} from ${dataSource} + ${finalOptions.length - apiOptions.length} fallback = ${finalOptions.length} total`);
    return finalOptions;
  }, [backendBudgetLines, budgetLinesCount, bypassedFinanceData.budgetLines, bypassSources.budgetLines]);

  const costGroupingsOptions = React.useMemo(() => {
    let rawResults = [];
    let dataSource = '';

    // Priority 1: New comprehensive backend endpoint
    if (backendCostGroupings.length > 0) {
      rawResults = backendCostGroupings;
      dataSource = `🏆 REAL BACKEND DATA (${costGroupingsCount} items)`;
    }
    // Priority 2: Bypassed data as fallback
    else if (bypassedFinanceData.costCategories.length > 3) {
      rawResults = bypassedFinanceData.costCategories;
      dataSource = `BYPASSED (${bypassSources.costCategories})`;
    }
    // Priority 3: Legacy fallback data (for remaining gaps)
    else {
      rawResults = [];
      dataSource = 'NO DATA AVAILABLE';
    }

    // Debug console.log commented to prevent render loops
    // console.log(`📊 COST GROUPINGS DATA SOURCE: ${dataSource}`);
    // console.log("Cost Groupings raw results:", rawResults);

    const apiOptions = rawResults.map((item: any) => ({
      id: item.id,
      name: item.name || item.code || item.description || 'Unnamed Cost Grouping'
    }));

    // Only apply fallback merge if using non-backend sources
    const finalOptions = backendCostGroupings.length > 0 ? apiOptions : mergeFallbackCostCategories(apiOptions);
    // console.log(`📊 Cost Groupings: ${apiOptions.length} from ${dataSource} + ${finalOptions.length - apiOptions.length} fallback = ${finalOptions.length} total`);
    return finalOptions;
  }, [backendCostGroupings, costGroupingsCount, bypassedFinanceData.costCategories, bypassSources.costCategories]);

  const costInputOptions = React.useMemo(() => {
    let rawResults = [];
    let dataSource = '';

    // Priority 1: New comprehensive backend endpoint
    if (backendCostInputs.length > 0) {
      rawResults = backendCostInputs;
      dataSource = `🏆 REAL BACKEND DATA (${costInputsCount} items)`;
    }
    // Priority 2: Bypassed data as fallback
    else if (bypassedFinanceData.costInputs.length > 3) {
      rawResults = bypassedFinanceData.costInputs;
      dataSource = `BYPASSED (${bypassSources.costInputs})`;
    }
    // Priority 3: Legacy fallback data (for remaining gaps)
    else {
      rawResults = [];
      dataSource = 'NO DATA AVAILABLE';
    }

    // Debug console.log commented to prevent render loops
    // console.log(`🔧 COST INPUTS DATA SOURCE: ${dataSource}`);
    // console.log("Cost Inputs raw results:", rawResults);

    const apiOptions = rawResults.map((item: any) => ({
      id: item.id,
      name: item.name || item.description || 'Unnamed Item'
    }));

    // Only apply fallback merge if using non-backend sources
    const finalOptions = backendCostInputs.length > 0 ? apiOptions : mergeFallbackCostInputs(apiOptions);
    // console.log(`🔧 Cost Inputs: ${apiOptions.length} from ${dataSource} + ${finalOptions.length - apiOptions.length} fallback = ${finalOptions.length} total`);
    return finalOptions;
  }, [backendCostInputs, costInputsCount, bypassedFinanceData.costInputs, bypassSources.costInputs]);

  const fcoOptions = React.useMemo(() => {
    let rawResults = [];
    let dataSource = '';

    // Priority 1: Dedicated FCO Numbers API (most reliable)
    const dedicatedFCOResults = dedicatedFCOData?.data?.results || dedicatedFCOData?.results || [];
    if (dedicatedFCOResults.length > 0) {
      rawResults = dedicatedFCOResults;
      dataSource = `🎯 DEDICATED FCO API (${dedicatedFCOResults.length} items)`;
    }
    // Priority 2: Comprehensive backend endpoint
    else if (backendFCONumbers.length > 0) {
      rawResults = backendFCONumbers;
      dataSource = `🏆 COMPREHENSIVE CONFIG API (${fcoNumbersCount} items)`;
    }
    // Priority 3: Show fallback data when both APIs return no FCO numbers
    else {
      rawResults = [];
      dataSource = 'NO FCO NUMBERS FROM APIS - USING FALLBACK';
    }

    // Debug console.log commented to prevent render loops
    // console.log(`🔢 FCO DATA SOURCE: ${dataSource}`);
    // console.log("🔢 Dedicated FCO API results:", dedicatedFCOResults);
    // console.log("🔢 Comprehensive config FCO results:", backendFCONumbers);
    // console.log("🔢 FCO raw results chosen:", rawResults);
    // console.log("🔢 FCO API errors:", { dedicatedError: dedicatedFCOError, comprehensiveError: null });

    const apiOptions = rawResults.map((item: any) => ({
      id: item.id,
      name: item.name || item.number || item.code || `FCO-${item.id?.slice(0, 8) || 'Unknown'}`
    }));

    // Apply fallback merge only when no real API data is available
    const finalOptions = dedicatedFCOResults.length > 0 || backendFCONumbers.length > 0
      ? apiOptions
      : mergeFallbackFCONumbers(apiOptions);

    // console.log(`🔢 FCO Numbers final result: ${apiOptions.length} from API + ${finalOptions.length - apiOptions.length} from fallback = ${finalOptions.length} total`);
    // console.log(`🔢 FCO Final options:`, finalOptions);
    return finalOptions;
  }, [dedicatedFCOData, backendFCONumbers, fcoNumbersCount, dedicatedFCOError]);

  const fundingSourceOptions = React.useMemo(() => {
    let rawResults = [];
    let dataSource = '';

    // Priority 1: New comprehensive backend endpoint
    if (backendFundingSources.length > 0) {
      rawResults = backendFundingSources;
      dataSource = `🏆 REAL BACKEND DATA (${fundingSourcesCount} items)`;
    }
    // Priority 2: Bypassed data as fallback
    else {
      rawResults = [];
      dataSource = 'NO DATA AVAILABLE';
    }

    // Debug console.log commented to prevent render loops
    // console.log(`💰 FUNDING SOURCES DATA SOURCE: ${dataSource}`);
    // console.log("Funding Sources raw results:", rawResults);

    const apiOptions = rawResults.map((item: any) => ({
      id: item.id,
      name: item.name || 'Unnamed Funding Source'
    }));

    // Only apply fallback merge if using non-backend sources
    const finalOptions = backendFundingSources.length > 0 ? apiOptions : mergeFallbackFundingSources(apiOptions);
    // console.log(`💰 Funding Sources: ${apiOptions.length} from ${dataSource} + ${finalOptions.length - apiOptions.length} fallback = ${finalOptions.length} total`);
    return finalOptions;
  }, [backendFundingSources, fundingSourcesCount]);

  // Debug console.log commented to prevent render loops
  // React.useEffect(() => {
  //   console.log("=== 🎯 REAL BACKEND DATA STATUS ===");
  //   console.log("All Config Data:", allConfigData);
  //   console.log("Config Loading:", configLoading);
  //   console.log("Config Error:", configError);
  //   console.log("🏆 Budget Lines (Backend):", backendBudgetLines.length, "items", backendBudgetLines);
  //   console.log("🏆 Cost Categories (Backend):", backendCostCategories.length, "items", backendCostCategories);
  //   console.log("🏆 Cost Inputs (Backend):", backendCostInputs.length, "items", backendCostInputs);
  //   console.log("🏆 FCO Numbers (Backend):", backendFCONumbers.length, "items", backendFCONumbers);
  //   console.log("🏆 Funding Sources (Backend):", backendFundingSources.length, "items", backendFundingSources);
  //   console.log("🏆 Intervention Areas (Backend):", backendInterventionAreas.length, "items", backendInterventionAreas);
  //   console.log("=== BYPASSED DATA DEBUG (for comparison) ===");
  //   console.log("Bypassed Budget Lines:", bypassedFinanceData.budgetLines.length, "items");
  //   console.log("Bypassed Cost Categories:", bypassedFinanceData.costCategories.length, "items");
  //   console.log("Bypassed Cost Inputs:", bypassedFinanceData.costInputs.length, "items");
  //   console.log("Bypassed FCO Numbers:", bypassedFinanceData.fcoNumbers.length, "items");
  //   console.log("Bypassed Funding Sources:", bypassedFinanceData.fundingSources.length, "items");
  //   console.log("Bypassed Intervention Areas:", bypassedFinanceData.interventionAreas.length, "items");
  //   console.log("=== END API DEBUG ===");
  // }, [allConfigData, backendBudgetLines, backendCostCategories, backendCostInputs, backendFCONumbers, backendFundingSources, backendInterventionAreas, bypassedFinanceData]);

  // Debug console.log commented to prevent render loops
  // if (fundingSourceLoading || costInputLoading || backendCostCategoriesLoading || backendBudgetLinesLoading || fcoLoading || dedicatedFCOLoading || interventionsLoading) {
  //   console.log("⏳ Some data still loading...");
  // }

  // ===== APPROVAL ROUTING ROLE CONFIGURATION =====
  // Configure which roles can perform each approval action
  const APPROVAL_ROLES = {
    // Reviewers (Copy/CC) - First level review: Supervisors and Managers
    reviewers: ['SUPER ADMIN', 'SUPERVISOR', 'MANAGER'],
    // Authorisers (Through) - Second level authorization: Managers and Directors
    authorisers: ['SUPER ADMIN', 'MANAGER', 'DIRECTOR'],
    // Approvers (To) - Final approval: Directors and MD
    approvers: ['SUPER ADMIN', 'DIRECTOR', 'MD', 'MANAGING DIRECTOR'],
  };

  // Filter internal users (exclude vendors, consultants, etc.)
  const allUsers = (users as any)?.data?.results || [];

  const internalUsers = allUsers.filter((user: any) => {
    const userType = user.user_type;
    const isInternal = userType === 'AHNI_STAFF' || userType === 'ADMIN';

    // DEBUG: Log each user's type
    if (!isInternal) {
      console.log(`🔍 Filtered out user: ${user.first_name} ${user.last_name} (Type: ${userType})`);
    }

    return isInternal;
  });

  // DEBUG: Log filtered results
  React.useEffect(() => {
    console.log('🔍 DEBUG: Total users from API:', allUsers.length);
    console.log('🔍 DEBUG: Internal users (AHNI_STAFF + ADMIN):', internalUsers.length);
    if (allUsers.length > 0) {
      const userTypeCounts = allUsers.reduce((acc: any, user: any) => {
        acc[user.user_type] = (acc[user.user_type] || 0) + 1;
        return acc;
      }, {});
      console.log('🔍 DEBUG: User type breakdown:', userTypeCounts);
    }
  }, [allUsers, internalUsers]);

  // DEBUG: Log all users and their roles to see what roles exist in the system
  React.useEffect(() => {
    if (internalUsers.length > 0) {
      console.log('🔍 DEBUG: Internal Users and their roles:');
      const rolesSummary = internalUsers.map((user: any) => ({
        name: `${user.first_name} ${user.last_name}`,
        user_type: user.user_type,
        roles: user.roles?.map((r: any) => r.name || r) || [],
        position: user.position?.name || user.position,
      }));
      console.table(rolesSummary);

      // Get unique role names
      const allRoles = new Set<string>();
      internalUsers.forEach((user: any) => {
        if (user.roles && Array.isArray(user.roles)) {
          user.roles.forEach((role: any) => {
            allRoles.add(role.name || role);
          });
        }
      });
      console.log('📋 All unique roles in system:', Array.from(allRoles));
    }
  }, [internalUsers]);

  // Helper function to check if user has any of the specified roles
  const userHasRole = (user: any, allowedRoles: string[]) => {
    if (!user.roles || !Array.isArray(user.roles)) return false;
    const userRoleNames = user.roles.map((role: any) =>
      (role.name || role).toUpperCase()
    );
    return allowedRoles.some(allowedRole =>
      userRoleNames.includes(allowedRole.toUpperCase())
    );
  };

  // Filter users by role for each approval level
  const reviewerUsers = internalUsers.filter((user: any) =>
    userHasRole(user, APPROVAL_ROLES.reviewers)
  );

  const authoriserUsers = internalUsers.filter((user: any) =>
    userHasRole(user, APPROVAL_ROLES.authorisers)
  );

  const approverUsers = internalUsers.filter((user: any) =>
    userHasRole(user, APPROVAL_ROLES.approvers)
  );

  // Create options for each approval level
  const reviewerOptions = reviewerUsers.map(
    ({ first_name, last_name, id, position, roles }: any) => ({
      name: `${first_name || ''} ${last_name || ''}${position ? ` (${position.name || position})` : ''}`.trim() || 'Unnamed User',
      id,
    })
  );

  const authoriserOptions = authoriserUsers.map(
    ({ first_name, last_name, id, position, roles }: any) => ({
      name: `${first_name || ''} ${last_name || ''}${position ? ` (${position.name || position})` : ''}`.trim() || 'Unnamed User',
      id,
    })
  );

  const approverOptions = approverUsers.map(
    ({ first_name, last_name, id, position, roles }: any) => ({
      label: `${first_name || ''} ${last_name || ''}${position ? ` (${position.name || position})` : ''}`.trim() || 'Unnamed User',
      value: id,
    })
  );

  // Role-based filtering is now enabled with correct role names
  const showAllInternalUsers = false; // Roles are configured correctly

  const finalReviewerOptions = (showAllInternalUsers || reviewerOptions.length === 0)
    ? internalUsers.map(({ first_name, last_name, id, position, roles }: any) => ({
        name: `${first_name || ''} ${last_name || ''}${position ? ` (${position.name || position})` : ''}`.trim() || 'Unnamed User',
        id,
      }))
    : reviewerOptions;

  const finalAuthoriserOptions = (showAllInternalUsers || authoriserOptions.length === 0)
    ? internalUsers.map(({ first_name, last_name, id, position, roles }: any) => ({
        name: `${first_name || ''} ${last_name || ''}${position ? ` (${position.name || position})` : ''}`.trim() || 'Unnamed User',
        id,
      }))
    : authoriserOptions;

  const finalApproverOptions = (showAllInternalUsers || approverOptions.length === 0)
    ? internalUsers.map(({ first_name, last_name, id, position, roles }: any) => ({
        label: `${first_name || ''} ${last_name || ''}${position ? ` (${position.name || position})` : ''}`.trim() || 'Unnamed User',
        value: id,
      }))
    : approverOptions;

  // Keep these for backward compatibility
  const usersOptions = finalReviewerOptions;
  const usersOptionsFn = finalApproverOptions;

  const activitiesOptions = React.useMemo(() => {
    // Debug console.log commented to prevent render loops
    // console.log("Activities loading state:", activitiesLoading);
    // console.log("Activities error:", activitiesError);
    // if (activitiesError) {
    //   console.error("Detailed activities error:", activitiesError);
    // }
    const rawResults = (activites as any)?.data?.results || [];
    // console.log("Activities raw data:", activites);
    // console.log("Activities raw results:", rawResults);
    // console.log("Number of activities loaded:", rawResults.length);

    // Show all activities (removed restrictive memo filter)
    // Sort activities - memo required first, then by activity code
    const sortedActivities = rawResults.sort((a: any, b: any) => {
      if (a.is_memo_required && !b.is_memo_required) return -1;
      if (!a.is_memo_required && b.is_memo_required) return 1;
      return (a.activity_code || '').localeCompare(b.activity_code || '');
    });

    const options = sortedActivities.map(({ activity_code, activity_description, id, work_plan_activity, is_memo_required, work_plan_activity_identifier }: any) => {
      // console.log("Activity data:", { activity_code, activity_description, id, work_plan_activity, is_memo_required, work_plan_activity_identifier });

      // Build display label with activity number, code, and description
      const activityNumber = work_plan_activity_identifier || '';
      const label = activityNumber
        ? `${activityNumber} | ${activity_code} - ${activity_description}${is_memo_required ? ' ✓' : ''}`
        : `${activity_code} - ${activity_description}${is_memo_required ? ' ✓' : ''}`;

      return {
        label,
        value: id, // Use ActivityPlan ID directly as per backend analysis
      };
    });
    // console.log("Activities formatted options:", options);
    return options;
  }, [activites, activitiesLoading, activitiesError]);

  // Form persistence key
  const FORM_STORAGE_KEY = 'activity_memo_form_data';

  // Load saved form data from localStorage
  const loadSavedFormData = () => {
    try {
      const savedData = localStorage.getItem(FORM_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);

        // Validate the structure to ensure it's compatible
        if (parsedData && typeof parsedData === 'object') {
          // Helper function to validate UUIDs against available options
          const validateUUIDs = (uuids: any[], availableOptions: any[]): string[] => {
            if (!Array.isArray(uuids)) return [];
            const availableIds = new Set(availableOptions.map(opt => opt.id));
            const validUuids = uuids.filter(uuid => availableIds.has(uuid));
            const invalidUuids = uuids.filter(uuid => !availableIds.has(uuid));

            if (invalidUuids.length > 0) {
              console.warn(`⚠️ Removed ${invalidUuids.length} invalid UUIDs from localStorage draft:`, invalidUuids);
            }

            return validUuids;
          };

          // Validate all UUID array fields against available options
          const validatedData = {
            ...parsedData,
            fconumber: validateUUIDs(parsedData.fconumber, fcoOptions),
            module: validateUUIDs(parsedData.module, modulesOptions),
            intervention_areas: validateUUIDs(parsedData.intervention_areas, interventionsOptions),
            budget_line: validateUUIDs(parsedData.budget_line, budgetLinesOptions),
            cost_categories: validateUUIDs(parsedData.cost_categories, costGroupingsOptions),
            cost_input: validateUUIDs(parsedData.cost_input, costInputOptions),
            funding_source: validateUUIDs(parsedData.funding_source, fundingSourceOptions),
            copy: validateUUIDs(parsedData.copy, finalReviewerOptions || []),
            through: validateUUIDs(parsedData.through, finalAuthoriserOptions || []),
            expenses: Array.isArray(parsedData.expenses) ? parsedData.expenses : [],
          };
          // console.log('📋 Validated saved data:', validatedData);
          return validatedData;
        }
      } // else {
      //   console.log('ℹ️ No saved form data found');
      // }
    } catch (error) {
      console.error('❌ Error loading saved form data:', error);
      // Clear corrupted data
      localStorage.removeItem(FORM_STORAGE_KEY);
    }
    return null;
  };

  const savedFormData = loadSavedFormData();

  // Log when saved data is loaded
  React.useEffect(() => {
    if (savedFormData) {
      console.log('📋 Form pre-populated from localStorage (saved draft)');
      console.log('💡 To start fresh, clear your browser localStorage or use the "Clear Form" button');
    }
  }, []);

  const form = useForm<z.infer<typeof SampleMemoSchema>>({
    resolver: zodResolver(SampleMemoSchema),
    defaultValues: savedFormData || {
      activity: "",
      subject: "",
      requested_date: "",
      fconumber: [],
      module: [],
      intervention_areas: [],
      budget_line: [],
      cost_categories: [],
      cost_input: [],
      funding_source: [],
      comment: "",
      copy: [],
      approved_by: "",
      // reviewed_by: "",
      created_by: "",
      // authorized_by: "",
      through: [],
      expenses: [],
      // created_by: profile?.data.id,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;

  // Watch all form values for auto-save
  const watchedValues = watch();

  // Watch for Budget Line selection changes to filter modules and intervention areas
  const selectedBudgetLineIds = watch('budget_line') || [];
  const firstBudgetLineId = Array.isArray(selectedBudgetLineIds) && selectedBudgetLineIds.length > 0
    ? selectedBudgetLineIds[0]
    : null;

  // Fetch selected Budget Line details (with related modules and intervention areas)
  const { data: selectedBudgetLineData } = useGetSingleBudgetLine(
    firstBudgetLineId || '',
    !!firstBudgetLineId // Only fetch if a budget line is selected
  );

  // Module options - filter by selected Budget Line if one is selected
  const modulesOptions = React.useMemo(() => {
    const rawResults = (modulesData as any)?.results || (modulesData as any)?.data?.results || [];
    const allOptions = rawResults.map(({ name, id }: any) => ({
      id,
      name,
    }));

    // If a Budget Line is selected and it has related modules, filter the options
    const budgetLineModules = selectedBudgetLineData?.data?.modules || [];
    if (firstBudgetLineId && budgetLineModules.length > 0) {
      const filteredOptions = allOptions.filter((option: any) =>
        budgetLineModules.includes(option.id)
      );
      console.log(`🔍 Filtering modules by Budget Line: ${filteredOptions.length}/${allOptions.length} modules`);
      return filteredOptions;
    }

    // Otherwise show all modules
    return allOptions;
  }, [modulesData, selectedBudgetLineData, firstBudgetLineId]);

  // Intervention Areas options - filter by selected Budget Line if one is selected
  const interventionsOptions = React.useMemo(() => {
    let rawResults = [];
    let dataSource = '';

    // Priority 1: New comprehensive backend endpoint
    if (backendInterventionAreas.length > 0) {
      rawResults = backendInterventionAreas;
      dataSource = `🏆 REAL BACKEND DATA (${interventionAreasCount} items)`;
    }
    // Priority 2: Bypassed data as fallback
    else {
      rawResults = [];
      dataSource = 'NO DATA AVAILABLE';
    }

    const apiOptions = rawResults.map(({ code, id }: any) => ({
      id,
      name: code,
    }));

    // Apply fallback merge if needed
    const allOptions = backendInterventionAreas.length > 0 ? apiOptions : mergeFallbackInterventionAreas(apiOptions);

    // If a Budget Line is selected and it has related intervention areas, filter the options
    const budgetLineInterventionAreas = selectedBudgetLineData?.data?.intervention_areas || [];
    if (firstBudgetLineId && budgetLineInterventionAreas.length > 0) {
      const filteredOptions = allOptions.filter((option: any) =>
        budgetLineInterventionAreas.includes(option.id)
      );
      console.log(`🔍 Filtering intervention areas by Budget Line: ${filteredOptions.length}/${allOptions.length} areas`);
      return filteredOptions;
    }

    // Otherwise show all intervention areas
    return allOptions;
  }, [backendInterventionAreas, interventionAreasCount, selectedBudgetLineData, firstBudgetLineId]);

  // Save form data to localStorage
  const saveFormData = (data: any) => {
    try {
      // Don't save if data is empty or just default values
      const hasContent = Object.values(data).some(value => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'string') return value.trim().length > 0;
        return false;
      });

      if (hasContent) {
        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
        // Debug console.log commented to prevent render loops
        // console.log('Form data saved to localStorage');
      }
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  // Auto-save form data when values change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveFormData(watchedValues);
    }, 1000); // Debounce saves by 1 second

    return () => clearTimeout(timeoutId);
  }, [watchedValues]);

  // Clear saved data on successful submission
  const clearSavedData = () => {
    try {
      localStorage.removeItem(FORM_STORAGE_KEY);
      console.log('Saved form data cleared');
    } catch (error) {
      console.error('Error clearing saved data:', error);
    }
  };

  // Debug console.log commented to prevent render loops
  // if (Object.keys(errors).length > 0) {
  //   console.log("📝 Form validation errors:", errors);
  // }

  useEffect(() => {
    if (profile) {
      // Get current form values to preserve saved data
      const currentValues = form.getValues();

      // Only update the created_by field if it's not already set
      if (!currentValues.created_by) {
        form.setValue('created_by', profile?.data.id);
      }
    }
  }, [profile, form]);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "expenses",
  });

  // Auto-populate financial fields when activity is selected
  const selectedActivityId = watch('activity');
  const prevActivityIdRef = React.useRef<string | null>(null);

  // Get selected activity's project ID
  const selectedActivity = React.useMemo(() => {
    if (selectedActivityId && activites) {
      return (activites as any)?.data?.results?.find(
        (activity: any) => activity.id === selectedActivityId
      );
    }
    return null;
  }, [selectedActivityId, activites]);

  const projectId = selectedActivity?.project || null;

  // Fetch project details when activity has a project
  const { data: projectData } = useGetSingleProject(projectId as string, !!projectId);

  useEffect(() => {
    if (selectedActivityId && activites) {
      const selectedActivity = (activites as any)?.data?.results?.find(
        (activity: any) => activity.id === selectedActivityId
      );

      if (selectedActivity) {
        // DEBUG: Log the complete activity object to see what fields are available
        console.log("🔍 SELECTED ACTIVITY COMPLETE DATA:", JSON.stringify(selectedActivity, null, 2));
        console.log("📋 Activity Fields Available:", {
          hasbudget_line: !!selectedActivity.budget_line,
          budget_line: selectedActivity.budget_line,
          hasModule: !!selectedActivity.module,
          module: selectedActivity.module,
          hasIntervention: !!selectedActivity.intervention_area,
          intervention_area: selectedActivity.intervention_area,
          hasCostCategory: !!selectedActivity.cost_category,
          cost_category: selectedActivity.cost_category,
          hasCostInput: !!selectedActivity.cost_input,
          cost_input: selectedActivity.cost_input,
          hasProject: !!selectedActivity.project,
          project: selectedActivity.project
        });
        console.log("📊 Options Arrays Status:", {
          budgetLinesOptions: budgetLinesOptions.length,
          modulesOptions: modulesOptions.length,
          interventionsOptions: interventionsOptions.length,
          costGroupingsOptions: costGroupingsOptions.length,
          costInputOptions: costInputOptions.length,
          fundingSourceOptions: fundingSourceOptions.length,
        });

        // Check if this is a new activity selection (activity changed)
        const isActivityChange = prevActivityIdRef.current !== null && prevActivityIdRef.current !== selectedActivityId;

        if (isActivityChange) {
          console.log("🔄 Activity changed - clearing old financial fields before auto-populating new ones...");
          // Clear all financial fields when activity changes
          setValue('budget_line', []);
          setValue('module', []);
          setValue('intervention_areas', []);
          setValue('cost_categories', []);
          setValue('cost_input', []);
          setValue('funding_source', []); // Clear funding source too
        }

        // Update the ref to track the current activity
        prevActivityIdRef.current = selectedActivityId;

        console.log("🎯 Auto-populating financial fields from activity...");
        let fieldsPopulated = 0;

        // Helper function to find option ID by name (case-insensitive match)
        const findOptionIdByName = (options: any[], searchName: string) => {
          if (!searchName) return null;
          const option = options.find(opt =>
            opt.name?.toLowerCase().trim() === searchName.toLowerCase().trim()
          );
          return option?.id || null;
        };

        // 1. Budget Line (string → array of IDs)
        if (selectedActivity.budget_line && budgetLinesOptions.length > 0) {
          const budgetLineId = findOptionIdByName(budgetLinesOptions, selectedActivity.budget_line);
          if (budgetLineId) {
            setValue('budget_line', [budgetLineId]);
            fieldsPopulated++;
            console.log(`✅ Budget Line: "${selectedActivity.budget_line}" → ID: ${budgetLineId}`);
          } else {
            console.log(`⚠️ Budget Line "${selectedActivity.budget_line}" not found in options`);
          }
        }

        // 2. Module (string → array of IDs) - only if activity has module field
        if (selectedActivity.module && modulesOptions.length > 0) {
          const moduleId = findOptionIdByName(modulesOptions, selectedActivity.module);
          if (moduleId) {
            setValue('module', [moduleId]);
            fieldsPopulated++;
            console.log(`✅ Module: "${selectedActivity.module}" → ID: ${moduleId}`);
          } else {
            console.log(`⚠️ Module "${selectedActivity.module}" not found in options`);
          }
        }

        // 3. Intervention Area (string → array of IDs)
        if (selectedActivity.intervention_area && interventionsOptions.length > 0) {
          const interventionId = findOptionIdByName(interventionsOptions, selectedActivity.intervention_area);
          if (interventionId) {
            setValue('intervention_areas', [interventionId]);
            fieldsPopulated++;
            console.log(`✅ Intervention Area: "${selectedActivity.intervention_area}" → ID: ${interventionId}`);
          } else {
            console.log(`⚠️ Intervention Area "${selectedActivity.intervention_area}" not found in options`);
          }
        }

        // 4. Cost Grouping (string → array of IDs)
        // Note: Activity has both cost_category (old/test data) and cost_grouping (correct field)
        const costGroupingValue = selectedActivity.cost_grouping || selectedActivity.cost_category;
        console.log("🔍 Cost Grouping Debug:", {
          fromActivity: costGroupingValue,
          availableOptions: costGroupingsOptions.map((opt: any) => opt.name)
        });
        if (costGroupingValue && costGroupingsOptions.length > 0) {
          const costGroupingId = findOptionIdByName(costGroupingsOptions, costGroupingValue);
          if (costGroupingId) {
            setValue('cost_categories', [costGroupingId]);
            fieldsPopulated++;
            console.log(`✅ Cost Grouping: "${costGroupingValue}" → ID: ${costGroupingId}`);
          } else {
            console.log(`⚠️ Cost Grouping "${costGroupingValue}" not found in options`);
            console.log("Available cost grouping names:", costGroupingsOptions.map((opt: any) => opt.name).join(", "));
          }
        }

        // 5. Cost Input (string → array of IDs)
        if (selectedActivity.cost_input && costInputOptions.length > 0) {
          const costInputId = findOptionIdByName(costInputOptions, selectedActivity.cost_input);
          if (costInputId) {
            setValue('cost_input', [costInputId]);
            fieldsPopulated++;
            console.log(`✅ Cost Input: "${selectedActivity.cost_input}" → ID: ${costInputId}`);
          } else {
            console.log(`⚠️ Cost Input "${selectedActivity.cost_input}" not found in options`);
            console.log("Available cost input names:", costInputOptions.map((opt: any) => opt.name).join(", "));
            console.log("💡 Note: Activity has cost_input = '" + selectedActivity.cost_input + "' which may be a Cost Grouping, not a Cost Input");
          }
        }

        // 6. Funding Source from Project (if activity is linked to a project)
        if (projectData && fundingSourceOptions.length > 0) {
          const project = (projectData as any)?.data || projectData;
          console.log("🏢 Activity is linked to project:", project?.title);

          // Project funding_sources is an array of objects with { id, name }
          const projectFundingSources = project?.funding_sources || [];
          console.log("💰 Project funding sources:", projectFundingSources);

          if (projectFundingSources.length > 0) {
            // Extract IDs from the project's funding sources
            const fundingSourceIds = projectFundingSources.map((fs: any) => fs.id);
            setValue('funding_source', fundingSourceIds);
            fieldsPopulated++;
            console.log(`✅ Funding Source(s) from project: ${projectFundingSources.map((fs: any) => fs.name).join(', ')} → IDs: ${fundingSourceIds.join(', ')}`);
          } else {
            console.log("⚠️ Project has no funding sources configured");
          }
        } else if (selectedActivity.project) {
          console.log("⚠️ Activity has project ID but project data not loaded yet");
        }

        // Show feedback to user
        const autoFilledFundingSource = projectData && (projectData as any)?.data?.funding_sources?.length > 0;
        if (fieldsPopulated > 0) {
          toast.success(`Auto-filled ${fieldsPopulated} financial field(s) from activity`, {
            description: autoFilledFundingSource ? "FCO Number needs to be selected manually" : "FCO Number and Funding Source need to be selected manually",
            duration: 3000,
          });
        } else {
          toast.info("Activity selected, but no financial fields could be auto-populated", {
            description: "Please fill in the financial fields manually",
            duration: 3000,
          });
        }

        console.log(`📊 Auto-population complete: ${fieldsPopulated} fields populated`);
      }
    }
  }, [selectedActivityId, activites, budgetLinesOptions, modulesOptions, interventionsOptions, costGroupingsOptions, costInputOptions, projectData, fundingSourceOptions, setValue]);

  const onSubmit = async (data: z.infer<typeof SampleMemoSchema>) => {
    console.log("🚀 FORM SUBMISSION STARTED!");
    console.log("Form data received:", data);
    setIsSubmitting(true);

    try {
      console.log("Submitting activity memo:", data);

      // TEMPORARY: Skip activity validation since we're not sending activity field
      // Issue: ActivityPlan vs ActivityPlanFromWorkPlan model mismatch
      // Activity field is optional in backend, so we can proceed without it
      console.log("All available activity IDs:", activitiesOptions.map((a: any) => a.value));
      console.log("Selected activity ID from form:", data.activity);
      console.log("Skipping activity validation - field will not be sent to API");

      // Prepare the activity memo data according to API requirements
      console.log("About to submit with activity ID:", data.activity);
      console.log("Type of activity ID:", typeof data.activity);
      const activityMemoData = {
        // Skip activity field for now since it's optional and causing UUID mismatch
        // activity: data.activity, // Commented out - ActivityPlan vs ActivityPlanFromWorkPlan mismatch
        subject: data.subject,
        requested_date: data.requested_date,
        comment: data.comment,
        approved_by: data.approved_by,
        created_by: data.created_by,
        fconumber: data.fconumber,
        intervention_areas: data.intervention_areas,
        budget_line: data.budget_line,
        cost_categories: data.cost_categories,
        cost_input: data.cost_input,
        funding_source: data.funding_source,
        through: data.through,
        copy: data.copy,
        expenses: data.expenses,
      };

      console.log("Formatted data for API:", activityMemoData);

      // Create the activity memo via API
      console.log("Making API call to create activity memo...");
      const apiResult = await createActivityMemo(activityMemoData);
      console.log("API call completed with result:", apiResult);
      console.log("API result type:", typeof apiResult);
      console.log("API result keys:", Object.keys(apiResult || {}));

      // IMMEDIATE NAVIGATION WORKAROUND: Use API result directly if hook data is undefined
      if (apiResult && apiResult.data && apiResult.data.id) {
        console.log("🚀 IMMEDIATE NAVIGATION: Using API result for navigation");
        const memoId = apiResult.data.id;
        console.log("📝 Immediate memo ID:", memoId);

        // Update Redux immediately
        const selectedActivity = (activites as any)?.data?.results?.find(
          (activity: any) => activity.id === data?.activity
        );
        const selectedCostGrouping = (backendCostGroupings as any)?.find(
          (costCategory: any) => costCategory.id === data?.cost_categories[0]
        );

        const { activity, ...dataWithoutActivity } = data;
        const dataToSave = {
          ...dataWithoutActivity,
          selectedActivity: selectedActivity,
          selectedCostGrouping: selectedCostGrouping,
          createdMemoId: memoId,
          timestamp: Date.now(),
        };
        console.log("📝 Saving to Redux immediately:", dataToSave);
        dispatch(activityActions.addActivity(dataToSave));

        // Navigate directly to final preview
        console.log("🧭 Immediate navigation to:", `${RouteEnum.FINAL_PREVIEW}?id=${memoId}&created=true`);
        router.push(`${RouteEnum.FINAL_PREVIEW}?id=${memoId}&created=true`);
        return; // Exit early since we handled navigation
      }

      // Get the selected activity and cost category for Redux store
      const selectedActivity = (activites as any)?.data?.results?.find(
        (activity: any) => activity.id === data?.activity
      );
      console.log("Selected activity for Redux:", selectedActivity);
      const selectedCostGrouping = (backendCostGroupings as any)?.find(
        (costCategory: any) => costCategory.id === data?.cost_categories[0]
      );

      // Save to Redux store for the next step (exclude activity field to avoid UUID mismatch)
      const { activity, ...dataWithoutActivity } = data;
      const dataToSave = {
        ...dataWithoutActivity,
        selectedActivity: selectedActivity,
        selectedCostGrouping: selectedCostGrouping,
        // Will store memo ID via useEffect when response is available
        timestamp: Date.now(), // Add timestamp to help identify the latest entry
      };
      console.log("Saving to Redux store:", dataToSave);
      dispatch(activityActions.addActivity(dataToSave));

      toast.success("Activity memo created successfully!");

      // Clear saved form data after successful submission
      clearSavedData();
    } catch (error: any) {
      console.error("Failed to create activity memo:", error);
      toast.error(error?.message || "Failed to create activity memo. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='pt-5'>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          {/* Activity and Subject */}
          <div className='grid grid-cols-2 gap-5'>
            {activitiesOptions && (
              <div>
                <FormSelect
                  label='Activity (Optional)'
                  name='activity'
                  required={false}
                  options={activitiesOptions}
                  placeholder='Select Activity'
                />
                <small className="text-gray-600 mt-1 block">
                  ✓ = Memo typically required for this activity
                </small>
              </div>
            )}
            <FormInput
              label='Subject'
              name='subject'
              required
              placeholder='Enter subject'
            />
          </div>

          {/* Requested Date */}
          <div className='grid grid-cols-2 gap-5'>
            <FormInput
              label='Requested Date'
              name='requested_date'
              type='date'
              required
            />
          </div>

          {/* Financial Information Section */}
          <div className='bg-gray-50 p-4 rounded-lg space-y-4'>
            <h3 className='text-lg font-semibold text-gray-800'>Financial Information</h3>

            <div className='grid grid-cols-2 gap-5'>
              <div>
                <Label className='font-semibold'>FCO Number</Label>
                {(fcoLoading || dedicatedFCOLoading) ? (
                  <div className="p-4 text-center text-gray-500">Loading FCO numbers...</div>
                ) : (
                  <FormField
                    control={form.control}
                    name='fconumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MultiSelectFormField
                            options={fcoOptions}
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder={fcoOptions.length === 0 ? 'No FCO numbers available' : 'Select FCO Number'}
                            variant='inverted'
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
                {errors.fconumber && (
                  <span className='text-sm text-red-500 font-medium'>
                    {errors.fconumber.message}
                  </span>
                )}
              </div>

              <div>
                <Label className='font-semibold'>Budget Line</Label>
                {backendBudgetLinesLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading budget lines...</div>
                ) : (
                  <FormField
                    control={form.control}
                    name='budget_line'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MultiSelectFormField
                            options={budgetLinesOptions}
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder={budgetLinesOptions.length === 0 ? 'No budget lines available' : 'Select Budget Line'}
                            variant='inverted'
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
                {errors.budget_line && (
                  <span className='text-sm text-red-500 font-semibold'>
                    {errors.budget_line.message}
                  </span>
                )}
              </div>

              <div>
                <Label className='font-semibold'>Module</Label>
                {modulesLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading modules...</div>
                ) : isModulesError ? (
                  <div className="p-4 text-center">
                    <p className="text-red-500 text-sm">Failed to load modules</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {modulesError?.message || 'API error - modules endpoint may not be available'}
                    </p>
                  </div>
                ) : (
                  <FormField
                    control={form.control}
                    name='module'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MultiSelectFormField
                            options={modulesOptions}
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder={modulesOptions.length === 0 ? 'No modules available' : 'Select Module'}
                            variant='inverted'
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
                {errors.module && (
                  <span className='text-sm text-red-500 font-medium'>
                    {errors.module.message}
                  </span>
                )}
                {!isModulesError && modulesOptions.length === 0 && !modulesLoading && (
                  <p className="text-amber-600 text-xs mt-1">
                    💡 No modules found. Create modules in Dashboard → Programs → Modules.
                  </p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-2 gap-5'>
              <div>
                <Label className='font-semibold'>Cost Grouping</Label>
                {backendCostGroupingsLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading cost categories...</div>
                ) : (
                  <FormField
                    control={form.control}
                    name='cost_categories'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MultiSelectFormField
                            options={costGroupingsOptions}
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder={costGroupingsOptions.length === 0 ? 'No cost groupings available' : 'Select Cost Grouping'}
                            variant='inverted'
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
                {errors.cost_categories && (
                  <span className='text-sm text-red-500 font-medium'>
                    {errors.cost_categories.message}
                  </span>
                )}
              </div>

              <div>
                <Label className='font-semibold'>Cost Input</Label>
                {costInputLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading cost inputs...</div>
                ) : (
                  <FormField
                    control={form.control}
                    name='cost_input'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MultiSelectFormField
                            options={costInputOptions}
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder={costInputOptions.length === 0 ? 'No cost inputs available' : 'Select Cost Input'}
                            variant='inverted'
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
                {errors.cost_input && (
                  <span className='text-sm text-red-500 font-medium'>
                    {errors.cost_input.message}
                  </span>
                )}
              </div>
            </div>

            <div className='grid grid-cols-2 gap-5'>
              <div>
                <Label className='font-semibold'>Funding Source</Label>
                {fundingSourceLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading funding sources...</div>
                ) : (
                  <FormField
                    control={form.control}
                    name='funding_source'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MultiSelectFormField
                            options={fundingSourceOptions}
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder={fundingSourceOptions.length === 0 ? 'No funding sources available' : 'Select Funding Source'}
                            variant='inverted'
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
                {errors.funding_source && (
                  <span className='text-sm text-red-500 font-medium'>
                    {errors.funding_source.message}
                  </span>
                )}
              </div>

              <div>
                <Label className='font-semibold'>Intervention Area</Label>
                {interventionsLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading intervention areas...</div>
                ) : (
                  <FormField
                    control={form.control}
                    name='intervention_areas'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MultiSelectFormField
                            options={interventionsOptions || []}
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder={interventionsOptions.length === 0 ? 'No intervention areas available' : 'Select Intervention Area'}
                            variant='inverted'
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
                {errors.intervention_areas && (
                  <span className='text-sm text-red-500 font-medium'>
                    {errors.intervention_areas.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Memo Content */}
          <FormTextArea
            label='Memo Content'
            name='comment'
            placeholder='Enter memo content'
            rows={4}
          />

          <Separator className='my-4' />

          {/* Approval Section */}
          <div className='space-y-4'>
            <h3 className='font-semibold text-lg text-gray-800'>Approval & Routing</h3>

            <div className='grid grid-cols-3 gap-5'>
              {/* Reviewer */}
              <div>
                <Label className='font-semibold'>Reviewer (Copy/CC)</Label>
                <FormField
                  control={form.control}
                  name='copy'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultiSelectFormField
                          options={finalReviewerOptions || []}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder={finalReviewerOptions.length === 0 ? 'No reviewers available' : 'Select Reviewer(s)'}
                          variant='inverted'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {finalReviewerOptions.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ No users with Supervisor or Manager roles found
                  </p>
                )}
              </div>

              {/* Authorizer */}
              <div>
                <Label className='font-semibold'>Authorizer (Through)</Label>
                <FormField
                  control={form.control}
                  name='through'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultiSelectFormField
                          options={finalAuthoriserOptions || []}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder={finalAuthoriserOptions.length === 0 ? 'No authorizers available' : 'Select Authorizer(s)'}
                          variant='inverted'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {finalAuthoriserOptions.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ No users with Manager or Director roles found
                  </p>
                )}
              </div>

              {/* Approver (To) */}
              <div>
                <FormSelect
                  label='Approver (To)'
                  name='approved_by'
                  required
                  placeholder={finalApproverOptions.length === 0 ? 'No approvers available' : 'Select Approver'}
                  options={finalApproverOptions}
                />
                {finalApproverOptions.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ No users with Director or MD roles found
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator className='my-4' />
          <span className='block space-y-2'>
            <h3 className='font-semibold text-xl text-black'>Expenses</h3>
          </span>
          <ExpensesForm
            fields={fields}
            remove={remove}
            watch={watch}
            setValue={setValue}
          />
          {/*  */}
          <div className='flex justify-between items-center'>
            <Button
              onClick={() =>
                dispatch(
                  openDialog({
                    type: DialogType.AddItems,
                    dialogProps: {
                      header: "Add Item",
                    },
                  })
                )
              }
              variant='outline'
              className='gap-x-2 shadow-[0px_3px_8px_rgba(0,0,0,0.07)] bg-[#FFFFFF] text-[#DEA004] border-[1px] border-[#C7CBD5]'
              size='sm'
            >
              Click to add New
            </Button>
            <FormButton
              type='button'
              className='flex items-center justify-center gap-2'
              onClick={() =>
                append({
                  item: "",
                  uom: "",
                  quantity: "",
                  unit_cost: "",
                  total_cost: 0,
                })
              }
            >
              <AddSquareIcon />
              Add new expenses item row
            </FormButton>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3 items-center justify-between pt-6 border-t'>
            <Button
              type='button'
              variant='outline'
              className='flex items-center justify-center gap-2'
              onClick={() => {
                if (confirm('Are you sure you want to clear the draft? This will remove all saved form data.')) {
                  clearSavedData();
                  form.reset();
                  toast.success('Draft cleared successfully');
                }
              }}
            >
              Clear Draft
            </Button>
            <div className='flex items-center justify-end gap-3'>
              <FormButton
                loading={isSubmitting || isCreating}
                disabled={isSubmitting || isCreating}
                type='submit'
                className='flex items-center justify-center gap-2'
                onClick={() => console.log("🖱️ Save button clicked!")}
              >
                <LongArrowRight />
                {isSubmitting || isCreating ? "Creating..." : "Save & Next"}
              </FormButton>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateActivityMemo;
