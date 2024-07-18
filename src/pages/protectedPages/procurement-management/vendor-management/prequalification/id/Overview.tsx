import { Badge } from "components/ui/badge";
import { VendorsResultsData } from "definations/procurement-types/vendors";

const Overview = (data: VendorsResultsData) => {
  return (
    <div className="bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]">
      <div className="p-5 flex justify-between items-center">
        <h4 className="font-bold text-lg">Profile Details</h4>
      </div>
      <hr />

      <div className="p-5 space-y-8">
        <div className="grid grid-cols-2 items-center">
          <h4 className="font-bold">Vendor Name</h4>
          <h4>{data.company_name}</h4>
        </div>
        <div className="grid grid-cols-2 items-center">
          <h4 className="font-bold">Type of Business</h4>
          <h4>{data.type_of_business}</h4>
        </div>
        <div className="grid grid-cols-2 items-center">
          <h4 className="font-bold">Company Reg No</h4>
          <h4>{data.company_registration_number}</h4>
        </div>
        <div className="grid grid-cols-2 items-center">
          <h4 className="font-bold">Evaluation Status</h4>
          <div>
            <Badge className="bg-gray-300 text-gray-800 px-3 py-2">
              {data.status}
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-2 items-center">
          <h4 className="font-bold">Company Address</h4>
          <h4>{data.company_address}</h4>
        </div>
        <div className="grid grid-cols-2 items-center">
          <h4 className="font-bold">Company Email</h4>
          <h4>{data.email}</h4>
        </div>
        <div className="grid grid-cols-2 items-center">
          <h4 className="font-bold">Company Website</h4>
          <a href={data.website} className="hover:underline">
            {data.website}
          </a>
        </div>
        <div className="grid grid-cols-2 items-center">
          <h4 className="font-bold">Active Company Telephone Number</h4>
          <h4>{data.phone_number}</h4>
        </div>
      </div>
    </div>
  );
};

export default Overview;
