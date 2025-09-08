"use client";

import React from "react";
import { useAppSelector, useAppDispatch } from "hooks/useStore";
import { dailogSelector, closeDialog } from "store/ui";
import { BaseDialog } from "components/modals/dialog/BaseDialog";
import FundRequestApprovalSignatureForm from "../fund-request/components/FundRequestApprovalSignatureForm";
import { useGetSingleFundRequest } from "@/features/programs/controllers/fundRequestController";

const FundRequestSignatureModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { dialogProps } = useAppSelector(dailogSelector);
  const { fundRequestId, currentStatus, width = "max-w-4xl" } = dialogProps || {};

  const { data: fundRequestData, isLoading } = useGetSingleFundRequest(fundRequestId);

  const handleClose = () => {
    dispatch(closeDialog());
  };

  if (isLoading) {
    return (
      <BaseDialog onClose={handleClose} width={width}>
        <div className="p-6 text-center">
          <div>Loading fund request data...</div>
        </div>
      </BaseDialog>
    );
  }

  if (!fundRequestData?.data) {
    return (
      <BaseDialog onClose={handleClose} width={width}>
        <div className="p-6 text-center">
          <div>Fund request not found</div>
        </div>
      </BaseDialog>
    );
  }

  return (
    <BaseDialog onClose={handleClose} width={width}>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Fund Request Authorization & Approval</h2>
          <p className="text-sm text-gray-600 mt-1">
            Project Head Office Authorization and AHNI Head Office Approval signatures and dates
          </p>
        </div>
        
        <FundRequestApprovalSignatureForm
          fundRequestData={fundRequestData.data}
          currentStatus={currentStatus}
        />
      </div>
    </BaseDialog>
  );
};

export default FundRequestSignatureModal;