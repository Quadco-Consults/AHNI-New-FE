"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import FormTextArea from "components/atoms/FormTextArea";
import Card from "components/Card";
import { Form } from "components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { Button } from "components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Schema for expense row
const ExpenseRowSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.string().min(1, "Quantity is required"),
  unit_cost: z.string().min(1, "Unit cost is required"),
  total: z.string().optional(),
});

// Main Activity Memo Schema
const ActivityMemoSchema = z.object({
  memo_title: z.string().min(1, "Memo title is required"),
  project: z.string().min(1, "Project is required"),
  activity_description: z.string().min(1, "Activity description is required"),
  purpose: z.string().min(1, "Purpose is required"),
  location: z.string().min(1, "Location is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  expenses: z.array(ExpenseRowSchema).min(1, "At least one expense is required"),
});

type ActivityMemoFormData = z.infer<typeof ActivityMemoSchema>;

const CreateActivityMemoForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ActivityMemoFormData>({
    resolver: zodResolver(ActivityMemoSchema),
    defaultValues: {
      memo_title: "",
      project: "",
      activity_description: "",
      purpose: "",
      location: "",
      start_date: "",
      end_date: "",
      expenses: [{ description: "", quantity: "", unit_cost: "", total: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "expenses",
  });

  // Watch expenses to trigger re-calculation
  const expenses = form.watch("expenses");

  // Calculate total for each expense row
  const calculateRowTotal = (index: number) => {
    const quantity = parseFloat(expenses[index]?.quantity || "0");
    const unitCost = parseFloat(expenses[index]?.unit_cost || "0");
    return quantity * unitCost;
  };

  // Calculate grand total
  const calculateGrandTotal = () => {
    return expenses.reduce((sum, expense) => {
      const quantity = parseFloat(expense.quantity || "0");
      const unitCost = parseFloat(expense.unit_cost || "0");
      return sum + (quantity * unitCost);
    }, 0);
  };

  const onSubmit = async (data: ActivityMemoFormData) => {
    try {
      setIsSubmitting(true);
      console.log("Activity Memo Data:", data);

      // Replace with actual API call
      // await createActivityMemo(data);

      toast.success("Activity Memo created successfully!");
      router.push("/dashboard/procurement/activity-memo");
    } catch (error) {
      console.error("Error creating activity memo:", error);
      toast.error("Failed to create activity memo");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock project options
  const projectOptions = [
    { label: "Project LifeGuard: HIV/AIDS Intervention", value: "project-1" },
    { label: "BeatTheBite: Malaria Eradication", value: "project-2" },
    { label: "VitalVision: Child Nutrition Study", value: "project-3" },
    { label: "HarvestHope: Sustainable Agriculture", value: "project-4" },
  ];

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Create Activity Memo
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <FormInput
                  label="Memo Title"
                  name="memo_title"
                  required
                  placeholder="Enter memo title"
                />
                <FormSelect
                  label="Project"
                  name="project"
                  required
                  placeholder="Select project"
                  options={projectOptions}
                />
              </div>

              <div className="mt-6">
                <FormTextArea
                  label="Activity Description"
                  name="activity_description"
                  required
                  placeholder="Describe the activity"
                  rows={4}
                />
              </div>

              <div className="mt-6">
                <FormTextArea
                  label="Purpose"
                  name="purpose"
                  required
                  placeholder="State the purpose of this activity"
                  rows={3}
                />
              </div>
            </div>

            {/* Activity Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Activity Details
              </h3>
              <div className="grid grid-cols-3 gap-6">
                <FormInput
                  label="Location"
                  name="location"
                  required
                  placeholder="Enter location"
                />
                <FormInput
                  label="Start Date"
                  name="start_date"
                  required
                  type="date"
                />
                <FormInput
                  label="End Date"
                  name="end_date"
                  required
                  type="date"
                />
              </div>
            </div>

            {/* Expenses Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Expenses Breakdown
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({ description: "", quantity: "", unit_cost: "", total: "" })
                  }
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Expense
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                        Unit Cost (₦)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                        Total (₦)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fields.map((field, index) => (
                      <tr key={field.id}>
                        <td className="px-6 py-4">
                          <FormInput
                            name={`expenses.${index}.description`}
                            placeholder="Enter description"
                            hideLabel
                          />
                        </td>
                        <td className="px-6 py-4">
                          <FormInput
                            name={`expenses.${index}.quantity`}
                            type="number"
                            placeholder="0"
                            hideLabel
                          />
                        </td>
                        <td className="px-6 py-4">
                          <FormInput
                            name={`expenses.${index}.unit_cost`}
                            type="number"
                            placeholder="0.00"
                            hideLabel
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {calculateRowTotal(index).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={16} />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-right font-semibold text-gray-900">
                        Grand Total:
                      </td>
                      <td colSpan={2} className="px-6 py-4 text-left font-bold text-lg text-gray-900">
                        ₦{calculateGrandTotal().toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <FormButton loading={isSubmitting}>
                Create Activity Memo
              </FormButton>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default CreateActivityMemoForm;