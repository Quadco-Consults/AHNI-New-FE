"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useParams } from "next/navigation";
import { useGetSinglePayroll } from "@/features/hr/controllers/hrPayRollController";
import GoBack from "components/GoBack";
import Summary from "./Summary";
import BreakDown from "./DetailedBreakdown";

const PayRollDetails = () => {
  const { id } = useParams();
  const [payrollData, setPayrollData] = React.useState<any>(null);

  // Load from localStorage
  React.useEffect(() => {
    const savedPayrolls = JSON.parse(localStorage.getItem("payrolls") || "[]");
    const payroll = savedPayrolls.find((p: any) => p.payroll_id === id);
    setPayrollData(payroll);
  }, [id]);

  if (!payrollData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading payroll data...</p>
      </div>
    );
  }

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
          <Summary {...payrollData} />
        </TabsContent>
        <TabsContent value='detailed-breakdown'>
          <BreakDown {...payrollData} payrollId={id as string} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PayRollDetails;
