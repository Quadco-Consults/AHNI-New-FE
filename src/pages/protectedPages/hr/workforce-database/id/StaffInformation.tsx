import DescriptionCard from "components/shared/DescriptionCard";
import { Separator } from "components/ui/separator";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { useState } from "react";
import PdfIcon from "components/icons/PdfIcon";
import { WorkforceResults } from "definations/hr-types/workforce";
import { useParams } from "react-router-dom";
import WorkforceAPI from "services/hrApi/workforce";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const StaffInformation = ({ data }: { data: WorkforceResults }) => {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber] = useState<number>(1);
  const { id } = useParams();

  const qualificationResultQuery =
    WorkforceAPI.useGetWorkforceQualificationsQuery({
      path: { id: id as string },
    });

  const qualifications = qualificationResultQuery?.data;

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  return (
    <div className="space-y-6">
      <DescriptionCard
        label="Employee Legal Name"
        description={`${data?.user?.first_name} ${data?.user?.last_name}`}
      />

      <Separator />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <DescriptionCard
          label="Designation"
          description={data?.user?.designation}
        />
        <DescriptionCard label="Position" description={data?.position.name} />
      </div>
      <Separator />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <DescriptionCard
          label="Phone Number"
          description={data?.user?.phone_number}
        />
        <DescriptionCard
          label="Mobile/Other"
          description={data?.user?.phone_number}
        />
      </div>
      <Separator />
      <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div className="border space-y-4 rounded-2xl p-5 w-full overflow-hidden h-fit">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <PdfIcon />
              <h2 className="line-clamp-1">Passport</h2>
            </div>
          </div>
          {data?.passport.endsWith("pdf") ? (
            <div className="bg-[#0000001A] py-2 w-full h-56 rounded-2xl flex items-center justify-center overflow-hidden">
              <Dialog>
                <DialogTrigger>
                  <Document
                    file={data?.passport}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    <Page pageNumber={pageNumber} width={200} height={100} />
                  </Document>
                </DialogTrigger>
                <DialogContent className="min-w-[60%]">
                  <DialogHeader>
                    <DialogTitle>Passport</DialogTitle>
                    <div className="flex pt-5 justify-center">
                      <Document
                        file={data?.passport}
                        onLoadSuccess={onDocumentLoadSuccess}
                      >
                        {Array.from(new Array(numPages), (_, index) => (
                          <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            width={600}
                          />
                        ))}
                      </Document>
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="h-56">
              <img src={data?.passport} alt="passport" />
            </div>
          )}
        </div>
        <div className="border space-y-4 rounded-2xl p-5 w-full overflow-hidden h-fit">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <PdfIcon />
              <h2 className="line-clamp-1">Signature</h2>
            </div>
          </div>
          {data?.signature.endsWith("pdf") ? (
            <div className="bg-[#0000001A] py-2 w-full h-56 rounded-2xl flex items-center justify-center overflow-hidden">
              <Dialog>
                <DialogTrigger>
                  <Document
                    file={data?.signature}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    <Page pageNumber={pageNumber} width={200} height={100} />
                  </Document>
                </DialogTrigger>
                <DialogContent className="min-w-[60%]">
                  <DialogHeader>
                    <DialogTitle>Signature</DialogTitle>
                    <div className="flex pt-5 justify-center">
                      <Document
                        file={data?.signature}
                        onLoadSuccess={onDocumentLoadSuccess}
                      >
                        {Array.from(new Array(numPages), (_, index) => (
                          <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            width={600}
                          />
                        ))}
                      </Document>
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="h-56">
              <img src={data?.signature} alt="signature" />
            </div>
          )}
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-2 lg:grid-cols-2">
        <DescriptionCard
          label="Department/Unit"
          description={data?.department.name}
        />
        <DescriptionCard label="Location" description={data?.location.state} />
        <DescriptionCard
          label="Employment Type"
          description={data?.employment_type}
        />
        <DescriptionCard
          label="Employment Status"
          description={data?.employment_status}
        />
      </div>
      <div className="card-wrapper space-y-6">
        <h4 className="text-red-500 text-lg font-medium">Qualifications</h4>
        <Separator />
        <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-2 lg:grid-cols-2">
          {qualifications?.map((qualification) => (
            <div
              key={qualification?.id}
              className="border space-y-4 rounded-2xl p-5 w-full overflow-hidden h-fit"
            >
              <DescriptionCard label={qualification?.name} description="2019" />
              <p className="font-medium">{qualification?.institution}</p>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <PdfIcon />
                  <h2 className="line-clamp-1">{qualification?.name}</h2>
                </div>
              </div>
              {qualification?.document?.endsWith("pdf") ? (
                <div className="bg-[#0000001A] py-2 w-full h-56 rounded-2xl flex items-center justify-center overflow-hidden">
                  <Dialog>
                    <DialogTrigger>
                      <Document
                        file={qualification?.document}
                        onLoadSuccess={onDocumentLoadSuccess}
                      >
                        <Page
                          pageNumber={pageNumber}
                          width={200}
                          height={100}
                        />
                      </Document>
                    </DialogTrigger>
                    <DialogContent className="min-w-[60%]">
                      <DialogHeader>
                        <DialogTitle>{qualification.name}</DialogTitle>
                        <div className="flex pt-5 justify-center">
                          <Document
                            file={qualification?.document}
                            onLoadSuccess={onDocumentLoadSuccess}
                          >
                            {Array.from(new Array(numPages), (el, index) => (
                              <Page
                                key={`page_${index + 1}`}
                                pageNumber={index + 1}
                                width={600}
                                // height={100}
                              />
                            ))}
                          </Document>
                        </div>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="h-56">
                  <img src={qualification.document} alt={qualification.name} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* <div className="card-wrapper space-y-6">
        <h4 className="text-red-500 text-lg font-medium">
          Group Membership & Location
        </h4>
        <Separator />
        <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-2 lg:grid-cols-2">
          <DescriptionCard label="Group Membership" description="---" />
          <DescriptionCard label="Location" description="---" />
        </div>
      </div> */}
    </div>
  );
};

export default StaffInformation;
