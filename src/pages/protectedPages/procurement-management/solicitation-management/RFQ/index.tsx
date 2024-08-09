import { Button } from "components/ui/button";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import eoiPng from "assets/imgs/rfq.png";
import Card from "components/shared/Card";
import { Icon } from "@iconify/react";
import { Link, generatePath } from "react-router-dom";
import { RouteEnum } from "constants/RouterConstants";
import SolicitationAPI from "services/procurementApi/solicitation";
import { LoadingSpinner } from "components/shared/Loading";
import { SolicitationResultsData } from "definations/procurement-types/solicitation";

const RFQ = () => {
  const { data, isLoading } = SolicitationAPI.useGetSolicitationsQuery({});

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-10">
      <div>
        <h4 className="text-lg font-bold">Request For Quotations</h4>
        <h6>
          Procurement -{" "}
          <span className="font-medium text-black dark:text-grey-dark">
            Request For Quotations
          </span>
        </h6>
      </div>

      <div className="space-y-10 p-10 bg-white shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]">
        <div className="flex items-center justify-end">
          <Link to={RouteEnum.RFQ_CREATE_QUOTATION}>
            <Button>
              <span>
                <Plus size={15} />
              </span>
              Create New
            </Button>
          </Link>
        </div>

        {data && data?.results?.length > 0 ? (
          <div className="grid grid-cols-2 gap-5">
            {data?.results?.map((value: SolicitationResultsData) => (
              <Card key={value?.id} className="space-y-4">
                <img src={eoiPng} alt="eoi" />
                <h2 className="text-lg font-bold">{value?.name}</h2>

                <div className="flex items-center gap-3">
                  <Icon icon="ooui:reference" fontSize={18} />{" "}
                  <h6>{value?.reference}</h6>
                </div>
                <div className="flex items-center gap-3">
                  <Icon icon="iconamoon:location-pin-duotone" fontSize={18} />
                  <h6>
                    {value?.location?.address}, {value?.location?.city}
                  </h6>
                </div>
                <div className="flex items-center gap-3">
                  <Icon
                    icon="solar:case-minimalistic-bold-duotone"
                    fontSize={18}
                  />
                  <h6>{value?.tender_type}</h6>
                </div>

                <h6 className="line-clamp-3">{value?.description}</h6>

                <div className="flex justify-center">
                  <Link
                    to={generatePath(RouteEnum.RFQ_DETAILS, { id: value?.id })}
                  >
                    <Button variant="ghost" className="border text-primary">
                      Tap to View
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="p-5 text-center">No Data</p>
        )}
      </div>
    </div>
  );
};

export default RFQ;
