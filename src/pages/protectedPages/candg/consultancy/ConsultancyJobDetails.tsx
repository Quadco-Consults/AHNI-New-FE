import Card from "components/shared/Card";
import { useParams } from "react-router-dom";
import { consultancyAPIs } from "services/cAndGApi/consultancy";
import { DetailsTag } from "./Consultancy";
import { ClockTimingSvg, DataCalenderSvg, PDFICon, PeoplePositionsSvg, PersonClusterSvg, SuiteCase } from "assets/svgs/CAndGSvgs";
import LocationSvg from "assets/svgs/LocationSvg";
import { formatDate } from "date-fns";
import { DateFormatEnum } from "constants/DateContants";
import { LoadingSpinner } from "components/shared/Loading";
import { Document, Page } from "react-pdf";
import { useState } from "react";

const ConsultancyJobDetails = () => {
  const params = useParams();
  const consultancyDetails = consultancyAPIs.useGetSingleConsultancyQuery(params.id);
  // console.log(consultancyDetails?.data);

  const PageData = consultancyDetails?.data;
  const [numPages, setNumPages] = useState<number>();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return consultancyDetails.isLoading ? (
    <LoadingSpinner />
  ) : (
    <div className="w-full flex flex-col justify-center items-center">
      <Card className="w-full flex flex-col gap-y-[1rem]">
        <h2 className="text-lg font-semibold">{PageData?.title || ""}</h2>
        <div className="w-[50%] flex flex-wrap items-center justify-start gap-x-[.625rem] gap-y-[.5rem]">
          <DetailsTag icon={<PeoplePositionsSvg />} deet={`(${PageData?.number_of_consultants || ""} positions)`} />
          <DetailsTag icon={<ClockTimingSvg />} deet={`${PageData?.duration || ""} months with possibility of extension`} />
          <DetailsTag icon={<DataCalenderSvg />} deet={formatDate(new Date(PageData?.effective_end_date || new Date()), DateFormatEnum.SPACE_COMMA_dd_MMM_yyyy)} />
          <DetailsTag icon={<LocationSvg />} deet={PageData?.locations?.map((loc: any) => `${loc} `) || []} />
          <DetailsTag icon={<SuiteCase />} deet="Internal" />
          <DetailsTag icon={<PersonClusterSvg />} deet="Cluster Leads" />
        </div>
        <div className="space-y-[1rem]">
          <p className="font-semibold">Background</p>
          <p>{PageData?.evaluation_comments}</p>
        </div>
        <div className="w-fit">
          <Card className="w-[18.5rem] overflow-hidden h-[19.75rem] justify-center gap-y-[1rem] flex flex-col">
            <div className="flex items-center gap-x-[.75rem]">
              <PDFICon />
              <p className="font-semibold text-[#756D6D]">Full Advert Document</p>
            </div>
            <div className="w-full h-[70%] overflow-hidden bg-gray-200 rounded-md flex flex-col justify-center items-center">
              <Document className={"w-full h-full rounded-md cursor-pointer flex flex-col justify-center items-center"} noData="Invalid PDF file" file={"https://pdfobject.com/pdf/sample.pdf"} error={"Invalid PDF file"} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={1} pageIndex={numPages} canvasBackground="gray" className={"rounded-md cursor-pointer bg-gray-300"} scale={0.5}></Page>
              </Document>
            </div>{" "}
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default ConsultancyJobDetails;
