import { Icon } from "@iconify/react";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import { Label } from "components/ui/label";
import { CategoryResultsData } from "definations/configs/category";
import { EOIResultsData } from "definations/procurement-types/eoi";
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
import { cn } from "lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const EoIDetails = (data: EOIResultsData) => {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className='p-5'>
      <Card className='space-y-8 p-10'>
        <h4 className='text-base font-medium'>{data.name}</h4>

        <div className='flex items-center flex-wrap gap-x-10 gap-y-5'>
          <div className='flex gap-3 items-center'>
            <Icon icon='ooui:reference' fontSize={18} />
            <h6>{data?.eoi_number}</h6>
          </div>
          {/* <div className='flex gap-3 items-center'>
            <Icon icon='iconamoon:location-pin-duotone' fontSize={18} />
            <h6>Head Office, Abuja</h6>
          </div>
          <div className='flex gap-3 items-center'>
            <Icon icon='solar:case-minimalistic-bold-duotone' fontSize={18} />
            <h6>Single Sourcing</h6>
          </div> */}
          <div className='flex gap-3 items-center'>
            <Icon icon='pajamas:status-neutral' fontSize={18} />
            <Badge
              className={cn(
                "px-3",
                data?.status === "Approved" && "bg-green-200 text-green-500",
                data?.status === "Rejected" && "bg-red-200 text-red-500",
                data?.status === "Pending" && "bg-yellow-200 text-yellow-500"
              )}
            >
              {data.status}
            </Badge>
          </div>
        </div>

        <div className='space-y-2'>
          <h2 className='font-medium text-base'>Background</h2>
          <h4 className=' text-gray-500'>{data.description}</h4>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <div className='space-y-2'>
            <h2 className='font-medium text-base'>Opening Date</h2>
            <Badge className='px-3 bg-gray-300 text-gray-600'>
              {data.opening_date}
            </Badge>
          </div>
          <div className='space-y-2'>
            <h2 className='font-medium text-base'>Closing Date</h2>
            <Badge className='px-3 bg-gray-300 text-gray-600'>
              {data.closing_date}
            </Badge>
          </div>

          <div className='space-y-2'>
            <h2 className='font-medium text-base'>Financial Year</h2>
            <Badge className='px-3 bg-gray-300 text-gray-600'>
              {data.financial_year.year || "null"}
            </Badge>
          </div>
        </div>

        <div className='space-y-2'>
          <h2 className='font-medium text-[#DEA004]  text-base'>Categories</h2>

          <div className='flex flex-wrap gap-x-2 gap-y-4'>
            {data.categories.map((category: CategoryResultsData) => (
              <Label
                className='bg-[#EBE8E1] py-2 px-4 rounded'
                key={category.id}
              >
                {category.name}
              </Label>
            ))}
          </div>
        </div>

        <div className='space-y-2'>
          <h2 className='font-medium text-base'>Document</h2>

          <div className='bg-[#0000001A] py-2 w-full h-56 rounded-2xl flex items-center justify-center overflow-hidden'>
            <Dialog>
              <DialogTrigger>
                <Document
                  file={data.document_detail}
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <Page pageNumber={pageNumber} width={200} height={100} />
                </Document>
              </DialogTrigger>
              <DialogContent className='min-w-[60%]'>
                <DialogHeader>
                  <DialogTitle>{data.name}</DialogTitle>
                  <div className='flex pt-5 justify-center'>
                    <Document
                      file={data.document_detail}
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
        </div>
      </Card>
    </div>
  );
};

export default EoIDetails;
