"use client";

import { useEffect, useState } from "react";
import NotificationProvider from "./NotificationProvider";

// This component ensures NotificationProvider only runs on client-side
export default function ClientOnlyNotificationProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // During SSR and hydration, just render children without notifications
  if (!isClient) {
    return <>{children}</>;
  }

  // Only after hydration is complete, add the notification functionality
  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  );
}