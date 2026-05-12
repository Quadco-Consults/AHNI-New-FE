"use client";

import Card from "@/components/Card";
import DataTable from "@/components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, ArrowLeft } from "lucide-react";
import { useGetSingleGoodReceiveNoteQuery, useDownloadGoodReceiveNote } from "@/features/admin/controllers/goodReceiveNoteController";
import { useGetSinglePurchaseOrder } from "@/features/procurement/controllers/purchaseOrderController";
import { useGetPurchaseRequest } from "@/features/procurement/controllers/purchaseRequestController";
import { useGetSingleUser } from "@/features/auth/controllers/userController";
import { useGetSingleStore } from "@/features/admin/controllers/storeController";
import { useGetStoreInventory } from "@/features/admin/controllers/itemStoreStockController";
import { useMemo, useState } from "react";
import Link from "next/link";

// Table columns for GRN Items (what was actually received)
const grnItemsTableColumns: ColumnDef<any>[] = [
  {
    header: "Description of Items",
    cell: ({ row }) => {
      // Access item details from grn_item -> purchase_order_item -> item_detail
      const itemName = row.original?.purchase_order_item_detail?.item_detail?.name ||
                       row.original?.purchase_order_item?.item_detail?.name ||
                       row.original?.item_detail?.name;

      if (itemName) return itemName;

      // Fallback to showing purchase_order_item ID if no name found
      const itemId = row.original?.purchase_order_item;
      return itemId ? `Item ID: ${itemId}` : 'N/A';
    },
  },
  {
    header: "Unit of Measurement",
    cell: ({ row }) => {
      return row.original?.purchase_order_item_detail?.item_detail?.uom ||
             row.original?.purchase_order_item?.item_detail?.uom ||
             row.original?.item_detail?.uom ||
             "Not specified";
    },
  },
  {
    header: "Quantity Ordered",
    cell: ({ row }) => row.original?.purchase_order_item_detail?.quantity || 0,
  },
  {
    header: "Quantity Received",
    cell: ({ row }) => {
      const received = row.original?.received_quantity || 0;
      const ordered = row.original?.purchase_order_item_detail?.quantity || 0;
      const isComplete = received === ordered;
      return (
        <span className={isComplete ? "text-green-600 font-semibold" : "text-orange-600 font-semibold"}>
          {received} {isComplete ? "✓" : ""}
        </span>
      );
    },
  },
  {
    header: "Unit Price",
    cell: ({ row }) => {
      const price = parseFloat(row.original?.purchase_order_item_detail?.unit_price || "0");
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
      }).format(price);
    },
  },
  {
    header: "Total Price",
    cell: ({ row }) => {
      const price = parseFloat(row.original?.purchase_order_item_detail?.total_price || "0");
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
      }).format(price);
    },
  },
  {
    header: "FCO Number",
    cell: ({ row }) => {
      // Access the expanded fco_number_detail object
      const fcoDetail = row.original?.purchase_order_item_detail?.fco_number_detail;
      if (fcoDetail) {
        // Display FCO name (or code as fallback)
        return fcoDetail.name || fcoDetail.code || "Not specified";
      }
      return "Not specified";
    },
  },
  {
    header: "Remarks",
    cell: ({ row }) => row.original?.remark || "—",
  },
];

export default function GoodReceiveNoteDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);

  const { data } = useGetSingleGoodReceiveNoteQuery(id as string || "", !!id);
  const { downloadGoodReceiveNote } = useDownloadGoodReceiveNote(id as string || "");

  // Get purchase order details to fetch items
  const purchaseOrderId = data?.data?.purchase_order?.id;
  const { data: purchaseOrderData } = useGetSinglePurchaseOrder(
    purchaseOrderId || "",
    !!purchaseOrderId
  );

  // Get purchase request details to fetch PR Officer
  const purchaseRequestId = purchaseOrderData?.data?.purchase_request;
  const { data: purchaseRequestData } = useGetPurchaseRequest(
    purchaseRequestId || "",
    !!purchaseRequestId
  );

  // Fetch user details for GRN officers (since backend doesn't return expanded details)
  const createdById = data?.data?.created_by;
  const acceptedById = data?.data?.accepted_by; // Backend uses "accepted_by" not "approved_by"
  const receivedById = data?.data?.received_by;

  const { data: createdByUser } = useGetSingleUser(createdById || "", !!createdById);
  const { data: acceptedByUser } = useGetSingleUser(acceptedById || "", !!acceptedById);
  const { data: receivedByUser } = useGetSingleUser(receivedById || "", !!receivedById);

  // Fetch destination store details (Phase 3)
  const destinationStoreId = data?.data?.destination_store;
  const { data: destinationStoreData } = useGetSingleStore(
    destinationStoreId || "",
    !!destinationStoreId
  );

  // Fetch store inventory to verify items are recorded
  const { data: storeInventoryData } = useGetStoreInventory(
    destinationStoreId || "",
    !!destinationStoreId && !!data?.data?.grn_items
  );

  const details = useMemo(() => {
    if (!data) return {};

    const grnData = data?.data;
    const purchaseOrder = grnData?.purchase_order;
    const poData = purchaseOrderData?.data;
    const prData = purchaseRequestData?.data;

    console.log("🔍 GRN Data:", grnData);
    console.log("🔍 GRN created_by:", grnData?.created_by);
    console.log("🔍 GRN accepted_by (not approved_by):", grnData?.accepted_by);
    console.log("🔍 GRN accepted_datetime:", grnData?.accepted_datetime);
    console.log("🔍 GRN received_by:", grnData?.received_by);
    console.log("🔍 Fetched createdByUser:", createdByUser?.data);
    console.log("🔍 Fetched acceptedByUser:", acceptedByUser?.data);
    console.log("🔍 Fetched receivedByUser:", receivedByUser?.data);
    console.log("🔍 Purchase Order from GRN:", purchaseOrder);
    console.log("🔍 Full PO Data:", poData);
    console.log("🔍 PO Items:", poData?.purchase_order_items);
    console.log("🔍 PR Data:", prData);
    console.log("🔍 PR Officer (requested_by_detail):", prData?.requested_by_detail);
    console.log("🔍 PO Items Structure (first item):", poData?.purchase_order_items?.[0]);
    console.log("🔍 Item Detail Path:", poData?.purchase_order_items?.[0]?.item_detail);
    console.log("🔍 FCO Detail Path:", poData?.purchase_order_items?.[0]?.fco_number_detail);

    return {
      // GRN specific fields
      grn_number: grnData?.grn_number,
      invoice_number: grnData?.invoice_number,
      waybill_number: grnData?.waybill_number,
      remark: grnData?.remark,
      created_datetime: grnData?.created_datetime,
      delivery_date: grnData?.delivery_date,

      // Purchase Order fields
      purchase_order_number: purchaseOrder?.purchase_order_number,
      request_dept: purchaseOrder?.request_dept || poData?.request_dept,

      // Purchase Request Officer (the person assigned to handle the PR)
      // Use requested_by_detail which has the name directly
      pr_officer: prData?.requested_by_detail?.name || null,
      pr_officer_detail: prData?.requested_by_detail,

      // Vendor details from full PO data
      vendor_name: poData?.vendor_detail?.company_name || purchaseOrder?.vendor_name,
      vendor_email: poData?.vendor_detail?.email,
      vendor_registration: poData?.vendor_detail?.company_registration_number,
      vendor_business_type: poData?.vendor_detail?.type_of_business,

      // Destination Store (Phase 3)
      destination_store_id: destinationStoreId,
      destination_store_name: destinationStoreData?.data?.name,
      destination_store_code: destinationStoreData?.data?.code,
      destination_store_type: destinationStoreData?.data?.store_type,
      destination_store_location: destinationStoreData?.data?.location?.name,
      destination_store_keeper: destinationStoreData?.data?.store_keeper
        ? `${destinationStoreData.data.store_keeper.first_name || ''} ${destinationStoreData.data.store_keeper.last_name || ''}`.trim() || 'N/A'
        : null,

      // Items from full PO data
      purchase_order_items: poData?.purchase_order_items || [],

      // GRN Items - what was actually received
      grn_items: grnData?.grn_items || [],

      // Approval/Signature fields with user details
      // Use fetched user data since backend doesn't return expanded details
      created_by: grnData?.created_by,
      created_by_detail: createdByUser?.data
        ? {
            name: `${createdByUser.data.first_name || ''} ${createdByUser.data.last_name || ''}`.trim() || 'N/A',
            email: createdByUser.data.email,
            user_id: createdByUser.data.id,
          }
        : null,
      // Backend uses "accepted_by" not "approved_by"
      approved_by: grnData?.accepted_by,
      approved_by_detail: acceptedByUser?.data
        ? {
            name: `${acceptedByUser.data.first_name || ''} ${acceptedByUser.data.last_name || ''}`.trim() || 'N/A',
            email: acceptedByUser.data.email,
            user_id: acceptedByUser.data.id,
          }
        : null,
      rejected_by: grnData?.rejected_by,
      rejected_by_detail: null, // Not implemented yet
      received_by: grnData?.received_by,
      received_by_detail: receivedByUser?.data
        ? {
            name: `${receivedByUser.data.first_name || ''} ${receivedByUser.data.last_name || ''}`.trim() || 'N/A',
            email: receivedByUser.data.email,
            user_id: receivedByUser.data.id,
          }
        : null,
      // Backend uses "accepted_datetime" not "approved_datetime"
      approved_datetime: grnData?.accepted_datetime,
      rejected_datetime: grnData?.rejected_datetime,
      received_datetime: grnData?.received_datetime,

      // Purchase Order approval fields from full PO data
      authorized_datetime: poData?.authorized_datetime || purchaseOrder?.authorized_datetime,
      purchase_date: poData?.purchase_date,
      status_level: poData?.status_level,

      // Status from GRN
      status: grnData?.status,
    };
  }, [data, purchaseOrderData, purchaseRequestData, createdByUser, acceptedByUser, receivedByUser, destinationStoreData, storeInventoryData]);

  const handleDownload = async (format: 'text' | 'pdf' = 'text') => {
    if (!id) return;

    setDownloading(true);
    try {
      await downloadGoodReceiveNote(format);
    } catch (error) {
      console.error('Download failed:', error);
      // Show error toast if PDF format fails (not implemented on backend)
      if (format === 'pdf') {
        alert('PDF download is not yet implemented. Downloaded as text file instead.');
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className='bg-white p-6 max-w-6xl mx-auto'>
      {/* Back Button */}
      <div className='mb-4'>
        <Button
          variant='outline'
          onClick={() => router.back()}
          className='flex items-center gap-2'
        >
          <ArrowLeft size={16} />
          Back
        </Button>
      </div>

      {/* Compact Header Section */}
      <div className='flex justify-center items-center flex-col mb-6 pb-4 border-b border-gray-200'>
        <div className='mb-3'>
          <img
            src="/imgs/logo.png"
            alt='AHNI Logo'
            className='w-32 h-auto object-contain mx-auto'
          />
        </div>
        <div className='text-center'>
          <h1 className='text-xl font-semibold text-gray-800 mb-1'>
            Achieving Health Nigeria Initiative (AHNI)
          </h1>
          <p className='text-gray-500 text-xs'>
            Healthcare Excellence Through Innovation
          </p>
        </div>
      </div>
      {/* Main Content */}
      <div className='mt-4'>
        <Card className='bg-gray-50 border border-gray-200'>
          <div className='text-center mb-4'>
            <h3 className='text-gray-800 text-lg font-semibold'>
              Goods Receive Note
            </h3>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-3'>
              <div className='flex justify-between items-center py-2 border-b border-gray-200'>
                <span className='text-sm font-medium text-gray-600'>GRN Number:</span>
                <span className='text-sm font-semibold text-gray-800'>{details?.grn_number || 'N/A'}</span>
              </div>

              <div className='flex justify-between items-center py-2 border-b border-gray-200'>
                <span className='text-sm font-medium text-gray-600'>Created Date:</span>
                <span className='text-sm font-semibold text-gray-800'>
                  {details?.created_datetime ? new Date(details.created_datetime).toLocaleDateString("en-US") : 'N/A'}
                </span>
              </div>

              <div className='flex justify-between items-center py-2 border-b border-gray-200'>
                <span className='text-sm font-medium text-gray-600'>Delivery Date:</span>
                <span className='text-sm font-semibold text-gray-800'>
                  {details?.delivery_date ? new Date(details.delivery_date).toLocaleDateString("en-US") : 'N/A'}
                </span>
              </div>

              <div className='flex justify-between items-center py-2 border-b border-gray-200'>
                <span className='text-sm font-medium text-gray-600'>Invoice Number:</span>
                <span className='text-sm font-semibold text-gray-800'>{details?.invoice_number || 'N/A'}</span>
              </div>

              <div className='flex justify-between items-center py-2 border-b border-gray-200'>
                <span className='text-sm font-medium text-gray-600'>Waybill Number:</span>
                <span className='text-sm font-semibold text-gray-800'>{details?.waybill_number || 'N/A'}</span>
              </div>
            </div>

            <div className='space-y-3'>
              <div className='flex justify-between items-center py-2 border-b border-gray-200'>
                <span className='text-sm font-medium text-gray-600'>PO Number:</span>
                <span className='text-sm font-semibold text-gray-800'>{details?.purchase_order_number || 'N/A'}</span>
              </div>

              <div className='flex justify-between items-center py-2 border-b border-gray-200'>
                <span className='text-sm font-medium text-gray-600'>Purchase Date:</span>
                <span className='text-sm font-semibold text-gray-800'>
                  {details?.purchase_date ? new Date(details.purchase_date).toLocaleDateString("en-US") : 'N/A'}
                </span>
              </div>

              <div className='flex justify-between items-center py-2 border-b border-gray-200'>
                <span className='text-sm font-medium text-gray-600'>PO Status:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  details?.status_level === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  details?.status_level === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  details?.status_level === 'REJECTED' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {details?.status_level || 'N/A'}
                </span>
              </div>

              <div className='flex justify-between items-center py-2 border-b border-gray-200'>
                <span className='text-sm font-medium text-gray-600'>GRN Status:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  details?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  details?.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  details?.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  details?.status === 'received' ? 'bg-blue-100 text-blue-800' :
                  details?.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {details?.status?.toUpperCase() || 'N/A'}
                </span>
              </div>

              {details?.remark && (
                <div className='flex justify-between items-center py-2 border-b border-gray-200'>
                  <span className='text-sm font-medium text-gray-600'>Remarks:</span>
                  <span className='text-sm font-semibold text-gray-800'>{details.remark}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      {/* Vendor Section */}
      <div className='bg-gray-100 border border-gray-300 rounded p-4 my-4'>
        <div className='flex justify-between items-center mb-3'>
          <h3 className='font-semibold text-gray-800'>Vendor Information</h3>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 text-sm'>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Vendor Name:</span>
            <span className='font-medium text-gray-800'>{details?.vendor_name || 'N/A'}</span>
          </div>
          {details?.vendor_email && (
            <div className='flex justify-between'>
              <span className='text-gray-600'>Email:</span>
              <span className='font-medium text-gray-800'>{details.vendor_email}</span>
            </div>
          )}
          {details?.vendor_registration && (
            <div className='flex justify-between'>
              <span className='text-gray-600'>Registration:</span>
              <span className='font-medium text-gray-800'>{details.vendor_registration}</span>
            </div>
          )}
          {details?.vendor_business_type && (
            <div className='flex justify-between'>
              <span className='text-gray-600'>Business Type:</span>
              <span className='font-medium text-gray-800'>{details.vendor_business_type}</span>
            </div>
          )}
        </div>
      </div>

      {/* Destination Store Section - Phase 3 */}
      {details?.destination_store_name && (
        <div className='bg-green-50 border border-green-300 rounded p-4 my-4'>
          <div className='flex justify-between items-center mb-3'>
            <h3 className='font-semibold text-green-900'>📦 Destination Store</h3>
            <span className={`px-3 py-1 rounded text-xs font-medium ${
              details?.destination_store_type === 'CENTRAL'
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white'
            }`}>
              {details?.destination_store_type === 'CENTRAL' ? 'Central Store' : 'Location Store'}
            </span>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 text-sm'>
            <div className='flex justify-between'>
              <span className='text-green-700'>Store Name:</span>
              <span className='font-semibold text-green-900'>{details.destination_store_name}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-green-700'>Store Code:</span>
              <span className='font-semibold text-green-900'>{details.destination_store_code || 'N/A'}</span>
            </div>
            {details?.destination_store_location && (
              <div className='flex justify-between'>
                <span className='text-green-700'>Location:</span>
                <span className='font-semibold text-green-900'>{details.destination_store_location}</span>
              </div>
            )}
            {details?.destination_store_keeper && (
              <div className='flex justify-between'>
                <span className='text-green-700'>Store Keeper:</span>
                <span className='font-semibold text-green-900'>{details.destination_store_keeper}</span>
              </div>
            )}
          </div>
          <div className='mt-3 pt-3 border-t border-green-200'>
            <p className='text-xs text-green-700'>
              <span className='font-medium'>Note:</span> Goods received via this GRN will be stocked in this store location.
            </p>
          </div>
        </div>
      )}

      {/* GRN Items Table - What was actually received */}
      <div className='my-4'>
        <h3 className='font-semibold text-gray-800 mb-3'>Items Received via this GRN</h3>
        <div className='border border-gray-200 rounded overflow-hidden'>
          <DataTable
            columns={grnItemsTableColumns}
            data={details?.grn_items || []}
            headClass='bg-gray-50 font-medium text-sm'
          />
        </div>
      </div>

      {/* Store Stock Verification Section */}
      {destinationStoreId && storeInventoryData && details?.grn_items && details.grn_items.length > 0 && (
        <div className='my-4 bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <h3 className='font-semibold text-blue-900 mb-3'>📋 Store Stock Verification</h3>
          <p className='text-sm text-blue-700 mb-4'>
            Verify that the received items have been recorded in <strong>{details?.destination_store_name}</strong> inventory.
          </p>

          <div className='space-y-3'>
            {details.grn_items.map((grnItem: any, index: number) => {
              const itemId = grnItem?.purchase_order_item_detail?.item_detail?.id;
              const itemName = grnItem?.purchase_order_item_detail?.item_detail?.name || `Item ${index + 1}`;
              const receivedQty = grnItem?.received_quantity || 0;

              // Find this item in the store inventory
              const storeStock = storeInventoryData?.data?.results?.find(
                (stock: any) => stock.item === itemId || stock.item?.id === itemId
              );

              const isRecorded = !!storeStock;
              const currentStock = storeStock?.current_stock || 0;

              return (
                <div key={index} className='bg-white border border-blue-300 rounded p-3 flex justify-between items-center'>
                  <div className='flex-1'>
                    <h4 className='font-semibold text-gray-800'>{itemName}</h4>
                    <p className='text-sm text-gray-600'>
                      Received Quantity: <span className='font-medium'>{receivedQty}</span>
                    </p>
                  </div>
                  <div className='text-right'>
                    {isRecorded ? (
                      <div className='space-y-1'>
                        <span className='px-3 py-1 rounded text-xs bg-green-100 text-green-800 font-medium inline-block'>
                          ✓ Recorded in Store
                        </span>
                        <p className='text-sm text-gray-700'>
                          Current Stock: <span className='font-semibold text-green-700'>{currentStock}</span>
                        </p>
                        {storeStock && (
                          <Link
                            href={`/dashboard/admin/inventory-management/stores/${destinationStoreId}`}
                            className='text-xs text-blue-600 hover:underline block'
                          >
                            View in Store →
                          </Link>
                        )}
                      </div>
                    ) : (
                      <div>
                        <span className='px-3 py-1 rounded text-xs bg-yellow-100 text-yellow-800 font-medium inline-block'>
                          ⚠ Not Found in Store
                        </span>
                        <p className='text-xs text-gray-600 mt-1'>
                          Item may not be stocked yet
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className='mt-4 pt-3 border-t border-blue-200'>
            <Link
              href={`/dashboard/admin/inventory-management/stores/${destinationStoreId}`}
              className='text-sm text-blue-700 hover:text-blue-900 font-medium hover:underline'
            >
              View Full Store Inventory →
            </Link>
          </div>
        </div>
      )}

      {/* Approval Flow Section */}
      <div className='my-6'>
        <h3 className='font-semibold text-gray-800 mb-4'>GRN Approval Flow</h3>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {/* PR Officer - The person who requested/handled the Purchase Request */}
          <Card className='bg-blue-50 border border-blue-200 p-4'>
            <h4 className='font-medium text-blue-900 text-sm mb-3'>PR Officer</h4>
            <div className='space-y-2 text-xs'>
              <div className='flex flex-col'>
                <span className='text-blue-600 mb-1'>Name:</span>
                <span className='font-semibold text-blue-900 text-sm'>
                  {details?.pr_officer || 'Not Available'}
                </span>
              </div>
              {details?.pr_officer_detail?.user_id && (
                <div className='flex flex-col'>
                  <span className='text-blue-600 mb-1'>User ID:</span>
                  <span className='font-medium text-blue-800 text-xs'>
                    {details.pr_officer_detail.user_id}
                  </span>
                </div>
              )}
              <div className='flex justify-between mt-2 pt-2 border-t border-blue-200'>
                <span className='text-blue-600'>Status:</span>
                <span className='px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800 font-medium'>
                  ✓ Initiated
                </span>
              </div>
            </div>
          </Card>

          {/* Created By - Who created the GRN */}
          <Card className='bg-white border border-gray-300 p-4'>
            <h4 className='font-medium text-gray-800 text-sm mb-3'>Created By</h4>
            <div className='space-y-2 text-xs'>
              <div className='flex flex-col'>
                <span className='text-gray-600 mb-1'>Officer:</span>
                <span className='font-semibold text-gray-900 text-sm'>
                  {details?.created_by_detail?.name || details?.created_by || 'N/A'}
                </span>
              </div>
              {details?.created_datetime && (
                <div className='flex flex-col'>
                  <span className='text-gray-600 mb-1'>Date:</span>
                  <span className='font-medium text-gray-800'>
                    {new Date(details.created_datetime).toLocaleDateString("en-US", {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
              <div className='flex justify-between mt-2 pt-2 border-t border-gray-200'>
                <span className='text-gray-600'>Status:</span>
                <span className='px-2 py-0.5 rounded text-xs bg-green-100 text-green-800 font-medium'>
                  ✓ Created
                </span>
              </div>
            </div>
          </Card>

          {/* Received By - Who physically received the goods */}
          <Card className='bg-white border border-gray-300 p-4'>
            <h4 className='font-medium text-gray-800 text-sm mb-3'>Received By</h4>
            <div className='space-y-2 text-xs'>
              <div className='flex flex-col'>
                <span className='text-gray-600 mb-1'>Officer:</span>
                <span className='font-semibold text-gray-900 text-sm'>
                  {details?.received_by_detail?.name || details?.received_by || 'Pending'}
                </span>
              </div>
              {details?.received_datetime && (
                <div className='flex flex-col'>
                  <span className='text-gray-600 mb-1'>Date:</span>
                  <span className='font-medium text-gray-800'>
                    {new Date(details.received_datetime).toLocaleDateString("en-US", {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
              <div className='flex justify-between mt-2 pt-2 border-t border-gray-200'>
                <span className='text-gray-600'>Status:</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  details?.received_datetime
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {details?.received_datetime ? '✓ Received' : '⏳ Pending'}
                </span>
              </div>
            </div>
          </Card>

          {/* Accepted/Approved By - Who gave final acceptance of the GRN */}
          <Card className={`border p-4 ${
            details?.approved_by ? 'bg-green-50 border-green-300' :
            details?.rejected_by ? 'bg-red-50 border-red-300' :
            'bg-yellow-50 border-yellow-300'
          }`}>
            <h4 className={`font-medium text-sm mb-3 ${
              details?.approved_by ? 'text-green-900' :
              details?.rejected_by ? 'text-red-900' :
              'text-yellow-900'
            }`}>
              {details?.rejected_by ? 'Rejected By' : 'Accepted By'}
            </h4>
            <div className='space-y-2 text-xs'>
              <div className='flex flex-col'>
                <span className={
                  details?.approved_by ? 'text-green-700' :
                  details?.rejected_by ? 'text-red-700' :
                  'text-yellow-700'
                }>Officer:</span>
                <span className={`font-semibold text-sm ${
                  details?.approved_by ? 'text-green-900' :
                  details?.rejected_by ? 'text-red-900' :
                  'text-yellow-900'
                }`}>
                  {details?.approved_by_detail?.name ||
                   details?.rejected_by_detail?.name ||
                   details?.approved_by ||
                   details?.rejected_by ||
                   'Pending'}
                </span>
              </div>
              {(details?.approved_datetime || details?.rejected_datetime) && (
                <div className='flex flex-col'>
                  <span className={
                    details?.approved_by ? 'text-green-700' :
                    details?.rejected_by ? 'text-red-700' :
                    'text-yellow-700'
                  }>Date:</span>
                  <span className={`font-medium ${
                    details?.approved_by ? 'text-green-800' :
                    details?.rejected_by ? 'text-red-800' :
                    'text-yellow-800'
                  }`}>
                    {new Date(
                      details?.approved_datetime || details?.rejected_datetime
                    ).toLocaleDateString("en-US", {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
              <div className={`flex justify-center mt-2 pt-2 border-t ${
                details?.approved_by ? 'border-green-200' :
                details?.rejected_by ? 'border-red-200' :
                'border-yellow-200'
              }`}>
                <span className={`px-2 py-1 rounded text-sm font-semibold ${
                  details?.approved_by ? 'bg-green-100 text-green-800' :
                  details?.rejected_by ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {details?.approved_by ? '✓ Accepted' :
                   details?.rejected_by ? '✗ Rejected' :
                   '⏳ Pending'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex justify-end gap-2 mt-6'>
        <Link href={"file"} target='_blank' title={"Specification Document"}>
          <Button
            variant='outline'
            className='flex items-center gap-2 text-sm'
          >
            <FileText size={16} />
            Specification Document
          </Button>
        </Link>

        <Button
          variant='default'
          className='flex items-center gap-2 text-sm'
          onClick={() => handleDownload('text')}
          disabled={downloading}
        >
          <FileText size={16} />
          {downloading ? 'Downloading...' : 'Download GRN'}
        </Button>
      </div>
    </div>
  );
}
