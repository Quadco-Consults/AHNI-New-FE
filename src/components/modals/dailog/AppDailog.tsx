import { useAppSelector } from "hooks/useStore";
import { dailogSelector } from "store/ui";
import { BaseDailog } from "./BaseDailog";
import { ReactNode } from "react";
import { DialogType } from "constants/dailogs";
import CategoriesModal from "./components/CategoriesModal";
import PriceModal from "./components/PriceModal";
import ChecklistModal from "./components/ChecklistModal";
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
import AssingRole from "./components/users/AssingRole";
import SspSubmitModal from "./components/sspSubmitModal";
import ExpenditureModal from "./components/ExpenditureModal";
import AssingPermission from "./components/users/AssingPermission";
import ConsultancyApplicationSuccessModal from "./components/ConsultancyApplicationSuccessModal";
import SubGrantManualDocsModal from "./components/SubGrantManualDocsModal";

const sheets: Record<string, ReactNode> = {
  [DialogType.Categories]: <CategoriesModal />,
  [DialogType.PriceInteligence]: <PriceModal />,
  [DialogType.Checklist]: <ChecklistModal />,
  [DialogType.WorkPlanUpload]: <WorkPlanUploadModal />,
  [DialogType.ActivityUpload]: <ActivityUploadModal />,
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
  [DialogType.ConsultancyApplicationSuccess]: <ConsultancyApplicationSuccessModal />,
};

const AppDailog = () => {
  const { type } = useAppSelector(dailogSelector);

  const SpecificModal = sheets[type];

  if (!SpecificModal) return null;

  return <BaseDailog>{SpecificModal}</BaseDailog>;
};

export default AppDailog;
