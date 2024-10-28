import Card from "components/shared/Card";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { SubGrantApplicationsApi } from "services/cAndGApi/subGrant";

const SubmittedApplicationDetails = () => {
  const params = useParams();

  const getSingleSubmittedApplication = SubGrantApplicationsApi.useGetSingleSubGrantsApplicationQuery({ id: params.id });

  const Data = getSingleSubmittedApplication?.data;

  const DetailsData = useMemo(() => {
    return [
      {
        label: "1st Principal’s Name & Title",
        subData: [
          { label: "Name:", value: Data?.principal_one_name || "" },
          { label: "Email", value: Data?.principal_one_designation || "" },
        ],
      },
      {
        label: "2nd Principal’s Name & Title",
        subData: [
          { label: "Name:", value: Data?.principal_two_name || "" },
          { label: "Email:", value: Data?.principal_two_designation || "" },
        ],
      },
      { label: "Address", value: Data?.address || "" },
      { label: "Telephone", value: Data?.telephone || "" },
      { label: "Fax", value: Data?.fax || "" },
      { label: "Web Address", value: Data?.website || "" },
      { label: "DUNS Number (for USG awards only)", value: Data?.duns_number || "" },
      { label: "Has Financial Conflict of Interest Policy as applicable to U.S. PHS agencies’ funding.", value: Data?.has_conflict_of_interest === true ? "Yes" : "No" },
      { label: "Organization Type", value: Data?.organisation_type || "" },
    ];
  }, [Data]);
  return (
    <div className="w-full flex flex-col text-[#1A0000] justify-center items-center">
      <div className="w-full bg-white rounded-2xl flex flex-col gap-y-[1.25rem] py-5 px-10">
        <Card className="flex flex-col gap-y-[1.25rem] pb-[10rem]">
          <p className="text-lg font-semibold">BE GLAD CARE AND SUPPORT FOUNDATION</p>
          <div className="flex flex-wrap justify-between gap-y-[1.25rem]">
            {DetailsData.map((item, index) => {
              return item.subData ? (
                <div className="w-[45%] flex flex-col gap-y-[1.25rem]" key={index}>
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
