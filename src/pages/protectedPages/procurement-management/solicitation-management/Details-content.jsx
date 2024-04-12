import { Icon } from "@iconify/react";
import Card from "components/shared/Card";

const DetailsContent = () => {
  return (
    <div className="p-5">
      <Card className="space-y-8 p-10">
        <h2 className="font-semibold text-lg">Supply of medical consumables</h2>

        <h4 className="text-green-dark text-base font-medium">
          Competitive bid analysis completed
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
          <h2 className="font-medium text-yellow-darker text-base">Items</h2>

          <div className="grid grid-cols-2 gap-5">
            {Array(4)
              .fill({
                item: "Needle and Syringe(detached)",
                quantity:
                  "1ml (detached), high quality with regulatory approval",
                lot: "1ml (detached), high quality with regulatory approval",
              })
              .map(({ item, lot, quantity }, index) => (
                <Card key={index} className="border-yellow-darker space-y-3">
                  <div className="flex items-center gap-5">
                    <h4 className="w-1/4 font-medium">Item:</h4>
                    <h4>{item}</h4>
                  </div>
                  <div className="flex items-center gap-5">
                    <h4 className="w-1/4 font-medium">Quantity:</h4>
                    <h4>{quantity}</h4>
                  </div>
                  <div className="flex items-center gap-5">
                    <h4 className="w-1/4 font-medium">Lot:</h4>
                    <h4>{lot}</h4>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DetailsContent;
