/* eslint-disable react/prop-types */
import Card from "components/shared/Card";
import { LoadingSpinner } from "components/shared/Loading";
import { Button } from "components/ui/button";
import { Progress } from "components/ui/progress";
import PriceIntelligenceAPI from "services/procurementApi/price-intelligence";
import { ScrollArea } from "components/ui/scroll-area";
import { useMemo, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "components/ui/dialog";
import BreadcrumbCard from "components/shared/Breadcrumb";
import { PriceIntelligenceDetail } from "definations/procurement-types/price-intelligence";
import { format } from "date-fns";

const RatingCircle = ({ showInner }: any) => {
  return (
    <p className='w-[24px] p-1 flex justify-center items-center h-[24px] rounded-full border-[#DEA004] border'>
      {showInner && (
        <p className='w-[12px] h-[12px] rounded-full border-[#DEA004] border-t-2 border-l-2'></p>
      )}
    </p>
  );
};

const PriceIntelligence = () => {
  const [open, setOpen] = useState(false);
  const [priceId, setPriceId] = useState("");
  const onOpenDialog = (id: string) => {
    setOpen(!open);
    setPriceId(id);
  };
  const { data, isLoading } =
    PriceIntelligenceAPI.useGetPriceIntelligencesQuery({});
  const { data: priceDetails, isLoading: priceDetailsIsLoading } =
    PriceIntelligenceAPI.useGetPriceIntelligenceQuery(
      useMemo(
        () => ({
          path: { id: priceId as string },
        }),
        [priceId]
      )
    );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Price Intelligence", icon: false },
  ];

  console.log({ data });

  return (
    <div className='space-y-10'>
      <BreadcrumbCard list={breadcrumbs} />
      <div className='grid grid-cols-2 gap-6 '>
        {data?.map((price) => (
          <Card key={price?.id} className='h-[275px] cursor-pointer'>
            <Dialog open={open} onOpenChange={() => onOpenDialog(price?.id)}>
              <DialogTrigger asChild>
                <div className='flex flex-col justify-between h-full'>
                  <div className='space-y-2 w-[70%]'>
                    <h2 className='text-lg font-semibold'>{price?.name}</h2>
                    <p className='text-sm leading-6 '>{price?.description}</p>
                  </div>
                  <div className='space-y-4'>
                    <div className='grid grid-cols-5 w-[40%]'>
                      <RatingCircle showInner />
                      <RatingCircle showInner />
                      <RatingCircle showInner />
                      <RatingCircle />
                      <RatingCircle />
                    </div>
                    <div className='flex items-center justify-between w-full'>
                      <div className='w-[50%] space-y-2'>
                        <div className='flex items-center justify-between'>
                          <p className='text-sm font-light'>
                            <span className='font-bold'>
                              ₦{price?.min_price || 0}
                            </span>{" "}
                            Min
                          </p>
                          <p className='text-sm font-light'>
                            <span className='font-bold'>
                              ₦{price?.max_price || 0}
                            </span>{" "}
                            Max
                          </p>
                        </div>
                        <Progress
                          // className2="bg-[#E0FDD6]"
                          value={0}
                          className='w-full h-4 '
                        />
                      </div>
                      <div>
                        <Button className='bg-[#1A9B3E]'>
                          ₦
                          {(price?.avg_price &&
                            price?.avg_price.toLocaleString()) ||
                            0}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className='max-w-5xl'>
                {priceDetailsIsLoading && <LoadingSpinner />}
                <DialogHeader className='text-2xl font-semibold'>
                  {priceDetails?.name}
                </DialogHeader>
                <div className='px-5'>
                  <ScrollArea className='h-[80vh] py-10 space-y-5'>
                    <div className='flex justify-between'>
                      <h2 className='font-semibold text-red-500'>
                        Price Trend
                      </h2>
                      {/* <div>
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
                      </div> */}
                    </div>
                    <PriceTrendChart
                      {...(priceDetails as PriceIntelligenceDetail)}
                    />
                    <div className='space-y-2'>
                      <h3 className='font-bold text-yellow-500'>
                        Product Description
                      </h3>
                      <p className='text-sm font-light'>
                        Specification: {priceDetails?.description}
                      </p>
                    </div>
                    <div className='mt-10'>
                      <h3 className='font-bold text-yellow-500'>
                        Price History
                      </h3>
                      <div>
                        <table className='w-full border'>
                          <thead>
                            <tr className='text-amber-500 whitespace-nowrap text-xs font-semibold'>
                              <th className='px-2 py-5'>S/N</th>
                              <th className='px-2 py-5'>Source</th>
                              <th className='px-2 py-5'>Price</th>
                              <th className='px-2 py-5'>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {priceDetails?.history?.map((history, index) => (
                              <tr key={index} className='w-full border'>
                                <td className='w-fit p-2 text-center '>
                                  <span className='p-2 px-4 text-xs bg-gray-200 text-black rounded'>
                                    {index + 1}.
                                  </span>
                                </td>
                                <td className='w-fit p-2 text-center'>
                                  {history?.source}
                                </td>
                                <td className='w-fit p-2 text-center'>
                                  ₦{history?.price?.toLocaleString()}
                                </td>
                                <td className='w-fit p-2 text-center'>
                                  {history?.date}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PriceIntelligence;

// Define the data type
// type DataType = {
//   month: string;
//   price: number;
// };

// Complete sample data array for all months
// const data: DataType[] = [
//   { month: "Jan", price: 1500000 },
//   { month: "Feb", price: 2600000 },
//   { month: "Mar", price: 3720192.5 },
//   // Add your actual data points for each month
//   { month: "Apr", price: 3800000 },
//   { month: "May", price: 2850000 },
//   { month: "Jun", price: 3900000 },
//   { month: "Jul", price: 2950000 },
//   { month: "Aug", price: 4000000 },
//   { month: "Sep", price: 4050000 },
//   { month: "Oct", price: 3100000 },
//   { month: "Nov", price: 4200000 },
//   { month: "Dec", price: 8300000 },
// ];

// Custom Tooltip component
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className='p-2 bg-white border rounded shadow-lg'>
        {/* @ts-ignore */}
        <p className='label'>{`${label} : ${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }

  return null;
};

// Chart component
const PriceTrendChart = (data: PriceIntelligenceDetail) => {
  const formattedData = data?.history?.map((history) => {
    return {
      source: history?.source,
      price: history.price,
      date: format(history?.date, "dd, MMM"),
    };
  });

  return (
    <div className='p-4'>
      <ResponsiveContainer width='100%' height={300}>
        <AreaChart
          data={formattedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id='colorPrice' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#107D38' stopOpacity={0.5} />
              <stop offset='95%' stopColor='#107D38' stopOpacity={0.5} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis className='text-xs' dataKey='date' />
          <YAxis className='text-xs' />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type='monotone'
            dataKey='price'
            stroke='#38A169'
            fillOpacity={1}
            fill='url(#colorPrice)'
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
