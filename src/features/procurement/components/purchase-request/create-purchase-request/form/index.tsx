"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/atoms/FormInput";
import FormSelect from "@/components/atoms/FormSelectField";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import LongArrowRight from "@/components/icons/LongArrowRight";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Upload as UploadFile } from "lucide-react";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import MultiSelectFormField from "@/components/ui/multiselect";
import { SelectContent, SelectItem } from "@/components/ui/select";
import { RouteEnum } from "@/constants/RouterConstants";
import { PurchaseRequestSchema } from "@/features/procurement/types/procurement-validator";
import { MinusCircle } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import ProcurementErrorBoundary from "../../../procurement-plan/ErrorBoundary";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetAllUsers, useGetUserProfile } from "@/features/auth/controllers/userController";
import { useGetDepartmentPaginate } from "@/features/modules/controllers/config/departmentController";
import { useGetAllItems } from "@/features/modules/controllers/config/itemController";
import { useGetLocationList } from "@/features/modules/controllers/config/locationController";
import {
  useGetDepartmentsDropdown,
  useGetLocationsDropdown,
  useGetFCONumbersDropdown
} from "@/features/modules/controllers/config/allConfigController";
import { useGetAllPartners } from "@/features/projects/controllers/projectController";
import { useCreatePurchaseRequest } from "@/features/procurement/controllers/purchaseRequestController";
import { useGetActivityMemo } from "@/features/procurement/controllers/activityMemoController";
import { toast } from "sonner";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { RootState } from "@/store/index";

const CreatePurchaseRequestForm = ({ expenses }) => {
  const searchParams = useSearchParams();
  const request = searchParams.get("request");
  // Debug console.log commented to prevent render loops
  // console.log("Purchase request form - request parameter:", request);

  // Get activity memo data from Redux store
  const activityMemoData = useSelector((state: RootState) => state.activity.activity);
  // Debug console.log commented to prevent render loops
  // console.log("📊 Activity memo data from Redux:", activityMemoData);
  // console.log("📊 Number of entries in Redux:", activityMemoData?.length);
  // if (activityMemoData?.length > 0) {
  //   const latestEntry = activityMemoData[activityMemoData.length - 1];
  //   console.log("📊 Latest entry:", latestEntry);
  //   console.log("📊 Latest entry expenses:", latestEntry?.expenses);
  //   console.log("📊 Latest entry FCO (fconumber):", latestEntry?.fconumber);
  //   console.log("📊 FCO Array check:", Array.isArray(latestEntry?.fconumber));
  //   console.log("📊 FCO Length:", latestEntry?.fconumber?.length);
  //   console.log("📊 FCO Content:", latestEntry?.fconumber);
  //   console.log("📊 All keys in latest entry:", Object.keys(latestEntry || {}));
  // }

  // Get the memo ID from Redux if not in URL
  const memoIdFromRedux = activityMemoData.length > 0 ? activityMemoData[activityMemoData.length - 1]?.createdMemoId : null;
  const finalMemoId = request || memoIdFromRedux;
  // console.log("Final memo ID to use:", finalMemoId);

  // If Redux is empty but we have a memo ID, try to fetch from API
  const shouldFetchApi = !!finalMemoId && activityMemoData.length === 0;
  // console.log("🔧 API fetch decision:", {
  //   finalMemoId,
  //   activityMemoDataLength: activityMemoData.length,
  //   shouldFetchApi
  // });

  const { data: apiMemoData, isLoading: apiMemoLoading, error: apiMemoError } = useGetActivityMemo(finalMemoId as string, shouldFetchApi);
  // console.log("🌐 API memo data:", apiMemoData);
  // console.log("🌐 API memo loading:", apiMemoLoading);
  // console.log("🌐 API memo error:", apiMemoError);

  // Alert user about port issue if they're on wrong port
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.port === '3000') {
      console.warn("⚠️ WARNING: You're accessing the app on port 3000, but it should be running on port 3001!");
      toast.warning("App should be accessed on localhost:3001, not localhost:3000");
    }
  }, []);

  // Alert user about missing Redux data
  useEffect(() => {
    if (finalMemoId && activityMemoData.length === 0 && !apiMemoLoading) {
      console.warn("⚠️ WARNING: Redux store is empty - activity memo data not found");
      if (!apiMemoData?.data) {
        toast.warning("Activity memo data not found. Please ensure you created the activity memo first.");
      } else {
        toast.success("Loaded activity memo data from API");
      }
    }
  }, [finalMemoId, activityMemoData.length, apiMemoLoading, apiMemoData]);
  const { data: departments, isLoading: departmentsIsLoading } =
    useGetDepartmentPaginate({
      page: 1,
      size: 2000000,
    });
  const { isLoading: partnersIsLoading } = useGetAllPartners({
    page: 1,
    size: 2000000,
  });
  const { data: items, isLoading: itemsIsLoading } = useGetAllItems({
    page: 1,
    size: 2000000,
  });
  const { createPurchaseRequest, isLoading } = useCreatePurchaseRequest();

  const { data: fco, isLoading: isFcoLoading, error: fcoError } = useGetFCONumbersDropdown();

  const { data: users } = useGetAllUsers({
    page: 1,
    size: 2000000,
  });

  const { data: currentUserProfile } = useGetUserProfile();

  const { data: locations } = useGetLocationList({});

  // Get ALL AHNI departments and locations (unrestricted)
  const {
    data: allDepartments,
    isLoading: allDepartmentsLoading,
    error: allDepartmentsError
  } = useGetDepartmentsDropdown();

  const {
    data: allLocations,
    isLoading: allLocationsLoading,
    error: allLocationsError
  } = useGetLocationsDropdown();

  // Debug logging for departments and locations comparison
  React.useEffect(() => {
    console.log("📊 DEPARTMENTS COMPARISON:");
    console.log("📊 User-specific departments:", departments);
    console.log("📊 All AHNI departments:", allDepartments);
    console.log("📊 User dept count:", departments?.data?.results?.length || 0);
    console.log("📊 All dept count:", allDepartments?.length || 0);

    console.log("📊 LOCATIONS COMPARISON:");
    console.log("📊 User-specific locations:", locations);
    console.log("📊 All AHNI locations:", allLocations);
    console.log("📊 User locations count:", locations?.data?.results?.length || 0);
    console.log("📊 All locations count:", allLocations?.length || 0);
  }, [departments, allDepartments, locations, allLocations]);

  const [, setFile] = useState<File | null>(null);

  // Debug FCO matching after both Redux data and API data are available
  useEffect(() => {
    if (activityMemoData?.length > 0 && fco) {
      const latestEntry = activityMemoData[activityMemoData.length - 1];
      if (latestEntry?.fconumber) {
        console.log("📊 Checking FCO ID matches:");
        latestEntry.fconumber.forEach((fcoId: string, index: number) => {
          const matchingFco = fco.find((f: any) => f.id === fcoId);
          console.log(`📊 FCO ${index} (${fcoId}):`, matchingFco ? matchingFco.name : 'NOT FOUND');
        });
      }
    }
  }, [activityMemoData, fco]);

  const form = useForm<z.infer<typeof PurchaseRequestSchema>>({
    resolver: zodResolver(PurchaseRequestSchema),
    defaultValues: {
      reviewed_by: "",
      authorised_by: "",
      approved_by: "",
      requested_by: "",
      requesting_department: "",
      deliver_to: "",
      ref_number: "",
      date_of_request: "",
      date_required: "",
      special_instruction: "",
      request_memo: finalMemoId && finalMemoId !== "null" ? finalMemoId : "",
      items: [],
      role_requested_by: "",
      role_reviewed_by: "",
      role_authorised_by: "",
      role_approved_by: "",
      // Procurement Plan Tracking Fields
      procurement_plan_reference: "",
      mode_of_procurement: "",
      procurement_method: "",
      procurement_start_date: "",
    },
  });

  const router = useRouter();

  const { control, handleSubmit, setValue, watch, formState: { errors } } = form;

  // Debug form errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("❌ Form validation errors:", errors);
    }
  }, [errors]);

  // Auto-generate PR reference number and populate required fields
  useEffect(() => {
    const generatePRNumber = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const timestamp = String(now.getTime()).slice(-4); // Last 4 digits of timestamp
      return `PR-${year}${month}${day}-${timestamp}`;
    };

    // Only auto-generate if ref_number is empty
    const currentRefNumber = watch('ref_number');
    if (!currentRefNumber || currentRefNumber === '') {
      const prNumber = generatePRNumber();
      setValue('ref_number', prNumber);
      console.log("📝 Auto-generated PR Number:", prNumber);
    }

    // Auto-populate special_instruction if empty
    const currentSpecialInstruction = watch('special_instruction');
    if (!currentSpecialInstruction || currentSpecialInstruction === '') {
      setValue('special_instruction', 'Standard procurement request');
      console.log("📝 Auto-populated special instruction");
    }
  }, [setValue, watch]);

  // Auto-populate requested_by with current user (only for standalone PR without memo)
  useEffect(() => {
    if (currentUserProfile?.data?.id && !finalMemoId) {
      console.log("🔐 Auto-populating requested_by with current user:", currentUserProfile.data.id);
      setValue('requested_by', String(currentUserProfile.data.id));

      // Also auto-populate role_requested_by
      if (currentUserProfile.data.position) {
        const roleId = typeof currentUserProfile.data.position === 'object'
          ? currentUserProfile.data.position.id
          : currentUserProfile.data.position;
        setValue('role_requested_by', roleId);
        console.log("✅ Auto-set role_requested_by:", roleId);
      }
    }
  }, [currentUserProfile, finalMemoId, setValue]);

  // Debug: Watch form values to see what's actually in the form
  const formValues = watch();
  // Debug console.log commented to prevent render loops
  // console.log("🏠 Current form values:", formValues);
  // console.log("🏠 Form items:", formValues?.items);
  // if (formValues?.items && formValues.items.length > 0) {
  //   formValues.items.forEach((item: any, index: number) => {
  //     // Debug: Form item validation
  //     const isValidItem = item?.item && item?.quantity && item?.unit_cost;
  //   });
  // }

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const usersOptions = (users as any)?.data?.results?.map(
    ({ first_name, last_name, id, position }: any) => ({
      label: `${first_name || ''} ${last_name || ''}`.trim() || `User ${id}`,
      value: id,
      position: position || '', // Include position data for auto-population
    })
  ) || [];

  // Users options for display purposes (to show names instead of IDs)
  // Debug console.log commented to prevent render loops
  // console.log("👥 Users data for display:", (users as any)?.data?.results?.length || 0, "users loaded");
  // console.log("👥 Users options created:", usersOptions.length, "options");
  // if (usersOptions.length > 0) {
  //   console.log("👥 Sample user option:", usersOptions[0]);
  // }


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setValue("special_instruction", event.target.files[0].name); // Use special_instruction instead of file
    }
  };

  const onSubmit = async (data: z.infer<typeof PurchaseRequestSchema>) => {
    try {
      console.log("🚀 Attempting to submit purchase request:", data);

      // Enhanced validation with detailed error messages
      const validationErrors = [];

      // Check for items
      if (!data.items || data.items.length === 0) {
        validationErrors.push("No items found - please add at least one item");
      }

      // Check for memo reference (OPTIONAL - only validate if items are from memo)
      // If creating standalone PR, request_memo can be null
      // if (!data.request_memo || data.request_memo === "null" || data.request_memo.trim() === "") {
      //   validationErrors.push("Missing activity memo reference");
      // }

      // Check for required fields
      if (!data.ref_number?.trim()) validationErrors.push("Reference number is required");
      if (!data.date_of_request?.trim()) validationErrors.push("Date of request is required");
      if (!data.date_required?.trim()) validationErrors.push("Required date is required");
      if (!data.requesting_department?.trim()) validationErrors.push("Requesting department is required");
      if (!data.deliver_to?.trim()) validationErrors.push("Delivery location is required");
      if (!data.special_instruction?.trim()) validationErrors.push("Special instruction/specification is required");

      // Check approval fields
      if (!data.requested_by?.trim()) validationErrors.push("Requested by is required");
      if (!data.reviewed_by?.trim()) validationErrors.push("Reviewed by is required");
      if (!data.authorised_by?.trim()) validationErrors.push("Authorized by is required");
      if (!data.approved_by?.trim()) validationErrors.push("Approved by is required");

      // Check role fields - warn but don't block if roles can't be determined
      const roleWarnings = [];
      const roleDetails = [];

      if (!data.role_requested_by?.trim()) {
        roleWarnings.push("Requested by role could not be determined");
        const requestedUser = (users as any)?.data?.results?.find((user: any) => user.id === data.requested_by);
        roleDetails.push(`Requested by user: ${requestedUser?.email || data.requested_by} (Position: ${JSON.stringify(requestedUser?.position) || 'None'})`);
      }
      if (!data.role_reviewed_by?.trim()) {
        roleWarnings.push("Reviewed by role could not be determined");
        const reviewedUser = (users as any)?.data?.results?.find((user: any) => user.id === data.reviewed_by);
        roleDetails.push(`Reviewed by user: ${reviewedUser?.email || data.reviewed_by} (Position: ${JSON.stringify(reviewedUser?.position) || 'None'})`);
      }
      if (!data.role_authorised_by?.trim()) {
        roleWarnings.push("Authorized by role could not be determined");
        const authorizedUser = (users as any)?.data?.results?.find((user: any) => user.id === data.authorised_by);
        roleDetails.push(`Authorized by user: ${authorizedUser?.email || data.authorised_by} (Position: ${JSON.stringify(authorizedUser?.position) || 'None'})`);
      }
      if (!data.role_approved_by?.trim()) {
        roleWarnings.push("Approved by role could not be determined");
        const approvedUser = (users as any)?.data?.results?.find((user: any) => user.id === data.approved_by);
        roleDetails.push(`Approved by user: ${approvedUser?.email || data.approved_by} (Position: ${JSON.stringify(approvedUser?.position) || 'None'})`);
      }

      if (roleWarnings.length > 0) {
        console.warn("⚠️ Role warnings:", roleWarnings);
        console.warn("🔍 Role details:", roleDetails);
        toast.warning(`Role information incomplete:\n• ${roleWarnings.join('\n• ')}\n\nPlease ensure user positions are properly configured.`);
      }

      if (validationErrors.length > 0) {
        console.error("❌ Form validation failed:", validationErrors);
        toast.error(`Please fix the following issues:\n• ${validationErrors.join('\n• ')}`);
        return;
      }

      console.log("✅ Form validation passed, proceeding with submission...");

      const payload = {
        items: data.items.map((item: any, index: number) => {
          // Remove description field as backend doesn't support it
          const { description, ...itemWithoutDescription } = item;

          // Debug FCO number for this item
          console.log(`📦 Item ${index} FCO data:`, {
            fco_number: item.fco_number,
            fco_is_array: Array.isArray(item.fco_number),
            fco_length: item.fco_number?.length,
            fco_values: item.fco_number
          });

          return {
            ...itemWithoutDescription,
            // Ensure numeric fields are properly formatted
            quantity: typeof item.quantity === 'string' ? parseInt(item.quantity) : item.quantity,
            unit_cost: typeof item.unit_cost === 'string' ? parseFloat(item.unit_cost) : item.unit_cost,
            amount: typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount,
            // Explicitly ensure fco_number is included as an array of IDs
            fco_number: Array.isArray(item.fco_number)
              ? item.fco_number.map((fco: any) => typeof fco === 'object' ? fco.id : fco)
              : [],
          };
        }),
        requested_by: data.requested_by,
        reviewed_by: data.reviewed_by,
        authorised_by: data.authorised_by,
        approved_by: data.approved_by,
        ref_number: data.ref_number,
        date_of_request: data.date_of_request,
        date_required: data.date_required,
        special_instruction: data.special_instruction,
        request_id: `PR-${Date.now()}`, // Generate a unique request ID
        status: "Pending",
        reviewed_date: null,
        authorised_date: null,
        approved_date: null,
        // Only include request_memo if it exists (for Activity Memo flow)
        ...(data.request_memo && data.request_memo !== 'null' && { request_memo: data.request_memo }),
        requesting_department: data.requesting_department,
        location: data.deliver_to,
        role_requested_by: data.role_requested_by,
        role_reviewed_by: data.role_reviewed_by,
        role_authorised_by: data.role_authorised_by,
        role_approved_by: data.role_approved_by,
        // Procurement Plan Tracking Fields
        ...(data.procurement_plan_reference && { procurement_plan_reference: data.procurement_plan_reference }),
        ...(data.mode_of_procurement && { mode_of_procurement: data.mode_of_procurement }),
        ...(data.procurement_method && { procurement_method: data.procurement_method }),
        ...(data.procurement_start_date && { procurement_start_date: data.procurement_start_date }),
      };

      console.log("Formatted payload for API:", payload);

      await createPurchaseRequest(payload);

      toast.success("Purchase request created successfully!");
      router.push(RouteEnum.PURCHASE_REQUEST);
    } catch (error: any) {
      console.error("Failed to create purchase request:", error);

      // Provide more specific error messages
      if (error?.response?.status === 400) {
        toast.error("Invalid data provided. Please check all fields and try again.");
      } else if (error?.response?.status === 404) {
        toast.error("Activity memo not found. Please ensure the memo exists.");
      } else if (error?.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(error?.message || "Failed to create purchase request. Please try again.");
      }
    }
  };

  const expensesData = useMemo(() => {
    // If expenses prop is provided (editing existing request), use it
    if (expenses && expenses.length > 0) {
      // Debug console.log commented to prevent render loops
      // console.log("Using expenses from props:", expenses);
      return expenses.map((exp: any) => ({
        quantity: exp?.quantity,
        unit_cost: exp?.unit_cost,
        amount: exp?.total_cost,
        item: typeof exp?.item === 'object' ? exp?.item?.id : exp?.item,
        fco_number: [],
        // Service fields
        is_service: exp?.is_service || false,
        duration: exp?.duration || 1,
        duration_unit: exp?.duration_unit || 'month',
        num_of_facility: exp?.num_of_facility || 1,
        frequency: exp?.frequency || 1,
      }));
    }

    // If creating new request from activity memo, try Redux data first
    if (finalMemoId && activityMemoData && activityMemoData.length > 0) {
      // Find the latest activity memo data (most recently added)
      const latestActivityMemo = activityMemoData[activityMemoData.length - 1];
      // console.log("Using activity memo data from Redux:", latestActivityMemo);

      if (latestActivityMemo?.expenses && latestActivityMemo.expenses.length > 0) {
        // console.log("🔄 Processing expenses from Redux:", latestActivityMemo.expenses);
        // console.log("🔄 FCO numbers from Redux:", latestActivityMemo?.fconumber);

        const mappedExpenses = latestActivityMemo.expenses.map((exp: any, index: number) => {
          const mappedItem = {
            quantity: exp?.quantity ? Number(exp.quantity) : 1,
            unit_cost: exp?.unit_cost ? Number(exp.unit_cost) : 0,
            amount: exp?.total_cost ? Number(exp.total_cost) : 0,
            item: typeof exp?.item === 'object' ? (exp?.item?.id || "") : (exp?.item || ""), // Ensure we get the ID, not the object
            fco_number: Array.isArray(latestActivityMemo?.fconumber) ? latestActivityMemo.fconumber : [], // FCO numbers from memo level
            uom: exp?.uom || exp?.unit || "pieces", // Get UOM from expense, default to "pieces"
            // ✅ SERVICE SUPPORT: Preserve service-specific fields
            is_service: exp?.is_service || false,
            duration: exp?.duration || 1,
            duration_unit: exp?.duration_unit || 'month',
            num_of_facility: exp?.num_of_facility || 1,
            frequency: exp?.frequency || 1,
          };
          return mappedItem;
        });

        // console.log("🔄 Final mapped expenses from Redux:", mappedExpenses);
        return mappedExpenses;
      }
    }

    // If Redux is empty but we have API data as fallback
    if (finalMemoId && apiMemoData?.data) {
      // console.log("📡 Using activity memo data from API as fallback:", apiMemoData.data);

      if (apiMemoData.data.expenses && apiMemoData.data.expenses.length > 0) {
        // console.log("🔄 Processing expenses from API:", apiMemoData.data.expenses);
        // console.log("🔄 FCO numbers from API:", apiMemoData.data?.fconumber);

        const mappedExpenses = apiMemoData.data.expenses.map((exp: any, index: number) => {
          const mappedItem = {
            quantity: exp?.quantity ? Number(exp.quantity) : 1,
            unit_cost: exp?.unit_cost ? Number(exp.unit_cost) : 0,
            amount: exp?.total_cost ? Number(exp.total_cost) : 0,
            item: typeof exp?.item === 'object' ? (exp?.item?.id || "") : (exp?.item || ""), // Ensure we get the ID, not the object
            fco_number: Array.isArray(apiMemoData.data?.fconumber) ? apiMemoData.data.fconumber : [], // FCO numbers from memo level
            uom: exp?.uom || exp?.unit || "pieces", // Get UOM from expense, default to "pieces"
            // ✅ SERVICE SUPPORT: Preserve service-specific fields
            is_service: exp?.is_service || false,
            duration: exp?.duration || 1,
            duration_unit: exp?.duration_unit || 'month',
            num_of_facility: exp?.num_of_facility || 1,
            frequency: exp?.frequency || 1,
          };
          return mappedItem;
        });

        // console.log("🔄 Final mapped expenses from API:", mappedExpenses);
        return mappedExpenses;
      }
    }

    // console.log("No expenses data found from Redux or API, returning empty array");
    return [];
  }, [expenses, request, activityMemoData, finalMemoId, apiMemoData]);

  // Helper function to extract user ID from object or string
  const extractUserId = (userField: any): string => {
    if (typeof userField === 'string') {
      return userField;
    } else if (typeof userField === 'object' && userField?.user_id) {
      // Handle API response format with user_id field
      return userField.user_id;
    } else if (typeof userField === 'object' && userField?.id) {
      return userField.id;
    } else if (typeof userField === 'object' && userField?.value) {
      return userField.value;
    }
    return '';
  };

  // Helper function to extract position/role ID from object or string
  const extractRoleId = (roleField: any): string => {
    // Debug console.log commented to prevent render loops
    // console.log("🔍 Extracting role ID from:", roleField, "Type:", typeof roleField);

    if (typeof roleField === 'string' && roleField.trim()) {
      // console.log("✅ Found string role ID:", roleField);
      return roleField;
    } else if (typeof roleField === 'object' && roleField) {
      if (roleField?.id) {
        // console.log("✅ Found object role ID:", roleField.id);
        return roleField.id;
      } else if (roleField?.value) {
        // console.log("✅ Found object role value:", roleField.value);
        return roleField.value;
      } else if (roleField?.name) {
        // console.log("✅ Found object role name:", roleField.name);
        return roleField.name;
      } else if (roleField?.role_id) {
        // console.log("✅ Found object role_id:", roleField.role_id);
        return roleField.role_id;
      } else if (roleField?.position_id) {
        // console.log("✅ Found object position_id:", roleField.position_id);
        return roleField.position_id;
      }
      // console.log("⚠️ Role object found but no recognizable ID field:", Object.keys(roleField));
    }
    // console.log("❌ No valid role ID found");
    return '';
  };

  // Auto-populate approval fields from activity memo data
  useEffect(() => {
    let memoData = null;

    // Get memo data from Redux or API
    if (activityMemoData.length > 0) {
      memoData = activityMemoData[activityMemoData.length - 1];
      console.log("👥 Using approval data from Redux:", memoData);
    } else if (apiMemoData?.data) {
      memoData = apiMemoData.data;
      console.log("👥 Using approval data from API:", memoData);
    }

    if (memoData) {
      console.log("👥 Populating approval fields from memo:", {
        created_by: memoData.created_by,
        created_by_type: typeof memoData.created_by,
        reviewed_by: memoData.reviewed_by,
        reviewed_by_type: typeof memoData.reviewed_by,
        reviewed_by_length: Array.isArray(memoData.reviewed_by) ? memoData.reviewed_by.length : 'not array',
        authorised_by: memoData.authorised_by,
        authorised_by_type: typeof memoData.authorised_by,
        authorised_by_length: Array.isArray(memoData.authorised_by) ? memoData.authorised_by.length : 'not array',
        approved_by: memoData.approved_by,
        approved_by_type: typeof memoData.approved_by
      });

      // Set approval fields from activity memo
      // Check both created_by and created_by_details
      const createdByField = memoData.created_by_details || memoData.created_by;
      if (createdByField) {
        const requestedById = extractUserId(createdByField);
        console.log("👥 Setting requested_by:", {
          original: createdByField,
          extracted: requestedById,
          type: typeof requestedById
        });

        // Ensure we always pass a string
        setValue("requested_by", String(requestedById));

        // Auto-populate role for requested_by
        const requestedUser = (users as any)?.data?.results?.find((user: any) => user.id === requestedById);
        if (requestedUser?.position) {
          const roleId = extractRoleId(requestedUser.position);
          setValue("role_requested_by", roleId || "");
          console.log("👥 Set role_requested_by:", roleId, "from:", requestedUser.position);
        } else {
          setValue("role_requested_by", "");
        }
        console.log("👥 Set requested_by:", requestedById, "from:", createdByField);
      }

      // ✅ Auto-populate reviewed_by from activity memo
      const reviewedByField = memoData.reviewed_by_details || memoData.reviewed_by;
      if (reviewedByField && Array.isArray(reviewedByField) && reviewedByField.length > 0) {
        const reviewedById = extractUserId(reviewedByField[0]);
        console.log("👥 Setting reviewed_by:", {
          original: reviewedByField[0],
          extracted: reviewedById,
          type: typeof reviewedById
        });

        setValue("reviewed_by", String(reviewedById));
        // Auto-populate role for reviewed_by
        const reviewedUser = (users as any)?.data?.results?.find((user: any) => user.id === reviewedById);
        if (reviewedUser?.position) {
          const roleId = extractRoleId(reviewedUser.position);
          setValue("role_reviewed_by", roleId || "");
          console.log("👥 Set role_reviewed_by:", roleId, "from:", reviewedUser.position);
        } else {
          setValue("role_reviewed_by", "");
        }
        console.log("👥 Set reviewed_by:", reviewedById, "from:", reviewedByField[0]);
      }

      // ✅ Auto-populate authorised_by from activity memo
      const authorisedByField = memoData.authorised_by_details || memoData.authorised_by;
      if (authorisedByField && Array.isArray(authorisedByField) && authorisedByField.length > 0) {
        const authorizedById = extractUserId(authorisedByField[0]);
        console.log("👥 Setting authorised_by:", {
          original: authorisedByField[0],
          extracted: authorizedById,
          type: typeof authorizedById
        });

        setValue("authorised_by", String(authorizedById));
        // Auto-populate role for authorised_by
        const authorizedUser = (users as any)?.data?.results?.find((user: any) => user.id === authorizedById);
        if (authorizedUser?.position) {
          const roleId = extractRoleId(authorizedUser.position);
          setValue("role_authorised_by", roleId || "");
          console.log("👥 Set role_authorised_by:", roleId, "from:", authorizedUser.position);
        } else {
          setValue("role_authorised_by", "");
        }
        console.log("👥 Set authorised_by:", authorizedById, "from:", authorisedByField[0]);
      }

      // ✅ Auto-populate approved_by from activity memo
      const approvedByField = memoData.approved_by_details || memoData.approved_by;
      if (approvedByField) {
        const approvedById = extractUserId(approvedByField);
        console.log("👥 Setting approved_by:", {
          original: approvedByField,
          extracted: approvedById,
          type: typeof approvedById
        });

        setValue("approved_by", String(approvedById));
        // Auto-populate role for approved_by
        const approvedUser = (users as any)?.data?.results?.find((user: any) => user.id === approvedById);
        if (approvedUser?.position) {
          const roleId = extractRoleId(approvedUser.position);
          setValue("role_approved_by", roleId || "");
          console.log("👥 Set role_approved_by:", roleId, "from:", approvedUser.position);
        } else {
          setValue("role_approved_by", "");
        }
        console.log("👥 Set approved_by:", approvedById, "from:", approvedByField);
      }

      // Ensure all required fields have values to prevent validation errors
      setTimeout(() => {
        const currentValues = watch();
        console.log("👥 Checking form validation after auto-population:", {
          requested_by: currentValues.requested_by,
          reviewed_by: currentValues.reviewed_by,
          authorised_by: currentValues.authorised_by,
          approved_by: currentValues.approved_by,
          role_requested_by: currentValues.role_requested_by,
          role_reviewed_by: currentValues.role_reviewed_by,
          role_authorised_by: currentValues.role_authorised_by,
          role_approved_by: currentValues.role_approved_by
        });

        // Get first available user as fallback
        const firstUser = (users as any)?.data?.results?.[0];
        const fallbackUserId = firstUser?.id || "";

        // Provide fallbacks for any missing required fields
        if (!currentValues.requested_by) {
          const requestedId = memoData.created_by ? extractUserId(memoData.created_by) : fallbackUserId;
          setValue("requested_by", String(requestedId));
          console.log("👥 Set fallback requested_by:", requestedId);
        }
        if (!currentValues.reviewed_by) {
          const reviewedId = memoData.reviewed_by?.[0] ? extractUserId(memoData.reviewed_by[0]) : fallbackUserId;
          setValue("reviewed_by", String(reviewedId));
          console.log("👥 Set fallback reviewed_by:", reviewedId);
        }
        if (!currentValues.authorised_by) {
          const authorizedId = memoData.authorised_by?.[0] ? extractUserId(memoData.authorised_by[0]) : fallbackUserId;
          setValue("authorised_by", String(authorizedId));
          console.log("👥 Set fallback authorised_by:", authorizedId);
        }
        if (!currentValues.approved_by) {
          const approvedId = memoData.approved_by ? extractUserId(memoData.approved_by) : fallbackUserId;
          setValue("approved_by", String(approvedId));
          console.log("👥 Set fallback approved_by:", approvedId);
        }

        // Provide fallback roles if not found - use first available user's position or generate UUID-like fallbacks
        const firstUserPosition = firstUser?.position ? extractRoleId(firstUser.position) : null;
        if (!currentValues.role_requested_by) {
          setValue("role_requested_by", firstUserPosition || "");
        }
        if (!currentValues.role_reviewed_by) {
          setValue("role_reviewed_by", firstUserPosition || "");
        }
        if (!currentValues.role_authorised_by) {
          setValue("role_authorised_by", firstUserPosition || "");
        }
        if (!currentValues.role_approved_by) {
          setValue("role_approved_by", firstUserPosition || "00000000-0000-0000-0000-000000000004");
        }

        // Auto-populate some basic required fields if empty
        if (!currentValues.ref_number) setValue("ref_number", `PR-${Date.now()}`);
        if (!currentValues.date_of_request) setValue("date_of_request", new Date().toISOString().split('T')[0]);
        if (!currentValues.date_required) {
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + 7); // 7 days from now
          setValue("date_required", futureDate.toISOString().split('T')[0]);
        }
        if (!currentValues.special_instruction) setValue("special_instruction", "Standard procurement request");

        console.log("👥 Auto-populated basic required fields");
      }, 500);

      toast.success("Approval workflow loaded from activity memo");
    }
  }, [activityMemoData, apiMemoData, setValue, users]);

  // Use ref to track if we've already loaded expenses to prevent duplication
  const expensesLoadedRef = React.useRef(false);
  const loadedMemoIdRef = React.useRef<string | null>(null);

  // Reset the loaded flag when memo ID changes
  useEffect(() => {
    if (finalMemoId !== loadedMemoIdRef.current) {
      console.log("🔄 Memo ID changed, resetting loaded flag");
      expensesLoadedRef.current = false;
      loadedMemoIdRef.current = finalMemoId;
    }
  }, [finalMemoId]);

  useEffect(() => {
    // Only load expenses once when expensesData is available
    if (expensesData && expensesData.length > 0 && !expensesLoadedRef.current) {
      console.log("✍️ Populating form with expenses data:", expensesData);
      expensesLoadedRef.current = true; // Mark as loaded FIRST to prevent race conditions

      // Debug each item being set
      expensesData.forEach((item: any, index: number) => {
        console.log(`✍️ Setting form item ${index}:`, {
          item: item.item,
          fco_number: item.fco_number,
          fco_array_check: Array.isArray(item.fco_number),
          fco_length: item.fco_number?.length,
          quantity: item.quantity,
          unit_cost: item.unit_cost,
          amount: item.amount
        });
      });

      console.log("✍️ Calling setValue with:", expensesData);

      // Clear existing items first
      if (fields.length > 0) {
        console.log("✍️ Clearing existing fields:", fields.length);
        // Remove all existing fields
        for (let i = fields.length - 1; i >= 0; i--) {
          remove(i);
        }
      }

      // Add new items using append to ensure proper field array management
      expensesData.forEach((item: any, index: number) => {
        console.log(`✍️ Appending item ${index}:`, item);
        console.log(`✍️ Item.item field for ${index}:`, item.item);
        console.log(`✍️ Item.item type:`, typeof item.item);
        console.log(`✍️ Item.item empty check:`, item.item === "" || !item.item);

        // Ensure all fields are safe strings/primitives, not objects
        const safeItem = {
          ...item,
          item: typeof item.item === 'object' ? (item.item?.id || "") : (item.item || ""),
          fco_number: Array.isArray(item.fco_number) ? item.fco_number.map((fco: any) => typeof fco === 'object' ? fco.id : fco) : [],
          quantity: item.quantity || 1,
          unit_cost: item.unit_cost || 0,
          amount: item.amount || 0,
          // ✅ UOM: Preserve unit of measurement from activity memo, default to "pieces" if missing
          uom: typeof item.uom === 'object' ? (item.uom?.name || item.uom?.id || "pieces") : (item.uom || "pieces"),
          // ✅ SERVICE SUPPORT: Preserve service fields
          is_service: item.is_service || false,
          duration: item.duration || 1,
          duration_unit: item.duration_unit || 'month',
          num_of_facility: item.num_of_facility || 1,
          frequency: item.frequency || 1,
        };

        // Safe item created for index ${index}
        append(safeItem);
      });

      // Verify the form data was set correctly
      setTimeout(() => {
        const currentFormValues = watch("items");
        console.log("✍️ Form values after setValue:", currentFormValues);
        if (currentFormValues && currentFormValues.length > 0) {
          currentFormValues.forEach((item: any, index: number) => {
            console.log(`✍️ Form item ${index} after setValue:`, {
              item: item?.item,
              fco_number: item?.fco_number,
              fco_array_check: Array.isArray(item?.fco_number),
              fco_length: item?.fco_number?.length
            });
          });
        }
      }, 100);

      // Show user feedback about data source
      if (finalMemoId) {
        toast.success(`Loaded ${expensesData.length} items from activity memo`);
      }
    } else if (finalMemoId && !expensesLoadedRef.current && expensesData.length === 0) {
      console.warn("No expenses data found for memo ID:", finalMemoId);
      toast.warning("No items found from activity memo. You may need to add items manually.");
      expensesLoadedRef.current = true; // Mark as loaded even if no data to prevent repeated warnings
    }
    // CRITICAL: Only depend on expensesData, NOT on finalMemoId to prevent duplicate runs
  }, [expensesData]); // Removed finalMemoId, fields.length, append, remove from dependencies

  return (
    <div className='pt-5'>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>

          {/* Header Info Banner */}
          {!finalMemoId && (
            <div className='p-4 bg-blue-50 border-2 border-blue-200 rounded-lg'>
              <div className='flex items-start gap-3'>
                <div className='bg-blue-500 text-white p-2 rounded-lg'>
                  <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                </div>
                <div>
                  <h3 className='font-semibold text-blue-900 mb-1'>Standalone Purchase Request</h3>
                  <p className='text-sm text-blue-800'>
                    You are creating a purchase request without an activity memo. Please fill in all required fields including approval workflow.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information Section */}
          <div className='p-6 bg-white border-2 border-gray-200 rounded-lg shadow-sm'>
            <h3 className='text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200'>
              Basic Information
            </h3>

            <div className='space-y-5'>
              <div className='grid gap-5'>
                <FormInput
                  label='Reference Number'
                  name='ref_number'
                  type='text'
                  placeholder='Auto-generated'
                  required
                  disabled
                  className='bg-gray-50'
                />
              </div>

              <div className='grid grid-cols-2 gap-5'>
                <FormInput
                  label='Date of Request'
                  name='date_of_request'
                  type='date'
                  placeholder='01/01/2024'
                  required
                />
                <FormInput
                  label='Required Date'
                  name='date_required'
                  type='date'
                  placeholder='01/01/2024'
                  required
                />
              </div>

              <div className='grid grid-cols-2 gap-5'>
                <FormSelect
                  label='Requesting Department'
                  name='requesting_department'
                  required
                >
                  <SelectContent>
                    {(departmentsIsLoading || allDepartmentsLoading) ? (
                      <LoadingSpinner />
                    ) : (() => {
                      // Use comprehensive config if it has more departments, otherwise fallback to user-specific
                      const useComprehensive = allDepartments && allDepartments.length > 0 &&
                        (!departments?.data?.results || allDepartments.length >= departments.data.results.length);

                      const departmentsList = useComprehensive
                        ? allDepartments
                        : departments?.data?.results || [];

                      // Debug console.log commented to prevent render loops
                      // console.log(`🏢 Using ${useComprehensive ? 'COMPREHENSIVE' : 'USER-SPECIFIC'} departments (${departmentsList.length} total)`);

                      return departmentsList.map((department: any) => (
                        <SelectItem key={department?.id} value={String(department?.id)}>
                          {String(department?.name || department?.id || 'Unknown Department')}
                        </SelectItem>
                      ));
                    })()}
                  </SelectContent>
                </FormSelect>
                <FormSelect label='Deliver To' name='deliver_to' required>
                  <SelectContent>
                    {(partnersIsLoading || allLocationsLoading) ? (
                      <LoadingSpinner />
                    ) : (() => {
                      // Use comprehensive config if it has more locations, otherwise fallback to user-specific
                      const useComprehensive = allLocations && allLocations.length > 0 &&
                        (!locations?.data?.results || allLocations.length >= locations.data.results.length);

                      const locationsList = useComprehensive
                        ? allLocations
                        : locations?.data?.results || [];

                      // Debug console.log commented to prevent render loops
                      // console.log(`📍 Using ${useComprehensive ? 'COMPREHENSIVE' : 'USER-SPECIFIC'} locations (${locationsList.length} total)`);

                      return locationsList.map((location: any) => (
                        <SelectItem key={location?.id} value={String(location?.id)}>
                          {String(location?.name || location?.id || 'Unknown Location')}
                        </SelectItem>
                      ));
                    })()}
                  </SelectContent>
                </FormSelect>
              </div>

              {/* Procurement Plan Tracking Fields */}
              <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                <h4 className='text-sm font-semibold text-blue-900 mb-3'>Procurement Plan Information</h4>

                <div className='grid grid-cols-2 gap-5 mb-4'>
                  <FormInput
                    label='Procurement Plan Reference'
                    name='procurement_plan_reference'
                    type='text'
                    placeholder='e.g., PHO/OODC/1.1'
                  />
                  <FormInput
                    label='Procurement Start Date'
                    name='procurement_start_date'
                    type='date'
                  />
                </div>

                <div className='grid grid-cols-2 gap-5'>
                  <FormSelect
                    label='Mode of Procurement'
                    name='mode_of_procurement'
                  >
                    <SelectContent>
                      <SelectItem value="LOCAL_PROCUREMENT">Local Procurement</SelectItem>
                      <SelectItem value="INTERNATIONAL_PROCUREMENT">International Procurement</SelectItem>
                      <SelectItem value="CONTRACTED_SERVICE">Contracted Service (SLA)</SelectItem>
                      <SelectItem value="DIRECT_CONTRACTING">Direct Contracting/Single Source</SelectItem>
                      <SelectItem value="SOLE_SOURCE">Sole Source</SelectItem>
                    </SelectContent>
                  </FormSelect>

                  <FormSelect
                    label='Procurement Method'
                    name='procurement_method'
                  >
                    <SelectContent>
                      <SelectItem value="ICB">International Competitive Bidding</SelectItem>
                      <SelectItem value="ILCB">International Limited Competitive Bidding</SelectItem>
                      <SelectItem value="NCB">National Competitive Bidding</SelectItem>
                      <SelectItem value="NLCB">National Limited Competitive Bidding</SelectItem>
                      <SelectItem value="NATIONAL_SHOPPING">National Shopping</SelectItem>
                      <SelectItem value="LOCAL_SHOPPING">Local Shopping</SelectItem>
                      <SelectItem value="MICRO_PURCHASE">Micro Purchase</SelectItem>
                      <SelectItem value="SINGLE_SOURCE">Single Source</SelectItem>
                      <SelectItem value="SOLE_SOURCE">Sole Source</SelectItem>
                      <SelectItem value="RFQ">Request for Quotation</SelectItem>
                      <SelectItem value="RFP">Request for Proposal</SelectItem>
                    </SelectContent>
                  </FormSelect>
                </div>

                <p className='text-xs text-blue-700 mt-3'>
                  These fields help track procurement plan execution and compliance with AHNI standards.
                </p>
              </div>

              <div>
                <label className='font-semibold text-gray-700 mb-2 block'>
                  Specification/Instructions Document
                </label>
                <div className='w-full px-4 relative gap-x-3 h-[52px] rounded-lg border-2 border-dashed border-gray-300 flex justify-center items-center hover:border-primary transition-colors'>
                  <UploadFile size={20} className='text-gray-500' />
                  <Input
                    type='file'
                    onChange={handleFileChange}
                    className='bg-inherit border-none cursor-pointer'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Items/Services Section */}
          <div className='p-6 bg-white border-2 border-gray-200 rounded-lg shadow-sm'>
            <h3 className='text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200'>
              Items & Services
            </h3>

            <ProcurementErrorBoundary fallback={
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">Error in items table. Object rendering issue detected.</p>
                <p className="text-sm text-red-600 mt-2">Check browser console for details</p>
              </div>
            }>
            <div className='overflow-x-auto'>
            <table className='w-full border border-gray-300 rounded-lg overflow-hidden'>
              <thead className='bg-gray-100'>
                <tr className='text-gray-700 whitespace-nowrap border-b-2 border-gray-300 text-sm font-semibold'>
                  <th className='px-4 py-4 text-left'>S/N</th>
                  <th className='px-4 py-4 text-left'>Description of Items/Services</th>
                  <th className='px-4 py-4 text-left'>FCO</th>
                  <th className='px-4 py-4 text-left'>Quantity</th>
                  <th className='px-4 py-4 text-left'>UOM</th>
                  <th className='px-4 py-4 text-left'>Unit Cost (₦)</th>
                  <th className='px-4 py-4 text-left'>Total (₦)</th>
                  <th className='px-4 py-4 text-center'>Action</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((_, index) => {
                  return (
                    <tr key={index} className='w-full'>
                      <td className='w-fit p-2 text-center '>
                        <span className='p-2 px-4 text-xs bg-black text-white rounded'>
                          {index + 1}.
                        </span>
                      </td>
                      <td className='w-fit p-2 text-center'>
                        <FormField
                          control={control}
                          name={`items.${index}.item`}
                          render={({ field }) => {
                            // Ensure field.value is always a string ID for comparison
                            const fieldValueId = typeof field.value === 'object' ? field.value?.id : field.value;
                            const selectedItem = (items as any)?.data?.results?.find((item: any) => item.id === fieldValueId);

                            return (
                              <FormItem>
                                <FormControl>
                                  <Select
                                    value={String(fieldValueId || "")}
                                    onValueChange={(value) => {
                                      field.onChange(value);

                                      // Auto-populate UOM when item is selected
                                      const selected = (items as any)?.data?.results?.find((item: any) => item.id === value);
                                      if (selected) {
                                        let uomValue = "pieces"; // Default value

                                        if (selected.uom) {
                                          uomValue = typeof selected.uom === 'object'
                                            ? (selected.uom?.name || selected.uom?.id || "pieces")
                                            : (selected.uom || "pieces");
                                        }

                                        setValue(`items.${index}.uom`, uomValue);
                                        console.log(`✅ Auto-populated UOM for item ${index}:`, uomValue);
                                      }
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue>
                                        {(() => {
                                          try {
                                            if (fieldValueId && selectedItem) {
                                              const itemName = selectedItem.name;
                                              if (typeof itemName === 'object') {
                                                return `Item ID: ${String(selectedItem.id || fieldValueId)}`;
                                              }
                                              return String(itemName || selectedItem.id || 'Unknown Item');
                                            }
                                            return fieldValueId ? `Item ID: ${String(fieldValueId)}` : "Select an item";
                                          } catch (e) {
                                            return "Error loading item";
                                          }
                                        })()}
                                      </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {itemsIsLoading ? (
                                        <LoadingSpinner />
                                      ) : (
                                        (items as any)?.data?.results?.map(
                                          (item: any) => (
                                            <SelectItem key={item?.id} value={String(item?.id)}>
                                              {String(item?.name || item?.id || 'Unknown Item')}
                                            </SelectItem>
                                          )
                                        )
                                      )}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                              </FormItem>
                            );
                          }}
                        />
                      </td>

                      <td className='w-fit p-2 text-center'>
                        {/* <FormSelect
                          label=''
                          name={`items.[${index}].fco_number`}
                        >
                          <SelectContent>
                            {itemsIsLoading ? (
                              <LoadingSpinner />
                            ) : (
                              // @ts-ignore
                              fco?.map((item) => {
                                return (
                                  <SelectItem key={item?.id} value={String(item?.id)}>
                                    {String(item?.name || item?.id || 'Unknown FCO')}
                                  </SelectItem>
                                );
                              })
                            )}
                          </SelectContent>
                        </FormSelect> */}

                        <FormField
                          control={control}
                          name={`items.${index}.fco_number` as any}
                          render={({ field }) => {
                            // Handle master config API response structure
                            const fcoOptions = fco || [];

                            console.log("🔍 FCO Dropdown Debug:", {
                              itemIndex: index,
                              fcoData: fco,
                              fcoOptionsLength: fcoOptions.length,
                              fieldValue: field.value,
                              fieldValueIsArray: Array.isArray(field.value),
                              fieldValueLength: field.value?.length,
                              sampleOption: fcoOptions[0]
                            });

                            return (
                              <FormItem className=' mt-2'>
                                <FormControl>
                                  <MultiSelectFormField
                                    key={`fco-${index}-${field.value?.length || 0}`}
                                    options={fcoOptions}
                                    defaultValue={Array.isArray(field.value) ? field.value.map((val: any) => typeof val === 'object' ? val.id : val) : []}
                                    onValueChange={(value) => {
                                      console.log("🔍 FCO Selection Changed:", {
                                        raw: value,
                                        isArray: Array.isArray(value),
                                        length: value?.length
                                      });
                                      // Ensure we're only passing IDs, not objects
                                      const safeValue = Array.isArray(value) ? value.map((val: any) => typeof val === 'object' ? val.id : val) : value;
                                      console.log("🔍 FCO Safe Value:", safeValue);
                                      field.onChange(safeValue);
                                    }}
                                    placeholder={Array.isArray(field.value) && field.value.length > 0 ? `${field.value.length} selected` : 'Select fcos'}
                                    variant='inverted'
                                  />
                                </FormControl>
                              </FormItem>
                            );
                          }}
                        />

                        {/* {errors.fconumber && (
                            <span className='text-sm text-red-500 font-medium'>
                              {errors.fconumber.message}
                            </span>
                          )} */}
                      </td>
                      <td className='w-fit p-2 text-center'>
                        <FormInput
                          label=''
                          type='number'
                          name={`items.[${index}].quantity`}
                          className='w-24'
                        />
                      </td>
                      <td className='w-fit p-2 text-center'>
                        <FormInput
                          label=''
                          name={`items.[${index}].uom`}
                          className='w-24'
                          placeholder='Unit'
                        />
                      </td>
                      <td className='w-fit p-2 text-center'>
                        <FormInput
                          label=''
                          type='number'
                          name={`items.[${index}].unit_cost`}
                          className='w-24'
                        />
                      </td>
                      <td className='w-fit p-2 text-center'>
                        <FormField
                          control={control}
                          name={`items.${index}.amount`}
                          render={({ field }) => {
                            // Watch quantity and unit_cost to calculate total
                            const quantityRaw = watch(`items.${index}.quantity`);
                            const unitCostRaw = watch(`items.${index}.unit_cost`);

                            // Safely extract values from watched fields (they might be objects)
                            const quantity = typeof quantityRaw === 'object' ? (quantityRaw?.value || 0) : quantityRaw;
                            const unitCost = typeof unitCostRaw === 'object' ? (unitCostRaw?.value || 0) : unitCostRaw;

                            // Calculate total whenever quantity or unit_cost changes
                            React.useEffect(() => {
                              const qty = parseFloat(String(quantity)) || 0;
                              const cost = parseFloat(String(unitCost)) || 0;
                              const total = qty * cost;

                              if (total !== parseFloat(String(field.value)) && !isNaN(total)) {
                                field.onChange(total.toString());
                              }
                            }, [quantity, unitCost, field]);

                            return (
                              <FormItem>
                                <FormControl>
                                  <input
                                    {...field}
                                    className='w-24 px-2 py-1 border rounded text-center bg-gray-50'
                                    readOnly
                                    placeholder='Total'
                                    value={String(field.value || '0')}
                                  />
                                </FormControl>
                              </FormItem>
                            );
                          }}
                        />
                      </td>
                      <td className='flex items-center justify-center py-5'>
                        <Button variant='ghost' size='icon'>
                          <MinusCircle
                            onClick={() => remove(index)}
                            className='cursor-pointer text-primary'
                          />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
            </ProcurementErrorBoundary>

            <div className='flex justify-between items-center mt-4 pt-4 border-t-2 border-gray-200'>
              <Button
                type='button'
                className='text-primary bg-[#FFF2F2] hover:bg-[#FFE5E5] flex gap-2 items-center justify-center px-6 py-3'
                onClick={() => {
                  console.log("🔵 Add Item button clicked");
                  console.log("🔵 Current fields length:", fields.length);
                  append({
                    item: "",
                    fco_number: [],
                    amount: 0,
                    uom: "pieces", // Default UOM value
                    unit_cost: 0,
                    quantity: 1,
                  });
                  console.log("🔵 After append - fields length:", fields.length);
                }}
              >
                <AddSquareIcon />
                Add Item
              </Button>

              {/* Grand Total (optional - calculate from items) */}
              <div className='text-right'>
                <p className='text-sm text-gray-600 mb-1'>Total Items: {fields.length}</p>
                <div className='text-lg font-bold text-gray-800'>
                  Total: ₦{fields.reduce((sum, _, index) => {
                    const quantity = parseFloat(watch(`items.${index}.quantity`) || '0');
                    const unitCost = parseFloat(watch(`items.${index}.unit_cost`) || '0');
                    return sum + (quantity * unitCost);
                  }, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* <div className='flex items-center justify-end'>
            <div className='text-primary border-primary flex items-center justify-start gap-2 rounded border-2 px-6 py-3 text-base font-semibold'>
              <span>Total:</span>
              <span>N0.00</span>
            </div>
          </div> */}

          {/* Approval section - Conditional based on whether there's an activity memo */}
          <div className='my-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-200'>
            <h3 className='mb-4 text-lg font-semibold text-gray-800'>
              {finalMemoId ? 'Approval Workflow (From Activity Memo)' : 'Approval Workflow'}
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

              {/* Requested By - Always Current User */}
              <div className='space-y-2'>
                <h4 className='font-medium text-gray-700 flex items-center gap-2'>
                  Requested By
                  <span className='text-xs text-gray-500 font-normal'>(Current User)</span>
                </h4>
                <div className='p-3 bg-blue-50 border-2 border-blue-200 rounded'>
                  <FormField
                    control={control}
                    name="requested_by"
                    render={({ field }) => {
                      const fieldValueStr = typeof field.value === 'string' ? field.value :
                                          (typeof field.value === 'object' && field.value?.id) ? field.value.id :
                                          String(field.value || '');

                      // Get current user info
                      const currentUser = currentUserProfile?.data;
                      const currentUserName = currentUser
                        ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim()
                        : 'Loading...';

                      // If from memo, show memo user, else show current user
                      const selectedUser = finalMemoId
                        ? usersOptions.find((user: any) => user.value === fieldValueStr)
                        : null;

                      return (
                        <div className='flex items-center gap-2'>
                          <svg className='h-5 w-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                          </svg>
                          <div className='text-sm font-semibold text-gray-800'>
                            {finalMemoId
                              ? (selectedUser?.label || 'Not Selected')
                              : currentUserName
                            }
                          </div>
                        </div>
                      );
                    }}
                  />
                  <FormInput type='hidden' name='requested_by' />
                  <FormInput type='hidden' name='role_requested_by' />
                </div>
                <p className='text-xs text-gray-600 italic'>
                  {finalMemoId
                    ? 'Automatically set from activity memo'
                    : 'Automatically set to your user account'
                  }
                </p>
              </div>

              {/* Reviewed By */}
              <div className='space-y-2'>
                <h4 className='font-medium text-gray-700 flex items-center gap-2'>
                  Reviewed By
                  {!finalMemoId && <span className='text-red-500'>*</span>}
                </h4>
                {finalMemoId ? (
                  // Read-only display for Activity Memo flow
                  <div className='p-3 bg-white border rounded'>
                    <FormField
                      control={control}
                      name="reviewed_by"
                      render={({ field }) => {
                        const fieldValueStr = typeof field.value === 'string' ? field.value :
                                            (typeof field.value === 'object' && field.value?.id) ? field.value.id :
                                            String(field.value || '');
                        const selectedUser = usersOptions.find((user: any) => user.value === fieldValueStr);
                        return (
                          <div className='text-sm font-medium'>
                            {selectedUser?.label || (fieldValueStr ? `User ID: ${fieldValueStr}` : 'Not Selected')}
                          </div>
                        );
                      }}
                    />
                    <FormInput type='hidden' name='reviewed_by' />
                    <FormInput type='hidden' name='role_reviewed_by' />
                  </div>
                ) : (
                  // Editable dropdown for standalone flow
                  <FormField
                    control={control}
                    name='reviewed_by'
                    render={({ field }) => (
                      <FormSelect
                        name='reviewed_by'
                        placeholder="Select reviewer"
                        options={usersOptions || []}
                        searchPlaceholder="Search reviewers by name..."
                        emptyMessage="No reviewers found matching your search."
                        forceSearch={true} // Essential for 2M+ users
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Auto-populate role when user is selected
                          const selectedUser = (users as any)?.data?.results?.find((u: any) => u.id === value);
                          if (selectedUser?.position) {
                            const roleId = typeof selectedUser.position === 'object' ? selectedUser.position.id : selectedUser.position;
                            setValue('role_reviewed_by', roleId);
                            console.log("✅ Auto-set role_reviewed_by:", roleId);
                          }
                        }}
                      />
                    )}
                  />
                )}
              </div>

              {/* Authorized By */}
              <div className='space-y-2'>
                <h4 className='font-medium text-gray-700 flex items-center gap-2'>
                  Authorized By
                  {!finalMemoId && <span className='text-red-500'>*</span>}
                </h4>
                {finalMemoId ? (
                  // Read-only display for Activity Memo flow
                  <div className='p-3 bg-white border rounded'>
                    <FormField
                      control={control}
                      name="authorised_by"
                      render={({ field }) => {
                        const fieldValueStr = typeof field.value === 'string' ? field.value :
                                            (typeof field.value === 'object' && field.value?.id) ? field.value.id :
                                            String(field.value || '');
                        const selectedUser = usersOptions.find((user: any) => user.value === fieldValueStr);
                        return (
                          <div className='text-sm font-medium'>
                            {selectedUser?.label || (fieldValueStr ? `User ID: ${fieldValueStr}` : 'Not Selected')}
                          </div>
                        );
                      }}
                    />
                    <FormInput type='hidden' name='authorised_by' />
                    <FormInput type='hidden' name='role_authorised_by' />
                  </div>
                ) : (
                  // Editable dropdown for standalone flow
                  <FormField
                    control={control}
                    name='authorised_by'
                    render={({ field }) => (
                      <FormSelect
                        name='authorised_by'
                        placeholder="Select authorizer"
                        options={usersOptions || []}
                        searchPlaceholder="Search authorizers by name..."
                        emptyMessage="No authorizers found matching your search."
                        forceSearch={true} // Essential for 2M+ users
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Auto-populate role when user is selected
                          const selectedUser = (users as any)?.data?.results?.find((u: any) => u.id === value);
                          if (selectedUser?.position) {
                            const roleId = typeof selectedUser.position === 'object' ? selectedUser.position.id : selectedUser.position;
                            setValue('role_authorised_by', roleId);
                            console.log("✅ Auto-set role_authorised_by:", roleId);
                          }
                        }}
                      />
                    )}
                  />
                )}
              </div>

              {/* Approved By */}
              <div className='space-y-2'>
                <h4 className='font-medium text-gray-700 flex items-center gap-2'>
                  Approved By
                  {!finalMemoId && <span className='text-red-500'>*</span>}
                </h4>
                {finalMemoId ? (
                  // Read-only display for Activity Memo flow
                  <div className='p-3 bg-white border rounded'>
                    <FormField
                      control={control}
                      name="approved_by"
                      render={({ field }) => {
                        const fieldValueStr = typeof field.value === 'string' ? field.value :
                                            (typeof field.value === 'object' && field.value?.id) ? field.value.id :
                                            String(field.value || '');
                        const selectedUser = usersOptions.find((user: any) => user.value === fieldValueStr);
                        return (
                          <div className='text-sm font-medium'>
                            {selectedUser?.label || (fieldValueStr ? `User ID: ${fieldValueStr}` : 'Not Selected')}
                          </div>
                        );
                      }}
                    />
                    <FormInput type='hidden' name='approved_by' />
                    <FormInput type='hidden' name='role_approved_by' />
                  </div>
                ) : (
                  // Editable dropdown for standalone flow
                  <FormField
                    control={control}
                    name='approved_by'
                    render={({ field }) => (
                      <FormSelect
                        name='approved_by'
                        placeholder="Select approver"
                        options={usersOptions || []}
                        searchPlaceholder="Search approvers by name..."
                        emptyMessage="No approvers found matching your search."
                        forceSearch={true} // Essential for 2M+ users
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Auto-populate role when user is selected
                          const selectedUser = (users as any)?.data?.results?.find((u: any) => u.id === value);
                          if (selectedUser?.position) {
                            const roleId = typeof selectedUser.position === 'object' ? selectedUser.position.id : selectedUser.position;
                            setValue('role_approved_by', roleId);
                            console.log("✅ Auto-set role_approved_by:", roleId);
                          }
                        }}
                      />
                    )}
                  />
                )}
              </div>

            </div>

            <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
              <p className='text-xs text-blue-800'>
                {finalMemoId ? (
                  <>
                    <strong>ℹ️ Note:</strong> Approval workflow is automatically set from the activity memo and cannot be modified.
                  </>
                ) : (
                  <>
                    <strong>ℹ️ Note:</strong> Select the appropriate users for each approval stage. This determines the approval workflow for this purchase request.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center justify-between gap-4 pt-6 border-t-2 border-gray-200'>
            <Button
              type='button'
              variant='ghost'
              onClick={() => router.back()}
              disabled={isLoading}
              className='px-6'
            >
              Cancel
            </Button>

            <div className='flex gap-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  const currentValues = watch();
                  console.log("🔍 Current form state for debugging:", currentValues);
                  toast.info("Form state logged to console - check developer tools");
                }}
              >
                Debug Form
              </Button>
              <FormButton
                loading={isLoading}
                disabled={isLoading}
                type='submit'
                className='flex items-center justify-center gap-2 px-8 py-3'
              >
                {finalMemoId ? 'Submit Purchase Request' : 'Create Purchase Request'}
                <LongArrowRight />
              </FormButton>
            </div>
          </div>

        </form>
      </Form>
    </div>
  );
};

export default CreatePurchaseRequestForm;
