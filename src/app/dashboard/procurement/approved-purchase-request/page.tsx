"use client";

import BreadcrumbCard from "@/components/Breadcrumb";
import PurchaseRequest from "@/features/procurement/components/purchase-request/PurchaseRequest";

/**
 * Approved Purchase Request Page
 *
 * This page is specifically for Procurement department users.
 * It shows ONLY approved purchase requests without tabs.
 *
 * For full access to both Created and Approved requests,
 * users should access via Global Hub → Purchase Requests.
 */
export default function ApprovedPurchaseRequestPage() {
  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Approved Purchase Request", icon: false },
  ];

  return (
    <main className='min-h-screen space-y-8'>
      <BreadcrumbCard list={breadcrumbs} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Approved Purchase Requests</h1>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage approved purchase requests
            </p>
          </div>
        </div>

        <section className='w-full'>
          <PurchaseRequest status='approved' />
        </section>
      </div>
    </main>
  );
}
