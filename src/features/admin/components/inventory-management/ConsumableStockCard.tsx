import DataTable from "@/components/Table/DataTable";
import TableFilters from "@/components/Table/TableFilters";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export default function ConsumableStockCard({
  stockCard,
  loading,
  error,
  itemStocks = [],
  itemName = "Unknown Item",
  storeName
}: {
  stockCard: any;
  loading?: boolean;
  error?: any;
  itemStocks?: any[];
  itemName?: string;
  storeName?: string; // Optional: display store-specific stock card
}) {
  // Debug the stockCard data structure
  console.log("🔍 ConsumableStockCard DEBUG - Full Data:", {
    stockCard,
    loading,
    error,
    hasStockCard: !!stockCard,
    stockCardKeys: stockCard ? Object.keys(stockCard) : [],
    dataPath1: stockCard?.data,
    dataPath2: stockCard?.data?.results,
    dataPath3: stockCard?.data?.data,
    dataPath4: stockCard?.data?.data?.results,
    resultsLength: stockCard?.data?.results?.length || stockCard?.data?.data?.results?.length,
    firstItem: stockCard?.data?.results?.[0] || stockCard?.data?.data?.results?.[0],
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
    console.error("🔍 ConsumableStockCard ERROR:", error);
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

  // Try different possible data paths - API may return nested structure
  const stockData =
    stockCard?.data?.data?.results || // Try triple nested first
    stockCard?.data?.results ||        // Then double nested
    stockCard?.results ||              // Then single nested
    [];

  console.log("🔍 ConsumableStockCard - Extracted stockData:", {
    stockData,
    length: stockData.length,
    firstItem: stockData[0],
    itemStocks,
    itemStocksLength: itemStocks.length,
  });

  const displayItemName = stockData?.[0]?.itemName ||
                          stockData?.[0]?.item_data?.name ||
                          stockData?.[0]?.item_detail?.name ||
                          stockData?.[0]?.name ||
                          itemName;

  // If no movement history, show current stock levels instead
  if (!stockCard || !stockData.length) {
    console.log("🔍 ConsumableStockCard - No movement data, showing current stock levels");

    // Fallback: Show current stock levels table
    if (itemStocks && itemStocks.length > 0) {
      const stockLevelColumns: ColumnDef<any>[] = [
        {
          header: "Date",
          accessorKey: "updated_datetime",
          cell: ({ row }) => {
            const date = row.original.updated_datetime || row.original.created_datetime;
            return (
              <div className="text-sm">
                {date ? format(new Date(date), "dd-MMM-yyyy") : "N/A"}
              </div>
            );
          },
        },
        {
          header: "Store",
          accessorKey: "store_detail",
          cell: ({ row }) => {
            const storeName = row.original.store_detail?.name || row.original.storeName || 'Unknown Store';
            return <span className="text-sm font-medium">{storeName}</span>;
          },
        },
        {
          header: "Description",
          cell: () => <span className="text-sm text-gray-600">Current Stock Level</span>,
        },
        {
          header: "Qty Received",
          cell: () => <span className="text-sm text-gray-400">-</span>,
        },
        {
          header: "Qty Issued",
          cell: () => <span className="text-sm text-gray-400">-</span>,
        },
        {
          header: "Balance",
          accessorKey: "quantity",
          cell: ({ row }) => {
            const balance = row.original.quantity || row.original.available_quantity || 0;
            return (
              <span className="text-sm font-semibold text-blue-600">
                {balance.toLocaleString()}
              </span>
            );
          },
        },
      ];

      return (
        <div className='mt-6'>
          <Card>
            <CardContent className='py-5 space-y-6'>
              <div>
                <h4 className='text-lg font-medium'>
                  {displayItemName} - Stock Card
                </h4>
                <p className='text-sm text-gray-600 mt-1'>
                  Current stock levels (no movement history recorded yet)
                </p>
              </div>
              <Separator />
              <TableFilters>
                <DataTable
                  columns={stockLevelColumns}
                  data={itemStocks}
                />
              </TableFilters>
            </CardContent>
          </Card>
        </div>
      );
    }

    // No data at all
    return (
      <div className='mt-6'>
        <Card>
          <CardContent className='py-5'>
            <div className='text-center text-gray-500 space-y-3'>
              <p className='font-medium'>No stock information available</p>
              <p className='text-sm'>This item has not been added to any store yet.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log("🔍 ConsumableStockCard - Rendering table with movement data:", stockData.length, "records");

  // Stock Card Columns - Clean format with Store
  const stockCardColumns: ColumnDef<any>[] = [
    {
      header: "Date",
      accessorKey: "created_datetime",
      size: 120,
      cell: ({ row }) => {
        const date = row.original.created_datetime || row.original.movement_date || row.original.date;
        return (
          <div className="text-sm">
            {date ? format(new Date(date), "dd-MMM-yyyy") : "N/A"}
          </div>
        );
      },
    },
    {
      header: "Store",
      accessorKey: "store_detail",
      size: 150,
      cell: ({ row }) => {
        const storeName = row.original.store_detail?.name || row.original.store_name || row.original.storeName || 'N/A';
        return <span className="text-sm font-medium">{storeName}</span>;
      },
    },
    {
      header: "Description",
      accessorKey: "description",
      size: 200,
      cell: ({ row }) => {
        // Prioritize remark (which contains GRN/PO info) over generic movement type
        const description =
          row.original.remark ||
          row.original.description ||
          row.original.movementTypeDisplay ||
          row.original.movement_type ||
          'Stock Movement';
        return <span className="text-sm">{description}</span>;
      },
    },
    {
      header: "Qty Received",
      accessorKey: "quantity_in",
      size: 120,
      cell: ({ row }) => {
        const quantity = row.original.quantity || row.original.quantity_in || 0;
        const movementType = row.original.movement_type;
        const isInflow = movementType === 'RECEIVE' || movementType === 'IN' || movementType === 'ADJUSTMENT_ADD' || quantity > 0;
        const quantityIn = isInflow ? Math.abs(quantity) : 0;

        return (
          <span className={`text-sm font-medium ${quantityIn > 0 ? 'text-green-600' : 'text-gray-400'}`}>
            {quantityIn > 0 ? quantityIn.toLocaleString() : '-'}
          </span>
        );
      },
    },
    {
      header: "Qty Issued",
      accessorKey: "quantity_out",
      size: 120,
      cell: ({ row }) => {
        const quantity = row.original.quantity || row.original.quantity_out || 0;
        const movementType = row.original.movement_type;
        const isOutflow = movementType === 'ISSUE' || movementType === 'OUT' || movementType === 'ADJUSTMENT_SUBTRACT' || quantity < 0;
        const quantityOut = isOutflow ? Math.abs(quantity) : 0;

        return (
          <span className={`text-sm font-medium ${quantityOut > 0 ? 'text-red-600' : 'text-gray-400'}`}>
            {quantityOut > 0 ? quantityOut.toLocaleString() : '-'}
          </span>
        );
      },
    },
    {
      header: "Balance",
      accessorKey: "balance",
      size: 100,
      cell: ({ row }) => {
        const balance =
          row.original.balance ||
          row.original.balance_after ||
          row.original.running_balance ||
          row.original.balance_before ||
          0;
        return (
          <span className="text-sm font-semibold text-blue-600">
            {balance.toLocaleString()}
          </span>
        );
      },
    },
  ];

  return (
    <div className='mt-6'>
      <Card>
        <CardContent className='py-5 space-y-6'>
          <div>
            <h4 className='text-lg font-medium'>
              {itemName} - Stock Card{storeName && ` (${storeName})`}
            </h4>
            <p className='text-sm text-gray-600 mt-1'>
              {storeName
                ? `Transaction history for ${storeName} showing quantity received, issued, and running balances`
                : `Transaction history across all stores showing quantity received, issued, and running balances`}
            </p>
          </div>
          <Separator />
          <TableFilters>
            <DataTable
              columns={stockCardColumns}
              data={stockData}
            />
          </TableFilters>
        </CardContent>
      </Card>
    </div>
  );
}
