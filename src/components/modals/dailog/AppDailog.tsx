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

const sheets: Record<string, ReactNode> = {
  [DialogType.Categories]: <CategoriesModal />,
  [DialogType.PriceInteligence]: <PriceModal />,
  [DialogType.Checklist]: <ChecklistModal />,
  [DialogType.WorkPlanUpload]: <WorkPlanUploadModal />,
  [DialogType.ActivityUpload]: <ActivityUploadModal />,
  [DialogType.SspUpload]: <SspUploadModal />,
  [DialogType.SspApproveModal]: <SspApproveModal />,
  [DialogType.SuccessModal]: <SuccessModal />,
  [DialogType.PreventionModal]: <PreventionModal />,
  [DialogType.AssestAction]: <AssestAction />,
};

const AppDailog = () => {
  const { type } = useAppSelector(dailogSelector);

  const SpecificModal = sheets[type];

  if (!SpecificModal) return null;

  return <BaseDailog>{SpecificModal}</BaseDailog>;
};

export default AppDailog;
