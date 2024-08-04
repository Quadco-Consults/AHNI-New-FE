import BreadcrumbCard from "components/shared/Breadcrumb";
import Card from "components/shared/Card";
import { Checkbox } from "components/ui/checkbox";
import { Textarea } from "components/ui/textarea";

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
    description: "Quality Wireless Table Phone",
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
    <div className="flex items-end justify-end w-full py-3 border-b ">
      <div className="grid w-full  py-2 grid-cols-7 h-[60px]">
        <div className="col-span-1 ">
          <p className="text-sm ">{serialNo}</p>
        </div>
        <div className="col-span-5 space-y-1 ">
          <p className="text-sm font-semibold line-clamp-1 ">{item}</p>
          <p className="text-xs ">{description}</p>
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
    <div className="flex items-end justify-end w-full py-3 border-b ">
      <div className="grid w-full items-center  py-2 grid-cols-5 px-2 h-[60px] ">
        <div className="col-span-1 ">
          <p className="text-sm ">
            <Checkbox />
          </p>
        </div>
        <div className="col-span-3 space-y-1 ">
          <p>14,678.00</p>
        </div>
        <div className="col-span-1">
          <p className="text-sm ">22,8984.00</p>
        </div>
      </div>
    </div>
  );
};

const breadcrumbs = [
  { name: "Procurement", icon: true },
  { name: "Competitive Bid Analysis", icon: true },
  { name: "Detail", icon: true },
  { name: "Start CBA", icon: false },
];

const CompetittveBidAnalysis = () => {
  return (
    <div className="space-y-10">
      <BreadcrumbCard list={breadcrumbs} />
      <Card className="overflow-x-auto ">
        <div className="w-[1700px]  ">
          {/* Headers */}
          <div className="grid grid-cols-4 divide-x-2 devide-y-2 border-y-destructive-foreground ">
            <div className="flex items-end justify-end w-full border-b-2 ">
              <div className="grid w-full grid-cols-7 py-2">
                <div className="col-span-1 ">
                  <p className="text-sm text-[#DEA004]">S/N</p>
                </div>
                <div className="col-span-5 ">
                  <p className="text-sm text-[#DEA004]">Description</p>
                </div>
                <div className="col-span-1">
                  <p className="text-sm text-[#DEA004]">QTY</p>
                </div>
              </div>
            </div>
            {/* company 1 */}
            <div className="flex flex-col items-end justify-end w-full px-2 border-b-2 ">
              <div className="w-full my-2 font-semibold text-center">
                SOUTHGATE TECHNOLOGIES LIMITED
              </div>
              <div className="grid w-full grid-cols-5 py-2">
                <div className="col-span-1 ">
                  <p className="text-sm text-[#DEA004]">
                    <Checkbox />
                  </p>
                </div>
                <div className="col-span-3 ">
                  <p className="text-sm text-[#DEA004]">Unit Price</p>
                </div>
                <div className="col-span-1">
                  <p className="text-sm text-[#DEA004]">Total</p>
                </div>
              </div>
            </div>
            {/* company 2 */}
            <div className="flex flex-col items-end justify-end w-full px-2 border-b-2 ">
              <div className="w-full my-2 font-semibold text-center">
                SOUTHGATE TECHNOLOGIES LIMITED
              </div>
              <div className="grid w-full grid-cols-5 py-2">
                <div className="col-span-1 ">
                  <p className="text-sm text-[#DEA004]">
                    <Checkbox />
                  </p>
                </div>
                <div className="col-span-3 ">
                  <p className="text-sm text-[#DEA004]">Unit Price</p>
                </div>
                <div className="col-span-1">
                  <p className="text-sm text-[#DEA004]">Total</p>
                </div>
              </div>
            </div>
            {/* company 3 */}
            <div className="flex flex-col items-end justify-end w-full px-2 border-b-2 ">
              <div className="w-full my-2 font-semibold text-center">
                SOUTHGATE TECHNOLOGIES LIMITED
              </div>
              <div className="grid w-full grid-cols-5 py-2">
                <div className="col-span-1 ">
                  <p className="text-sm text-[#DEA004]">
                    <Checkbox />
                  </p>
                </div>
                <div className="col-span-3 ">
                  <p className="text-sm text-[#DEA004]">Unut Price</p>
                </div>
                <div className="col-span-1">
                  <p className="text-sm text-[#DEA004]">Total</p>
                </div>
              </div>
            </div>
          </div>
          {/* Body */}
          <div className="grid grid-cols-4 divide-x-2 devide-y-2 border-y-destructive-foreground ">
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
      <div className="flex justify-end w-full py-4 my-6 border-t-2 border-b-2 border-yellow-500">
        <div className="mr-10">
          <p className="flex justify-between w-[300px] rounded border border-red-500 p-4 text-red-500 font-semibold">
            <span>Total:</span>
            <span>22,970.660.55</span>
          </p>
        </div>
      </div>
      <div className="overflow-x-auto ">
        <div className="grid gap-x-4 justify-center grid-cols-4 w-[1700px] ">
          <div>Brand</div>
          <div>
            <Textarea
              className="placeholder:text-xs"
              placeholder="Enter list of brands"
            />
          </div>
          <div>
            <Textarea
              className="placeholder:text-xs"
              placeholder="Enter list of brands"
            />
          </div>
          <div>
            <Textarea
              className="placeholder:text-xs"
              placeholder="Enter list of brands"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetittveBidAnalysis;
