"use client";

import { useParams } from "next/navigation";
import { useGetSingleTravelExpenseQuery } from "@/features/admin/controllers/travelExpenseController";
import { LoadingSpinner } from "components/Loading";
import logoPng from "assets/imgs/logo.png";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { PrinterIcon, DownloadIcon, ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TERDocument() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data, isLoading } = useGetSingleTravelExpenseQuery(id || "", !!id);

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
        <div className="text-red-500">Error loading travel expense report data</div>
      </div>
    );
  }

  const ter = data.data;

  // Calculate totals
  const calculateTotals = () => {
    const totals = {
      airportTaxi: 0,
      registration: 0,
      interCityTaxi: 0,
      others: 0,
    };

    ter.activities?.forEach((activity: any) => {
      totals.airportTaxi += parseFloat(activity.airport_taxi_fee || 0);
      totals.registration += parseFloat(activity.registration_fee || 0);
      totals.interCityTaxi += parseFloat(activity.inter_city_taxi_fee || 0);
      totals.others += parseFloat(activity.other_expenses || 0);
    });

    return totals;
  };

  const totals = calculateTotals();
  const grandTotal = totals.airportTaxi + totals.registration + totals.interCityTaxi + totals.others;

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
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
          >
            <DownloadIcon className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* TER Document */}
      <div className='bg-white border-2 border-black rounded-lg overflow-hidden print:border print:rounded-none'>
        {/* Logo Header */}
        <div className='border-b-2 border-black p-6 bg-white flex items-center justify-between print:p-4'>
          <img src={(logoPng as any).src || logoPng} alt='logo' width={140} className='print:w-32' />
          <div className='text-right'>
            <h1 className='text-3xl font-bold text-gray-900 print:text-2xl'>TRAVEL EXPENSE REPORT</h1>
            <p className='text-sm text-gray-600 mt-1'>TER ID: {ter.id?.slice(0, 8)}</p>
          </div>
        </div>

        {/* Traveler Information */}
        <div className='bg-indigo-200 border-b border-black p-3 print:p-2'>
          <h3 className='font-bold text-base'>TRAVELER INFORMATION</h3>
        </div>

        <table className='w-full border-collapse text-base print:text-sm'>
          <tbody>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold w-1/4 print:p-3'>Employee Name:</td>
              <td className='p-4 print:p-3'>{ter.user?.fullName || (ter.user as any)?.full_name || "N/A"}</td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold print:p-3'>Staff ID:</td>
              <td className='p-4 print:p-3'>{ter.staff_id || "N/A"}</td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold print:p-3'>Date Submitted:</td>
              <td className='p-4 print:p-3'>{ter.created_datetime ? format(new Date(ter.created_datetime), "dd MMM yyyy") : "N/A"}</td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold print:p-3'>Purpose of Travel:</td>
              <td className='p-4 print:p-3'>{ter.travel_purpose || "N/A"}</td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold print:p-3'>Travel Period:</td>
              <td className='p-4 print:p-3'>
                {ter.start_date && ter.end_date
                  ? `${format(new Date(ter.start_date), "dd MMM yyyy")} - ${format(new Date(ter.end_date), "dd MMM yyyy")}`
                  : "N/A"}
              </td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold print:p-3'>Expense Authorization:</td>
              <td className='p-4 print:p-3'>{ter.expense_authorization?.ta_number || "N/A"}</td>
            </tr>
          </tbody>
        </table>

        {/* Travel Activities & Expenses */}
        <div className='bg-blue-200 border-b border-black p-3 print:p-2'>
          <h3 className='font-bold text-base'>TRAVEL ACTIVITIES & EXPENSES</h3>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full border-collapse text-sm print:text-xs'>
            <thead className='bg-blue-100'>
              <tr>
                <th className='border-r border-b border-black p-3 font-bold text-left print:p-2' style={{width: '3%'}}>Day</th>
                <th className='border-r border-b border-black p-3 font-bold text-left print:p-2' style={{width: '12%'}}>Departure Time/Point</th>
                <th className='border-r border-b border-black p-3 font-bold text-left print:p-2' style={{width: '12%'}}>Arrival Time/Point</th>
                <th className='border-r border-b border-black p-3 font-bold text-left print:p-2' style={{width: '15%'}}>Assignment Location</th>
                <th className='border-r border-b border-black p-3 font-bold text-center print:p-2' style={{width: '8%'}}>Visa Free</th>
                <th className='border-r border-b border-black p-3 font-bold text-right print:p-2' style={{width: '12%'}}>Airport Taxi (₦)</th>
                <th className='border-r border-b border-black p-3 font-bold text-right print:p-2' style={{width: '12%'}}>Registration (₦)</th>
                <th className='border-r border-b border-black p-3 font-bold text-right print:p-2' style={{width: '12%'}}>Inter-City Taxi (₦)</th>
                <th className='border-b border-black p-3 font-bold text-right print:p-2' style={{width: '12%'}}>Others (₦)</th>
              </tr>
            </thead>
            <tbody>
              {ter.activities?.map((activity: any, index: number) => (
                <tr key={activity.id} className='border-b border-black'>
                  <td className='border-r border-black p-3 text-center print:p-2'>{index + 1}</td>
                  <td className='border-r border-black p-3 print:p-2'>
                    {activity.point_of_departure ? (
                      <>
                        <div className='font-medium'>{activity.point_of_departure}</div>
                        {activity.time_of_departure && (
                          <div className='text-xs text-gray-600'>
                            {format(new Date(activity.time_of_departure), "hh:mm a")}
                          </div>
                        )}
                      </>
                    ) : "N/A"}
                  </td>
                  <td className='border-r border-black p-3 print:p-2'>
                    {activity.point_of_arrival ? (
                      <>
                        <div className='font-medium'>{activity.point_of_arrival}</div>
                        {activity.time_of_arrival && (
                          <div className='text-xs text-gray-600'>
                            {format(new Date(activity.time_of_arrival), "hh:mm a")}
                          </div>
                        )}
                      </>
                    ) : "N/A"}
                  </td>
                  <td className='border-r border-black p-3 print:p-2'>{activity.assignment_location || "N/A"}</td>
                  <td className='border-r border-black p-3 text-center print:p-2'>
                    <span className={`font-semibold ${activity.visa_free ? 'text-green-700' : 'text-red-700'}`}>
                      {activity.visa_free ? "YES" : "NO"}
                    </span>
                  </td>
                  <td className='border-r border-black p-3 text-right print:p-2'>
                    {parseFloat(activity.airport_taxi_fee || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </td>
                  <td className='border-r border-black p-3 text-right print:p-2'>
                    {parseFloat(activity.registration_fee || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </td>
                  <td className='border-r border-black p-3 text-right print:p-2'>
                    {parseFloat(activity.inter_city_taxi_fee || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </td>
                  <td className='p-3 text-right print:p-2'>
                    {parseFloat(activity.other_expenses || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}

              {/* Totals Row */}
              <tr className='bg-yellow-100 font-bold'>
                <td colSpan={5} className='border-r border-black p-3 text-right print:p-2'>TOTAL:</td>
                <td className='border-r border-black p-3 text-right print:p-2'>
                  ₦{totals.airportTaxi.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </td>
                <td className='border-r border-black p-3 text-right print:p-2'>
                  ₦{totals.registration.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </td>
                <td className='border-r border-black p-3 text-right print:p-2'>
                  ₦{totals.interCityTaxi.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </td>
                <td className='p-3 text-right print:p-2'>
                  ₦{totals.others.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </td>
              </tr>

              {/* Grand Total Row */}
              <tr className='bg-green-200 font-bold'>
                <td colSpan={8} className='border-r border-black p-3 text-right text-lg print:p-2'>
                  GRAND TOTAL:
                </td>
                <td className='p-3 text-right text-lg print:p-2'>
                  ₦{grandTotal.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signatures Section */}
        <div className='bg-purple-100 border-b border-black p-3 print:p-2'>
          <h3 className='font-bold text-base'>SIGNATURES</h3>
        </div>

        <table className='w-full border-collapse text-sm'>
          <tbody>
            <tr>
              <td className='p-6 align-top border-r border-black print:p-4' style={{width: '33.33%'}}>
                <div className='mb-3'>
                  <span className='font-bold text-base'>Traveler</span>
                </div>
                <div className='mb-3'>
                  <span className='font-bold text-base'>Name: {ter.user?.fullName || (ter.user as any)?.full_name || "N/A"}</span>
                </div>
                <div className='mb-3'>
                  <span className='font-bold text-base'>Sign:</span>
                  <div className='h-16 mt-3 border-b border-gray-400'></div>
                </div>
                <div>
                  <span className='font-bold text-base'>Date: ______________</span>
                </div>
              </td>

              <td className='p-6 align-top border-r border-black print:p-4' style={{width: '33.33%'}}>
                <div className='mb-3'>
                  <span className='font-bold text-base'>Reviewer</span>
                </div>
                <div className='mb-3'>
                  <span className='font-bold text-base'>Name: ______________</span>
                </div>
                <div className='mb-3'>
                  <span className='font-bold text-base'>Sign:</span>
                  <div className='h-16 mt-3 border-b border-gray-400'></div>
                </div>
                <div>
                  <span className='font-bold text-base'>Date: ______________</span>
                </div>
              </td>

              <td className='p-6 align-top print:p-4' style={{width: '33.33%'}}>
                <div className='mb-3'>
                  <span className='font-bold text-base'>Authorizer</span>
                </div>
                <div className='mb-3'>
                  <span className='font-bold text-base'>Name: ______________</span>
                </div>
                <div className='mb-3'>
                  <span className='font-bold text-base'>Sign:</span>
                  <div className='h-16 mt-3 border-b border-gray-400'></div>
                </div>
                <div>
                  <span className='font-bold text-base'>Date: ______________</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Status Information */}
        <div className='bg-green-200 border-b border-black p-3 print:p-2'>
          <h3 className='font-bold text-base'>STATUS INFORMATION</h3>
        </div>

        <table className='w-full border-collapse text-base print:text-sm'>
          <tbody>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold w-1/4 print:p-3'>Status:</td>
              <td className='p-4 print:p-3'>
                <span className='font-semibold text-green-700'>{ter.status || "PENDING"}</span>
              </td>
            </tr>
          </tbody>
        </table>

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
            size: A4 landscape;
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
