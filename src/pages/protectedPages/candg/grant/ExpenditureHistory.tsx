import React, { useMemo } from "react";
import { TotalExpenditureSvg, TotalIncomeSvg } from "assets/svgs/CAndGSvgs";

const ExpenditureHistory: React.FC = () => {
  const StatsCard = useMemo(() => {
    return [
      { id: 1, name: "Total Income", stat: 2000000, icon: <TotalIncomeSvg /> },
      { id: 1, name: "Total Expenditure", stat: 300000, icon: <TotalExpenditureSvg /> },
    ];
  }, []);
  return (
    <section className="w-full flex flex-col px-5 space-y-[1.25rem]">
      <div className="flex flex-wrap items-start justify-between">
        {StatsCard.map((item, index) => {
          return (
            <div className={`w-[49%] px-[1.875rem] py-[1.25rem] rounded-[.625rem] justify-between items-center flex ${index === 0 ? "bg-[#107D38]" : "bg-[#B42318]"}`} key={index}>
              <div className="border border-white p-1 rounded">{item.icon}</div>
              <div className="text-end text-white space-y-[.625rem]">
                <p className="text-sm">{item.name}</p>
                <p className="text-[1.5rem] font-semibold">N{item.stat}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ExpenditureHistory;
