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
import { useGetAllPurchaseOrdersQuery } from "@/features/procurement/controllers/purchaseOrderController";
import { useEffect, useMemo } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGetAllUsersQuery } from "@/features/auth/controllers/userController";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { useGetSinglePaymentRequestQuery } from "@/features/admin/controllers/paymentRequestController";

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

  const paymentType = form.watch("payment_type") || "";

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
                  <FormSelect
                    label='Purchase Order'
                    name='purchase_order'
                    placeholder='Select Purchase Order'
                    required
                    options={purchaseOrderOptions}
                  />
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
                <h3 className='text-lg font-semibold mb-4'>Payment Items</h3>
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
                        />

                        <FormInput
                          label='Amount In Words'
                          name={`payment_items.${index}.amount_in_words`}
                          placeholder='Enter Amount in Words'
                          required
                        />

                        <FormInput
                          label='Account Number'
                          name={`payment_items.${index}.account_number`}
                          placeholder='Enter Account Number'
                          required
                        />

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
                            options={userOptions}
                          />
                        )}

                        {paymentType === "FACILITATOR" && (
                          <FormSelect
                            label='Facilitator'
                            name={`payment_items.${index}.facilitator`}
                            placeholder='Select Facilitator'
                            options={userOptions}
                          />
                        )}

                        {paymentType === "ADHOC_STAFF" && (
                          <FormSelect
                            label='Adhoc Staff'
                            name={`payment_items.${index}.adhoc_staff`}
                            placeholder='Select Adhoc Staff'
                            options={userOptions}
                          />
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
