"use client";

import { useState } from "react";
import { useVendorEvaluationReminders } from "@/features/procurement/hooks/useVendorEvaluationReminders";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Bell, X, AlertCircle, Clock, Info } from "lucide-react";
import { cn } from "lib/utils";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";

const VendorEvaluationNotifications = () => {
  const { reminders, stats, isLoading, hasOverdue, hasDueSoon } = useVendorEvaluationReminders();
  const [open, setOpen] = useState(false);

  const getIconForType = (type: string) => {
    switch (type) {
      case "OVERDUE":
        return <AlertCircle className="text-red-500" size={20} />;
      case "DUE_SOON":
        return <Clock className="text-orange-500" size={20} />;
      case "PENDING":
        return <Info className="text-blue-500" size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const showNotificationBadge = stats.total > 0;
  const urgentCount = stats.overdue + stats.dueSoon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Vendor evaluation notifications"
        >
          <Bell size={20} />
          {showNotificationBadge && (
            <Badge
              className={cn(
                "absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]",
                hasOverdue
                  ? "bg-red-500 text-white"
                  : hasDueSoon
                  ? "bg-orange-500 text-white"
                  : "bg-blue-500 text-white"
              )}
            >
              {stats.total > 9 ? "9+" : stats.total}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[580px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell size={24} />
            Vendor Evaluation Reminders
          </DialogTitle>
          <DialogDescription>
            {stats.total === 0 ? (
              "All vendors are up to date with evaluations!"
            ) : (
              <>
                {stats.overdue > 0 && (
                  <span className="text-red-600 font-semibold">
                    {stats.overdue} overdue
                  </span>
                )}
                {stats.overdue > 0 && stats.dueSoon > 0 && ", "}
                {stats.dueSoon > 0 && (
                  <span className="text-orange-600 font-semibold">
                    {stats.dueSoon} due soon
                  </span>
                )}
                {urgentCount > 0 && stats.pending > 0 && ", "}
                {stats.pending > 0 && (
                  <span className="text-blue-600">
                    {stats.pending} pending
                  </span>
                )}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : reminders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="mx-auto mb-2 text-gray-400" size={48} />
              <p>No pending evaluations</p>
              <p className="text-sm">All vendors are up to date!</p>
            </div>
          ) : (
            <>
              {/* Summary Card */}
              {urgentCount > 0 && (
                <div
                  className={cn(
                    "p-4 rounded-lg border-2",
                    hasOverdue
                      ? "bg-red-50 border-red-200"
                      : "bg-orange-50 border-orange-200"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      className={hasOverdue ? "text-red-600" : "text-orange-600"}
                      size={20}
                    />
                    <div className="flex-1">
                      <h3
                        className={cn(
                          "font-semibold text-sm",
                          hasOverdue ? "text-red-800" : "text-orange-800"
                        )}
                      >
                        {urgentCount} Vendor{urgentCount > 1 ? "s" : ""} Require{urgentCount === 1 ? "s" : ""} Attention
                      </h3>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          hasOverdue ? "text-red-700" : "text-orange-700"
                        )}
                      >
                        {hasOverdue
                          ? "Some evaluations are overdue. Please prioritize these vendors."
                          : "These evaluations are due soon."}
                      </p>
                      <Link href="/dashboard/procurement/vendor-evaluation-dashboard">
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2 text-xs"
                          onClick={() => setOpen(false)}
                        >
                          View Dashboard
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Reminder List */}
              <div className="space-y-2">
                {reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className={cn(
                      "p-3 rounded-lg border",
                      reminder.type === "OVERDUE" && "bg-red-50 border-red-200",
                      reminder.type === "DUE_SOON" && "bg-orange-50 border-orange-200",
                      reminder.type === "PENDING" && "bg-blue-50 border-blue-200"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {getIconForType(reminder.type)}
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{reminder.vendor_name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{reminder.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            className={cn(
                              "text-[10px] px-2 py-0.5",
                              reminder.priority === "URGENT" && "bg-red-500 text-white",
                              reminder.priority === "HIGH" && "bg-orange-500 text-white",
                              reminder.priority === "MEDIUM" && "bg-yellow-500 text-white"
                            )}
                          >
                            {reminder.priority}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {reminder.po_count} PO{reminder.po_count > 1 ? "s" : ""}
                          </span>
                          <span className="text-xs text-gray-500">
                            {reminder.days_since_last_po} days ago
                          </span>
                        </div>
                        <Link href={reminder.action_url}>
                          <Button
                            size="sm"
                            variant="link"
                            className="mt-1 p-0 h-auto text-xs"
                            onClick={() => setOpen(false)}
                          >
                            Create Evaluation →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t">
                <Link href="/dashboard/procurement/vendor-evaluation-dashboard">
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    View All Evaluations
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VendorEvaluationNotifications;
