import Card from "components/shared/Card";
import GoBack from "components/shared/GoBack";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import StaffInformation from "./StaffInformation";
import Beneficiary from "./Beneficiary";
import IdCard from "./IdCard";
import BankAccount from "./BankAccount";
import AdditionalInfo from "./AdditionalInfo";
import Compensation from "./Compensation";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "components/shared/Loading";
import { useGetEmployeeOnboardingQuery } from "services/hrApi/hr-employee-onboarding";
import { EmployeeOnboarding } from "definations/hr-types/employee-onboarding";
import Goals from "./Goals";

const WorkforceDetail = () => {
  const { id } = useParams();

  const { data, isLoading } = useGetEmployeeOnboardingQuery({
    id: id as string,
  });

  // console.log(data);

  const TABS = [
    {
      label: "Staff Information",
      value: "staff_information",
      children: <StaffInformation info={data as EmployeeOnboarding} />,
    },
    {
      label: "Beneficiary",
      value: "beneficiary",
      children: <Beneficiary id={id as string} />,
    },
    {
      label: "ID Card",
      value: "id_card",
      children: <IdCard info={data as EmployeeOnboarding} />,
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
        ) : (
          <>
            {TABS.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                <Card className='px-6'>{tab.children}</Card>
              </TabsContent>
            ))}
          </>
        )}
      </Tabs>
    </div>
  );
};

export default WorkforceDetail;
