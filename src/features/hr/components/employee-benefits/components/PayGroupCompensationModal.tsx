"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";
import Modal from "react-modal";
import { Form } from "components/ui/form";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import FormButton from "@/components/FormButton";
import { Button } from "components/ui/button";
import { useGetPayGroups } from "@/features/hr/controllers/payGroupController";
import {
  useCreatePayGroupCompensation,
  useUpdatePayGroupCompensation,
} from "@/features/hr/controllers/payGroupCompensationController";
import { PayGroupCompensation } from "@/features/hr/types/pay-group-compensation";

type PropsType = {
  isOpen: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  compensation: PayGroupCompensation | null;
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "700px",
    width: "90%",
    maxHeight: "90vh",
    overflow: "auto",
  },
};

const PayGroupCompensationModal = (props: PropsType) => {
  const { data: payGroupsData, isLoading: isLoadingPayGroups } = useGetPayGroups();
  const { createPayGroupCompensation, isLoading: isCreating } = useCreatePayGroupCompensation();
  const { updatePayGroupCompensation, isLoading: isUpdating } = useUpdatePayGroupCompensation(
    props.compensation?.id || ""
  );

  const form = useForm({
    defaultValues: {
      pay_group: "",
      basic: "",
      housing: "",
      transport: "",
      meal: "",
      miscellaneous: "",
      thirteenth_month: "",
    },
  });

  const { handleSubmit, watch, setValue, reset } = form;

  // Populate form when editing
  useEffect(() => {
    if (props.compensation) {
      reset({
        pay_group: props.compensation.pay_group?.id || "",
        basic: props.compensation.basic?.toString() || "",
        housing: props.compensation.housing?.toString() || "",
        transport: props.compensation.transport?.toString() || "",
        meal: props.compensation.meal?.toString() || "",
        miscellaneous: props.compensation.miscellaneous?.toString() || "",
        thirteenth_month: props.compensation.thirteenth_month?.toString() || "",
      });
    } else {
      reset({
        pay_group: "",
        basic: "",
        housing: "",
        transport: "",
        meal: "",
        miscellaneous: "",
        thirteenth_month: "",
      });
    }
  }, [props.compensation, reset]);

  const payGroupOptions = payGroupsData?.data?.results?.map((payGroup: any) => ({
    label: `Position: ${payGroup?.position?.name}, Grade: ${payGroup?.grade?.name}, Level: ${payGroup?.level?.name}`,
    value: payGroup?.id,
  }));

  const onSubmit = async (data: any) => {
    const formData = {
      pay_group: data.pay_group,
      basic: parseFloat(data.basic) || 0,
      housing: parseFloat(data.housing) || 0,
      transport: parseFloat(data.transport) || 0,
      meal: parseFloat(data.meal) || 0,
      miscellaneous: parseFloat(data.miscellaneous) || 0,
      thirteenth_month: parseFloat(data.thirteenth_month) || 0,
    };

    try {
      if (props.compensation) {
        await updatePayGroupCompensation(formData);
        toast.success("Compensation template updated successfully");
      } else {
        await createPayGroupCompensation(formData);
        toast.success("Compensation template created successfully");
      }
      props.onSuccess();
      props.onCancel();
      reset();
    } catch (error) {
      toast.error("Failed to save compensation template");
    }
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onCancel}
      style={customStyles}
    >
      <div className="px-3">
        <h2 className="text-lg font-bold mb-6">
          {props.compensation ? "Edit" : "Add"} Pay Group Compensation Template
        </h2>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormSelect
              label="Pay Group"
              placeholder="Select Pay Group"
              name="pay_group"
              required
              options={payGroupOptions}
            />

            <div className="border-t pt-4">
              <h3 className="text-md font-semibold mb-4">Compensation Amounts</h3>
              <div className="grid grid-cols-2 gap-6">
                <FormInput
                  label="Basic Salary"
                  name="basic"
                  type="number"
                  placeholder="0.00"
                  required
                />
                <FormInput
                  label="Housing"
                  name="housing"
                  type="number"
                  placeholder="0.00"
                />
                <FormInput
                  label="Transport"
                  name="transport"
                  type="number"
                  placeholder="0.00"
                />
                <FormInput
                  label="Meal"
                  name="meal"
                  type="number"
                  placeholder="0.00"
                />
                <FormInput
                  label="Miscellaneous"
                  name="miscellaneous"
                  type="number"
                  placeholder="0.00"
                />
                <FormInput
                  label="13th Month"
                  name="thirteenth_month"
                  type="number"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex justify-end gap-6 mt-6">
              <Button
                type="button"
                onClick={props.onCancel}
                className="bg-[#FFF2F2] text-primary dark:text-gray-500"
              >
                Cancel
              </Button>
              <FormButton
                suffix={<ChevronRight size={14} />}
                loading={isCreating || isUpdating}
              >
                {props.compensation ? "Update" : "Create"} Template
              </FormButton>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default PayGroupCompensationModal;
