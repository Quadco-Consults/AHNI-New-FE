"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";
import Modal from "react-modal";
import { Form } from "components/ui/form";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import FormButton from "@/components/FormButton";
import { Button } from "components/ui/button";
import { SelectContent, SelectItem } from "components/ui/select";
import { useGetPayGroups } from "@/features/hr/controllers/payGroupController";
import { useUpdateCompensation } from "@/features/hr/controllers/compensationController";
import { Compensation } from "@/features/hr/types/compensation";
import { Grade } from "@/features/hr/types/pay-group";

type PropsType = {
  isOpen: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  compensation: Compensation | null;
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "600px",
    width: "90%",
    maxHeight: "90vh",
    overflow: "auto",
  },
};

const EditCompensationModal = (props: PropsType) => {
  const { data: payGroupsData } = useGetPayGroups();
  const { updateCompensation, isLoading } = useUpdateCompensation(
    props.compensation?.id || ""
  );

  const form = useForm({
    defaultValues: {
      compensation_name: "",
      type: "",
      amount_or_percentage: "",
      percentage: undefined,
      amount: undefined,
      position: "",
      grade: "",
      period: "",
    },
  });

  const { handleSubmit, watch, setValue, reset } = form;

  // Populate form when compensation data changes
  useEffect(() => {
    if (props.compensation) {
      reset({
        compensation_name: props.compensation.name || "",
        type: props.compensation.type || "",
        amount_or_percentage: props.compensation.percentage
          ? "Percentage"
          : "Amount",
        percentage: props.compensation.percentage,
        amount: props.compensation.amount,
        position: props.compensation.pay_group?.id || "",
        grade: props.compensation.pay_group?.grade?.name || "",
        period: props.compensation.period || "",
      });
    }
  }, [props.compensation, reset]);

  const selectedPayGroup = watch("position");
  const amountOrPercentage = watch("amount_or_percentage");

  const grade: Grade = useMemo(() => {
    const selected = payGroupsData?.data?.results?.find(
      (group) => group?.id === selectedPayGroup
    );
    return selected?.grade || [];
  }, [selectedPayGroup, payGroupsData]);

  const positionOptions = payGroupsData?.data?.results?.map((payGroup) => ({
    label: `Position: ${payGroup?.position?.name}, Grade: ${payGroup?.grade?.name}, Level: ${payGroup?.level?.name}`,
    value: payGroup?.id,
  }));

  const onSubmit = async (data: any) => {
    const formData = {
      name: data.compensation_name,
      type: data.type,
      amount_or_percentage: data.amount_or_percentage,
      percentage: data.percentage,
      amount: data.amount,
      pay_group: data.position,
      grade: grade?.id,
      period: data.period,
    };

    try {
      await updateCompensation(formData);
      toast.success("Compensation updated successfully");
      props.onSuccess();
      props.onCancel();
    } catch (error) {
      toast.error("Failed to update compensation");
    }
  };

  useEffect(() => {
    if (grade) {
      setValue("grade", grade?.name?.toString());
    }
  }, [grade, setValue]);

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onCancel}
      style={customStyles}
    >
      <div className="px-3">
        <h2 className="text-lg font-bold mb-6">Edit Compensation</h2>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <FormInput
                label="Compensation Name"
                name="compensation_name"
                type="text"
              />
              <FormSelect name="type" label="Type">
                <SelectContent>
                  {["Deduction", "Earning"].map(
                    (value: string, index: number) => (
                      <SelectItem key={index} value={value}>
                        {value}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </FormSelect>
            </div>
            <FormSelect
              name="amount_or_percentage"
              label="Amount or Percentage"
            >
              <SelectContent>
                {["Percentage", "Amount"].map(
                  (value: string, index: number) => (
                    <SelectItem key={index} value={value}>
                      {value}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </FormSelect>

            {amountOrPercentage === "Percentage" && (
              <FormInput label="Percentage" name="percentage" type="number" />
            )}
            {amountOrPercentage === "Amount" && (
              <FormInput label="Amount" name="amount" type="number" />
            )}

            <div className="grid grid-cols-2 gap-6">
              <FormSelect
                label="Pay Group"
                placeholder="Select Position"
                name="position"
                required
                options={positionOptions}
              />
              <FormSelect name="period" label="Period">
                <SelectContent>
                  {["Daily", "Weekly", "Monthly", "Annually", "One-Off"].map(
                    (value: string, index: number) => (
                      <SelectItem key={index} value={value}>
                        {value}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </FormSelect>
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
                loading={isLoading}
              >
                Update
              </FormButton>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default EditCompensationModal;
