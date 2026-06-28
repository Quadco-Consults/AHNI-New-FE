"use client";

import GoBack from "@/components/GoBack";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, MinusCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useMemo, useState, useRef } from "react";
import { useGetVendors } from "@/features/procurement/controllers/vendorController";
import {
  useGetPurchaseRequests,
  useGetPurchaseRequest,
} from "@/features/procurement/controllers/purchaseRequestController";
import { LoadingSpinner } from "@/components/Loading";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { PurchaseOrderListSchema } from "@/features/procurement/types/procurement-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/FormInput";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import FormButton from "@/components/FormButton";
import LongArrowRight from "@/components/icons/LongArrowRight";
import BreadcrumbCard from "@/components/Breadcrumb";
import { useGetAllDepartments } from "@/features/modules/controllers/config/departmentController";
// import { toast } from "sonner";
import { useCreatePurchaseOrder } from "@/features/procurement/controllers/purchaseOrderController";
import { RouteEnum } from "@/constants/RouterConstants";
// import { useGetAllGrades } from "@/features/modules/controllers/config/gradeController";
import MultiSelectFormField from "@/components/ui/multiselect";
import FormSelect from "@/components/FormSelect";
import { useGetAllItems } from "@/features/modules/controllers/config/itemController";
import { useGetAllFCONumbersQuery } from "@/features/modules/controllers";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import CbaAPI from "@/features/procurement/controllers/cbaController";
import { useGetSolicitationSubmission } from "@/features/procurement/controllers/vendorBidSubmissionsController";
import { useGetSingleSolicitation } from "@/features/procurement/controllers/solicitationController";
import { useGetAllLocationsManager } from "@/features/modules/controllers/config/locationController";

const PurchaseOrderNew = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cbaId = searchParams?.get('cba');
  const vendorIdFromUrl = searchParams?.get('vendor');

  const [open, setOpen] = useState(false);
  const [opens, setOpens] = useState(false);
  const [opensPurchase, setOpensPurchase] = useState(false);
  const [openDelivery, setOpenDelivery] = useState(false);
  const [openReviewer, setOpenReviewer] = useState(false);
  const [openAuthorizer, setOpenAuthorizer] = useState(false);
  const [openApprover, setOpenApprover] = useState(false);
  const [vendorValue, setVendorValue] = useState(vendorIdFromUrl || "");
  const [requestValue, setRequestValue] = useState("");
  const [purchaseValue, setPurchaseValue] = useState("");
  const [deliveryValue, setDeliveryValue] = useState("");

  // Track if CBA items have been populated to prevent double-appending
  const cbaItemsPopulated = useRef(false);

  // Fetch CBA data if coming from CBA flow
  const { data: cbaData } = CbaAPI.useGetSingleCba(cbaId || "", !!cbaId);

  // Get solicitation ID - handle both string and object formats
  const solicitationId = typeof cbaData?.data?.solicitation === 'object'
    ? (cbaData?.data?.solicitation as any)?.id
    : cbaData?.data?.solicitation;

  // Fetch full solicitation details to get purchase_request and department
  const { data: fullSolicitation } = useGetSingleSolicitation(
    solicitationId || "",
    !!solicitationId
  );

  // Fetch bid submissions to get vendor bid_items (same as AnalysisResultsView)
  const { data: submissionData } = useGetSolicitationSubmission(
    solicitationId || "",
    !!solicitationId
  );

  // Debug full solicitation data
  if (fullSolicitation?.data) {
    console.log("🔍 Full Solicitation Data:", fullSolicitation);
    console.log("🔍 Full Solicitation Data Structure:", JSON.stringify(fullSolicitation?.data, null, 2));
    console.log("🔍 Has purchase_request field:", !!(fullSolicitation.data as any).purchase_request);
    console.log("🔍 Has requesting_department field:", !!(fullSolicitation.data as any).requesting_department);
    console.log("🔍 Has solicitation_items field:", !!(fullSolicitation.data as any).solicitation_items);
    console.log("🔍 Available fields:", Object.keys(fullSolicitation.data));
  }


  const { data: vendors, isLoading: vendorsIsLoading } = useGetVendors({
    page: 1,
    size: 2000000,
  });
  const { data: requests, isLoading: requestsIsLoading } =
    useGetPurchaseRequests({ page: 1, size: 2000000 });
  const { data: requestsDetails } = useGetPurchaseRequest(
    purchaseValue as string,
    !!purchaseValue
  );

  // const fco = useGetAllGrades({
  //   page: 1,
  //   size: 2000000,
  // });

  const fco = useGetAllFCONumbersQuery({
    page: 1,
    size: 2000000,
  });

  // Debug FCO data
  console.log("🔍 FCO API Response:", fco);
  console.log("🔍 FCO Data:", fco?.data);
  console.log("🔍 FCO Data Structure:", JSON.stringify(fco?.data, null, 2));
  console.log("🔍 FCO Results:", fco?.data?.results);
  console.log("🔍 FCO Data Keys:", Object.keys(fco?.data || {}));

  // Fetch users for approval workflow (only needed for standalone PO creation)
  const { data: users, isLoading: usersIsLoading } = useGetAllUsers({
    page: 1,
    size: 2000000,
  });

  const { data: item } = useGetAllItems({
    page: 1,
    size: 2000000,
  });

  const itemOptions = useMemo(
    () =>
      item?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [item]
  );
  const { data: departments, isLoading: departmentsIsLoading } =
    useGetAllDepartments({ page: 1, size: 2000000, search: "" });

  const { data: locations, isLoading: locationsIsLoading } =
    useGetAllLocationsManager({ page: 1, size: 2000000, search: "" });

  const {
    createPurchaseOrder: createPurchcaseOrderMutation,
    isLoading: creatingOrder,
  } = useCreatePurchaseOrder();

  const form = useForm<z.infer<typeof PurchaseOrderListSchema>>({
    resolver: zodResolver(PurchaseOrderListSchema),
    defaultValues: {
      vendor: "",
      purchase_request: "",
      payment_terms: "",
      delivery_lead_time: "",
      transaction_type: "SUPPLIES", // Default to Supplies (WHT 2%)
      items: [],
      // Approval workflow fields - only for standalone PO creation
      // When creating from CBA, these are inherited/pre-filled
      reviewed_by: "",
      authorized_by: "",
      approved_by: "",
      vendor_representative_name: "",
    },
  });

  const { setValue, control, handleSubmit, watch, trigger } = form;

  // Initialize useFieldArray early so replace is available in all useEffects
  const { fields, remove, append, replace } = useFieldArray({
    control,
    name: "items",
  });

  const data = useMemo(() => {
    const items = (requestsDetails?.data as any)?.items || (requestsDetails as any)?.items;
    console.log("🔍 Full Purchase Request Response:", requestsDetails);
    console.log("🔍 Purchase Request Data:", requestsDetails?.data);
    console.log("🔍 Items from purchase request:", items);

    // Log the first item structure for debugging
    if (items && items.length > 0) {
      console.log("🔍 Sample first item structure:", JSON.stringify(items[0], null, 2));
    }

    if (!items) return [];

    const mappedItems = items.map((data: any) => {
      console.log("🔍 Processing PR item:", data);
      console.log("🔍 Item details:", data?.item_detail);
      console.log("🔍 Item object:", data?.item);
      console.log("🔍 Full item structure:", JSON.stringify(data, null, 2));

      // Extract UOM from the item structure based on your API response
      const extractUOM = () => {
        // Based on your structure: item.uom is the direct field
        if (data?.item_detail?.uom) {
          console.log("🔍 UOM found in item_detail.uom:", data.item_detail.uom);
          return data.item_detail.uom;
        }
        // This is likely the main path based on your item structure
        if (data?.item?.uom) {
          console.log("🔍 UOM found in item.uom:", data.item.uom);
          return data.item.uom;
        }
        // Fallback to direct uom property
        if (data?.uom) {
          console.log("🔍 UOM found in direct uom property:", data.uom);
          return data.uom;
        }

        console.log("🔍 No UOM found. Available item properties:", Object.keys(data?.item || {}));
        console.log("🔍 Item object:", data?.item);
        return "";
      };

      // Extract description/name from various sources based on your API structure
      const extractDescription = () => {
        // Based on your structure: item.name contains the item name
        if (data?.item?.name) {
          console.log("🔍 Description found in item.name:", data.item.name);
          return data.item.name;
        }
        if (data?.item_detail?.name) {
          console.log("🔍 Description found in item_detail.name:", data.item_detail.name);
          return data.item_detail.name;
        }
        if (data?.description) {
          console.log("🔍 Description found in direct description:", data.description);
          return data.description;
        }
        if (data?.name) {
          console.log("🔍 Description found in direct name:", data.name);
          return data.name;
        }

        console.log("🔍 No description found. Available item properties:", Object.keys(data?.item || {}));
        return "No description";
      };

      // Extract FCO from various sources
      const extractFCO = () => {
        return data?.fco_number ||
               data?.fco ||
               data?.item_detail?.fco_number ||
               data?.item?.fco_number ||
               "";
      };

      // Ensure FCO is always an array of strings, never nested arrays
      const normalizeFCO = () => {
        const fcoValue = extractFCO();
        if (!fcoValue) return [];
        // If it's already an array, return it as-is
        if (Array.isArray(fcoValue)) return fcoValue;
        // If it's a string, wrap it in an array
        return [fcoValue];
      };

      const mappedItem = {
        item_id: data?.item || data?.item_detail?.id || "",
        quantity: data?.quantity || 0,
        unit_cost: data?.unit_cost || 0,
        description: extractDescription(),
        uom: extractUOM(),
        total: (data?.sub_total_amount || data?.total || 0).toString(),
        fco_number: normalizeFCO(), // Properly normalize FCO to array of strings
        name: extractDescription(),
      };

      console.log("🔍 Mapped item result:", mappedItem);
      return mappedItem;
    });

    console.log("🔍 Mapped items for form:", mappedItems);
    return mappedItems;
  }, [requestsDetails]);

  useEffect(() => {
    if (data && data.length > 0) {
      console.log("🔄 Setting form items from Purchase Request:", data);
      console.log("🔄 First item UOM:", data[0]?.uom);
      console.log("🔄 First item structure:", data[0]);

      // Only populate items if not already populated from CBA
      if (!cbaItemsPopulated.current) {
        // Use replace to properly sync with useFieldArray
        replace(data);

        // Update purchase_request in form
        setValue("purchase_request", purchaseValue || "");

        // Force update all UOM and total fields after replace
        setTimeout(() => {
          data.forEach((_: any, index: number) => {
            trigger(`items.${index}.uom`);
            trigger(`items.${index}.total`);
          });
        }, 100);
      }
    }
  }, [data, purchaseValue, trigger, replace, setValue]);

  useEffect(() => {
    if (vendorValue) {
      setValue("vendor", vendorValue);
    }
  }, [setValue, vendorValue]);

  // Auto-populate fields when Purchase Request is selected
  useEffect(() => {
    if (requestsDetails?.data) {
      const prData = requestsDetails.data;
      console.log("🔍 Purchase Request Details for auto-populate:", prData);
      console.log("🔍 PR Data keys:", Object.keys(prData));

      // Log the requesting_department_detail structure
      console.log("🔍 requesting_department_detail:", (prData as any).requesting_department_detail);
      console.log("🔍 location_detail:", (prData as any).location_detail);

      // Try multiple possible field names for department
      const departmentId = (prData as any).requesting_department ||
                          (prData as any).requesting_department_id ||
                          (prData as any).requesting_department_detail?.id ||  // Try nested ID
                          (prData as any).department ||
                          (prData as any).department_id ||
                          (prData as any).requesting_unit;

      console.log("🔍 Extracted department ID:", departmentId);

      // Try to extract location for delivery
      const locationName = (prData as any).location_detail?.name ||
                          (prData as any).location_detail?.location_name ||
                          (prData as any).location ||
                          "";

      console.log("🔍 Extracted location:", locationName);

      // Set department from purchase request
      if (departmentId) {
        console.log("🔍 Setting department from PR:", departmentId);
        setRequestValue(departmentId);
      } else {
        console.warn("⚠️ No department field found in Purchase Request");
        console.warn("⚠️ Available fields:", Object.keys(prData));
        console.warn("⚠️ requesting_department value:", (prData as any).requesting_department);
        console.warn("⚠️ requesting_department_detail value:", (prData as any).requesting_department_detail);
      }

      // Set delivery location from purchase request
      if (locationName) {
        console.log("🔍 Setting delivery location from PR:", locationName);
        setValue("delivery_lead_time", locationName);
      } else {
        console.warn("⚠️ No location found in Purchase Request");
      }

      // Note: payment_terms doesn't exist in PurchaseRequestResultsData
      // This field should be manually entered by the user (or come from CBA vendor submission)
    }
  }, [requestsDetails, setValue]);

  // Auto-populate form from CBA data (same logic as AnalysisResultsView)
  useEffect(() => {
    console.log("🔍 CBA Auto-populate useEffect triggered");
    console.log("🔍 Has cbaData:", !!cbaData?.data);
    console.log("🔍 Has submissionData:", !!submissionData);
    console.log("🔍 Has fullSolicitation:", !!fullSolicitation?.data);
    console.log("🔍 Has cbaId:", !!cbaId);
    console.log("🔍 Already populated:", cbaItemsPopulated.current);

    // Wait for ALL required data before processing
    if (cbaData?.data && submissionData && fullSolicitation?.data && cbaId && !cbaItemsPopulated.current) {
      console.log("🔍 CBA Data for PO:", cbaData.data);
      console.log("🔍 Submission Data for PO:", submissionData);

      // Set vendor from URL parameter
      if (vendorIdFromUrl) {
        setVendorValue(vendorIdFromUrl);
      }

      // Get submissions array (same path as AnalysisResultsView line 153)
      const submissions = (submissionData as any)?.data?.data?.results ||
                         (submissionData as any)?.data?.results ||
                         [];
      console.log("🔍 All submissions:", submissions);

      // Get selected vendor and items from CBA
      const selectedBidId = cbaData.data.selected_bid_submission;
      const selectedItemIds = cbaData.data.selected_items || [];
      console.log("🔍 Selected vendor/bid ID:", selectedBidId);
      console.log("🔍 Selected item IDs:", selectedItemIds);

      // Find the selected vendor submission (same as AnalysisResultsView line 156)
      const selectedVendor = submissions.find((sub: any) => sub.id === selectedBidId);
      console.log("🔍 Selected vendor submission:", selectedVendor);

      if (!selectedVendor) {
        console.warn("⚠️ Selected vendor submission not found");
        return;
      }

      // Extract the actual vendor ID from the selected submission
      const actualVendorId = selectedVendor.vendor?.id;
      console.log("🔍 Actual vendor ID:", actualVendorId);

      if (actualVendorId) {
        setVendorValue(actualVendorId);
      }

      // Set purchase request from fullSolicitation (fetched separately)
      // Use the full solicitation data instead of the minimal one from CBA
      const solicitation = fullSolicitation?.data || cbaData.data.solicitation;

      // Try multiple paths to get purchase request ID
      const purchaseRequestId = typeof solicitation === 'object' && solicitation !== null
        ? ((solicitation as any).purchase_request ||
           (solicitation as any).purchase_request_id ||
           (solicitation as any).pr ||
           (solicitation as any).pr_id)
        : null;

      console.log("🔍 Full Solicitation data:", solicitation);
      console.log("🔍 Purchase Request ID from solicitation:", purchaseRequestId);

      if (purchaseRequestId) {
        console.log("🔍 Setting purchase request value:", purchaseRequestId);
        setPurchaseValue(purchaseRequestId);
        setValue("purchase_request", purchaseRequestId);
        // This will trigger the useEffect that fetches PR details and auto-populates department
      } else {
        console.warn("⚠️ No purchase request ID found in solicitation");
      }

      // Note: Department will be populated automatically by the requestsDetails useEffect
      // once the Purchase Request data is fetched

      // Extract payment terms and delivery from selected vendor submission
      const paymentTerms = selectedVendor.payment_terms || selectedVendor.payment_term || "";
      const deliveryTime = selectedVendor.delivery_time ||
                          selectedVendor.delivery_leadtime ||
                          selectedVendor.delivery_lead_time || "";
      console.log("🔍 Payment Terms from vendor:", paymentTerms);
      console.log("🔍 Delivery Time from vendor:", deliveryTime);

      // Get bid_items from the selected vendor (same as AnalysisResultsView line 160)
      const bidItems = selectedVendor.bid_items || [];
      console.log("🔍 Bid items from selected vendor:", bidItems);

      if (bidItems.length === 0) {
        console.warn("⚠️ No bid items found for selected vendor");
        return;
      }

      // Filter to only selected items and map to PO form format
      const selectedBidItems = bidItems.filter((bidItem: any) =>
        selectedItemIds.includes(bidItem.id)
      );
      console.log("🔍 Filtered selected bid items:", selectedBidItems);

      if (selectedBidItems.length > 0) {
        // Get solicitation items to extract item details - use fullSolicitation data
        const solicitationItems = fullSolicitation?.data?.solicitation_items ||
                                 (typeof solicitation === 'object' ? (solicitation as any)?.solicitation_items : []) ||
                                 [];
        console.log("🔍 Solicitation items for reference:", solicitationItems);

        const mappedItems = selectedBidItems.map((bidItem: any) => {
          console.log("🔍 Processing bid item:", bidItem);

          const quantity = parseFloat(bidItem.solicitation_item_quantity || bidItem.quantity || 0);
          const unitPrice = parseFloat(bidItem.unit_price || 0);
          const total = parseFloat(bidItem.total_price || (quantity * unitPrice));

          // Get the solicitation item ID
          const solicitationItemId = bidItem.solicitation_item;
          console.log("🔍 Looking for solicitation item ID:", solicitationItemId);

          // Find matching solicitation item to get full item details
          const matchingSolicitationItem = solicitationItems.find((si: any) => si.id === solicitationItemId);
          console.log("🔍 Matching solicitation item:", matchingSolicitationItem);

          // Extract item details from solicitation item
          const itemName = matchingSolicitationItem?.item_detail?.name ||
                          matchingSolicitationItem?.item?.name ||
                          matchingSolicitationItem?.description ||
                          bidItem.item_name ||
                          "Item";

          const itemUom = matchingSolicitationItem?.item_detail?.uom ||
                         matchingSolicitationItem?.item?.uom ||
                         matchingSolicitationItem?.uom ||
                         bidItem.uom ||
                         "";

          // Get the actual item ID from the item structure
          const actualItemId = matchingSolicitationItem?.item ||
                              matchingSolicitationItem?.item_detail?.id ||
                              solicitationItemId;

          console.log("🔍 Extracted - Name:", itemName, "UOM:", itemUom, "Item ID:", actualItemId);

          return {
            description: actualItemId || "",
            name: itemName,
            quantity: quantity,
            unit_cost: unitPrice,
            total: total.toString(),
            fco_number: [],
            uom: itemUom,
            item_id: actualItemId,
          };
        });

        console.log("🔍 Mapped items for PO form:", mappedItems);

        // Use form.reset for non-array fields, then use replace for items
        // This ensures React Hook Form and useFieldArray are properly synchronized
        form.reset({
          ...form.getValues(),
          vendor: actualVendorId || "",
          purchase_request: purchaseRequestId || "",
          payment_terms: paymentTerms,
          delivery_lead_time: deliveryTime,
          items: [], // Clear items in form first
        });

        // Use replace to properly sync with useFieldArray
        replace(mappedItems);

        console.log("🔍 Form reset with items");
        console.log("🔍 Form values after reset:", form.getValues());
        console.log("🔍 Field array after replace:", fields);

        // Mark as populated to prevent re-running
        cbaItemsPopulated.current = true;
        console.log("✅ CBA items populated successfully");
      } else {
        console.warn("⚠️ No selected items found in bid items");
      }

      // Set CBA ID in form (if your schema supports it)
      setValue("cba" as any, cbaId);
    }
  }, [cbaData, submissionData, fullSolicitation, cbaId, vendorIdFromUrl, replace, setValue, form]);

  // Removed problematic useEffect that was setting items to empty fields on mount
  // Items are now properly managed through form.reset() in the CBA and PR useEffects

  // Debug: Log initial state and items/fields changes
  useEffect(() => {
    console.log("🔍 Component mounted/fields changed:");
    console.log("  - Fields array:", fields);
    console.log("  - Fields count:", fields.length);
    console.log("  - Form items:", form.getValues("items"));
    console.log("  - Form items count:", form.getValues("items")?.length || 0);
  }, [fields, form]);

  // Debug: Log items whenever form data changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "items" || name?.startsWith("items.")) {
        console.log("🔍 Form items changed via watch:");
        console.log("  - Items in form data:", value.items);
        console.log("  - Items count:", value.items?.length || 0);
        console.log("  - Fields count:", fields.length);
        console.log("  - First item (form):", value.items?.[0]);
        console.log("  - First field:", fields[0]);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, fields]);

  // Auto-infer transaction_type from selected items' categories
  useEffect(() => {
    const currentItems = watch("items");
    if (!currentItems || currentItems.length === 0 || !item?.data?.results) {
      return;
    }

    // Extract transaction types from all items
    const transactionTypes: string[] = [];
    for (const formItem of currentItems) {
      const itemId = formItem.item_id || formItem.description;
      if (!itemId) continue;

      // Find the item details
      const itemDetails = item.data.results.find((i: any) => i.id === itemId);
      if (!itemDetails?.category?.default_transaction_type) continue;

      transactionTypes.push(itemDetails.category.default_transaction_type);
    }

    if (transactionTypes.length === 0) {
      return; // No items with categories, keep current value
    }

    // Find the most common transaction type
    const typeCounts = transactionTypes.reduce((acc: Record<string, number>, type: string) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const mostCommonType = Object.entries(typeCounts).reduce((max, [type, count]) => {
      return count > max.count ? { type, count } : max;
    }, { type: "SUPPLIES", count: 0 }).type;

    // Only auto-set if different from current value
    const currentTransactionType = watch("transaction_type");
    if (mostCommonType !== currentTransactionType) {
      console.log(`🔍 Auto-inferring transaction_type: ${mostCommonType} (from ${transactionTypes.length} items)`);
      setValue("transaction_type", mostCommonType as any);
    }
  }, [watch("items"), item, setValue]);

  const onSubmit = async (data: z.infer<typeof PurchaseOrderListSchema>) => {
    console.log("📝 Form submission started");
    console.log("📝 Form submission data:", data);
    console.log("📝 Form errors:", form.formState.errors);

    // Check required fields
    console.log("📝 Validation check:");
    console.log("  - purchase_request:", data?.purchase_request ? "✅" : "❌ MISSING");
    console.log("  - vendor (from data):", data?.vendor ? "✅" : "❌ MISSING");
    console.log("  - vendor (from state):", vendorValue ? "✅" : "❌ MISSING");
    console.log("  - items:", data?.items?.length > 0 ? `✅ (${data.items.length} items)` : "❌ MISSING OR EMPTY");
    console.log("  - items detail:", data?.items);

    // Validate items exist
    if (!data?.items || data.items.length === 0) {
      console.error("❌ Cannot submit: No items in the purchase order");
      return;
    }

    // Transform data to match PurchaseOrderSchema format
    const formData = {
      purchase_request: data?.purchase_request,
      vendor: data?.vendor || vendorValue, // Prefer form data, fallback to state
      transaction_type: data?.transaction_type || "SUPPLIES", // Default to SUPPLIES if not provided
      ...(cbaId && { cba: cbaId }), // Include CBA ID if creating from CBA
      ...(solicitationId && { solicitation: String(solicitationId) }), // Include Solicitation ID for RFQ link
      // Approval workflow fields - include if provided (for standalone PO creation)
      ...(data?.reviewed_by && { reviewed_by: data.reviewed_by }),
      ...(data?.authorized_by && { authorized_by: data.authorized_by }),
      ...(data?.approved_by && { approved_by: data.approved_by }),
      // Vendor representative name (not a user, just text)
      ...((data as any)?.vendor_representative_name && { vendor_representative_name: (data as any).vendor_representative_name }),
      // Payment and delivery
      ...(data?.payment_terms && { payment_terms: data.payment_terms }),
      ...(data?.delivery_lead_time && { delivery_lead_time: data.delivery_lead_time }),
      ...(data?.delivery_location && { location: data.delivery_location }), // Include delivery location
      purchase_order_items: data?.items.map((item) => {
        const unitPrice = parseFloat(String(item?.unit_cost || 0));
        const quantity = parseFloat(String(item?.quantity || 0));
        const totalPrice = unitPrice * quantity;

        return {
          item: item?.item_id || "",  // The actual item UUID (backend expects 'item' not 'item_id')
          description: item?.description || item?.name || "",  // Item description/name
          uom: item?.uom || "",  // Unit of measurement
          fco_number: item?.fco_number?.[0] || "",  // FCO number
          unit_price: unitPrice,
          quantity: quantity,
          total_price: totalPrice,
        };
      }),
    };

    console.log("📤 Sending form data:", formData);
    console.log("📤 NOTE: Approval workflow fields NOT included - PO will be created with status PENDING");

    try {
      const res = await createPurchcaseOrderMutation(formData);
      console.log("✅ API Response:", res);

      if (res?.data || res?.status === "success") {
        router.push(RouteEnum.PURCHASE_ORDER);
      }
    } catch (error) {
      console.error("❌ Form submission error:", error);
    }
  };

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Purchase Order", icon: true },
    { name: "Create", icon: false },
  ];

  return (
    <div className="space-y-5">
      <BreadcrumbCard list={breadcrumbs} />

      <GoBack />

      <p className="text-[24px] font-semibold">Purchase Order Form</p>

      {cbaId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                Creating PO from CBA
              </h3>
              <p className="text-sm text-blue-800">
                The Vendor, Purchase Request, and Department fields have been automatically populated from the Competitive Bid Analysis.
                Payment Terms and Delivery Lead Time have been pre-filled from the vendor's bid submission.
              </p>
            </div>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit, (errors) => {
          console.error("❌ Form validation failed:", errors);
          console.error("❌ Form values:", form.getValues());
          // Show validation errors to user
          Object.keys(errors).forEach(key => {
            const error = errors[key as keyof typeof errors];
            if (error && 'message' in error) {
              console.error(`  - ${key}: ${error.message}`);
            }
            // Handle array field errors (like items)
            if (Array.isArray(error)) {
              console.error(`  - ${key} (array field) has ${error.length} items with errors:`);
              error.forEach((itemError: any, index: number) => {
                if (itemError) {
                  console.error(`    Item ${index}:`, itemError);
                  Object.keys(itemError || {}).forEach(fieldKey => {
                    const fieldError = itemError[fieldKey];
                    if (fieldError && 'message' in fieldError) {
                      console.error(`      - ${fieldKey}: ${fieldError.message}`);
                    }
                  });
                }
              });
            }
          });
        })} className="space-y-5">
          {/* Display validation errors at the top */}
          {Object.keys(form.formState.errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-red-900 mb-2">
                Please fix the following errors:
              </h3>
              <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
                {Object.entries(form.formState.errors).map(([key, error]) => {
                  const errorMessage = error?.message?.toString() || 'Invalid value';
                  const fieldName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                  return (
                    <li key={key}>
                      <strong>{fieldName}:</strong>{' '}
                      {errorMessage}
                      {key === 'items' && (
                        <span className="block ml-5 mt-1 text-xs">
                          Hint: Click "Add More" button below the table to add at least one item, or select a Purchase Request to auto-populate items.
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-2 pt-5 gap-5">
            <FormField
              control={form.control}
              name="vendor"
              render={({ field }) => (
                <FormItem>
                  <Label className="font-semibold">
                    Vendor <span className="text-red-500">*</span>
                  </Label>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen} modal={!cbaId}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className={cn(
                        "w-full justify-between",
                        cbaId && "bg-gray-100 cursor-not-allowed"
                      )}
                      disabled={!!cbaId}
                    >
                      {vendorValue
                        ? vendors?.data?.results?.find(
                            (vendor) => vendor?.id === vendorValue
                          )?.company_name
                        : "Select vendor..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  {!cbaId && (
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search vendor..." />
                        <CommandEmpty>No Vendor found.</CommandEmpty>
                        <CommandGroup>
                          {vendorsIsLoading && <LoadingSpinner />}
                          {vendors?.data?.results?.map((vendor) => (
                            <CommandItem
                              key={vendor?.id}
                              value={vendor?.company_name}
                              onSelect={(currentValue) => {
                                const selectedVendor = vendors?.data?.results?.find(
                                  (v) => v.company_name.toLowerCase() === currentValue.toLowerCase()
                                );
                                if (selectedVendor) {
                                  setVendorValue(selectedVendor.id);
                                  field.onChange(selectedVendor.id);
                                  setOpen(false);
                                }
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  vendorValue === vendor?.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {vendor?.company_name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  )}
                </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purchase_request"
              render={({ field }) => (
                <FormItem>
                  <Label className="font-semibold">
                    Purchase Request
                    {!cbaId && <span className="text-red-500">*</span>}
                  </Label>
                  <FormControl>
                    <Popover open={opensPurchase} onOpenChange={setOpensPurchase} modal={!cbaId}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={opensPurchase}
                      className={cn(
                        "w-full justify-between",
                        cbaId && "bg-gray-100 cursor-not-allowed"
                      )}
                      disabled={!!cbaId}
                    >
                      {purchaseValue
                        ? requests?.data?.results?.find(
                            (vendor) => vendor?.id === purchaseValue
                          )?.ref_number
                        : "Select purchase request..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  {!cbaId && (
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search purchase request..." />
                        <CommandEmpty>No Purchase Request found.</CommandEmpty>
                        <CommandGroup>
                          {requestsIsLoading && <LoadingSpinner />}
                          {requests?.data?.results?.map((request) => {
                            return (
                              <CommandItem
                                key={request?.id}
                                value={request?.ref_number}
                                onSelect={(currentValue) => {
                                  const selectedRequest = requests?.data?.results?.find(
                                    (r) => r.ref_number.toLowerCase() === currentValue.toLowerCase()
                                  );
                                  if (selectedRequest) {
                                    setPurchaseValue(selectedRequest.id);
                                    field.onChange(selectedRequest.id);
                                    setOpensPurchase(false);
                                  }
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    purchaseValue === request?.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {request?.ref_number}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  )}
                </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Label className="font-semibold">
                Requesting Unit/Dept
                <span className="text-red-500">*</span>
              </Label>
              <div>
                <Popover open={opens} onOpenChange={setOpens} modal={!cbaId}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={opens}
                      className={cn(
                        "w-full justify-between",
                        cbaId && "bg-gray-100 cursor-not-allowed"
                      )}
                      disabled={!!cbaId}
                    >
                      {requestValue
                        ? departments?.data?.results?.find(
                            (vendor) => vendor?.id === requestValue
                          )?.name
                        : "Select department..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  {!cbaId && (
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search department..." />
                        <CommandEmpty>No Department found.</CommandEmpty>
                        <CommandGroup>
                          {departmentsIsLoading && <LoadingSpinner />}
                          {departments?.data?.results?.map((department) => {
                            return (
                              <CommandItem
                                key={department?.id}
                                value={department?.name}
                                onSelect={(currentValue) => {
                                  const selectedDept = departments?.data?.results?.find(
                                    (d) => d.name.toLowerCase() === currentValue.toLowerCase()
                                  );
                                  if (selectedDept) {
                                    setRequestValue(selectedDept.id);
                                    setOpens(false);
                                  }
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    requestValue === department?.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {department?.name}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  )}
                </Popover>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 pt-5 gap-5">
            <FormInput name="payment_terms" label="Payment Terms" />
            <div>
              <Label className="font-semibold">
                Delivery Address
              </Label>
              <div>
                <Popover open={openDelivery} onOpenChange={setOpenDelivery}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openDelivery}
                      className="w-full justify-between"
                    >
                      {deliveryValue
                        ? locations?.data?.results?.find(
                            (location: any) => location?.id === deliveryValue
                          )?.name
                        : "Select delivery location..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search location..." />
                      <CommandEmpty>No location found.</CommandEmpty>
                      <CommandGroup>
                        {locationsIsLoading && <LoadingSpinner />}
                        {locations?.data?.results?.map((location: any) => (
                          <CommandItem
                            key={location?.id}
                            value={location?.name}
                            onSelect={(currentValue) => {
                              const selectedLocation = locations?.data?.results?.find(
                                (l: any) => l.name.toLowerCase() === currentValue.toLowerCase()
                              );
                              if (selectedLocation) {
                                setDeliveryValue(selectedLocation.id);
                                setValue("delivery_location", selectedLocation.id);
                                setOpenDelivery(false);
                              }
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                deliveryValue === location?.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {location?.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 pt-5 gap-5">
            <FormInput name="delivery_lead_time" label="Delivery Lead Time" />
            <div>
              <FormSelect
                name="transaction_type"
                label="Transaction Type"
                required
                options={[
                  { label: "Supply of Goods (WHT 2%)", value: "SUPPLIES" },
                  { label: "Professional Services (WHT 5%)", value: "PROFESSIONAL_SERVICES" },
                  { label: "Other Services/Rent/Contracts (WHT 10%)", value: "SERVICES" },
                  { label: "Dividends (WHT 10%)", value: "DIVIDENDS" },
                ]}
              />
              {watch("items") && watch("items").length > 0 && (
                <p className="text-xs text-gray-600 mt-1.5 flex items-start gap-1.5">
                  <svg className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>
                    Auto-selected based on item categories. You can change this if needed.
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="mt-10">
            <div>
              <p className="font-semibold">Items Quotation</p>
              <p className="text-xs font-light ">
                Please provide your quotation for the following Items
              </p>
            </div>
          </div>
          <table className="w-full border mt-10">
            <thead>
              <tr className="text-amber-500 whitespace-nowrap border-b-2 text-xs font-semibold">
                <th className="px-2 py-5">S/N</th>
                <th className="px-2 py-5">
                  DESCRIPTION OF GOODS, WORKS OR SERVICES
                </th>
                <th className="px-2 py-5">Qty</th>
                <th className="px-2 py-5">UOM</th>
                <th className="px-2 py-5">FCO/BL</th>
                <th className="px-2 py-5"> Unit price</th>
                <th className="px-2 py-5">Total</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => {
                if (index === 0) {
                  console.log("🔍 Rendering table with fields.length:", fields.length);
                  console.log("🔍 Fields array:", fields);
                }
                console.log(`🔍 Rendering row ${index} for field:`, field);
                return (
                  <tr key={index} className="w-full">
                    <td className="w-fit p-2 text-center ">
                      <span className="p-2 px-4 text-xs bg-black text-white rounded">
                        {index + 1}.
                      </span>
                    </td>
                    <td className="w-fit p-2 text-center">
                      {/* Show item name if from CBA or PR with existing items, otherwise show dropdown */}
                      {(cbaId && field.name) || (!cbaId && data && data?.length > index) ? (
                        <FormInput
                          name={`items.${index}.name`}
                          disabled={!!cbaId}
                          className={cbaId ? "bg-gray-100" : ""}
                        />
                      ) : (
                        <FormSelect
                          name={`items.${index}.description`}
                          options={itemOptions}
                          value={form.watch(`items.${index}.description`)}
                          disabled={false}
                          onChange={(e) => {
                            const selectedItemId = e.target.value;
                            console.log("🔍 Selected item ID:", selectedItemId);

                            // Find the selected item from the items list
                            const selectedItem = item?.data?.results?.find(
                              (itm: any) => itm.id === selectedItemId
                            );

                            console.log("🔍 Selected item details:", selectedItem);

                            if (selectedItem) {
                              // Update the UOM field with the item's unit (ItemData uses 'unit' not 'uom')
                              setValue(`items.${index}.uom` as any, selectedItem.unit || "");
                              console.log("🔍 Set UOM to:", selectedItem.unit);

                              // Also update the description field
                              setValue(`items.${index}.description` as any, selectedItemId);

                              // Trigger validation
                              trigger(`items.${index}.uom`);
                            }
                          }}
                        />
                      )}
                    </td>
                    <td className="w-fit p-2 text-center">
                      <FormInput
                        label=""
                        name={`items.${index}.quantity`}
                        type="number"
                        className="w-24"
                        onChange={(e) => {
                          const quantity = parseFloat(e.target.value) || 0;
                          const unitCost = parseFloat(String(watch(`items.${index}.unit_cost`) || "0")) || 0;
                          const total = quantity * unitCost;
                          setValue(`items.${index}.total` as any, total.toString());
                          // Force re-render of form
                          trigger(`items.${index}.total`);
                        }}
                      />
                    </td>
                    <td className="w-fit p-2 text-center">
                      <FormInput
                        label=""
                        name={`items.${index}.uom`}
                        disabled
                        className="w-24 bg-gray-100"
                      />
                    </td>
                    <td className="w-fit p-2 text-center ">
                      {/* <FormInput label='' name={`items.[${index}].f */}
                      <FormField
                        control={form.control}
                        name={`items.${index}.fco_number`}
                        render={({ field }) => (
                          <FormItem className=" mt-2">
                            <FormControl>
                              <MultiSelectFormField
                                options={(() => {
                                  // Based on your FCO API structure: { data: { data: { results: [...] } } }
                                  let fcoData: any[] = [];

                                  if ((fco?.data as any)?.data?.results) {
                                    // Your FCO API structure: { data: { data: { results: [...] } } }
                                    fcoData = (fco.data as any).data.results;
                                    console.log("🔍 Found FCO data in fco.data.data.results:", fcoData);
                                  } else if (fco?.data?.results) {
                                    // Standard paginated response: { data: { results: [...] } }
                                    fcoData = fco.data.results;
                                    console.log("🔍 Found FCO data in fco.data.results:", fcoData);
                                  } else if (Array.isArray((fco?.data as any)?.data)) {
                                    // Direct array in nested data: { data: { data: [...] } }
                                    fcoData = (fco.data as any).data;
                                    console.log("🔍 Found FCO data in fco.data.data:", fcoData);
                                  } else if (Array.isArray(fco?.data)) {
                                    // Direct array: { data: [...] }
                                    fcoData = fco.data as any;
                                    console.log("🔍 Found FCO data in fco.data:", fcoData);
                                  } else {
                                    console.log("🔍 No FCO data found in any expected location");
                                    console.log("🔍 Full FCO structure for debugging:", fco?.data);
                                  }

                                  console.log("🔍 Final FCO data being used for options:", fcoData);

                                  return fcoData.map((item: any) => ({
                                    id: item.id,
                                    name: item.code || item.name || item.id
                                  }));
                                })()}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}
                                placeholder="Select"
                                variant="inverted"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </td>
                    <td className="w-fit p-2 text-center">
                      <FormInput
                        label=""
                        type="number"
                        name={`items.${index}.unit_cost`}
                        className="w-24"
                        onChange={(e) => {
                          const unitCost = parseFloat(e.target.value) || 0;
                          const quantity = parseFloat(String(watch(`items.${index}.quantity`) || "0")) || 0;
                          const total = unitCost * quantity;
                          setValue(`items.${index}.total` as any, total.toString());
                          // Force re-render of form
                          trigger(`items.${index}.total`);
                        }}
                      />
                    </td>
                    <td className="w-fit p-2 text-center">
                      <FormInput
                        label=""
                        name={`items.${index}.total`}
                        disabled
                        className="bg-gray-100"
                      />
                    </td>
                    <td className="flex items-center justify-center py-5">
                      <Button variant="ghost" size="icon">
                        <MinusCircle
                          onClick={() => remove(index)}
                          className="cursor-pointer text-primary"
                        />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* Add More Button */}
          <div className="flex justify-end mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  description: "",
                  item_id: "",
                  quantity: "",
                  total: "",
                  unit_cost: "",
                  uom: "",
                  name: "",
                  fco_number: [],
                })
              }
              className="bg-alternate border border-primary text-primary"
            >
              <PlusCircle className="mr-1" />
              Add More
            </Button>
          </div>

          {/* Approval Workflow Section - Only shown for standalone PO creation */}
          {!cbaId && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Approval Workflow</h3>
            <div className="grid grid-cols-3 gap-5">
              <FormField
                control={form.control}
                name="reviewed_by"
                render={({ field }) => (
                  <FormItem>
                    <Label>Reviewer *</Label>
                    <Popover open={openReviewer} onOpenChange={setOpenReviewer}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openReviewer}
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? (() => {
                                  const user = ((users as any)?.data?.results || (users as any)?.results)?.find(
                                    (user: any) => user.id === field.value
                                  );
                                  return user
                                    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || "Unknown User"
                                    : "Unknown User";
                                })()
                              : "Select Reviewer"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search users..." />
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup>
                            {usersIsLoading && <LoadingSpinner />}
                            {!usersIsLoading && !((users as any)?.data?.results || (users as any)?.results) && (
                              <div className="p-2 text-sm text-gray-500">No users available</div>
                            )}
                            {!usersIsLoading &&
                              ((users as any)?.data?.results || (users as any)?.results)
                                ?.filter((user: any) =>
                                  user &&
                                  user.id &&
                                  (user.first_name || user.last_name) &&
                                  user.user_type === "AHNI_STAFF"
                                )
                                ?.map((user: any) => {
                                const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
                                return (
                                  <CommandItem
                                    value={fullName}
                                    key={user.id}
                                    onSelect={() => {
                                      field.onChange(user.id);
                                      setOpenReviewer(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        user.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {fullName || "Unknown User"}
                                  </CommandItem>
                                );
                              })}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="authorized_by"
                render={({ field }) => (
                  <FormItem>
                    <Label>Director of Finance (Authorizer) *</Label>
                    <Popover open={openAuthorizer} onOpenChange={setOpenAuthorizer}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openAuthorizer}
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? (() => {
                                  const user = ((users as any)?.data?.results || (users as any)?.results)?.find(
                                    (user: any) => user.id === field.value
                                  );
                                  return user
                                    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || "Unknown User"
                                    : "Unknown User";
                                })()
                              : "Select Director of Finance"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search users..." />
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup>
                            {usersIsLoading && <LoadingSpinner />}
                            {!usersIsLoading && !((users as any)?.data?.results || (users as any)?.results) && (
                              <div className="p-2 text-sm text-gray-500">No users available</div>
                            )}
                            {!usersIsLoading &&
                              ((users as any)?.data?.results || (users as any)?.results)
                                ?.filter((user: any) =>
                                  user &&
                                  user.id &&
                                  (user.first_name || user.last_name) &&
                                  user.user_type === "AHNI_STAFF"
                                )
                                ?.map((user: any) => {
                                const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
                                return (
                                  <CommandItem
                                    value={fullName}
                                    key={user.id}
                                    onSelect={() => {
                                      field.onChange(user.id);
                                      setOpenAuthorizer(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        user.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {fullName || "Unknown User"}
                                  </CommandItem>
                                );
                              })}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="approved_by"
                render={({ field }) => (
                  <FormItem>
                    <Label>Director of Operations (Approver) *</Label>
                    <Popover open={openApprover} onOpenChange={setOpenApprover}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openApprover}
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? (() => {
                                  const user = ((users as any)?.data?.results || (users as any)?.results)?.find(
                                    (user: any) => user.id === field.value
                                  );
                                  return user
                                    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || "Unknown User"
                                    : "Unknown User";
                                })()
                              : "Select Director of Operations"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search users..." />
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup>
                            {usersIsLoading && <LoadingSpinner />}
                            {!usersIsLoading && !((users as any)?.data?.results || (users as any)?.results) && (
                              <div className="p-2 text-sm text-gray-500">No users available</div>
                            )}
                            {!usersIsLoading &&
                              ((users as any)?.data?.results || (users as any)?.results)
                                ?.filter((user: any) =>
                                  user &&
                                  user.id &&
                                  (user.first_name || user.last_name) &&
                                  user.user_type === "AHNI_STAFF"
                                )
                                ?.map((user: any) => {
                                const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
                                return (
                                  <CommandItem
                                    value={fullName}
                                    key={user.id}
                                    onSelect={() => {
                                      field.onChange(user.id);
                                      setOpenApprover(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        user.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {fullName || "Unknown User"}
                                  </CommandItem>
                                );
                              })}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-5 mt-4">
              <div>
                <Label>Vendor Representative Name (Optional)</Label>
                <FormInput
                  name="vendor_representative_name"
                  placeholder={vendorValue
                    ? "Enter representative name (e.g., MD, CEO, Contact Person)"
                    : "Select a vendor first"}
                  disabled={!vendorValue}
                />
                {vendorValue && (
                  <p className="text-xs text-gray-500 mt-1">
                    Hint: Enter the name of the vendor's MD, CEO, or authorized representative
                  </p>
                )}
              </div>
            </div>
          </div>
          )}

          <div className="flex items-center justify-end mt-6 gap-4">
            <FormButton
              loading={creatingOrder}
              disabled={creatingOrder}
              type="submit"
              className="flex items-center justify-center gap-2"
            >
              Submit
              <LongArrowRight />
            </FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PurchaseOrderNew;
