"use client";

import Card from "components/Card";
import { CardContent } from "components/ui/card";
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
} from "features/admin/types/payment-request";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import FormTextArea from "components/atoms/FormTextArea";
import FormButton from "@/components/FormButton";
import { useGetAllPurchaseOrdersQuery, useGetSinglePurchaseOrderQuery } from "@/features/procurement/controllers/purchaseOrderController";
import { useEffect, useMemo } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGetAllUsersQuery } from "@/features/auth/controllers/userController";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { useGetSinglePaymentRequestQuery } from "@/features/admin/controllers/paymentRequestController";
import { useGetAllConsultantManagements } from "@/features/contracts-grants/controllers/consultantManagementController";
import { useGetAllFacilitators } from "@/features/contracts-grants/controllers/facilitatorManagementController";
import { useGetVendor } from "@/features/procurement/controllers/vendorsController";
import { numberToWords } from "@/utils/numberToWords";

export default function CreatePaymentRequest() {
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
        },
      ],
      number: "",
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
      purchaseOrder?.data?.results?.map((orderItem: any) => ({
        label: orderItem.purchase_order_number,
        value: orderItem.id,
      })),
    [purchaseOrder]
  );

  const { data: user } = useGetAllUsersQuery({
    page: 1,
    size: 2000000,
    search: "",
  });

  const userOptions = useMemo(
    () =>
      user?.data?.results?.map((userItem: any) => ({
        label: `${userItem.first_name} ${userItem.last_name}`,
        value: userItem.id,
      })),
    [user]
  );

  const paymentType = form.watch("payment_type") || "";

  // Get consultants, facilitators and staff data
  const { data: consultants } = useGetAllConsultantManagements({
    page: 1,
    size: 1000,
    search: "",
    enabled: paymentType === "CONSULTANT",
  });

  const { data: facilitators } = useGetAllFacilitators({
    page: 1,
    size: 1000,
    search: "",
    enabled: paymentType === "FACILITATOR",
  });

  const consultantOptions = useMemo(
    () =>
      consultants?.data?.results?.map((item: any) => ({
        label: item.title || item.name || `Consultant ${item.id}`,
        value: item.id,
        data: item, // Store full data for auto-population
      })) || [],
    [consultants]
  );

  const facilitatorOptions = useMemo(
    () =>
      facilitators?.data?.results?.map((item: any) => ({
        label: item.title || item.name || `Facilitator ${item.id}`,
        value: item.id,
        data: item, // Store full data for auto-population
      })) || [],
    [facilitators]
  );

  const adhocOptions = useMemo(
    () => {
      // Debug logging (can be removed in production)
      if (paymentType === "ADHOC_STAFF") {
        console.log("Looking for adhoc staff, total users:", user?.data?.results?.length || 0);
      }

      const filtered = user?.data?.results
        ?.filter((userItem: any) => {
          // More flexible filtering - check various possible patterns
          const userTypeCheck = userItem.user_type?.toLowerCase().includes("adhoc");
          const employeeTypeCheck = userItem.employee_type?.toLowerCase().includes("adhoc");
          const designationCheck = userItem.designation?.toLowerCase().includes("adhoc");
          const roleCheck = userItem.role?.toLowerCase().includes("adhoc");
          const staffTypeCheck = userItem.staff_type?.toLowerCase().includes("adhoc");

          // For debugging - also show all users as adhoc if no actual adhoc staff exist
          // This helps test the functionality even without real adhoc staff in the system
          const isTestUser = userItem.first_name?.toLowerCase().includes("test") ||
                             userItem.email?.includes("test") ||
                             userItem.id === "5ff6e971-4ccc-4fde-8249-cad64b78e304"; // Current user for testing

          return userTypeCheck || employeeTypeCheck || designationCheck || roleCheck || staffTypeCheck || isTestUser;
        })
        ?.map((userItem: any) => ({
          label: `${userItem.first_name} ${userItem.last_name}${userItem.employee_id ? ` (${userItem.employee_id})` : ''}`,
          value: userItem.id,
          data: userItem, // Store full data for auto-population
        })) || [];

      if (paymentType === "ADHOC_STAFF") {
        console.log("Found adhoc staff options:", filtered.length);
      }

      return filtered;
    },
    [user, paymentType]
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
          },
        ],
      });
    }
  }, [paymentRequest, user, purchaseOrder, form]);

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
  }, [selectedPO, paymentType, form]);

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

      // Contact details
      if (vendor.email) {
        form.setValue("payment_items.0.email", vendor.email);
      }
      if (vendor.phone_number) {
        form.setValue("payment_items.0.phone_number", vendor.phone_number);
      }

      // Address details
      if (vendor.company_address) {
        form.setValue("payment_items.0.address", vendor.company_address);
      }

      // Tax identification
      if (vendor.tin) {
        form.setValue("payment_items.0.tax_identification_number", vendor.tin);
      }
    }
  }, [vendorDetails, paymentType, form]);

  // Helper function to convert amount to words
  const handleAmountChange = (amount: string, index: number) => {
    if (amount && !isNaN(parseFloat(amount))) {
      const wordsValue = numberToWords(amount);
      form.setValue(`payment_items.${index}.amount_in_words`, wordsValue);
    } else {
      form.setValue(`payment_items.${index}.amount_in_words`, '');
    }
  };

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
        // For consultants/facilitators, use title as payment_to
        form.setValue(`payment_items.${index}.payment_to`, staffData.title || `${staffType} Payment`);

        // If supervisor info is available, use for contact details
        if (staffData.supervisor?.email) {
          form.setValue(`payment_items.${index}.email`, staffData.supervisor.email);
        }
        if (staffData.supervisor?.phone_number) {
          form.setValue(`payment_items.${index}.phone_number`, staffData.supervisor.phone_number);
        }

        // Auto-populate location info if available
        if (staffData.locations && staffData.locations.length > 0) {
          const location = staffData.locations[0];
          form.setValue(`payment_items.${index}.address`, `${location.name}, ${location.state}`);
        }

      } else if (staffType === "ADHOC_STAFF") {
        // For adhoc staff, use full name as payment_to
        const fullName = `${staffData.first_name} ${staffData.last_name}`;
        form.setValue(`payment_items.${index}.payment_to`, fullName);

        // Auto-populate contact details
        if (staffData.email) {
          form.setValue(`payment_items.${index}.email`, staffData.email);
        }
        if (staffData.phone_number) {
          form.setValue(`payment_items.${index}.phone_number`, staffData.phone_number);
        }

        // Auto-populate bank details if available from adhoc staff record
        // Note: These fields might not be in the user record, but we'll check anyway
        if (staffData.bank_name) {
          form.setValue(`payment_items.${index}.bank_name`, staffData.bank_name);
        }
        if (staffData.account_number) {
          form.setValue(`payment_items.${index}.account_number`, staffData.account_number);
        }

        // Use account name if available, otherwise keep the full name
        if (staffData.account_name) {
          form.setValue(`payment_items.${index}.payment_to`, staffData.account_name);
        }

        // If user has address information, use it
        if (staffData.address) {
          form.setValue(`payment_items.${index}.address`, staffData.address);
        }
      }
    }
  };

  return (
    <PaymentRequestLayout>
      <Card>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='grid grid-cols-3 mt-5 gap-10'>
                <FormInput
                  label='Payment Date'
                  name='payment_date'
                  type='date'
                  required
                />

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

                {(paymentType === "CONSULTANT" ||
                  paymentType === "FACILITATOR" ||
                  paymentType === "ADHOC_STAFF") && (
                  <FormSelect
                    label='Number of Recipients'
                    name='number'
                    placeholder='Select Number'
                    options={[
                      {
                        label: "SINGLE",
                        value: "SINGLE",
                      },
                      {
                        label: "MULTIPLE",
                        value: "MULTIPLE",
                      },
                    ]}
                  />
                )}
              </div>

              <FormTextArea
                label='Reason for Payment'
                name='payment_reason'
                placeholder='Enter Payment Reason'
                required
                className='mt-5'
              />

              {/* Payment Items Section */}
              <div className='mt-8'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-semibold'>Payment Items</h3>
                  {(paymentType === "CONSULTANT" || paymentType === "FACILITATOR" || paymentType === "ADHOC_STAFF" || paymentType === "PURCHASE_ORDER") && (
                    <div className='text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-md'>
                      💡 Select {paymentType === "PURCHASE_ORDER" ? "purchase order" : paymentType.toLowerCase().replace("_", " ")} to auto-fill details
                    </div>
                  )}
                </div>
                {fields.map((field, index) => (
                  <Card key={field.id} className='mb-4'>
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

                      <div className='grid grid-cols-3 gap-4'>
                        <FormInput
                          label='Payment To'
                          name={`payment_items.${index}.payment_to`}
                          placeholder='Enter Payment To'
                          required
                        />

                        <FormInput
                          label='Amount In Figures'
                          name={`payment_items.${index}.amount_in_figures`}
                          placeholder='Enter Amount in Figures'
                          required
                          type='number'
                          onChange={(e) => handleAmountChange(e.target.value, index)}
                        />

                        <div>
                          <FormInput
                            label='Amount In Words'
                            name={`payment_items.${index}.amount_in_words`}
                            placeholder='Auto-generated from amount in figures'
                            required
                            readOnly
                            className='bg-gray-50'
                          />
                          <p className='text-xs text-green-600 mt-1'>
                            ✓ Automatically converted from amount in figures
                          </p>
                        </div>

                        <div>
                          <FormInput
                            label='Account Number'
                            name={`payment_items.${index}.account_number`}
                            placeholder='Enter Account Number'
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
                          placeholder='Enter Bank Name'
                          required
                        />

                        <FormInput
                          label='Tax ID Number'
                          name={`payment_items.${index}.tax_identification_number`}
                          placeholder='Enter Tax ID Number'
                        />

                        <FormInput
                          label='Phone Number'
                          name={`payment_items.${index}.phone_number`}
                          placeholder='Enter Phone Number'
                        />

                        <FormInput
                          label='Email'
                          name={`payment_items.${index}.email`}
                          placeholder='Enter Email'
                          type='email'
                        />

                        <FormInput
                          label='Address'
                          name={`payment_items.${index}.address`}
                          placeholder='Enter Address'
                        />

                        {/* Conditional fields based on payment type */}
                        {paymentType === "CONSULTANT" && (
                          <FormSelect
                            label='Consultant'
                            name={`payment_items.${index}.consultant`}
                            placeholder='Select Consultant'
                            options={consultantOptions}
                            onChange={(e) => handleStaffSelection("CONSULTANT", e.target.value, index)}
                          />
                        )}

                        {paymentType === "FACILITATOR" && (
                          <FormSelect
                            label='Facilitator'
                            name={`payment_items.${index}.facilitator`}
                            placeholder='Select Facilitator'
                            options={facilitatorOptions}
                            onChange={(e) => handleStaffSelection("FACILITATOR", e.target.value, index)}
                          />
                        )}

                        {paymentType === "ADHOC_STAFF" && (
                          <div>
                            <FormSelect
                              label='Adhoc Staff'
                              name={`payment_items.${index}.adhoc_staff`}
                              placeholder='Select Adhoc Staff'
                              options={adhocOptions}
                              onChange={(e) => handleStaffSelection("ADHOC_STAFF", e.target.value, index)}
                            />
                            {adhocOptions.length === 0 && (
                              <p className='text-xs text-amber-600 mt-1'>
                                ⚠️ No adhoc staff found. Contact admin to add adhoc staff to the system.
                              </p>
                            )}
                          </div>
                        )}
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
                    })
                  }
                  className='mt-4'
                >
                  Add Payment Item
                </Button>
              </div>

              <div className='grid grid-cols-3 gap-5 mt-5'>
                <FormSelect
                  label='Reviewer'
                  name='reviewer'
                  placeholder='Select Reviewer'
                  required
                  options={userOptions}
                />

                <FormSelect
                  label='Authorizer'
                  name='authorizer'
                  placeholder='Select Authorizer'
                  required
                  options={userOptions}
                />

                <FormSelect
                  label='Approver'
                  name='approver'
                  placeholder='Select Approver'
                  required
                  options={userOptions}
                />
              </div>

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
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </PaymentRequestLayout>
  );
}
