"use client";

import { useParams } from "next/navigation";
import { useGetSingleExpenseAuthorizationQuery } from "@/features/admin/controllers/expenseAuthorizationController";
import { LoadingSpinner } from "@/components/Loading";
import logoPng from "assets/imgs/logo.png";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { PrinterIcon, DownloadIcon, ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EADocument() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data, isLoading } = useGetSingleExpenseAuthorizationQuery(id || "", !!id);

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
        <div className="text-red-500">Error loading expense authorization data</div>
      </div>
    );
  }

  const ea = data.data;

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

      {/* EA Document */}
      <div className='bg-white border-2 border-black rounded-lg overflow-hidden print:border print:rounded-none'>
        {/* Logo Header */}
        <div className='border-b-2 border-black p-6 bg-white print:p-4'>
          <div className='flex items-center justify-between mb-4'>
            <img src={(logoPng as any).src || logoPng} alt='logo' width={140} className='print:w-32' />
            <div className='text-right'>
              <h1 className='text-3xl font-bold text-gray-900 print:text-2xl'>EXPENSE AUTHORIZATION</h1>
              <p className='text-sm text-gray-600 mt-1'>EA No: {ea.ta_number}</p>
            </div>
          </div>
          <div className='text-center border-t pt-3'>
            <h2 className='text-xl font-bold text-gray-900'>Achieving Health Nigeria Initiative (AHNI)</h2>
            <p className='text-xs text-gray-600 mt-1'>No. 30 Anthony Enahoro Street, Utako District, Abuja, Nigeria</p>
            <p className='text-xs text-gray-600'>Tel: +234-09-4615555 / +234-09-461500 | Fax: +234-09-4615511 | Email: info@ahnigeria.org.ng</p>
          </div>
        </div>

        {/* Traveler Information */}
        <div className='bg-indigo-200 border-b border-black p-3 print:p-2'>
          <h3 className='font-bold text-base'>TRAVELER INFORMATION</h3>
        </div>

        <table className='w-full border-collapse text-base print:text-sm'>
          <tbody>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold w-1/4 print:p-3'>Traveler Name:</td>
              <td className='p-4 print:p-3'>{ea.created_by.fullName || (ea.created_by as any).full_name || "N/A"}</td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold print:p-3'>Email:</td>
              <td className='p-4 print:p-3'>{ea.created_by.email || "N/A"}</td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold print:p-3'>Phone Number:</td>
              <td className='p-4 print:p-3'>{ea.requestor_details?.phone || "N/A"}</td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold print:p-3'>Department:</td>
              <td className='p-4 print:p-3'>{ea.department?.name || "N/A"}</td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold print:p-3'>Address:</td>
              <td className='p-4 print:p-3'>{ea.address || "N/A"}</td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold print:p-3'>Traveler Type:</td>
              <td className='p-4 print:p-3'>{ea.traveler_type || "N/A"}</td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold print:p-3'>FCO:</td>
              <td className='p-4 print:p-3'>{ea.fco?.name || "N/A"}</td>
            </tr>
          </tbody>
        </table>

        {/* Travel Destinations */}
        <div className='bg-blue-200 border-b border-black p-3 print:p-2'>
          <h3 className='font-bold text-base'>TRAVEL DESTINATIONS</h3>
        </div>

        <table className='w-full border-collapse text-base print:text-sm'>
          <thead className='bg-blue-100'>
            <tr>
              <th className='border-r border-b border-black p-4 font-bold text-left print:p-3' style={{width: '5%'}}>S/N</th>
              <th className='border-r border-b border-black p-4 font-bold text-left print:p-3' style={{width: '15%'}}>Project</th>
              <th className='border-r border-b border-black p-4 font-bold text-left print:p-3' style={{width: '15%'}}>Destination</th>
              <th className='border-r border-b border-black p-4 font-bold text-left print:p-3' style={{width: '20%'}}>Purpose</th>
              <th className='border-r border-b border-black p-4 font-bold text-center print:p-3' style={{width: '15%'}}>Arrival Date</th>
              <th className='border-b border-black p-4 font-bold text-center print:p-3' style={{width: '15%'}}>Departure Date</th>
            </tr>
          </thead>
          <tbody>
            {ea.destinations?.map((destination: any, index: number) => (
              <tr key={destination.id} className='border-b border-black'>
                <td className='border-r border-black p-4 text-center print:p-3'>{index + 1}</td>
                <td className='border-r border-black p-4 print:p-3'>{destination.project?.title || "N/A"}</td>
                <td className='border-r border-black p-4 print:p-3'>
                  {destination.city && destination.state ? `${destination.city}, ${destination.state}` : "N/A"}
                </td>
                <td className='border-r border-black p-4 print:p-3'>{destination.purpose || "N/A"}</td>
                <td className='border-r border-black p-4 text-center print:p-3'>
                  {destination.arrival_date ? format(new Date(destination.arrival_date), "dd MMM yyyy") : "N/A"}
                </td>
                <td className='p-4 text-center print:p-3'>
                  {destination.departure_date ? format(new Date(destination.departure_date), "dd MMM yyyy") : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Special Requests */}
        <div className='bg-orange-200 border-b border-black p-3 print:p-2'>
          <h3 className='font-bold text-base'>SPECIAL REQUESTS</h3>
        </div>

        <table className='w-full border-collapse text-base print:text-sm'>
          <tbody>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold w-2/3 print:p-3'>
                Travel advances based on State Department per diem rates
              </td>
              <td className='p-4 text-center print:p-3'>
                <span className={`font-semibold ${ea.is_travel_advances_dependent ? 'text-green-700' : 'text-red-700'}`}>
                  {ea.is_travel_advances_dependent ? "YES" : "NO"}
                </span>
              </td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold print:p-3'>
                Documents needed more than 3 days prior to departure
              </td>
              <td className='p-4 text-center print:p-3'>
                <span className={`font-semibold ${ea.is_document_needed ? 'text-green-700' : 'text-red-700'}`}>
                  {ea.is_document_needed ? "YES" : "NO"}
                </span>
              </td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold print:p-3'>
                Car Rental
              </td>
              <td className='p-4 text-center print:p-3'>
                <span className={`font-semibold ${ea.is_car_rental_allowed ? 'text-green-700' : 'text-red-700'}`}>
                  {ea.is_car_rental_allowed ? "YES" : "NO"}
                </span>
              </td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold print:p-3'>
                Hotel Reservations
              </td>
              <td className='p-4 text-center print:p-3'>
                <span className={`font-semibold ${ea.is_hotel_reservation_required ? 'text-green-700' : 'text-red-700'}`}>
                  {ea.is_hotel_reservation_required ? "YES" : "NO"}
                </span>
              </td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold print:p-3'>
                Hotel transfer/taxi/other transportation (International only)
              </td>
              <td className='p-4 text-center print:p-3'>
                <span className={`font-semibold ${ea.is_hotel_transport_required ? 'text-green-700' : 'text-red-700'}`}>
                  {ea.is_hotel_transport_required ? "YES" : "NO"}
                </span>
              </td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold print:p-3'>
                Managing Director Notified
              </td>
              <td className='p-4 text-center print:p-3'>
                <span className={`font-semibold ${ea.is_managing_director_notified ? 'text-green-700' : 'text-red-700'}`}>
                  {ea.is_managing_director_notified ? "YES" : "NO"}
                </span>
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
              <td className='border-r border-black p-4 bg-gray-50 font-semibold w-1/4 print:p-3'>Authorization Status:</td>
              <td className='p-4 print:p-3'>
                <span className='font-semibold text-green-700'>{ea.status}</span>
              </td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-gray-50 font-semibold print:p-3'>Security Clearance:</td>
              <td className='p-4 print:p-3'>
                <span className='font-semibold text-green-700'>{ea.security_clearance_status}</span>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Approval Trail Section */}
        {ea.approvals?.length > 0 && (
          <>
            <div className='bg-purple-100 border-b border-black p-3 print:p-2'>
              <h3 className='font-bold text-base'>APPROVAL TRAIL</h3>
            </div>

            <table className='w-full border-collapse text-sm'>
              <tbody>
                <tr>
                  {ea.approvals.map((approval: any, index: number) => (
                    <td
                      key={approval.id}
                      className={`p-6 align-top print:p-4 ${index < ea.approvals.length - 1 ? 'border-r border-black' : ''}`}
                      style={{width: `${100 / ea.approvals.length}%`}}
                    >
                      <div className='mb-3'>
                        <span className='font-bold text-base'>{approval.approval_level}: {approval.user?.fullName || (approval.user as any)?.full_name || "N/A"}</span>
                      </div>
                      <div className='mb-3'>
                        <span className='font-bold text-base'>Sign:</span>
                        <div className='h-16 mt-3 border-b border-gray-400'></div>
                      </div>
                      <div>
                        <span className='font-bold text-base'>Date: {format(new Date(approval.updated_datetime || approval.created_datetime), "dd/MM/yyyy")}</span>
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
          <p className='text-xs text-gray-600 mt-2'>Achieving Health Nigeria Initiative - Expense Authorization System</p>
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
