"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import Card from "components/Card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import FormInput from "@/components/FormInput";
import FormSelect from "components/FormSelectField";
import { Checkbox } from "components/ui/checkbox";
import { Icon } from "@iconify/react";
import {
  useGetEmployeesForPayroll,
  useGeneratePayroll,
  useCalculatePayrollPreview
} from "@/features/hr/controllers/hrPayRollController";
import { Employee, PayrollSummary, GeneratedPayroll } from "@/features/hr/types/payroll";
import PayrollReport from "./PayrollReport";
import { useGetCompensationsSpread } from "@/features/hr/controllers/hrCompensationSpreadController";

// Form Schema
const PayrollGenerationSchema = z.object({
  month: z.string().min(1, "Please select a month"),
  year: z.number().min(2020, "Year must be at least 2020").max(2030, "Year must be at most 2030"),
  employees: z.array(z.string()).min(1, "Please select at least one employee"),
});

type PayrollGenerationFormValues = z.infer<typeof PayrollGenerationSchema>;

const PayrollCreate: React.FC = () => {
  const router = useRouter();
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<PayrollSummary | null>(null);
  const [generatedPayroll, setGeneratedPayroll] = useState<any>(null);
  const [showPayrollReport, setShowPayrollReport] = useState(false);

  // API Hooks
  const { data: employeesData, isLoading: loadingEmployees } = useGetEmployeesForPayroll();
  const { data: compensationData } = useGetCompensationsSpread();
  const { generatePayroll, isLoading: generating, isSuccess } = useGeneratePayroll();
  const { calculatePreview, isLoading: calculatingPreview } = useCalculatePayrollPreview();

  // Form
  const form = useForm<PayrollGenerationFormValues>({
    resolver: zodResolver(PayrollGenerationSchema),
    defaultValues: {
      month: new Date().toISOString().slice(0, 7), // Current month (YYYY-MM)
      year: new Date().getFullYear(),
      employees: [],
    },
  });

  // Month options
  const monthOptions = [
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  // Year options (current year ± 2)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = currentYear - 2 + i;
    return { label: year.toString(), value: year.toString() };
  });

  // Handle employee selection
  const handleEmployeeToggle = (employeeId: string) => {
    const updatedSelection = selectedEmployees.includes(employeeId)
      ? selectedEmployees.filter(id => id !== employeeId)
      : [...selectedEmployees, employeeId];

    setSelectedEmployees(updatedSelection);
    form.setValue("employees", updatedSelection);
  };

  const handleSelectAll = () => {
    const employeesList = employees || [];
    const allEmployeeIds = Array.isArray(employeesList)
      ? employeesList.map((emp: Employee) => emp.id)
      : [];

    if (selectedEmployees.length === allEmployeeIds.length) {
      setSelectedEmployees([]);
      form.setValue("employees", []);
    } else {
      setSelectedEmployees(allEmployeeIds);
      form.setValue("employees", allEmployeeIds);
    }
  };

  // Calculate Preview
  const handleCalculatePreview = async () => {
    const formData = form.getValues();

    if (selectedEmployees.length === 0) {
      toast.error("Please select at least one employee");
      return;
    }

    try {
      const result = await calculatePreview({
        month: `${formData.year}-${formData.month}`,
        year: formData.year,
        employees: selectedEmployees,
      });

      setPreviewData(result as any);
      setShowPreview(true);
      toast.success("Preview calculated successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to calculate preview");
    }
  };

  // Generate Payroll
  const handleGeneratePayroll = async (data: PayrollGenerationFormValues) => {
    try {
      const month = `${data.year}-${data.month}`;

      // Generate payroll data for all selected employees
      const employeesPayrollData = selectedEmployees.map((employeeId) => {
        const employee = getEmployeeData(employeeId);
        const compensation = getEmployeeCompensation(employeeId);

        if (!employee) return null;

        const basicSalary = getCompensationValue(compensation?.basic) || employee.basic_salary || 0;
        const housing = getCompensationValue(compensation?.housing);
        const transport = getCompensationValue(compensation?.transport);
        const meal = getCompensationValue(compensation?.meal);
        const miscellaneous = getCompensationValue(compensation?.miscellaneous);

        const grossSalary = basicSalary + housing + transport + meal + miscellaneous;
        const pension = grossSalary * 0.08;
        const tax = grossSalary * 0.07;
        const nhis = 500;
        const totalDeductions = pension + tax + nhis;
        const netSalary = grossSalary - totalDeductions;

        return {
          employee_id: employee.id,
          employee_name: employee.name,
          employee_number: employee.employee_id,
          position: typeof employee.position === 'object' ? employee.position?.name : employee.position || 'N/A',
          basic_salary: basicSalary,
          allowances: { housing, transport, meal, miscellaneous },
          deductions: { tax, pension, nhis, loan: 0 },
          gross_salary: grossSalary,
          total_deductions: totalDeductions,
          net_salary: netSalary,
        };
      }).filter(Boolean);

      const totalGross = employeesPayrollData.reduce((sum, emp: any) => sum + emp.gross_salary, 0);
      const totalDeductions = employeesPayrollData.reduce((sum, emp: any) => sum + emp.total_deductions, 0);
      const totalNet = employeesPayrollData.reduce((sum, emp: any) => sum + emp.net_salary, 0);

      const payrollReport = {
        payroll_id: `payroll_${Date.now()}`,
        month,
        year: data.year,
        total_employees: employeesPayrollData.length,
        total_gross_payment: totalGross,
        total_deductions: totalDeductions,
        total_net_payment: totalNet,
        employees: employeesPayrollData,
      };

      setGeneratedPayroll(payrollReport);
      setShowPayrollReport(true);
      toast.success("Payroll generated successfully! Review below.");
    } catch (error: any) {
      toast.error(error?.message || "Failed to generate payroll");
    }
  };

  // Save Payroll
  const handleSavePayroll = () => {
    // TODO: Save to backend when API is ready
    console.log("Saving payroll:", generatedPayroll);

    // For now, save to localStorage as a placeholder
    const savedPayrolls = JSON.parse(localStorage.getItem("payrolls") || "[]");
    savedPayrolls.unshift(generatedPayroll);
    localStorage.setItem("payrolls", JSON.stringify(savedPayrolls));

    toast.success("Payroll saved successfully!");
    router.push("/dashboard/hr/employee-benefit/pay-roll");
  };

  // Safely extract employees array from API response
  const employees = employeesData?.data?.results || employeesData?.data || [];

  // Helper to get employee compensation data
  const getEmployeeCompensation = (employeeId: string) => {
    const compensations = compensationData?.data?.results || [];
    return compensations.find((comp: any) => comp.employee === employeeId);
  };

  // Helper to get employee data
  const getEmployeeData = (employeeId: string) => {
    return employees.find((emp: Employee) => emp.id === employeeId);
  };

  // Helper to extract numeric value from compensation data
  const getCompensationValue = (value: any): number => {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'object' && value.amount) return Number(value.amount) || 0;
    if (typeof value === 'string') return Number(value) || 0;
    return 0;
  };

  // Debug log to understand the data structure
  React.useEffect(() => {
    console.log('Employees data structure:', employeesData);
    console.log('Extracted employees:', employees);
    if (employees.length > 0) {
      console.log('First employee sample:', employees[0]);
    }
  }, [employeesData, employees]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Generate Payroll</h1>
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          Back
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleGeneratePayroll)} className="space-y-6">
          {/* Period Selection */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Payroll Period</h2>
            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                label="Month"
                name="month"
                placeholder="Select month"
                options={monthOptions}
                required
              />
              <FormInput
                label="Year"
                name="year"
                type="number"
                min={2020}
                max={2030}
                required
              />
            </div>
          </Card>

          {/* Employee Selection */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Select Employees</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedEmployees.length === employees.length ? "Deselect All" : "Select All"}
              </Button>
            </div>

            {loadingEmployees ? (
              <div className="flex items-center justify-center py-8">
                <Icon icon="lucide:loader-2" className="animate-spin" />
                <span className="ml-2">Loading employees...</span>
              </div>
            ) : employees.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-gray-500">No employees found</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Array.isArray(employees) && employees.map((employee: Employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center space-x-3 p-2 border rounded hover:bg-gray-50"
                  >
                    <Checkbox
                      checked={selectedEmployees.includes(employee.id)}
                      onCheckedChange={() => handleEmployeeToggle(employee.id)}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{employee.name || 'N/A'}</p>
                      <p className="text-sm text-gray-500">
                        {employee.employee_id || 'N/A'} • {typeof employee.position === 'object' ? employee.position?.name : employee.position || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        ₦{typeof employee.basic_salary === 'number' ? employee.basic_salary.toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                Selected: {selectedEmployees.length} employee(s)
              </p>
            </div>
          </Card>

          {/* Preview Section */}
          {showPreview && previewData && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Payroll Preview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {previewData.total_employees}
                  </p>
                  <p className="text-sm text-blue-700">Employees</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    ₦{previewData.total_gross_payment?.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-700">Gross Payment</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">
                    ₦{previewData.total_deductions?.toLocaleString()}
                  </p>
                  <p className="text-sm text-red-700">Deductions</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    ₦{previewData.total_net_payment?.toLocaleString()}
                  </p>
                  <p className="text-sm text-purple-700">Net Payment</p>
                </div>
              </div>
            </Card>
          )}

          {/* Actions */}
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCalculatePreview}
                disabled={calculatingPreview || selectedEmployees.length === 0}
              >
                {calculatingPreview && <Icon icon="lucide:loader-2" className="animate-spin mr-2" />}
                Calculate Preview
              </Button>

              <Button
                type="submit"
                disabled={generating || selectedEmployees.length === 0}
                className="flex-1 max-w-xs"
              >
                {generating && <Icon icon="lucide:loader-2" className="animate-spin mr-2" />}
                Generate Payroll
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              This will generate payroll for {selectedEmployees.length} selected employee(s)
            </p>
          </Card>
        </form>
      </Form>

      {/* Generated Payroll Report */}
      {showPayrollReport && generatedPayroll && (
        <PayrollReport
          data={generatedPayroll}
          onSave={handleSavePayroll}
          onCancel={() => {
            setShowPayrollReport(false);
            setGeneratedPayroll(null);
          }}
        />
      )}
    </div>
  );
};

export default PayrollCreate;