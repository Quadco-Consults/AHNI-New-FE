"use client";

import BackNavigation from "@/components/BackNavigation";
import ConsumableDetails from "@/features/admin/components/inventory-management/ConsumableDetails";

export default function ViewConsumable() {
  return (
    <div>
      <BackNavigation />
      <div className="mt-8">
        <ConsumableDetails />
      </div>
    </div>
  );
}
