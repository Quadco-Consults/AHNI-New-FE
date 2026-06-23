"use client";

import BackNavigation from "@/components/BackNavigation";
import FormButton from "@/components/FormButton";
import FormSelect from "@/components/FormSelect";
import FormTextArea from "@/components/FormTextArea";
import DeleteIcon from "@/components/icons/DeleteIcon";
import DescriptionCard from "@/components/DescriptionCard";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { PlusIcon, Download } from "lucide-react";
import { useMemo, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Image from "next/image";
import logoPng from "@/assets/imgs/logo-bg.png";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  useGetSingleVehicleRequestQuery,
  useApproveVehicleRequestMutation,
  useRejectVehicleRequestMutation,
} from "@/features/admin/controllers/vehicleRequestController";
import { useGetAllUsersQuery } from "@/features/auth/controllers/userController";
import {
  VehicleRequestApprovalSchema,
  TVehicleRequestApprovalFormValues,
} from "@/features/admin/types/fleet-management/vehicle-request";
import { useGetAllItemsQuery } from "@/features/modules/controllers";
import { usePermissions } from "@/hooks/usePermissions";

export default function VehicleRequestDetails() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [rejectComment, setRejectComment] = useState("");

  // Get current user permissions to determine access level
  const { user: currentUser, isAdmin, canApprove, canAuthorize } = usePermissions();

  // Helper function to safely render object or string values
  const renderValue = (value: any, fallback: string = "N/A"): string => {
    if (!value) return fallback;
    if (typeof value === 'object') {
      return value?.name || value?.title || fallback;
    }
    return String(value);
  };

  const { data, isLoading } = useGetSingleVehicleRequestQuery(
    id as string,
    !!id
  );

  const {
    approveVehicleRequest,
    isLoading: isApproving,
    isSuccess,
  } = useApproveVehicleRequestMutation(id as string);

  const {
    rejectVehicleRequest,
    isLoading: isRejecting,
    isSuccess: isRejectSuccess,
  } = useRejectVehicleRequestMutation(id as string);

  const form = useForm<TVehicleRequestApprovalFormValues>({
    resolver: zodResolver(VehicleRequestApprovalSchema),
    defaultValues: {
      vehicles: [{ vehicle: "", driver: "" }],
      comment: "",
    },
  });

  // Auto-populate form when data loads
  useEffect(() => {
    if (data?.data?.vehicle_assignments && data.data.vehicle_assignments.length > 0) {
      // Map existing vehicle assignments to form format
      const existingAssignments = data.data.vehicle_assignments.map((assignment: any) => ({
        vehicle: assignment.vehicle,
        driver: assignment.assigned_driver,
      }));

      form.reset({
        vehicles: existingAssignments,
        comment: "",
      });
    }
  }, [data, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "vehicles",
  });

  // Get the officer's location for vehicle filtering
  const officerLocation = currentUser?.employee?.location?.id ||
                         currentUser?.location?.id ||
                         data?.data?.requesting_staff?.location?.id;

  // Fetch vehicles from the officer's office location only
  const { data: vehicleData } = useGetAllItemsQuery({
    page: 1,
    size: 2000000,
    category: "b0983944-f926-4141-8e28-093960d75246", // Vehicle category
    // Filter by location if we have officer's location
    ...(officerLocation && { location: officerLocation }),
  });

  // Calculate number of travelers for smart vehicle suggestions
  const numberOfTravelers = data?.data?.travel_team_members?.length || 0;

  const vehicleOptions = useMemo(() => {
    if (!vehicleData?.data?.results) return [];

    return vehicleData.data.results
      .map((item: any) => {
        // Extract passenger capacity from vehicle data
        const passengerCapacity = item.passenger_capacity || item.capacity || 4; // Default to 4 if not specified
        const suitableForGroup = passengerCapacity >= numberOfTravelers;

        return {
          label: `${item.name} (${passengerCapacity} seats)${suitableForGroup ? ' ✓' : ' ⚠️'}`,
          value: item.id,
          passengerCapacity,
          suitableForGroup,
          plateNumber: item.plate_number || item.registration_number,
          locationName: item.location?.name
        };
      })
      // Sort by suitability first, then by capacity
      .sort((a, b) => {
        if (a.suitableForGroup && !b.suitableForGroup) return -1;
        if (!a.suitableForGroup && b.suitableForGroup) return 1;
        return a.passengerCapacity - b.passengerCapacity;
      });
  }, [vehicleData, numberOfTravelers]);

  // Suggested vehicles based on group size
  const suggestedVehicles = useMemo(() => {
    if (numberOfTravelers <= 0) return [];

    const suitable = vehicleOptions.filter(v => v.suitableForGroup);
    if (suitable.length === 0) {
      // No single vehicle can accommodate everyone - suggest multiple vehicles
      const allVehicles = vehicleOptions.sort((a, b) => b.passengerCapacity - a.passengerCapacity);
      const suggestions = [];
      let remainingTravelers = numberOfTravelers;

      for (const vehicle of allVehicles) {
        if (remainingTravelers <= 0) break;
        suggestions.push(vehicle);
        remainingTravelers -= vehicle.passengerCapacity;
      }

      return suggestions;
    }

    return [suitable[0]]; // Return the smallest suitable vehicle
  }, [vehicleOptions, numberOfTravelers]);

  // Fetch drivers (users)
  const { data: driverData } = useGetAllUsersQuery({ page: 1, size: 2000000 });

  const driverOptions = useMemo(
    () =>
      driverData?.data?.results?.map((user: any) => ({
        label: `${user.first_name} ${user.last_name}`,
        value: user.id,
      })) || [],
    [driverData]
  );

  const onSubmit = async (formData: TVehicleRequestApprovalFormValues) => {
    try {
      // Send vehicle-driver pairs directly as expected by backend
      const payload = {
        vehicles: formData.vehicles, // Array of {vehicle: "id", driver: "id"} objects
        comment: formData.comment,
      };

      await approveVehicleRequest(payload);
    } catch (error) {
      console.error("Approval failed:", error);
      toast.error("Failed to approve vehicle request. Please try again.");
    }
  };

  const addVehicle = () => {
    append({ vehicle: "", driver: "" });
  };

  const removeVehicle = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onReject = async () => {
    try {
      await rejectVehicleRequest(rejectComment);
    } catch (error) {
      console.error("Rejection failed:", error);
      toast.error("Failed to reject vehicle request. Please try again.");
    }
  };

  // PDF Download function
  const handleDownloadPDF = async () => {
    try {
      toast.info('Generating PDF...');

      const element = document.getElementById('vehicle-request-content');
      if (!element) {
        toast.error('Vehicle request content not found');
        return;
      }

      // Hide all action buttons during capture
      const actionButtons = document.querySelectorAll('.action-buttons') as NodeListOf<HTMLElement>;
      const originalDisplays: string[] = [];

      actionButtons.forEach((element, index) => {
        originalDisplays[index] = element.style.display;
        element.style.display = 'none';
      });

      // Allow DOM to update
      await new Promise(resolve => setTimeout(resolve, 100));

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

      // Generate filename with vehicle request ID and date
      const requestId = id.slice(0, 8); // Short ID for filename
      const fileName = `Vehicle-Request-${requestId}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;

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

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      toast.success("Vehicle request approved successfully!");
      router.push("/dashboard/admin/fleet-management/vehicle-request");
    }
  }, [isSuccess, router]);

  // Handle reject success
  useEffect(() => {
    if (isRejectSuccess) {
      toast.success("Vehicle request rejected successfully!");
      router.push("/dashboard/admin/fleet-management/vehicle-request");
    }
  }, [isRejectSuccess, router]);

  // Check if request is already processed (approved or rejected)
  const isRequestProcessed = data?.data?.status?.toLowerCase() === 'approved' ||
                             data?.data?.status?.toLowerCase() === 'rejected';

  // Determine if current user can approve/manage vehicle assignments
  const isRequestOwner = currentUser?.id === data?.data?.requesting_staff?.id;
  const canManageVehicleAssignments = (isAdmin || canApprove || canAuthorize) && !isRequestOwner;

  return (
    <div className='space-y-4'>
      <div className="flex items-center justify-between">
        <BackNavigation extraText='View Vehicle Request' />

        {/* PDF Download Button - Show for all users when data is loaded */}
        {data && (
          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            className="flex items-center gap-2 action-buttons"
          >
            <Download size={16} />
            Download PDF
          </Button>
        )}
      </div>

      <Card className='p-6 mx-auto space-y-5' id="vehicle-request-content">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          data && (
            <>
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
                      VEHICLE REQUEST FORM
                    </h2>
                  </div>

                  {/* Reference */}
                  <div className="w-32 text-right text-sm">
                    <p className="font-bold">Ref: VR/{id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs mt-1">
                      {format(new Date(), "dd/MM/yyyy")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Request Details Table */}
              <table className='w-full border-collapse text-base print:text-sm mb-6'>
                <tbody>
                  <tr className='border-b border-black'>
                    <td className='border-r border-black p-4 bg-blue-100 font-semibold w-1/4'>
                      Request Date:
                    </td>
                    <td className='p-4 border-r border-black'>
                      {format(new Date(data?.data.created_datetime), "dd MMM yyyy")}
                    </td>
                    <td className='border-r border-black p-4 bg-blue-100 font-semibold w-1/4'>
                      Status:
                    </td>
                    <td className='p-4'>
                      <span className={`px-2 py-1 rounded text-sm font-bold ${
                        data?.data?.status?.toLowerCase() === 'approved'
                          ? 'bg-green-200 text-green-800'
                          : data?.data?.status?.toLowerCase() === 'rejected'
                          ? 'bg-red-200 text-red-800'
                          : 'bg-yellow-200 text-yellow-800'
                      }`}>
                        {data?.data?.status?.toUpperCase() || 'PENDING'}
                      </span>
                    </td>
                  </tr>
                  <tr className='border-b border-black'>
                    <td className='border-r border-black p-4 bg-blue-100 font-semibold'>
                      Requesting Staff:
                    </td>
                    <td className='p-4 border-r border-black'>
                      <div>
                        <div className="font-medium">{`${data?.data?.requesting_staff?.first_name || ""} ${data?.data?.requesting_staff?.last_name || ""}`}</div>
                        <div className="text-sm text-gray-600">{renderValue(data?.data?.requesting_staff?.position) || renderValue(data?.data?.requesting_staff?.designation)}</div>
                        <div className="text-sm text-gray-600">{renderValue(data?.data?.requesting_staff?.department)}</div>
                      </div>
                    </td>
                    <td className='border-r border-black p-4 bg-blue-100 font-semibold'>
                      Supervisor:
                    </td>
                    <td className='p-4'>
                      <div>
                        <div className="font-medium">{`${data?.data?.supervisor?.first_name || ""} ${data?.data?.supervisor?.last_name || ""}`}</div>
                        <div className="text-sm text-gray-600">{renderValue(data?.data?.supervisor?.position) || renderValue(data?.data?.supervisor?.designation)}</div>
                        <div className="text-sm text-gray-600">{renderValue(data?.data?.supervisor?.department)}</div>
                      </div>
                    </td>
                  </tr>
                  <tr className='border-b border-black'>
                    <td className='border-r border-black p-4 bg-blue-100 font-semibold'>
                      Location:
                    </td>
                    <td className='p-4 border-r border-black'>
                      {data?.data.location.name}
                    </td>
                    <td className='border-r border-black p-4 bg-blue-100 font-semibold'>
                      Purpose of Travel:
                    </td>
                    <td className='p-4'>
                      {data?.data.purpose_of_travel || 'General travel'}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Travel Details Table */}
              <table className='w-full border-collapse text-base print:text-sm mb-6'>
                <thead>
                  <tr>
                    <th colSpan={4} className='bg-orange-200 p-3 text-center font-bold border border-black'>
                      TRAVEL DETAILS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className='border-b border-black'>
                    <td className='border-r border-black p-4 bg-blue-100 font-semibold w-1/4'>
                      Travel Destination:
                    </td>
                    <td className='p-4 border-r border-black'>
                      {data?.data.travel_destination}
                    </td>
                    <td className='border-r border-black p-4 bg-blue-100 font-semibold w-1/4'>
                      Departure Point:
                    </td>
                    <td className='p-4'>
                      {data?.data.departure_point}
                    </td>
                  </tr>
                  <tr className='border-b border-black'>
                    <td className='border-r border-black p-4 bg-blue-100 font-semibold'>
                      Departure Date & Time:
                    </td>
                    <td className='p-4 border-r border-black'>
                      {format(new Date(data?.data.departure_datetime), "dd MMM yyyy, hh:mm aa")}
                    </td>
                    <td className='border-r border-black p-4 bg-blue-100 font-semibold'>
                      Return Date & Time:
                    </td>
                    <td className='p-4'>
                      {format(new Date(data?.data.return_datetime), "dd MMM yyyy, hh:mm aa")}
                    </td>
                  </tr>
                  {data?.data.recommendations && (
                    <tr className='border-b border-black'>
                      <td className='border-r border-black p-4 bg-blue-100 font-semibold'>
                        Recommendations:
                      </td>
                      <td className='p-4' colSpan={3}>
                        {data?.data.recommendations}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Travel Team Members Table */}
              <table className='w-full border-collapse text-base print:text-sm mb-6'>
                <thead>
                  <tr>
                    <th colSpan={5} className='bg-orange-200 p-3 text-center font-bold border border-black'>
                      TRAVEL TEAM MEMBERS ({data?.data.travel_team_members.length} Travelers)
                    </th>
                  </tr>
                  <tr>
                    <th className='bg-blue-100 p-3 border border-black font-bold text-center'>S/N</th>
                    <th className='bg-blue-100 p-3 border border-black font-bold text-center'>Name</th>
                    <th className='bg-blue-100 p-3 border border-black font-bold text-center'>Position</th>
                    <th className='bg-blue-100 p-3 border border-black font-bold text-center'>Department</th>
                    <th className='bg-blue-100 p-3 border border-black font-bold text-center'>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.travel_team_members.map((member, index) => {
                    // Handle multiple name field possibilities
                    const memberName = member.full_name ||
                                      (member.first_name && member.last_name ? `${member.first_name} ${member.last_name}` : "") ||
                                      member.name ||
                                      member.username ||
                                      "N/A";

                    return (
                      <tr key={member.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className='p-3 border border-black text-center font-medium'>
                          {(index + 1).toString().padStart(2, '0')}
                        </td>
                        <td className='p-3 border border-black'>
                          <div className="font-medium">{memberName}</div>
                          <div className="text-sm text-gray-600">{member.email || "N/A"}</div>
                        </td>
                        <td className='p-3 border border-black'>
                          {renderValue(member.position) || renderValue(member.designation) || renderValue(member.job_title)}
                        </td>
                        <td className='p-3 border border-black'>
                          {renderValue(member.department)}
                        </td>
                        <td className='p-3 border border-black'>
                          <div>{member.mobile_number || member.phone || member.mobile || "N/A"}</div>
                          {member.location && (
                            <div className="text-sm text-gray-600">{renderValue(member.location)}</div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Vehicle Assignments Table - Show for approved requests */}
              {data?.data?.vehicle_assignments && data.data.vehicle_assignments.length > 0 && (
                <table className='w-full border-collapse text-base print:text-sm mb-6'>
                  <thead>
                    <tr>
                      <th colSpan={4} className='bg-green-200 p-3 text-center font-bold border border-black'>
                        VEHICLE ASSIGNMENTS (APPROVED)
                      </th>
                    </tr>
                    <tr>
                      <th className='bg-blue-100 p-3 border border-black font-bold text-center'>S/N</th>
                      <th className='bg-blue-100 p-3 border border-black font-bold text-center'>Vehicle</th>
                      <th className='bg-blue-100 p-3 border border-black font-bold text-center'>Assigned Driver</th>
                      <th className='bg-blue-100 p-3 border border-black font-bold text-center'>Assignment Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.vehicle_assignments.map((assignment: any, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className='p-3 border border-black text-center font-medium'>
                          {(index + 1).toString().padStart(2, '0')}
                        </td>
                        <td className='p-3 border border-black'>
                          <div className="font-medium">{assignment.vehicle_name || 'N/A'}</div>
                        </td>
                        <td className='p-3 border border-black'>
                          <div className="font-medium">{assignment.driver_name || 'N/A'}</div>
                        </td>
                        <td className='p-3 border border-black text-center'>
                          {data?.data?.approved_datetime
                            ? format(new Date(data.data.approved_datetime), "dd MMM yyyy")
                            : "N/A"
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

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
                      Reviewed By (Supervisor)
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
                        {`${data?.data?.requesting_staff?.first_name || ""} ${data?.data?.requesting_staff?.last_name || ""}`}
                      </div>
                      <div className="text-sm text-gray-600">
                        {renderValue(data?.data?.requesting_staff?.position) || renderValue(data?.data?.requesting_staff?.designation)}
                      </div>
                    </td>
                    <td className='p-3 border border-black text-center'>
                      <div className="font-medium">
                        {`${data?.data?.supervisor?.first_name || ""} ${data?.data?.supervisor?.last_name || ""}`}
                      </div>
                      <div className="text-sm text-gray-600">
                        {renderValue(data?.data?.supervisor?.position) || renderValue(data?.data?.supervisor?.designation)}
                      </div>
                    </td>
                    <td className='p-3 border border-black text-center'>
                      <div className="font-medium">
                        {data?.data?.approved_by ? "Fleet Manager" : "Pending Approval"}
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
                        {format(new Date(data?.data?.created_datetime), "dd/MM/yyyy")}
                      </div>
                    </td>
                    <td className='p-3 border border-black align-bottom'>
                      <div className="border-b border-gray-400 mb-2 h-12"></div>
                      <div className="text-xs text-gray-600 text-center">
                        {data?.data?.updated_datetime
                          ? format(new Date(data?.data?.updated_datetime), "dd/MM/yyyy")
                          : "___________"
                        }
                      </div>
                    </td>
                    <td className='p-3 border border-black align-bottom'>
                      <div className="border-b border-gray-400 mb-2 h-12"></div>
                      <div className="text-xs text-gray-600 text-center">
                        {data?.data?.approved_datetime
                          ? format(new Date(data?.data?.approved_datetime), "dd/MM/yyyy")
                          : "___________"
                        }
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500 space-y-2">
                <p className="font-semibold text-gray-700">Achieving Health Nigeria Initiative (AHNI)</p>
                <p>No. 30 Anthony Enahoro Street, Utako District, Abuja, Nigeria</p>
                <p>Tel: +234-09-4615555 / +234-09-461500 | Fax: +234-09-4615511 | Email: info@ahnigeria.org.ng</p>
                <p className="mt-2">This is a computer-generated document. Generated on {format(new Date(), "dd MMMM yyyy 'at' hh:mm aa")}</p>
              </div>

              {/* Vehicle Assignment Section - Only for Approvers (Hidden in PDF) */}
              <div className="action-buttons">
                {canManageVehicleAssignments && (
                  <>
                    {/* Smart Vehicle Suggestions */}
                    {suggestedVehicles.length > 0 && (
                      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                        <h3 className="text-lg font-bold text-blue-800 mb-3">
                          🚗 Smart Vehicle Suggestions ({numberOfTravelers} travelers)
                        </h3>
                        {suggestedVehicles.length === 1 ? (
                          <div className="p-3 bg-white border border-blue-300 rounded-lg">
                            <p className="text-sm text-blue-700">
                              <strong>Recommended:</strong> {suggestedVehicles[0].label}
                            </p>
                            {suggestedVehicles[0].plateNumber && (
                              <p className="text-xs text-gray-600">
                                Plate: {suggestedVehicles[0].plateNumber} | Location: {suggestedVehicles[0].locationName}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-sm text-blue-700 font-medium">
                              Multiple vehicles needed for {numberOfTravelers} travelers:
                            </p>
                            {suggestedVehicles.map((vehicle, index) => (
                              <div key={vehicle.value} className="p-2 bg-white border border-blue-300 rounded">
                                <p className="text-sm">
                                  <strong>Vehicle {index + 1}:</strong> {vehicle.label}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <FormProvider {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-5'
                      >
                        <h3 className='mb-2 text-lg font-bold'>
                          {data?.data?.vehicle_assignments?.length ? 'Update Vehicle Assignments' : 'Assign Vehicles & Drivers'}
                        </h3>

                        {(data?.data?.vehicle_assignments?.length ?? 0) > 0 && (
                          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-sm text-blue-700 font-medium">
                              ℹ️ Existing assignments have been loaded. You can modify or add new assignments below.
                            </p>
                          </div>
                        )}

                        {fields.map((field, index) => {
                          // Find the corresponding vehicle assignment for display name
                          const currentVehicleId = form.watch(`vehicles.${index}.vehicle`);
                          const vehicleAssignment = data?.data?.vehicle_assignments?.find(
                            (assignment: any) => assignment.vehicle === currentVehicleId
                          );

                          return (
                            <div key={field.id} className='flex items-center gap-5'>
                              <div className="flex-1">
                                <FormSelect
                                  name={`vehicles.${index}.vehicle`}
                                  className='w-full'
                                  placeholder='Select Vehicle'
                                  options={vehicleOptions}
                                  label={index === 0 ? "Vehicle" : ""}
                                />
                                {vehicleAssignment && (
                                  <p className="text-xs text-gray-600 mt-1">
                                    Current: {vehicleAssignment.vehicle_name}
                                  </p>
                                )}
                              </div>

                              <div className="flex-1">
                                <FormSelect
                                  name={`vehicles.${index}.driver`}
                                  className='w-full'
                                  placeholder='Select Driver'
                                  options={driverOptions}
                                  label={index === 0 ? "Driver" : ""}
                                />
                                {vehicleAssignment && (
                                  <p className="text-xs text-gray-600 mt-1">
                                    Current: {vehicleAssignment.driver_name}
                                  </p>
                                )}
                              </div>

                              <Button
                                type='button'
                                variant='ghost'
                                onClick={() => removeVehicle(index)}
                                disabled={fields.length === 1}
                                className='mt-6'
                              >
                                <DeleteIcon />
                              </Button>
                            </div>
                          );
                        })}

                        <Button type='button' onClick={addVehicle}>
                          Add Vehicle <PlusIcon />
                        </Button>

                        <FormTextArea
                          label='Comment'
                          name='comment'
                          placeholder='Enter Comment (Optional)'
                        />

                        {/* Action Buttons Section */}
                        <div className="space-y-4 pt-4 border-t">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold text-gray-800">Request Actions</h4>
                            <div className="px-3 py-1 rounded-full text-sm font-medium" style={{
                              backgroundColor: data?.data?.status?.toLowerCase() === 'approved' ? '#dcfce7' :
                                             data?.data?.status?.toLowerCase() === 'rejected' ? '#fee2e2' : '#fef3c7',
                              color: data?.data?.status?.toLowerCase() === 'approved' ? '#166534' :
                                     data?.data?.status?.toLowerCase() === 'rejected' ? '#991b1b' : '#92400e'
                            }}>
                              Status: {data?.data?.status || 'Pending'}
                            </div>
                          </div>

                          {isRequestProcessed && (
                            <div className="mb-4 p-3 bg-gray-50 border border-gray-300 rounded">
                              <p className="text-sm text-gray-700 font-medium">
                                ℹ️ This request has already been {data?.data?.status?.toLowerCase()}. No further action can be taken.
                              </p>
                            </div>
                          )}

                          <div className="flex gap-4">
                            <FormButton
                              size='lg'
                              className='bg-green-500 hover:bg-green-600'
                              loading={isApproving}
                              disabled={isApproving || isRejecting || isRequestProcessed}
                            >
                              {isApproving ? "Approving..." : "Approve Request"}
                            </FormButton>

                            <Button
                              type="button"
                              size='lg'
                              className='bg-red-500 hover:bg-red-600 text-white'
                              disabled={isApproving || isRejecting || isRequestProcessed}
                              onClick={onReject}
                            >
                              {isRejecting ? "Rejecting..." : "Reject Request"}
                            </Button>
                          </div>

                          {/* Reject Comment Field */}
                          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <label htmlFor="rejectComment" className="block text-sm font-medium text-red-800 mb-2">
                              Rejection Comment (Optional)
                            </label>
                            <textarea
                              id="rejectComment"
                              value={rejectComment}
                              onChange={(e) => setRejectComment(e.target.value)}
                              placeholder="Enter reason for rejection (optional)"
                              className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              rows={3}
                            />
                            <p className="text-xs text-red-600 mt-1">
                              This comment will be visible to the requesting staff if provided.
                            </p>
                          </div>
                        </div>
                      </form>
                    </FormProvider>
                  </>
                )}
              </div>

              {/* Request Status for Non-Approvers (Hidden in PDF) */}
              <div className="action-buttons">
                {!canManageVehicleAssignments && (
                  <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Request Status</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Current Status:</span>
                      <div className="px-3 py-1 rounded-full text-sm font-medium" style={{
                        backgroundColor: data?.data?.status?.toLowerCase() === 'approved' ? '#dcfce7' :
                                       data?.data?.status?.toLowerCase() === 'rejected' ? '#fee2e2' : '#fef3c7',
                        color: data?.data?.status?.toLowerCase() === 'approved' ? '#166534' :
                               data?.data?.status?.toLowerCase() === 'rejected' ? '#991b1b' : '#92400e'
                      }}>
                        {data?.data?.status || 'Pending'}
                      </div>
                    </div>
                    {isRequestOwner && (
                      <p className="text-sm text-gray-600 mt-2">
                        Your request is being reviewed. You will be notified once a decision is made.
                      </p>
                    )}

                    {/* Show assigned vehicles if any */}
                    {data?.data?.vehicle_assignments && data.data.vehicle_assignments.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-700 mb-2">Assigned Vehicles:</h4>
                        <div className="space-y-2">
                          {data.data.vehicle_assignments.map((assignment: any, index: number) => (
                            <div key={index} className="p-2 bg-white border border-gray-300 rounded">
                              <p className="text-sm">
                                <strong>Vehicle:</strong> {assignment.vehicle_name || 'N/A'}
                              </p>
                              <p className="text-sm">
                                <strong>Driver:</strong> {assignment.driver_name || 'N/A'}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )
        )}
      </Card>

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