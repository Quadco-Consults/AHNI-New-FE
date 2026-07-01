"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ServiceOrderEligiblePRSelector } from "@/components/procurement/SmartPRSelector";
import { useCreateServiceOrder } from "@/hooks/useServiceOrders";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateServiceOrderPage() {
  const router = useRouter();
  const createMutation = useCreateServiceOrder();

  const handleSelectPR = async (pr: any) => {
    try {
      // Extract service items from PR
      const items = pr.items.map((item: any) => ({
        item: item.id,
        description: item.name,
        quantity: item.quantity || 1,
        unit_price: item.unit_cost || item.amount,
        unit_of_measure: item.unit_of_measure || "units",
      }));

      // Navigate to form page with PR data
      // Store PR data in sessionStorage for the form
      sessionStorage.setItem(
        "selectedPRForSO",
        JSON.stringify({
          prId: pr.id,
          prRefNumber: pr.ref_number,
          items: items,
          totalCost: pr.total_cost,
        })
      );

      router.push(`/dashboard/procurement/service-orders/create/form`);
    } catch (error) {
      console.error("Error selecting PR:", error);
      toast.error("Failed to select Purchase Request");
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Service Order</h1>
          <p className="text-muted-foreground">
            Select a Purchase Request with recurring services to create a Service Order
          </p>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-base">What are Service Orders?</CardTitle>
          <CardDescription>
            Service Orders are for recurring services with known vendors such as:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            <li>• Flight tickets and travel bookings</li>
            <li>• Data bundles and internet subscriptions</li>
            <li>• Feeding and catering services</li>
            <li>• Fuel and diesel supplies</li>
            <li>• Printing and photocopying</li>
            <li>• Courier and delivery services</li>
          </ul>
        </CardContent>
      </Card>

      {/* PR Selector */}
      <ServiceOrderEligiblePRSelector onSelectPR={handleSelectPR} />
    </div>
  );
}
