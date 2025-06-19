import { Badge } from "components/ui/badge";
import { VendorsResultsData } from "definations/procurement-types/vendors";
import { cn } from "lib/utils";

const Overview = (data: VendorsResultsData) => {
  console.log({ data });

  return (
    <div className='bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
      <div className='p-5 flex justify-between items-center'>
        <h4 className='font-bold text-lg'>Profile Details</h4>
      </div>
      <hr />

      <div className='p-5 space-y-8'>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Vendor Name</h4>
          <h4>{data?.company_name}</h4>
        </div>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Type of Business</h4>
          <h4>{data?.type_of_business}</h4>
        </div>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Company Reg No</h4>
          <h4>{data?.company_registration_number}</h4>
        </div>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Evaluation Status</h4>
          <div>
            <Badge
              className={cn(
                "px-3 py-2",
                data?.status === "Approved" && "bg-green-200 text-green-500",
                data?.status === "Rejected" && "bg-red-200 text-red-500",
                data?.status === "Pending" && "bg-yellow-200 text-yellow-500"
              )}
            >
              {data?.status}
            </Badge>
          </div>
        </div>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Company Address</h4>
          <h4>{data?.company_address}</h4>
        </div>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>State</h4>
          <h4>{data?.state}</h4>
        </div>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Account Name</h4>
          {/* @ts-ignore */}
          <h4>{data?.account_name}</h4>
        </div>{" "}
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Account Number</h4>
          {/* @ts-ignore */}
          <h4>{data?.account_number}</h4>
        </div>{" "}
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Bank Name</h4>
          <h4>{data?.bank_name}</h4>
        </div>{" "}
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Bank Address</h4>
          <h4>{data?.bank_address}</h4>
        </div>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Company Email</h4>
          <h4>{data?.email}</h4>
        </div>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Company Website</h4>
          <a href={data?.website} className='hover:underline'>
            {data?.website}
          </a>
        </div>
        {/* <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Active Company Telephone Number</h4>
          <h4>{data?.phone_number}</h4>
        </div>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Submitted Category</h4>
          <h4>{}</h4>
        </div>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Date Submitted</h4>
          <h4>{}</h4>
        </div>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Bank Account</h4>
          <h4>{}</h4>
        </div> */}
      </div>
    </div>
  );
};

export default Overview;
