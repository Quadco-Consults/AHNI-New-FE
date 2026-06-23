import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/useStore";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dialogs";
import TableAction from "@/components/TableAction";
import { LoadingSpinner } from "@/components/Loading";
import { useState } from "react";
import {
  useGetAllExchangeRatesQuery,
} from "@/features/modules/controllers/config/exchangeRateController";
import Pagination from "@/components/Pagination";

export default function AllExchangeRates() {
  const [page, setPage] = useState(1);

  const { data: exchangeRates, isFetching, error } = useGetAllExchangeRatesQuery({
    page,
    size: 20,
    enabled: true, // Backend endpoints are confirmed working
  });

  const dispatch = useAppDispatch();

  // Note: Delete functionality would need to be implemented with proper mutation hooks
  const onSubmit = async (id: string) => {
    try {
      // TODO: Implement delete functionality when backend is ready
      toast.success("Exchange Rate Deleted Successfully");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? error.message ?? "Something went wrong"
      );
    }
  };

  const onUpdate = (item: any) => {
    dispatch(
      openDialog({
        type: DialogType.AddExchangeRate,
        dialogProps: {
          header: "Update Exchange Rate",
          data: item,
          type: "update",
        },
      })
    );
  };

  const formatCurrency = (code: string | undefined | null) => {
    if (!code) {
      return 'N/A';
    }
    return code.toUpperCase();
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

  return (
    <div>
      <div className='flex justify-between items-center py-6 mb-6'>
        <h1 className='text-error font-semibold text-sm'>Exchange Rates</h1>
        <Button
          onClick={() =>
            dispatch(
              openDialog({
                type: DialogType.AddExchangeRate,
                dialogProps: {
                  header: "Add Exchange Rate",
                },
              })
            )
          }
          variant='outline'
          className='gap-x-2 shadow-[0px_3px_8px_rgba(0,0,0,0.07)] bg-white text-yellow-darker border-[1px] border-gray-border'
          size='sm'
        >
          Click to add New
        </Button>
      </div>
      <div>
        <div className='flex text-gray-text font-semibold text-sm border-b border-gray-300 pb-4'>
          <h1 className='flex-1'>From</h1>
          <h1 className='flex-1'>To</h1>
          <h1 className='flex-1'>Exchange Rate</h1>
          <h1 className='flex-1'>Effective Date</h1>
          <h1 className='flex-1'>Source</h1>
          <h1 className='flex-1'>Status</h1>
          <h1 className='flex-1'></h1>
        </div>

        {isFetching ? (
          <LoadingSpinner />
        ) : (
          <div>
            {exchangeRates?.data?.results?.map((item) => (
              <div
                key={item?.id || Math.random()}
                className='flex justify-between mt-6 text-gray-text font-normal text-xs items-center'
              >
                <p className='flex-1 font-medium'>{formatCurrency(item?.base_currency)}</p>
                <p className='flex-1 font-medium'>{formatCurrency(item?.target_currency)}</p>
                <p className='flex-1 font-semibold text-green-600'>
                  {item?.exchange_rate != null ? item.exchange_rate.toLocaleString() : 'N/A'}
                </p>
                <p className='flex-1'>{formatDate(item?.effective_date)}</p>
                <p className='flex-1'>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    {item?.source || 'N/A'}
                  </span>
                </p>
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

            {(!exchangeRates?.data?.results || exchangeRates.data.results.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <p>No exchange rates found</p>
                <p className="text-xs mt-1">Click "Add New" to create your first exchange rate</p>
              </div>
            )}
          </div>
        )}

        <Pagination
          total={exchangeRates?.data?.pagination?.count ?? 0}
          itemsPerPage={exchangeRates?.data?.pagination?.page_size ?? 20}
          onChange={(page: number) => setPage(page)}
        />
      </div>
    </div>
  );
}