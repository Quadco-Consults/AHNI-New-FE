"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetVendorFuelPurchases } from "@/features/admin/controllers/fuelConsumptionController";
import { useGetVendor } from "@/features/procurement/controllers/vendorsController";
import FuelTrackerTable from "./FuelTrackerTable";
import { Loading } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { formatNumberCurrency } from "@/utils/utls";

export default function VendorFuelTrackerExample() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params?.id as string;


  const { data: vendorPurchases, isLoading: purchasesLoading, error: purchasesError, isError: purchasesIsError } = useGetVendorFuelPurchases(
    vendorId,
    {
      page: 1,
      size: 1000,
    }
  );


  const { data: vendorDetails, isLoading: vendorLoading, error: vendorError, isError: vendorIsError } = useGetVendor(
    vendorId,
    !!vendorId
  );

  const isLoading = purchasesLoading || vendorLoading;
  const error = purchasesError || vendorError;
  const isError = purchasesIsError || vendorIsError;

  // Debug fuel purchases data structure
  console.log("🔍 FUEL PURCHASES DEBUG:", {
    vendorId,
    purchasesData: vendorPurchases,
    purchasesResults: vendorPurchases?.data?.results,
    firstRecord: vendorPurchases?.data?.results?.[0],
    firstRecordKeys: vendorPurchases?.data?.results?.[0] ? Object.keys(vendorPurchases.data.results[0]) : null,
    assetType: typeof vendorPurchases?.data?.results?.[0]?.asset,
    assetValue: vendorPurchases?.data?.results?.[0]?.asset,
    driverType: typeof vendorPurchases?.data?.results?.[0]?.assigned_driver,
    driverValue: vendorPurchases?.data?.results?.[0]?.assigned_driver
  });


  // Check if vendor was not found
  const vendorNotFound = vendorIsError && (
    vendorError?.message?.includes("404") ||
    (vendorError as any)?.response?.status === 404 ||
    (vendorError as any)?.status === 404
  );

  // Always show something, even if loading
  if (isLoading) {
    return (
      <div className="p-6">
        <h1>Loading vendor fuel data...</h1>
        <Loading />
      </div>
    );
  }

  if (vendorNotFound) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-medium text-yellow-800">Vendor Not Found</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>The vendor with ID <code className="bg-yellow-100 px-2 py-1 rounded font-mono text-xs">{vendorId}</code> was not found in the system.</p>
                <p className="mt-2">This could mean:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>The vendor ID is incorrect</li>
                  <li>The vendor has been removed from the system</li>
                  <li>This is a hardcoded ID from development/testing</li>
                </ul>
              </div>
              <div className="mt-4 flex gap-3">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Go Back
                </Button>
                <Button
                  onClick={() => router.push('/dashboard/admin/fleet-management/fuel-request')}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  View All Fuel Requests
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-red-800 font-semibold">Error Loading Data</h3>
        <p className="text-red-600 text-sm mt-1">
          {error?.message || "Failed to load vendor information or fuel purchases"}
        </p>
      </div>
    );
  }

  if (!vendorId) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h3 className="text-yellow-800 font-semibold">Missing Vendor ID</h3>
        <p className="text-yellow-600 text-sm mt-1">
          Please provide a valid vendor ID to load fuel purchases.
        </p>
      </div>
    );
  }

  // Extract vendor details
  const vendor = vendorDetails?.data;
  const vendorName = vendor?.company_name || "Unknown Vendor";
  const location = vendor?.state || vendor?.company_address?.split(",").pop()?.trim() || "Unknown Location";
  const projectTitle = "AHNI HQ for Fuel Consumption Tracker for Project Vehicles";

  // Handle case where vendor exists but has no fuel purchases
  const fuelPurchases = vendorPurchases?.data?.results || [];
  const hasNoPurchases = !purchasesLoading && !purchasesIsError && fuelPurchases.length === 0;

  // Calculate totals
  const totalQuantity = fuelPurchases.reduce((sum, record) => sum + (record.quantity || 0), 0);
  const totalAmount = fuelPurchases.reduce((sum, record) => sum + (parseFloat(record.amount) || 0), 0);

  const generateVendorPDF = () => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      toast.error("Please allow popups to generate PDF");
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Fuel Tracker - ${vendorName}</title>
          <meta charset="UTF-8">
          <style>
            @page { size: A4 landscape; margin: 15mm; }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              color: #1F2937;
              background: white;
            }
            .page-wrapper { padding: 15px; }
            .header {
              background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%);
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              margin-bottom: 20px;
            }
            .header-content {
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .logo-section {
              background: white;
              padding: 8px;
              border-radius: 8px;
            }
            .logo { width: 70px; height: auto; }
            .company-info {
              flex: 1;
              text-align: center;
              padding: 0 15px;
            }
            .company-name {
              font-size: 20px;
              font-weight: 700;
              color: white;
              letter-spacing: 1.5px;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            .company-tagline {
              font-size: 10px;
              color: #FEE2E2;
              margin-top: 3px;
            }
            .vendor-badge {
              background: white;
              padding: 10px 15px;
              border-radius: 20px;
              font-weight: 700;
              font-size: 12px;
              color: #DC2626;
            }
            .document-title {
              text-align: center;
              font-size: 16px;
              font-weight: 700;
              margin: 15px 0;
              padding: 10px;
              background: linear-gradient(to right, #FEE2E2, #FECACA, #FEE2E2);
              color: #991B1B;
              border-radius: 6px;
              text-transform: uppercase;
              letter-spacing: 1.5px;
            }
            .info-bar {
              display: flex;
              justify-content: space-between;
              padding: 12px 15px;
              background: #F0F9FF;
              border: 1px solid #BFDBFE;
              border-radius: 6px;
              margin-bottom: 15px;
            }
            .info-item {
              text-align: center;
            }
            .info-label {
              font-size: 10px;
              color: #6B7280;
              text-transform: uppercase;
              font-weight: 600;
            }
            .info-value {
              font-size: 14px;
              font-weight: 700;
              color: #1F2937;
              margin-top: 3px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            thead {
              background: linear-gradient(135deg, #DC2626, #B91C1C);
              color: white;
            }
            th {
              padding: 10px 6px;
              text-align: center;
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            tbody tr {
              border-bottom: 1px solid #E5E7EB;
            }
            tbody tr:nth-child(even) {
              background: #F9FAFB;
            }
            tbody tr:hover {
              background: #FEE2E2;
            }
            td {
              padding: 8px 6px;
              text-align: center;
              font-size: 11px;
              color: #374151;
            }
            .totals-row {
              background: linear-gradient(to right, #FEF3C7, #FDE68A) !important;
              font-weight: 700;
              font-size: 12px;
              color: #92400E;
            }
            .totals-row td {
              border-top: 2px solid #F59E0B;
              padding: 12px 6px;
            }
            .footer {
              margin-top: 20px;
              padding: 15px;
              background: linear-gradient(to right, #FEE2E2, #FECACA, #FEE2E2);
              border-top: 3px solid #DC2626;
              border-radius: 6px;
              text-align: center;
            }
            .footer-text {
              font-size: 10px;
              color: #991B1B;
              font-weight: 600;
              margin: 3px 0;
            }
            .print-date {
              text-align: center;
              font-size: 9px;
              color: #9CA3AF;
              margin-top: 10px;
              padding: 6px;
              background: #F9FAFB;
              border-radius: 4px;
            }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="page-wrapper">
            <div class="header">
              <div class="header-content">
                <div class="logo-section">
                  <img src="/imgs/logo.png" alt="AHNI Logo" class="logo" />
                </div>
                <div class="company-info">
                  <h1 class="company-name">ACHIEVING HEALTH NIGERIA INITIATIVE</h1>
                  <p class="company-tagline">(AHNI) - Excellence in Healthcare Delivery</p>
                </div>
                <div class="vendor-badge">Vendor Report</div>
              </div>
            </div>

            <h2 class="document-title">Fuel Consumption Tracker - ${location}</h2>

            <div class="info-bar">
              <div class="info-item">
                <div class="info-label">Vendor</div>
                <div class="info-value">${vendorName}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Total Records</div>
                <div class="info-value">${fuelPurchases.length}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Total Quantity</div>
                <div class="info-value">${totalQuantity.toLocaleString()} L</div>
              </div>
              <div class="info-item">
                <div class="info-label">Total Amount</div>
                <div class="info-value">${formatNumberCurrency(totalAmount, 'NGN')}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Generated</div>
                <div class="info-value">${format(new Date(), 'dd-MMM-yyyy')}</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>S/No</th>
                  <th>Date</th>
                  <th>Vehicle No.</th>
                  <th>Driver</th>
                  <th>Coupon No.</th>
                  <th>Last Odo (KM)</th>
                  <th>Current Odo (KM)</th>
                  <th>Qty (L)</th>
                  <th>Price/L (₦)</th>
                  <th>Amount (₦)</th>
                </tr>
              </thead>
              <tbody>
                ${fuelPurchases.length > 0 ? fuelPurchases.map((record, index) => {
                  const previousOdo = record.odometer - (record.distance_covered || 0);
                  return `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${format(new Date(record.date), 'dd/MM/yyyy')}</td>
                      <td>${typeof record.asset === 'string' ? record.asset : (record.asset?.plate_number || record.asset?.name || 'N/A')}</td>
                      <td>${typeof record.assigned_driver === 'string' ? record.assigned_driver : (record.assigned_driver?.first_name && record.assigned_driver?.last_name ?
                        `${record.assigned_driver.first_name} ${record.assigned_driver.last_name}` :
                        record.assigned_driver?.full_name || 'N/A')}</td>
                      <td>${record.fuel_coupon || 'N/A'}</td>
                      <td>${previousOdo > 0 ? previousOdo.toLocaleString() : 'N/A'}</td>
                      <td>${record.odometer?.toLocaleString() || 'N/A'}</td>
                      <td>${record.quantity || 0}</td>
                      <td>${parseFloat(record.price_per_litre || 0).toLocaleString()}</td>
                      <td>${parseFloat(record.amount || 0).toLocaleString()}</td>
                    </tr>
                  `;
                }).join('') : '<tr><td colspan="10" style="padding: 20px; text-align: center; color: #9CA3AF;">No fuel records found</td></tr>'}
                ${fuelPurchases.length > 0 ? `
                  <tr class="totals-row">
                    <td colspan="7" style="text-align: right; padding-right: 15px;">TOTAL:</td>
                    <td>${totalQuantity.toLocaleString()}</td>
                    <td></td>
                    <td>${totalAmount.toLocaleString()}</td>
                  </tr>
                ` : ''}
              </tbody>
            </table>

            <div class="footer">
              <p class="footer-text" style="font-size: 12px; font-weight: 700;">Achieving Health Nigeria Initiative (AHNI)</p>
              <p class="footer-text">Fleet Management System - Vendor Fuel Consumption Report</p>
              <p class="footer-text" style="font-style: italic;">This is a computer-generated document and does not require a signature.</p>
            </div>

            <div class="print-date">
              <strong>Generated on:</strong> ${format(new Date(), 'dd-MMM-yyyy HH:mm:ss')}
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 100);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  if (hasNoPurchases && vendor) {
    return (
      <div className="p-6">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <h3 className="text-blue-800 font-semibold">No Fuel Requests Found</h3>
          <p className="text-blue-600 text-sm mt-1">
            <strong>{vendorName}</strong> is a registered vendor, but AHNI has not made any fuel requests to this vendor yet.
          </p>
          <p className="text-blue-600 text-sm mt-2">
            Location: {location}
          </p>
        </div>

        <FuelTrackerTable
          data={[]}
          vendorName={vendorName}
          location={location}
          projectTitle={projectTitle}
          isLoading={false}
        />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Header */}
      <div className="mb-6">
        <Button
          onClick={() => router.back()}
          variant="outline"
          size="sm"
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Button>

        <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-600 rounded-md p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-red-600 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-red-900 font-bold text-lg">Fuel Request History</h3>
              <p className="text-red-700 text-sm mt-1">
                Complete fuel consumption records for <strong>{vendorName}</strong>
              </p>
              <div className="mt-2 flex items-center gap-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-600 text-white">
                  {fuelPurchases.length} Total Records
                </span>
                <span className="text-xs text-red-600">
                  Location: {location}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Generation Buttons */}
      {fuelPurchases.length > 0 && (
        <div className='flex gap-3 mb-6'>
          <Button
            onClick={generateVendorPDF}
            className='bg-red-600 hover:bg-red-700 text-white flex items-center gap-2'
          >
            <FileText size={18} />
            Generate PDF Report
          </Button>
          <Button
            onClick={generateVendorPDF}
            variant='outline'
            className='border-red-600 text-red-600 hover:bg-red-50 flex items-center gap-2'
          >
            <Download size={18} />
            Download & Print
          </Button>
        </div>
      )}

      {/* Main Table */}
      <FuelTrackerTable
        data={fuelPurchases}
        vendorName={vendorName}
        location={location}
        projectTitle={projectTitle}
        isLoading={isLoading}
      />

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Achieving Health Nigeria Initiative (AHNI) - Fleet Management System</p>
        <p className="mt-1">Generated on {format(new Date(), "MMMM dd, yyyy 'at' hh:mm a")}</p>
      </div>
    </div>
  );
}
