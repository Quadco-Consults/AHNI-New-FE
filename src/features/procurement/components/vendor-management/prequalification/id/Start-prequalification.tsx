"use client";

import Card from "@/components/Card";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetAllVendorPrequalifications,
  useCreateVendorPrequalification,
} from "@/features/procurement/controllers/vendorPrequalificationController";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { z } from "zod";
import { VendorPrequalificationSchema } from "@/features/procurement/types/vendor-prequalification";
import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import { RouteEnum } from "@/constants/RouterConstants";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGetCurrentUser } from "@/features/auth/controllers/userController";
import { Textarea } from "@/components/ui/textarea";

type FormData = {
  passed: boolean;  // Changed from 'score' to 'passed' to match backend
  criteria: string;
  remark: string;
};

const StartPrequalification = () => {
  const [formData, setFormData] = useState<FormData[] | null>([]);
  const [showVendorDetails, setShowVendorDetails] = useState(false);

  const { id } = useParams();
  const router = useRouter();
  const { data: userData } = useGetCurrentUser();

  const { data: vendors, isLoading, error: fetchError } = useGetAllVendorPrequalifications({
    page: 1,
    size: 20,
    vendor: id as string,
  });

  const { createVendorPrequalification, isLoading: loading } =
    useCreateVendorPrequalification();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;  // Use 'name' instead of 'id' - name contains the criteria UUID
    // Convert value to boolean if it's a string representation of a boolean
    const booleanValue = value === "true" ? true : false;

    setFormData((prevData: FormData[] | null) => {
      // Ensure prevData is an array, fallback to an empty array if null
      const dataArray = prevData ?? [];

      // Check if the criteria already exists in the array
      const existingIndex = dataArray?.findIndex(
        (item) => item?.criteria === name
      );

      if (existingIndex !== -1) {
        // Update the passed status for the existing criteria
        const updatedData = [...dataArray];
        updatedData[existingIndex] = {
          ...updatedData[existingIndex],
          passed: booleanValue,
        };
        return updatedData;
      } else {
        // Add a new entry for the criteria
        return [...dataArray, { passed: booleanValue, criteria: name, remark: "" }];
      }
    });
  };

  const handleRemarkChange = (criteriaId: string, remarkText: string) => {
    setFormData((prevData: FormData[] | null) => {
      const dataArray = prevData ?? [];
      const existingIndex = dataArray?.findIndex(
        (item) => item?.criteria === criteriaId
      );

      if (existingIndex !== -1) {
        // Update the remark for existing criteria
        const updatedData = [...dataArray];
        updatedData[existingIndex] = {
          ...updatedData[existingIndex],
          remark: remarkText,
        };
        return updatedData;
      } else {
        // Create new entry with remark (no passed status yet)
        return [...dataArray, { passed: false, criteria: criteriaId, remark: remarkText }];
      }
    });
  };

  const form = useForm<z.infer<typeof VendorPrequalificationSchema>>({
    resolver: zodResolver(VendorPrequalificationSchema),
    defaultValues: {
      vendor: id,
      approved_categories: [],
    },
  });

  const onSubmit = async (
    data: z.infer<typeof VendorPrequalificationSchema>
  ) => {
    try {
      if (!vendors) {
        toast.error("Vendor data not loaded");
        return;
      }

      // Validate that all criteria have been evaluated
      if (!formData || formData.length !== vendors.categories?.length) {
        toast.error("Please evaluate all criteria before submitting");
        return;
      }

      const finalData = {
        vendor: data.vendor,
        financial_year: vendors?.financial_year_id,
        prequalifications: formData,
        approved_categories: data.approved_categories,
      };

      await createVendorPrequalification(finalData);
      toast.success("Vendor prequalification completed successfully!");
      router.push(RouteEnum.VENDOR_MANAGEMENT);
    } catch (error: any) {
      console.error("Prequalification submission error:", error);

      // Handle specific error cases
      if (error?.response?.status === 403) {
        toast.error("You are not authorized to prequalify this vendor");
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to submit prequalification. Please try again.");
      }
    }
  };

  return (
    <div className='space-y-5'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Procurement</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon='iconoir:slash' />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Prequalification</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon='iconoir:slash' />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Start Prequalification</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Button
        onClick={() => router.back()}
        variant='outline'
        className='gap-2 text-primary border-primary'
      >
        <span>
          <ArrowLeft size={15} />
        </span>
        View Vendor info
      </Button>

      {/* Assignment Status Banners */}
      {vendors?.assignment_info?.is_assigned && vendors?.assignment_info?.assigned_to === userData?.data?.id && (
        <Alert className="bg-blue-50 border-blue-200">
          <Icon icon="mdi:account-check" className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            This vendor is assigned to you. You can now complete the prequalification.
          </AlertDescription>
        </Alert>
      )}

      {vendors?.assignment_info?.is_assigned && vendors?.assignment_info?.assigned_to !== userData?.data?.id && (
        <Alert className="bg-red-50 border-red-200">
          <Icon icon="mdi:alert-circle" className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Vendor Already Assigned:</strong> This vendor is currently being prequalified by another procurement officer.
            {vendors?.assignment_info?.assigned_to_name && (
              <span> Assigned to: <strong>{vendors.assignment_info.assigned_to_name}</strong></span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {fetchError && (
        <Alert className="bg-red-50 border-red-200">
          <Icon icon="mdi:alert-circle" className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Error:</strong> {fetchError.message}
          </AlertDescription>
        </Alert>
      )}

      {isLoading && <LoadingSpinner />}

      {/* Vendor Summary Card at Top */}
      {vendors?.vendor && (
        <div className='space-y-4'>
          <div className='bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-lg p-5'>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <h2 className='text-2xl font-bold text-gray-900'>{vendors.vendor.company_name}</h2>
                <div className='mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                  <div>
                    <label className='text-gray-500 font-medium'>Registration #</label>
                    <p className='font-semibold'>{vendors.vendor.company_registration_number}</p>
                  </div>
                  <div>
                    <label className='text-gray-500 font-medium'>TIN</label>
                    <p className='font-semibold'>{vendors.vendor.tin}</p>
                  </div>
                  <div>
                    <label className='text-gray-500 font-medium'>Business Type</label>
                    <p className='font-semibold'>{vendors.vendor.type_of_business}</p>
                  </div>
                  <div>
                    <label className='text-gray-500 font-medium'>State</label>
                    <p className='font-semibold'>{vendors.vendor.state || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => setShowVendorDetails(!showVendorDetails)}
                variant='outline'
                className='ml-4'
              >
                {showVendorDetails ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Hide Full Details
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    View Full Details
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Collapsible Full Vendor Details */}
          {showVendorDetails && (
            <div className='space-y-4 animate-in slide-in-from-top-2'>
              {/* Company Information */}
              <div className='bg-white border shadow-sm rounded-xl'>
                <div className='p-4 bg-gray-50 border-b'>
                  <h3 className='font-bold text-lg flex items-center gap-2'>
                    <Icon icon="mdi:office-building" className="w-5 h-5 text-blue-600" />
                    Company Information
                  </h3>
                </div>
                <div className='p-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div>
                    <label className='text-xs font-medium text-gray-500 uppercase'>Company Name</label>
                    <p className='text-sm font-semibold mt-1'>{vendors.vendor.company_name}</p>
                  </div>
                  <div>
                    <label className='text-xs font-medium text-gray-500 uppercase'>Registration Number</label>
                    <p className='text-sm mt-1'>{vendors.vendor.company_registration_number}</p>
                  </div>
                  <div>
                    <label className='text-xs font-medium text-gray-500 uppercase'>Year of Incorporation</label>
                    <p className='text-sm mt-1'>{vendors.vendor.year_or_incorperation}</p>
                  </div>
                  <div>
                    <label className='text-xs font-medium text-gray-500 uppercase'>Business Type</label>
                    <p className='text-sm mt-1'>{vendors.vendor.type_of_business}</p>
                  </div>
                  <div>
                    <label className='text-xs font-medium text-gray-500 uppercase'>TIN</label>
                    <p className='text-sm mt-1'>{vendors.vendor.tin}</p>
                  </div>
                  <div>
                    <label className='text-xs font-medium text-gray-500 uppercase'>Chairman</label>
                    <p className='text-sm mt-1'>{vendors.vendor.company_chairman || 'N/A'}</p>
                  </div>
                  <div className='md:col-span-3'>
                    <label className='text-xs font-medium text-gray-500 uppercase'>Nature of Business</label>
                    <p className='text-sm mt-1'>{vendors.vendor.nature_of_business || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className='bg-white border shadow-sm rounded-xl'>
                <div className='p-4 bg-gray-50 border-b'>
                  <h3 className='font-bold text-lg flex items-center gap-2'>
                    <Icon icon="mdi:contacts" className="w-5 h-5 text-blue-600" />
                    Contact Information
                  </h3>
                </div>
                <div className='p-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div>
                    <label className='text-xs font-medium text-gray-500 uppercase'>Email</label>
                    <p className='text-sm mt-1'>{vendors.vendor.email}</p>
                  </div>
                  <div>
                    <label className='text-xs font-medium text-gray-500 uppercase'>Phone Numbers</label>
                    <p className='text-sm mt-1'>{vendors.vendor.phone_numbers || 'N/A'}</p>
                  </div>
                  <div>
                    <label className='text-xs font-medium text-gray-500 uppercase'>Website</label>
                    <p className='text-sm mt-1'>{vendors.vendor.website || 'N/A'}</p>
                  </div>
                  <div>
                    <label className='text-xs font-medium text-gray-500 uppercase'>State</label>
                    <p className='text-sm mt-1'>{vendors.vendor.state || 'N/A'}</p>
                  </div>
                  <div className='md:col-span-2'>
                    <label className='text-xs font-medium text-gray-500 uppercase'>Company Address</label>
                    <p className='text-sm mt-1'>{vendors.vendor.company_address}</p>
                  </div>
                </div>
              </div>

              {/* Banking Information */}
              <div className='bg-white border shadow-sm rounded-xl'>
                <div className='p-4 bg-gray-50 border-b'>
                  <h3 className='font-bold text-lg flex items-center gap-2'>
                    <Icon icon="mdi:bank" className="w-5 h-5 text-blue-600" />
                    Banking & Financial Information
                  </h3>
                </div>
                <div className='p-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='text-xs font-medium text-gray-500 uppercase'>Account Name</label>
                    <p className='text-sm mt-1'>{vendors.vendor.account_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className='text-xs font-medium text-gray-500 uppercase'>Account Number</label>
                    <p className='text-sm mt-1'>{vendors.vendor.account_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label className='text-xs font-medium text-gray-500 uppercase'>Bank Name</label>
                    <p className='text-sm mt-1'>{vendors.vendor.bank_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className='text-xs font-medium text-gray-500 uppercase'>Bank Address</label>
                    <p className='text-sm mt-1'>{vendors.vendor.bank_address || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* All Uploaded Documents */}
              {vendors.vendor.vendor_documents && vendors.vendor.vendor_documents.length > 0 && (
                <div className='bg-white border shadow-sm rounded-xl'>
                  <div className='p-4 bg-gray-50 border-b'>
                    <h3 className='font-bold text-lg flex items-center gap-2'>
                      <Icon icon="mdi:file-document-multiple" className="w-5 h-5 text-blue-600" />
                      All Uploaded Documents ({vendors.vendor.vendor_documents.length})
                    </h3>
                  </div>
                  <div className='p-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                      {vendors.vendor.vendor_documents.map((doc: any) => (
                        <div key={doc.id} className='border rounded-lg p-3 hover:bg-gray-50 transition'>
                          <div className='flex items-start justify-between'>
                            <div className='flex-1'>
                              <div className='flex items-center gap-2 mb-1'>
                                <Icon icon="mdi:file-pdf-box" className="w-4 h-4 text-red-500" />
                                <h4 className='font-semibold text-sm'>{doc.title}</h4>
                              </div>
                              <p className='text-xs text-gray-600 mb-1'>{doc.document_type}</p>
                              {doc.description && (
                                <p className='text-xs text-gray-500 mb-1'>{doc.description}</p>
                              )}
                              <p className='text-xs text-gray-400'>
                                {new Date(doc.uploaded_datetime).toLocaleDateString()}
                              </p>
                            </div>
                            <div className='flex flex-col gap-1 ml-3'>
                              {doc.files.map((file: any, idx: number) => (
                                <a
                                  key={file.id}
                                  href={file.file_url}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs whitespace-nowrap'
                                >
                                  <Icon icon="mdi:eye" className="w-3 h-3" />
                                  View
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Key Clients */}
              {vendors.vendor.key_client && vendors.vendor.key_client.length > 0 && (
                <div className='bg-white border shadow-sm rounded-xl'>
                  <div className='p-4 bg-gray-50 border-b'>
                    <h3 className='font-bold text-lg flex items-center gap-2'>
                      <Icon icon="mdi:account-group" className="w-5 h-5 text-blue-600" />
                      Key Clients & References
                    </h3>
                  </div>
                  <div className='p-4 overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase'>Client Name</th>
                          <th className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase'>Contact</th>
                          <th className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase'>Projects</th>
                          <th className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase'>Value</th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        {vendors.vendor.key_client.map((client: any, idx: number) => (
                          <tr key={idx}>
                            <td className='px-3 py-2 text-sm'>{client.name}</td>
                            <td className='px-3 py-2 text-sm'>{client.contact || 'N/A'}</td>
                            <td className='px-3 py-2 text-sm'>{client.projects || 'N/A'}</td>
                            <td className='px-3 py-2 text-sm'>{client.value || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Shareholders */}
              {vendors.vendor.share_holders && vendors.vendor.share_holders.length > 0 && (
                <div className='bg-white border shadow-sm rounded-xl'>
                  <div className='p-4 bg-gray-50 border-b'>
                    <h3 className='font-bold text-lg flex items-center gap-2'>
                      <Icon icon="mdi:account-cash" className="w-5 h-5 text-blue-600" />
                      Shareholders
                    </h3>
                  </div>
                  <div className='p-4 overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase'>Name</th>
                          <th className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase'>Shares</th>
                          <th className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase'>Nationality</th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        {vendors.vendor.share_holders.map((shareholder: any, idx: number) => (
                          <tr key={idx}>
                            <td className='px-3 py-2 text-sm'>{shareholder.name}</td>
                            <td className='px-3 py-2 text-sm'>{shareholder.shares}</td>
                            <td className='px-3 py-2 text-sm'>{shareholder.nationality || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Key Staff */}
              {vendors.vendor.key_staff && vendors.vendor.key_staff.length > 0 && (
                <div className='bg-white border shadow-sm rounded-xl'>
                  <div className='p-4 bg-gray-50 border-b'>
                    <h3 className='font-bold text-lg flex items-center gap-2'>
                      <Icon icon="mdi:account-tie" className="w-5 h-5 text-blue-600" />
                      Key Staff
                    </h3>
                  </div>
                  <div className='p-4 overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase'>Name</th>
                          <th className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase'>Position</th>
                          <th className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase'>Qualification</th>
                          <th className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase'>Experience</th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        {vendors.vendor.key_staff.map((staff: any, idx: number) => (
                          <tr key={idx}>
                            <td className='px-3 py-2 text-sm'>{staff.name}</td>
                            <td className='px-3 py-2 text-sm'>{staff.position}</td>
                            <td className='px-3 py-2 text-sm'>{staff.qualification || 'N/A'}</td>
                            <td className='px-3 py-2 text-sm'>{staff.experience || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Branches */}
              {vendors.vendor.branches && vendors.vendor.branches.length > 0 && (
                <div className='bg-white border shadow-sm rounded-xl'>
                  <div className='p-4 bg-gray-50 border-b'>
                    <h3 className='font-bold text-lg flex items-center gap-2'>
                      <Icon icon="mdi:office-building-marker" className="w-5 h-5 text-blue-600" />
                      Branch Locations
                    </h3>
                  </div>
                  <div className='p-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                      {vendors.vendor.branches.map((branch: any, idx: number) => (
                        <div key={idx} className='border-l-4 border-blue-300 pl-3 py-2'>
                          <p className='font-semibold text-sm'>{branch.state}</p>
                          <p className='text-xs text-gray-600'>{branch.address}</p>
                          {branch.phone && (
                            <p className='text-xs text-gray-500 mt-1'>
                              <Icon icon="mdi:phone" className="w-3 h-3 inline mr-1" />
                              {branch.phone}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Technical Capacity */}
              {(vendors.vendor.installed_capacity || vendors.vendor.brief_of_quality_control || vendors.vendor.production_equipments?.length > 0) && (
                <div className='bg-white border shadow-sm rounded-xl'>
                  <div className='p-4 bg-gray-50 border-b'>
                    <h3 className='font-bold text-lg flex items-center gap-2'>
                      <Icon icon="mdi:factory" className="w-5 h-5 text-blue-600" />
                      Technical Capacity
                    </h3>
                  </div>
                  <div className='p-4 space-y-3'>
                    {vendors.vendor.installed_capacity && (
                      <div>
                        <label className='text-xs font-medium text-gray-500 uppercase'>Installed Capacity</label>
                        <p className='text-sm mt-1'>{vendors.vendor.installed_capacity}</p>
                      </div>
                    )}
                    {vendors.vendor.lagest_capacity_and_utilization && (
                      <div>
                        <label className='text-xs font-medium text-gray-500 uppercase'>Largest Capacity & Utilization</label>
                        <p className='text-sm mt-1'>{vendors.vendor.lagest_capacity_and_utilization}</p>
                      </div>
                    )}
                    {vendors.vendor.number_of_operational_work_shift && (
                      <div>
                        <label className='text-xs font-medium text-gray-500 uppercase'>Operational Work Shifts</label>
                        <p className='text-sm mt-1'>{vendors.vendor.number_of_operational_work_shift}</p>
                      </div>
                    )}
                    {vendors.vendor.brief_of_quality_control && (
                      <div>
                        <label className='text-xs font-medium text-gray-500 uppercase'>Quality Control</label>
                        <p className='text-sm mt-1'>{vendors.vendor.brief_of_quality_control}</p>
                      </div>
                    )}
                    {vendors.vendor.brief_of_sampling && (
                      <div>
                        <label className='text-xs font-medium text-gray-500 uppercase'>Sampling Procedures</label>
                        <p className='text-sm mt-1'>{vendors.vendor.brief_of_sampling}</p>
                      </div>
                    )}
                    {vendors.vendor.production_equipments && vendors.vendor.production_equipments.length > 0 && (
                      <div>
                        <label className='text-xs font-medium text-gray-500 uppercase'>Production Equipment</label>
                        <div className='mt-2 space-y-2'>
                          {vendors.vendor.production_equipments.map((equipment: any, idx: number) => (
                            <div key={idx} className='text-sm border-l-2 border-gray-300 pl-3'>
                              <p className='font-semibold'>{equipment.name}</p>
                              {equipment.quantity && <p className='text-xs text-gray-600'>Quantity: {equipment.quantity}</p>}
                              {equipment.capacity && <p className='text-xs text-gray-600'>Capacity: {equipment.capacity}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* EOI Criteria Evaluation Section */}
      <div className='bg-blue-50 border-l-4 border-blue-500 p-4 my-6'>
        <h2 className='font-bold text-xl flex items-center gap-2 text-blue-900'>
          <Icon icon="mdi:clipboard-check" className="w-6 h-6" />
          EOI Vendor Registration - 14-Point Checklist Evaluation
        </h2>
        <p className='text-sm text-blue-700 mt-1'>
          For each criterion, review what the vendor submitted and evaluate Pass/Fail.
        </p>
      </div>

      {vendors?.categories?.map((criteria: any, index: number) => {
        const currentRemark = formData?.find(item => item.criteria === criteria.id)?.remark || "";

        // Helper function to find related documents
        const getRelatedDocuments = (criteriaName: string) => {
          if (!vendors.vendor.vendor_documents) return [];

          const nameUpper = criteriaName.toUpperCase();
          if (nameUpper.includes('TAX CLEARANCE') || nameUpper.includes('CRITERION 4')) {
            return vendors.vendor.vendor_documents.filter((doc: any) =>
              doc.document_type?.includes('Tax Clearance')
            );
          }
          if (nameUpper.includes('TIN') || nameUpper.includes('CRITERION 5')) {
            return vendors.vendor.vendor_documents.filter((doc: any) =>
              doc.document_type?.includes('Tin Slip')
            );
          }
          if (nameUpper.includes('CAC') || nameUpper.includes('REGISTRATION')) {
            return vendors.vendor.vendor_documents.filter((doc: any) =>
              doc.document_type?.includes('CAC')
            );
          }
          if (nameUpper.includes('AUDITED') || nameUpper.includes('FINANCIAL')) {
            return vendors.vendor.vendor_documents.filter((doc: any) =>
              doc.document_type?.includes('Audited Financial Account')
            );
          }
          if (nameUpper.includes('BANK REFERENCE')) {
            return vendors.vendor.vendor_documents.filter((doc: any) =>
              doc.document_type?.includes('Bank Reference Letter')
            );
          }
          if (nameUpper.includes('JOB') || nameUpper.includes('DELIVERY')) {
            return vendors.vendor.vendor_documents.filter((doc: any) =>
              doc.document_type?.includes('Job Orders') || doc.document_type?.includes('Job Delivery Receipt')
            );
          }
          return [];
        };

        const relatedDocs = getRelatedDocuments(criteria.name);

        return (
          <div
            key={criteria.id}
            className='bg-white border-2 border-gray-200 shadow-sm rounded-xl'
          >
            {/* Criterion Header */}
            <div className='bg-gray-50 p-5 border-b-2 border-gray-200'>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex-1'>
                  <div className='flex items-center gap-3 mb-2'>
                    <span className='flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm'>
                      {criteria.display_order}
                    </span>
                    <h4 className='font-bold text-lg text-gray-900'>{criteria.name}</h4>
                  </div>
                  <p className='text-sm text-gray-600 ml-11'>{criteria.description}</p>
                  <div className='flex flex-wrap gap-2 ml-11 mt-2'>
                    {criteria.is_mandatory && (
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                        <Icon icon="mdi:alert-circle" className="w-3 h-3 mr-1" />
                        NON-NEGOTIABLE
                      </span>
                    )}
                    {criteria.exempted_for_small_business && (
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                        <Icon icon="mdi:information" className="w-3 h-3 mr-1" />
                        Exempted for Small Businesses
                      </span>
                    )}
                    {criteria.required_for_small_business && (
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800'>
                        <Icon icon="mdi:star" className="w-3 h-3 mr-1" />
                        Required for Small Businesses
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* What Vendor Submitted */}
            <div className='p-5 bg-yellow-50 border-b border-yellow-200'>
              <h3 className='font-semibold text-base text-gray-900 mb-3 flex items-center gap-2'>
                <Icon icon="mdi:file-document-check" className="w-5 h-5 text-yellow-600" />
                What Vendor Submitted:
              </h3>

              {relatedDocs.length > 0 ? (
                <div className='space-y-2'>
                  {relatedDocs.map((doc: any) => (
                    <div key={doc.id} className='bg-white border border-yellow-300 rounded-lg p-3'>
                      <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                          <div className='flex items-center gap-2 mb-1'>
                            <Icon icon="mdi:file-pdf-box" className="w-5 h-5 text-red-500" />
                            <h4 className='font-semibold text-sm'>{doc.title}</h4>
                          </div>
                          <p className='text-xs text-gray-500'>{doc.document_type}</p>
                          {doc.description && (
                            <p className='text-xs text-gray-600 mt-1'>{doc.description}</p>
                          )}
                          <p className='text-xs text-gray-400 mt-1'>
                            Uploaded: {new Date(doc.uploaded_datetime).toLocaleDateString()}
                          </p>
                        </div>
                        <div className='flex flex-col gap-2 ml-4'>
                          {doc.files.map((file: any, idx: number) => (
                            <a
                              key={file.id}
                              href={file.file_url}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs whitespace-nowrap'
                            >
                              <Icon icon="mdi:eye" className="w-4 h-4" />
                              View
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='bg-white border border-yellow-300 rounded-lg p-4 text-center'>
                  <Icon icon="mdi:information-outline" className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className='text-sm text-gray-500'>
                    No specific documents found. Review general vendor information and other submitted documents.
                  </p>
                </div>
              )}

              {/* Show relevant vendor info for specific criteria */}
              {criteria.name.toLowerCase().includes('company profile') && (
                <div className='mt-3 bg-white border border-yellow-300 rounded-lg p-3'>
                  <div className='grid grid-cols-2 gap-3 text-sm'>
                    <div>
                      <label className='text-gray-500 font-medium'>Company Name:</label>
                      <p className='font-semibold'>{vendors.vendor.company_name}</p>
                    </div>
                    <div>
                      <label className='text-gray-500 font-medium'>Registration #:</label>
                      <p className='font-semibold'>{vendors.vendor.company_registration_number}</p>
                    </div>
                    <div>
                      <label className='text-gray-500 font-medium'>Year Incorporated:</label>
                      <p className='font-semibold'>{vendors.vendor.year_or_incorperation}</p>
                    </div>
                    <div>
                      <label className='text-gray-500 font-medium'>Business Type:</label>
                      <p className='font-semibold'>{vendors.vendor.type_of_business}</p>
                    </div>
                  </div>
                </div>
              )}

              {criteria.name.toLowerCase().includes('bank') && (
                <div className='mt-3 bg-white border border-yellow-300 rounded-lg p-3'>
                  <div className='grid grid-cols-2 gap-3 text-sm'>
                    <div>
                      <label className='text-gray-500 font-medium'>Account Name:</label>
                      <p className='font-semibold'>{vendors.vendor.account_name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className='text-gray-500 font-medium'>Account Number:</label>
                      <p className='font-semibold'>{vendors.vendor.account_number || 'N/A'}</p>
                    </div>
                    <div>
                      <label className='text-gray-500 font-medium'>Bank Name:</label>
                      <p className='font-semibold'>{vendors.vendor.bank_name || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              {criteria.name.toLowerCase().includes('reference') && vendors.vendor.key_client?.length > 0 && (
                <div className='mt-3 bg-white border border-yellow-300 rounded-lg p-3'>
                  <h4 className='font-semibold text-sm mb-2'>Key Client References:</h4>
                  <div className='space-y-2'>
                    {vendors.vendor.key_client.slice(0, 3).map((client: any, idx: number) => (
                      <div key={idx} className='text-sm border-l-2 border-blue-300 pl-3'>
                        <p className='font-semibold'>{client.name}</p>
                        <p className='text-xs text-gray-600'>{client.projects || 'Project details not provided'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Evaluation Section */}
            <div className='p-5'>
              <Card className='border-2 border-blue-200 bg-blue-50'>
                <div className='space-y-4'>
                  <div className='flex gap-5 items-center'>
                    <span className='text-sm font-semibold text-gray-900'>Your Evaluation:</span>
                    <div className='flex gap-5'>
                      <div className='flex items-center space-x-2'>
                        <input
                          type='radio'
                          id={`${criteria.id}-pass`}
                          value='true'
                          className='accent-green-500 w-5 h-5 cursor-pointer'
                          name={criteria.id}
                          onChange={handleInputChange}
                          defaultChecked={criteria.score === true}
                        />
                        <label htmlFor={`${criteria.id}-pass`} className='text-base font-semibold text-green-700 cursor-pointer'>
                          ✓ Pass
                        </label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <input
                          type='radio'
                          id={`${criteria.id}-fail`}
                          value='false'
                          name={criteria.id}
                          className='accent-red-500 w-5 h-5 cursor-pointer'
                          onChange={handleInputChange}
                          defaultChecked={criteria.score === false && criteria.remark !== ""}
                        />
                        <label htmlFor={`${criteria.id}-fail`} className='text-base font-semibold text-red-700 cursor-pointer'>
                          ✗ Fail
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <label htmlFor={`remark-${criteria.id}`} className='text-sm font-medium text-gray-700'>
                      Evaluation Notes (Optional)
                    </label>
                    <Textarea
                      id={`remark-${criteria.id}`}
                      placeholder="Add any notes or justification for your evaluation..."
                      className='min-h-[80px] bg-white'
                      value={currentRemark}
                      onChange={(e) => handleRemarkChange(criteria.id, e.target.value)}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );
      })}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
            <div className='p-5 '>
              <h4 className='font-bold text-lg'>Selected Category</h4>
            </div>

            <hr />

            <div className='p-5'>
              <Card className='space-y-5 border-yellow-darker'>
                <FormField
                  control={form.control}
                  name='approved_categories'
                  render={() => (
                    <FormItem className='space-y-6'>
                      {vendors?.vendor.submitted_categories.map((category) => (
                        <FormField
                          key={category?.id}
                          control={form.control}
                          name='approved_categories'
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={category?.id}
                                className='flex gap-2 justify-between'
                              >
                                <div className='space-y-2'>
                                  <h2 className='font-semibold'>
                                    {category.code}
                                  </h2>
                                  <h6 className='font-light'>
                                    {category.description}
                                  </h6>
                                </div>
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(
                                      category?.id
                                    )}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            category?.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== category?.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </FormItem>
                  )}
                />
              </Card>
            </div>
          </div>

          <div className='flex mt-10 justify-end'>
            <FormButton loading={loading} disabled={loading} type='submit'>
              Finish
            </FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StartPrequalification;
