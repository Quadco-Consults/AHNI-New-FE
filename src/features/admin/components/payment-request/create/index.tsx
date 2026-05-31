"use client";

import Card from "@/components/Card";
import { CardContent } from "@/components/ui/card";
import PaymentRequestLayout from "./Layout";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFieldArray,
} from "react-hook-form";
import {
  PaymentRequestSchema,
  TPaymentRequestFormData,
} from "@/features/admin/types/payment-request";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/atoms/FormInput";
import FormSelect from "@/components/atoms/FormSelect";
import FormTextArea from "@/components/atoms/FormTextArea";
import FormButton from "@/components/FormButton";
import { useGetAllPurchaseOrdersQuery, useGetSinglePurchaseOrderQuery } from "@/features/procurement/controllers/purchaseOrderController";
import { useEffect, useMemo, useCallback, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGetAllUsersQuery } from "@/features/auth/controllers/userController";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminRoutes } from "@/constants/RouterConstants";
import { useGetSinglePaymentRequestQuery } from "@/features/admin/controllers/paymentRequestController";
import { useGetAllConsultancyApplicants } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { useGetAllFacilitatorApplicants } from "@/features/contracts-grants/controllers/facilitatorApplicantsController";
import { useGetVendor } from "@/features/procurement/controllers/vendorsController";
import { numberToWords } from "@/utils/numberToWords";
import { useGetAllAdhocApplicants } from "@/features/programs/controllers/adhocApplicantController";
import { useGetChartOfAccounts } from "@/features/finance/controllers/accountingController";
import {
  getReviewerOptions,
  getAuthorizerOptions,
  getApproverOptions
} from "@/utils/approvalFilters";
import { filterAhniStaffOnly } from "@/utils/userFilters";
import BulkUploadSection from "./BulkUploadSection";
import BackNavigation from "@/components/atoms/BackNavigation";

export default function CreatePaymentRequest() {
  // Payment mode state (single or bulk)
  const [paymentMode, setPaymentMode] = useState<"single" | "bulk">("single");

  const form = useForm<TPaymentRequestFormData>({
    resolver: zodResolver(PaymentRequestSchema),
    defaultValues: {
      payment_type: "OTHER",
      payment_date: "",
      payment_reason: "",
      purchase_order: "",
      reviewer: "",
      authorizer: "",
      approver: "",
      payment_items: [
        {
          payment_to: "",
          account_number: "",
          bank_name: "",
          amount_in_figures: "",
          amount_in_words: "",
          tax_identification_number: "",
          phone_number: "",
          email: "",
          address: "",
          expense_account: "",
          department: "",
          project: "",
          cost_center: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "payment_items",
  });

  const pathname = usePathname();

  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams?.get("id");

  const { data: purchaseOrder } = useGetAllPurchaseOrdersQuery({
    page: 1,
    size: 2000000,
    search: "",
  });

  const purchaseOrderOptions = useMemo(
    () =>
      purchaseOrder?.results?.map((orderItem: any) => ({
        label: orderItem.purchase_order_number,
        value: orderItem.id,
      })) || [],
    [purchaseOrder]
  );

  const { data: user } = useGetAllUsersQuery({
    page: 1,
    size: 2000000,
    search: "",
  });

  // Filter for AHNI staff only (exclude vendors, consultants, external users)
  const ahniStaff = useMemo(
    () => filterAhniStaffOnly(user?.data?.results || []),
    [user?.data?.results]
  );

  // Filtered options for approval workflow - only users with appropriate permissions
  const reviewerOptions = useMemo(
    () => getReviewerOptions(ahniStaff),
    [ahniStaff]
  );

  const authorizerOptions = useMemo(
    () => getAuthorizerOptions(ahniStaff),
    [ahniStaff]
  );

  const approverOptions = useMemo(
    () => getApproverOptions(ahniStaff),
    [ahniStaff]
  );

  const paymentType = form.watch("payment_type") || "";

  // Reset payment mode when payment type changes to non-bulk-eligible types
  useEffect(() => {
    if (paymentType !== "CONSULTANT" && paymentType !== "ADHOC_STAFF") {
      setPaymentMode("single");
    }
  }, [paymentType]);

  // Get hired consultants and facilitators from applicants (not job ads)
  const { data: consultants } = useGetAllConsultancyApplicants({
    page: 1,
    size: 1000,
    search: "",
    offer_accepted: true, // Only get applicants who accepted offers
    enabled: paymentType === "CONSULTANT",
  });

  const { data: facilitators } = useGetAllFacilitatorApplicants({
    page: 1,
    size: 1000,
    search: "",
    status: "APPROVED", // Backend uses APPROVED for selected/hired facilitators
    enabled: paymentType === "FACILITATOR",
  });

  // Get adhoc staff from adhoc database (APPROVED status + offer_accepted)
  const { data: adhocStaffData } = useGetAllAdhocApplicants({
    page: 1,
    size: 1000,
    search: "",
    status: "APPROVED", // Match adhoc database filter
    enabled: paymentType === "ADHOC_STAFF",
  });

  // Filter adhoc staff for those who accepted contracts (client-side filter like adhoc database)
  const adhocStaffFiltered = useMemo(() => {
    const allApplicants = adhocStaffData?.data?.results || [];
    return allApplicants.filter((applicant: any) =>
      applicant.status === "APPROVED" && applicant.offer_accepted === true
    );
  }, [adhocStaffData]);

  const consultantOptions = useMemo(
    () =>
      consultants?.data?.results?.map((item: any) => {
        // For existing consultants, show their name and position
        const name = item.consultant_name || `${item.first_name || ''} ${item.last_name || ''}`.trim() || item.name;
        const position = item.position || item.title || '';
        const label = position ? `${name} - ${position}` : name || `Consultant ${item.id}`;

        return {
          label,
          value: item.id,
          data: item, // Store full data for auto-population
        };
      }) || [],
    [consultants]
  );

  const facilitatorOptions = useMemo(
    () =>
      facilitators?.data?.results?.map((item: any) => {
        // For facilitators, show their name and position
        const name = item.facilitator_name || `${item.first_name || ''} ${item.last_name || ''}`.trim() || item.name;
        const position = item.position || item.title || '';
        const label = position ? `${name} - ${position}` : name || `Facilitator ${item.id}`;

        return {
          label,
          value: item.id,
          data: item, // Store full data for auto-population
        };
      }) || [],
    [facilitators]
  );

  const adhocOptions = useMemo(
    () => {
      // Use filtered adhoc staff (APPROVED + offer_accepted)
      const adhocStaff = adhocStaffFiltered;

      if (!adhocStaff || adhocStaff.length === 0) {
        return [];
      }

      if (paymentType === "ADHOC_STAFF") {
        console.log("Adhoc staff from database:", adhocStaff.length);
      }

      const options = adhocStaff.map((staff: any) => ({
        label: `${staff.full_name || `${staff.surname || ''} ${staff.other_names || ''}`.trim()}${staff.application_number ? ` (${staff.application_number})` : ''}${staff.designation ? ` - ${staff.designation}` : ''}`,
        value: staff.id,
        data: staff, // Store full data for auto-population
      }));

      if (paymentType === "ADHOC_STAFF") {
        console.log("Adhoc staff options created:", options.length);
      }

      return options;
    },
    [adhocStaffFiltered, paymentType]
  );

  // Get selected purchase order details
  const selectedPOId = form.watch("purchase_order");
  const { data: selectedPO } = useGetSinglePurchaseOrderQuery(
    selectedPOId || "",
    !!selectedPOId
  );

  // Get complete vendor details when PO is selected
  const vendorId = selectedPO?.data?.vendor_detail?.id;
  const { data: vendorDetails } = useGetVendor(
    vendorId || "",
    !!vendorId && paymentType === "PURCHASE_ORDER"
  );

  // Get chart of accounts for expense account mapping
  const { data: chartOfAccountsData } = useGetChartOfAccounts({
    account_type: "EXPENSES",
    is_active: true,
  });

  const expenseAccountOptions = useMemo(
    () =>
      chartOfAccountsData?.data?.map((account: any) => ({
        label: `${account.account_code} - ${account.account_name}`,
        value: account.id,
        accountCode: account.account_code,
        accountName: account.account_name,
      })) || [],
    [chartOfAccountsData]
  );

  // Helper function to suggest default expense account based on payment type
  const getSuggestedExpenseAccount = useCallback((paymentType: string) => {
    const accountSuggestions = {
      "CONSULTANT": "professional-fees",
      "FACILITATOR": "training-expenses",
      "ADHOC_STAFF": "temporary-staff-costs",
      "PURCHASE_ORDER": "office-supplies",
      "OTHER": "miscellaneous-expenses"
    };

    const suggestedCode = accountSuggestions[paymentType as keyof typeof accountSuggestions];
    if (suggestedCode) {
      return expenseAccountOptions.find(account =>
        account.accountCode?.toLowerCase().includes(suggestedCode) ||
        account.accountName?.toLowerCase().includes(suggestedCode.replace('-', ' '))
      );
    }
    return null;
  }, [expenseAccountOptions]);

  const onSubmit: SubmitHandler<TPaymentRequestFormData> = (data) => {
    sessionStorage.setItem("paymentRequestFormData", JSON.stringify(data));

    let path = pathname;

    if (path) {
      path = path.substring(0, path.lastIndexOf("/"));
      path += `/create/upload?id=${id ?? ""}`;
      router.push(path);
    }
  };

  const { data: paymentRequest } = useGetSinglePaymentRequestQuery(
    id || "",
    !!id
  );

  useEffect(() => {
    if (paymentRequest && user && purchaseOrder) {
      const { data } = paymentRequest;

      // Extract approvals by level for auto-population
      const approvals = data.approvals || [];
      const reviewerApproval = approvals.find(
        (a: any) => a.approval_level === "REVIEW"
      );
      const authorizerApproval = approvals.find(
        (a: any) => a.approval_level === "AUTHORIZE"
      );
      const approverApproval = approvals.find(
        (a: any) => a.approval_level === "APPROVE"
      );

      form.reset({
        payment_type: data.payment_type,
        payment_date: data.payment_date,
        payment_reason: data.payment_reason,
        purchase_order: data.purchase_order?.id || "",
        // Auto-populate approvers if they exist in the approval workflow
        reviewer: reviewerApproval?.user?.id || "",
        authorizer: authorizerApproval?.user?.id || "",
        approver: approverApproval?.user?.id || "",
        payment_items: data.payment_items?.map((item) => ({
          payment_to: item.payment_to || "",
          account_number: item.account_number || "",
          bank_name: item.bank_name || "",
          amount_in_figures: item.amount_in_figures || "",
          amount_in_words: item.amount_in_words || "",
          tax_identification_number: item.tax_identification_number || "",
          phone_number: item.phone_number || "",
          email: item.email || "",
          address: item.address || "",
          // Handle different reference types for consultant/facilitator/adhoc_staff
          consultant:
            typeof item.consultant === "object" && item.consultant?.id
              ? item.consultant.id
              : typeof item.consultant === "string"
              ? item.consultant
              : "",
          facilitator:
            typeof item.facilitator === "object" && item.facilitator?.id
              ? item.facilitator.id
              : typeof item.facilitator === "string"
              ? item.facilitator
              : "",
          adhoc_staff:
            typeof item.adhoc_staff === "object" && item.adhoc_staff?.id
              ? item.adhoc_staff.id
              : typeof item.adhoc_staff === "string"
              ? item.adhoc_staff
              : "",
          expense_account: item.expense_account || "",
          department: item.department || "",
          project: item.project || "",
          cost_center: item.cost_center || "",
        })) || [
          {
            payment_to: "",
            account_number: "",
            bank_name: "",
            amount_in_figures: "",
            amount_in_words: "",
            tax_identification_number: "",
            phone_number: "",
            email: "",
            address: "",
            expense_account: "",
            department: "",
            project: "",
            cost_center: "",
          },
        ],
      });
    }
  }, [paymentRequest, user, purchaseOrder]); // Removed form to prevent infinite loop

  // Auto-populate PO details when purchase order is selected
  useEffect(() => {
    if (selectedPO?.data && paymentType === "PURCHASE_ORDER") {
      const poData = selectedPO.data;

      // Pre-populate payment reason with PO details
      form.setValue("payment_reason", `Payment for Purchase Order: ${poData.purchase_order_number}${poData.comment ? ` - ${poData.comment}` : ''}`);

      // Calculate total amount from purchase order items
      if (poData.purchase_order_items && poData.purchase_order_items.length > 0) {
        const totalAmount = poData.purchase_order_items.reduce(
          (sum, item) => sum + parseFloat(item.total_price || '0'),
          0
        );
        if (totalAmount > 0) {
          const amountStr = totalAmount.toString();
          form.setValue("payment_items.0.amount_in_figures", amountStr);
          // Auto-convert to words
          const wordsValue = numberToWords(amountStr);
          form.setValue("payment_items.0.amount_in_words", wordsValue);
        }
      }
    }
  }, [selectedPO, paymentType]); // Removed form to prevent infinite loop

  // Auto-populate vendor details when complete vendor data is available
  useEffect(() => {
    if (vendorDetails?.data && paymentType === "PURCHASE_ORDER" && form.getValues("payment_items").length > 0) {
      const vendor = vendorDetails.data;

      // Auto-populate all available vendor fields
      form.setValue("payment_items.0.payment_to", vendor.company_name || "");

      // Banking details
      if (vendor.bank_name) {
        form.setValue("payment_items.0.bank_name", vendor.bank_name);
      }
      if (vendor.account_number) {
        form.setValue("payment_items.0.account_number", vendor.account_number);
      }

      // Contact details
      if (vendor.email) {
        form.setValue("payment_items.0.email", vendor.email);
      }
      if (vendor.phone_number || vendor.phone) {
        form.setValue("payment_items.0.phone_number", vendor.phone_number || vendor.phone);
      }

      // Address details - check multiple possible field names
      const vendorAddress = vendor.company_address || vendor.address || vendor.physical_address;
      if (vendorAddress) {
        form.setValue("payment_items.0.address", vendorAddress);
      }

      // Tax identification
      if (vendor.tin) {
        form.setValue("payment_items.0.tax_identification_number", vendor.tin);
      }
    }
  }, [vendorDetails, paymentType]); // Removed form to prevent infinite loop

  // Auto-suggest expense account when payment type changes
  useEffect(() => {
    if (paymentType && expenseAccountOptions.length > 0) {
      const suggestedAccount = getSuggestedExpenseAccount(paymentType);
      if (suggestedAccount) {
        // Set suggested account for all payment items
        const currentItems = form.getValues("payment_items");
        currentItems.forEach((_, index) => {
          if (!form.getValues(`payment_items.${index}.expense_account`)) {
            form.setValue(`payment_items.${index}.expense_account`, suggestedAccount.value);
          }
        });
      }
    }
  }, [paymentType, expenseAccountOptions, getSuggestedExpenseAccount]); // Removed form to prevent infinite loop

  // Helper function to convert amount to words
  const handleAmountChange = (amount: string, index: number) => {
    if (amount && !isNaN(parseFloat(amount))) {
      const wordsValue = numberToWords(amount);
      form.setValue(`payment_items.${index}.amount_in_words`, wordsValue);
    } else {
      form.setValue(`payment_items.${index}.amount_in_words`, '');
    }
  };

  // Watch for changes in staff selections and amount changes to auto-populate
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === 'change' && name) {
        // Defer setState operations to avoid "setState during render" error
        setTimeout(() => {
          // Check if a consultant was selected
          if (name.includes('consultant') && !name.includes('facilitator')) {
            const match = name.match(/payment_items\.(\d+)\.consultant/);
            if (match) {
              const index = parseInt(match[1]);
              const consultantId = value.payment_items?.[index]?.consultant;
              if (consultantId) {
                handleStaffSelection("CONSULTANT", consultantId, index);
              }
            }
          }
          // Check if a facilitator was selected
          if (name.includes('facilitator')) {
            const match = name.match(/payment_items\.(\d+)\.facilitator/);
            if (match) {
              const index = parseInt(match[1]);
              const facilitatorId = value.payment_items?.[index]?.facilitator;
              if (facilitatorId) {
                handleStaffSelection("FACILITATOR", facilitatorId, index);
              }
            }
          }
          // Check if an adhoc staff was selected
          if (name.includes('adhoc_staff')) {
            const match = name.match(/payment_items\.(\d+)\.adhoc_staff/);
            if (match) {
              const index = parseInt(match[1]);
              const adhocStaffId = value.payment_items?.[index]?.adhoc_staff;
              if (adhocStaffId) {
                handleStaffSelection("ADHOC_STAFF", adhocStaffId, index);
              }
            }
          }
          // Check if amount in figures was changed
          if (name.includes('amount_in_figures')) {
            const match = name.match(/payment_items\.(\d+)\.amount_in_figures/);
            if (match) {
              const index = parseInt(match[1]);
              const amount = value.payment_items?.[index]?.amount_in_figures;
              if (amount) {
                handleAmountChange(String(amount), index);
              }
            }
          }
        }, 0); // Close setTimeout with 0ms delay
      }
    });
    return () => subscription.unsubscribe();
  }, [form]); // Removed options dependencies to prevent infinite re-renders

  // Helper function to auto-populate payment item based on staff selection
  const handleStaffSelection = (staffType: string, staffId: string, index: number) => {
    let staffData: any = null;
    let staffOptions: any[] = [];

    switch (staffType) {
      case "CONSULTANT":
        staffOptions = consultantOptions;
        break;
      case "FACILITATOR":
        staffOptions = facilitatorOptions;
        break;
      case "ADHOC_STAFF":
        staffOptions = adhocOptions;
        break;
    }

    staffData = staffOptions.find(option => option.value === staffId)?.data;

    if (staffData) {
      // Auto-populate based on staff type
      if (staffType === "CONSULTANT" || staffType === "FACILITATOR") {
        // For existing consultants/facilitators, use their actual name
        const fullName = staffData.consultant_name ||
                        staffData.facilitator_name ||
                        `${staffData.first_name || ''} ${staffData.last_name || ''}`.trim() ||
                        staffData.name ||
                        staffData.title;

        // Use account_name if available, otherwise use full name
        const paymentTo = staffData.account_name || fullName;
        form.setValue(`payment_items.${index}.payment_to`, paymentTo);

        // Auto-populate banking details if available from existing consultant/facilitator record
        if (staffData.bank_name) {
          form.setValue(`payment_items.${index}.bank_name`, staffData.bank_name);
        }
        if (staffData.account_number) {
          form.setValue(`payment_items.${index}.account_number`, staffData.account_number);
        }

        // Auto-populate contact details - check multiple possible field names
        if (staffData.email) {
          form.setValue(`payment_items.${index}.email`, staffData.email);
        } else if (staffData.supervisor?.email) {
          form.setValue(`payment_items.${index}.email`, staffData.supervisor.email);
        }

        if (staffData.phone_number || staffData.phone) {
          form.setValue(`payment_items.${index}.phone_number`, staffData.phone_number || staffData.phone);
        } else if (staffData.supervisor?.phone_number) {
          form.setValue(`payment_items.${index}.phone_number`, staffData.supervisor.phone_number);
        }

        // Auto-populate address - check for various address field formats
        if (staffData.address) {
          form.setValue(`payment_items.${index}.address`, staffData.address);
        } else if (staffData.locations && staffData.locations.length > 0) {
          const location = staffData.locations[0];
          form.setValue(`payment_items.${index}.address`, `${location.name}, ${location.state || ''}`);
        }

      } else if (staffType === "ADHOC_STAFF") {
        // For adhoc staff from adhoc applicants, use account_name or full_name
        const fullName = staffData.full_name || `${staffData.surname || ''} ${staffData.other_names || ''}`.trim();
        const paymentTo = staffData.account_name || fullName;
        form.setValue(`payment_items.${index}.payment_to`, paymentTo);

        // Auto-populate banking details from adhoc applicants
        if (staffData.bank_name) {
          form.setValue(`payment_items.${index}.bank_name`, staffData.bank_name);
        }
        if (staffData.account_number) {
          form.setValue(`payment_items.${index}.account_number`, staffData.account_number);
        }

        // Auto-populate contact details
        if (staffData.email) {
          form.setValue(`payment_items.${index}.email`, staffData.email);
        }
        if (staffData.phone_number) {
          form.setValue(`payment_items.${index}.phone_number`, staffData.phone_number);
        }

        // Auto-populate address - adhoc applicants have comprehensive address fields
        const addressParts = [];
        if (staffData.address) {
          addressParts.push(staffData.address);
        }
        if (staffData.lga) {
          addressParts.push(staffData.lga);
        }
        if (staffData.state_of_origin) {
          addressParts.push(staffData.state_of_origin);
        }
        if (addressParts.length > 0) {
          form.setValue(`payment_items.${index}.address`, addressParts.join(", "));
        }
      }
    }
  };

  return (
    <PaymentRequestLayout>
      {/* Header with Back Navigation */}
      <div className='mb-6 flex items-center gap-4'>
        <BackNavigation customBackPath={AdminRoutes.INDEX_PAYMENT_REQUEST} />
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Create Payment Request</h1>
          <p className='text-sm text-gray-600 mt-1'>Fill in the details to create a new payment request</p>
        </div>
      </div>

      <Card>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-5 gap-6'>
                {/* Payment Date - only show in single mode or for non-bulk-eligible types */}
                {(paymentMode === "single" || (paymentType !== "CONSULTANT" && paymentType !== "ADHOC_STAFF")) && (
                  <FormInput
                    label='Payment Date'
                    name='payment_date'
                    type='date'
                    required
                  />
                )}

                <FormSelect
                  label='Payment Type'
                  name='payment_type'
                  placeholder='Select Payment Type'
                  required
                  options={[
                    {
                      label: "CONSULTANT",
                      value: "CONSULTANT",
                    },
                    {
                      label: "FACILITATOR",
                      value: "FACILITATOR",
                    },
                    {
                      label: "ADHOC STAFF",
                      value: "ADHOC_STAFF",
                    },
                    {
                      label: "PURCHASE ORDER",
                      value: "PURCHASE_ORDER",
                    },
                    { label: "OTHER", value: "OTHER" },
                  ]}
                />


                {/* Payment Mode Selection for CONSULTANT and ADHOC_STAFF - appears after staff/consultant selection */}
                {(paymentType === "CONSULTANT" || paymentType === "ADHOC_STAFF") && (
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Request Type<span className='text-red-500'>*</span>
                    </label>
                    <Select
                      value={paymentMode}
                      onValueChange={(value: "single" | "bulk") => setPaymentMode(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select request type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">
                          <div className="flex flex-col">
                            <span className="font-medium">Single Payment</span>
                            <span className="text-xs text-gray-500">
                              Pay one {paymentType === "CONSULTANT" ? "consultant" : "adhoc staff"} at a time
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="bulk">
                          <div className="flex flex-col">
                            <span className="font-medium">Bulk Payment</span>
                            <span className="text-xs text-gray-500">
                              Upload Excel file with multiple {paymentType === "CONSULTANT" ? "consultants" : "adhoc staff"}
                            </span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {paymentType === "PURCHASE_ORDER" && (
                  <div>
                    <FormSelect
                      label='Purchase Order'
                      name='purchase_order'
                      placeholder='Select Purchase Order'
                      required
                      options={purchaseOrderOptions}
                    />
                    <p className='text-xs text-gray-500 mt-1'>
                      Selecting a PO will auto-populate vendor details, banking info, contact details, and payment reason
                    </p>
                  </div>
                )}

              </div>

              {/* Payment Reason - only show for single mode or non-bulk-eligible types */}
              {(paymentMode === "single" || (paymentType !== "CONSULTANT" && paymentType !== "ADHOC_STAFF")) && (
                <FormTextArea
                  label='Reason for Payment'
                  name='payment_reason'
                  placeholder='Enter Payment Reason'
                  required
                  className='mt-5'
                />
              )}

              {/* Bulk Upload Section - show when mode is bulk */}
              {paymentMode === "bulk" && (paymentType === "CONSULTANT" || paymentType === "ADHOC_STAFF") && (
                <BulkUploadSection
                  paymentType={paymentType as "CONSULTANT" | "ADHOC_STAFF"}
                  reviewer={form.watch("reviewer")}
                  authorizer={form.watch("authorizer")}
                  approver={form.watch("approver")}
                />
              )}

              {/* Payment Items Section - only show for single mode */}
              {paymentMode === "single" && (
                <div className='mt-8'>
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-lg font-semibold'>Payment Items</h3>
                    {(paymentType === "CONSULTANT" || paymentType === "FACILITATOR" || paymentType === "ADHOC_STAFF" || paymentType === "PURCHASE_ORDER") && (
                      <div className='text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-md'>
                        💡 Select {
                          paymentType === "PURCHASE_ORDER" ? "purchase order" :
                          paymentType === "CONSULTANT" ? "hired consultant" :
                          paymentType === "FACILITATOR" ? "hired facilitator" :
                          "hired adhoc staff"
                        } to auto-fill banking & contact details
                      </div>
                    )}
                  </div>
                {fields.map((_, index) => (
                  <Card key={index} className='mb-4'>
                    <CardContent className='pt-6'>
                      <div className='flex justify-between items-center mb-4'>
                        <h4 className='font-medium'>
                          Payment Item {index + 1}
                        </h4>
                        {fields.length > 1 && (
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={() => remove(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>

                      {/* Staff Selection - Full Width at Top */}
                      {(paymentType === "CONSULTANT" || paymentType === "FACILITATOR" || paymentType === "ADHOC_STAFF") && (
                        <div className='mb-6'>
                          {paymentType === "CONSULTANT" && (
                            <FormSelect
                              label='Select Consultant'
                              name={`payment_items.${index}.consultant`}
                              placeholder='Choose a hired consultant'
                              options={consultantOptions}
                            />
                          )}

                          {paymentType === "FACILITATOR" && (
                            <FormSelect
                              label='Select Facilitator'
                              name={`payment_items.${index}.facilitator`}
                              placeholder='Choose a hired facilitator'
                              options={facilitatorOptions}
                            />
                          )}

                          {paymentType === "ADHOC_STAFF" && (
                            <div>
                              <FormSelect
                                label='Select Adhoc Staff'
                                name={`payment_items.${index}.adhoc_staff`}
                                placeholder='Choose a hired adhoc staff member'
                                options={adhocOptions}
                              />
                              {adhocOptions.length === 0 ? (
                                <p className='text-xs text-amber-600 mt-1'>
                                  ⚠️ No hired adhoc staff found. Staff must be hired from adhoc applications.
                                </p>
                              ) : (
                                <p className='text-xs text-blue-600 mt-1'>
                                  💡 Select a staff member to auto-fill their banking and contact details below
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Payment Information Section */}
                      <div className='space-y-4'>
                        <div className='border-b pb-2'>
                          <h5 className='text-sm font-semibold text-gray-700'>Payment Information</h5>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                          <FormInput
                            label='Payment To'
                            name={`payment_items.${index}.payment_to`}
                            placeholder='Enter recipient name'
                            required
                          />

                          <FormInput
                            label='Amount In Figures'
                            name={`payment_items.${index}.amount_in_figures`}
                            placeholder='Enter amount'
                            required
                          />

                          <div>
                            <FormInput
                              label='Amount In Words'
                              name={`payment_items.${index}.amount_in_words`}
                              placeholder='Auto-generated'
                              required
                              readOnly
                              className='bg-gray-50'
                            />
                            <p className='text-xs text-green-600 mt-1'>
                              ✓ Automatically converted from figures
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Banking Details Section */}
                      <div className='space-y-4 mt-6'>
                        <div className='border-b pb-2'>
                          <h5 className='text-sm font-semibold text-gray-700'>Banking Details</h5>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <div>
                            <FormInput
                              label='Account Number'
                              name={`payment_items.${index}.account_number`}
                              placeholder='Enter account number'
                              required
                            />
                            {paymentType === "PURCHASE_ORDER" && (
                              <p className='text-xs text-gray-500 mt-1'>
                                Account number must be entered manually
                              </p>
                            )}
                          </div>

                          <FormInput
                            label='Bank Name'
                            name={`payment_items.${index}.bank_name`}
                            placeholder='Enter bank name'
                            required
                          />
                        </div>
                      </div>

                      {/* Contact Information Section */}
                      <div className='space-y-4 mt-6'>
                        <div className='border-b pb-2'>
                          <h5 className='text-sm font-semibold text-gray-700'>Contact Information</h5>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                          <FormInput
                            label='Phone Number'
                            name={`payment_items.${index}.phone_number`}
                            placeholder='Enter phone number'
                          />

                          <FormInput
                            label='Email'
                            name={`payment_items.${index}.email`}
                            placeholder='Enter email address'
                            type='email'
                          />

                          <FormInput
                            label='Tax ID Number'
                            name={`payment_items.${index}.tax_identification_number`}
                            placeholder='Enter tax ID'
                          />
                        </div>
                      </div>

                      {/* Address Section */}
                      <div className='space-y-4 mt-6'>
                        <div className='border-b pb-2'>
                          <h5 className='text-sm font-semibold text-gray-700'>Address</h5>
                        </div>
                        <FormInput
                          label='Address'
                          name={`payment_items.${index}.address`}
                          placeholder='Enter full address'
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  type='button'
                  variant='outline'
                  onClick={() =>
                    append({
                      payment_to: "",
                      account_number: "",
                      bank_name: "",
                      amount_in_figures: "",
                      amount_in_words: "",
                      tax_identification_number: "",
                      phone_number: "",
                      email: "",
                      address: "",
                      expense_account: "",
                      department: "",
                      project: "",
                      cost_center: "",
                    })
                  }
                  className='mt-4'
                >
                  Add Payment Item
                </Button>
              </div>
              )}

              <div className='grid grid-cols-3 gap-5 mt-5'>
                <FormSelect
                  label='Reviewer'
                  name='reviewer'
                  placeholder='Select Reviewer'
                  required
                  options={reviewerOptions}
                />

                <FormSelect
                  label='Authorizer'
                  name='authorizer'
                  placeholder='Select Authorizer'
                  required
                  options={authorizerOptions}
                />

                <FormSelect
                  label='Approver'
                  name='approver'
                  placeholder='Select Approver'
                  required
                  options={approverOptions}
                />
              </div>

              {/* Submit buttons - only show in single mode */}
              {paymentMode === "single" && (
                <div className='flex items-center justify-end mt-10 gap-2'>
                  <Link href={AdminRoutes.INDEX_PAYMENT_REQUEST}>
                    <Button variant='outline' type='button' size='lg'>
                      Cancel
                    </Button>
                  </Link>
                  <FormButton loading={false} size='lg' type='submit'>
                    Next
                  </FormButton>
                </div>
              )}
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </PaymentRequestLayout>
  );
}
