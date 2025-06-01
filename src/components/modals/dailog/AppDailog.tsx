import { useAppSelector } from "hooks/useStore";
import { dailogSelector } from "store/ui";
import { BaseDailog } from "./BaseDailog";
import React, { ReactNode } from "react";
import { DialogType } from "constants/dailogs";
import CategoriesModal from "./components/CategoriesModal";
import PriceModal from "./components/PriceModal";
import ChecklistModal from "./components/EvaluationCriteriaModal";
import WorkPlanUploadModal from "./components/WorkPlanUploadModal";
import ActivityUploadModal from "./components/ActivityUploadModal";
import SspUploadModal from "./components/SspUploadModal";
import SspApproveModal from "./components/SspApproveModal";
import SuccessModal from "./components/SuccessModal";
import PreventionModal from "./components/PreventionModal";
import AssestAction from "./components/AssestAction";
import FundRequestModal from "./components/FundRequestModal";
import StateModal from "./components/StateModal";
import FundRequestSummaryModal from "./components/FundRequestSummaryModal";
import FundSuccessModal from "./components/FundSuccessModal";
import StakeholderModal from "./components/StakeholderModal";
import ProjectObjectiveModal from "./components/ProjectObjectiveModal";
import ConsortiumModal from "./components/ConsortiumModal";
import ProjectUploadModal from "./components/ProjectUploadModal";
import ProjectDetailsUploadModal from "./components/ProjectDetailsUploadModal";
import EditUser from "./components/users/EditUser";
import AssingRole from "./components/users/AssignRole";
import SspSubmitModal from "./components/sspSubmitModal";
import ExpenditureModal from "./components/ExpenditureModal";
import AssingPermission from "./components/users/AssignPermission";
import ConsultancyApplicationSuccessModal from "./components/ConsultancyApplicationSuccessModal";
import AddStock from "./components/consumables/AddStock";
import TeamMemberSelection from "./components/consumables/AddTeamMembers";
import AddFundingSource from "pages/protectedPages/modules/projects/AddFundingSource";
import AddBeneficiaries from "pages/protectedPages/modules/projects/AddBeneficiary";
import AddDocumentTypes from "pages/protectedPages/modules/projects/AddDocumentType";
import AddPartners from "pages/protectedPages/modules/projects/AddPartner";
import AddRiskCategory from "pages/protectedPages/modules/programs/AddRiskCategory";
import AddSupervisionCategory from "pages/protectedPages/modules/programs/AddSupervisionCategory";
import AddFacility from "pages/protectedPages/modules/programs/AddFacility";
import AddAssetConditions from "pages/protectedPages/modules/admin/AddAssetConditions";
import AddAssetTypes from "pages/protectedPages/modules/admin/AddAssetTypes";
import AddCategories from "pages/protectedPages/modules/config/AddCategories";
import AddCostCategory from "pages/protectedPages/modules/finance/AddCostCategory";
import AddBudgetLine from "pages/protectedPages/modules/finance/AddBudgetLine";
import AddCostInput from "pages/protectedPages/modules/finance/AddCostInput";
import AddFcoNumber from "pages/protectedPages/modules/finance/AddFcoNumber";
import AddProjectClasses from "pages/protectedPages/modules/finance/AddProjectClasses";
import AddChartsOfAccount from "pages/protectedPages/modules/finance/AddChartsOfAccount";
import AddDepartments from "pages/protectedPages/modules/config/AddDepartments";
import AddFinancialYear from "pages/protectedPages/modules/config/AddFinancialYear";
import AddItems from "pages/protectedPages/modules/config/AddItems";
import AddLocations from "pages/protectedPages/modules/config/AddLocations";
import AddLots from "pages/protectedPages/modules/procurement/AddLots";
import AddSolicitation from "pages/protectedPages/modules/procurement/AddSolicitationEvaluationCriteria";
import AddPrequalificationCategory from "pages/protectedPages/modules/procurement/AddPrequalificationCategory";
import AddPrequalificationCriteria from "pages/protectedPages/modules/procurement/AddPrequalificationCriteria";
import AddQuestionairs from "pages/protectedPages/modules/procurement/AddQuestionairs";
// import ProcurementUploadModal from "../../../modals/ProcurementPlanUploadModal";
import HrSuccessModal from "./components/HrSuccessModal";
import ApprovalModal from "./components/ApprovalModal";
import FeedbackModal from "./components/FeedbackModal";
import ActivityTrackerModal from "./components/ActivityTrackerModal";
import AddNewRoleModal from "./components/AddNewRoleModal";
import AddSupervisionCriteria from "./components/AddSupervisionCriteria";
import FundRequestBreakdown from "./components/FundRequestBreakdownModal";

import ChangeRiskStatusModal from "./components/ChangeRiskStatusModal";
import ChangeProjectStatusModal from "./components/ChangeProjectStatusModal";
import AddPosition from "pages/protectedPages/modules/config/AddPosition";
import AddAssetClassification from "pages/protectedPages/modules/admin/AddAssetClassification";
import ChangeWorkPlanStatusModal from "./ChangeWorkPlanTrackerStatusModal";
import EditValue from "pages/protectedPages/modules/hr/EditValue";
import NewLeaveForm from "pages/protectedPages/modules/hr/NewLeaveForm";
import AddCostGrouping from "pages/protectedPages/modules/finance/AddCostGrouping";
import AddInterventionArea from "pages/protectedPages/modules/programs/AddInterventionArea";
import AddObligationModal from "./components/ObligationModal";
import AddNewItems from "pages/protectedPages/modules/procurement/AddNewItems";
import AddMarketPrice from "pages/protectedPages/modules/config/AddMarketPrice";
import SubGrantManualSubUploadModal from "./components/SubGrantSubUploadModal";
import AddPreAwardQuestion from "pages/protectedPages/modules/c&g/AddPreAwardQuestion";
import AddTicketModal from "./components/AddTicketModal";
import ChangeProcurementTrackerStatusModal from "./ChangeProcurementTrackerStatusModal";
import ChangeProcurementTrackerRemarkModal from "./ChangeProcurementTrackerRemarkModal";
import AssignToModal from "./AssignToModal";
import ActivityPlanStatusModal from "./components/ActivityPlanStatusModal";
// import PreferredConsultant from "./components/PreferredConsultant";
import PreferredConsultantModal from "./components/PreferredConsultant";
import DocumentUploadModal from "./DocumentUpload";
import ViewLog from "pages/protectedPages/audit-log/ViewLog";
import CreateInterviewModal from "pages/protectedPages/hr/advertisement/id/CreateInterview";
import CreateGoalsModal from "pages/protectedPages/hr/workforce-database/id/CreateGoals";
// import CreateInterview from "pages/protectedPages/c&g/contract-management/consultant-management/id/CreateInterview";

const sheets: Record<string, ReactNode> = {
  [DialogType.AuditLog]: <ViewLog />,

  [DialogType.Categories]: <CategoriesModal />,
  [DialogType.PriceInteligence]: <PriceModal />,
  [DialogType.Checklist]: <ChecklistModal />,
  [DialogType.WorkPlanUpload]: <WorkPlanUploadModal />,
  [DialogType.AddTicket]: <AddTicketModal />,
  [DialogType.ActivityUpload]: <ActivityUploadModal />,
  [DialogType.ActivityTrackerModal]: <ActivityTrackerModal />,
  [DialogType.SspUpload]: <SspUploadModal />,
  [DialogType.SspApproveModal]: <SspApproveModal />,
  [DialogType.SuccessModal]: <SuccessModal />,
  [DialogType.FundSuccessModal]: <FundSuccessModal />,
  [DialogType.PreventionModal]: <PreventionModal />,
  [DialogType.AssestAction]: <AssestAction />,
  [DialogType.FundRequestModal]: <FundRequestModal />,
  [DialogType.StateModal]: <StateModal />,
  [DialogType.FundRequstSummaryModal]: <FundRequestSummaryModal />,
  [DialogType.StakeholderModal]: <StakeholderModal />,
  [DialogType.ProjectObjectiveModal]: <ProjectObjectiveModal />,
  [DialogType.ConsortiumModal]: <ConsortiumModal />,
  [DialogType.ProjectUploadModal]: <ProjectUploadModal />,
  [DialogType.ProjectDetailsUploadModal]: <ProjectDetailsUploadModal />,
  [DialogType.EditUser]: <EditUser />,
  [DialogType.AssingRoleToUser]: <AssingRole />,
  [DialogType.SspSubmitModal]: <SspSubmitModal />,
  [DialogType.ExpenditureModal]: <ExpenditureModal />,
  [DialogType.AddPermissionToRole]: <AssingPermission />,

  [DialogType.ConsultancyApplicationSuccess]: (
    <ConsultancyApplicationSuccessModal />
  ),
  [DialogType.AddStock]: <AddStock />,

  [DialogType.AddMarketPrice]: <AddMarketPrice />,
  [DialogType.AddNewItems]: <AddNewItems />,
  [DialogType.AddTeamMenbers]: <TeamMemberSelection />,
  [DialogType.AddFundingSource]: <AddFundingSource />,
  [DialogType.AddBeneficiaries]: <AddBeneficiaries />,
  [DialogType.AddDocumentTypes]: <AddDocumentTypes />,
  [DialogType.AddPartners]: <AddPartners />,
  [DialogType.AddRiskCategory]: <AddRiskCategory />,
  [DialogType.AddInterventionArea]: <AddInterventionArea />,
  [DialogType.AddSupervisionCategory]: <AddSupervisionCategory />,
  [DialogType.AddFacility]: <AddFacility />,
  [DialogType.AddAssetConditions]: <AddAssetConditions />,
  [DialogType.AddAssetTypes]: <AddAssetTypes />,
  [DialogType.AddCategories]: <AddCategories />,
  [DialogType.AddDepartments]: <AddDepartments />,
  [DialogType.AddFinancialYear]: <AddFinancialYear />,
  [DialogType.AddItems]: <AddItems />,
  [DialogType.AddLocations]: <AddLocations />,
  [DialogType.AddLots]: <AddLots />,
  [DialogType.AddSolicitation]: <AddSolicitation />,
  [DialogType.AddPrequalificationCategory]: <AddPrequalificationCategory />,
  [DialogType.AddPrequalificationCriteria]: <AddPrequalificationCriteria />,
  [DialogType.AddQuestionairs]: <AddQuestionairs />,
  [DialogType.AddCostCategory]: <AddCostCategory />,
  [DialogType.AddBudgetLine]: <AddBudgetLine />,
  [DialogType.AddCostInput]: <AddCostInput />,
  [DialogType.AddCostGrouping]: <AddCostGrouping />,
  [DialogType.AddFcoNumber]: <AddFcoNumber />,
  [DialogType.AddProjectClasses]: <AddProjectClasses />,
  [DialogType.AddChartsOfAccounts]: <AddChartsOfAccount />,
  // [DialogType.ProcurementUploadModal]: <ProcurementUploadModal />,
  [DialogType.HrSuccessModal]: <HrSuccessModal />,
  [DialogType.ApprovalModal]: <ApprovalModal />,
  [DialogType.FeedbackModal]: <FeedbackModal />,

  [DialogType.AddNewRoleModal]: <AddNewRoleModal />,
  [DialogType.AddSupervisionCriteria]: <AddSupervisionCriteria />,

  [DialogType.FundRequestBreakdown]: <FundRequestBreakdown />,
  [DialogType.ChangeRiskStatusModal]: <ChangeRiskStatusModal />,
  [DialogType.ChangeProjectStatusModal]: <ChangeProjectStatusModal />,

  [DialogType.AddPosition]: <AddPosition />,
  [DialogType.AddAssetClassification]: <AddAssetClassification />,
  [DialogType.ChangeWorkPlanStatusModal]: <ChangeWorkPlanStatusModal />,
  [DialogType.ChangeProcurementTrackerStatusModal]: (
    <ChangeProcurementTrackerStatusModal />
  ),
  [DialogType.ChangeProcurementTrackerRemarkModal]: (
    <ChangeProcurementTrackerRemarkModal />
  ),
  [DialogType.AssignToModal]: <AssignToModal />,
  [DialogType.EditValue]: <EditValue />,
  [DialogType.NewLeave]: <NewLeaveForm />,
  [DialogType.ADD_OBLIGATION_MODAL]: <AddObligationModal />,
  [DialogType.ADD_OBLIGATION_MODAL]: <AddObligationModal />,
  [DialogType.SUBGRANT_MANUAL_SUB_UPLOAD]: <SubGrantManualSubUploadModal />,
  [DialogType.ADD_PRE_AWARD_QUESTION_MODAL]: <AddPreAwardQuestion />,
  [DialogType.ACTIVITY_PLAN_STATUS_MODAL]: <ActivityPlanStatusModal />,
  [DialogType.PREFERRED_CONSULTANT_MODAL]: <PreferredConsultantModal />,
  [DialogType.DOCUMENT_UPLOADS]: <DocumentUploadModal />,

  // HR
  [DialogType.CREATE_INTERVIEW]: <CreateInterviewModal />,
  [DialogType.CREATE_GOALS]: <CreateGoalsModal />,
};
interface DialogPropsMap {
  [DialogType.FeedbackModal]: {
    form: any;
    onAction: () => void;
    isLoading: boolean;
    // Add other expected props
  };
  // Define props for other modal types as needed
}

const AppDailog = () => {
  const { type, dialogProps } = useAppSelector(dailogSelector);

  const renderModal = () => {
    const modal = sheets[type];
    if (!modal) return null;

    // Safely merge props
    const mergedProps = {
      ...(modal.props || {}),
      ...(dialogProps as Partial<DialogPropsMap[typeof type]>),
    };

    return React.cloneElement(modal, mergedProps);
  };

  return <BaseDailog>{renderModal()}</BaseDailog>;
};

export default AppDailog;
