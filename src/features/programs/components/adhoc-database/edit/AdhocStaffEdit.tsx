"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Card from "components/Card";
import BackNavigation from "components/BackNavigation";
import { LoadingSpinner } from "components/Loading";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import FormButton from "@/components/FormButton";
import { toast } from "sonner";
import { AdhocStaffSchema, TAdhocStaffFormData } from "@/features/programs/types/adhoc-staff";
import { useGetSingleConsultancyApplicant, useUpdateConsultancyApplicant } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { useEffect } from "react";

// Gender options
const genderOptions = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
];

export default function AdhocStaffEdit() {
  const params = useParams();
  const router = useRouter();
  const staffId = params?.id as string;

  // Fetch consultancy applicant data
  const { data: applicantResponse, isLoading: isFetchLoading, error } = useGetSingleConsultancyApplicant(staffId);
  const { updateConsultancyApplicant, isLoading: isUpdateLoading } = useUpdateConsultancyApplicant(staffId);

  const applicant = applicantResponse?.data;

  // Transform applicant data to form structure
  const nameParts = applicant?.name?.split(' ') || [];
  const surname = nameParts[0] || '';
  const otherNames = nameParts.slice(1).join(' ') || '';

  const qualifications = applicant?.education
    ?.map(edu => edu.degree || edu.major)
    .filter(Boolean)
    .join(', ') || '';

  const form = useForm<TAdhocStaffFormData>({
    resolver: zodResolver(AdhocStaffSchema),
    defaultValues: {
      sur_name: "",
      other_names: "",
      gender: "MALE",
      state_of_origin: "",
      designation: "",
      phone_number: "",
      email_address: "",
      qualifications: "",
      health_facility: "",
      spoke_site_name: "",
      lga: "",
      status_of_adhoc_staff: "",
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

  // Update form when applicant data is loaded
  useEffect(() => {
    if (applicant) {
      form.reset({
        sur_name: surname,
        other_names: otherNames,
        gender: applicant.gender || "MALE",
        state_of_origin: applicant.state_of_origin || "",
        designation: applicant.position_under_contract || "",
        phone_number: applicant.phone_number || "",
        email_address: applicant.email || "",
        qualifications: qualifications,
        health_facility: applicant.health_facility || "",
        spoke_site_name: applicant.spoke_site_name || "",
        lga: applicant.lga || "",
        status_of_adhoc_staff: applicant.offer_accepted ? "Active" : "Pending",
        qmap_backstop: applicant.qmap_backstop || "",
        programs_officer: applicant.programs_officer || "",
        stl: applicant.stl || "",
        seo: applicant.seo || "",
        lga2: applicant.lga2 || "",
        cluster: applicant.cluster || "",
        account_name: applicant.account_name || "",
        bank_name: applicant.bank_name || "",
        account_number: applicant.account_number || "",
        sort_code: applicant.sort_code || "",
      });
    }
  }, [applicant, form]);

  const onSubmit = async (data: TAdhocStaffFormData) => {
    try {
      // Combine surname and other names back into full name
      const fullName = `${data.sur_name} ${data.other_names}`.trim();

      // Prepare update payload - merge form data with existing applicant data
      const updatePayload = {
        name: fullName,
        email: data.email_address,
        phone_number: data.phone_number,
        position_under_contract: data.designation,
        // Add all the new adhoc-specific fields
        gender: data.gender,
        state_of_origin: data.state_of_origin,
        health_facility: data.health_facility,
        spoke_site_name: data.spoke_site_name,
        lga: data.lga,
        qmap_backstop: data.qmap_backstop,
        programs_officer: data.programs_officer,
        stl: data.stl,
        seo: data.seo,
        lga2: data.lga2,
        cluster: data.cluster,
        account_name: data.account_name,
        bank_name: data.bank_name,
        account_number: data.account_number,
        sort_code: data.sort_code,
      };

      console.log("Updating adhoc staff with payload:", updatePayload);

      await updateConsultancyApplicant(updatePayload as any);

      toast.success("Adhoc staff details updated successfully!");
      router.push(`/dashboard/programs/adhoc-database`);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update adhoc staff details. Please try again.");
    }
  };

  if (isFetchLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-6">
        <BackNavigation />
        <Card className="mt-5 p-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-red-600 mb-2">Error Loading Data</h2>
            <p className="text-gray-600">Unable to load adhoc staff details for editing.</p>
            <Button onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <BackNavigation />

      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Adhoc Staff Details</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* Personal Information */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                <div className="grid grid-cols-2 gap-6">
                  <FormInput
                    label="Surname"
                    name="sur_name"
                    required
                    placeholder="Enter surname"
                  />
                  <FormInput
                    label="Other Names"
                    name="other_names"
                    required
                    placeholder="Enter other names"
                  />
                  <FormSelect
                    label="Gender"
                    name="gender"
                    required
                    placeholder="Select gender"
                    options={genderOptions}
                  />
                  <FormInput
                    label="State of Origin"
                    name="state_of_origin"
                    required
                    placeholder="Enter state of origin"
                  />
                  <FormInput
                    label="Phone Number"
                    name="phone_number"
                    required
                    type="tel"
                    placeholder="Enter phone number"
                  />
                  <FormInput
                    label="Email Address"
                    name="email_address"
                    required
                    type="email"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </Card>

            {/* Professional Information */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Professional Information</h2>
                <div className="grid grid-cols-2 gap-6">
                  <FormInput
                    label="Designation"
                    name="designation"
                    required
                    placeholder="Enter designation"
                  />
                  <FormInput
                    label="Qualifications"
                    name="qualifications"
                    required
                    placeholder="Enter qualifications"
                  />
                  <FormInput
                    label="Health Facility/Assignment Location"
                    name="health_facility"
                    required
                    placeholder="Enter health facility or assignment location"
                  />
                  <FormInput
                    label="Spoke Site Name"
                    name="spoke_site_name"
                    placeholder="Enter spoke site name"
                  />
                  <FormInput
                    label="LGA"
                    name="lga"
                    required
                    placeholder="Enter LGA"
                  />
                  <FormInput
                    label="Status of Adhoc Staff"
                    name="status_of_adhoc_staff"
                    placeholder="Enter status"
                  />
                </div>
              </div>
            </Card>

            {/* Team & Assignment Details */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Team & Assignment Details</h2>
                <div className="grid grid-cols-2 gap-6">
                  <FormInput
                    label="QMAP BACKSTOP"
                    name="qmap_backstop"
                    placeholder="Enter QMAP BACKSTOP"
                  />
                  <FormInput
                    label="Programs Officer"
                    name="programs_officer"
                    placeholder="Enter Programs Officer"
                  />
                  <FormInput
                    label="STL"
                    name="stl"
                    placeholder="Enter STL"
                  />
                  <FormInput
                    label="SEO"
                    name="seo"
                    placeholder="Enter SEO"
                  />
                  <FormInput
                    label="LGA2"
                    name="lga2"
                    placeholder="Enter LGA2"
                  />
                  <FormInput
                    label="Cluster"
                    name="cluster"
                    placeholder="Enter Cluster"
                  />
                </div>
              </div>
            </Card>

            {/* Financial Information */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Financial Information</h2>
                <div className="grid grid-cols-2 gap-6">
                  <FormInput
                    label="Account Name"
                    name="account_name"
                    placeholder="Enter account holder name"
                  />
                  <FormInput
                    label="Bank Name"
                    name="bank_name"
                    placeholder="Enter bank name"
                  />
                  <FormInput
                    label="Account Number"
                    name="account_number"
                    placeholder="Enter account number"
                  />
                  <FormInput
                    label="Sort Code"
                    name="sort_code"
                    placeholder="Enter sort code"
                  />
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isUpdateLoading}
              >
                Cancel
              </Button>
              <FormButton loading={isUpdateLoading}>
                Update Adhoc Staff Details
              </FormButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}