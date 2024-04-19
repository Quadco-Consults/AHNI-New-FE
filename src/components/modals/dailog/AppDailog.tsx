import { useAppSelector } from "hooks/useStore";
import { dailogSelector } from "store/ui";
import { BaseDailog } from "./BaseDailog";
import { ReactNode } from "react";
import { DialogType } from "constants/dailogs";
import CategoriesModal from "./components/CategoriesModal";

const sheets: Record<string, ReactNode> = {
  [DialogType.Categories]: <CategoriesModal />,
};

const AppDailog = () => {
  const { type } = useAppSelector(dailogSelector);

  const SpecificModal = sheets[type];

  if (!SpecificModal) return null;

  return <BaseDailog>{SpecificModal}</BaseDailog>;
};

export default AppDailog;
