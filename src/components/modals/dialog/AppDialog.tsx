"use client";

import { useAppSelector } from "@/hooks/useStore";
import { dailogSelector } from "@/store/ui";
import { BaseDialog } from "./BaseDialog";
import React, { useState, useEffect } from "react";
import { DialogType } from "@/constants/dailogs";
import dynamic from "next/dynamic";

import { LoadingSpinner } from "@/components/Loading";

// Loading component for modals
const ModalLoading = () => (
  <div className="py-8">
    <LoadingSpinner text="Loading..." />
  </div>
);

// Modal component map for dynamic loading
const modalComponentMap: Record<string, () => Promise<{default: React.ComponentType<any>}>> = {
  [DialogType.ProjectObjectiveModal]: () => import("@/features/projects/components/modals/ProjectObjectiveModal"),
  [DialogType.ConsortiumModal]: () => import("@/features/projects/components/modals/ConsortiumModal"),
  [DialogType.ProjectUploadModal]: () => import("@/features/projects/components/modals/ProjectUploadModal"),
  [DialogType.ProjectDetailsUploadModal]: () => import("@/features/projects/components/modals/ProjectDetailsUploadModal"),
  [DialogType.ChangeProjectStatusModal]: () => import("@/features/projects/components/modals/ChangeProjectStatusModal"),
  [DialogType.WorkPlanUpload]: () => import("@/features/programs/components/modals/WorkPlanUploadModal"),
  [DialogType.ActivityUpload]: () => import("@/features/programs/components/modals/ActivityUploadModal"),
  [DialogType.RiskManagementPlanUpload]: () => import("@/features/programs/components/modals/RiskManagementPlanUploadModal"),
  [DialogType.AuditLog]: () => import("@/features/admin/components/audit-log/ViewLog"),
  [DialogType.Categories]: () => import("@/features/procurement/components/modals/CategoriesModal"),
  [DialogType.PriceInteligence]: () => import("@/features/procurement/components/modals/PriceModal"),
  [DialogType.Checklist]: () => import("@/features/procurement/components/modals/EvaluationCriteriaModal"),
  [DialogType.AddTicket]: () => import("@/features/support/components/modals/AddTicketModal"),
  [DialogType.ActivityTrackerModal]: () => import("@/features/programs/components/modals/ActivityTrackerModal"),
  [DialogType.SspUpload]: () => import("@/features/programs/components/modals/SspUploadModal"),
  [DialogType.SspApproveModal]: () => import("@/features/programs/components/modals/SspApproveModal"),
  [DialogType.SuccessModal]: () => import("@/features/common/components/modals/SuccessModal"),
  [DialogType.FundSuccessModal]: () => import("@/features/programs/components/modals/FundSuccessModal"),
  [DialogType.PreventionModal]: () => import("@/features/programs/components/modals/PreventionModal"),
  [DialogType.AssestAction]: () => import("@/features/admin/components/modals/AssestAction"),
  [DialogType.FundRequestModal]: () => import("@/features/programs/components/modals/FundRequestModal"),
  [DialogType.StateModal]: () => import("@/features/admin/components/modals/StateModal"),
  [DialogType.FundRequstSummaryModal]: () => import("@/features/programs/components/modals/FundRequestSummaryModal"),
  [DialogType.StakeholderModal]: () => import("@/features/programs/components/modals/StakeholderModal"),
  [DialogType.EditUser]: () => import("@/features/auth/components/Users/EditUser"),
  [DialogType.AssingRoleToUser]: () => import("@/features/auth/components/AssignRole"),
  [DialogType.SspSubmitModal]: () => import("@/features/programs/components/modals/sspSubmitModal"),
  [DialogType.ExpenditureModal]: () => import("@/features/contracts-grants/components/modals/ExpenditureModal"),
  [DialogType.AddPermissionToRole]: () => import("@/features/auth/components/AssignPermission"),
  [DialogType.ConsultancyApplicationSuccess]: () => import("@/features/contracts-grants/components/modals/ConsultancyApplicationSuccessModal"),
  [DialogType.AddStock]: () => import("@/features/admin/components/consumables/AddStock"),
  [DialogType.AddMarketPrice]: () => import("@/features/admin/components/config/AddMarketPrice"),
  [DialogType.AddNewItems]: () => import("@/features/procurement/components/AddNewItems"),
  [DialogType.AddTeamMenbers]: () => import("@/features/programs/components/modals/TeamMemberSelection"),
  [DialogType.AddFundingSource]: () => import("@/features/projects/components/modules/AddFundingSource"),
  [DialogType.AddBeneficiaries]: () => import("@/features/projects/components/modules/AddBeneficiary"),
  [DialogType.AddDocumentTypes]: () => import("@/features/projects/components/modules/AddDocumentType"),
  [DialogType.AddPartners]: () => import("@/features/projects/components/modules/AddPartner"),
  [DialogType.AddRiskCategory]: () => import("@/features/programs/components/AddRiskCategory"),
  [DialogType.AddInterventionArea]: () => import("@/features/programs/components/AddInterventionArea"),
  [DialogType.AddModule]: () => import("@/features/programs/components/AddModule"),
  [DialogType.AddSupervisionCategory]: () => import("@/features/programs/components/AddSupervisionCategory"),
  [DialogType.AddSupervisionCriteria]: () => import("@/features/programs/components/modals/AddSupervisionCriteria"),
  [DialogType.AddFacility]: () => import("@/features/programs/components/AddFacility"),
  [DialogType.AddAssetConditions]: () => import("@/features/admin/components/AddAssetConditions"),
  [DialogType.AddAssetTypes]: () => import("@/features/admin/components/AddAssetTypes"),
  [DialogType.AddCategories]: () => import("@/features/admin/components/config/AddCategories"),
  [DialogType.AddSubcategories]: () => import("@/features/admin/components/config/AddSubcategories"),
  [DialogType.AddDepartments]: () => import("@/features/admin/components/config/AddDepartments"),
  [DialogType.AddFinancialYear]: () => import("@/features/admin/components/config/AddFinancialYear"),
  [DialogType.AddItems]: () => import("@/features/admin/components/config/AddItems"),
  [DialogType.AddLocations]: () => import("@/features/admin/components/config/AddLocations"),
  [DialogType.AddClusters]: () => import("@/features/admin/components/config/AddClusters"),
  [DialogType.AddStates]: () => import("@/features/admin/components/config/AddStates"),
  [DialogType.AddLots]: () => import("@/features/procurement/components/AddLots"),
  [DialogType.AddSolicitation]: () => import("@/features/procurement/components/modals/AddSolicitationModal"),
  [DialogType.AddPrequalificationCategory]: () => import("@/features/procurement/components/AddPrequalificationCategory"),
  [DialogType.AddPrequalificationCriteria]: () => import("@/features/procurement/components/AddPrequalificationCriteria"),
  [DialogType.AddQuestionairs]: () => import("@/features/procurement/components/AddQuestionairs"),
  [DialogType.AddCostCategory]: () => import("@/features/admin/components/finance/AddCostCategory"),
  [DialogType.AddBudgetLine]: () => import("@/features/admin/components/finance/AddBudgetLine"),
  [DialogType.AddCostInput]: () => import("@/features/admin/components/finance/AddCostInput"),
  [DialogType.AddCostGrouping]: () => import("@/features/admin/components/finance/AddCostGrouping"),
  [DialogType.AddFcoNumber]: () => import("@/features/admin/components/finance/AddFcoNumber"),
  [DialogType.AddProjectClasses]: () => import("@/features/admin/components/finance/AddProjectClasses"),
  [DialogType.AddChartsOfAccounts]: () => import("@/features/admin/components/finance/AddChartsOfAccount"),
  [DialogType.ProcurementUploadModal]: () => import("@/features/procurement/components/modals/ProcurementUploadModal"),
  [DialogType.HrSuccessModal]: () => import("@/features/hr/components/modals/HrSuccessModal"),
  [DialogType.ApprovalModal]: () => import("@/features/common/components/modals/ApprovalModal"),
  [DialogType.FeedbackModal]: () => import("@/features/common/components/modals/FeedbackModal"),
  [DialogType.AddNewRoleModal]: () => import("@/features/admin/components/modals/AddNewRoleModal"),
  [DialogType.ChangeRiskStatusModal]: () => import("@/features/programs/components/modals/ChangeRiskStatusModal"),
  [DialogType.AddPosition]: () => import("@/features/admin/components/config/AddPosition"),
  [DialogType.AddGrade]: () => import("@/features/admin/components/config/AddGrade"),
  [DialogType.AddLevel]: () => import("@/features/admin/components/config/AddLevel"),
  [DialogType.AddAssetClassification]: () => import("@/features/admin/components/AddAssetClassification"),
  [DialogType.AddExchangeRate]: () => import("@/features/admin/components/config/AddExchangeRate"),
  [DialogType.AddTravelRate]: () => import("@/features/admin/components/config/AddTravelRate"),
  [DialogType.ChangeWorkPlanStatusModal]: () => import("@/features/programs/components/modals/ChangeWorkPlanStatusModal"),
  [DialogType.ChangeProcurementTrackerStatusModal]: () => import("@/features/procurement/components/modals/ChangeProcurementTrackerStatusModal"),
  [DialogType.ChangeProcurementTrackerRemarkModal]: () => import("@/features/procurement/components/modals/ChangeProcurementTrackerRemarkModal"),
  [DialogType.AssignToModal]: () => import("@/features/common/components/modals/AssignToModal"),
  [DialogType.AssignPurchaseRequestModal]: () => import("@/features/procurement/components/modals/AssignPurchaseRequestModal"),
  [DialogType.EditValue]: () => import("@/features/hr/components/EditValue"),
  [DialogType.NewLeave]: () => import("@/features/hr/components/NewLeaveForm"),
  [DialogType.ADD_OBLIGATION_MODAL]: () => import("@/features/contracts-grants/components/modals/ObligationModal"),
  [DialogType.ADD_DISBURSEMENT_MODAL]: () => import("@/features/contracts-grants/components/modals/DisbursementModal"),
  [DialogType.SUBGRANT_MANUAL_SUB_UPLOAD]: () => import("@/features/contracts-grants/components/modals/SubGrantSubUploadModal"),
  [DialogType.ADD_PRE_AWARD_QUESTION_MODAL]: () => import("@/features/contracts-grants/components/AddPreAwardQuestion"),
  [DialogType.MODIFY_GRANT]: () => import("@/features/contracts-grants/components/table-columns/grant/addModification"),
  [DialogType.ACTIVITY_PLAN_STATUS_MODAL]: () => import("@/features/programs/components/modals/ActivityPlanStatusModal"),
  [DialogType.EDIT_UNPLANNED_ACTIVITY_MODAL]: () => import("@/features/programs/components/modals/EditUnplannedActivityModal"),
  [DialogType.PREFERRED_CONSULTANT_MODAL]: () => import("@/features/contracts-grants/components/modals/PreferredConsultantModal"),
  [DialogType.DOCUMENT_UPLOADS]: () => import("@/features/common/components/modals/DocumentUploadModal"),
  [DialogType.CREATE_INTERVIEW]: () => import("@/features/hr/components/modals/CreateInterviewModal"),
  [DialogType.CREATE_GOALS]: () => import("@/features/hr/components/modals/CreateGoalsModal"),
  [DialogType.PAY_ADVICE]: () => import("@/features/hr/components/modals/ViewPaymentModal"),
  [DialogType.FundRequestApproval]: () => import("@/features/programs/components/modals/FundRequestApprovalModal"),
  [DialogType.FundRequestReject]: () => import("@/features/programs/components/modals/FundRequestRejectModal"),
  [DialogType.FundRequestSignature]: () => import("@/features/programs/components/modals/FundRequestSignatureModal"),
  [DialogType.ACTIVITY_COST_SHEET_MODAL]: () => import("@/features/programs/components/modals/ActivityCostSheetModal"),
  [DialogType.COST_SHEET_UPLOAD_MODAL]: () => import("@/features/programs/components/modals/CostSheetUploadModal"),
  [DialogType.WORKPLAN_COST_SHEET_UPLOAD_MODAL]: () => import("@/features/programs/components/modals/WorkPlanCostSheetUploadModal"),
};

const AppDialog = () => {
  const { type, dialogProps } = useAppSelector(dailogSelector);
  const [ModalComponent, setModalComponent] = useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!type || !modalComponentMap[type]) {
      setModalComponent(null);
      return;
    }

    setIsLoading(true);
    modalComponentMap[type]()
      .then((module) => {
        setModalComponent(() => module.default);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(`🎭 Failed to load modal component for type: ${type}`, error);
        setModalComponent(null);
        setIsLoading(false);
      });
  }, [type]);

  const renderModal = () => {
    if (!type) return null;

    if (isLoading) {
      return <ModalLoading />;
    }

    if (!ModalComponent) {
      return null;
    }

    // Handle special cases with fixed props
    if (type === DialogType.ProcurementUploadModal) {
      const mergedProps = {
        isOpen: true,
        onCancel: () => {},
        onOk: () => {},
        ...(dialogProps || {}),
      };
      return <ModalComponent {...mergedProps} />;
    }

    // Regular case
    return <ModalComponent {...(dialogProps || {})} />;
  };

  return <BaseDialog>{renderModal()}</BaseDialog>;
};

export default AppDialog;
