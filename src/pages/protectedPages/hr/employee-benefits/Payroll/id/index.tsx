import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";

import { useParams } from "react-router-dom";
import VendorsAPI from "services/procurementApi/vendors";
// import { LoadingSpinner } from "components/shared/Loading";

import GoBack from "components/shared/GoBack";

import Summary from "./Summary";
import BreakDown from "./DetailedBreakdown";

const PayRollDetails = () => {
  const { id } = useParams();

  const { data: grData } = VendorsAPI.useGetVendorQuery({
    path: { id: id as string },
  });

  console.log({ grData });

  //   if (isLoading) {
  //     return <LoadingSpinner />;
  //   }
  const data: any = [];
  return (
    <div className='space-y-5'>
      <Tabs defaultValue='payroll-summary'>
        <div className='flex items-center gap-3'>
          <GoBack />
          <TabsList>
            <TabsTrigger value='payroll-summary'>Payroll Summary</TabsTrigger>
            <TabsTrigger value='detailed-breakdown'>
              Detailed Breakdown
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value='payroll-summary'>
          <Summary {...(data as any)} />
        </TabsContent>
        <TabsContent value='detailed-breakdown'>
          <BreakDown {...(data as any)} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PayRollDetails;
