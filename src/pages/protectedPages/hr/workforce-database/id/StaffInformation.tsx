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
import img from "assets/imgs/avartar.png";
import PdfIcon from "components/icons/PdfIcon";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const StaffInformation = () => {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber] = useState<number>(1);

  const document = "doc.pdf";

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <DescriptionCard
          label="Employee Legal Name"
          description="Adebayo Grace"
        />
        <DescriptionCard label="Middle Name" description="Spouse" />
        <DescriptionCard label="Last Name" description="Spouse" />
      </div>
      <Separator />
      <DescriptionCard
        label="Designation"
        description="Director of Operations"
      />
      <Separator />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <DescriptionCard label="Phone Number" description="+2348061234567" />
        <DescriptionCard label="Mobile/Other" description="+2348061234567" />
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
          {document.endsWith("pdf") ? (
            <div className="bg-[#0000001A] py-2 w-full h-56 rounded-2xl flex items-center justify-center overflow-hidden">
              <Dialog>
                <DialogTrigger>
                  <Document
                    file={"https://pdfobject.com/pdf/sample.pdf"}
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
                        file={"https://pdfobject.com/pdf/sample.pdf"}
                        onLoadSuccess={onDocumentLoadSuccess}
                      >
                        {Array.from(new Array(numPages), (el, index) => (
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
              <img src={img} alt="passport" />
            </div>
          )}
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-2 lg:grid-cols-2">
        <DescriptionCard
          label="Department/Unit"
          description="Operations and Programs Management Unit"
        />
        <DescriptionCard label="Tel. Ext." description="+2348061234567" />
        <DescriptionCard label="Project Name" description="ACEBAY Project" />
        <DescriptionCard label="Type" description="---" />
        <DescriptionCard label="Status" description="---" />
        <DescriptionCard label="Do you have a Computer?" description="Yes" />
        <DescriptionCard
          label="Do you require Email access?"
          description="No"
        />
      </div>
      <div className="card-wrapper space-y-6">
        <h4 className="text-red-500 text-lg font-medium">Qualifications</h4>
        <Separator />
        <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-2 lg:grid-cols-2">
          <div className="border space-y-4 rounded-2xl p-5 w-full overflow-hidden h-fit">
            <DescriptionCard
              label="Bachelor's Degree in Business Administration "
              description="2019"
            />
            <p className="font-medium">Obafemi Awolowo University</p>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <PdfIcon />
                <h2 className="line-clamp-1">B.Sc Business Administration </h2>
              </div>
            </div>
            {document.endsWith("pdf") ? (
              <div className="bg-[#0000001A] py-2 w-full h-56 rounded-2xl flex items-center justify-center overflow-hidden">
                <Dialog>
                  <DialogTrigger>
                    <Document
                      file={"https://pdfobject.com/pdf/sample.pdf"}
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
                          file={"https://pdfobject.com/pdf/sample.pdf"}
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
                <img src={img} alt="passport" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card-wrapper space-y-6">
        <h4 className="text-red-500 text-lg font-medium">
          Group Membership & Location
        </h4>
        <Separator />
        <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-2 lg:grid-cols-2">
          <DescriptionCard label="Group Membership" description="---" />
          <DescriptionCard label="Location" description="---" />
        </div>
      </div>
    </div>
  );
};

export default StaffInformation;
