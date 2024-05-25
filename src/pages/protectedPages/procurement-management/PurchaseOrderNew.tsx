import RoundBack from "assets/svgs/RoundBack";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";

type Props = {};

const PurchaseOrderNew = (props: Props) => {
  return (
    <div className="">
      <div>
        <RoundBack />
      </div>
      <div>
        <p className=" text-[24px] font-semibold  ">Purchase Order Form</p>
        <p className="text-xs font-light">10-04-2023 | AHNI-010-002-ABJ-2023</p>
      </div>
      <div className="grid grid-cols-2 mt-10 gap-x-5">
        <div>
          <Label className="font-semibold">Vendor</Label>
          <Input />
        </div>
        <div>
          <Label className="font-semibold">Requesting Unit/Dept</Label>
          <Input />
        </div>
      </div>
      <div className="mt-10">
        <div>
          <p className="font-semibold">Items Quotation</p>
          <p className="text-xs font-light ">
            Please provide your quotation for the following Items
          </p>
        </div>
      </div>
      <div className="mt-10">
        <div className="grid w-full grid-cols-10 py-1 border-b-2">
          <div className="font-semibold text-[#DEA004] text-sm ">S/N</div>
          <div className="font-semibold text-[#DEA004] text-sm col-span-4 text-center">
            DESCRIPTION OF GOODS, WORKS OR SERVICES
          </div>
          <div className="font-semibold text-[#DEA004] text-sm text-center">
            Qty
          </div>
          <div className="font-semibold text-[#DEA004] text-sm text-center ">
            UOM
          </div>
          <div className="font-semibold text-[#DEA004] text-sm text-center">
            FCO/BL
          </div>
          <div className="font-semibold text-[#DEA004] text-sm text-center">
            Unit price
          </div>
          <div className="font-semibold text-[#DEA004] text-sm text-center">
            Total
          </div>
        </div>
        <div className="space-y-3">
          <div className="grid w-full grid-cols-10 py-1 border-b gap-x-8">
            <div className="">1</div>
            <div className="col-span-4 ">
              <Input placeholder="Enter Description" />
            </div>
            <div className="">
              <Input placeholder="0" />
            </div>
            <div className="">
              {" "}
              <Input placeholder="Pcs" />
            </div>
            <div className="">
              <Input placeholder="0" />
            </div>
            <div className="">
              <Input placeholder="₦0.00" />
            </div>
            <div className="">
              {" "}
              <Input placeholder="₦0.00" />
            </div>
          </div>
          <div className="grid w-full grid-cols-10 py-2 border-b gap-x-8">
            <div className="">2</div>
            <div className="col-span-4 ">
              <Input placeholder="Enter Description" />
            </div>
            <div className="">
              <Input placeholder="0" />
            </div>
            <div className="">
              {" "}
              <Input placeholder="Pcs" />
            </div>
            <div className="">
              <Input placeholder="0" />
            </div>
            <div className="">
              <Input placeholder="₦0.00" />
            </div>
            <div className="">
              {" "}
              <Input placeholder="₦0.00" />
            </div>
          </div>
          <div className="grid w-full grid-cols-10 py-2 border-b gap-x-8">
            <div className="">3</div>
            <div className="col-span-4 ">
              <Input placeholder="Enter Description" />
            </div>
            <div className="">
              <Input placeholder="0" />
            </div>
            <div className="">
              {" "}
              <Input placeholder="Pcs" />
            </div>
            <div className="">
              <Input placeholder="0" />
            </div>
            <div className="">
              <Input placeholder="₦0.00" />
            </div>
            <div className="">
              {" "}
              <Input placeholder="₦0.00" />
            </div>
          </div>
          <div className="grid w-full grid-cols-10 py-2 border-b gap-x-8">
            <div className="">4</div>
            <div className="col-span-4 ">
              <Input placeholder="Enter Description" />
            </div>
            <div className="">
              <Input placeholder="0" />
            </div>
            <div className="">
              {" "}
              <Input placeholder="Pcs" />
            </div>
            <div className="">
              <Input placeholder="0" />
            </div>
            <div className="">
              <Input placeholder="₦0.00" />
            </div>
            <div className="">
              {" "}
              <Input placeholder="₦0.00" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderNew;
