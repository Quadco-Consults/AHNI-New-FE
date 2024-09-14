import Card from "components/shared/Card";
import { useMemo } from "react";

const SubmittedApplicationDetails = () => {
  const DetailsData = useMemo(() => {
    return [
      {
        label: "1st Principal’s Name & Title",
        subData: [
          { label: "Name:", value: "UDOKA NWANGWU" },
          { label: "Email", value: "Board Chairman" },
        ],
      },
      {
        label: "2nd Principal’s Name & Title",
        subData: [
          { label: "Name:", value: "Lindsey Rosser" },
          { label: "Email:", value: "lindseyrosser@gmail.com" },
        ],
      },
      { label: "Address", value: "No. 14 Habert Nkwocha Avenue, beside Enugu Ukwu General Hospital, Njikoka LGA, Anambra state." },
      { label: "Telephone", value: "08065252517" },
      { label: "Fax", value: "" },
      { label: "Web Address", value: "" },
      { label: "DUNS Number (for USG awards only)", value: "" },
      { label: "Has Financial Conflict of Interest Policy as applicable to U.S. PHS agencies’ funding.", value: "Yes" },
      { label: "Organization Type", value: "Not for Profit or Nongovernmental" },
    ];
  }, []);
  return (
    <div className="w-full flex flex-col text-[#1A0000] justify-center items-center">
      <div className="w-full bg-white rounded-2xl flex flex-col gap-y-[1.25rem] py-5 px-10">
        <Card className="flex flex-col gap-y-[1.25rem] pb-[10rem]">
          <p className="text-lg font-semibold">BE GLAD CARE AND SUPPORT FOUNDATION</p>
          <div className="flex flex-wrap justify-between gap-y-[1.25rem]">
            {DetailsData.map((item, index) => {
              return item.subData ? (
                <div className="w-[45%] flex flex-col gap-y-[1.25rem]">
                  <p className="font-semibold">{item.label}</p>
                  <div className="w-full space-y-[10px]">
                    {item.subData.map((subData, subIndex) => {
                      return (
                        <div className={`${"w-full"} flex gap-x-[1.25rem]`} key={subIndex}>
                          <p className="text-sm">{subData.label}</p>
                          <p className="text-sm">{subData.value}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className={`${"md:w-[45%] w-full"} flex flex-col gap-y-[1.25rem]`} key={index}>
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-sm">{item.value}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SubmittedApplicationDetails;
