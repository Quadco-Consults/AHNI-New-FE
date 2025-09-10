"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "components/ui/table";
import { LoadingSpinner } from "components/Loading";
import { useGetManualBidPrequalificationsBySolicitation } from "@/features/procurement/controllers/manualBidCbaPrequalificationController";
import { useGetSolicitationSubmission } from "@/features/procurement/controllers/vendorBidSubmissionsController";

interface SummaryOfTechnicalPrequalificationProps {
  solicitationId?: string;
}

const SummaryOfTechnicalPrequalification = ({ 
  solicitationId 
}: SummaryOfTechnicalPrequalificationProps) => {
  const { data: submissionData, isLoading: submissionLoading } = useGetSolicitationSubmission(solicitationId as string, !!solicitationId);
  const { data: prequalificationData, isLoading: prequalificationLoading } = useGetManualBidPrequalificationsBySolicitation(solicitationId as string, !!solicitationId);

  if (!solicitationId) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-2">No solicitation data available</p>
        <p className="text-sm text-gray-400">
          Prequalification summary will appear here once vendors submit their bids.
        </p>
      </div>
    );
  }

  if (submissionLoading || prequalificationLoading) {
    return <LoadingSpinner />;
  }

  const vendors = submissionData?.data?.data?.results || [];
  const prequalifications = prequalificationData?.data?.results || [];

  // Helper function to check if criteria passed
  const didCriteriaPass = (vendor: any, criteriaName: string, stage: 'TECHNICAL' | 'FINANCIAL') => {
    if (!Array.isArray(prequalifications)) return false;
    const prequalification = prequalifications.find((pq: any) => pq.vendor === vendor?.vendor?.company_name);
    return prequalification?.prequalification?.[stage]?.some(
      (item: any) => item?.criteria === criteriaName && item?.passed
    );
  };

  const technicalCriteria = [
    "COMPLETENESS AND CONFORMITY TO TENDER REQUIREMENT",
    "ESSENTIAL AND LEGAL REGISTRATION DOCUMENT",
    "TAX CLEARANCE",
    "GOOD FINANCIAL BUSINESS PRACTICE",
    "BANK REFERENCE",
    "ORIGINAL EQUIPMENT MANUFACTURER(OEM) AUTHORIZATION TO DEAL",
    "PREVIOUS JOB EXPERIENCE",
  ];

  const financialCriteria = [
    "FINANCIAL BID OPENING TO ASSESS CONFORMITY TO FINANCIAL QUOTATION LISTED 8",
  ];

  return (
    <>
      <div>
        <div className='p-4 w-full h-[70px] flex justify-between items-center text-xl'>
          <h3 className='w-[250px] whitespace-nowrap text-red-500 font-medium'>
            STAGE 1 - TECHNICAL PREQUALIFICATION SUMMARY
          </h3>
          <div className=' items-center justify-start ml-6'>
            <p className='font-semibold'> OVERALL ASSESSMENT STATUS</p>
          </div>
        </div>
        <div className='my-8'>
          <Table>
            <TableHeader>
              <TableRow className='text-center'>
                <TableHead className='max-w-[100px] text-center'>S/N</TableHead>
                <TableHead className='w-[150px] text-center'>BIDDER NAME</TableHead>
                <TableHead className='text-center'>CRITERIA 1</TableHead>
                <TableHead className='text-center'>CRITERIA 2</TableHead>
                <TableHead className='text-center'>CRITERIA 3</TableHead>
                <TableHead className='text-center'>CRITERIA 4</TableHead>
                <TableHead className='text-center'>CRITERIA 5</TableHead>
                <TableHead className='text-center'>CRITERIA 6</TableHead>
                <TableHead className='text-center'>CRITERIA 7</TableHead>
                <TableHead className='text-center'>OVERALL ASSESSMENT STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor: any, index: number) => {
                const prequalification = Array.isArray(prequalifications) ? 
                  prequalifications.find((pq: any) => pq.vendor === vendor?.vendor?.company_name) : null;
                
                return (
                  <TableRow className='text-start' key={index}>
                    <TableCell className='max-w-[400px] text-center'>
                      {index + 1}
                    </TableCell>
                    <TableCell className='max-w-[400px]'>
                      {vendor?.vendor?.company_name}
                    </TableCell>
                    {technicalCriteria.map((criteria, idx) => (
                      <TableCell key={idx} className='text-center'>
                        <input
                          type='checkbox'
                          checked={didCriteriaPass(vendor, criteria, 'TECHNICAL')}
                          readOnly
                          className='w-5 h-5 cursor-not-allowed'
                        />
                      </TableCell>
                    ))}
                    <TableCell className='text-center'>
                      {prequalification?.overall_status || 
                        (vendor?.vendor?.status === "Approved" ? "QUALIFIED" : 
                         vendor?.vendor?.status === "Fail" ? "DISQUALIFIED" : "PENDING")}
                    </TableCell>
                  </TableRow>
                );
              })}
              {vendors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className='text-center text-gray-500'>
                    No vendor submissions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className='p-4 w-full h-[70px] flex justify-between items-center text-xl'>
          <h3 className='w-[250px] whitespace-nowrap text-red-500 font-medium'>
            STAGE 2- FINANCIAL PREQUALIFICATION SUMMARY
          </h3>
          <div className=' items-center justify-start ml-6'>
            <p className='font-semibold'> OVERALL ASSESSMENT STATUS</p>
          </div>
        </div>
        <div className='mt-8'>
          <Table>
            <TableHeader>
              <TableRow className='text-center'>
                <TableHead className='w-[50px] text-center'>S/N</TableHead>
                <TableHead className='w-[150px] text-center'>BIDDER NAME</TableHead>
                <TableHead className='text-center'>CRITERIA 1</TableHead>
                <TableHead className='w-[200px] text-center'>
                  OVERALL ASSESSMENT STATUS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor: any, index: number) => {
                const prequalification = Array.isArray(prequalifications) ? 
                  prequalifications.find((pq: any) => pq.vendor === vendor?.vendor?.company_name) : null;

                return (
                  <TableRow className='text-start' key={index}>
                    <TableCell className='text-center'>{index + 1}</TableCell>
                    <TableCell className='max-w-[400px]'>
                      {vendor?.vendor?.company_name}
                    </TableCell>
                    {financialCriteria.map((criteria, idx) => (
                      <TableCell key={idx} className='text-center'>
                        <div className='max-w-[70px] ml-auto'>
                          <input
                            type='checkbox'
                            checked={didCriteriaPass(vendor, criteria, 'FINANCIAL')}
                            readOnly
                            className='w-5 h-5 cursor-not-allowed'
                          />
                        </div>
                      </TableCell>
                    ))}
                    <TableCell className='text-center'>
                      {prequalification?.overall_status || 
                        (vendor?.bid_details?.status === "PASSED" ? "QUALIFIED" : 
                         vendor?.bid_details?.status === "FAIL" ? "DISQUALIFIED" : "PENDING")}
                    </TableCell>
                  </TableRow>
                );
              })}
              {vendors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className='text-center text-gray-500'>
                    No vendor submissions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default SummaryOfTechnicalPrequalification;