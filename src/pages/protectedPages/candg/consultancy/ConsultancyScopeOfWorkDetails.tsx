import Card from "components/shared/Card";
import { Loading } from "components/shared/Loading";
import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import { useParams } from "react-router-dom";
import { consultancyAPIs } from "services/cAndGApi/consultancy";

const ConsultancyScopeOfWorkDetails = () => {
  const params = useParams();
  const ConsultancyScopeDetails = consultancyAPIs.useGetSingleConsultancyScopeQuery(params.id);
  const PageData = ConsultancyScopeDetails?.data;

  const [numPages, setNumPages] = useState<number>();
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  const totalDays: any = PageData?.specific_deliverables && Object.values(PageData?.specific_deliverables)?.reduce((t, n) => Number(t) + Number(n));
  return ConsultancyScopeDetails.isLoading ? (
    <Loading />
  ) : (
    <div className="w-full flex flex-col justify-center items-center text-[#1A0000]">
      {PageData?.message === "Scope of work not found" ? (
        <Card className="w-full py-[10rem] flex flex-col justify-center items-center">
          <div className="text-[#ff0000] font-semibold text-lg">
            <p>{PageData?.message}</p>
          </div>
        </Card>
      ) : (
        <Card className="w-full flex flex-col gap-y-[1rem]">
          <div>
            <h2 className="text-lg font-semibold">Scope of Work</h2>
          </div>
          <ScopeCard label="Description" detail={PageData?.description} />
          <ScopeCard label="Background" detail={PageData?.background} />
          <ScopeCard label="Objectives" detail={PageData?.objectives} />
          <ScopeCard label="" detail={""} />
          <section className="w-full py-[1rem] flex flex-col gap-y-[3rem]">
            <div className="flex flex-col w-full gap-y-[1.25rem] border-y border-gray-200 py-[1.5rem]">
              <div className="space-y-[10px]">
                <p className="font-semibold text-[#DEA004]">Specific Deliverables</p>
                <p className="text-sm text-[#4D4545]">Based on the activities listed above, the Contractor is expected to produced or accomplish the following:</p>
              </div>
              <div className="flex flex-col gap-y-[1.25rem]">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold w-[30%]">Specific Deliverables</p>
                  <p className="text-sm font-semibold w-[30%]">Number of Days Required</p>
                </div>
                <div className="flex flex-col gap-y-[1rem]">
                  {Object.entries(PageData?.specific_deliverables || {})?.map((item, index) => {
                    return (
                      <div className="w-full flex justify-between items-center" key={index}>
                        <p className="w-[30%] text-sm pl-[1rem] capitalize">{item?.[0]}</p>
                        <p className="w-[30%] text-sm pl-[1rem]">{Number(item?.[1])} Days</p>
                      </div>
                    );
                  })}
                </div>
                <div className="w-full flex justify-between items-center border-y border-[#FF0000] px-[1rem] py-[10px]">
                  <p className="font-semibold w-[30%] px-[1rem]">Total</p>
                  {/* <p className="font-semibold w-[30%] px-[1rem]">{Object.entries(PageData?.specific_deliverables || {})?.reduce((acc: any, curr: any) => Number(Number(acc?.[1].to) + Number(curr?.[1])), 0)}Days</p> */}
                  <p className="font-semibold w-[30%] px-[1rem]">
                    {totalDays ?? 0}
                    <span> </span>Days
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full gap-y-[1.25rem]">
              <div className="space-y-[10px]">
                <p className="font-semibold text-[#DEA004]">Payment Schedule</p>
                <p className="text-sm text-[#4D4545]">The fee rate for this work will be paid at the end of every month of assignment upon satisfactory approval by the AHNi Technical Monitor.</p>
                <p className="text-xs text-[#FF0000] font-medium">NOTE: 5% With Holding tax (WHT) will be deducted - in line with the regulations</p>
                <div className="flex flex-col gap-y-[1.25rem]">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold w-[30%]">Fee Rate</p>
                    <p className="text-sm font-semibold w-[30%]">Payment Frequency</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm w-[30%] px-[1rem]">N{Number(PageData?.fee_rate)}</p>
                    <p className="text-sm w-[30%] px-[1rem]">{PageData?.payment_frequency}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <Card className="w-fit">
            <Document className={"w-[18.5rem] h-[19.75rem] rounded-md cursor-pointer flex flex-col justify-center items-center"} noData="Invalid PDF file" file={PageData?.scope_file} error={"Invalid PDF file"} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={1} pageIndex={numPages} canvasBackground="gray" className={"rounded-md cursor-pointer bg-gray-300"} scale={0.5}></Page>
            </Document>
          </Card>
        </Card>
      )}
    </div>
  );
};

export default ConsultancyScopeOfWorkDetails;

const ScopeCard = ({ label, detail }: { label: string; detail: string | React.ReactElement }) => {
  return (
    <div className="flex flex-col w-full gap-y-[1.25rem]">
      <p className="font-semibold">{label}</p>
      <div>{detail}</div>
    </div>
  );
};
