import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "components/ui/table";
import VendorsEvaluaionAndPerformanceAPI from "services/procurementApi/vendors-evaluation-performance";
import logoPng from "assets/svgs/logo-bg.svg";

const SummaryOfTechnicalPrequalification = () => {
  const { data: vendorEvaluationData } =
    VendorsEvaluaionAndPerformanceAPI.useGetVendorEvaluationQuery({
      path: { id: "f12313964973418790d684c851be2103" as string },
    });

  return (
    <div>
      <div className='flex justify-center items-center flex-col'>
        <img src={logoPng} alt='logo' width={200} />
      </div>
      <div className='p-4 w-full h-[70px] flex justify-between items-center text-xl'>
        <h3 className='w-[250px] whitespace-nowrap text-primary'>
          STAGE 1&2- TECHNICAL PREQUALIFICATION SUMMARY
        </h3>
        <div className=' items-center justify-start ml-6'>
          <p className='font-semibold'> OVERALL ASSESSMENT STATUS</p>
        </div>
      </div>
      <div className='mt-8'>
        <Table>
          <TableHeader>
            <TableRow className='text-center'>
              <TableCell className='max-w-[100px]'>S/N</TableCell>
              <TableCell className='max-w-[100px]'>BIDDER NAME</TableCell>
              <TableCell> CRITERIA 1</TableCell>
              <TableCell> CRITERIA 2</TableCell>
              <TableCell> CRITERIA 3</TableCell>
              <TableCell> CRITERIA 4</TableCell>
              <TableCell> CRITERIA 5</TableCell>
              <TableCell> CRITERIA 6</TableCell>
              <TableCell> CRITERIA 7</TableCell>
              <TableCell> </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* @ts-ignore */}
            {vendorEvaluationData?.data?.criteria_scores?.map(
              // @ts-ignore
              (row, index) => {
                return (
                  <TableRow className='text-start' key={index}>
                    <TableCell className='max-w-[400px]'>{index + 1}</TableCell>
                    <TableCell className='max-w-[400px]'>
                      {row.criteria}
                    </TableCell>
                    <TableCell>{row?.value == 1 ? row?.value : "-"}</TableCell>
                    <TableCell>{row?.value == 2 ? row?.value : "-"}</TableCell>
                    <TableCell>{row?.value == 3 ? row?.value : "-"}</TableCell>
                    <TableCell>{row?.value == 4 ? row?.value : "-"}</TableCell>
                    <TableCell>{row?.value == 5 ? row?.value : "-"}</TableCell>
                    <TableCell>{row?.value == 5 ? row?.value : "-"}</TableCell>
                    <TableCell>{row?.value == 5 ? row?.value : "-"}</TableCell>
                    <TableCell className='w-[50px]'>
                      {row?.value == 5 ? row?.value : "-"}
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SummaryOfTechnicalPrequalification;
