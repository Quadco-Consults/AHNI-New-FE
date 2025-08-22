import { ScrollArea } from "components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

// Define the data type
type DataType = {
  month: string;
  price: number;
};

// Complete sample data array for all months
const data: DataType[] = [
  { month: "Jan", price: 1500000 },
  { month: "Feb", price: 2600000 },
  { month: "Mar", price: 3720192.5 },
  // Add your actual data points for each month
  { month: "Apr", price: 3800000 },
  { month: "May", price: 2850000 },
  { month: "Jun", price: 3900000 },
  { month: "Jul", price: 2950000 },
  { month: "Aug", price: 4000000 },
  { month: "Sep", price: 4050000 },
  { month: "Oct", price: 3100000 },
  { month: "Nov", price: 4200000 },
  { month: "Dec", price: 8300000 },
];

// Custom Tooltip component
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white border rounded shadow-lg">
        {/* @ts-ignore */}
        <p className="label">{`${label} : ${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }

  return null;
};

// Chart component
const PriceTrendChart: React.FC = () => {
  return (
    <div className="p-4">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#107D38" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#107D38" stopOpacity={0.5} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis className="text-xs" dataKey="month" />
          <YAxis className="text-xs" />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#38A169"
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const PriceModal = () => {
  return (
    <div className="px-5">
      <ScrollArea className="h-[80vh] py-10 space-y-5">
        <div className="flex justify-between">
          <h2 className="font-semibold text-red-500">Price Trend</h2>
          <div>
            <Tabs defaultValue="12">
              <TabsList className="grid w-full grid-cols-4 text-xs ">
                <TabsTrigger className="text-xs" value="12">
                  12 Months
                </TabsTrigger>
                <TabsTrigger className="text-xs" value="6">
                  6 Months
                </TabsTrigger>
                <TabsTrigger className="text-xs" value="30">
                  30 days
                </TabsTrigger>
                <TabsTrigger className="text-xs" value="7">
                  7 days
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <PriceTrendChart />
        <div className="space-y-2">
          <h3 className="font-bold text-yellow-500">Product Description</h3>
          <p className="text-sm font-light">
            Specification: High quality branded 3-way surge protector extension
            socket with 3M core and individual switches
          </p>
        </div>
        <div className="mt-10">
          <h3 className="font-bold text-yellow-500">Price History</h3>
          <div>
            <div className="grid grid-cols-5 mt-6 bg-gray-200">
              <div className="py-2 text-sm font-semibold"></div>
              <div className="py-2 text-sm font-semibold">Name</div>
              <div className="py-2 text-sm font-semibold">QTY</div>
              <div className="py-2 text-sm font-semibold">COST PER UNIT</div>
              <div className="py-2 text-sm font-semibold">TOTAL</div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PriceModal;