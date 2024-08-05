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

const Consultancy = () => {
  const navigate = useNavigate();

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
        {Array.of("", "", "", "", "", "").map((item, index) => {
          return (
            <div className="w-[49.5%]" key={index}>
              <Card className="flex flex-col gap-y-[.625rem] w-full relative p-[2rem]">
                <div className="flex justify-between items-center">
                  <p className={`bg-[#8C6400] text-[.625rem] py-1 px-[.625rem] w-fit rounded-full text-white text-sm`}>
                    {" "}
                    <span className="font-medium">Date Posted:</span> {formatDate(new Date(), DateFormatEnum.SPACE_COMMA_dd_MMM_yyyy)}
                  </p>
                  <p className={`bg-[#26B94133] text-[.625rem] py-1 px-[.625rem] w-fit rounded-full text-[#26B941]`}>Approved</p>
                </div>
                <CardTitle className="text-black text-[1.25rem]" title="Card">
                  Technical Associates{" "}
                </CardTitle>
                <div className="w-full flex flex-wrap items-center justify-start gap-x-[.625rem] gap-y-[1rem]">
                  <DetailsTag icon={<PeoplePositionsSvg />} deet="(15 positions)" />
                  <DetailsTag icon={<ClockTimingSvg />} deet="9 months with possibility of extension" />
                  <DetailsTag icon={<DataCalenderSvg />} deet="22nd January 2024" />
                  <DetailsTag icon={<LocationSvg />} deet="Various LGAs of Anambra state" />
                  <DetailsTag icon={<SuiteCase />} deet="Internal" />
                  <DetailsTag icon={<PersonClusterSvg />} deet="Cluster Leads" />
                </div>
                <div className="relative">
                  <p>Achieving Health Nigeria Initiative (AHNi) is an indigenous non-governmental organization that promotes socio-economic development by supporting a broad range of global health interventions, education, and economic initiatives in Nigeria.</p>
                  <div className="w-full flex flex-col items-center justify-center absolute bottom-0 left-0 py-[.75rem] bg-gradient-to-b from-white/50 via-white/60 to-white/90">
                    <div className="bg-white w-fit">
                      {" "}
                      <Button
                        className="bg-white text-primary z-[99] border border-[#00000012]"
                        onClick={() => {
                          navigate("/c-and-g/consultancy/details/" + 1);
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
