import { Badge } from "components/ui/badge";
import fhiIcon from "assets/imgs/fhi.png";
import { MapPin } from "lucide-react";

const Summary = () => {
  return (
    <div className="space-y-7">
      <h4 className="font-semibold text-lg">Project Summary</h4>
      <hr />

      <div className="space-y-3">
        <h3 className="font-semibold">Project Goal</h3>
        <p className="text-sm text-gray-500">
          Fast-tracking the achievement of UNAIDS 95:95:95 targets and
          consequently achieve HIV epidemic control{" "}
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Project Objectives</h3>
        <p className="text-sm text-gray-500">
          To increase resiliency, responsiveness, and accountability of the
          health system,
        </p>
        <p className="text-sm text-gray-500">
          To increase uptake and retention of HIV/AIDS and TB services, and:
        </p>
        <p className="text-sm text-gray-500">
          To increase access and provision of HIV/AIDS and prevention and
          treatment services at primary care interventions.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Expected Result</h3>
        <p className="text-sm text-gray-500">Lorem ipsum dolor</p>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Project Location</h3>
        <div className="flex flex-wrap gap-3">
          {["Kaduna", "Adamawa", "Borno", "Yobe", "Jigawa"].map(
            (option: string, index: number) => (
              <Badge
                variant="default"
                key={index}
                className="bg-[#EBE8E1] text-[#1a0000ad] px-4 py-2 rounded-lg"
              >
                {option}
              </Badge>
            )
          )}
        </div>

        <div className="space-y-3 py-5">
          <h3 className="font-semibold">Target Population</h3>
          <p className="text-sm text-gray-500">General Population</p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Consortium partners</h3>
          <div className="flex flex-wrap gap-3">
            {Array(4)
              .fill({
                icon: fhiIcon,
                name: "Family Health International (FHI 360)",
                location: "Adamawa",
              })
              .map((option: any, index: number) => (
                <Badge
                  variant="default"
                  key={index}
                  className="bg-[#EBE8E1] flex gap-3 text-base font-light text-[#1a0000ad] px-4 py-2 rounded-lg"
                >
                  <img src={option.icon} alt="" />

                  <div>
                    <h4>{option.name}</h4>
                    <p className="flex items-center gap-1 text-sm">
                      <span>
                        <MapPin size={15} />
                      </span>
                      {option.location}
                    </p>
                  </div>
                </Badge>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
