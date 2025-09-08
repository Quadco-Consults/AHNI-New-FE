"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

// Minimal notification interface for this provider
interface MinimalNotification {
  id: string;
  title: string;
  message: string;
}

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isClient } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const [notifications, setNotifications] = useState<MinimalNotification[]>([]);
  const previousNotificationsRef = useRef<string[]>([]);

  // Wait for client-side hydration and auth initialization
  useEffect(() => {
    if (isClient) {
      // Add a small delay to ensure auth system is fully initialized
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 3000); // 3 second delay for extra safety
      
      return () => clearTimeout(timer);
    }
  }, [isClient]);

  // Manual notification fetching to avoid query conflicts
  useEffect(() => {
    if (!isReady || !isLoggedIn) return;

    let isSubscribed = true;

    const fetchNotifications = async () => {
      try {
        // Double check token exists before making request
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, skipping notification fetch");
          return;
        }

        const response = await AxiosWithToken.get("/notifications", {
          params: {
            page: 1,
            size: 10
          }
        });
        
        if (isSubscribed && response.data?.results) {
          setNotifications(response.data.results);
        }
      } catch (error: any) {
        // Silently fail for authentication errors to avoid loops
        if (error.response?.status === 401) {
          console.log("Authentication failed for notifications, user may need to login");
          return;
        }
        console.log("Notification fetch failed:", error.message);
      }
    };

    // Initial fetch after a short delay
    const initialTimer = setTimeout(() => {
      fetchNotifications();
    }, 1000);

    // Poll every 2 minutes (less aggressive)
    const interval = setInterval(fetchNotifications, 120000);

    return () => {
      isSubscribed = false;
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isReady, isLoggedIn]);

  // Handle new notification toasts
  useEffect(() => {
    if (notifications.length === 0) return;

    const currentNotificationIds = notifications.map(n => n.id);
    const previousNotificationIds = previousNotificationsRef.current;

    // Only show toasts if we have previous notifications (not on initial load)
    if (previousNotificationIds.length > 0) {
      const newNotifications = notifications.filter(
        notification => !previousNotificationIds.includes(notification.id)
      );

      // Show toast for new notifications (max 2 to avoid spam)
      newNotifications.slice(0, 2).forEach(notification => {
        toast.info(notification.title, {
          description: notification.message,
          action: {
            label: "View",
            onClick: () => {
              window.location.href = "/notifications";
            },
          },
          duration: 10000, // Longer duration
        });
      });
    }

    // Update the ref with current notification IDs
    previousNotificationsRef.current = currentNotificationIds;
  }, [notifications]);

  return <>{children}</>;
}