"use client";

import logoPng from "@/assets/imgs/logo.png";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { nigerianStates } from "@/lib/index";
import { useState } from "react";

interface StateModalProps {
  onSubmit?: (selectedStates: string[]) => void;
  onClose?: () => void;
  initialSelection?: string[];
}

const StateModal = ({ onSubmit, onClose, initialSelection = [] }: StateModalProps) => {
  const [selectedStates, setSelectedStates] = useState<string[]>(initialSelection);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStates = nigerianStates.filter((state: string) =>
    state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStateToggle = (state: string) => {
    setSelectedStates((prev) =>
      prev.includes(state)
        ? prev.filter((s) => s !== state)
        : [...prev, state]
    );
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(selectedStates);
    }
  };

  return (
    <div className="flex flex-col mt-10 items-center justify-center w-full h-[80vh]">
      <ScrollArea className="h-[90%] space-y-5">
        <div className="flex flex-col items-center justify-between">
          <div>
            <img src={logoPng} alt="logo" width={150} />
          </div>
          <h4 className="mt-8 text-lg font-bold">
            State Offices Involved
          </h4>
          <p className="mt-5 text-muted-foreground">
            You can select as many offices involved as possible
          </p>

          <div className="relative flex mt-6 items-center text-[#20293A] w-full max-w-md">
            <Input
              className="w-full py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 dark:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Search"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 bg-gray-100 mt-10 p-5 rounded-lg shadow-inner md:grid-cols-4">
          {filteredStates.map((state: string, index: number) => (
            <div
              key={index}
              className="flex p-5 bg-white border rounded-lg gap-4 items-center"
            >
              <Checkbox
                checked={selectedStates.includes(state)}
                onCheckedChange={() => handleStateToggle(state)}
              />
              <h4 className="text-sm">{state}</h4>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex justify-end w-full my-5">
        <div className="flex items-center gap-x-4">
          <p className="text-sm font-medium text-primary">
            {selectedStates.length} States Selected
          </p>
          <Button onClick={handleSubmit}>Save & Continue</Button>
        </div>
      </div>
    </div>
  );
};

export default StateModal;