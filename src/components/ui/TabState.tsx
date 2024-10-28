import React from "react";

export interface TabStateProps {
  tabArray: tabDetails[];
  setState: React.Dispatch<React.SetStateAction<string | number>>;
  tabState: string | number;
}
export interface tabDetails {
  id: number;
  state: string;
  name: string | number;
  tabComponent: React.ReactNode;
}

const TabState = ({ tabArray, tabState, setState }: TabStateProps) => {
  return (
    <div className="bg-white w-auto p-[.5rem] flex gap-x-1 shadow-md shadow-[#00000008] rounded-lg">
      {tabArray?.map((tab, index) => {
        return (
          <div
            onClick={() => {
              setState(tab.state);
            }}
            className={`text-sm font-semibold px-[1rem] cursor-pointer py-[.5rem] capitalize rounded ${tab.state === tabState ? "bg-[#DEA004] text-white" : "text-[#756D6D]"}`}
            key={index}
          >
            {tab?.name}
          </div>
        );
      })}
    </div>
  );
};

export default TabState;
