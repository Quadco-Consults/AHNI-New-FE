import BackNavigation from "atoms/BackNavigation";
import { useState } from "react";
import SelectExistingConsultant from "./SelectExistingConsultant";
import AddNewConsultant from "./AddNewConsultant";

const AddConsultancyApplication = () => {
  const [newState, setNewState] = useState("existing");

  const stateArray = [
    { id: 1, state: "existing", label: "Select Existing" },
    { id: 1, state: "new", label: "Add New" },
  ];
  return (
    <main className="w-full flex flex-col gap-y-[1.25rem]">
      <BackNavigation />
      <div className="flex w-full items-center gap-[1.25rem]">
        {stateArray.map((item, index) => {
          return (
            <div
              className={`py-2 px-4 rounded border font-semibold cursor-pointer ${item.state === newState ? "bg-[#DEA004] text-white" : "bg-white text-[#756D6D]"} border-[#B3B7C1]`}
              key={index}
              onClick={() => {
                setNewState(item.state);
              }}
            >
              <p>{item.label}</p>
            </div>
          );
        })}
      </div>
      <div>{newState === "existing" ? <SelectExistingConsultant /> : <AddNewConsultant />}</div>
    </main>
  );
};

export default AddConsultancyApplication;
