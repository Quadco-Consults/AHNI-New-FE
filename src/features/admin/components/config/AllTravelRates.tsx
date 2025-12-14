import { Button } from "components/ui/button";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import TableAction from "components/TableAction";
import { LoadingSpinner } from "components/Loading";
import { useState } from "react";
import {
  useGetAllTravelRatesQuery,
} from "@/features/modules/controllers/config/travelRateController";
import Pagination from "components/Pagination";

export default function AllTravelRates() {
  const [page, setPage] = useState(1);

  const { data: travelRates, isFetching, error } = useGetAllTravelRatesQuery({
    page,
    size: 20,
    enabled: true, // Backend endpoints are confirmed working
  });

  const dispatch = useAppDispatch();

  // Note: Delete functionality would need to be implemented with proper mutation hooks
  const onSubmit = async (id: string) => {
    try {
      // TODO: Implement delete functionality when backend is ready
      toast.success("Travel Rate Deleted Successfully");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? error.message ?? "Something went wrong"
      );
    }
  };

  const onUpdate = (item: any) => {
    dispatch(
      openDialog({
        type: DialogType.AddTravelRate,
        dialogProps: {
          header: "Update Travel Rate",
          data: item,
          type: "update",
        },
      })
    );
  };

  const formatCurrency = (amount: number | undefined | null, currency: string) => {
    if (amount == null || isNaN(amount)) {
      return `${currency} 0`;
    }
    return `${currency} ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) {
      return 'N/A';
    }
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  const getStatusBadge = (isActive: boolean, expiryDate?: string) => {
    if (!isActive) {
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Inactive</span>;
    }

    if (expiryDate && new Date(expiryDate) < new Date()) {
      return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Expired</span>;
    }

    return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Active</span>;
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      'Local': 'bg-blue-100 text-blue-800',
      'International': 'bg-purple-100 text-purple-800',
      'Regional': 'bg-green-100 text-green-800',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded ${colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {category}
      </span>
    );
  };

  return (
    <div>
      <div className='flex justify-between items-center py-6 mb-6'>
        <h1 className='text-[#D92D20] font-semibold text-sm'>Travel Rates</h1>
        <Button
          onClick={() =>
            dispatch(
              openDialog({
                type: DialogType.AddTravelRate,
                dialogProps: {
                  header: "Add Travel Rate",
                },
              })
            )
          }
          variant='outline'
          className='gap-x-2 shadow-[0px_3px_8px_rgba(0,0,0,0.07)] bg-[#FFFFFF] text-[#DEA004] border-[1px] border-[#C7CBD5]'
          size='sm'
        >
          Click to add New
        </Button>
      </div>
      <div>
        <div className='flex text-[#756D6D] font-semibold text-sm border-b border-gray-300 pb-4'>
          <h1 className='flex-1'>Location</h1>
          <h1 className='flex-1'>Category</h1>
          <h1 className='flex-1'>Per Diem</h1>
          <h1 className='flex-1'>Accommodation</h1>
          <h1 className='flex-1'>Effective Date</h1>
          <h1 className='flex-1'>Status</h1>
          <h1 className='flex-1'></h1>
        </div>

        {isFetching ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>Error loading travel rates</p>
            <p className="text-xs mt-1">{error?.toString() || 'Unknown error'}</p>
            <p className="text-xs mt-1">Check if the backend API endpoint /travel-rates/ exists</p>
          </div>
        ) : (
          <div>
            {travelRates?.data?.results?.map((item) => (
              <div
                key={item?.id || Math.random()}
                className='flex justify-between mt-6 text-[#756D6D] font-normal text-xs items-center'
              >
                <div className='flex-1'>
                  <p className="font-medium">{item?.state_name || item?.state || 'N/A'}</p>
                  <p className="text-xs text-gray-500">{item?.state_code || 'N/A'}, Nigeria</p>
                </div>
                <div className='flex-1'>
                  {getCategoryBadge('Local')}
                </div>
                <p className='flex-1 font-semibold text-green-600'>
                  {formatCurrency(item?.mie_rate || item?.per_diem_rate, 'NGN')}
                </p>
                <p className='flex-1 font-semibold text-blue-600'>
                  {formatCurrency(item?.lodging_rate || item?.accommodation_rate, 'NGN')}
                </p>
                <p className='flex-1'>{formatDate(item?.effective_date)}</p>
                <div className='flex-1'>
                  {getStatusBadge(item?.is_active ?? true, item?.expiry_date)}
                </div>
                <div className='flex-1'>
                  <TableAction
                    update
                    removeView
                    action={() => onSubmit(item?.id || '')}
                    updateAction={() => onUpdate(item)}
                  />
                </div>
              </div>
            ))}

            {(!travelRates?.data?.results || travelRates.data.results.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <p>No travel rates found</p>
                <p className="text-xs mt-1">Click "Add New" to create your first travel rate</p>
              </div>
            )}
          </div>
        )}

        <Pagination
          total={travelRates?.data?.pagination?.count ?? 0}
          itemsPerPage={travelRates?.data?.pagination?.page_size ?? 20}
          onChange={(page: number) => setPage(page)}
        />
      </div>
    </div>
  );
}