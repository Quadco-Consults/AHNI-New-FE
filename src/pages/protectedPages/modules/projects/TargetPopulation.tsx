import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import AddTargetPopulation from "./AddTargetPopulation";
import { FUNDING_SOURCE } from "./list";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle
} from "components/ui/dialog";

const TargetPopulation = () => {
  return (
    <Card className="mt-10 pb-8 px-6">
        <div className="flex justify-between items-center py-6 mb-6">
        <h1 className="text-[#D92D20] font-semibold text-sm">Funding Source</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="gap-x-2 shadow-[0px_3px_8px_rgba(0,0,0,0.07)] bg-[#FFFFFF] text-[#DEA004] border-[1px] border-[#C7CBD5]"
              size="sm"
            >
              Click to add New
            </Button>
          </DialogTrigger>
          <DialogContent className="">
          <DialogTitle>Target Population</DialogTitle>
            <AddTargetPopulation />
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <div className="flex justify-between text-[#756D6D] font-semibold text-sm mb-10">
          <h1>Name</h1>
          <h1>Description</h1>
          <h1></h1>
        </div>
        <div>
          {FUNDING_SOURCE.map((table, index) => (
            <div key={index} className="flex justify-between mt-6 text-[#756D6D] font-normal text-xs">
              <p>{table.name}</p>
              <p>{table.description}</p>
              <img src={table.icon} className="w-[20px]" alt="" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default TargetPopulation