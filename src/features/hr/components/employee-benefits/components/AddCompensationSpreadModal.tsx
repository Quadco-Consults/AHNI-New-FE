"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";
import Modal from "react-modal";
import { Form } from "components/ui/form";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import FormButton from "@/components/FormButton";
import { Button } from "components/ui/button";
import { useGetWorkforces } from "@/features/hr/controllers/workforceController";
import { useCreateCompensationSpread } from "@/features/hr/controllers/hrCompensationSpreadController";
import { useGetPayGroupCompensationByPayGroup } from "@/features/hr/controllers/payGroupCompensationController";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";

type PropsType = {
  isOpen: boolean;
  onCancel: () => void;
  onSuccess: () => void;
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

const AddCompensationSpreadModal = (props: PropsType) => {
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedPayGroupId, setSelectedPayGroupId] = useState<string>("");

  const { data: workforcesData, isLoading: isLoadingEmployees, error: employeeError } = useGetWorkforces({
    page: 1,
    size: 100,
  });
  const { data: projectsData, isLoading: isLoadingProjects } = useGetAllProjects({
    page: 1,
    size: 1000,
  });
  const { createCompensationSpread, isLoading } = useCreateCompensationSpread();

  // Debug logging
  console.log("Workforces Data:", workforcesData);
  console.log("Is Loading Employees:", isLoadingEmployees);
  console.log("Employee Error:", employeeError);

  // Fetch compensation template for the selected pay group
  const { data: payGroupCompensationData } = useGetPayGroupCompensationByPayGroup(
    selectedPayGroupId,
    !!selectedPayGroupId
  );

  const form = useForm({
    defaultValues: {
      employee: "",
      project: "",
      basic: "",
      housing: "",
      transport: "",
      meal: "",
      miscellaneous: "",
      total_allowance: "",
      thirteenth_month: "",
      gross_total: "",
      tax: "",
      pension: "",
      nhis: "",
    },
  });

  const { handleSubmit, watch, setValue, reset } = form;

  // When employee is selected, populate all their details
  useEffect(() => {
    if (selectedEmployee) {
      // Auto-populate employee information - match actual API field names
      const employeeNumber = selectedEmployee?.serial_id_code || selectedEmployee?.employee_number || "";
      const fullName = selectedEmployee?.full_name || `${selectedEmployee?.legal_firstname || ""} ${selectedEmployee?.legal_lastname || ""}`.trim();
      const position = selectedEmployee?.position?.name || "N/A";
      const grade = selectedEmployee?.grade?.name || selectedEmployee?.grade || "N/A";
      const location = selectedEmployee?.location?.name || "N/A";
      const hireDate = selectedEmployee?.date_of_hire || "N/A";

      // Get the employee's pay group ID to fetch compensation template
      const payGroupId = selectedEmployee?.position?.id;
      setSelectedPayGroupId(payGroupId);

      // Show a toast with employee details
      toast.info(`Selected: ${employeeNumber} - ${fullName}\nPosition: ${position} | Grade: ${grade}`);
    }
  }, [selectedEmployee]);

  // Auto-populate compensation fields when pay group compensation data is loaded
  useEffect(() => {
    if (payGroupCompensationData?.data) {
      const template = payGroupCompensationData.data;

      // Auto-populate all compensation fields
      setValue("basic", template.basic?.toString() || "0");
      setValue("housing", template.housing?.toString() || "0");
      setValue("transport", template.transport?.toString() || "0");
      setValue("meal", template.meal?.toString() || "0");
      setValue("miscellaneous", template.miscellaneous?.toString() || "0");
      setValue("thirteenth_month", template.thirteenth_month?.toString() || "0");

      // Show success message
      toast.success("Compensation details loaded from template!");
    }
  }, [payGroupCompensationData, setValue]);

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

  // Extract employees from the correct API response structure
  const employees = workforcesData?.data?.results || [];

  const employeeOptions = employees.map((employee: any) => ({
    label: `${employee?.serial_id_code || employee?.employee_number || 'N/A'} - ${employee?.full_name || `${employee?.legal_firstname || ''} ${employee?.legal_lastname || ''}`} (${employee?.position?.name || 'No Position'})`,
    value: employee?.id,
  }));

  // Extract projects from the correct API response structure
  const projects = (projectsData as any)?.data?.results || [];
  const projectOptions = projects
    .filter((project: any) => project?.id && project.id.trim() !== '')
    .map((project: any) => ({
      label: `${project?.project_id || 'N/A'} - ${project?.title || project?.project_name || 'N/A'}`,
      value: project?.id,
    }));

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find((emp: any) => emp.id === employeeId);
    setSelectedEmployee(employee);
    setValue("employee", employeeId);
  };

  const onSubmit = async (data: any) => {
    const formData = {
      employee: data.employee,
      project: data.project,
      basic: parseFloat(data.basic) || 0,
      housing: parseFloat(data.housing) || 0,
      transport: parseFloat(data.transport) || 0,
      meal: parseFloat(data.meal) || 0,
      miscellaneous: parseFloat(data.miscellaneous) || 0,
      total_allowance: parseFloat(data.total_allowance) || 0,
      thirteenth_month: parseFloat(data.thirteenth_month) || 0,
      gross_total: parseFloat(data.gross_total) || 0,
      tax: parseFloat(data.tax) || 0,
      pension: parseFloat(data.pension) || 0,
      nhis: parseFloat(data.nhis) || 0,
    };

    try {
      await createCompensationSpread(formData);
      toast.success("Compensation spread created successfully");
      props.onSuccess();
      props.onCancel();
      reset();
    } catch (error) {
      toast.error("Failed to create compensation spread");
    }
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onCancel}
      style={customStyles}
    >
      <div className="px-3">
        <h2 className="text-lg font-bold mb-6">Add Employee Compensation</h2>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <FormSelect
                  label="Employee"
                  placeholder={isLoadingEmployees ? "Loading employees..." : "Select Employee"}
                  name="employee"
                  required
                  options={employeeOptions || []}
                  onChange={(value) => handleEmployeeChange(value)}
                />
                {isLoadingEmployees && <p className="text-xs text-gray-500 mt-1">Loading employees...</p>}
                {!isLoadingEmployees && (!employeeOptions || employeeOptions.length === 0) && (
                  <p className="text-xs text-red-500 mt-1">
                    No employees found. Please add employees first.
                  </p>
                )}
                {selectedEmployee && (
                  <p className="text-xs text-green-600 mt-1">
                    Position: {selectedEmployee?.position?.name || 'Not assigned'}
                  </p>
                )}
              </div>
              <FormSelect
                label="Project"
                name="project"
                placeholder={isLoadingProjects ? "Loading projects..." : "Select Project"}
                options={projectOptions || []}
              />
            </div>

            {/* Employee Details Display */}
            {selectedEmployee && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-3 text-blue-900">Employee Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Employee #:</span>
                    <span className="ml-2 font-medium">{selectedEmployee?.serial_id_code || selectedEmployee?.employee_number || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">
                      {selectedEmployee?.full_name || `${selectedEmployee?.legal_firstname || ''} ${selectedEmployee?.legal_lastname || ''}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Position:</span>
                    <span className="ml-2 font-medium">{selectedEmployee?.position?.name || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Grade:</span>
                    <span className="ml-2 font-medium">{selectedEmployee?.grade?.name || selectedEmployee?.grade || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Location:</span>
                    <span className="ml-2 font-medium">{selectedEmployee?.location?.name || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Hire Date:</span>
                    <span className="ml-2 font-medium">
                      {selectedEmployee?.date_of_hire
                        ? new Date(selectedEmployee.date_of_hire).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            )}

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
              <h3 className="text-md font-semibold mb-4">Deductions</h3>
              <div className="grid grid-cols-3 gap-6">
                <FormInput
                  label="Tax (%)"
                  name="tax"
                  type="number"
                  placeholder="e.g., 7 for 7%"
                  min="0"
                  max="100"
                  step="0.01"
                />
                <FormInput
                  label="Pension (%)"
                  name="pension"
                  type="number"
                  placeholder="e.g., 8 for 8%"
                  min="0"
                  max="100"
                  step="0.01"
                />
                <FormInput
                  label="NHIS (₦)"
                  name="nhis"
                  type="number"
                  placeholder="Fixed amount"
                  min="0"
                  step="0.01"
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
                Add Compensation
              </FormButton>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default AddCompensationSpreadModal;
