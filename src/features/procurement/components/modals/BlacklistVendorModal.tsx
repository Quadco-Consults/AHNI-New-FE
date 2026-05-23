"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import FormButton from "@/components/FormButton";
import { useBlacklistVendor } from "@/features/procurement/controllers/vendorsController";
import { AlertTriangle } from "lucide-react";

interface BlacklistVendorModalProps {
  vendorId: string;
  vendorName: string;
  onClose?: () => void;
}

export default function BlacklistVendorModal({
  vendorId,
  vendorName,
  onClose
}: BlacklistVendorModalProps) {
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");

  const { blacklistVendor, isLoading } = useBlacklistVendor(vendorId);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!reason.trim()) {
      toast.error("Please provide a reason for blacklisting this vendor");
      return;
    }

    try {
      await blacklistVendor({ reason, comments });
      toast.success(`${vendorName} has been blacklisted successfully`);
      onClose?.();
    } catch (error: any) {
      toast.error(error?.message || "Failed to blacklist vendor. Please try again.");
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full space-y-6">
      {/* Warning Header */}
      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
        <AlertTriangle className="text-red-600 mt-0.5" size={24} />
        <div>
          <h2 className="text-lg font-bold text-red-900">Blacklist Vendor</h2>
          <p className="text-sm text-red-700 mt-1">
            You are about to blacklist <span className="font-semibold">{vendorName}</span>.
            This will immediately bar them from future procurement activities without requiring a formal evaluation.
          </p>
        </div>
      </div>

      {/* Reason Field (Required) */}
      <div className="space-y-3">
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
          Reason for Blacklisting <span className="text-red-500">*</span>
        </label>
        <select
          name="reason"
          id="reason"
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border p-2.5 rounded-md border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
        >
          <option value="">Select a reason</option>
          <option value="Fraud or Misrepresentation">Fraud or Misrepresentation</option>
          <option value="Breach of Contract">Breach of Contract</option>
          <option value="Poor Quality of Goods/Services">Poor Quality of Goods/Services</option>
          <option value="Repeated Delivery Failures">Repeated Delivery Failures</option>
          <option value="Non-Compliance with Regulations">Non-Compliance with Regulations</option>
          <option value="Unethical Business Practices">Unethical Business Practices</option>
          <option value="Financial Irregularities">Financial Irregularities</option>
          <option value="Safety Violations">Safety Violations</option>
          <option value="Other Serious Misconduct">Other Serious Misconduct</option>
        </select>
      </div>

      {/* Additional Comments (Optional) */}
      <div className="space-y-3">
        <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
          Additional Comments (Optional)
        </label>
        <textarea
          name="comments"
          id="comments"
          placeholder="Provide additional details or evidence for the blacklisting decision..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={5}
          className="w-full border p-2.5 rounded-md border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none resize-none"
        />
      </div>

      {/* Confirmation Notice */}
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <span className="font-semibold">Note:</span> This action will update the vendor's evaluation status to "BARRED"
          and prevent them from being selected for future RFQs and Purchase Orders. This action can be reversed by authorized personnel if needed.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <FormButton
          type="submit"
          loading={isLoading}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Blacklist Vendor
        </FormButton>
      </div>
    </form>
  );
}
