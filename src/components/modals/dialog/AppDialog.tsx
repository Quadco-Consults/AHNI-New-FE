"use client";

import { useAppSelector } from "hooks/useStore";
import { dailogSelector } from "store/ui";
import { BaseDialog } from "./BaseDialog";
import React, { ReactNode } from "react";
import { DialogType } from "constants/dailogs";
import ProjectObjectiveModal from "@/features/projects/components/modals/ProjectObjectiveModal";
import ConsortiumModal from "@/features/projects/components/modals/ConsortiumModal";
import ProjectUploadModal from "@/features/projects/components/modals/ProjectUploadModal";
import ProjectDetailsUploadModal from "@/features/projects/components/modals/ProjectDetailsUploadModal";
import ChangeProjectStatusModal from "@/features/projects/components/modals/ChangeProjectStatusModal";
import WorkPlanUploadModal from "@/features/programs/components/modals/WorkPlanUploadModal";
import ActivityUploadModal from "@/features/programs/components/modals/ActivityUploadModal";
// import ViewLog from "@/features/admin/components/modals/ViewLog";
// import CategoriesModal from "@/features/admin/components/modals/CategoriesModal";
// import PriceModal from "@/features/procurement/components/modals/PriceModal";
// import ChecklistModal from "@/features/programs/components/modals/ChecklistModal";
// import AddTicketModal from "@/features/admin/components/modals/AddTicketModal";
import ActivityTrackerModal from "@/features/programs/components/modals/ActivityTrackerModal";
import SspUploadModal from "@/features/programs/components/modals/SspUploadModal";
import SspApproveModal from "@/features/programs/components/modals/SspApproveModal";
// import SuccessModal from "@/features/common/components/modals/SuccessModal";
import FundSuccessModal from "@/features/programs/components/modals/FundSuccessModal";
// import PreventionModal from "@/features/programs/components/modals/PreventionModal";
// import AssestAction from "@/features/admin/components/modals/AssestAction";
import FundRequestModal from "@/features/programs/components/modals/FundRequestModal";
// import StateModal from "@/features/admin/components/modals/StateModal";
import FundRequestSummaryModal from "@/features/programs/components/modals/FundRequestSummaryModal";
import StakeholderModal from "@/features/programs/components/modals/StakeholderModal";
// import EditUser from "@/features/admin/components/modals/EditUser";
// import AssingRole from "@/features/admin/components/modals/AssingRole";
// import SspSubmitModal from "@/features/programs/components/modals/SspSubmitModal";
// import ExpenditureModal from "@/features/programs/components/modals/ExpenditureModal";
// import AssingPermission from "@/features/admin/components/modals/AssingPermission";
import ConsultancyApplicationSuccessModal from "@/features/contracts-grants/components/modals/ConsultancyApplicationSuccessModal";
// import AddStock from "@/features/admin/components/modals/AddStock";
// import AddMarketPrice from "@/features/procurement/components/modals/AddMarketPrice";
// import AddNewItems from "@/features/procurement/components/modals/AddNewItems";
// import TeamMemberSelection from "@/features/programs/components/modals/TeamMemberSelection";
import AddFundingSource from "@/features/projects/components/modules/AddFundingSource";
import AddBeneficiaries from "@/features/projects/components/modules/AddBeneficiary";
import AddDocumentTypes from "@/features/projects/components/modules/AddDocumentType";
import AddPartners from "@/features/projects/components/modules/AddPartner";
// import AddRiskCategory from "@/features/admin/components/modals/AddRiskCategory";
// import AddInterventionArea from "@/features/admin/components/modals/AddInterventionArea";
// import AddSupervisionCategory from "@/features/admin/components/modals/AddSupervisionCategory";
// import AddFacility from "@/features/admin/components/modals/AddFacility";
// import AddAssetConditions from "@/features/admin/components/modals/AddAssetConditions";
// import AddAssetTypes from "@/features/admin/components/modals/AddAssetTypes";
// import AddCategories from "@/features/admin/components/modals/AddCategories";
// import AddDepartments from "@/features/admin/components/modals/AddDepartments";
// import AddFinancialYear from "@/features/admin/components/modals/AddFinancialYear";
// import AddItems from "@/features/procurement/components/modals/AddItems";
// import AddLocations from "@/features/admin/components/modals/AddLocations";
// import AddLots from "@/features/procurement/components/modals/AddLots";
// import AddSolicitation from "@/features/procurement/components/modals/AddSolicitation";
// import AddPrequalificationCategory from "@/features/procurement/components/modals/AddPrequalificationCategory";
// import AddPrequalificationCriteria from "@/features/procurement/components/modals/AddPrequalificationCriteria";
// import AddQuestionairs from "@/features/procurement/components/modals/AddQuestionairs";
import AddCostCategory from "@/features/admin/components/finance/AddCostCategory";
import AddBudgetLine from "@/features/admin/components/finance/AddBudgetLine";
import AddCostInput from "@/features/admin/components/finance/AddCostInput";
import AddCostGrouping from "@/features/admin/components/finance/AddCostGrouping";
import AddFcoNumber from "@/features/admin/components/finance/AddFcoNumber";
import AddProjectClasses from "@/features/admin/components/finance/AddProjectClasses";
import AddChartsOfAccount from "@/features/admin/components/finance/AddChartsOfAccount";
import HrSuccessModal from "@/features/hr/components/modals/HrSuccessModal";
// import ApprovalModal from "@/features/common/components/modals/ApprovalModal";
// import FeedbackModal from "@/features/common/components/modals/FeedbackModal";
import AddNewRoleModal from "@/features/admin/components/modals/AddNewRoleModal";
// import AddSupervisionCriteria from "@/features/admin/components/modals/AddSupervisionCriteria";
// import FundRequestBreakdown from "@/features/programs/components/modals/FundRequestBreakdown";
import ChangeRiskStatusModal from "@/features/programs/components/modals/ChangeRiskStatusModal";
// import AddPosition from "@/features/admin/components/modals/AddPosition";
// import AddGrade from "@/features/admin/components/modals/AddGrade";
// import AddLevel from "@/features/admin/components/modals/AddLevel";
// import AddAssetClassification from "@/features/admin/components/modals/AddAssetClassification";
// import ChangeWorkPlanStatusModal from "@/features/programs/components/modals/ChangeWorkPlanStatusModal";
// import ChangeProcurementTrackerStatusModal from "@/features/procurement/components/modals/ChangeProcurementTrackerStatusModal";
// import ChangeProcurementTrackerRemarkModal from "@/features/procurement/components/modals/ChangeProcurementTrackerRemarkModal";
// import AssignToModal from "@/features/common/components/modals/AssignToModal";
// import EditValue from "@/features/admin/components/modals/EditValue";
// import NewLeaveForm from "@/features/hr/components/modals/NewLeaveForm";
// import AddObligationModal from "@/features/contracts-grants/components/modals/AddObligationModal";
// import SubGrantManualSubUploadModal from "@/features/contracts-grants/components/modals/SubGrantManualSubUploadModal";
// import AddPreAwardQuestion from "@/features/contracts-grants/components/modals/AddPreAwardQuestion";
// import AddModification from "@/features/contracts-grants/components/modals/AddModification";
// import ActivityPlanStatusModal from "@/features/programs/components/modals/ActivityPlanStatusModal";
// import PreferredConsultantModal from "@/features/contracts-grants/components/modals/PreferredConsultantModal";
// import DocumentUploadModal from "@/features/common/components/modals/DocumentUploadModal";
// import CreateInterviewModal from "@/features/hr/components/modals/CreateInterviewModal";
// import CreateGoalsModal from "@/features/hr/components/modals/CreateGoalsModal";
// import ViewPaymentModal from "@/features/hr/components/modals/ViewPaymentModal";
// import CopyActivitiesModal from "@/features/programs/components/modals/CopyActivitiesModal";

const dialogs: Record<string, ReactNode> = {
  //

  // [DialogType.AuditLog]: <ViewLog />,

  // [DialogType.Categories]: <CategoriesModal />,
  // [DialogType.PriceInteligence]: <PriceModal />,
  // [DialogType.Checklist]: <ChecklistModal />,
  [DialogType.WorkPlanUpload]: <WorkPlanUploadModal />,
  // [DialogType.AddTicket]: <AddTicketModal />,
  [DialogType.ActivityUpload]: <ActivityUploadModal />,
  [DialogType.ActivityTrackerModal]: <ActivityTrackerModal />,
  [DialogType.SspUpload]: <SspUploadModal />,
  [DialogType.SspApproveModal]: <SspApproveModal />,
  // [DialogType.SuccessModal]: <SuccessModal />,
  [DialogType.FundSuccessModal]: <FundSuccessModal />,
  // [DialogType.PreventionModal]: <PreventionModal />,
  // [DialogType.AssestAction]: <AssestAction />,
  [DialogType.FundRequestModal]: <FundRequestModal />,
  // [DialogType.StateModal]: <StateModal />,
  [DialogType.FundRequstSummaryModal]: <FundRequestSummaryModal />,
  //   [DialogType.StakeholderModal]: <StakeholderModal />,
  [DialogType.ProjectObjectiveModal]: <ProjectObjectiveModal />,
  [DialogType.ConsortiumModal]: <ConsortiumModal />,
  [DialogType.ProjectUploadModal]: <ProjectUploadModal />,
  [DialogType.ProjectDetailsUploadModal]: <ProjectDetailsUploadModal />,
  //   // [DialogType.EditUser]: <EditUser />,
  //   // [DialogType.AssingRoleToUser]: <AssingRole />,
  //   // [DialogType.SspSubmitModal]: <SspSubmitModal />,
  //   // [DialogType.ExpenditureModal]: <ExpenditureModal />,
  //   // [DialogType.AddPermissionToRole]: <AssingPermission />,

  //   [DialogType.ConsultancyApplicationSuccess]: (
  //     <ConsultancyApplicationSuccessModal />
  //   ),
  //   // [DialogType.AddStock]: <AddStock />,

  //   // [DialogType.AddMarketPrice]: <AddMarketPrice />,
  //   // [DialogType.AddNewItems]: <AddNewItems />,
  //   // [DialogType.AddTeamMenbers]: <TeamMemberSelection />,
  //   [DialogType.AddFundingSource]: <AddFundingSource />,
  //   [DialogType.AddBeneficiaries]: <AddBeneficiaries />,
  //   [DialogType.AddDocumentTypes]: <AddDocumentTypes />,
  //   [DialogType.AddPartners]: <AddPartners />,
  // [DialogType.AddRiskCategory]: <AddRiskCategory />,
  // [DialogType.AddInterventionArea]: <AddInterventionArea />,
  // [DialogType.AddSupervisionCategory]: <AddSupervisionCategory />,
  // [DialogType.AddFacility]: <AddFacility />,
  // [DialogType.AddAssetConditions]: <AddAssetConditions />,
  // [DialogType.AddAssetTypes]: <AddAssetTypes />,
  // [DialogType.AddCategories]: <AddCategories />,
  // [DialogType.AddDepartments]: <AddDepartments />,
  // [DialogType.AddFinancialYear]: <AddFinancialYear />,
  // [DialogType.AddItems]: <AddItems />,
  // [DialogType.AddLocations]: <AddLocations />,
  // [DialogType.AddLots]: <AddLots />,
  // [DialogType.AddSolicitation]: <AddSolicitation />,
  // [DialogType.AddPrequalificationCategory]: <AddPrequalificationCategory />,
  // [DialogType.AddPrequalificationCriteria]: <AddPrequalificationCriteria />,
  //   // [DialogType.AddQuestionairs]: <AddQuestionairs />,
  //   [DialogType.AddCostCategory]: <AddCostCategory />,
  //   [DialogType.AddBudgetLine]: <AddBudgetLine />,
  //   [DialogType.AddCostInput]: <AddCostInput />,
  //   [DialogType.AddCostGrouping]: <AddCostGrouping />,
  //   [DialogType.AddFcoNumber]: <AddFcoNumber />,
  //   [DialogType.AddProjectClasses]: <AddProjectClasses />,
  //   [DialogType.AddChartsOfAccounts]: <AddChartsOfAccount />,
  //   // [DialogType.ProcurementUploadModal]: <ProcurementUploadModal />,
  //   [DialogType.HrSuccessModal]: <HrSuccessModal />,
  //   // [DialogType.ApprovalModal]: <ApprovalModal />,
  //   // [DialogType.FeedbackModal]: <FeedbackModal />,

  //   [DialogType.AddNewRoleModal]: <AddNewRoleModal />,
  //   // [DialogType.AddSupervisionCriteria]: <AddSupervisionCriteria />,

  //   // [DialogType.FundRequestBreakdown]: <FundRequestBreakdown />,
  //   [DialogType.ChangeRiskStatusModal]: <ChangeRiskStatusModal />,
  //   [DialogType.ChangeProjectStatusModal]: <ChangeProjectStatusModal />,

  // [DialogType.AddPosition]: <AddPosition />,
  // [DialogType.AddGrade]: <AddGrade />,
  // [DialogType.AddLevel]: <AddLevel />,

  // [DialogType.AddAssetClassification]: <AddAssetClassification />,
  // [DialogType.ChangeWorkPlanStatusModal]: <ChangeWorkPlanStatusModal />,
  // [DialogType.ChangeProcurementTrackerStatusModal]: (
  //   <ChangeProcurementTrackerStatusModal />
  // ),
  // [DialogType.ChangeProcurementTrackerRemarkModal]: (
  //   <ChangeProcurementTrackerRemarkModal />
  // ),
  // [DialogType.AssignToModal]: <AssignToModal />,
  // [DialogType.EditValue]: <EditValue />,
  // [DialogType.NewLeave]: <NewLeaveForm />,
  // [DialogType.ADD_OBLIGATION_MODAL]: <AddObligationModal />,
  // [DialogType.ADD_OBLIGATION_MODAL]: <AddObligationModal />,
  // [DialogType.SUBGRANT_MANUAL_SUB_UPLOAD]: <SubGrantManualSubUploadModal />,
  // [DialogType.ADD_PRE_AWARD_QUESTION_MODAL]: <AddPreAwardQuestion />,
  // [DialogType.MODIFY_GRANT]: <AddModification />,

  // [DialogType.ACTIVITY_PLAN_STATUS_MODAL]: <ActivityPlanStatusModal />,
  // [DialogType.PREFERRED_CONSULTANT_MODAL]: <PreferredConsultantModal />,
  // [DialogType.DOCUMENT_UPLOADS]: <DocumentUploadModal />,

  // HR
  // [DialogType.CREATE_INTERVIEW]: <CreateInterviewModal />,
  // [DialogType.CREATE_GOALS]: <CreateGoalsModal />,
  // [DialogType.PAY_ADVICE]: <ViewPaymentModal />,
  // [DialogType.COPY_ACTIVITIES]: <CopyActivitiesModal />,
};

const AppDialog = () => {
  const { type, dialogProps } = useAppSelector(dailogSelector);

  const renderModal = () => {
    const modal = dialogs[type];
    if (!modal) return null;

    // Safely merge props
    const mergedProps = {
      ...(modal.props || {}),
      ...(dialogProps || {}),
    };

    return React.cloneElement(modal as React.ReactElement, mergedProps);
  };

  return <BaseDialog>{renderModal()}</BaseDialog>;
};

export default AppDialog;
