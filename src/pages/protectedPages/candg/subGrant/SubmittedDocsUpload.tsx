import { PDFICon } from "assets/svgs/CAndGSvgs";
import Card from "components/shared/Card";
import { useState } from "react";
import { Document, Page } from "react-pdf";
import { useParams } from "react-router-dom";
import { SubGrantApplicationsDocsApi } from "services/cAndGApi/subGrant";

const SubmittedDocsUpload = () => {
  const params = useParams();
  const getSubGrantDocs = SubGrantApplicationsDocsApi.useGetSubGrantsApplicationDocsQuery({ id: params.id });
  const [numPages, setNumPages] = useState<number>();
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className="w-full flex flex-col text-[#1A0000] justify-center items-center">
      <p className="text-[1.25rem] font-semibold w-full px-[.625rem] py-5 border-b border-[#DBDFE9] mb-5">Uploaded Documents</p>
      <div className="w-full">
        <Card className="flex flex-col gap-y-[1.25rem] pb-[10rem]">
          <div className="flex flex-wrap w-auto gap-x-[1.25rem] gap-y-[1.25rem]">
            {getSubGrantDocs?.data?.results?.map((item: any, index: number) => {
              return (
                <Card className="w-full md:w-[296px] h-[316px] overflow-hidden py-5 px-4 bg-white rounded-md flex flex-col justify-between items-start" key={index}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex gap-x-[1rem] items-center">
                      <PDFICon />
                      <p className="text-[#756D6D] font-semibold">{item?.document_name?.slice(0, 15)}</p>
                    </div>
                  </div>
                  <div className="h-[80%] overflow-hidden flex flex-col justify-center items-center w-full rounded-lg">
                    <Document className={"w-full h-full rounded-md cursor-pointer flex flex-col justify-center items-center"} noData="Invalid PDF file" file={item?.document_file} error={"Invalid PDF file"} onLoadSuccess={onDocumentLoadSuccess}>
                      <Page pageNumber={1} pageIndex={numPages} canvasBackground="gray" className={"rounded-md cursor-pointer bg-gray-300"} scale={0.5}></Page>
                    </Document>
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SubmittedDocsUpload;
