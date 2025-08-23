"use client";

import logoPng from "@/assets/svgs/logo-bg.svg";
import Card from "@/components/Card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Report = () => {
  return (
    <div className="space-y-10">
      <div>
        <h4 className="text-lg font-bold">Reporting and Analytics</h4>
        <h6>
          Procurement -{" "}
          <span className="text-black font-medium dark:text-grey-dark">
            Reporting and Analytics
          </span>
        </h6>
      </div>

      <Card className="flex gap-5 py-10">
        <div>
          <img src={logoPng.src} alt="logo" width={200} />
        </div>
        <div className="space-y-2 max-w-3xl">
          <h4 className="text-base font-bold">Reporting and Analytics</h4>
          <div className="flex flex-wrap items-center">
            {[
              {
                name: "Total Spent",
                amount: "50M",
                sign: "₦",
              },
              {
                name: "Avg. procurement Cycle",
                amount: "45 Days",
                sign: "",
              },
              {
                name: "Bulk Purchase Savings",
                amount: "5M",
                sign: "₦",
              },
              {
                name: "On-Time Delivery Rate",
                amount: "98",
                sign: "%",
              },
              {
                name: "Quality Compliance Rate",
                amount: "95",
                sign: "%",
              },
              {
                name: "Inventory Turnover",
                amount: "12x",
                sign: "",
              },
              {
                name: "Supplier Diversity Count",
                amount: "40",
                sign: "",
              },
              {
                name: "Risk Management Efficiency",
                amount: "high",
                sign: "",
              },
              {
                name: "Spend by Project",
                amount: "30M",
                sign: "₦",
              },
              {
                name: "Grant Utilization",
                amount: "85",
                sign: "%",
              },
            ].map(({ name, amount, sign }) => (
              <div
                key={name}
                className="py-2 px-5 border-2 border-dashed rounded-lg"
              >
                <div className="">
                  {sign === "%" ? (
                    <h4 className="text-lg font-bold">
                      {amount}
                      <span>{sign}</span>
                    </h4>
                  ) : (
                    <h4 className="text-lg font-bold">
                      <span>{sign}</span>
                      {amount}
                    </h4>
                  )}
                </div>
                <h4>{name}</h4>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
        <Card className="p-3 space-y-10 md:p-10">
          <div className="flex justify-between">
            <div>
              <h4 className="font-bold text-lg">Recent Statistics</h4>
              <h4 className="text-xs">More than 400 new members</h4>
            </div>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <svg
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.3">
                        <path
                          d="M13.8107 1.8934H16.1723C16.8061 1.8934 17.3486 2.10979 17.8 2.54257C18.2496 2.97535 18.4744 3.50664 18.4744 4.13646V6.4191C18.4744 7.03836 18.2496 7.56701 17.8 8.00507C17.3486 8.44488 16.8061 8.66479 16.1723 8.66479H13.8107C13.1751 8.66479 12.6325 8.44488 12.1829 8.00507C11.7316 7.56701 11.5059 7.03836 11.5059 6.4191V4.13646C11.5059 3.50664 11.7316 2.97535 12.1829 2.54257C12.6325 2.10979 13.1751 1.8934 13.8107 1.8934Z"
                          fill="#FD4A36"
                        />
                      </g>
                      <g opacity="0.3">
                        <path
                          d="M4.51497 10.929H6.87664C7.5122 10.929 8.05477 11.1489 8.50435 11.5887C8.95574 12.0267 9.18143 12.5554 9.18143 13.1746V15.4573C9.18143 16.0871 8.95574 16.6184 8.50435 17.0512C8.05477 17.484 7.5122 17.7003 6.87664 17.7003H4.51497C3.88122 17.7003 3.33865 17.484 2.88727 17.0512C2.43768 16.6184 2.21289 16.0871 2.21289 15.4573V13.1746C2.21289 12.5554 2.43768 12.0267 2.88727 11.5887C3.33865 11.1489 3.88122 10.929 4.51497 10.929Z"
                          fill="#FD4A36"
                        />
                      </g>
                      <path
                        d="M13.8107 10.9474H16.1723C16.8061 10.9474 17.3486 11.1673 17.8 11.6071C18.2496 12.0452 18.4744 12.5739 18.4744 13.1931V15.4942C18.4744 16.1117 18.2496 16.6404 17.8 17.0802C17.3486 17.5183 16.8061 17.7373 16.1723 17.7373H13.8107C13.1751 17.7373 12.6325 17.5183 12.1829 17.0802C11.7316 16.6404 11.5059 16.1117 11.5059 15.4942V13.1931C11.5059 12.5739 11.7316 12.0452 12.1829 11.6071C12.6325 11.1673 13.1751 10.9474 13.8107 10.9474Z"
                        fill="#FD4A36"
                      />
                      <path
                        d="M4.51497 1.85645H6.87664C7.5122 1.85645 8.05477 2.07547 8.50435 2.51353C8.95574 2.95334 9.18143 3.482 9.18143 4.0995V6.40061C9.18143 7.01987 8.95574 7.54853 8.50435 7.98658C8.05477 8.4264 7.5122 8.64631 6.87664 8.64631H4.51497C3.88122 8.64631 3.33865 8.4264 2.88727 7.98658C2.43768 7.54853 2.21289 7.01987 2.21289 6.40061V4.0995C2.21289 3.482 2.43768 2.95334 2.88727 2.51353C3.33865 2.07547 3.88122 1.85645 4.51497 1.85645Z"
                        fill="#FD4A36"
                      />
                    </svg>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <h4 className="font-medium p-5 text-base">Filter Options</h4>
                  <hr />

                  <div className="p-5 space-y-5">
                    <div className="space-y-1">
                      <h4 className="font-medium">Status:</h4>
                      <Select>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {/* <SelectLabel>Fruits</SelectLabel> */}
                            <SelectItem value="apple">Approved</SelectItem>
                            <SelectItem value="banana">Pending</SelectItem>
                            <SelectItem value="blueberry">
                              In Progress
                            </SelectItem>
                            <SelectItem value="grapes">Rejected</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium">Member Type:</h4>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Checkbox />{" "}
                          <h6 className="text-grey-light">Author</h6>
                        </div>
                        <div className="flex items-center gap-1">
                          <Checkbox checked />{" "}
                          <h6 className="text-grey-light">Customer</h6>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium">Notifications:</h4>
                      <div className="flex items-center space-x-2">
                        <Switch id="notifications-mode" checked />
                        <Label htmlFor="notifications-mode">Enabled</Label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button variant="ghost">Reset</Button>
                      <Button>Apply</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart width={500} data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                opacity={0.4}
              />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar
                dataKey="pv"
                fill="hsl(var(--primary))"
                barSize={10}
                radius={[8, 8, 0, 0]}
                // activeBar={<Rectangle fill="pink" stroke="blue" />}
              />
              <Bar
                dataKey="uv"
                fill="#B5B5C3"
                barSize={10}
                className=" rounded-t-full"
                radius={[8, 8, 0, 0]}
                // activeBar={<Rectangle fill="gold" stroke="purple" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-3 space-y-10 md:p-10">
          <div className="flex justify-between">
            <div>
              <h4 className="font-bold text-lg">Projects Expenditure</h4>
              <h4 className="text-xs">
                Total Funds Expended on Major Initiatives
              </h4>
            </div>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <svg
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.3">
                        <path
                          d="M13.8107 1.8934H16.1723C16.8061 1.8934 17.3486 2.10979 17.8 2.54257C18.2496 2.97535 18.4744 3.50664 18.4744 4.13646V6.4191C18.4744 7.03836 18.2496 7.56701 17.8 8.00507C17.3486 8.44488 16.8061 8.66479 16.1723 8.66479H13.8107C13.1751 8.66479 12.6325 8.44488 12.1829 8.00507C11.7316 7.56701 11.5059 7.03836 11.5059 6.4191V4.13646C11.5059 3.50664 11.7316 2.97535 12.1829 2.54257C12.6325 2.10979 13.1751 1.8934 13.8107 1.8934Z"
                          fill="#FD4A36"
                        />
                      </g>
                      <g opacity="0.3">
                        <path
                          d="M4.51497 10.929H6.87664C7.5122 10.929 8.05477 11.1489 8.50435 11.5887C8.95574 12.0267 9.18143 12.5554 9.18143 13.1746V15.4573C9.18143 16.0871 8.95574 16.6184 8.50435 17.0512C8.05477 17.484 7.5122 17.7003 6.87664 17.7003H4.51497C3.88122 17.7003 3.33865 17.484 2.88727 17.0512C2.43768 16.6184 2.21289 16.0871 2.21289 15.4573V13.1746C2.21289 12.5554 2.43768 12.0267 2.88727 11.5887C3.33865 11.1489 3.88122 10.929 4.51497 10.929Z"
                          fill="#FD4A36"
                        />
                      </g>
                      <path
                        d="M13.8107 10.9474H16.1723C16.8061 10.9474 17.3486 11.1673 17.8 11.6071C18.2496 12.0452 18.4744 12.5739 18.4744 13.1931V15.4942C18.4744 16.1117 18.2496 16.6404 17.8 17.0802C17.3486 17.5183 16.8061 17.7373 16.1723 17.7373H13.8107C13.1751 17.7373 12.6325 17.5183 12.1829 17.0802C11.7316 16.6404 11.5059 16.1117 11.5059 15.4942V13.1931C11.5059 12.5739 11.7316 12.0452 12.1829 11.6071C12.6325 11.1673 13.1751 10.9474 13.8107 10.9474Z"
                        fill="#FD4A36"
                      />
                      <path
                        d="M4.51497 1.85645H6.87664C7.5122 1.85645 8.05477 2.07547 8.50435 2.51353C8.95574 2.95334 9.18143 3.482 9.18143 4.0995V6.40061C9.18143 7.01987 8.95574 7.54853 8.50435 7.98658C8.05477 8.4264 7.5122 8.64631 6.87664 8.64631H4.51497C3.88122 8.64631 3.33865 8.4264 2.88727 7.98658C2.43768 7.54853 2.21289 7.01987 2.21289 6.40061V4.0995C2.21289 3.482 2.43768 2.95334 2.88727 2.51353C3.33865 2.07547 3.88122 1.85645 4.51497 1.85645Z"
                        fill="#FD4A36"
                      />
                    </svg>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <h4 className="font-medium p-5 text-base">Filter Options</h4>
                  <hr />

                  <div className="p-5 space-y-5">
                    <div className="space-y-1">
                      <h4 className="font-medium">Status:</h4>
                      <Select>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {/* <SelectLabel>Fruits</SelectLabel> */}
                            <SelectItem value="apple">Approved</SelectItem>
                            <SelectItem value="banana">Pending</SelectItem>
                            <SelectItem value="blueberry">
                              In Progress
                            </SelectItem>
                            <SelectItem value="grapes">Rejected</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium">Member Type:</h4>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Checkbox />{" "}
                          <h6 className="text-grey-light">Author</h6>
                        </div>
                        <div className="flex items-center gap-1">
                          <Checkbox checked />{" "}
                          <h6 className="text-grey-light">Customer</h6>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium">Notifications:</h4>
                      <div className="flex items-center space-x-2">
                        <Switch id="notifications-mode" checked />
                        <Label htmlFor="notifications-mode">Enabled</Label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button variant="ghost">Reset</Button>
                      <Button>Apply</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex relative gap-5 flex-col md:flex-row">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart width={400} height={400}>
                <Tooltip />
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="block md:hidden">
              {pieData.map(({ name, color }) => (
                <div key={name} className="flex items-center gap-2">
                  <div
                    style={{ backgroundColor: color }}
                    className="h-3 w-3 rounded-full"
                  />
                  <h4>{name}</h4>
                </div>
              ))}
            </div>
            <div className="absolute hidden top-5 right-5 md:block">
              {pieData.map(({ name, color }) => (
                <div key={name} className="flex items-center gap-2">
                  <div
                    style={{ backgroundColor: color }}
                    className="h-3 w-3 rounded-full"
                  />
                  <h4>{name}</h4>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Report;

const pieData = [
  { name: "Group A", value: 400, color: "#0088FE" },
  { name: "Group B", value: 300, color: "#00C49F" },
  { name: "Group C", value: 300, color: "#FFBB28" },
  { name: "Group D", value: 200, color: "#FF8042" },
  { name: "Group E", value: 100, color: "#775DD0" },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#775DD0"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const data = [
  {
    name: "Feb",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Mar",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Apr",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "May",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Jun",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Jul",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
];
