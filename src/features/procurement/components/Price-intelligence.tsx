"use client";

import Card from "@/components/Card";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGetAllPriceIntelligence } from "@/features/procurement/controllers/priceIntelligenceController";
import BreadcrumbCard from "@/components/Breadcrumb";

const RatingCircle = ({ showInner }: { showInner?: boolean }) => {
  return (
    <p className='w-[24px] p-1 flex justify-center items-center h-[24px] rounded-full border-[#DEA004] border'>
      {showInner && (
        <p className='w-[12px] h-[12px] rounded-full border-[#DEA004] border-t-2 border-l-2'></p>
      )}
    </p>
  );
};

const PriceIntelligence = () => {
  // Get price intelligence data
  const { data, isLoading, error } = useGetAllPriceIntelligence({ page: 1, size: 20 });

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Price Intelligence", icon: false },
  ];

  if (isLoading) {
    return (
      <div className='space-y-10'>
        <BreadcrumbCard list={breadcrumbs} />
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-10'>
        <BreadcrumbCard list={breadcrumbs} />
        <div className="text-red-500 p-4">Failed to load data. Please try again later.</div>
      </div>
    );
  }

  // Extract data safely
  const items = data?.data?.results || [];

  if (!items || items.length === 0) {
    return (
      <div className='space-y-10'>
        <BreadcrumbCard list={breadcrumbs} />
        <div className="text-gray-500 p-4">No price intelligence data available.</div>
      </div>
    );
  }

  return (
    <div className='space-y-10'>
      <BreadcrumbCard list={breadcrumbs} />
      <div className='grid grid-cols-2 gap-6'>
        {items.map((price: any) => (
          <Card key={price?.id} className='h-[275px] cursor-pointer'>
            <div className='flex flex-col justify-between h-full'>
              <div className='space-y-2 w-[70%]'>
                <h2 className='text-lg font-semibold'>
                  {price?.item_name || price?.name || 'Unknown Item'}
                </h2>
                <p className='text-sm leading-6'>
                  {price?.item_description || price?.description || 'No description available'}
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
                          ₦{Number(price?.min_price || 0).toLocaleString()}
                        </span>{" "}
                        Min
                      </p>
                      <p className='text-sm font-light'>
                        <span className='font-bold'>
                          ₦{Number(price?.max_price || 0).toLocaleString()}
                        </span>{" "}
                        Max
                      </p>
                    </div>
                    <Progress
                      value={0}
                      className='w-full h-4'
                    />
                  </div>
                  <div>
                    <Button className='bg-[#1A9B3E]'>
                      ₦{Number(price?.avg_price || 0).toLocaleString()}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PriceIntelligence;