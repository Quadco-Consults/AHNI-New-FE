"use client";

import Card from "@/components/Card";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGetAllPriceIntelligence, useGetSinglePriceIntelligence } from "@/features/procurement/controllers/priceIntelligenceController";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useMemo, useState } from "react";
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
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BreadcrumbCard from "@/components/Breadcrumb";
import { PriceIntelligenceDetail, PriceIntelligenceHistory } from "@/features/procurement/types/price-intelligence";
import { format, parseISO } from "date-fns";

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
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const onOpenDialog = (id: string) => {
    setOpen(!open);
    setPriceId(id);
  };

  // Correct type definition for `useGetAllPriceIntelligence`
  const { data, isLoading, error } = useGetAllPriceIntelligence({ page: 1, size: 20 });

  // Ensure `data` is properly typed
  const items = (data as unknown as { results: PriceIntelligenceList[]; pagination: { page: number; size: number; total: number } })?.results || [];
  const pagination = (data as unknown as { results: PriceIntelligenceList[]; pagination: { page: number; size: number; total: number } })?.pagination;

  const { data: priceDetails, isLoading: priceDetailsIsLoading } = useGetSinglePriceIntelligence(
    priceId, !!priceId
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">Failed to load data. Please try again later.</div>;
  }

  // Add a fallback message if priceDetails is missing
  if (!priceDetails) {
    return <div className="text-red-500">Price details are currently unavailable. Please try again later.</div>;
  }

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Price Intelligence", icon: false },
  ];

  console.log({ data, priceDetails });

  return (
    <div className='space-y-10'>
      <BreadcrumbCard list={breadcrumbs} />
      <div className='grid grid-cols-2 gap-6 '>
        {items.map((price) => (
          <Card key={price?.id} className='h-[275px] cursor-pointer'>
            <Dialog
              open={open}
              onOpenChange={() => onOpenDialog(price?.item_id)}
            >
              <DialogTrigger asChild>
                <div className='flex flex-col justify-between h-full'>
                  <div className='space-y-2 w-[70%]'>
                    <h2 className='text-lg font-semibold'>
                      {price?.item_name}
                    </h2>
                    <p className='text-sm leading-6 '>
                      {price?.item_description}
                    </p>
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
                              ₦{Number(price?.min_price).toLocaleString() || 0}
                            </span>{" "}
                            Min
                          </p>
                          <p className='text-sm font-light'>
                            <span className='font-bold'>
                              ₦{Number(price?.max_price).toLocaleString() || 0}
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
                <DialogHeader>
                  <DialogTitle className='text-2xl font-semibold'>
                    {priceDetails?.data?.name}
                  </DialogTitle>
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
                      // {...(priceDetails as PriceIntelligenceDetail)}
                      selectedSources={selectedSources}
                      setSelectedSources={setSelectedSources}
                      data={priceDetails?.data?.history}
                    />
                    <div className='space-y-2'>
                      <h3 className='font-bold text-yellow-500'>
                        Product Description
                      </h3>
                      <p className='text-sm font-light'>
                        Specification: {priceDetails?.data?.description}
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
                            {priceDetails?.data?.history?.map((history: PriceIntelligenceHistory, index: number) => (
                              <tr key={index} className='w-full border'>
                                <td className='w-fit p-2 text-center '>
                                  <span className='p-2 px-4 text-xs bg-gray-200 text-black rounded'>
                                    {index + 1}.
                                  </span>
                                </td>
                                <td className='w-fit p-2 text-center'>
                                  {/* {history?.source} */}
                                  {selectedSources}
                                </td>
                                <td className='w-fit p-2 text-center'>
                                  ₦{history?.price?.toLocaleString()}
                                </td>
                                <td className='w-fit p-2 text-center'>
                                  {history?.date}

                                  {format(
                                    parseISO(history?.date),
                                    "dd MMM, yy"
                                  )}
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
      {pagination && (
        <div>
          <p>Page {pagination.page} of {Math.ceil(pagination.total / pagination.size)}</p>
        </div>
      )}
    </div>
  );
};

export default PriceIntelligence;

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

// Define the type for `source_prices`
interface SourcePrices {
  [key: string]: { price: number; created_datetime: string }[];
}

// Refine the type for `prices` in the transformation function
const transformedSourcePrices = (sourcePrices: SourcePrices) => {
  return Object.entries(sourcePrices).flatMap(([source, prices]) =>
    (prices as { price: number; created_datetime: string }[]).map((entry) => ({
      source,
      price: entry.price,
      date: format(parseISO(entry.created_datetime), "dd MMM, yy"),
    }))
  );
};

// Chart component
// const PriceTrendChart = (data: PriceIntelligenceDetail) => {
const PriceTrendChart = ({
  data,
  selectedSources,
  setSelectedSources,
}: {
  data: PriceIntelligenceHistory[];
  selectedSources: string[];
  setSelectedSources: (sources: string[]) => void;
}) => {
  console.log({ crackedData: data });

  // Extract price history from all sources
  const priceEntries = Object.entries(data || {}).flatMap(
    ([source, prices]: [string, PriceIntelligenceHistory[]]) =>
      prices.map((entry) => ({
        source,
        price: entry.price,
        date: format(parseISO(entry.date), "dd MMM, yy"), // Format date
      }))
  );
  console.log({ priceEntries });

  // useEffect(() => {
  //   setSelectedSources(priceEntries);
  // }, [priceEntries]);
  console.log({ selectedSources });

  // Extract unique sources
  const allSources = Array.from(new Set(priceEntries.map((d) => d.source)));

  // useEffect(() => {
  //   setSelectedSources(allSources);
  // }, [allSources]);

  // State to track selected sources
  // const [selectedSources, setSelectedSources] = useState<string[]>(allSources);

  // Filter data based on selected sources
  const filteredData = priceEntries
    ?.filter((d) => selectedSources?.includes(d?.source))
    ?.map(({ price, date }) => ({ price, date })) // Keep only price and date
    ?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className='p-4'>
      <div className='mb-4 flex gap-3 flex-wrap'>
        {allSources.map((source) => (
          <label key={source} className='flex items-center space-x-2'>
            <input
              type='checkbox'
              checked={selectedSources?.includes(source)}
              onChange={() => {
                setSelectedSources([source]);
              }}
            />
            <span>{source}</span>
          </label>
        ))}
      </div>
      <ResponsiveContainer width='100%' height={300}>
        <AreaChart
          data={filteredData}
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
