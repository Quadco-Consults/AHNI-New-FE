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
import { useGetWorkforceQuery } from "services/hrApi/workforce";
import { LoadingSpinner } from "components/shared/Loading";
import { WorkforceResults } from "definations/hr-types/workforce";

const WorkforceDetail = () => {
  const { id } = useParams();

  const { data, isLoading } = useGetWorkforceQuery({
    path: { id: id as string },
  });

  const TABS = [
    {
      label: "Staff Information",
      value: "staff_information",
      children: <StaffInformation data={data as WorkforceResults} />,
    },
    {
      label: "Beneficiary",
      value: "beneficiary",
      children: <Beneficiary />,
    },
    {
      label: "ID Card",
      value: "id_card",
      children: <IdCard />,
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
      children: <AdditionalInfo data={data as WorkforceResults} />,
    },
  ];

  return (
    <div className="space-y-6">
      <GoBack />

      <Tabs defaultValue="staff_information">
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
                <Card className="px-6">{tab.children}</Card>
              </TabsContent>
            ))}
          </>
        )}
      </Tabs>
    </div>
  );
};

export default WorkforceDetail;
