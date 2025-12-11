import { stockMovementColumns } from "@/features/admin/components/table-columns/inventory-management/consumables";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Card, CardContent } from "components/ui/card";
import { Separator } from "components/ui/separator";

export default function ConsumableStockCard({
  stockCard,
  loading,
  error
}: {
  stockCard: any;
  loading?: boolean;
  error?: any;
}) {
  // Debug the stockCard data structure
  console.log("🔍 ConsumableStockCard DEBUG:", {
    stockCard,
    loading,
    error,
    dataPath1: stockCard?.data,
    dataPath2: stockCard?.data?.results,
    resultsLength: stockCard?.data?.results?.length,
    firstItem: stockCard?.data?.results?.[0],
  });

  // Show loading state
  if (loading) {
    return (
      <div className='mt-6'>
        <Card>
          <CardContent className='py-5'>
            <p className='text-center text-gray-500'>Loading stock card data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className='mt-6'>
        <Card>
          <CardContent className='py-5'>
            <div className='text-center text-red-500'>
              <p>Error loading stock card data</p>
              <p className='text-sm mt-2'>{error.message || error.toString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Try different possible data paths
  const stockData = stockCard?.data?.results || stockCard?.data?.data?.results || [];
  const itemName = stockData?.[0]?.itemName || stockData?.[0]?.item_data?.name || stockData?.[0]?.item_detail?.name || stockData?.[0]?.name || 'Unknown Item';

  // Show no data state
  if (!stockCard || !stockData.length) {
    return (
      <div className='mt-6'>
        <Card>
          <CardContent className='py-5'>
            <p className='text-center text-gray-500'>No stock card data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='mt-6'>
      <Card>
        <CardContent className='py-5 space-y-6'>
          <div>
            <h4 className='text-lg font-medium'>
              {itemName} - Stock Card
            </h4>
            <p className='text-sm text-gray-600 mt-1'>
              Transaction history showing inflow, outflow, and running balances
            </p>
          </div>
          <Separator />
          <TableFilters>
            <DataTable
              columns={stockMovementColumns}
              data={stockData}
            />
          </TableFilters>
        </CardContent>
      </Card>
    </div>
  );
}
