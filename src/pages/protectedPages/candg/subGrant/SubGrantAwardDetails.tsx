import Card from "components/shared/Card";
import { LoadingSpinner } from "components/shared/Loading";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { SubGrantApi } from "services/cAndGApi/subGrant";

const SubGrantAwardDetails = () => {
  const params = useParams();
  const getSubGrantDetails = SubGrantApi.useGetSingleSubGrantsQuery({ id: params.id });
  const Data = getSubGrantDetails?.data;

  const DetailsData = useMemo(() => {
    return [
      { id: 1, label: "Project Title", value: `${Data?.project_title ?? ""}` },
      { id: 1, label: "AHNI  Project Number", value: `${Data?.project_number ?? ""}` },
      { id: 1, label: "AHNI Grant Administrator", value: `${Data?.grant_administrator?.first_name + " " + Data?.grant_administrator?.last_name}` },
      { id: 1, label: "Country of Performance", value: `${Data?.country ?? ""}` },
      { id: 1, label: "AHNI Originating Funder / Funding Source", value: `${Data?.funding_source?.name ?? ""}` },
      { id: 1, label: "AHNI Originating Award Type", value: `${Data?.award_type ?? ""}` },
      { id: 1, label: "Subaward Type (Proposed)", value: `${Data?.sub_award_type ?? ""}` },
      { id: 1, label: "AHNI Program/Technical Staff Contact", value: `${Data?.technical_staff?.first_name + " " + Data?.technical_staff?.last_name}` },
      { id: 1, label: "Business Unit", value: `${Data?.business_unit?.name}` },
      { id: 1, label: "Subaward Life of Project Value (USD)", value: "$" + Data?.project_value_usd || 0 },
      { id: 1, label: "Subaward Life of Project Value (Local Currency)", value: "N" + Data?.project_value_local_currency || 0 },
      { id: 1, label: "Start Date", value: `${Data?.start_date}` },
      { id: 1, label: "End Date", value: `${Data?.end_date}` },
    ];
  }, [Data]);
  return getSubGrantDetails.isLoading ? (
    <LoadingSpinner />
  ) : (
    <div className="w-full flex flex-col text-[#1A0000] justify-center items-center">
      <div className="w-full bg-white rounded-2xl flex flex-col gap-y-[1.25rem] py-5 px-10">
        <p className="text-xl font-semibold">Award Details</p>
        <Card className="flex flex-col gap-y-[1.25rem] pb-[10rem]">
          <p></p>
          <div className="flex flex-wrap justify-between gap-y-[1.25rem]">
            {DetailsData.map((item, index) => {
              return (
                <div className={`${index === 0 ? "w-full" : "md:w-[45%] w-full"} flex flex-col gap-y-[1.25rem]`} key={index}>
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

export default SubGrantAwardDetails;
