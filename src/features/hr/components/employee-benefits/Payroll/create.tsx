"use client";

import React from "react";
import { Button } from "components/ui/button";
import Card from "components/Card";
import { useRouter } from "next/navigation";

const PayrollCreate: React.FC = () => {
  const router = useRouter();

  const handleGeneratePayroll = () => {
    // TODO: Implement payroll generation logic
    console.log("Generating payroll...");
  };

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

      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Payroll Generation</h2>
          <p className="text-gray-600">
            Generate payroll for employees based on their compensation and attendance.
          </p>
          
          <div className="pt-4">
            <Button onClick={handleGeneratePayroll}>
              Generate Payroll
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PayrollCreate;