"use client";
import { useState } from "react";
import { Bell, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetNotifications, useGetUnreadCount, useMarkNotificationAsRead } from "@/features/notifications/controllers/notificationController";
import { TNotification } from "@/features/notifications/controllers/notificationController";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useVendorEvaluationReminders } from "@/features/procurement/hooks/useVendorEvaluationReminders";

export default function NotificationDropdown() {
  const { isLoggedIn } = useAuth();

  const { data: notifications, isLoading } = useGetNotifications({ page: 1, size: 5, enabled: isLoggedIn }); // Only show recent 5
  const { data: unreadCount } = useGetUnreadCount(isLoggedIn);
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { reminders, stats: vendorEvalStats } = useVendorEvaluationReminders();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Combine regular notification count with vendor evaluation reminders
  const totalUnread = (unreadCount?.count || 0) + vendorEvalStats.total;

  const handleNotificationClick = (notification: TNotification) => {
    // Mark as read if unread
    const isUnread = !notification.is_read || notification.status === "Pending";
    if (isUnread) {
      markAsRead(notification.id);
    }

    // Navigate to relevant module
    const routes: { [key: string]: string } = {
      'Project': '/dashboard/projects',
      'ExpenseAuthorization': '/dashboard/admin/expense-authorization',
      'Agreement': '/dashboard/c-and-g/agreements',
      'User': '/account',
      'ProcurementPlan': '/dashboard/procurement/procurement-plan',
      'PurchaseOrder': '/dashboard/procurement/purchase-order',
      'VehicleRequest': '/dashboard/admin/fleet-management/vehicle-request',
      'FuelRequest': '/dashboard/admin/fleet-management/fuel-request',
      'PaymentRequest': '/dashboard/admin/payment-request',
      'AssetMaintenance': '/dashboard/admin/asset-maintenance',
      'TravelExpenseReport': '/dashboard/admin/travel-expenses-report',
      'ConsultancyReport': '/dashboard/c-and-g/consultancy-report',
      'ContractRequest': '/dashboard/c-and-g/contract-request',
      'VendorEvaluation': '/dashboard/procurement/vendor-performance/form'
    };

    const route = routes[notification.module_type] || '/dashboard';
    router.push(route);
    setIsOpen(false);
  };

  const handleVendorReminderClick = (reminderId: string) => {
    router.push('/dashboard/procurement/vendor-performance/form');
    setIsOpen(false);
  };

  const handleViewAll = () => {
    router.push('/notifications');
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative hover:text-primary text-sm font-bold hover:cursor-pointer"
          )}
        >
          <Bell />
          {totalUnread > 0 && (
            <span className={cn(
              "absolute -top-2 -right-2 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] px-1",
              vendorEvalStats.overdue > 0 ? "bg-red-500" : "bg-blue-500"
            )}>
              {totalUnread > 99 ? '99+' : totalUnread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end">
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Notifications</h3>
            {totalUnread > 0 && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                {totalUnread} new
              </span>
            )}
          </div>
          {vendorEvalStats.total > 0 && (
            <div className="mt-2 text-xs text-gray-600">
              {vendorEvalStats.overdue > 0 && (
                <span className="text-red-600 font-medium">
                  {vendorEvalStats.overdue} overdue
                </span>
              )}
              {vendorEvalStats.overdue > 0 && vendorEvalStats.dueSoon > 0 && ", "}
              {vendorEvalStats.dueSoon > 0 && (
                <span className="text-orange-600 font-medium">
                  {vendorEvalStats.dueSoon} due soon
                </span>
              )}
              {" "}vendor evaluation(s)
            </div>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {/* Vendor Evaluation Reminders */}
          {reminders.length > 0 && (
            <div className="border-b border-gray-200">
              <div className="p-3 bg-orange-50 border-b border-orange-100">
                <p className="text-xs font-semibold text-orange-800 uppercase">
                  Vendor Evaluations
                </p>
              </div>
              {reminders.slice(0, 3).map((reminder) => (
                <div
                  key={reminder.id}
                  className={cn(
                    "flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100",
                    reminder.type === "OVERDUE" && "bg-red-50 border-l-4 border-l-red-500",
                    reminder.type === "DUE_SOON" && "bg-orange-50 border-l-4 border-l-orange-500"
                  )}
                  onClick={() => handleVendorReminderClick(reminder.id)}
                >
                  <div className="mt-1">
                    {reminder.type === "OVERDUE" ? (
                      <AlertCircle className="text-red-500" size={16} />
                    ) : (
                      <Clock className="text-orange-500" size={16} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        {reminder.vendor_name}
                      </p>
                      <Badge
                        className={cn(
                          "text-[10px] px-1.5 py-0.5",
                          reminder.priority === "URGENT" && "bg-red-500 text-white",
                          reminder.priority === "HIGH" && "bg-orange-500 text-white"
                        )}
                      >
                        {reminder.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {reminder.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {reminder.days_since_last_po} days ago
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {reminder.po_count} PO{reminder.po_count > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {reminders.length > 3 && (
                <div className="p-2 text-center">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      router.push('/dashboard/procurement/vendor-evaluation-dashboard');
                      setIsOpen(false);
                    }}
                  >
                    View all {reminders.length} vendor reminders →
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Regular Notifications */}
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Loading notifications...
            </div>
          ) : !notifications?.results || notifications.results.length === 0 ? (
            reminders.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="mx-auto h-8 w-8 mb-2 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : null
          ) : (
            <>
              {reminders.length > 0 && (
                <div className="p-3 bg-blue-50 border-b border-blue-100">
                  <p className="text-xs font-semibold text-blue-800 uppercase">
                    System Notifications
                  </p>
                </div>
              )}
              {notifications.results.map((notification) => {
              const isUnread = !notification.is_read || notification.status === "Pending";
              
              return (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors",
                    isUnread && "bg-blue-50 border-l-4 border-l-blue-500"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {isUnread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p className={cn(
                        "text-sm font-medium truncate",
                        isUnread ? "text-gray-900" : "text-gray-600"
                      )}>
                        {notification.title}
                      </p>
                      <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                        {new Date(notification.created_datetime).toLocaleDateString("en-US")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {notification.module_type}
                    </p>
                  </div>
                </div>
              );
            })
            }
            </>
          )}
        </div>

        {notifications?.results && notifications.results.length > 0 && (
          <div className="border-t border-gray-200 p-4">
            <Button
              onClick={handleViewAll}
              variant="outline"
              className="w-full"
            >
              View All Notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}