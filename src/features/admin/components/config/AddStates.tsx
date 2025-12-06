"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import FormCheckBox from "components/FormCheckBox";
import { Form } from "components/ui/form";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { StateSchema, TStateFormValues, TStateData } from "@/features/admin/types/config/state";
import { useAddStateMutation, useUpdateStateMutation } from "@/features/modules/controllers/config/stateController";

// Nigerian Geopolitical Zones
const geopoliticalZones = [
  { label: "North Central", value: "North Central" },
  { label: "North East", value: "North East" },
  { label: "North West", value: "North West" },
  { label: "South East", value: "South East" },
  { label: "South South", value: "South South" },
  { label: "South West", value: "South West" },
];

const AddStates = () => {
  const dispatch = useAppDispatch();
  const { dialogProps } = useAppSelector(dailogSelector);
  const result = dialogProps?.data as TStateData;

  const form = useForm<TStateFormValues>({
    resolver: zodResolver(StateSchema),
    defaultValues: {
      name: result?.name ?? "",
      code: result?.code ?? "",
      capital: result?.capital ?? "",
      zone: result?.zone ?? "",
      lgas: result?.lgas ?? 0,
      is_active: result?.is_active ?? true,
    },
  });

  const [addState, { isLoading: isAddLoading }] = useAddStateMutation();
  const [updateState, { isLoading: isUpdateLoading }] = useUpdateStateMutation();

  const onSubmit = async (data: TStateFormValues) => {
    try {
      if (dialogProps?.type === "update") {
        await updateState({ id: result.id, body: data });
        toast.success("State updated successfully");
      } else {
        await addState(data);
        toast.success("State added successfully");
      }
      form.reset();
      dispatch(closeDialog());
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Something went wrong");
    }
  };

  const isLoading = isAddLoading || isUpdateLoading;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          {dialogProps?.type === "update" ? "Update State" : "Add New State"}
        </h3>
        <p className="text-sm text-gray-600">
          {dialogProps?.type === "update"
            ? "Update the information for this Nigerian state"
            : "Add a new Nigerian state to the system"
          }
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* State Name */}
            <FormInput
              label="State Name"
              name="name"
              required
              placeholder="e.g., Lagos"
              description="Full name of the Nigerian state"
            />

            {/* State Code */}
            <FormInput
              label="State Code"
              name="code"
              required
              placeholder="e.g., LA"
              description="Abbreviated code for the state"
              className="uppercase"
            />

            {/* Capital */}
            <FormInput
              label="Capital City"
              name="capital"
              required
              placeholder="e.g., Ikeja"
              description="Capital city of the state"
            />

            {/* Geopolitical Zone */}
            <FormSelect
              label="Geopolitical Zone"
              name="zone"
              required
              placeholder="Select zone"
              options={geopoliticalZones}
              description="Which geopolitical zone the state belongs to"
            />

            {/* Number of LGAs */}
            <FormInput
              label="Number of LGAs"
              name="lgas"
              type="number"
              required
              placeholder="20"
              description="Total number of Local Government Areas"
              min="1"
              max="50"
            />

            {/* Status */}
            <div className="flex items-center space-x-2">
              <FormCheckBox
                label="Active Status"
                name="is_active"
                description="Whether this state is active in the system"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => dispatch(closeDialog())}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <FormButton
              loading={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              {dialogProps?.type === "update" ? "Update State" : "Add State"}
            </FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddStates;