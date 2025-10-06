"use client";

import GoBack from "components/GoBack";
import { Label } from "components/ui/label";
import { Check, ChevronsUpDown, MinusCircle, PlusCircle } from "lucide-react";
import { cn } from "lib/utils";
import { Button } from "components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { useEffect, useMemo, useState, useRef } from "react";
import { useGetVendors } from "@/features/procurement/controllers/vendorController";
import {
  useGetPurchaseRequests,
  useGetPurchaseRequest,
} from "@/features/procurement/controllers/purchaseRequestController";
import { LoadingSpinner } from "components/Loading";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { PurchaseOrderListSchema } from "@/features/procurement/types/procurement-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "components/atoms/FormInput";
import { Form, FormControl, FormField, FormItem } from "components/ui/form";
import FormButton from "@/components/FormButton";
import LongArrowRight from "components/icons/LongArrowRight";
import BreadcrumbCard from "components/Breadcrumb";
import { useGetAllDepartments } from "@/features/modules/controllers/config/departmentController";
// import { toast } from "sonner";
import { useCreatePurchaseOrder } from "@/features/procurement/controllers/purchaseOrderController";
import { RouteEnum } from "constants/RouterConstants";
// import { useGetAllGrades } from "@/features/modules/controllers/config/gradeController";
import MultiSelectFormField from "components/ui/multiselect";
import FormSelect from "components/atoms/FormSelect";
import { useGetAllItems } from "@/features/modules/controllers/config/itemController";
import { useGetAllFCONumbersQuery } from "@/features/modules/controllers";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import CbaAPI from "@/features/procurement/controllers/cbaController";
import { useGetSolicitationSubmission } from "@/features/procurement/controllers/vendorBidSubmissionsController";

const PurchaseOrderNew = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cbaId = searchParams?.get('cba');
  const vendorIdFromUrl = searchParams?.get('vendor');

  const [open, setOpen] = useState(false);
  const [opens, setOpens] = useState(false);
  const [opensPurchase, setOpensPurchase] = useState(false);
  const [vendorValue, setVendorValue] = useState(vendorIdFromUrl || "");
  const [requestValue, setRequestValue] = useState("");
  const [purchaseValue, setPurchaseValue] = useState("");

  // Track if CBA items have been populated to prevent double-appending
  const cbaItemsPopulated = useRef(false);

  // Fetch CBA data if coming from CBA flow
  const { data: cbaData } = CbaAPI.useGetSingleCba(cbaId || "", !!cbaId);

  // Fetch bid submissions to get vendor bid_items (same as AnalysisResultsView)
  const solicitationId = cbaData?.data?.solicitation?.id;
  const { data: submissionData } = useGetSolicitationSubmission(
    solicitationId || "",
    !!solicitationId
  );


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

  // Get users for approver selection
  const { data: users, isLoading: usersIsLoading } = useGetAllUsers({
    page: 1,
    size: 2000000,
  });

  // Debug users data to see the structure
  console.log('🔍 Users data:', users);
  console.log('🔍 First user:', users?.results?.[0]);

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
      items: []
    },
  });

  const { setValue, control, handleSubmit, watch, trigger } = form;

  const data = useMemo(() => {
    const items = requestsDetails?.data?.items || requestsDetails?.items;
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

      const mappedItem = {
        item_id: data?.item || data?.item_detail?.id || "",
        fco: extractFCO(),
        quantity: data?.quantity || 0,
        unit_cost: data?.unit_cost || 0,
        description: extractDescription(),
        uom: extractUOM(),
        total: (data?.sub_total_amount || data?.total || 0).toString(),
        fco_number: extractFCO() ? [extractFCO()] : [], // Initialize with existing FCO if available
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
      console.log("🔄 Setting form items:", data);
      console.log("🔄 First item UOM:", data[0]?.uom);
      console.log("🔄 First item structure:", data[0]);

      // Use form.reset to properly update all form fields
      form.reset({
        ...form.getValues(),
        items: data,
        purchase_request: purchaseValue || ""
      });

      // Force update all UOM and total fields after reset
      setTimeout(() => {
        data.forEach((_, index) => {
          trigger(`items.${index}.uom`);
          trigger(`items.${index}.total`);
        });
      }, 100);
    }
  }, [data, form, purchaseValue, trigger]);

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

      // Set department from purchase request
      if (prData.requesting_department) {
        console.log("🔍 Setting department:", prData.requesting_department);
        setRequestValue(prData.requesting_department);
      }

      // Note: payment_terms and delivery_lead_time don't exist in PurchaseRequestResultsData
      // These fields should be manually entered by the user
    }
  }, [requestsDetails]);

  const { fields, remove, append } = useFieldArray({
    control,
    name: "items",
  });

  // Auto-populate form from CBA data (same logic as AnalysisResultsView)
  useEffect(() => {
    console.log("🔍 CBA Auto-populate useEffect triggered");
    console.log("🔍 Has cbaData:", !!cbaData?.data);
    console.log("🔍 Has submissionData:", !!submissionData);
    console.log("🔍 Has cbaId:", !!cbaId);
    console.log("🔍 Already populated:", cbaItemsPopulated.current);

    if (cbaData?.data && submissionData && cbaId && !cbaItemsPopulated.current) {
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
        const mappedItems = selectedBidItems.map((bidItem: any) => {
          console.log("🔍 Processing bid item:", bidItem);

          const quantity = parseFloat(bidItem.solicitation_item_quantity || 0);
          const unitPrice = parseFloat(bidItem.unit_price || 0);
          const total = parseFloat(bidItem.total_price || (quantity * unitPrice));

          // Get the actual item ID from solicitation_item or fallback to id
          const itemId = bidItem.solicitation_item || bidItem.id;

          return {
            description: itemId || "",
            quantity: quantity,
            unit_cost: unitPrice,
            total: total,
            fco_number: [],
            uom: "", // UOM will be populated from item details if needed
          };
        });

        console.log("🔍 Mapped items for PO form:", mappedItems);

        // Use form.reset to populate items and vendor
        // This ensures React Hook Form properly registers the fields
        form.reset({
          ...form.getValues(),
          vendor: actualVendorId || "",
          items: mappedItems,
        });

        console.log("🔍 Form reset with items");
        console.log("🔍 Form values after reset:", form.getValues());

        // Mark as populated to prevent re-running
        cbaItemsPopulated.current = true;
        console.log("✅ CBA items populated successfully");
      } else {
        console.warn("⚠️ No selected items found in bid items");
      }

      // Set CBA ID in form (if your schema supports it)
      setValue("cba" as any, cbaId);
    }
  }, [cbaData, submissionData, cbaId, vendorIdFromUrl, append, setValue]);

  useEffect(() => {
    setValue("items", fields);
  }, []);

  const onSubmit = async (data: z.infer<typeof PurchaseOrderListSchema>) => {
    console.log("📝 Form submission data:", data);

    // Transform data to match PurchaseOrderSchema format
    const formData = {
      purchase_request: data?.purchase_request,
      vendor: vendorValue,
      ...(cbaId && { cba: cbaId }), // Include CBA ID if creating from CBA
      items: data?.items.map((item) => ({
        item_id: item?.description || "",
        fco: item?.fco_number?.[0] || "",
        unit_cost: item?.unit_cost || 0,
        quantity: item?.quantity || 0,
      })),
    };

    console.log("📤 Sending form data:", formData);

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

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 pt-5 gap-5">
            <div>
              <Label className="font-semibold">
                Vendor <span className="text-red-500">*</span>
              </Label>
              <div>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {vendorValue
                        ? vendors?.data?.results?.find(
                            (vendor) => vendor?.id === vendorValue
                          )?.company_name
                        : "Select vendor..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search vendor..." />
                      <CommandEmpty>No Vendor found.</CommandEmpty>
                      <CommandGroup>
                        {vendorsIsLoading && <LoadingSpinner />}
                        {vendors?.data?.results?.map((vendor) => (
                          <CommandItem
                            key={vendor?.id}
                            value={vendor?.id}
                            onSelect={(currentValue) => {
                              setVendorValue(currentValue);
                              setOpen(false);
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
                </Popover>
              </div>
            </div>
            <div>
              <Label className="font-semibold">
                Purchase Request
                <span className="text-red-500">*</span>
              </Label>
              <div>
                <Popover open={opensPurchase} onOpenChange={setOpensPurchase}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={opensPurchase}
                      className="w-full justify-between"
                    >
                      {purchaseValue
                        ? requests?.data?.results?.find(
                            (vendor) => vendor?.id === purchaseValue
                          )?.ref_number
                        : "Select vendor..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search vendor..." />
                      <CommandEmpty>No Vendor found.</CommandEmpty>
                      <CommandGroup>
                        {requestsIsLoading && <LoadingSpinner />}
                        {requests?.data?.results?.map((request) => {
                          return (
                            <CommandItem
                              key={request?.id}
                              value={request?.id}
                              onSelect={(currentValue) => {
                                setPurchaseValue(currentValue);
                                setOpensPurchase(false);
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
                </Popover>
              </div>
            </div>
            <div>
              <Label className="font-semibold">
                Requesting Unit/Dept
                <span className="text-red-500">*</span>
              </Label>
              <div>
                <Popover open={opens} onOpenChange={setOpens}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={opens}
                      className="w-full justify-between"
                    >
                      {requestValue
                        ? departments?.data?.results?.find(
                            (vendor) => vendor?.id === requestValue
                          )?.name
                        : "Select vendor..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search vendor..." />
                      <CommandEmpty>No Vendor found.</CommandEmpty>
                      <CommandGroup>
                        {departmentsIsLoading && <LoadingSpinner />}
                        {departments?.data?.results?.map((request) => {
                          return (
                            <CommandItem
                              key={request?.id}
                              value={request?.id}
                              onSelect={(currentValue) => {
                                setRequestValue(currentValue);
                                setOpens(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  requestValue === request?.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {request?.name}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 pt-5 gap-5">
            <FormInput name="payment_terms" label="Payment Terms" />
            <FormInput name="delivery_lead_time" label="Delivery" />
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
              {console.log("🔍 Rendering table with fields.length:", fields.length)}
              {console.log("🔍 Fields array:", fields)}
              {fields.map((field, index) => {
                console.log(`🔍 Rendering row ${index} for field:`, field);
                return (
                  <tr key={index} className="w-full">
                    <td className="w-fit p-2 text-center ">
                      <span className="p-2 px-4 text-xs bg-black text-white rounded">
                        {index + 1}.
                      </span>
                    </td>
                    <td className="w-fit p-2 text-center">
                      {/* <FormInput
                        placeholder='Enter Description'
                        name={`items.[${index}].description`}
                      /> */}
                      {!data || data?.length < index + 1 ? (
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
                              setValue(`items.${index}.uom`, selectedItem.unit || "");
                              console.log("🔍 Set UOM to:", selectedItem.unit);

                              // Also update the description field
                              setValue(`items.${index}.description`, selectedItemId);

                              // Trigger validation
                              trigger(`items.${index}.uom`);
                            }
                          }}
                        />
                      ) : (
                        <FormInput name={`items.${index}.name`} />
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
                          setValue(`items.${index}.total`, total.toString());
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
                                  let fcoData = [];

                                  if (fco?.data?.data?.results) {
                                    // Your FCO API structure: { data: { data: { results: [...] } } }
                                    fcoData = fco.data.data.results;
                                    console.log("🔍 Found FCO data in fco.data.data.results:", fcoData);
                                  } else if (fco?.data?.results) {
                                    // Standard paginated response: { data: { results: [...] } }
                                    fcoData = fco.data.results;
                                    console.log("🔍 Found FCO data in fco.data.results:", fcoData);
                                  } else if (Array.isArray(fco?.data?.data)) {
                                    // Direct array in nested data: { data: { data: [...] } }
                                    fcoData = fco.data.data;
                                    console.log("🔍 Found FCO data in fco.data.data:", fcoData);
                                  } else if (Array.isArray(fco?.data)) {
                                    // Direct array: { data: [...] }
                                    fcoData = fco.data;
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
                          setValue(`items.${index}.total`, total.toString());
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
                  fco: "",
                  item_id: "",
                  quantity: "",
                  total: "",
                  unit_cost: "",
                  uom: "",
                })
              }
              className="bg-alternate border border-primary text-primary"
            >
              <PlusCircle className="mr-1" />
              Add More
            </Button>
          </div>

          {/* Approval Workflow Section */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Approval Workflow</h3>
            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="authorized_by"
                render={({ field }) => (
                  <FormItem>
                    <Label>Director of Finance (Authorizer) *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? String(users?.results?.find(
                                  (user) => user.id === field.value
                                )?.fullName || "Unknown User")
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
                            {!usersIsLoading &&
                              users?.results?.filter(user => user && user.id && user.fullName)?.map((user) => (
                                <CommandItem
                                  value={String(user.fullName || "")}
                                  key={user.id}
                                  onSelect={() => {
                                    field.onChange(user.id);
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
                                  {String(user.fullName || "Unknown User")}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="approved_by"
                render={({ field }) => (
                  <FormItem>
                    <Label>Director of Operations (Approver) *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? String(users?.results?.find(
                                  (user) => user.id === field.value
                                )?.fullName || "Unknown User")
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
                            {!usersIsLoading &&
                              users?.results?.filter(user => user && user.id && user.fullName)?.map((user) => (
                                <CommandItem
                                  value={String(user.fullName || "")}
                                  key={user.id}
                                  onSelect={() => {
                                    field.onChange(user.id);
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
                                  {String(user.fullName || "Unknown User")}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-5 mt-4">
              <FormField
                control={form.control}
                name="agreed_by"
                render={({ field }) => (
                  <FormItem>
                    <Label>Vendor Representative (Optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? String(users?.results?.find(
                                  (user) => user.id === field.value
                                )?.fullName || "Unknown User")
                              : "Select Vendor Representative"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search users..." />
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup>
                            {!usersIsLoading &&
                              users?.results?.filter(user => user && user.id && user.fullName)?.map((user) => (
                                <CommandItem
                                  value={String(user.fullName || "")}
                                  key={user.id}
                                  onSelect={() => {
                                    field.onChange(user.id);
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
                                  {String(user.fullName || "Unknown User")}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-end mt-6">
            {/* <Link href={generatePath(RouteEnum.PURCHASE_ORDER)}> */}
            <FormButton
              loading={creatingOrder}
              disabled={creatingOrder}
              type="submit"
              className="flex items-center justify-center gap-2"
            >
              Submit
              <LongArrowRight />
            </FormButton>
            {/* </Link> */}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PurchaseOrderNew;
