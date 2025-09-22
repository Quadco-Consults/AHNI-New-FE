"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import RfqLayout from "./RfqLayout";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import FormSelect from "components/atoms/FormSelectField";
import { SelectContent, SelectItem } from "components/ui/select";
import FormButton from "@/components/FormButton";
import FadedButton from "components/atoms/FadedButton";
import AddSquareIcon from "components/icons/AddSquareIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { toast } from "sonner";
import { LoadingSpinner } from "components/Loading";
import { useGetAllSolicitationEvaluationCriteria } from "@/features/modules/controllers";
import { useCreateSolicitation } from "@/features/procurement/controllers/solicitationController";

// Schema for Evaluation Criteria
const EvaluationCriteriaSchema = z.object({
  criteria: z.string().uuid("Please select evaluation criteria"),
  title: z.string().optional(),
  description: z.string().optional(),
});

const EvaluationCriteriaFormSchema = z.object({
  criteria: z.array(EvaluationCriteriaSchema).min(1, "At least one evaluation criteria is required"),
});

type EvaluationCriteriaFormData = z.infer<typeof EvaluationCriteriaFormSchema>;

const EvaluationCriteria = () => {
  const router = useRouter();
  const [quotationData, setQuotationData] = useState<any>(null);
  const [itemsData, setItemsData] = useState<any>(null);

  const form = useForm<EvaluationCriteriaFormData>({
    resolver: zodResolver(EvaluationCriteriaFormSchema),
    defaultValues: {
      criteria: [
        {
          criteria: "",
          title: "",
          description: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "criteria",
  });

  // Fetch evaluation criteria
  const { data: evaluationCriteriaData, isLoading: isCriteriaLoading } = useGetAllSolicitationEvaluationCriteria({
    page: 1,
    size: 1000,
  });

  // Create solicitation hook
  const { createSolicitation, isLoading: isCreating } = useCreateSolicitation();

  // Load data from sessionStorage
  useEffect(() => {
    const storedQuotationData = sessionStorage.getItem("rfqQuotationFormData");
    const storedItemsData = sessionStorage.getItem("rfqCompleteFormData");

    if (storedQuotationData) {
      try {
        const parsedQuotation = JSON.parse(storedQuotationData);
        setQuotationData(parsedQuotation);
        console.log("📋 Loaded quotation data:", parsedQuotation);
      } catch (error) {
        console.error("Error parsing quotation data:", error);
      }
    }

    if (storedItemsData) {
      try {
        const parsedItems = JSON.parse(storedItemsData);
        setItemsData(parsedItems);
        console.log("📋 Loaded items data:", parsedItems);
      } catch (error) {
        console.error("Error parsing items data:", error);
      }
    }
  }, []);

  const onSubmit: SubmitHandler<EvaluationCriteriaFormData> = async (data) => {
    try {
      // Combine all data for final submission - API expects 'items' and 'criteria' format
      const finalData = {
        ...quotationData,
        items: itemsData?.solicitation_items || [],
        criteria: data.criteria.map((criteria) => criteria.criteria),
      };

      console.log("🚀 Creating RFQ with complete data:", finalData);

      // Create RFQ using the API
      const result = await createSolicitation(finalData);

      if (result) {
        // Show success message
        toast.success("RFQ created successfully!");

        // Navigate back to RFQ listing
        router.push("/dashboard/procurement/solicitation-management/rfq");

        // Clear stored form data after successful creation
        setTimeout(() => {
          sessionStorage.removeItem("rfqQuotationFormData");
          sessionStorage.removeItem("rfqCompleteFormData");
        }, 1000);
      }

    } catch (error) {
      console.error("Error creating RFQ:", error);
      toast.error("Failed to create RFQ. Please try again.");
    }
  };

  const addNewCriteria = () => {
    append({
      criteria: "",
      title: "",
      description: "",
    });
  };

  const removeCriteria = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      toast.error("At least one evaluation criteria is required");
    }
  };

  return (
    <RfqLayout>
      <div className="p-5">
        <div className="mb-6">
          <h4 className="font-semibold text-lg">Add Evaluation Criteria</h4>
          <p className="text-gray-600 text-sm mt-2">
            Select evaluation criteria that vendors must respond to
          </p>

          {quotationData && (
            <div className="mt-4 space-y-2">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>RFQ:</strong> {quotationData.title || "Untitled RFQ"}
                </p>
              </div>

              {itemsData?.solicitation_items && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Items:</strong> {itemsData.solicitation_items.length} items added
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border border-gray-200 rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-gray-900">
                    Evaluation Criteria {index + 1}
                  </h5>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCriteria(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <DeleteIcon />
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <FormSelect
                    name={`criteria.${index}.criteria`}
                    label="Select Evaluation Criteria"
                    placeholder="Choose evaluation criteria"
                    required
                  >
                    <SelectContent>
                      {isCriteriaLoading && <LoadingSpinner />}
                      {evaluationCriteriaData?.results?.map((criteria: any) => (
                        <SelectItem key={criteria.id} value={criteria.id}>
                          {criteria.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </FormSelect>
                </div>
              </div>
            ))}

            <div className="flex justify-center">
              <FadedButton
                type="button"
                className="text-primary"
                onClick={addNewCriteria}
              >
                <AddSquareIcon />
                Add Another Criteria
              </FadedButton>
            </div>

            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Back
              </Button>
              <FormButton type="submit" disabled={isCreating}>
                {isCreating ? "Creating RFQ..." : "Create RFQ"}
              </FormButton>
            </div>
          </form>
        </Form>
      </div>
    </RfqLayout>
  );
};

export default EvaluationCriteria;