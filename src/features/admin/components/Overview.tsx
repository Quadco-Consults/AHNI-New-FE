import React from "react";
import CarIcon from "assets/svgs/CarIcon";
import RequestIcon from "assets/svgs/RequestIcon";
import Card from "components/Card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { Label } from "components/ui/label";

type DataType = {
  month: string;
  price: number;
};

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white border rounded shadow-lg">
        {/* @ts-ignore */}
        <p className="label">{`${label} : ${payload[0]?.value.toLocaleString()}`}</p>
      </div>
    );
  }

  return null;
};

const data: DataType[] = [
  { month: "Jan", price: 1500000 },
  { month: "Feb", price: 1600000 },
  { month: "Mar", price: 720192.5 },
  // Add your actual data points for each month
  { month: "Apr", price: 1800000 },
  { month: "May", price: 1850000 },
];

const PriceTrendChart: React.FC = () => {
  return (
    <div className="py-1">
      <ResponsiveContainer width="100%" height={200}>
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
          <Area type="monotone" dataKey="price" stroke="#38A169" fillOpacity={1} fill="url(#colorPrice)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const Overview = () => {
  return (
    <div>
      <div className="grid grid-cols-9 gap-6">
        <Card className="col-span-5 ">card 1</Card>
        <Card className="col-span-4 ">card 2</Card>

        <Card className="col-span-5 py-2 space-y-3">
          <div>
            <h3 className="text-lg font-semibold ">Fleet Managment</h3>
          </div>
          <div className="grid grid-cols-3">
            <div className="flex flex-col justify-between">
              <div className="flex items-start justify-center">
                <CarIcon />
              </div>
              <p className="text-xs font-bold text-center">82 Available Vehicles</p>
            </div>
            <div className="flex flex-col justify-between">
              <div className="flex items-start justify-center">
                <RequestIcon />
              </div>
              <p className="text-xs font-bold text-center">82 Request Generated</p>
            </div>
          </div>
        </Card>

        <Card className="col-span-4 ">card 2</Card>
        <Card className="col-span-5 ">card 2</Card>
        <Card className="col-span-4 p-2 ">
          <h3 className="px-3 text-lg font-semibold ">Order Summary</h3>
          <div>
            <PriceTrendChart />
          </div>
        </Card>
        <div className="col-span-5 "></div>
        <Card className="col-span-4 p-2 ">
          <h3 className="px-3 text-lg font-semibold ">Low Quantity Stock</h3>
          <div className="flex items-center p-3 gap-x-4">
            <div>
              <p className="text-xs font-bold">Hand Stanitizer</p>
              <p className="text-xs text-gray-400">Remaining qunantity: 10 Packets</p>
            </div>
            <Label className="py-1 px-2 text-[10px] text-red-600 bg-red-100 rounded-full">Low</Label>
          </div>
          <div className="flex items-center p-3 gap-x-4">
            <div>
              <p className="text-xs font-bold">Hand Stanitizer</p>
              <p className="text-xs text-gray-400">Remaining qunantity: 10 Packets</p>
            </div>
            <Label className="py-1 px-2 text-[10px] text-red-600 bg-red-100 rounded-full">Low</Label>
          </div>
          <div className="flex items-center p-3 gap-x-4">
            <div>
              <p className="text-xs font-bold">Hand Stanitizer</p>
              <p className="text-xs text-gray-400">Remaining qunantity: 10 Packets</p>
            </div>
            <Label className="py-1 px-2 text-[10px] text-red-600 bg-red-100 rounded-full">Low</Label>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
