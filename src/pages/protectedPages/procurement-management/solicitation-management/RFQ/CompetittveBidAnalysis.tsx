import Card from "components/shared/Card";
import { Checkbox } from "components/ui/checkbox";

const items = [
  {
    serialNo: 1,
    item: "Laptop Computer",
    description:
      "15'' 4K OLED Display, Intel Core i9 Processor, 32-64GB RAM, 2TB SSD (XPS 15 9530)",
    quantity: 6,
  },
  {
    serialNo: 2,
    item: "USB Headset",
    description: "Noise-Cancelling USB Headset (H540)",
    quantity: 6,
  },
  {
    serialNo: 3,
    item: "Wireless Mouse",
    description:
      "15'' 4K OLED Display, Intel Core i9 Processor, 32-64GB RAM, 2TB SSD (XPS 15 9530)",
    quantity: 6,
  },
  {
    serialNo: 4,
    item: "HD Computer Monitor",
    description: "27'' 4k Monitor with tilt and swivel",
    quantity: 6,
  },
  {
    serialNo: 5,
    item: "Wireless Table Phones",
    description: "Quality Wireless Table Phones",
    quantity: 6,
  },
  {
    serialNo: 6,
    item: "12 Month Each Airtime Subscription for Table Phones",
    description:
      "N15,000 Airtime each for Wireless Phone (Preferable Airtel Network)",
    quantity: 72,
  },
  {
    serialNo: 7,
    item: "Extension Box",
    description:
      "High quality branded 3-way surge protector extension socket with 3M core and individual switches",
    quantity: 5,
  },
];

const Description = ({
  description,
  item,
  quantity,
  serialNo,
}: {
  serialNo: number;
  item: string;
  description: string;
  quantity: number;
}) => {
  return (
    <div className=" flex justify-end items-end w-full py-3    border-b  ">
      <div className="grid w-full  py-2 grid-cols-7 h-[60px]">
        <div className=" col-span-1 ">
          <p className="text-sm ">{serialNo}</p>
        </div>
        <div className=" col-span-5 space-y-1 ">
          <p className="text-sm font-semibold line-clamp-1 ">{item}</p>
          <p className=" text-xs ">{description}</p>
        </div>
        <div className="col-span-1">
          <p className="text-sm ">{quantity}</p>
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  return (
    <div className=" flex justify-end items-end w-full py-3    border-b  ">
      <div className="grid w-full items-center  py-2 grid-cols-5 px-2 h-[60px] ">
        <div className=" col-span-1 ">
          <p className="text-sm ">
            <Checkbox />
          </p>
        </div>
        <div className=" col-span-3 space-y-1 ">
          <p>14,678.00</p>
        </div>
        <div className="col-span-1">
          <p className="text-sm ">22,8984.00</p>
        </div>
      </div>
    </div>
  );
};

const CompetittveBidAnalysis = () => {
  return (
    <div>
      <Card className=" overflow-x-auto ">
        <div className="w-[1700px]  ">
          {/* Headers */}
          <div className="grid grid-cols-4 divide-x-2 devide-y-2 border-y-destructive-foreground  ">
            <div className=" flex justify-end items-end w-full     border-b-2  ">
              <div className="grid w-full py-2 grid-cols-7">
                <div className=" col-span-1 ">
                  <p className="text-sm text-[#DEA004]">S/N</p>
                </div>
                <div className=" col-span-5  ">
                  <p className="text-sm text-[#DEA004]">Description</p>
                </div>
                <div className="col-span-1">
                  <p className="text-sm text-[#DEA004]">QTY</p>
                </div>
              </div>
            </div>
            {/* company 1 */}
            <div className=" flex flex-col justify-end items-end w-full px-2    border-b-2  ">
              <div className="w-full text-center font-semibold my-2">
                SOUTHGATE TECHNOLOGIES LIMITED
              </div>
              <div className="grid w-full py-2 grid-cols-5">
                <div className=" col-span-1 ">
                  <p className="text-sm text-[#DEA004]">
                    <Checkbox />
                  </p>
                </div>
                <div className=" col-span-3  ">
                  <p className="text-sm text-[#DEA004]">Unit Price</p>
                </div>
                <div className="col-span-1">
                  <p className="text-sm text-[#DEA004]">Total</p>
                </div>
              </div>
            </div>
            {/* company 2 */}
            <div className=" flex flex-col justify-end items-end w-full px-2    border-b-2  ">
              <div className="w-full text-center font-semibold my-2">
                SOUTHGATE TECHNOLOGIES LIMITED
              </div>
              <div className="grid w-full py-2 grid-cols-5">
                <div className=" col-span-1 ">
                  <p className="text-sm text-[#DEA004]">
                    <Checkbox />
                  </p>
                </div>
                <div className=" col-span-3  ">
                  <p className="text-sm text-[#DEA004]">Unit Price</p>
                </div>
                <div className="col-span-1">
                  <p className="text-sm text-[#DEA004]">Total</p>
                </div>
              </div>
            </div>
            {/* company 3 */}
            <div className=" flex flex-col justify-end items-end w-full px-2    border-b-2  ">
              <div className="w-full text-center font-semibold my-2">
                SOUTHGATE TECHNOLOGIES LIMITED
              </div>
              <div className="grid w-full py-2 grid-cols-5">
                <div className=" col-span-1 ">
                  <p className="text-sm text-[#DEA004]">
                    <Checkbox />
                  </p>
                </div>
                <div className=" col-span-3  ">
                  <p className="text-sm text-[#DEA004]">Unut Price</p>
                </div>
                <div className="col-span-1">
                  <p className="text-sm text-[#DEA004]">Total</p>
                </div>
              </div>
            </div>
          </div>
          {/* Body */}
          <div className="grid grid-cols-4 divide-x-2 devide-y-2 border-y-destructive-foreground  ">
            <div>
              {items.map((item, i) => {
                return <Description {...item} key={i} />;
              })}
            </div>
            <div>
              <Products />
              <Products />
              <Products />
              <Products />
              <Products />
              <Products />
              <Products />
            </div>
            <div>
              <Products />
              <Products />
              <Products />
              <Products />
              <Products />
              <Products />
              <Products />
            </div>
            <div>
              <Products />
              <Products />
              <Products />
              <Products />
              <Products />
              <Products />
              <Products />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CompetittveBidAnalysis;
