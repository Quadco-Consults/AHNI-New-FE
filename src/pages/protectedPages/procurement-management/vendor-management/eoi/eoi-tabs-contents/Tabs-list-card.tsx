/* eslint-disable react/prop-types */
import { Checkbox } from "components/ui/checkbox";

const TabsListCard = ({ data }: any) => {
  return (
    <div className="space-y-3 bg-white rounded-lg text-xs p-5">
      <Checkbox />
      <h6>{data.name}</h6>
      <h2 className="text-sm font-medium">{data.title}</h2>
      <h6>{data.description}</h6>
    </div>
  );
};

export default TabsListCard;
