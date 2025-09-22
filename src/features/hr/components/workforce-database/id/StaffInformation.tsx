import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { pdfjs, Document, Page } from "react-pdf";

import DescriptionCard from "components/DescriptionCard";
import { Separator } from "components/ui/separator";
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
import { EmployeeOnboarding } from "definations/hr-types/employee-onboarding";
import { useGetEmployeeOnboardingQualificationsList } from "@/features/hr/controllers/hrEmployeeOnboardingQualificationsController";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const StaffInformation = ({ info }: { info: EmployeeOnboarding }) => {
  // const [data, setData] = useState<EmployeeOnboarding | {}>({});
  const data = info?.data || info;
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber] = useState<number>(1);
  const { id } = useParams();

  const { data: qualifications, isLoading: getLoading } =
    useGetEmployeeOnboardingQualificationsList({
      employee: id as string,
    });

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  console.log("StaffInformation - info prop:", info);
  console.log("StaffInformation - data:", data);
  console.log("StaffInformation - qualifications:", qualifications);

  if (!data && !info) {
    return <div className="p-4">No employee information available</div>;
  }

  return (
    <div className='space-y-6'>
      <DescriptionCard
        label='Employee Legal Name'
        description={`${data?.legal_firstname || "N/A"} ${data?.legal_lastname || "N/A"}`}
      />

      <Separator />
      <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
        <DescriptionCard
          label='Designation'
          description={data?.designation?.name || data?.position || "N/A"}
        />
      </div>
      <Separator />
      <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
        <DescriptionCard
          label='Phone Number'
          description={data?.phone_number}
        />
        <DescriptionCard
          label='Mobile/Other'
          description={data?.other_number}
        />
      </div>

      <Separator />

      <div className='grid grid-cols-1 items-center gap-5 md:grid-cols-2 lg:grid-cols-3'>
        <div className='border space-y-4 rounded-2xl p-5 w-full overflow-hidden h-fit'>
          <div className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-2'>
              <PdfIcon />
              <h2 className='line-clamp-1'>Passport</h2>
            </div>
          </div>

          {data?.passport_file?.endsWith("pdf") ? (
            <div className='bg-[#0000001A] py-2 w-full h-56 rounded-2xl flex items-center justify-center overflow-hidden'>
              <Dialog>
                <DialogTrigger>
                  <Document
                    file={data?.passport_file}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    <Page pageNumber={pageNumber} width={200} height={100} />
                  </Document>
                </DialogTrigger>
                <DialogContent className='min-w-[60%]'>
                  <DialogHeader>
                    <DialogTitle>Passport</DialogTitle>
                    <div className='flex pt-5 justify-center'>
                      <Document
                        file={data?.passport_file}
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
            <div className='h-56'>
              <img src={data?.passport_file} alt='passport' />
            </div>
          )}
        </div>

        <div className='border space-y-4 rounded-2xl p-5 w-full overflow-hidden h-fit'>
          <div className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-2'>
              <PdfIcon />
              <h2 className='line-clamp-1'>Signature</h2>
            </div>
          </div>

          {data?.signature_file?.endsWith("pdf") ? (
            <div className='bg-[#0000001A] py-2 w-full h-56 rounded-2xl flex items-center justify-center overflow-hidden'>
              <Dialog>
                <DialogTrigger>
                  <Document
                    file={data?.signature_file}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    <Page pageNumber={pageNumber} width={200} height={100} />
                  </Document>
                </DialogTrigger>

                <DialogContent className='min-w-[60%]'>
                  <DialogHeader>
                    <DialogTitle>Signature</DialogTitle>
                    <div className='flex pt-5 justify-center'>
                      <Document
                        file={data?.signature_file}
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
            <div className='h-56'>
              <img src={data?.signature_file} alt='signature' />
            </div>
          )}
        </div>
      </div>

      <Separator />

      <div className='grid grid-cols-1 items-center gap-x-5 gap-y-8 md:grid-cols-2 lg:grid-cols-2'>
        <DescriptionCard label='Department/Unit' description={data?.group} />
        <DescriptionCard label='Location' description={data?.location.state} />
        <DescriptionCard
          label='Employment Type'
          description={data?.employment_type}
        />
        <DescriptionCard
          label='Employment Status'
          description={data?.employment_status}
        />
      </div>

      <div className='card-wrapper space-y-6'>
        <h4 className='text-red-500 text-lg font-medium'>Qualifications</h4>

        <Separator />

        {qualifications?.data && qualifications.data.results.length > 0 && (
          <div className='grid grid-cols-1 items-center gap-5 md:grid-cols-2 lg:grid-cols-2'>
            {qualifications.data.results.map((qualification, index) => (
              <section>
                <DescriptionCard
                  label={qualification.certificate_name}
                  description='2019'
                />
                <p className='font-medium mb-5'>
                  {qualification.institution_name}
                </p>

                <div
                  key={index}
                  className='border space-y-4 rounded-2xl p-5 w-full overflow-hidden h-fit'
                >
                  <div className='flex items-center justify-between gap-2'>
                    <div className='flex items-center gap-2'>
                      <PdfIcon />
                      <h2 className='line-clamp-1'>
                        {qualification?.certificate_file.split("/").pop()}
                      </h2>
                    </div>
                  </div>

                  {qualification.certificate_file?.endsWith("pdf") ? (
                    <div className='bg-[#0000001A] py-2 w-full h-56 rounded-2xl flex items-center justify-center overflow-hidden'>
                      <Dialog>
                        <DialogTrigger>
                          <Document
                            file={qualification.certificate_file}
                            onLoadSuccess={onDocumentLoadSuccess}
                          >
                            <Page
                              pageNumber={pageNumber}
                              width={200}
                              height={100}
                            />
                          </Document>
                        </DialogTrigger>

                        <DialogContent className='min-w-[60%]'>
                          <DialogHeader>
                            <DialogTitle>
                              {qualification.certificate_name}
                            </DialogTitle>
                            <div className='flex pt-5 justify-center'>
                              <Document
                                file={qualification?.certificate_file}
                                onLoadSuccess={onDocumentLoadSuccess}
                              >
                                {Array.from(
                                  new Array(numPages),
                                  (el, index) => (
                                    <Page
                                      key={`page_${index + 1}`}
                                      pageNumber={index + 1}
                                      width={600}
                                      // height={100}
                                    />
                                  )
                                )}
                              </Document>
                            </div>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    <div className='h-85'>
                      <img
                        src={qualification.certificate_file}
                        alt={qualification.certificate_name}
                      />
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <div className='card-wrapper space-y-6'>
        <h4 className='text-red-500 text-lg font-medium'>
          Group Membership & Location
        </h4>
        <Separator />
        <div className='grid grid-cols-1 items-center gap-5 md:grid-cols-2 lg:grid-cols-2'>
          <DescriptionCard label='Group Membership' description='---' />
          <DescriptionCard label='Location' description='---' />
        </div>
      </div>
    </div>
  );
};

export default StaffInformation;
