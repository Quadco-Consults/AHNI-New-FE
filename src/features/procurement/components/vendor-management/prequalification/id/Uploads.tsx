/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { LoadingSpinner } from "components/Loading";
import { VendorsResultsData } from "definations/procurement-types/vendors";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { useState } from "react";
import VendorsDocumentAPI from "@/features/procurement/controllers/vendorDocumentsController";
import { VendorsDocumentResultsData } from "definations/procurement-types/vendors-document";
import { Button } from "components/ui/button";
import { toast } from "sonner";
import DeleteIcon from "components/icons/DeleteIcon";
import { Icon } from "@iconify/react";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Uploads = (data: VendorsResultsData) => {
  const [numPages, setNumPages] = useState<number>();
  // @ts-ignore
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const vendorDocumentsQueryResult =
    VendorsDocumentAPI.useGetAllVendorDocuments({
      page: 1,
      size: 1000,
      search: "",
      vendor: data?.id as string,
    });

  // @ts-ignore
  const vendorDocuments = vendorDocumentsQueryResult?.data?.data?.results;

  const deleteDocHandler = async (id: string) => {
    try {
      await AxiosWithToken.delete(`/procurements/vendor-documents/${id}/`);
      toast.success("Document successfully deleted.");
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <div className='bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
      <div className='p-5 flex justify-between items-center gap-5'>
        <h4 className='font-bold text-lg'>Uploaded Documents</h4>
        <div className='flex items-center gap-4'>
          <h6>Financial year</h6>
          <div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder='Select Year' />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectItem value='Single Source'>2022</SelectItem>
                  <SelectItem value='Open Tender'>2023</SelectItem>
                  <SelectItem value='National Open Tender'>2024</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <hr />

      {vendorDocumentsQueryResult?.isLoading ? (
        <LoadingSpinner />
      ) : vendorDocuments && vendorDocuments?.length > 0 ? (
        <div className='grid grid-cols-1 items-center p-5 gap-5 md:grid-cols-2 lg:grid-cols-3'>
          {vendorDocuments?.map((doc: VendorsDocumentResultsData) => {
            // return;
            return (
              <div
                // @ts-ignore
                key={doc?.document_id}
                className='border space-y-4 rounded-2xl p-5 w-full overflow-hidden h-fit'
              >
                <div className='flex items-center justify-between gap-2'>
                  <div className='flex items-center gap-2'>
                    {doc?.files[0]?.endsWith("pdf") ? (
                      <svg
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          opacity='0.4'
                          d='M7.13841 20.7033C8.00786 20.7942 9.13899 20.7955 10.7476 20.7955H14.9079C15.4456 20.7955 15.8816 21.233 15.8816 21.7727C15.8816 22.3125 15.4456 22.75 14.9079 22.75H10.6927C9.15159 22.75 7.91879 22.75 6.93654 22.6473C5.92712 22.5417 5.0659 22.3186 4.32113 21.7919C3.93077 21.5159 3.58222 21.1871 3.28704 20.8146C2.71721 20.0956 2.47396 19.2577 2.35985 18.2843C2.24996 17.3469 2.24998 16.1743 2.25 14.7262V12.1428V12.1427C2.25 10.7244 2.24999 9.61179 2.30919 8.71107C2.36944 7.79422 2.49398 7.02952 2.77509 6.31755C3.61848 4.1815 5.39221 2.51875 7.61221 1.73658C8.99465 1.2495 10.6813 1.24971 13.5209 1.25007L13.7572 1.25009L13.9605 1.25004L13.9606 1.25004C15.5156 1.2495 16.548 1.24914 17.4068 1.55172C18.7834 2.03673 19.8918 3.071 20.4206 4.41031C20.6039 4.87447 20.6795 5.36014 20.7153 5.90477C20.75 6.43335 20.75 7.08083 20.75 7.87999V7.88006V10.0455C20.75 10.5852 20.3141 11.0228 19.7763 11.0228C19.2386 11.0228 18.8026 10.5852 18.8026 10.0455V7.91329C18.8026 7.07303 18.8021 6.49008 18.7721 6.03341C18.7427 5.58546 18.6879 5.32704 18.6102 5.1304C18.3001 4.34503 17.6344 3.70339 16.7618 3.39593C16.2584 3.21858 15.5913 3.20463 13.7572 3.20463C13.4591 3.20463 13.1023 3.2058 12.7641 3.20732C12.426 3.20885 11.8726 3.21134 11.4104 3.48025C11.1057 3.65756 10.8849 3.85945 10.7582 4.08004C10.5409 4.45845 10.4166 4.89711 10.4166 5.3648C10.4166 5.51193 10.4262 5.70446 10.4344 5.88206L10.4344 5.88212C10.4417 6.03696 10.4496 6.20566 10.4531 6.3737C10.461 6.75379 10.449 7.19733 10.3343 7.62548C10.1108 8.45945 9.4594 9.11086 8.62543 9.33432C8.19728 9.44904 7.75374 9.46105 7.37365 9.45315C7.20551 9.44966 7.03693 9.44174 6.88201 9.43446C6.70441 9.42622 6.48041 9.41667 6.33328 9.41667C5.88661 9.41667 5.46642 9.53003 5.09991 9.72955C4.87246 9.85337 4.65104 10.0965 4.47811 10.3875C4.19749 10.8596 4.19732 11.4982 4.19734 11.7652L4.19737 14.6653C4.19737 16.1888 4.19894 17.2461 4.29387 18.0559C4.38611 18.8427 4.55555 19.2754 4.81111 19.5979C4.9889 19.8223 5.20128 20.0234 5.44274 20.1941C5.80057 20.4472 6.28449 20.6139 7.13841 20.7033Z'
                          fill='#FF0000'
                        />
                        <path
                          fill-rule='evenodd'
                          clip-rule='evenodd'
                          d='M8.01565 12.25C8.02714 12.2501 8.0386 12.2501 8.05002 12.2501H8.75002C9.85421 12.2501 10.8125 13.1114 10.8125 14.2501C10.8125 15.3887 9.85421 16.2501 8.75002 16.2501H7.75002V18.0001C7.75002 18.4143 7.41423 18.7501 7.00002 18.7501C6.58581 18.7501 6.25002 18.4143 6.25002 18.0001V14.0001C6.25002 13.9884 6.25002 13.9766 6.25001 13.9648C6.24992 13.7605 6.24982 13.5363 6.27661 13.3466C6.30854 13.1204 6.39077 12.8375 6.63655 12.6034C6.87717 12.3742 7.15902 12.3026 7.3787 12.2744C7.57026 12.2499 7.7985 12.25 8.01565 12.25ZM7.75002 14.7501H8.75002C9.09558 14.7501 9.31252 14.4921 9.31252 14.2501C9.31252 14.008 9.09558 13.7501 8.75002 13.7501H8.05002C7.92879 13.7501 7.83325 13.7501 7.75123 13.7519C7.75006 13.8209 7.75002 13.9009 7.75002 14.0001V14.7501Z'
                          fill='#FF0000'
                        />
                        <path
                          fill-rule='evenodd'
                          clip-rule='evenodd'
                          d='M13.1038 12.25C13.1114 12.25 13.1188 12.25 13.1263 12.25C14.9554 12.25 16.5013 13.671 16.5013 15.5C16.5013 17.329 14.9554 18.75 13.1263 18.75C13.1188 18.75 13.1114 18.75 13.1038 18.75C12.96 18.75 12.8085 18.7501 12.6786 18.7389C12.5328 18.7263 12.3436 18.6953 12.1524 18.5902C11.7694 18.3796 11.6021 18.0433 11.5398 17.752C11.4958 17.5463 11.4992 17.3183 11.5008 17.2081C11.5011 17.1914 11.5013 17.1775 11.5013 17.1667V13.8333C11.5013 13.8226 11.5011 13.8086 11.5008 13.792C11.4992 13.6818 11.4958 13.4537 11.5398 13.248C11.6021 12.9567 11.7694 12.6204 12.1524 12.4098C12.3436 12.3047 12.5328 12.2737 12.6786 12.2612C12.8085 12.2499 12.96 12.25 13.1038 12.25ZM13.0008 13.7502L13.0008 13.7518C13.0011 13.7773 13.0013 13.807 13.0013 13.8333V17.1667C13.0013 17.1931 13.0011 17.2228 13.0008 17.2482L13.0008 17.2498C13.0378 17.25 13.0791 17.25 13.1263 17.25C14.1967 17.25 15.0013 16.4325 15.0013 15.5C15.0013 14.5676 14.1967 13.75 13.1263 13.75C13.0791 13.75 13.0378 13.75 13.0008 13.7502Z'
                          fill='#FF0000'
                        />
                        <path
                          d='M19.6459 12.25L21 12.25C21.4142 12.25 21.75 12.5858 21.75 13C21.75 13.4142 21.4142 13.75 21 13.75H19.6875C19.2548 13.75 19.0022 13.7515 18.8227 13.7744C18.7766 13.7803 18.7448 13.7867 18.7238 13.7919C18.7202 13.8075 18.7162 13.8288 18.7122 13.8571C18.6893 14.0195 18.6875 14.2516 18.6875 14.6667V14.75H20.125C20.5392 14.75 20.875 15.0858 20.875 15.5C20.875 15.9142 20.5392 16.25 20.125 16.25H18.6875V18C18.6875 18.4142 18.3517 18.75 17.9375 18.75C17.5233 18.75 17.1875 18.4142 17.1875 18L17.1875 14.623C17.1874 14.2681 17.1874 13.9275 17.2269 13.6474C17.2717 13.3305 17.3795 12.9839 17.6766 12.701C17.9684 12.423 18.3172 12.3269 18.6322 12.2866C18.9186 12.2499 19.2694 12.25 19.6459 12.25Z'
                          fill='#FF0000'
                        />
                      </svg>
                    ) : (
                      <Icon
                        icon='ph:image-duotone'
                        className='text-primary'
                        fontSize={25}
                      />
                    )}
                    <h2 className='line-clamp-1'>{doc?.document_type}</h2>
                  </div>
                  <div>
                    <Button
                      type='button'
                      onClick={() => deleteDocHandler(doc?.id)}
                      variant='outline'
                      size='icon'
                    >
                      <DeleteIcon />
                    </Button>
                  </div>
                </div>
                {doc?.files[0]?.endsWith("pdf") ? (
                  <div className='bg-[#0000001A] py-2 w-full h-56 rounded-2xl flex items-center justify-center overflow-hidden'>
                    <Dialog>
                      <DialogTrigger>
                        <Document
                          file={doc?.files[0]}
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
                          <DialogTitle>{doc?.document_type}</DialogTitle>
                          <div className='flex pt-5 justify-center'>
                            <Document
                              file={doc?.files[0]}
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
                  <div className='h-56 overflow-hidden'>
                    <img
                      src={doc?.files[0]}
                      alt={doc?.document_type}
                      className=' object-contain h-48 w-96'
                    />
                  </div>
                )}
                <h6 className='text-sm'>
                  Last Updated: {/* // @ts-ignore */}
                  {/* <span>{format(doc?.uploaded_datetime, "MMM dd, yyy")}</span> */}
                  {/* @ts-ignore */}
                  <span>{format(doc?.uploaded_date, "MMM dd, yyy")}</span>
                </h6>
              </div>
            );
          })}
        </div>
      ) : (
        <p className='text-center p-10'>Data is empty</p>
      )}
    </div>
  );
};

export default Uploads;
