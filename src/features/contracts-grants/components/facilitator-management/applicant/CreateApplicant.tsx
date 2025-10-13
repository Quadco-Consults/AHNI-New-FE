"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "components/ui/form";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/FormSelect";
import FormTextArea from "components/FormTextArea";
import DateInput from "components/DateInput";
import FormButton from "@/components/FormButton";
import { Button } from "components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import Card from "components/Card";
import { Plus, Trash2 } from "lucide-react";
import {
  FacilitatorApplicantSchema,
  TFacilitatorApplicantFormData
} from "@/features/contracts-grants/types/contract-management/facilitator-management/facilitator-application";
import { useCreateFacilitatorApplicant } from "@/features/contracts-grants/controllers/facilitatorApplicantsController";
import { useGetSingleFacilitator } from "@/features/contracts-grants/controllers/facilitatorManagementController";
import { useGetAllContractRequests } from "@/features/contracts-grants/controllers/contractController";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { useGetAllLocations } from "@/features/modules/controllers/config/locationController";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { LoadingSpinner } from "components/Loading";
import { useEffect, useMemo, useState } from "react";
import { fileToBase64 } from "utils/fileToBase64";

export default function CreateFacilitatorApplicant() {
  const router = useRouter();
  const { id } = useParams();

  // Fetch facilitator data to get contract_request ID
  const { data: facilitatorData, isLoading: isFacilitatorLoading } = useGetSingleFacilitator(id as string, !!id);

  // Fetch contract requests for dropdown
  const { data: contractRequests } = useGetAllContractRequests({
    page: 1,
    size: 1000,
    enabled: true,
  });

  // Fetch projects for dropdown
  const { data: projects } = useGetAllProjects({
    page: 1,
    size: 1000,
  });

  // Fetch locations for dropdown
  const { data: locations } = useGetAllLocations({
    page: 1,
    size: 1000,
  });

  // Fetch users for technical monitor dropdown
  const { data: users } = useGetAllUsers({
    page: 1,
    size: 1000,
  });

  // Create contract request options for dropdown
  const contractRequestOptions = useMemo(() => {
    return contractRequests?.data?.results
      ?.filter((req: any) => req.request_type === 'FACILITATOR')
      ?.map((req: any) => ({
        label: req.title,
        value: req.id,
      })) || [];
  }, [contractRequests]);

  // Create project options for dropdown
  const projectOptions = useMemo(() => {
    return projects?.data?.results?.map((project: any) => ({
      label: project.title || project.name,
      value: project.id,
    })) || [];
  }, [projects]);

  // Create location options for dropdown
  const locationOptions = useMemo(() => {
    return locations?.data?.results?.map((location: any) => ({
      label: location.name || location.city,
      value: location.id,
    })) || [];
  }, [locations]);

  // Create user options for technical monitor dropdown
  const userOptions = useMemo(() => {
    return users?.data?.results?.map((user: any) => ({
      label: `${user.first_name} ${user.last_name}`,
      value: user.id,
    })) || [];
  }, [users]);

  const { createFacilitatorApplicant, isLoading } = useCreateFacilitatorApplicant();

  // State to manage file uploads
  const [documentFiles, setDocumentFiles] = useState<{ [key: number]: File | null }>({});

  // Handle file upload for documents
  const handleFileChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setDocumentFiles(prev => ({ ...prev, [index]: file }));
  };

  const form = useForm<TFacilitatorApplicantFormData>({
    resolver: zodResolver(FacilitatorApplicantSchema),
    defaultValues: {
      referees: [{ name: "", email: "", phone_number: "" }],
      documents: [{ document: "", name: "" }],
      contract_request: "",
      project: "",
      location: "",
      technical_monitor_user: "",
      name: "",
      contractor_name: "",
      email: "",
      phone_number: "",
      contract_number: "",
      position_under_contract: "",
      proposed_salary: "",
      place_of_birth: "",
      address: "",
      citizenship: "",
      gender: "",
      state_of_origin: "",
      start_duration_date: "",
      end_duration_date: "",
      education: "",
      language_proficiency: "",
      employment_history: "",
      special_consultant_services: "",
      status: "APPLIED",
      technical_monitor_partner_name: "",
      technical_monitor_partner_email: "",
      technical_monitor_partner_phone: "",
      offer_accepted: false,
      offer_acceptance_date: "",
      signature: "",
      health_facility: "",
      lga: "",
      spoke_site_name: "",
      qmap_backstop: "",
      programs_officer: "",
      stl: "",
      seo: "",
      lga2: "",
      cluster: "",
      account_name: "",
      bank_name: "",
      account_number: "",
      sort_code: "",
    },
  });

  // Pre-populate form fields from facilitator data when available
  useEffect(() => {
    if (facilitatorData?.data) {
      const facilitator = facilitatorData.data;

      // Pre-populate dates if available
      if (facilitator.commencement_date) {
        form.setValue("start_duration_date", facilitator.commencement_date);
      }
      if (facilitator.end_date) {
        form.setValue("end_duration_date", facilitator.end_date);
      }
    }
  }, [facilitatorData, form]);

  const { fields: refereeFields, append: appendReferee, remove: removeReferee } = useFieldArray({
    control: form.control,
    name: "referees",
  });

  const { fields: documentFields, append: appendDocument, remove: removeDocument } = useFieldArray({
    control: form.control,
    name: "documents",
  });

  const onSubmit = async (data: TFacilitatorApplicantFormData) => {
    try {
      console.log("Submitting facilitator applicant data:", data);

      // Validate that all documents have files uploaded
      const missingFiles = data.documents.some((_, index) => !documentFiles[index]);
      if (missingFiles) {
        toast.error("Please upload all required documents");
        return;
      }

      // Convert document files to base64
      const documentsWithBase64 = await Promise.all(
        data.documents.map(async (doc, index) => {
          const file = documentFiles[index];
          if (file) {
            const base64 = await fileToBase64(file);
            return { ...doc, document: base64 };
          }
          return doc;
        })
      );

      // Clean up optional fields - remove empty strings for optional datetime fields
      const cleanedData = {
        ...data,
        documents: documentsWithBase64,
        offer_acceptance_date: data.offer_acceptance_date || undefined,
        signature: data.signature || undefined,
      };

      await createFacilitatorApplicant(cleanedData);
      toast.success("Facilitator applicant created successfully");
      router.push(`/dashboard/c-and-g/facilitator-management/${id}/details`);
    } catch (error: any) {
      console.error("Error creating facilitator applicant:", error);
      toast.error(error?.message || "Something went wrong");
    }
  };

  if (isFacilitatorLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Facilitator Applicant</h1>
        <p className="text-gray-600">Fill in all the required information</p>
        {facilitatorData?.data && (
          <p className="text-sm text-gray-500 mt-1">
            Facilitator: {facilitatorData.data.title}
          </p>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error("Form validation errors:", errors);
          toast.error("Please fill in all required fields correctly");
        })} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Name"
                  name="name"
                  placeholder="Enter full name"
                  required
                />
                <FormInput
                  label="Contractor Name"
                  name="contractor_name"
                  placeholder="Enter contractor name"
                  required
                />
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  required
                />
                <FormInput
                  label="Phone Number"
                  name="phone_number"
                  type="number"
                  placeholder="Enter phone number"
                  required
                />
                <FormSelect
                  label="Gender"
                  name="gender"
                  placeholder="Select gender"
                  required
                  options={[
                    { value: "MALE", label: "Male" },
                    { value: "FEMALE", label: "Female" },
                    { value: "OTHER", label: "Other" },
                  ]}
                />
                <FormInput
                  label="Place of Birth"
                  name="place_of_birth"
                  placeholder="Enter place of birth"
                  required
                />
                <FormInput
                  label="Citizenship"
                  name="citizenship"
                  placeholder="Enter citizenship"
                  required
                />
                <FormInput
                  label="State of Origin"
                  name="state_of_origin"
                  placeholder="Enter state of origin"
                  required
                />
              </div>
              <FormTextArea
                label="Address"
                name="address"
                placeholder="Enter full address"
                required
              />
            </div>
          </Card>

          {/* Contract Details */}
          <Card>
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Contract Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                  label="Contract Request"
                  name="contract_request"
                  placeholder="Select contract request"
                  required
                  options={contractRequestOptions}
                />
                <FormInput
                  label="Contract Number"
                  name="contract_number"
                  type="number"
                  placeholder="Enter contract number"
                  required
                />
                <FormInput
                  label="Position Under Contract"
                  name="position_under_contract"
                  placeholder="Enter position"
                  required
                />
                <FormInput
                  label="Proposed Salary"
                  name="proposed_salary"
                  type="number"
                  placeholder="Enter proposed salary"
                  required
                />
                <FormSelect
                  label="Project"
                  name="project"
                  placeholder="Select project"
                  required
                  options={projectOptions}
                />
                <FormSelect
                  label="Location"
                  name="location"
                  placeholder="Select location"
                  required
                  options={locationOptions}
                />
                <FormSelect
                  label="Technical Monitor User"
                  name="technical_monitor_user"
                  placeholder="Select technical monitor"
                  required
                  options={userOptions}
                />
                <DateInput
                  label="Start Duration Date"
                  name="start_duration_date"
                  required
                />
                <DateInput
                  label="End Duration Date"
                  name="end_duration_date"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Professional Information */}
          <Card>
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
              <FormTextArea
                label="Education"
                name="education"
                placeholder="Enter educational background"
                required
              />
              <FormTextArea
                label="Language Proficiency"
                name="language_proficiency"
                placeholder="Enter language proficiency"
                required
              />
              <FormTextArea
                label="Employment History"
                name="employment_history"
                placeholder="Enter employment history"
                required
              />
              <FormTextArea
                label="Special Consultant Services"
                name="special_consultant_services"
                placeholder="Enter special consultant services"
                required
              />
            </div>
          </Card>

          {/* Technical Monitor Partner Information */}
          <Card>
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Technical Monitor Partner</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="Partner Name"
                  name="technical_monitor_partner_name"
                  placeholder="Enter partner name"
                  required
                />
                <FormInput
                  label="Partner Email"
                  name="technical_monitor_partner_email"
                  type="email"
                  placeholder="Enter partner email"
                  required
                />
                <FormInput
                  label="Partner Phone"
                  name="technical_monitor_partner_phone"
                  type="number"
                  placeholder="Enter partner phone"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Health Facility & Staff Details */}
          <Card>
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Health Facility & Staff Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Health Facility"
                  name="health_facility"
                  placeholder="Enter health facility"
                  required
                />
                <FormInput
                  label="LGA"
                  name="lga"
                  placeholder="Enter LGA"
                  required
                />
                <FormInput
                  label="LGA 2"
                  name="lga2"
                  placeholder="Enter LGA 2"
                  required
                />
                <FormInput
                  label="Spoke Site Name"
                  name="spoke_site_name"
                  placeholder="Enter spoke site name"
                  required
                />
                <FormInput
                  label="QMAP Backstop"
                  name="qmap_backstop"
                  placeholder="Enter QMAP backstop"
                  required
                />
                <FormInput
                  label="Programs Officer"
                  name="programs_officer"
                  placeholder="Enter programs officer"
                  required
                />
                <FormInput
                  label="STL"
                  name="stl"
                  placeholder="Enter STL"
                  required
                />
                <FormInput
                  label="SEO"
                  name="seo"
                  placeholder="Enter SEO"
                  required
                />
                <FormInput
                  label="Cluster"
                  name="cluster"
                  placeholder="Enter cluster"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Bank Details */}
          <Card>
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Bank Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Account Name"
                  name="account_name"
                  placeholder="Enter account name"
                  required
                />
                <FormInput
                  label="Bank Name"
                  name="bank_name"
                  placeholder="Enter bank name"
                  required
                />
                <FormInput
                  label="Account Number"
                  name="account_number"
                  type="number"
                  placeholder="Enter account number"
                  required
                />
                <FormInput
                  label="Sort Code"
                  name="sort_code"
                  type="number"
                  placeholder="Enter sort code"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Referees */}
          <Card>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Referees</h2>
                <Button
                  type="button"
                  onClick={() => appendReferee({ name: "", email: "", phone_number: "" })}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Referee
                </Button>
              </div>
              {refereeFields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded-lg relative">
                  {refereeFields.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeReferee(index)}
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput
                      label="Referee Name"
                      name={`referees.${index}.name`}
                      placeholder="Enter referee name"
                      required
                    />
                    <FormInput
                      label="Referee Email"
                      name={`referees.${index}.email`}
                      type="email"
                      placeholder="Enter referee email"
                      required
                    />
                    <FormInput
                      label="Referee Phone"
                      name={`referees.${index}.phone_number`}
                      type="number"
                      placeholder="Enter referee phone"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Documents */}
          <Card>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Documents</h2>
                <Button
                  type="button"
                  onClick={() => appendDocument({ document: "", name: "" })}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Document
                </Button>
              </div>
              {documentFields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded-lg relative">
                  {documentFields.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeDocument(index)}
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Document Name"
                      name={`documents.${index}.name`}
                      placeholder="Enter document name"
                      required
                    />
                    <div className="flex flex-col gap-y-2">
                      <label className="text-sm font-medium">
                        Upload Document <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleFileChange(index)}
                        className="border rounded-lg border-[#DBDFE9] p-2 cursor-pointer"
                      />
                      {documentFiles[index] && (
                        <p className="text-sm text-gray-600">
                          Selected: {documentFiles[index]?.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <FormButton loading={isLoading}>Create Applicant</FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
}
