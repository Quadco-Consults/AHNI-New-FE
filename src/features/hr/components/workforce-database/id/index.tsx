"use client";

import Card from "components/Card";
import GoBack from "components/GoBack";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import StaffInformation from "./StaffInformation";
import Beneficiary from "./Beneficiary";
import IdCard from "./IdCard";
import BankAccount from "./BankAccount";
import AdditionalInfo from "./AdditionalInfo";
import Compensation from "./Compensation";
import { useParams } from "next/navigation";
import { LoadingSpinner } from "components/Loading";
import { useGetEmployeeOnboarding } from "@/features/hr/controllers/employeeOnboardingController";
import { useGetSingleUser } from "@/features/auth/controllers/userController";
import { EmployeeOnboarding } from "definations/hr-types/employee-onboarding";
import Goals from "./Goals";

const WorkforceDetail = () => {
  const { id } = useParams();

  const { data: employeeData, isLoading: employeeLoading, error: employeeError } = useGetEmployeeOnboarding(id as string, !!id);
  const { data: userData, isLoading: userLoading, error: userError } = useGetSingleUser(id as string, !!employeeError && !!id);

  // Use employee data if available, otherwise transform user data to employee format
  const data = employeeData || (userData ? {
    data: {
      id: userData.data.id,
      legal_firstname: userData.data.first_name,
      legal_lastname: userData.data.last_name,
      email: userData.data.email,
      employment_type: "Staff",
      position: userData.data.position,
      serial_id_code: `AHNI-${userData.data.id.slice(0, 8)}`,
      designation: { name: userData.data.position },
      location: { email: userData.data.email },
      department: userData.data.department
    }
  } : null);

  const isLoading = employeeLoading || userLoading;
  const error = employeeError && userError ? userError : null;

  console.log("Employee data:", employeeData);
  console.log("User data:", userData);
  console.log("Combined data:", data);
  console.log("ID from params:", id);

  const TABS = [
    {
      label: "Staff Information",
      value: "staff_information",
      children: <StaffInformation info={data?.data || data as EmployeeOnboarding} />,
    },
    {
      label: "Beneficiary",
      value: "beneficiary",
      children: <Beneficiary id={id as string} />,
    },
    {
      label: "ID Card",
      value: "id_card",
      children: <IdCard info={data?.data || data as EmployeeOnboarding} />,
    },
    {
      label: "Compensation and Benefit",
      value: "compensation_and_benefit",
      children: <Compensation />,
    },
    {
      label: "Bank Account & Pension",
      value: "bank_account_and_benefit",
      children: <BankAccount />,
    },
    {
      label: "Additional Information",
      value: "additional_information",
      children: <AdditionalInfo />,
    },
    {
      label: "Goals",
      value: "goal",
      children: <Goals />,
    },
  ];

  return (
    <div className='space-y-6'>
      <GoBack />

      <Tabs defaultValue='staff_information'>
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {isLoading ? (
          <LoadingSpinner />
        ) : data ? (
          <>
            {TABS.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                <Card className='px-6'>{tab.children}</Card>
              </TabsContent>
            ))}
          </>
        ) : error ? (
          <div className="p-4 text-center text-red-600">
            Error loading employee data: {error.message}
            <br />
            <small>Employee ID: {id}</small>
          </div>
        ) : (
          <div className="p-4 text-center">No employee data found</div>
        )}
      </Tabs>
    </div>
  );
};

export default WorkforceDetail;
