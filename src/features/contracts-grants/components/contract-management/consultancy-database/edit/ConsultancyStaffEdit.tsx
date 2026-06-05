"use client";

import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useMemo } from "react";
import Card from "@/components/Card";
import BackNavigation from "@/components/BackNavigation";
import { LoadingSpinner } from "@/components/Loading";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormTextArea from "@/components/FormTextArea";
import FormSelect from "@/components/FormSelect";
import { Form } from "@/components/ui/form";
import { useGetSingleConsultancyApplicant, useUpdateConsultancyApplicant } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useGetAllFacilities } from "@/features/modules/controllers/program/facilityController";

// Validation schema
const EditConsultantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contractor_name: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(1, "Phone number is required"),
  position_under_contract: z.string().optional(),
  contract_number: z.string().optional(),
  proposed_salary: z.string().optional(),
  place_of_birth: z.string().optional(),
  address: z.string().optional(),
  citizenship: z.string().optional(),

  // Adhoc-specific fields
  gender: z.string().optional(),
  state_of_origin: z.string().optional(),
  health_facility: z.string().optional(),
  spoke_site_name: z.string().optional(),
  lga: z.string().optional(),

  // Supervisory fields
  qmap_backstop: z.string().optional(),
  programs_officer: z.string().optional(),
  stl: z.string().optional(),
  seo: z.string().optional(),

  // Banking fields
  account_name: z.string().optional(),
  bank_name: z.string().optional(),
  account_number: z.string().optional(),
  sort_code: z.string().optional(),
  tax_identification_number: z.string().optional(),

  // Facilitator fields
  qualifications: z.string().optional(),
  experience: z.string().optional(),
});

type TEditConsultantFormData = z.infer<typeof EditConsultantSchema>;

export default function ConsultancyStaffEdit() {
  const params = useParams();
  const router = useRouter();
  const consultantId = params?.id as string;

  // Fetch consultant data
  const { data: consultantResponse, isLoading: isFetchingData, error } = useGetSingleConsultancyApplicant(consultantId);
  const consultant = consultantResponse?.data;

  // Update mutation
  const { updateConsultancyApplicant, isLoading: isUpdating } = useUpdateConsultancyApplicant(consultantId);

  // Fetch all users for staff dropdowns (Programs Officer, STL)
  const { data: usersData } = useGetAllUsers({ page: 1, size: 1000 });

  // Fetch all facilities for cluster dropdown
  const { data: facilitiesData } = useGetAllFacilities({ page: 1, size: 1000 });

  // Transform users for staff dropdowns
  const staffOptions = useMemo(() => {
    const users = usersData?.data?.results || [];
    return users.map(user => ({
      label: `${user.first_name} ${user.last_name}${user.employee_id ? ` (${user.employee_id})` : ''}`,
      value: user.id
    }));
  }, [usersData]);


  const form = useForm<TEditConsultantFormData>({
    resolver: zodResolver(EditConsultantSchema),
    defaultValues: {
      name: "",
      contractor_name: "",
      email: "",
      phone_number: "",
      position_under_contract: "",
      contract_number: "",
      proposed_salary: "",
      place_of_birth: "",
      address: "",
      citizenship: "",
      gender: "",
      state_of_origin: "",
      health_facility: "",
      spoke_site_name: "",
      lga: "",
      qmap_backstop: "",
      programs_officer: "",
      stl: "",
      seo: "",
      account_name: "",
      bank_name: "",
      account_number: "",
      sort_code: "",
      tax_identification_number: "",
      qualifications: "",
      experience: "",
    },
  });

  // Populate form when data loads
  useEffect(() => {
    if (consultant) {
      form.reset({
        name: consultant.name || "",
        contractor_name: consultant.contractor_name || "",
        email: consultant.email || "",
        phone_number: consultant.phone_number || "",
        position_under_contract: consultant.position_under_contract || "",
        contract_number: consultant.contract_number || "",
        proposed_salary: consultant.proposed_salary?.toString() || "",
        place_of_birth: consultant.place_of_birth || "",
        address: consultant.address || "",
        citizenship: consultant.citizenship || "",
        gender: consultant.gender || "",
        state_of_origin: consultant.state_of_origin || "",
        health_facility: consultant.health_facility || "",
        spoke_site_name: consultant.spoke_site_name || "",
        lga: consultant.lga || "",
        qmap_backstop: consultant.qmap_backstop || "",
        programs_officer: consultant.programs_officer || "",
        stl: consultant.stl || "",
        seo: consultant.seo || "",
        account_name: consultant.account_name || "",
        bank_name: consultant.bank_name || "",
        account_number: consultant.account_number || "",
        sort_code: consultant.sort_code || "",
        tax_identification_number: consultant.tax_identification_number || "",
        qualifications: consultant.qualifications || "",
        experience: consultant.experience || "",
      });
    }
  }, [consultant, form]);

  const onSubmit: SubmitHandler<TEditConsultantFormData> = async (data) => {
    try {
      await updateConsultancyApplicant(data as any);
      toast.success("Consultant updated successfully");
      router.push(`/dashboard/c-and-g/consultancy-database/${consultantId}/view`);
    } catch (error) {
      toast.error("Failed to update consultant");
      console.error(error);
    }
  };

  if (isFetchingData) {
    return <LoadingSpinner />;
  }

  if (error || !consultant) {
    return (
      <div className="p-6">
        <BackNavigation />
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Consultant Not Found</h2>
          <p className="text-gray-600">The requested consultant could not be found.</p>
        </Card>
      </div>
    );
  }

  const genderOptions = [
    { label: "Male", value: "MALE" },
    { label: "Female", value: "FEMALE" },
  ];

  return (
    <div className="space-y-6">
      <BackNavigation />

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Consultant</h1>
            <p className="text-gray-600 mt-1">{consultant.name}</p>
          </div>
        </div>
      </Card>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold text-[#DEA004]">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  form={form}
                  name="name"
                  label="Full Name"
                  placeholder="Full Name"
                  required
                />
                <FormInput
                  form={form}
                  name="contractor_name"
                  label="Contractor Name"
                  placeholder="Contractor Name"
                />
                <FormInput
                  form={form}
                  name="email"
                  label="Email Address"
                  placeholder="email@example.com"
                  required
                />
                <FormInput
                  form={form}
                  name="phone_number"
                  label="Phone Number"
                  placeholder="08012345678"
                  required
                />
                <FormInput
                  form={form}
                  name="place_of_birth"
                  label="Place of Birth"
                  placeholder="City, Country"
                />
                <FormInput
                  form={form}
                  name="citizenship"
                  label="Citizenship"
                  placeholder="Nationality"
                />
                <FormTextArea
                  form={form}
                  name="address"
                  label="Address"
                  placeholder="Full Address"
                  rows={2}
                />
              </div>
            </div>

            {/* Contract Information */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold text-[#DEA004]">Contract Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  form={form}
                  name="position_under_contract"
                  label="Position"
                  placeholder="Job Position"
                />
                <FormInput
                  form={form}
                  name="contract_number"
                  label="Contract Number"
                  placeholder="Contract Number"
                />
                <FormInput
                  form={form}
                  name="proposed_salary"
                  label="Proposed Salary"
                  placeholder="0.00"
                  type="number"
                />
              </div>
            </div>

            {/* Assignment Details */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold text-[#DEA004]">Assignment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  form={form}
                  name="health_facility"
                  label="Health Facility"
                  placeholder="Health Facility/Assignment Location"
                />
                <FormInput
                  form={form}
                  name="spoke_site_name"
                  label="Spoke Site Name"
                  placeholder="Spoke Site"
                />
                <FormInput
                  form={form}
                  name="lga"
                  label="LGA"
                  placeholder="Local Government Area"
                />
                <FormInput
                  form={form}
                  name="state_of_origin"
                  label="State of Origin"
                  placeholder="State"
                />
                <FormSelect
                  form={form}
                  name="gender"
                  label="Gender"
                  placeholder="Select gender"
                  options={genderOptions}
                />
              </div>
            </div>

            {/* Supervisory Information */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold text-[#DEA004]">Supervisory Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  form={form}
                  name="qmap_backstop"
                  label="QMAP Backstop"
                  placeholder="QMAP Backstop"
                />
                <FormSelect
                  form={form}
                  name="programs_officer"
                  label="Programs Officer"
                  placeholder="Select Programs Officer"
                  options={staffOptions}
                />
                <FormSelect
                  form={form}
                  name="stl"
                  label="STL"
                  placeholder="Select STL"
                  options={staffOptions}
                />
                <FormInput
                  form={form}
                  name="seo"
                  label="SEO"
                  placeholder="SEO"
                />
              </div>
            </div>

            {/* Banking Information */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold text-[#DEA004]">Banking Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  form={form}
                  name="account_name"
                  label="Account Name"
                  placeholder="Account Name"
                />
                <FormInput
                  form={form}
                  name="bank_name"
                  label="Bank Name"
                  placeholder="Bank Name"
                />
                <FormInput
                  form={form}
                  name="account_number"
                  label="Account Number"
                  placeholder="Account Number"
                />
                <FormInput
                  form={form}
                  name="sort_code"
                  label="Sort Code"
                  placeholder="Sort Code"
                />
                <FormInput
                  form={form}
                  name="tax_identification_number"
                  label="Tax Identification Number (TIN)"
                  placeholder="TIN"
                />
              </div>
            </div>

            {/* Professional Background (Facilitators) */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold text-[#DEA004]">Professional Background</h3>
              <div className="grid grid-cols-1 gap-4">
                <FormTextArea
                  form={form}
                  name="qualifications"
                  label="Qualifications"
                  placeholder="Educational qualifications and certifications"
                  rows={3}
                />
                <FormTextArea
                  form={form}
                  name="experience"
                  label="Experience"
                  placeholder="Relevant work experience"
                  rows={3}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <FormButton
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isUpdating}
              >
                Cancel
              </FormButton>
              <FormButton type="submit" isLoading={isUpdating}>
                Save Changes
              </FormButton>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
