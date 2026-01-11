"use client";

import { useParams } from "next/navigation";
import { useGetSingleAssetMaintenanceQuery } from "@/features/admin/controllers/assetMaintenanceController";
import { LoadingSpinner } from "@/components/Loading";
import logoPng from "assets/imgs/logo.png";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { PrinterIcon, DownloadIcon, ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MaintenanceTicket() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data, isLoading } = useGetSingleAssetMaintenanceQuery(id || "", !!id);

  // The API returns created_by as an object, not just an ID
  // So we don't need to fetch the user separately

  // Format currency
  const formatCurrency = (amount: string | number) => {
    if (!amount) return "₦0.00";
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(num);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Trigger print which allows user to save as PDF
    window.print();
  };

  if (isLoading) {
    return (
      <div className='bg-white p-8 flex justify-center items-center min-h-screen'>
        <LoadingSpinner />
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className='bg-white p-8 flex justify-center items-center min-h-screen'>
        <div className="text-red-500">Error loading asset maintenance data</div>
      </div>
    );
  }

  const maintenance = data.data;

  // Get creator info from the created_by object (API returns it as an object)
  const creator = (maintenance.created_by as any);

  return (
    <div className='bg-white p-6 max-w-7xl mx-auto print:p-0 print:max-w-full'>
      {/* Action Buttons - Hidden on Print */}
      <div className='mb-6 flex items-center justify-between print:hidden'>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </Button>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <PrinterIcon className="w-4 h-4" />
            Print
          </Button>
          <Button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
          >
            <DownloadIcon className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Maintenance Ticket Document */}
      <div className='bg-white border-2 border-black rounded-lg overflow-hidden print:border print:rounded-none'>
        {/* Logo Header */}
        <div className='border-b-2 border-black p-6 bg-white flex items-center justify-between print:p-4'>
          <img src={(logoPng as any).src || logoPng} alt='logo' width={140} className='print:w-32' />
          <div className='text-right'>
            <h1 className='text-3xl font-bold text-gray-900 print:text-2xl'>ASSET MAINTENANCE TICKET</h1>
            <p className='text-sm text-gray-600 mt-1'>Ref: {maintenance.id.substring(0, 8).toUpperCase()}</p>
          </div>
        </div>

        {/* Ticket Details */}
        <table className='w-full border-collapse text-base print:text-sm'>
          <tbody>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-blue-100 font-semibold w-1/4 print:p-3'>Created Date:</td>
              <td className='p-4 print:p-3'>{format(new Date(maintenance.created_datetime), "dd MMMM yyyy")}</td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-blue-100 font-semibold print:p-3'>Status:</td>
              <td className='p-4 print:p-3'>
                <span className='font-semibold text-green-700'>{maintenance.status}</span>
              </td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-blue-100 font-semibold print:p-3'>Staff Name:</td>
              <td className='p-4 print:p-3'>
                {maintenance.staff_name ||
                 creator?.full_name ||
                 (creator?.first_name && creator?.last_name
                   ? `${creator.first_name} ${creator.last_name}`
                   : "N/A")}
              </td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-blue-100 font-semibold print:p-3'>Department:</td>
              <td className='p-4 print:p-3'>
                {maintenance.department?.name ||
                 creator?.department?.name ||
                 creator?.department ||
                 "N/A"}
              </td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-blue-100 font-semibold print:p-3'>Location:</td>
              <td className='p-4 print:p-3'>
                {maintenance.location?.name ||
                 creator?.location?.name ||
                 creator?.location ||
                 "N/A"}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Asset & Maintenance Information */}
        <div className='bg-orange-200 border-b border-black p-3 print:p-2'>
          <h3 className='font-bold text-base'>ASSET & MAINTENANCE INFORMATION</h3>
        </div>

        <table className='w-full border-collapse text-base print:text-sm'>
          <tbody>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold w-1/4 print:p-3'>Asset Name:</td>
              <td className='p-4 print:p-3'>{maintenance.asset?.name || "N/A"}</td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold print:p-3'>Maintenance Type:</td>
              <td className='p-4 print:p-3'>{maintenance.maintenance_type || "N/A"}</td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold print:p-3'>Description Type:</td>
              <td className='p-4 print:p-3'>{maintenance.description_type || "N/A"}</td>
            </tr>
          </tbody>
        </table>

        {/* Description of Problem */}
        {maintenance.description && (
          <div className='border-b border-black p-4 bg-yellow-50 print:p-3'>
            <p className='font-semibold text-base mb-2'>Description of Problem:</p>
            <p className='text-base leading-relaxed'>{maintenance.description}</p>
          </div>
        )}

        {/* Justification for Disposal */}
        {maintenance.disposal_justification && (
          <div className='border-b border-black p-4 bg-red-50 print:p-3'>
            <p className='font-semibold text-base mb-2'>Justification for Disposal:</p>
            <p className='text-base leading-relaxed'>{maintenance.disposal_justification}</p>
          </div>
        )}

        {/* Cost Breakdown */}
        <div className='bg-green-200 border-b border-black p-3 print:p-2'>
          <h3 className='font-bold text-base'>COST BREAKDOWN</h3>
        </div>

        <table className='w-full border-collapse text-base print:text-sm'>
          <tbody>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold w-1/4 print:p-3'>Rate:</td>
              <td className='p-4 print:p-3'>{maintenance.rate || "N/A"}</td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold print:p-3'>Cost Estimate:</td>
              <td className='p-4 print:p-3'>{formatCurrency(maintenance.cost_estimate)}</td>
            </tr>
          </tbody>
        </table>

        {/* Total Cost */}
        <div className='bg-green-300 border-b-2 border-black'>
          <table className='w-full border-collapse text-lg print:text-base'>
            <tbody>
              <tr>
                <td className='p-5 text-left font-bold print:p-3' style={{width: '70%'}}>TOTAL COST ESTIMATE</td>
                <td className='p-5 text-right font-bold text-xl print:p-3 print:text-lg' style={{width: '30%'}}>
                  {formatCurrency(maintenance.total_cost_estimate)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Approval Trail Section */}
        {maintenance.approvals?.length > 0 && (
          <>
            <div className='bg-blue-100 border-b border-black p-3 print:p-2'>
              <h3 className='font-bold text-base'>APPROVAL TRAIL</h3>
            </div>

            <table className='w-full border-collapse text-sm'>
              <tbody>
                <tr>
                  {maintenance.approvals.map((approval: any, index: number) => (
                    <td
                      key={approval.id}
                      className={`p-6 align-top print:p-4 ${index < maintenance.approvals.length - 1 ? 'border-r border-black' : ''}`}
                      style={{width: `${100 / maintenance.approvals.length}%`}}
                    >
                      <div className='mb-3'>
                        <span className='font-bold text-base'>{approval.approval_level}: {approval.user?.full_name || "N/A"}</span>
                      </div>
                      <div className='mb-3'>
                        <span className='font-bold text-base'>Sign:</span>
                        <div className='h-16 mt-3 border-b border-gray-400'></div>
                      </div>
                      <div>
                        <span className='font-bold text-base'>Date: {format(new Date(approval.created_datetime), "dd/MM/yyyy")}</span>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </>
        )}

        {/* Footer Note */}
        <div className='p-4 bg-gray-100 text-center text-sm print:p-3'>
          <p className='text-gray-700'>
            This is a computer-generated document. Generated on {format(new Date(), "dd MMMM yyyy 'at' HH:mm")}
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          @page {
            size: A4;
            margin: 0.5cm;
          }

          .print\\:hidden {
            display: none !important;
          }

          .print\\:border {
            border-width: 1px !important;
          }

          .print\\:rounded-none {
            border-radius: 0 !important;
          }

          .print\\:p-0 {
            padding: 0 !important;
          }

          .print\\:max-w-full {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
