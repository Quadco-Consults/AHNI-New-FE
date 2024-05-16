import { useAppSelector } from "hooks/useStore";
import { dailogSelector } from "store/ui";
import { BaseDailog } from "./BaseDailog";
import { ReactNode } from "react";
import { DialogType } from "constants/dailogs";
import CategoriesModal from "./components/CategoriesModal";
import PriceModal from "./components/PriceModal";
import ChecklistModal from "./components/ChecklistModal";

const sheets: Record<string, ReactNode> = {
  [DialogType.Categories]: <CategoriesModal />,
  [DialogType.PriceInteligence]: <PriceModal />,
  [DialogType.Checklist]: <ChecklistModal />,
};

const AppDailog = () => {
  const { type } = useAppSelector(dailogSelector);

  const SpecificModal = sheets[type];

  if (!SpecificModal) return null;

  return <BaseDailog>{SpecificModal}</BaseDailog>;
};

export default AppDailog;
