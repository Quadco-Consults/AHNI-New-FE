import { Badge } from "components/ui/badge";

const Overview = () => {
  return (
    <div className="bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]">
      <div className="p-5 flex justify-between items-center">
        <h4 className="font-bold text-lg">Profile Details</h4>
      </div>
      <hr />

      <div className="p-5 space-y-8">
        <div className="grid grid-cols-2 items-center">
          <h4 className="font-bold">Vendor Name</h4>
          <h4>ABC Supplies Ltd</h4>
        </div>
        <div className="grid grid-cols-2 items-center">
          <h4 className="font-bold">Type of Business</h4>
          <h4>Limited Liability</h4>
        </div>
        <div className="grid grid-cols-2 items-center">
          <h4 className="font-bold">Company Reg No</h4>
          <h4>044 3276 454 935</h4>
        </div>
        <div className="grid grid-cols-2 items-center">
          <h4 className="font-bold">Evaluation Status</h4>
          <div>
            <Badge className="bg-green-dark px-3 py-2">Pass</Badge>
          </div>
        </div>
        <div className="grid grid-cols-2 items-center">
          <h4 className="font-bold">Company Address</h4>
          <h4>61, Airport Road, Warri South, Warri, Delta State.</h4>
        </div>
        <div className="grid grid-cols-2 items-center">
          <h4 className="font-bold">Company Email</h4>
          <h4>contact@abcsupplies.com.ng</h4>
        </div>
        <div className="grid grid-cols-2 items-center">
          <h4 className="font-bold">Company Website</h4>
          <h4>www.abcsupplies.com.ng</h4>
        </div>
        <div className="grid grid-cols-2 items-center">
          <h4 className="font-bold">Active Company Telephone Number</h4>
          <h4>Company email</h4>
        </div>
      </div>
    </div>
  );
};

export default Overview;
