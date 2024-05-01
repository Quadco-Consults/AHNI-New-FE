/* eslint-disable react/prop-types */
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { Progress } from "components/ui/progress";
import { DialogType, largeDailogScreen } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";

const RatingCircle = ({ showInner }) => {
  return (
    <p className="w-[24px] p-1 flex justify-center items-center h-[24px] rounded-full border-[#DEA004] border">
      {showInner && (
        <p className="w-[12px]   h-[12px] rounded-full border-[#DEA004] border-t-2 border-l-2"></p>
      )}
    </p>
  );
};

const PriceCard = () => {
  const dispatch = useAppDispatch();
  return (
    <Card className="h-[275px] cursor-pointer">
      <div
        onClick={() => {
          dispatch(
            openDialog({
              type: DialogType.PriceInteligence,
              dialogProps: {
                ...largeDailogScreen,
              },
            })
          );
        }}
        className="flex flex-col justify-between h-full"
      >
        <div className="space-y-2 w-[70%]">
          <h2 className="text-lg font-semibold">Laptop Computer</h2>
          <p className="text-sm leading-6 ">
            Specification: 15” 4k OLED Display, Intel Core i9 Processor, 32-64GB
            RAM, 2TB SSD (XPS 15 9530)
          </p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-5 w-[40%]">
            <RatingCircle showInner />
            <RatingCircle showInner />
            <RatingCircle showInner />
            <RatingCircle />
            <RatingCircle />
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="w-[50%] space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-light">
                  <span className="font-bold">₦2.5M</span> Min
                </p>
                <p className="text-sm font-light">
                  <span className="font-bold">₦2.5M</span> Max
                </p>
              </div>
              <Progress
                className2="bg-[#E0FDD6]"
                value={50}
                className="w-full h-4 bg-[#FF0000]"
              />
            </div>
            <div>
              <Button className="bg-[#1A9B3E]">₦3,720,192.50</Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const PriceIntelligence = () => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-6 ">
        <PriceCard />
        <PriceCard />
        <PriceCard />
        <PriceCard />
      </div>
    </div>
  );
};

export default PriceIntelligence;
