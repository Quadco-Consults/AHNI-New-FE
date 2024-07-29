import { Badge } from "components/ui/badge";
import { FundRequestData } from "definations/program-types/fund-request";

const Summary = (data: FundRequestData) => {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <h3 className="font-semibold">Project Name</h3>
        <p className="text-sm text-gray-500">
          {data.results[0].unique_identifier_code}
        </p>
      </div>

      <div className="grid pb-5 grid-cols-2 gap-5 md:grid-cols-3">
        <div className="space-y-3">
          <h3 className="font-semibold">Project ID</h3>
          <p className="text-sm text-gray-500">{data.results[0].project}</p>
        </div>
        {/* <div className="space-y-3">
          <h3 className="font-semibold">State</h3>
          <p className="text-sm text-gray-500">AHNI Adamawa H/O</p>
        </div> */}
        <div className="space-y-3">
          <h3 className="font-semibold">Month</h3>
          <p className="text-sm text-gray-500">{data.results[0].month_year}</p>
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold">Project Start Date</h3>
          <p className="text-sm text-gray-500">10/04/2023</p>
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold">Project End Date</h3>
          <p className="text-sm text-gray-500">10/04/2023</p>
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold">Currency</h3>
          <p className="text-sm text-gray-500">{data.results[0].currency}</p>
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold">Financial Year</h3>
          <p className="text-sm text-gray-500">
            {data.results[0].financial_year}
          </p>
        </div>
      </div>

      <hr className="pb-5" />

      <div className="space-y-3">
        <h3 className="font-semibold">State Offices Involved</h3>
        <div className="flex flex-wrap gap-3">
          {[
            "ACE Project Head Office Adamawa",
            "Adamawa State office",
            "Borno State Office",
            "Yobe State Office",
            "American University of Nigeria (AUN)",
            "Federation of Muslim Women’s Associations in Nigeria (FOMWAN)",
            "Ekklesiyar Yan’uwa a Nigeria (EYN)",
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
