"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useGetNotifications } from "@/features/notifications/controllers/notificationController";

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { data: notifications, isError } = useGetNotifications({ 
    page: 1, 
    size: 10 // Just get recent notifications for toast alerts
  });
  const previousNotificationsRef = useRef<string[]>([]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch notifications.");
      return;
    }

    if (notifications?.results) {
      const currentNotificationIds = notifications.results.map(n => n.id);
      const previousNotificationIds = previousNotificationsRef.current;

      // Check for new notifications
      if (previousNotificationIds.length > 0) {
        const newNotifications = notifications.results.filter(
          notification => !previousNotificationIds.includes(notification.id)
        );

        // Show toast for new notifications
        newNotifications.forEach(notification => {
          toast.info(notification.title, {
            description: notification.message,
            action: {
              label: "View",
              onClick: () => {
                window.location.href = "/notifications";
              },
            },
            duration: 5000,
          });
        });
      }

      // Update the ref with current notification IDs
      previousNotificationsRef.current = currentNotificationIds;
    }
  }, [notifications, isError]);

  return <>{children}</>;
}