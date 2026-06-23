"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";
import Modal from "react-modal";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/FormInput";
import FormButton from "@/components/FormButton";
import { Button } from "@/components/ui/button";
import { useUpdateCompensationSpread } from "@/features/hr/controllers/hrCompensationSpreadController";
import { CompensationSpreadItem } from "@/features/hr/types/compensation-spread";

type PropsType = {
  isOpen: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  compensationSpread: CompensationSpreadItem | null;
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "800px",
    width: "90%",
    maxHeight: "90vh",
    overflow: "auto",
  },
};

const EditCompensationSpreadModal = (props: PropsType) => {
  const { updateCompensationSpread, isLoading } = useUpdateCompensationSpread(
    props.compensationSpread?.id || ""
  );

  const form = useForm({
    defaultValues: {
      project: "",
      basic: "",
      housing: "",
      transport: "",
      meal: "",
      miscellaneous: "",
      total_allowance: "",
      thirteenth_month: "",
      gross_total: "",
    },
  });

  const { handleSubmit, watch, setValue, reset } = form;

  // Populate form when editing
  useEffect(() => {
    if (props.compensationSpread) {
      const data = props.compensationSpread;
      reset({
        project: data.project || "",
        basic: String(data.basic || "0"),
        housing: String(data.housing || "0"),
        transport: String(data.transport || "0"),
        meal: String(data.meal || "0"),
        miscellaneous: String(data.miscellaneous || "0"),
        total_allowance: String(data.totalAllowance || "0"),
        thirteenth_month: String(data.thirteenthMonth || "0"),
        gross_total: String(data.grossTotal || "0"),
      });
    }
  }, [props.compensationSpread, reset]);

  // Watch all compensation fields to calculate totals
  const basic = watch("basic");
  const housing = watch("housing");
  const transport = watch("transport");
  const meal = watch("meal");
  const miscellaneous = watch("miscellaneous");
  const thirteenthMonth = watch("thirteenth_month");

  // Auto-calculate total allowance and gross total
  useEffect(() => {
    const basicNum = parseFloat(basic) || 0;
    const housingNum = parseFloat(housing) || 0;
    const transportNum = parseFloat(transport) || 0;
    const mealNum = parseFloat(meal) || 0;
    const miscNum = parseFloat(miscellaneous) || 0;
    const thirteenthNum = parseFloat(thirteenthMonth) || 0;

    const totalAllowance = housingNum + transportNum + mealNum + miscNum;
    const grossTotal = basicNum + totalAllowance + thirteenthNum;

    setValue("total_allowance", totalAllowance.toString());
    setValue("gross_total", grossTotal.toString());
  }, [basic, housing, transport, meal, miscellaneous, thirteenthMonth, setValue]);

  const onSubmit = async (data: any) => {
    const formData = {
      project: data.project,
      basic: parseFloat(data.basic) || 0,
      housing: parseFloat(data.housing) || 0,
      transport: parseFloat(data.transport) || 0,
      meal: parseFloat(data.meal) || 0,
      miscellaneous: parseFloat(data.miscellaneous) || 0,
      total_allowance: parseFloat(data.total_allowance) || 0,
      thirteenth_month: parseFloat(data.thirteenth_month) || 0,
      gross_total: parseFloat(data.gross_total) || 0,
    };

    try {
      await updateCompensationSpread(formData);
      toast.success("Employee compensation updated successfully");
      props.onSuccess();
      props.onCancel();
      reset();
    } catch (error) {
      toast.error("Failed to update employee compensation");
    }
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onCancel}
      style={customStyles}
    >
      <div className="px-3">
        <h2 className="text-lg font-bold mb-6">Edit Employee Compensation</h2>

        {/* Employee Info Display */}
        {props.compensationSpread && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-semibold mb-3 text-blue-900">Employee Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Employee #:</span>
                <span className="ml-2 font-medium">
                  {props.compensationSpread?.employeeNumber || props.compensationSpread?.employee?.employee_number || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 font-medium">
                  {props.compensationSpread?.firstname || props.compensationSpread?.employee?.user?.first_name}{" "}
                  {props.compensationSpread?.surname || props.compensationSpread?.employee?.user?.last_name}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Position:</span>
                <span className="ml-2 font-medium">
                  {props.compensationSpread?.position || props.compensationSpread?.employee?.position?.name || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Grade:</span>
                <span className="ml-2 font-medium">
                  {props.compensationSpread?.grade || props.compensationSpread?.employee?.grade || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Location:</span>
                <span className="ml-2 font-medium">
                  {props.compensationSpread?.location || props.compensationSpread?.employee?.location?.name || "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              label="Project"
              name="project"
              type="text"
              placeholder="Enter project name"
            />

            <div className="border-t pt-4">
              <h3 className="text-md font-semibold mb-4">Compensation Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <FormInput
                  label="Basic Salary"
                  name="basic"
                  type="number"
                  placeholder="0.00"
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

            <div className="border-t pt-4">
              <h3 className="text-md font-semibold mb-4">Calculated Totals</h3>
              <div className="grid grid-cols-2 gap-6">
                <FormInput
                  label="Total Allowance"
                  name="total_allowance"
                  type="number"
                  placeholder="0.00"
                  disabled
                  className="bg-gray-100"
                />
                <FormInput
                  label="Gross Total"
                  name="gross_total"
                  type="number"
                  placeholder="0.00"
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * Total Allowance = Housing + Transport + Meal + Miscellaneous
                <br />* Gross Total = Basic + Total Allowance + 13th Month
              </p>
            </div>

            <div className="flex justify-end gap-6 mt-6">
              <Button
                type="button"
                onClick={props.onCancel}
                className="bg-brand-light text-primary dark:text-gray-500"
              >
                Cancel
              </Button>
              <FormButton
                suffix={<ChevronRight size={14} />}
                loading={isLoading}
              >
                Update Compensation
              </FormButton>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default EditCompensationSpreadModal;
