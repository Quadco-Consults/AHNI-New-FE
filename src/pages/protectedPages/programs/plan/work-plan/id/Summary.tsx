import { Badge } from "components/ui/badge";

const Summary = () => {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Project Name</h3>

        <p className="text-sm text-gray-500">
          Accelerating Control of the HIV Epidemic in Nigeria (ACE 5 AKS & CRS)
        </p>

        <h3 className="font-semibold text-lg">Budget</h3>

        <p className="text-sm text-gray-500">$2,000,000</p>
      </div>

      <hr />

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-[#FF0000]">
          Project Objectives
        </h3>

        <div className="space-y-5">
          {[
            "To Increase   resiliency, responsiveness, and accountability of the health system ",
            "To Improve the   Quality of HIV/AIDS and TB Services ",
            "To Improve the   Quality of HIV/AIDS and TB Services ",
          ].map((option: string, index: number) => (
            <div key={index} className="flex gap-5">
              <h3 className="font-semibold">{index + 1}</h3>
              <div className="space-y-3">
                <h3 className="font-semibold">Objective</h3>
                <h3 className="text-sm text-gray-500">{option}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr />

      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Financial Year</h3>
        <h6 className="text-sm text-gray-500">10/2022 - 09/2023</h6>

        <h3 className="font-semibold text-lg">Project Location</h3>
        <div className="flex flex-wrap gap-3">
          {["Kaduna", "FCT", "Jigawa", "Lagos"].map(
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

        <h3 className="font-semibold text-lg">Project Partners</h3>
        <div className="flex flex-wrap gap-3">
          {[
            "Family Health International (FHI 360)",
            "The American University of Nigeria-AUN",
            "Ekklesiyar ‘Yan uwa a Nigeria (EYN)",
            "Federation of Muslim Associations of Nigeria (FOMWAN)",
            "Next Generation Empowerment Initiative (NextGen)",
          ].map((option: string, index: number) => (
            <Badge
              variant="default"
              key={index}
              className="bg-[#EBE8E1] text-[#1a0000ad] px-4 py-2 rounded-lg"
            >
              {option}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Summary;
