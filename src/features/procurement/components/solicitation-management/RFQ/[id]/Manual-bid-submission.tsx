"use client";

/* eslint-disable react/prop-types */

import { useRouter, useParams } from "next/navigation";
import { SelectContent, SelectItem } from "components/ui/select";
import { Form } from "components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import VendorsAPI from "@/features/procurement/controllers/vendorsController";
import FormSelect from "components/atoms/FormSelectField";
import { LoadingSpinner } from "components/Loading";
import { VendorsResultsData } from "definations/procurement-types/vendors";
import FormInput from "components/atoms/FormInput";
import React, { useEffect, useMemo } from "react";
import { z } from "zod";
import {
  SolicitationSubmissionSchema,
  VendorBidSubmissionSchema,
  IVendorBidSubmission
} from "@/features/procurement/types/procurement-validator";
import FormTextArea from "components/atoms/FormTextArea";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import FormButton from "@/components/FormButton";
import { useCreateSolicitationSubmission } from "@/features/procurement/controllers/vendorBidSubmissionsController";
import { useGetSingleSolicitation } from "@/features/procurement/controllers/solicitationController";
import { useGetAllSolicitationEvaluationCriteria } from "@/features/modules/controllers";

import GoBack from "components/GoBack";

const ManualBidSubmission = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: vendors, isLoading: vendorsIsLoading } =
    VendorsAPI.useGetVendors({
      status: "Approved",
    });

  const { createSolicitationSubmission, isLoading: isCreateLoading } =
    useCreateSolicitationSubmission();

  const { data: singleSolicitation } = useGetSingleSolicitation(
    id as string
  );

  const { data: solicitationCriteria } =
    useGetAllSolicitationEvaluationCriteria({
      page: 1,
      size: 2000000,
    });

  //   const [
  //     createSolicitationBidMutation,
  //     { isLoading: solicitationBidIsLoading },
  //   ] = SolicitationAPI.useCreateSolicitationBid();

  const form = useForm<z.infer<typeof SolicitationSubmissionSchema>>({
    resolver: zodResolver(SolicitationSubmissionSchema),
    defaultValues: {
      solicitation: id,
      vendor: "",
      bid_items: [],
      evaluations: [],
      // Additional hardcoded submission details
      delivery_lead_time: "",
      payment_terms: "",
      tin: "",
      validity_period: "",
      has_bank_account: "",
      is_cac_registered: "",
      previous_experience: "",
      email: "",
      currency: "Naira",
      warranty: "",
      brand_quoted: "",
    },
  });

  const { control, handleSubmit, setValue, watch } = form;

  const { fields } = useFieldArray({
    control,
    name: "bid_items",
  });

  const { fields: responseField } = useFieldArray({
    control,
    name: "evaluations",
  });

  // Enhanced Debug for Manual Bid Submission
  const bidItemsData = useMemo(() => {
    console.log("🔍 Manual Bid - FULL singleSolicitation:", singleSolicitation);
    console.log("🔍 Manual Bid - singleSolicitation.data:", singleSolicitation?.data);
    console.log("🔍 Manual Bid - solicitation_items:", singleSolicitation?.data?.solicitation_items);
    console.log("🔍 Manual Bid - items field:", singleSolicitation?.data?.items);

    // Check if solicitation_items exists and has data
    const items = singleSolicitation?.data?.solicitation_items || singleSolicitation?.data?.items;
    console.log("🔍 Manual Bid - Final items used:", items);

    if (!items || items.length === 0) {
      console.log("⚠️ Manual Bid - No items found!");
      return [];
    }

    return items.map((item: any) => ({
      solicitation_item: item?.id,
      quantity: String(item?.quantity || 0),
      name: item?.item_detail?.name || item?.description,
      description: item?.item_detail?.description || item?.specification,
      unit_price: "",
      uom: item?.item_detail?.uom || "pieces",
    }));
  }, [singleSolicitation]);

  const evaluationData = useMemo(() => {
    console.log("🔍 RFQ Evaluation Data Debug:", {
      solicitation_evaluations: singleSolicitation?.data?.solicitation_evaluations,
      solicitationCriteria: solicitationCriteria?.results,
    });

    if (
      !singleSolicitation?.data?.solicitation_evaluations ||
      !solicitationCriteria?.results
    ) {
      console.log("⚠️ No evaluation criteria found:", {
        hasEvaluations: !!singleSolicitation?.data?.solicitation_evaluations,
        hasCriteria: !!solicitationCriteria?.results,
      });
      return [];
    }

    const validCriteriaIds = new Set(
      solicitationCriteria.results.map((criteria: any) => criteria.id)
    );

    const result = singleSolicitation.data.solicitation_evaluations
      .filter((evaluation) => validCriteriaIds.has(evaluation?.criteria))
      .map((evaluation) => ({
        response: "",
        evaluation_criteria: evaluation?.criteria,
        criteria_name: solicitationCriteria.results.find(
          (criteria: any) => criteria.id === evaluation?.criteria
        )?.name || "Unknown Criteria",
      }));

    console.log("🎯 Final evaluation data:", result);
    return result;
  }, [singleSolicitation, solicitationCriteria]);

  useEffect(() => {
    if (bidItemsData) {
      setValue("bid_items", bidItemsData);
    }
  }, [bidItemsData, setValue]);

  useEffect(() => {
    if (evaluationData) {
      setValue("evaluations", evaluationData);
    }
  }, [evaluationData, setValue]);

  const itemsWatchData = watch("bid_items");

  const onSubmit = async (data: z.infer<typeof SolicitationSubmissionSchema>) => {
    try {
      console.log("🚀 Submitting complete bid data:", {
        ...data,
        total_items: data.bid_items.length,
        total_amount: data.bid_items.reduce((acc, item) => acc + (Number(item.unit_price) * Number(item.quantity)), 0)
      });

      // Validate that all required fields are filled
      if (!data.vendor) {
        toast.error("Please select a vendor");
        return;
      }

      if (!data.bid_items.length) {
        toast.error("Please provide bid items");
        return;
      }

      // Check if all bid items have unit prices
      const missingPrices = data.bid_items.some(item => !item.unit_price || item.unit_price === "0");
      if (missingPrices) {
        toast.error("Please provide unit prices for all items");
        return;
      }

      // Validate additional submission details
      const requiredFields = [
        'delivery_lead_time', 'payment_terms', 'tin', 'validity_period',
        'has_bank_account', 'is_cac_registered', 'previous_experience',
        'email', 'currency', 'warranty', 'brand_quoted'
      ];

      for (const field of requiredFields) {
        // @ts-ignore
        if (!data[field] || data[field].trim() === '') {
          toast.error(`Please fill in the ${field.replace('_', ' ')} field`);
          return;
        }
      }

      await createSolicitationSubmission(data);

      toast.success("Bid submitted successfully!");
      router.back();
    } catch (error) {
      console.error("Error submitting bid:", error);
      toast.error("Failed to submit bid. Please try again.");
    }
  };

  return (
    <div className="space-y-10">
      <GoBack />
      <div>
        <h4 className="text-lg font-bold">Manual Bid Submission Form</h4>
        <div className="space-y-2">
          <h6 className="text-gray-600">{singleSolicitation?.data?.title}</h6>
          <div className="flex gap-4 text-sm text-gray-500">
            <span><strong>RFQ ID:</strong> {singleSolicitation?.data?.rfq_id}</span>
            <span><strong>Status:</strong> {singleSolicitation?.data?.status}</span>
            <span><strong>Type:</strong> {singleSolicitation?.data?.request_type}</span>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <FormSelect name="vendor" label="Vendor" required>
            <SelectContent>
              {vendorsIsLoading && <LoadingSpinner />}
              {/* @ts-ignore */}
              {vendors?.data?.results?.map((vendor: VendorsResultsData) => (
                <SelectItem key={vendor?.id} value={String(vendor?.id)}>
                  {vendor?.company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </FormSelect>

          <div className="space-y-1">
            <h4 className="text-base font-bold">Items Quotation</h4>
            <h6>Please provide your quotation for the following Items</h6>
          </div>

          <div>
            <table className="w-full border mt-10">
              <thead>
                <tr className="text-amber-500 whitespace-nowrap border-b-2 text-sm font-semibold">
                  <th className="px-2 py-5 w-[50px]">S/N</th>
                  <th className="px-2 py-5 w-[300px]">Items Description</th>
                  <th className="px-2 py-5 w-[150px]">Qty</th>
                  <th className="px-2 py-5 w-[150px]"> Unit price</th>
                  <th className="px-2 py-5 w-[150px]">Total</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => {
                  console.log({
                    field,
                    quantity: Number(itemsWatchData[index]?.quantity),
                    unit: Number(itemsWatchData[index]?.unit_price),
                    itemsWatchData,
                  });

                  return (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-4 text-center border-r border-gray-200">
                        <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-4 py-4 border-r border-gray-200">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-gray-900 text-left">
                            {/* @ts-ignore */}
                            {field?.name}
                          </h3>
                          <p className="text-sm text-gray-600 text-left">
                            <span className="font-medium">Specification:</span> {/* @ts-ignore */}
                            {field?.description}
                          </p>
                          <p className="text-xs text-amber-600 font-medium text-left">
                            UOM: pieces
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center border-r border-gray-200">
                        <FormInput
                          label=""
                          name={`bid_items.[${index}].quantity`}
                          type="number"
                          className="w-20 text-center"
                          min="1"
                          step="1"
                        />
                      </td>
                      <td className="px-4 py-4 text-center border-r border-gray-200">
                        <FormInput
                          label=""
                          type="number"
                          name={`bid_items.[${index}].unit_price`}
                          className="w-28 text-center"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-4 text-center font-semibold text-green-600">
                        ₦{Number(
                          Number(itemsWatchData[index]?.quantity) *
                            Number(itemsWatchData[index]?.unit_price)
                        ).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border-l-4 border-amber-500">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Items Quotation Total:</h3>
                <div className="text-2xl font-bold text-green-600">
                  ₦{itemsWatchData
                    .reduce((acc, item) => {
                      const quantity = Number(item?.quantity) || 0;
                      const unitPrice = Number(item?.unit_price) || 0;
                      return acc + quantity * unitPrice;
                    }, 0)
                    .toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Hardcoded Additional Submission Details */}
          <div className="space-y-6 border-t pt-6">
            <div className="space-y-2">
              <h4 className="text-base font-bold">Additional Submission Details</h4>
              <h6 className="text-gray-600">Please provide the following required information</h6>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                name="delivery_lead_time"
                label="Delivery Lead Time"
                placeholder="e.g., 30 days"
                required
              />
              <FormInput
                name="payment_terms"
                label="Payment Terms"
                placeholder="e.g., Net 30"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                name="tin"
                label="Tax Identification Number (TIN)"
                placeholder="Enter TIN"
                required
              />
              <FormInput
                name="validity_period"
                label="Validity Period of Quote"
                placeholder="e.g., 90 days"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FormSelect name="has_bank_account" label="Bank Account?" required>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </FormSelect>

              <FormSelect name="is_cac_registered" label="Registration with C.A.C.?" required>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </FormSelect>

              <FormSelect name="previous_experience" label="Previous work experience with AHNi?" required>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </FormSelect>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                name="email"
                label="Your Email Address"
                type="email"
                placeholder="vendor@company.com"
                required
              />
              <FormSelect name="currency" label="Currency For Payment" required>
                <SelectContent>
                  <SelectItem value="Naira">Naira</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </FormSelect>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                name="warranty"
                label="Warranty"
                placeholder="e.g., 12 months"
                required
              />
              <FormInput
                name="brand_quoted"
                label="Brand Quoted"
                placeholder="Brand name"
                required
              />
            </div>
          </div>

          {responseField.length > 0 && (
            <div className="space-y-6 border-t pt-6">
              <div className="space-y-2">
                <h4 className="text-base font-bold">Submission Requirements</h4>
                <h6 className="text-gray-600">Please provide detailed responses to all the following requirements and evaluation criteria</h6>
              </div>

              <div className="space-y-6">
                {responseField.map((_, index) => {
                  const criteria = solicitationCriteria?.results?.find(
                    (criteria: any) =>
                      criteria.id === responseField[index]?.evaluation_criteria
                  );

                  const criteriaName = criteria?.name || "Evaluation Criteria";
                  const criteriaDescription = criteria?.description;

                  return (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                      <div className="space-y-3">
                        <div>
                          <h5 className="font-semibold text-gray-900">{criteriaName}</h5>
                          {criteriaDescription && (
                            <p className="text-sm text-gray-600 mt-1">{criteriaDescription}</p>
                          )}
                        </div>
                        <FormTextArea
                          label="Your Response"
                          name={`evaluations.[${index}].response`}
                          placeholder={`Provide detailed response for: ${criteriaName}`}
                          className="w-full"
                          rows={4}
                          required
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <FormButton
              loading={isCreateLoading}
              disabled={isCreateLoading}
              type="submit"
            >
              Submit
            </FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ManualBidSubmission;
