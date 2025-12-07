"use client";

import VendorNotifications from "@/features/vendor-portal/components/VendorNotifications";

export default function VendorNotificationsPage() {
  return (
    <div className="space-y-6">
      <VendorNotifications showAll={true} />
    </div>
  );
}