"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Image from "next/image";
import logoPng from "@/assets/imgs/logo-bg.png";
import BackNavigation from "components/atoms/BackNavigation";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { Separator } from "components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
import { Textarea } from "components/ui/textarea";
import { Label } from "components/ui/label";
import {
  useGetSingleFuelConsumption,
  useApproveFuelConsumption,
  useRejectFuelConsumption,
} from "@/features/admin/controllers/fuelConsumptionController";
import { AdminRoutes } from "constants/RouterConstants";
import VehicleFuelHistory from "./_components/VehicleFuelHistory";

export default function FuelConsumptionDetail() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [rejectionDialog, setRejectionDialog] = useState(false);
  const [comments, setComments] = useState("");

  // Check if this is a vehicle view request
  const viewType = searchParams?.get('type');
  const isVehicleView = viewType === 'vehicle';

  const { data: fuelConsumption, isLoading, refetch } = useGetSingleFuelConsumption(
    id as string,
    true
  );


  const { approveFuelConsumption, isLoading: isApproving } =
    useApproveFuelConsumption(id as string);

  const { rejectFuelConsumption, isLoading: isRejecting } =
    useRejectFuelConsumption(id as string);

  const handleApprove = async () => {
    try {
      await approveFuelConsumption({ comments });
      toast.success("Fuel consumption approved successfully");
      setApprovalDialog(false);
      setComments("");
      // Refetch the data to update the UI
      await refetch();
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  const handleReject = async () => {
    try {
      await rejectFuelConsumption({ comments });
      toast.success("Fuel consumption rejected successfully");
      setRejectionDialog(false);
      setComments("");
      // Refetch the data to update the UI
      await refetch();
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  // PDF Download function
  const handleDownloadPDF = async () => {
    try {
      toast.info('Generating PDF...');

      const element = document.getElementById('fuel-consumption-pdf-document');
      if (!element) {
        toast.error('Fuel request content not found');
        console.error('PDF Element not found: fuel-consumption-pdf-document');
        return;
      }

      console.log('PDF Element found:', element);
      console.log('Element dimensions:', element.offsetWidth, 'x', element.offsetHeight);

      // Hide all action buttons during capture
      const actionButtons = document.querySelectorAll('.action-buttons') as NodeListOf<HTMLElement>;
      const originalDisplays: string[] = [];

      actionButtons.forEach((element, index) => {
        originalDisplays[index] = element.style.display;
        element.style.display = 'none';
      });

      // Also hide any other elements that shouldn't be in PDF
      const hiddenElements = document.querySelectorAll('.hide-in-pdf, .tabs, .dialog') as NodeListOf<HTMLElement>;
      const originalHiddenDisplays: string[] = [];
      hiddenElements.forEach((element, index) => {
        originalHiddenDisplays[index] = element.style.display;
        element.style.display = 'none';
      });

      // Allow DOM to update
      await new Promise(resolve => setTimeout(resolve, 200));

      // Convert HTML to canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // Restore all action buttons
      actionButtons.forEach((element, index) => {
        element.style.display = originalDisplays[index] || '';
      });

      // Restore hidden elements
      hiddenElements.forEach((element, index) => {
        element.style.display = originalHiddenDisplays[index] || '';
      });

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        toast.error('Failed to capture content for PDF');
        return;
      }

      // Create PDF with A4 dimensions
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pageHeight = 297; // A4 height in mm

      // Handle multi-page PDFs
      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      } else {
        let sourceHeight = canvas.height;
        let position = 0;
        let pageNumber = 1;

        while (sourceHeight > 0) {
          const pageCanvas = document.createElement('canvas');
          const pageContext = pageCanvas.getContext('2d');

          pageCanvas.width = canvas.width;
          pageCanvas.height = Math.min(canvas.height * pageHeight / imgHeight, sourceHeight);

          if (pageContext) {
            pageContext.drawImage(
              canvas,
              0, position,
              canvas.width, pageCanvas.height,
              0, 0,
              pageCanvas.width, pageCanvas.height
            );

            const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);

            if (pageNumber > 1) {
              pdf.addPage();
            }

            pdf.addImage(pageImgData, 'JPEG', 0, 0, imgWidth, pageHeight);
          }

          sourceHeight -= pageCanvas.height;
          position += pageCanvas.height;
          pageNumber++;
        }
      }

      // Generate filename with fuel request ID and date
      const requestId = (id as string).slice(0, 8); // Short ID for filename
      const fileName = `Fuel-Request-${requestId}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;

      // Use blob URL method for better compatibility
      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);

      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up URL
      URL.revokeObjectURL(url);

      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!fuelConsumption?.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Fuel consumption record not found</p>
      </div>
    );
  }

  const data = fuelConsumption.data;
  const isPending = data.status === "PENDING";

  return (
    <div className="space-y-6">
      {/* Navigation and Action Header */}
      <div className="action-buttons">
        <div className="flex items-center justify-between">
          <BackNavigation extraText="Fuel Consumption Details" />

          {/* PDF Download Button */}
          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Download PDF
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Fuel Consumption Details</h1>
          <div className="flex items-center gap-4">
            <Badge
              variant="default"
              className={cn(
                "p-2 rounded-lg font-medium",
                data.status === "PENDING" && "bg-yellow-100 text-yellow-800 border-yellow-200",
                data.status === "APPROVED" && "bg-green-100 text-green-800 border-green-200",
                data.status === "REJECTED" && "bg-red-100 text-red-800 border-red-200"
              )}
            >
              {data.status}
            </Badge>

            {/* Action Buttons */}
            {isPending && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setRejectionDialog(true)}
                  disabled={isRejecting}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => setApprovalDialog(true)}
                  disabled={isApproving}
                >
                  Approve
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN PDF Content Container - FIRST PRIORITY */}
      <div id="fuel-consumption-pdf-document" className="w-full bg-white print:shadow-none" style={{ isolation: 'isolate' }}>
        {/* Document Header - Professional Format */}
        <div className="border-2 border-black mb-6">
          <div className="bg-white p-4 flex items-center justify-between">
            {/* Logo */}
            <div className="w-32">
              <Image
                src={logoPng}
                alt="AHNI Logo"
                width={120}
                height={40}
                className="object-contain"
              />
            </div>

            {/* Title */}
            <div className="flex-1 text-center">
              <h1 className="text-xl font-bold text-gray-800 print:text-2xl">
                ACHIEVING HEALTH NIGERIA INITIATIVE
              </h1>
              <h2 className="text-lg font-bold text-gray-800 mt-2 print:text-xl">
                FUEL CONSUMPTION RECORD
              </h2>
            </div>

            {/* Reference */}
            <div className="w-32 text-right text-sm">
              <p className="font-bold">Ref: FC/{(id as string).slice(0, 8).toUpperCase()}</p>
              <p className="text-xs mt-1">
                {format(new Date(), "dd/MM/yyyy")}
              </p>
            </div>
          </div>
        </div>

        {/* Fuel Request Details Table */}
        <table className='w-full border-collapse text-base print:text-sm mb-6'>
          <tbody>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-blue-100 font-semibold w-1/4'>
                Request Date:
              </td>
              <td className='p-4 border-r border-black'>
                {format(new Date(data.date), "dd MMM yyyy")}
              </td>
              <td className='border-r border-black p-4 bg-blue-100 font-semibold w-1/4'>
                Status:
              </td>
              <td className='p-4'>
                <span className={`px-2 py-1 rounded text-sm font-bold ${
                  data.status === 'APPROVED'
                    ? 'bg-green-200 text-green-800'
                    : data.status === 'REJECTED'
                    ? 'bg-red-200 text-red-800'
                    : 'bg-yellow-200 text-yellow-800'
                }`}>
                  {data.status}
                </span>
              </td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-blue-100 font-semibold'>
                Vehicle/Asset:
              </td>
              <td className='p-4 border-r border-black'>
                <div>
                  <div className="font-medium">{data.asset?.name || "N/A"}</div>
                  <div className="text-sm text-gray-600">{data.asset?.category?.name || "N/A"}</div>
                </div>
              </td>
              <td className='border-r border-black p-4 bg-blue-100 font-semibold'>
                Assigned Driver:
              </td>
              <td className='p-4'>
                {data.assigned_driver ?
                  `${data.assigned_driver.first_name} ${data.assigned_driver.last_name}` :
                  "N/A"
                }
              </td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-blue-100 font-semibold'>
                Location:
              </td>
              <td className='p-4 border-r border-black'>
                {data.location?.name || "N/A"}
              </td>
              <td className='border-r border-black p-4 bg-blue-100 font-semibold'>
                Vendor:
              </td>
              <td className='p-4'>
                {data.vendor?.company_name || "N/A"}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Fuel Consumption Details Table */}
        <table className='w-full border-collapse text-base print:text-sm mb-6'>
          <thead>
            <tr>
              <th colSpan={4} className='bg-orange-200 p-3 text-center font-bold border border-black'>
                FUEL CONSUMPTION DETAILS
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-blue-100 font-semibold w-1/4'>
                Fuel Coupon:
              </td>
              <td className='p-4 border-r border-black'>
                <span className="font-medium">{data.fuel_coupon}</span>
              </td>
              <td className='border-r border-black p-4 bg-blue-100 font-semibold w-1/4'>
                FCO Number:
              </td>
              <td className='p-4'>
                {data.fco?.name || "N/A"}
              </td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-blue-100 font-semibold'>
                Odometer Reading:
              </td>
              <td className='p-4 border-r border-black'>
                {data.odometer ? data.odometer.toLocaleString() : 0} km
              </td>
              <td className='border-r border-black p-4 bg-blue-100 font-semibold'>
                Distance Covered:
              </td>
              <td className='p-4'>
                {data.distance_covered ? data.distance_covered.toLocaleString() : 0} km
              </td>
            </tr>
            <tr className='border-b border-black'>
              <td className='border-r border-black p-4 bg-blue-100 font-semibold'>
                Quantity:
              </td>
              <td className='p-4 border-r border-black'>
                <span className="font-medium">{data.quantity ? data.quantity.toLocaleString() : 0} Litres</span>
              </td>
              <td className='border-r border-black p-4 bg-blue-100 font-semibold'>
                Price per Litre:
              </td>
              <td className='p-4'>
                ₦{data.price_per_litre ? parseFloat(data.price_per_litre).toLocaleString() : '0'}
              </td>
            </tr>
            <tr className='border-b border-black bg-green-50'>
              <td className='border-r border-black p-4 bg-green-100 font-semibold'>
                Total Amount:
              </td>
              <td className='p-4' colSpan={3}>
                <span className="text-lg font-bold text-green-800">
                  ₦{data.amount ? parseFloat(data.amount).toLocaleString() : '0'}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Approval Section */}
        <table className='w-full border-collapse text-base print:text-sm mb-6'>
          <thead>
            <tr>
              <th colSpan={3} className='bg-gray-200 p-3 text-center font-bold border border-black'>
                APPROVAL TRAIL
              </th>
            </tr>
            <tr>
              <th className='bg-blue-100 p-3 border border-black font-bold text-center w-1/3'>
                Requested By
              </th>
              <th className='bg-blue-100 p-3 border border-black font-bold text-center w-1/3'>
                Verified By
              </th>
              <th className='bg-blue-100 p-3 border border-black font-bold text-center w-1/3'>
                Approved By
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Names Row */}
            <tr>
              <td className='p-3 border border-black text-center'>
                <div className="font-medium">
                  {data.assigned_driver ?
                    `${data.assigned_driver.first_name} ${data.assigned_driver.last_name}` :
                    "Driver/Staff"
                  }
                </div>
                <div className="text-sm text-gray-600">
                  Driver/Requesting Staff
                </div>
              </td>
              <td className='p-3 border border-black text-center'>
                <div className="font-medium">
                  Fleet Supervisor
                </div>
                <div className="text-sm text-gray-600">
                  Fleet Management Unit
                </div>
              </td>
              <td className='p-3 border border-black text-center'>
                <div className="font-medium">
                  {data.status === 'APPROVED' ? "Fleet Manager" : "Pending Approval"}
                </div>
                <div className="text-sm text-gray-600">
                  Fleet Management Unit
                </div>
              </td>
            </tr>

            {/* Sign & Date Headers */}
            <tr>
              <td className='p-2 border border-black bg-blue-50 font-semibold text-center'>
                Sign & Date:
              </td>
              <td className='p-2 border border-black bg-blue-50 font-semibold text-center'>
                Sign & Date:
              </td>
              <td className='p-2 border border-black bg-blue-50 font-semibold text-center'>
                Sign & Date:
              </td>
            </tr>

            {/* Signature Space & Dates */}
            <tr className='h-20'>
              <td className='p-3 border border-black align-bottom'>
                <div className="border-b border-gray-400 mb-2 h-12"></div>
                <div className="text-xs text-gray-600 text-center">
                  {format(new Date(data.date), "dd/MM/yyyy")}
                </div>
              </td>
              <td className='p-3 border border-black align-bottom'>
                <div className="border-b border-gray-400 mb-2 h-12"></div>
                <div className="text-xs text-gray-600 text-center">
                  {data.updated_datetime
                    ? format(new Date(data.updated_datetime), "dd/MM/yyyy")
                    : "___________"
                  }
                </div>
              </td>
              <td className='p-3 border border-black align-bottom'>
                <div className="border-b border-gray-400 mb-2 h-12"></div>
                <div className="text-xs text-gray-600 text-center">
                  {data.approved_datetime
                    ? format(new Date(data.approved_datetime), "dd/MM/yyyy")
                    : "___________"
                  }
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          <p>This is a computer-generated document. Generated on {format(new Date(), "dd MMMM yyyy 'at' hh:mm aa")}</p>
          <p>Achieving Health Nigeria Initiative (AHNI) - Fleet Management System</p>
        </div>
      </div>

      {/* Action Tabs Section (Hidden in PDF) */}
      <div className="action-buttons hide-in-pdf">
        <Tabs defaultValue={isVehicleView ? "history" : "details"} className="w-full hide-in-pdf">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="history">Vehicle History</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicle Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Asset</Label>
                    <p className="mt-1 text-sm font-semibold">{data.asset?.name || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Asset Category</Label>
                    <p className="mt-1 text-sm">{data.asset?.category?.name || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Assigned Driver</Label>
                    <p className="mt-1 text-sm">
                      {data.assigned_driver ?
                        `${data.assigned_driver.first_name} ${data.assigned_driver.last_name}` :
                        "N/A"
                      }
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Odometer Reading</Label>
                    <p className="mt-1 text-sm">{data.odometer ? data.odometer.toLocaleString() : 0} km</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Distance Covered</Label>
                    <p className="mt-1 text-sm">{data.distance_covered ? data.distance_covered.toLocaleString() : 0} km</p>
                  </div>
                </CardContent>
              </Card>

              {/* Fuel Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Fuel Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Date</Label>
                    <p className="mt-1 text-sm">
                      {format(new Date(data.date), "dd MMM yyyy")}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Fuel Coupon</Label>
                    <p className="mt-1 text-sm font-semibold">{data.fuel_coupon}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Quantity</Label>
                    <p className="mt-1 text-sm">{data.quantity ? data.quantity.toLocaleString() : 0} L</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Price per Litre</Label>
                    <p className="mt-1 text-sm">₦{data.price_per_litre ? parseFloat(data.price_per_litre).toLocaleString() : '0'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Total Amount</Label>
                    <p className="mt-1 text-lg font-bold text-green-600">
                      ₦{data.amount ? parseFloat(data.amount).toLocaleString() : '0'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Location & Vendor */}
              <Card>
                <CardHeader>
                  <CardTitle>Location & Vendor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Location</Label>
                    <p className="mt-1 text-sm">{data.location?.name || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Vendor</Label>
                    <p className="mt-1 text-sm">{data.vendor?.company_name || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">FCO Number</Label>
                    <p className="mt-1 text-sm">{data.fco?.name || "N/A"}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Timestamps & Approval Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Record Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Created Date</Label>
                    <p className="mt-1 text-sm">
                      {format(new Date(data.created_datetime), "dd MMM yyyy, hh:mm a")}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
                    <p className="mt-1 text-sm">
                      {format(new Date(data.updated_datetime), "dd MMM yyyy, hh:mm a")}
                    </p>
                  </div>
                  {data.approved_datetime && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Approved Date</Label>
                      <p className="mt-1 text-sm text-green-600">
                        {format(new Date(data.approved_datetime), "dd MMM yyyy, hh:mm a")}
                      </p>
                    </div>
                  )}
                  {data.rejected_datetime && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Rejected Date</Label>
                      <p className="mt-1 text-sm text-red-600">
                        {format(new Date(data.rejected_datetime), "dd MMM yyyy, hh:mm a")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <VehicleFuelHistory
              vehicleId={data.asset?.id || ""}
              vehicleName={data.asset?.name}
              showTitle={false}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs (Hidden in PDF) */}
      <div className="action-buttons hide-in-pdf">
        {/* Approval Dialog */}
        <Dialog open={approvalDialog} onOpenChange={setApprovalDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Fuel Consumption</DialogTitle>
              <DialogDescription>
                Are you sure you want to approve this fuel consumption record?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="approval-comments">Comments (Optional)</Label>
                <Textarea
                  id="approval-comments"
                  placeholder="Add any comments..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setApprovalDialog(false);
                  setComments("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isApproving}
              >
                {isApproving ? "Approving..." : "Approve"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Rejection Dialog */}
        <Dialog open={rejectionDialog} onOpenChange={setRejectionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Fuel Consumption</DialogTitle>
              <DialogDescription>
                Are you sure you want to reject this fuel consumption record?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="rejection-comments">Comments (Optional)</Label>
                <Textarea
                  id="rejection-comments"
                  placeholder="Add rejection reason..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setRejectionDialog(false);
                  setComments("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isRejecting}
              >
                {isRejecting ? "Rejecting..." : "Reject"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Print Styles for Professional PDF Output */}
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
        }
      `}</style>
    </div>
  );
}