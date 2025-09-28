"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import { Select, SelectTrigger, SelectValue } from "components/ui/select";
import AddSquareIcon from "components/icons/AddSquareIcon";
import LongArrowRight from "components/icons/LongArrowRight";
import { LoadingSpinner } from "components/Loading";
import { Button } from "components/ui/button";
import { Upload as UploadFile } from "lucide-react";

import { Form, FormControl, FormField, FormItem } from "components/ui/form";
import MultiSelectFormField from "components/ui/multiselect";
import { SelectContent, SelectItem } from "components/ui/select";
import { RouteEnum } from "constants/RouterConstants";
import { PurchaseRequestSchema } from "@/features/procurement/types/procurement-validator";
import { MinusCircle } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import ProcurementErrorBoundary from "../../../procurement-plan/ErrorBoundary";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useGetDepartmentPaginate } from "@/features/modules/controllers/config/departmentController";
import { useGetAllItems } from "@/features/modules/controllers/config/itemController";
import { useGetLocationList } from "@/features/modules/controllers/config/locationController";
import { useGetAllFCONumbers } from "@/features/modules/controllers/finance/fcoNumberController";
import { useGetAllPartners } from "@/features/projects/controllers/projectController";
import { useCreatePurchaseRequest } from "@/features/procurement/controllers/purchaseRequestController";
import { useGetActivityMemo } from "@/features/procurement/controllers/activityMemoController";
import { toast } from "sonner";
import { z } from "zod";
import { Input } from "components/ui/input";
import { useSelector } from "react-redux";
import { RootState } from "store/index";

const CreatePurchaseRequestForm = ({ expenses }) => {
  const searchParams = useSearchParams();
  const request = searchParams.get("request");
  console.log("Purchase request form - request parameter:", request);

  // Get activity memo data from Redux store
  const activityMemoData = useSelector((state: RootState) => state.activity.activity);
  console.log("📊 Activity memo data from Redux:", activityMemoData);
  console.log("📊 Number of entries in Redux:", activityMemoData?.length);
  if (activityMemoData?.length > 0) {
    const latestEntry = activityMemoData[activityMemoData.length - 1];
    console.log("📊 Latest entry:", latestEntry);
    console.log("📊 Latest entry expenses:", latestEntry?.expenses);
    console.log("📊 Latest entry FCO (fconumber):", latestEntry?.fconumber);
    console.log("📊 FCO Array check:", Array.isArray(latestEntry?.fconumber));
    console.log("📊 FCO Length:", latestEntry?.fconumber?.length);
    console.log("📊 FCO Content:", latestEntry?.fconumber);
    console.log("📊 All keys in latest entry:", Object.keys(latestEntry || {}));
  }

  // Get the memo ID from Redux if not in URL
  const memoIdFromRedux = activityMemoData.length > 0 ? activityMemoData[activityMemoData.length - 1]?.createdMemoId : null;
  const finalMemoId = request || memoIdFromRedux;
  console.log("Final memo ID to use:", finalMemoId);

  // If Redux is empty but we have a memo ID, try to fetch from API
  const shouldFetchApi = !!finalMemoId && activityMemoData.length === 0;
  console.log("🔧 API fetch decision:", {
    finalMemoId,
    activityMemoDataLength: activityMemoData.length,
    shouldFetchApi
  });

  const { data: apiMemoData, isLoading: apiMemoLoading, error: apiMemoError } = useGetActivityMemo(finalMemoId as string, shouldFetchApi);
  console.log("🌐 API memo data:", apiMemoData);
  console.log("🌐 API memo loading:", apiMemoLoading);
  console.log("🌐 API memo error:", apiMemoError);

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

  const { data: fco } = useGetAllFCONumbers({
    page: 1,
    size: 2000000,
  });


  const { data: users } = useGetAllUsers({
    page: 1,
    size: 2000000,
  });

  const { data: locations } = useGetLocationList({});

  const [, setFile] = useState<File | null>(null);

  // Debug FCO matching after both Redux data and API data are available
  useEffect(() => {
    if (activityMemoData?.length > 0 && (fco as any)?.data?.data?.results) {
      const latestEntry = activityMemoData[activityMemoData.length - 1];
      if (latestEntry?.fconumber) {
        console.log("📊 Checking FCO ID matches:");
        latestEntry.fconumber.forEach((fcoId: string, index: number) => {
          const matchingFco = (fco as any).data.data.results.find((f: any) => f.id === fcoId);
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
    },
  });

  const router = useRouter();

  const { control, handleSubmit, setValue, watch } = form;

  // Debug: Watch form values to see what's actually in the form
  const formValues = watch();
  console.log("🏠 Current form values:", formValues);
  console.log("🏠 Form items:", formValues?.items);
  if (formValues?.items && formValues.items.length > 0) {
    formValues.items.forEach((item: any, index: number) => {
      // Debug: Form item validation
      const isValidItem = item?.item && item?.quantity && item?.unit_cost;
    });
  }

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
  console.log("👥 Users data for display:", (users as any)?.data?.results?.length || 0, "users loaded");
  console.log("👥 Users options created:", usersOptions.length, "options");
  if (usersOptions.length > 0) {
    console.log("👥 Sample user option:", usersOptions[0]);
  }


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
        validationErrors.push("No items found - please ensure the activity memo contains expense items");
      }

      // Check for memo reference
      if (!data.request_memo || data.request_memo === "null" || data.request_memo.trim() === "") {
        validationErrors.push("Missing activity memo reference");
      }

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
        items: data.items.map((item: any) => ({
          ...item,
          // Ensure numeric fields are properly formatted
          quantity: typeof item.quantity === 'string' ? parseInt(item.quantity) : item.quantity,
          unit_cost: typeof item.unit_cost === 'string' ? parseFloat(item.unit_cost) : item.unit_cost,
          amount: typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount,
        })),
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
        request_memo: data.request_memo,
        requesting_department: data.requesting_department,
        location: data.deliver_to,
        role_requested_by: data.role_requested_by,
        role_reviewed_by: data.role_reviewed_by,
        role_authorised_by: data.role_authorised_by,
        role_approved_by: data.role_approved_by,
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
      console.log("Using expenses from props:", expenses);
      return expenses.map((exp: any) => ({
        quantity: exp?.quantity,
        unit_cost: exp?.unit_cost,
        amount: exp?.total_cost,
        uom: exp?.uom || "",
        item: typeof exp?.item === 'object' ? exp?.item?.id : exp?.item,
        description: exp?.description || "",
        fco_number: [],
      }));
    }

    // If creating new request from activity memo, try Redux data first
    if (finalMemoId && activityMemoData && activityMemoData.length > 0) {
      // Find the latest activity memo data (most recently added)
      const latestActivityMemo = activityMemoData[activityMemoData.length - 1];
      console.log("Using activity memo data from Redux:", latestActivityMemo);

      if (latestActivityMemo?.expenses && latestActivityMemo.expenses.length > 0) {
        console.log("🔄 Processing expenses from Redux:", latestActivityMemo.expenses);
        console.log("🔄 FCO numbers from Redux:", latestActivityMemo?.fconumber);

        const mappedExpenses = latestActivityMemo.expenses.map((exp: any, index: number) => {
          const mappedItem = {
            quantity: exp?.quantity ? Number(exp.quantity) : 1,
            unit_cost: exp?.unit_cost ? Number(exp.unit_cost) : 0,
            amount: exp?.total_cost ? Number(exp.total_cost) : 0,
            uom: exp?.uom || "",
            item: typeof exp?.item === 'object' ? (exp?.item?.id || "") : (exp?.item || ""), // Ensure we get the ID, not the object
            description: exp?.description || "",
            fco_number: Array.isArray(latestActivityMemo?.fconumber) ? latestActivityMemo.fconumber : [], // FCO numbers from memo level
          };
          return mappedItem;
        });

        console.log("🔄 Final mapped expenses from Redux:", mappedExpenses);
        return mappedExpenses;
      }
    }

    // If Redux is empty but we have API data as fallback
    if (finalMemoId && apiMemoData?.data) {
      console.log("📡 Using activity memo data from API as fallback:", apiMemoData.data);

      if (apiMemoData.data.expenses && apiMemoData.data.expenses.length > 0) {
        console.log("🔄 Processing expenses from API:", apiMemoData.data.expenses);
        console.log("🔄 FCO numbers from API:", apiMemoData.data?.fconumber);

        const mappedExpenses = apiMemoData.data.expenses.map((exp: any, index: number) => {
          const mappedItem = {
            quantity: exp?.quantity ? Number(exp.quantity) : 1,
            unit_cost: exp?.unit_cost ? Number(exp.unit_cost) : 0,
            amount: exp?.total_cost ? Number(exp.total_cost) : 0,
            uom: exp?.uom || "",
            item: typeof exp?.item === 'object' ? (exp?.item?.id || "") : (exp?.item || ""), // Ensure we get the ID, not the object
            description: exp?.description || "",
            fco_number: Array.isArray(apiMemoData.data?.fconumber) ? apiMemoData.data.fconumber : [], // FCO numbers from memo level
          };
          return mappedItem;
        });

        console.log("🔄 Final mapped expenses from API:", mappedExpenses);
        return mappedExpenses;
      }
    }

    console.log("No expenses data found from Redux or API, returning empty array");
    return [];
  }, [expenses, request, activityMemoData, finalMemoId, apiMemoData]);

  // Helper function to extract user ID from object or string
  const extractUserId = (userField: any): string => {
    if (typeof userField === 'string') {
      return userField;
    } else if (typeof userField === 'object' && userField?.id) {
      return userField.id;
    } else if (typeof userField === 'object' && userField?.value) {
      return userField.value;
    }
    return '';
  };

  // Helper function to extract position/role ID from object or string
  const extractRoleId = (roleField: any): string => {
    console.log("🔍 Extracting role ID from:", roleField, "Type:", typeof roleField);

    if (typeof roleField === 'string' && roleField.trim()) {
      console.log("✅ Found string role ID:", roleField);
      return roleField;
    } else if (typeof roleField === 'object' && roleField) {
      if (roleField?.id) {
        console.log("✅ Found object role ID:", roleField.id);
        return roleField.id;
      } else if (roleField?.value) {
        console.log("✅ Found object role value:", roleField.value);
        return roleField.value;
      } else if (roleField?.name) {
        console.log("✅ Found object role name:", roleField.name);
        return roleField.name;
      } else if (roleField?.role_id) {
        console.log("✅ Found object role_id:", roleField.role_id);
        return roleField.role_id;
      } else if (roleField?.position_id) {
        console.log("✅ Found object position_id:", roleField.position_id);
        return roleField.position_id;
      }
      console.log("⚠️ Role object found but no recognizable ID field:", Object.keys(roleField));
    }
    console.log("❌ No valid role ID found");
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
      if (memoData.created_by) {
        const requestedById = extractUserId(memoData.created_by);
        console.log("👥 Setting requested_by:", {
          original: memoData.created_by,
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
        console.log("👥 Set requested_by:", requestedById, "from:", memoData.created_by);
      }

      if (memoData.reviewed_by && Array.isArray(memoData.reviewed_by) && memoData.reviewed_by.length > 0) {
        const reviewedById = extractUserId(memoData.reviewed_by[0]);
        console.log("👥 Setting reviewed_by:", {
          original: memoData.reviewed_by[0],
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
        console.log("👥 Set reviewed_by:", reviewedById, "from:", memoData.reviewed_by[0]);
      }

      if (memoData.authorised_by && Array.isArray(memoData.authorised_by) && memoData.authorised_by.length > 0) {
        const authorizedById = extractUserId(memoData.authorised_by[0]);
        console.log("👥 Setting authorised_by:", {
          original: memoData.authorised_by[0],
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
        console.log("👥 Set authorised_by:", authorizedById, "from:", memoData.authorised_by[0]);
      }

      if (memoData.approved_by) {
        const approvedById = extractUserId(memoData.approved_by);
        console.log("👥 Setting approved_by:", {
          original: memoData.approved_by,
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
        console.log("👥 Set approved_by:", approvedById, "from:", memoData.approved_by);
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
  }, [activityMemoData, apiMemoData, setValue, users, watch]);

  useEffect(() => {
    if (expensesData && expensesData.length > 0) {
      console.log("✍️ Populating form with expenses data:", expensesData);

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
          uom: typeof item.uom === 'object' ? (item.uom?.name || item.uom?.id || "") : (item.uom || ""),
          description: typeof item.description === 'object' ? (item.description?.name || item.description?.id || "") : (item.description || "")
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
    } else if (finalMemoId) {
      console.warn("No expenses data found for memo ID:", finalMemoId);
      toast.warning("No items found from activity memo. You may need to add items manually.");
    }
  }, [expensesData, setValue, finalMemoId, watch, fields.length, append, remove]);

  return (
    <div className='pt-5'>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <div className='grid  gap-5'>
            <FormInput
              label='Ref'
              name='ref_number'
              type='text'
              placeholder=''
            />
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <FormInput
              label='Date of Request'
              name='date_of_request'
              type='date'
              placeholder='01/01/2024'
            />
            <FormInput
              label='Required Date'
              name='date_required'
              type='date'
              placeholder='01/01/2024'
            />
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <FormSelect
              label='Requesting Dept.'
              name='requesting_department'
              required
            >
              <SelectContent>
                {departmentsIsLoading ? (
                  <LoadingSpinner />
                ) : (
                  (departments as any)?.data?.results?.map(
                    (department: any) => (
                      <SelectItem key={department?.id} value={String(department?.id)}>
                        {String(department?.name || department?.id || 'Unknown Department')}
                      </SelectItem>
                    )
                  )
                )}
              </SelectContent>
            </FormSelect>
            <FormSelect label='Deliver to' name='deliver_to' required>
              <SelectContent>
                {partnersIsLoading ? (
                  <LoadingSpinner />
                ) : (
                  (locations as any)?.data?.results?.map((location: any) => (
                    <SelectItem key={location?.id} value={String(location?.id)}>
                      {String(location?.name || location?.id || 'Unknown Location')}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </FormSelect>
          </div>
          <div>
            <label htmlFor=''>Specification/ Instructions</label>
            <div className='w-full px-4 relative gap-x-3 h-[52px] rounded-[16.2px] border flex justify-center items-center'>
              <UploadFile size={20} />
              <Input
                type='file'
                onChange={handleFileChange}
                className='bg-inherit border-none cursor-pointer '
              />
            </div>

          </div>

          <div>
            <ProcurementErrorBoundary fallback={
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">Error in items table. Object rendering issue detected.</p>
                <p className="text-sm text-red-600 mt-2">Check browser console for details</p>
              </div>
            }>
            <table className='w-full border'>
              <thead>
                <tr className='text-amber-500 whitespace-nowrap border-b-2 text-xs font-semibold'>
                  <th className='px-2 py-5'>S/N</th>
                  <th className='px-2 py-5'>Description of items/services</th>
                  {/* <th className='px-2 py-5'>NO of Persons/Unit</th> */}
                  {/* <th className="px-2 py-5">No of Days</th> */}
                  <th className='px-2 py-5'>FCO</th>
                  <th className='px-2 py-5'>Quantity</th>
                  <th className='px-2 py-5'>UOM</th>
                  <th className='px-2 py-5'>Unit Cost</th>
                  <th className='px-2 py-5'>Total</th>
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
                              fco?.data?.data?.results?.map((item) => {
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
                            // Ensure options are properly formatted
                            const fcoOptions = (fco as any)?.data?.data?.results || [];

                            return (
                              <FormItem className=' mt-2'>
                                <FormControl>
                                  <MultiSelectFormField
                                    key={`fco-${index}-${field.value?.length || 0}`} // Force re-render when value changes
                                    options={fcoOptions}
                                    defaultValue={Array.isArray(field.value) ? field.value.map((val: any) => typeof val === 'object' ? val.id : val) : []}
                                    onValueChange={(value) => {
                                      // Ensure we're only passing IDs, not objects
                                      const safeValue = Array.isArray(value) ? value.map((val: any) => typeof val === 'object' ? val.id : val) : value;
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
            </ProcurementErrorBoundary>
            <div className='flex justify-end mt-2'>
              <Button
                type='button'
                className='text-primary bg-[#FFF2F2] flex gap-2 items-center justify-center'
                onClick={() =>
                  append({
                    item: "",
                    fco_number: [],
                    amount: 0,
                    uom: "",
                    description: "",
                    // number_of_days: 0,
                    unit_cost: 0,
                    quantity: 1,
                  })
                }
              >
                <AddSquareIcon />
                Add
              </Button>
            </div>
          </div>

          {/* <div className='flex items-center justify-end'>
            <div className='text-primary border-primary flex items-center justify-start gap-2 rounded border-2 px-6 py-3 text-base font-semibold'>
              <span>Total:</span>
              <span>N0.00</span>
            </div>
          </div> */}

          {/* Approval section - auto-populated from activity memo */}
          <div className='my-6 p-4 bg-gray-50 rounded-lg'>
            <h3 className='mb-4 text-lg font-semibold'>Approval Workflow (From Activity Memo)</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

              <div className='space-y-2'>
                <h4 className='font-medium text-gray-700'>Requested By</h4>
                <div className='p-2 bg-white border rounded'>
                  <FormField
                    control={control}
                    name="requested_by"
                    render={({ field }) => {
                      console.log(`🔍 Display field value:`, {
                        fieldValue: field.value,
                        fieldValueType: typeof field.value,
                        usersOptionsLength: usersOptions.length
                      });

                      // Ensure we're working with a string ID
                      const fieldValueStr = typeof field.value === 'string' ? field.value :
                                          (typeof field.value === 'object' && field.value?.id) ? field.value.id :
                                          String(field.value || '');

                      const selectedUser = usersOptions.find((user: any) => user.value === fieldValueStr);
                      console.log(`🔍 Selected user:`, selectedUser);

                      return (
                        <div className='text-sm'>
                          {selectedUser?.label || (fieldValueStr ? `User ID: ${fieldValueStr}` : (users ? 'Not Selected' : 'Loading...'))}
                        </div>
                      );
                    }}
                  />
                </div>
                <FormInput type='hidden' name='requested_by' />
                <FormInput type='hidden' name='role_requested_by' />
              </div>

              <div className='space-y-2'>
                <h4 className='font-medium text-gray-700'>Reviewed By</h4>
                <div className='p-2 bg-white border rounded'>
                  <FormField
                    control={control}
                    name="reviewed_by"
                    render={({ field }) => {
                      console.log(`🔍 Display field value:`, {
                        fieldValue: field.value,
                        fieldValueType: typeof field.value,
                        usersOptionsLength: usersOptions.length
                      });

                      // Ensure we're working with a string ID
                      const fieldValueStr = typeof field.value === 'string' ? field.value :
                                          (typeof field.value === 'object' && field.value?.id) ? field.value.id :
                                          String(field.value || '');

                      const selectedUser = usersOptions.find((user: any) => user.value === fieldValueStr);
                      console.log(`🔍 Selected user:`, selectedUser);

                      return (
                        <div className='text-sm'>
                          {selectedUser?.label || (fieldValueStr ? `User ID: ${fieldValueStr}` : (users ? 'Not Selected' : 'Loading...'))}
                        </div>
                      );
                    }}
                  />
                </div>
                <FormInput type='hidden' name='reviewed_by' />
                <FormInput type='hidden' name='role_reviewed_by' />
              </div>

              <div className='space-y-2'>
                <h4 className='font-medium text-gray-700'>Authorized By</h4>
                <div className='p-2 bg-white border rounded'>
                  <FormField
                    control={control}
                    name="authorised_by"
                    render={({ field }) => {
                      console.log(`🔍 Display field value:`, {
                        fieldValue: field.value,
                        fieldValueType: typeof field.value,
                        usersOptionsLength: usersOptions.length
                      });

                      // Ensure we're working with a string ID
                      const fieldValueStr = typeof field.value === 'string' ? field.value :
                                          (typeof field.value === 'object' && field.value?.id) ? field.value.id :
                                          String(field.value || '');

                      const selectedUser = usersOptions.find((user: any) => user.value === fieldValueStr);
                      console.log(`🔍 Selected user:`, selectedUser);

                      return (
                        <div className='text-sm'>
                          {selectedUser?.label || (fieldValueStr ? `User ID: ${fieldValueStr}` : (users ? 'Not Selected' : 'Loading...'))}
                        </div>
                      );
                    }}
                  />
                </div>
                <FormInput type='hidden' name='authorised_by' />
                <FormInput type='hidden' name='role_authorised_by' />
              </div>

              <div className='space-y-2'>
                <h4 className='font-medium text-gray-700'>Approved By</h4>
                <div className='p-2 bg-white border rounded'>
                  <FormField
                    control={control}
                    name="approved_by"
                    render={({ field }) => {
                      console.log(`🔍 Display field value:`, {
                        fieldValue: field.value,
                        fieldValueType: typeof field.value,
                        usersOptionsLength: usersOptions.length
                      });

                      // Ensure we're working with a string ID
                      const fieldValueStr = typeof field.value === 'string' ? field.value :
                                          (typeof field.value === 'object' && field.value?.id) ? field.value.id :
                                          String(field.value || '');

                      const selectedUser = usersOptions.find((user: any) => user.value === fieldValueStr);
                      console.log(`🔍 Selected user:`, selectedUser);

                      return (
                        <div className='text-sm'>
                          {selectedUser?.label || (fieldValueStr ? `User ID: ${fieldValueStr}` : (users ? 'Not Selected' : 'Loading...'))}
                        </div>
                      );
                    }}
                  />
                </div>
                <FormInput type='hidden' name='approved_by' />
                <FormInput type='hidden' name='role_approved_by' />
              </div>

            </div>
            <p className='text-xs text-gray-500 mt-2'>
              ℹ️ Approval workflow is automatically set from the activity memo and cannot be modified.
            </p>
          </div>
          <div className='flex items-center justify-end gap-4'>
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
              className='flex items-center justify-center gap-2'
            >
              Submit
              <LongArrowRight />
            </FormButton>
            {/* <Link
              className='w-fit'
              href={generatePath(RouteEnum.PURCHASE_REQUEST_FORM)}
            > */}
            {/* <Button className='flex gap-2 py-6'>
              Submit
              <LongArrowRight />
            </Button> */}
            {/* </Link> */}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreatePurchaseRequestForm;
