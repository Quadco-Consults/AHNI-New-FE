import Card from "components/shared/Card";
import React, { useMemo } from "react";

const GrantDetailsCard: React.FC = () => {
  const CardDetails = useMemo(() => {
    return [
      { id: 1, label: "Project Name", value: "Malaria Control Program" },
      { id: 1, label: "Funding Source", value: "NGO Funding " },
      { id: 1, label: "Guarantor", value: "NGO Funding " },
      { id: 1, label: "Intervention", value: "Health z" },
      { id: 1, label: "Project Location", value: "Lagos" },
      { id: 1, label: "Award Type", value: "Cooperative Agreement " },
      { id: 1, label: "Reference No", value: "Cooperative Agreement " },
    ];
  }, []);
  return (
    <div className="w-full bg-white px-[2.5rem] py-[1.25rem] rounded-2xl flex flex-col gap-y-[1.25rem]">
      <p className="text-xl font-semibold">Grant Details</p>
      <Card>
        <div className="w-full flex flex-wrap items-start justify-between p-3 gap-y-[1.25rem]">
          {CardDetails.map((item, index) => {
            return (
              <div className="w-[30%] space-y-[1.25rem] text-[#1A0000]" key={index}>
                <p className="font-semibold">{item?.label}</p>
                <p>{item?.value}</p>
              </div>
            );
          })}
        </div>
      </Card>
      <Card>
        <div className="w-full flex flex-col items-start justify-between p-3 gap-y-[1.25rem] text-[#1A0000]">
          <p className="font-semibold">Project Overview</p>
          <p>
            Malaria Control Program focused on delivering, monitoring, and evaluating interventions at the grassroots level, including: bed net distribution, case detection and treatment, operational research, and behaviour change communications, such as teaching people how to properly hang a net. <br />
            Wherever possible, the program sought to integrate malaria prevention activities with efforts to control or eliminate diseases such as lymphatic filariasis, river blindness, and trachoma, enabling village-based health care delivery systems to address multiple diseases at once.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default GrantDetailsCard;
