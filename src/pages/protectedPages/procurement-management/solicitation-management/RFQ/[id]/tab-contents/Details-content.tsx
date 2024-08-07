import { Icon } from "@iconify/react";
import Card from "components/shared/Card";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import {
  SolicitationItems,
  SolicitationResultsData,
} from "definations/procurement-types/solicitation";
import { ChevronRight } from "lucide-react";

const DetailsContent = (data: SolicitationResultsData) => {
  return (
    <div className="p-5">
      <Card className="space-y-8 p-10">
        <h2 className="font-semibold text-lg">{data?.name}</h2>

        <h4 className="text-green-dark text-base font-medium">
          Competitive bid analysis <Badge>{data?.status}</Badge>
        </h4>

        <div className="flex items-center gap-10">
          <div className="flex gap-3 items-center">
            <Icon icon="ooui:reference" fontSize={18} />
            <h6>{data?.reference}</h6>
          </div>
          <div className="flex gap-3 items-center">
            <Icon icon="iconamoon:location-pin-duotone" fontSize={18} />
            <h6>
              {data?.location?.address}, {data?.location?.city}
            </h6>
          </div>
          <div className="flex gap-3 items-center">
            <Icon icon="solar:case-minimalistic-bold-duotone" fontSize={18} />
            <h6>{data?.tender_type}</h6>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-medium text-base">Background</h2>
          <h4 className=" text-gray-500">{data?.description}</h4>
        </div>

        <div className="space-y-4">
          <h2 className="font-medium text-yellow-darker text-base">Items</h2>

          <div className="grid grid-cols-2 gap-5">
            {data?.items?.map((item: SolicitationItems) => (
              <Card key={item?.id} className="border-yellow-darker space-y-3">
                <div className="flex items-center gap-5">
                  <h4 className="w-1/4 font-medium">Item:</h4>
                  <h4>{item?.item?.name}</h4>
                </div>
                <div className="flex items-center gap-5">
                  <h4 className="w-1/4 font-medium">Quantity:</h4>
                  <h4>{item?.quantity}</h4>
                </div>
                <div className="flex items-center gap-5">
                  <h4 className="w-1/4 font-medium">Lot:</h4>
                  <h4>{item?.lot}</h4>
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
