import { Icon } from "@iconify/react";
import Card from "components/shared/Card";

import { Label } from "components/ui/label";

const items = [
  "Medical Laboratory Consumables",
  "Design and Printing",
  "IT Equipment and Consumables",
  "IT Service Provider and Networking",
  "Office Furniture",
  "Vehicle Repairs and Maintenance",
  "Non- Food Relief Items and Dignity Kits",
  "Skill Acquisition Materials",
];

const EoIDetails = () => {
  return (
    <div className="p-5">
      <Card className="space-y-8 p-10">
        <h4 className="text-green-dark text-base font-medium">
          Call for expression of interest
        </h4>

        <div className="flex items-center gap-10">
          <div className="flex gap-3 items-center">
            <Icon icon="ooui:reference" fontSize={18} />
            <h6>GF-RFQ-AHNi-10-2023</h6>
          </div>
          <div className="flex gap-3 items-center">
            <Icon icon="iconamoon:location-pin-duotone" fontSize={18} />
            <h6>Head Office, Abuja</h6>
          </div>
          <div className="flex gap-3 items-center">
            <Icon icon="solar:case-minimalistic-bold-duotone" fontSize={18} />
            <h6>Single Sourcing</h6>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-medium text-base">Background</h2>
          <h4 className=" text-gray-500">
            Achieving Health Nigeria Initiative (AHNi) is an indigenous
            non-governmental organization that promotes socio-economic
            development by supporting a broad range of global health
            interventions, education, and economic initiatives in Nigeria. AHNi
            is an allied organization to Family Health International (FHI360)
            with a co-existing and mutually supportive interest in advancing the
            collective goals of the people and communities served. AHNi
            currently has its headquarters in Abuja-FCT with field presence in
            six (6) States of Nigeria.
          </h4>
        </div>

        <div className="space-y-4">
          <h2 className="font-medium text-[#DEA004]  text-base">Categories</h2>

          <div className="flex flex-wrap gap-x-5 gap-y-4">
            {items.map((item, index) => (
              <Label className="bg-[#EBE8E1] py-2 px-4 rounded" key={index}>
                {item}
              </Label>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EoIDetails;
