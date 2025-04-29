import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "components/ui/table";
// import logoPng from "assets/svgs/logo-bg.svg";
import VendorBidPrequalificationAPI from "services/procurementApi/manual-bid-cba-prequalification-fn";
// import GoBack from "components/shared/GoBack";
import { Loading } from "components/shared/Loading";
import CbaAPI from "services/procurementApi/cba";
// import { Link, useLocation } from "react-router-dom";
// import { RouteEnum } from "constants/RouterConstants";
// import { Button } from "components/ui/button";
// import SendIcon from "components/icons/SendIcon";

// @ts-ignore
// eslint-disable-next-line react/prop-types
const SummaryOfTechnicalPrequalification = ({ id }) => {
  // const location = useLocation();
  // const { cba, solicitation } = location.state || {}; // Handle undefined state

  const { data: cbaData } = CbaAPI.useGetCbaListQuery({});
  const matchedItem = cbaData?.data?.results?.find(
    // @ts-ignore
    (item) => item.solicitation?.id === id
  );

  const { data: summaryData, isLoading } =
    VendorBidPrequalificationAPI.useGetVendorBidPrequalificationQuery({
      path: {
        // @ts-ignore

        id: matchedItem?.id,
      },
    });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {/* <GoBack /> */}
      <div>
        <div className='p-4 w-full h-[70px] flex justify-between items-center text-xl'>
          <h3 className='w-[250px] whitespace-nowrap text-primary'>
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
                <TableCell className='max-w-[100px]'>S/N</TableCell>
                <TableCell className='w-[150px]'>BIDDER NAME</TableCell>
                <TableCell> CRITERIA 1</TableCell>
                <TableCell> CRITERIA 2</TableCell>
                <TableCell> CRITERIA 3</TableCell>
                <TableCell> CRITERIA 4</TableCell>
                <TableCell> CRITERIA 5</TableCell>
                <TableCell> CRITERIA 6</TableCell>
                <TableCell> CRITERIA 7</TableCell>
                <TableCell> OVERALL ASSESSMENT STATUS</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* @ts-ignore */}

              {summaryData?.data?.results?.map(
                // @ts-ignore
                (submission, index) => {
                  const didCriteriaPass = (criteriaName: string) => {
                    return submission?.prequalification?.TECHNICAL?.some(
                      // @ts-ignore
                      (item) => item?.criteria === criteriaName && item?.passed
                    );
                  };

                  return (
                    <TableRow className='text-start' key={index}>
                      <TableCell className='max-w-[400px]'>
                        {index + 1}
                      </TableCell>
                      <TableCell className='max-w-[400px]'>
                        {submission?.vendor}
                      </TableCell>
                      {[
                        "COMPLETENESS AND CONFORMITY TO TENDER REQUIREMENT",
                        "ESSENTIAL AND LEGAL REGISTRATION DOCUMENT",
                        "TAX CLEARANCE",
                        "GOOD FINANCIAL BUSINESS PRACTICE",
                        "BANK REFERENCE",
                        "ORIGINAL EQUIPMENT MANUFACTURER(OEM) AUTHORIZATION TO DEAL",
                        "PREVIOUS JOB EXPERIENCE",
                      ].map((criteria, idx) => (
                        <TableCell key={idx} className='text-center'>
                          <input
                            type='checkbox'
                            checked={didCriteriaPass(criteria)}
                            readOnly
                            className='w-5 h-5 cursor-not-allowed'
                          />
                        </TableCell>
                      ))}
                      <TableCell className='text-center'>
                        {submission?.overall_status}
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </div>
        <div className='p-4 w-full h-[70px] flex justify-between items-center text-xl'>
          <h3 className='w-[250px] whitespace-nowrap text-primary'>
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
                <TableCell className='w-[50px]'>S/N</TableCell>
                <TableCell className='w-[150px]'>BIDDER NAME</TableCell>
                <TableCell className='text-end'> CRITERIA 1</TableCell>

                <TableCell className='w-[200px]'>
                  {" "}
                  OVERALL ASSESSMENT STATUS
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* @ts-ignore */}

              {summaryData?.data?.results?.map(
                // @ts-ignore
                (submission, index) => {
                  console.log({ submission });

                  const didCriteriaPass = (criteriaName: string) => {
                    return submission?.prequalification?.FINANCIAL?.some(
                      // @ts-ignore
                      (item) => item?.criteria === criteriaName && item?.passed
                    );
                  };

                  return (
                    <TableRow className='text-start' key={index}>
                      <TableCell className=''>{index + 1}</TableCell>
                      <TableCell className='max-w-[400px]'>
                        {submission?.vendor}
                      </TableCell>
                      {[
                        "FINANCIAL BID OPENING TO ASSESS CONFORMITY TO FINANCIAL QUOTATION LISTED 8",
                      ].map((criteria, idx) => (
                        <TableCell key={idx} className='text-center'>
                          <div className='max-w-[70px] ml-auto'>
                            <input
                              type='checkbox'
                              checked={didCriteriaPass(criteria)}
                              readOnly
                              className='w-5 h-5 cursor-not-allowed'
                            />
                          </div>
                        </TableCell>
                      ))}
                      <TableCell className='text-center'>
                        {submission?.overall_status}
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </div>
        <div className='w-full flex mt-8'>
          {/* <div className='w-fit ml-auto'>
            <Link
              className='w-full'
              // to={generatePath(
              //   RouteEnum.COMPETITIVE_BID_ANALYSIS_DETAILS_APPROVAL_CHECK,
              //   {
              //     id: solicitation,
              //   }
              // )}
              to={{
                pathname:
                  RouteEnum.COMPETITIVE_BID_ANALYSIS_DETAILS_APPROVAL_CHECK,
                search: `?id=${solicitation}&cba=${cba}`,
              }}
            >
              <Button
                className='w-full flex items-center justify-start gap-2'
                // variant='ghost'
              >
                <SendIcon />
                Check Approval
              </Button>
            </Link>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default SummaryOfTechnicalPrequalification;
