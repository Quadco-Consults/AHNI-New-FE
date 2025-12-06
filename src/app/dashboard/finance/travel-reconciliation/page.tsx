"use client";

import React from "react";
import TravelReconciliationWorkflow from "@/features/finance/components/travel-reconciliation/TravelReconciliationWorkflow";

export default function TravelReconciliationPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Travel Reconciliation</h1>
          <p className="text-gray-600 mt-1">
            Manage travel expense reconciliations, process reimbursements, and handle fund retirements
          </p>
        </div>

        <TravelReconciliationWorkflow />
      </div>
    </div>
  );
}