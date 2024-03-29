import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import cautionSvg from "assets/svgs/Group 70.svg";

const Overview = () => {
  return (
    <div className="bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]">
      <div className="p-5 flex justify-between items-center">
        <h4 className="font-bold text-lg">Profile Details</h4>
        <Button>Edit Profile</Button>
      </div>
      <hr />

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-2 items-center">
          <h4 className=" text-grey-light font-medium">Full Name</h4>
          <h4 className="font-bold">Max Smith</h4>
        </div>
        <div className="grid grid-cols-2 items-center">
          <h4 className=" text-grey-light font-medium">Company</h4>
          <h4 className="font-bold">Keenthemes</h4>
        </div>
        <div className="grid grid-cols-2 items-center">
          <h4 className=" text-grey-light font-medium">Contact Phone</h4>
          <h4 className="font-bold">
            044 3276 454 935 <Badge className="bg-green-dark">Verified</Badge>
          </h4>
        </div>
        <div className="grid grid-cols-2 items-center">
          <h4 className=" text-grey-light font-medium">Company Site</h4>
          <h4 className="font-bold">
            <a href="keenthemes.com">keenthemes.com</a>
          </h4>
        </div>
        <div className="grid grid-cols-2 items-center">
          <h4 className=" text-grey-light font-medium">Country</h4>
          <h4 className="font-bold">Germany</h4>
        </div>
        <div className="grid grid-cols-2 items-center">
          <h4 className=" text-grey-light font-medium">Communication</h4>
          <h4 className="font-bold">Email, Phone</h4>
        </div>
        <div className="grid grid-cols-2 items-center">
          <h4 className=" text-grey-light font-medium">Allow Changes</h4>
          <h4 className="font-bold">Yes</h4>
        </div>

        <div className="flex items-center bg-[#E6E4E4] border border-dashed border-yellow-dark rounded-lg gap-5 p-5">
          <img src={cautionSvg} alt="verify" width={20} />
          <div>
            <h2 className="text-lg font-semibold">We need your attention!</h2>
            <h4>
              Your payment was declined, to start using tools, please{" "}
              <span className="text-primary">Add Payment Method</span>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
