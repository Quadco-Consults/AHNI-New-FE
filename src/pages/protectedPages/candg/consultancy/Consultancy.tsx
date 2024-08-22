import { ClockTimingSvg, DataCalenderSvg, LocationSvg, PeoplePositionsSvg, PersonClusterSvg, SuiteCase } from "assets/svgs/CAndGSvgs";
import FilterIcon2 from "assets/svgs/FilterIcon2";
import FormButton from "atoms/FormButton";
import SearchBar from "atoms/SearchBar";
import AddSquareIcon from "components/icons/AddSquareIcon";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { CardTitle } from "components/ui/card";
import { DateFormatEnum } from "constants/DateContants";
import { CandGRoutes } from "constants/RouterConstants";
import { formatDate } from "date-fns";
import React from "react";
import { useNavigate } from "react-router-dom";
import { consultancyAPIs } from "services/cAndGApi/consultancy";

const Consultancy = () => {
  const navigate = useNavigate();
  const consultancy = consultancyAPIs.useGetAllConsultancyQuery({
    params: { no_paginate: false },
  });

  console.log(consultancy);

  return (
    <main className="w-full flex flex-col items-center justify-center gap-y-[1rem] px-[4rem]">
      {" "}
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center justify-center">
          <SearchBar onchange={() => ""} />

          <Button variant="ghost" className="">
            <FilterIcon2 />
          </Button>
        </div>
        <div className="flex items-center">
          <FormButton
            onClick={() => {
              navigate(CandGRoutes.NEW_CONSULTANCY);
            }}
          >
            <AddSquareIcon />
            <p>Create New</p>
          </FormButton>
        </div>
      </div>
      <div className="w-full flex flex-wrap justify-between items-start gap-y-[1rem]">
        {consultancy?.data?.results?.map((item: any, index: number) => {
          return (
            <div className="w-[49.5%] " key={index}>
              <Card className="flex flex-col gap-y-[.625rem] w-full min-h-[25rem] justify-between relative p-[2rem]">
                <div className="w-full space-y-[1.5rem]">
                  <div className="flex justify-between items-center">
                    <p className={`bg-[#8C6400] text-[.625rem] py-1 px-[.625rem] w-fit rounded-full text-white text-sm`}>
                      {" "}
                      <span className="font-medium">Date Posted:</span> {formatDate(new Date(item?.commencement_date), DateFormatEnum.SPACE_COMMA_dd_MMM_yyyy)}
                    </p>
                    <p className={`bg-[#26B94133] text-[.625rem] py-1 px-[.625rem] w-fit rounded-full text-[#26B941]`}>{item?.status}</p>
                  </div>
                  <CardTitle className="text-black text-[1.25rem]" title="Card">
                    {item?.title}
                  </CardTitle>
                  <div className="w-full flex flex-wrap items-center justify-start gap-x-[.625rem] gap-y-[1rem]">
                    <DetailsTag icon={<PeoplePositionsSvg />} deet={`(${item?.number_of_consultants} positions)`} />
                    <DetailsTag icon={<ClockTimingSvg />} deet={`${item?.duration} months with possibility of extension`} />
                    <DetailsTag icon={<DataCalenderSvg />} deet={formatDate(new Date(item?.effective_end_date), DateFormatEnum.SPACE_COMMA_dd_MMM_yyyy)} />
                    <DetailsTag icon={<LocationSvg />} deet={item?.locations?.map((loc: any) => `${loc} `)} />
                    <DetailsTag icon={<SuiteCase />} deet="Internal" />
                    <DetailsTag icon={<PersonClusterSvg />} deet="Cluster Leads" />
                  </div>
                </div>
                <div className="relative">
                  <p>{item?.evaluation_comments}.</p>
                  <div className="w-full flex flex-col items-center justify-center absolute bottom-0 left-0 py-[.75rem] bg-gradient-to-b from-white/50 via-white/60 to-white/90">
                    <div className="bg-white w-fit">
                      {" "}
                      <Button
                        className="bg-white text-primary z-[99] border border-[#00000012]"
                        onClick={() => {
                          navigate("/c-and-g/consultancy/details/" + item?.id);
                        }}
                      >
                        Tap to View
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default Consultancy;

export const DetailsTag = ({ icon, deet }: { icon: React.ReactNode; deet: string }) => {
  return (
    <div className="flex items-center border border-[#C7CBD5] text-sm p-1 px-[.625rem] gap-x-[.25rem] rounded-full">
      {icon}
      <p>{deet}</p>
    </div>
  );
};
