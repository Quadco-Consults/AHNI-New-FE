"use client";

import { useState } from "react";
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
import PdfIcon from "components/icons/PdfIcon";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfContent = ({
  pdf = {
    name: "document",
    document: "document.pdf",
  },
}: {
  pdf?: any;
}) => {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  return (
    <div className='border space-y-4 rounded-2xl p-5 w-full overflow-hidden h-fit'>
      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <PdfIcon />
          <h2 className='line-clamp-1'>{pdf?.name}</h2>
        </div>
      </div>
      {pdf?.document?.endsWith("pdf") ? (
        <div className='bg-[#0000001A] py-2 w-full h-56 rounded-2xl flex items-center justify-center overflow-hidden'>
          <Dialog>
            <DialogTrigger>
              <Document
                file={pdf?.document ?? "https://pdfobject.com/pdf/sample.pdf"}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page pageNumber={pageNumber} width={200} height={100} />
              </Document>
            </DialogTrigger>
            <DialogContent className='min-w-[60%]'>
              <DialogHeader>
                <DialogTitle>{pdf.name}</DialogTitle>
                <div className='flex pt-5 justify-center'>
                  <Document
                    file={pdf?.document ?? "https://pdfobject.com/pdf/sample.pdf"}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    {Array.from(new Array(numPages), (_, index) => (
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
        <div className='h-56'>
          <img src={pdf.document} alt={pdf.name} />
        </div>
      )}
    </div>
  );
};

export default PdfContent;
