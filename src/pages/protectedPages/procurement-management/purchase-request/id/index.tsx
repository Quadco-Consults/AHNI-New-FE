import { useParams } from "react-router-dom";
import PurchaseRequestAPI from "services/procurementApi/purchase-request";
import { LoadingSpinner } from "components/shared/Loading";
import Card from "components/shared/Card";
import { Badge } from "components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "components/ui/table";

import logoPng from "assets/svgs/logo-bg.svg";
const PurchaseRequesttDetails = () => {
  // const navigate = useNavigate();
  const { id } = useParams();
  // const [rows, setRows] = useState([]);

  const { data, isLoading } = PurchaseRequestAPI.useGetPurchaseRequestQuery({
    path: { id: id as string },
  });

  // const goBack = () => {
  //   navigate(-1);
  // };
  // Simulating fetching data

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // const calculateTotalCost = (row) =>
  //   row.quantity * row.number * row.facility * row.frequency * row.unitCost;

  // const totals = rows.reduce(
  //   (acc, row) => {
  //     const totalCost = calculateTotalCost(row);
  //     return {
  //       quantity: acc.quantity + row.quantity,
  //       number: acc.number + row.number,
  //       facility: acc.facility + row.facility,
  //       frequency: acc.frequency + row.frequency,
  //       unitCost: acc.unitCost + row.unitCost,
  //       totalCost: acc.totalCost + totalCost,
  //     };
  //   },
  //   {
  //     quantity: 0,
  //     number: 0,
  //     facility: 0,
  //     frequency: 0,
  //     unitCost: 0,
  //     totalCost: 0,
  //   }
  // );
  return (
    <section className='min-h-screen space-y-8'>
      <div className='flex justify-center items-center flex-col'>
        <img src={logoPng} alt='logo' width={200} />
        <h1>Achieving Health Nigeria Initiative (AHNI)</h1>
      </div>
      <h2 className='text-center'>PURCHASE REQUEST FORM</h2>
      <div>
        {" "}
        <div className='flex items-center justify-end'>
          {/* <FormButton
              loading={isLoading}
              disabled={isLoading}
              type='submit'
              className='flex items-center justify-center gap-2'
            >
              Submit
              <LongArrowRight />
            </FormButton> */}

          <h3 className='flex gap-2 p-2 bg-alternate border border-primary rounded'>
            <strong>Ref:</strong>
            {/* @ts-ignore */}
            {data?.data?.ref_number}
          </h3>
        </div>
        <Card className='border-primary space-y-3 mt-8 w-full mx-auto'>
          <div className='flex justify-between'>
            <div className='flex flex-col gap-3'>
              <div className='flex flex-col items-center gap-5'>
                <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                  Date of Request
                </h4>
                {/* @ts-ignore */}

                <h4> {data?.data?.date_of_request}</h4>
              </div>
            </div>{" "}
            <div className='flex flex-col gap-3'>
              <div className='flex flex-col items-center gap-5'>
                <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                  Date Required
                </h4>
                {/* @ts-ignore */}

                <h4>{data?.data?.date_required}</h4>
              </div>
            </div>{" "}
            <div className='flex flex-col gap-3'>
              <div className='flex flex-col items-center gap-5'>
                <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                  Requesting Dept.{" "}
                </h4>
                {/* @ts-ignore */}
                <h4>{data?.data?.requesting_department}</h4>
              </div>
            </div>{" "}
            <div className='flex flex-col gap-3'>
              <div className='flex flex-col items-center gap-5'>
                <h4 className='w-full max-w-[151px] font-medium text-[14px]'>
                  Deliver
                </h4>
                {/* @ts-ignore */}
                <h4>{data?.data?.deliver_to}</h4>
              </div>
            </div>{" "}
          </div>
        </Card>
      </div>
      <div className='mt-8'>
        <Table>
          <TableHeader>
            <TableRow className='text-center'>
              <TableCell>S/N</TableCell>
              <TableCell>Description of items/services</TableCell>
              <TableCell>FCO/Activity No</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit Cost</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* @ts-ignore */}
            {data?.data?.items.map((row, index) => (
              <TableRow className='text-center' key={index}>
                <TableCell>{row.index}</TableCell>
                <TableCell>{row.item}</TableCell>
                <TableCell>{row.fco_number}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>{row.unit_cost}</TableCell>
                <TableCell>{row.amount}</TableCell>
                {/* <TableCell>{row.unitCost.toFixed(2)}</TableCell> */}
                {/* <TableCell>{calculateTotalCost(row).toFixed(2)}</TableCell> */}
              </TableRow>
            ))}
            {/* <TableRow className='text-center'>
              <TableCell>
                <strong>Totals</strong>
              </TableCell>
              <TableCell>
                <strong>{totals.quantity}</strong>
              </TableCell>
              <TableCell>
                <strong>{totals.number}</strong>
              </TableCell>
              <TableCell>
                <strong>{totals.facility}</strong>
              </TableCell>

              <TableCell>
                <strong>{totals.unitCost.toFixed(2)}</strong>
              </TableCell>
              <TableCell>
                <strong>{totals.totalCost.toFixed(2)}</strong>
              </TableCell>
            </TableRow> */}
          </TableBody>
        </Table>
      </div>

      <div className=' grid grid-cols-2 gap-y-12'>
        <div className=' space-y-3'>
          <p>Signed</p>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Requested By</h4>
            {/* @ts-ignore */}
            <h4>{data?.data?.requested_by?.name}</h4>
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Date:</h4>
            {/* @ts-ignore */}
            <h4>{data?.data?.requested_date}</h4>
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Signature:</h4>
            {/* @ts-ignore */}
            <h4>{data?.data?.requested_by?.name}</h4>
          </div>
          <div className='flex items-center gap-5'>
            <Badge className='bg-green-500/30 text-green-500 p-2 rounded-md'>
              Approved
            </Badge>{" "}
            <Badge className='bg-alternate text-primary  p-2 rounded-md'>
              Not Approved
            </Badge>{" "}
          </div>
        </div>
        <div className=' space-y-3'>
          <p>Signed</p>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'> Reviewed By</h4>
            {/* <h4>Finance</h4> */}
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Name</h4>

            {/* @ts-ignore */}
            <h4>{data?.data?.reviewed_by?.name}</h4>
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Date:</h4>
            {/* @ts-ignore */}
            <h4>{data?.data?.reviewed_date}</h4>
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Signature:</h4>
            {/* @ts-ignore */}
            <h4>{data?.data?.reviewed_by?.name}</h4>{" "}
          </div>
        </div>{" "}
        <div className=' space-y-3'>
          <p>Signed</p>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Authorized By</h4>
            {/* <h4>Budget Monitor (SPA, PM)</h4> */}
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Name</h4>
            {/* @ts-ignore */}
            <h4>{data?.data?.authorized_by?.name}</h4>
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Date:</h4>
            {/* @ts-ignore */}
            <h4>{data?.data?.authorized_date}</h4>
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Signature:</h4>
            {/* @ts-ignore */}
            <h4>{data?.data?.authorized_by?.name}</h4>
          </div>
        </div>{" "}
        <div className=' space-y-3'>
          <p>Signed</p>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Approved By</h4>
            {/* <h4>Director of Operations</h4> */}
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Name</h4>
            {/* @ts-ignore */}
            <h4>{data?.data?.approved_by?.name}</h4>
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Date:</h4>
            {/* @ts-ignore */}
            <h4>{data?.data?.approved_date}</h4>
          </div>
          <div className='flex items-center gap-5'>
            <h4 className='w-full max-w-[140px] font-medium'>Signature:</h4>
            {/* @ts-ignore */}
            <h4>{data?.data?.approved_by?.name}</h4>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PurchaseRequesttDetails;
