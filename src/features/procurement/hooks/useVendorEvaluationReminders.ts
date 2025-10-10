import { useMemo } from "react";
import { useGetAllVendorEvaluations } from "@/features/procurement/controllers/vendorPerformanceEvaluationController";
import { useGetAllProcurementTrackers } from "@/features/procurement/controllers/procurementTrackerController";

export interface VendorEvaluationReminder {
  id: string;
  vendor_name: string;
  vendor_id: string;
  type: "OVERDUE" | "DUE_SOON" | "PENDING";
  priority: "URGENT" | "HIGH" | "MEDIUM";
  days_since_last_po: number;
  last_po_date: string;
  po_count: number;
  message: string;
  action_url: string;
}

export const useVendorEvaluationReminders = () => {
  const { data: evaluationsData, isLoading: evaluationsLoading } = useGetAllVendorEvaluations({
    page: 1,
    size: 100,
  });

  const { data: trackerData, isLoading: trackerLoading } = useGetAllProcurementTrackers({
    page: 1,
    size: 100,
  });

  const reminders = useMemo<VendorEvaluationReminder[]>(() => {
    if (!trackerData?.results) return [];

    const vendorMap = new Map<string, any>();
    const today = new Date();

    // Process procurement tracker data to find vendors with POs
    trackerData.results.forEach((item: any) => {
      const vendorName = item.purchase_order?.vendor || "Unknown";
      const poDate = item.purchase_order?.po_date || item.request_date;

      if (!vendorName || vendorName === "Unknown") return;

      if (!vendorMap.has(vendorName)) {
        vendorMap.set(vendorName, {
          vendor_id: item.purchase_order?.vendor_id || vendorName,
          vendor_name: vendorName,
          po_count: 0,
          last_po_date: poDate,
          has_evaluation: false,
        });
      }

      const vendor = vendorMap.get(vendorName)!;
      vendor.po_count += 1;

      // Update last PO date if this one is more recent
      if (poDate && new Date(poDate) > new Date(vendor.last_po_date)) {
        vendor.last_po_date = poDate;
      }
    });

    // Check which vendors have evaluations
    const evaluations = evaluationsData?.data?.results || [];
    evaluations.forEach((evaluation: any) => {
      const vendorName = evaluation.vendor?.name;
      if (vendorName && vendorMap.has(vendorName)) {
        const vendor = vendorMap.get(vendorName)!;
        if (evaluation.status === "COMPLETED") {
          vendor.has_evaluation = true;
          vendor.evaluation_id = evaluation.id;
        }
      }
    });

    // Create reminders for vendors without evaluations
    const reminderList: VendorEvaluationReminder[] = [];

    vendorMap.forEach((vendor) => {
      if (vendor.has_evaluation) return; // Skip vendors with completed evaluations

      const lastPoDate = new Date(vendor.last_po_date);
      const daysSince = Math.floor((today.getTime() - lastPoDate.getTime()) / (1000 * 60 * 60 * 24));

      let reminder: VendorEvaluationReminder | null = null;

      if (daysSince > 30) {
        reminder = {
          id: `reminder-${vendor.vendor_id}`,
          vendor_name: vendor.vendor_name,
          vendor_id: vendor.vendor_id,
          type: "OVERDUE",
          priority: "URGENT",
          days_since_last_po: daysSince,
          last_po_date: vendor.last_po_date,
          po_count: vendor.po_count,
          message: `${vendor.vendor_name} has ${vendor.po_count} PO(s) and is ${daysSince} days overdue for evaluation.`,
          action_url: "/dashboard/procurement/vendor-performance/form",
        };
      } else if (daysSince > 15) {
        reminder = {
          id: `reminder-${vendor.vendor_id}`,
          vendor_name: vendor.vendor_name,
          vendor_id: vendor.vendor_id,
          type: "DUE_SOON",
          priority: "HIGH",
          days_since_last_po: daysSince,
          last_po_date: vendor.last_po_date,
          po_count: vendor.po_count,
          message: `${vendor.vendor_name} evaluation is due soon (${daysSince} days since last PO).`,
          action_url: "/dashboard/procurement/vendor-performance/form",
        };
      } else if (daysSince > 7) {
        reminder = {
          id: `reminder-${vendor.vendor_id}`,
          vendor_name: vendor.vendor_name,
          vendor_id: vendor.vendor_id,
          type: "PENDING",
          priority: "MEDIUM",
          days_since_last_po: daysSince,
          last_po_date: vendor.last_po_date,
          po_count: vendor.po_count,
          message: `${vendor.vendor_name} should be scheduled for evaluation (${daysSince} days since last PO).`,
          action_url: "/dashboard/procurement/vendor-performance/form",
        };
      }

      if (reminder) {
        reminderList.push(reminder);
      }
    });

    // Sort by priority and days since last PO
    return reminderList.sort((a, b) => {
      const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.days_since_last_po - a.days_since_last_po;
    });
  }, [trackerData, evaluationsData]);

  const stats = useMemo(() => {
    const total = reminders.length;
    const overdue = reminders.filter((r) => r.type === "OVERDUE").length;
    const dueSoon = reminders.filter((r) => r.type === "DUE_SOON").length;
    const pending = reminders.filter((r) => r.type === "PENDING").length;

    return { total, overdue, dueSoon, pending };
  }, [reminders]);

  return {
    reminders,
    stats,
    isLoading: evaluationsLoading || trackerLoading,
    hasOverdue: stats.overdue > 0,
    hasDueSoon: stats.dueSoon > 0,
  };
};
