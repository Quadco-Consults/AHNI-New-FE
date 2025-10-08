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
import { useGetSingleAdhocApplicant, useUpdateAdhocApplicant } from "@/features/programs/controllers/adhocApplicantController";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { useGetAllFacilities } from "@/features/modules/controllers/program/facilityController";
import { useEffect, useMemo } from "react";

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

  // Fetch adhoc applicant data
  const { data: applicantResponse, isLoading: isFetchLoading, error } = useGetSingleAdhocApplicant(staffId);
  const { mutateAsync: updateAdhocApplicant, isPending: isUpdateLoading } = useUpdateAdhocApplicant(staffId);

  // Fetch all projects for dropdown
  const { data: projectsData } = useGetAllProjects({ page: 1, size: 1000 });

  // Fetch all facilities for dropdown
  const { data: facilitiesData } = useGetAllFacilities({ page: 1, size: 1000 });

  const applicant = applicantResponse?.data;

  // Transform projects for dropdown
  const projectOptions = useMemo(() => {
    const projects = projectsData?.data?.results || [];
    return projects.map(project => ({
      label: `${project.title} (${project.project_id})`,
      value: project.id
    }));
  }, [projectsData]);

  // Transform facilities for dropdown
  const facilityOptions = useMemo(() => {
    const facilities = facilitiesData?.data?.results || [];
    return facilities.map(facility => ({
      label: facility.name,
      value: facility.name // Using name as value since health_facility is stored as text
    }));
  }, [facilitiesData]);

  // Extract unique LGAs from facilities for dropdown
  const lgaOptions = useMemo(() => {
    const facilities = facilitiesData?.data?.results || [];
    const uniqueLgas = new Set(
      facilities
        .map(f => f.state)
        .filter(Boolean)
    );
    return Array.from(uniqueLgas).map(lga => ({
      label: lga!,
      value: lga!
    }));
  }, [facilitiesData]);

  // Extract fields from applicant (handle both old and new field names)
  const surname = (applicant as any)?.surname || (applicant as any)?.sur_name || '';
  const otherNames = (applicant as any)?.other_names || '';
  const qualifications = (applicant as any)?.qualification || (applicant as any)?.qualifications || '';

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
      project: "",
    },
  });

  // Update form when applicant data is loaded
  useEffect(() => {
    if (applicant) {
      const app = applicant as any;
      form.reset({
        sur_name: app.surname || app.sur_name || "",
        other_names: app.other_names || "",
        gender: app.gender || "MALE",
        state_of_origin: app.state_of_origin || "",
        designation: app.designation || "",
        phone_number: app.phone_number || "",
        email_address: app.email || app.email_address || "",
        qualifications: app.qualification || app.qualifications || "",
        health_facility: app.health_facility || "",
        spoke_site_name: app.spoke_site_name || "",
        lga: app.lga || "",
        status_of_adhoc_staff: app.status === 'HIRED' ? "Active" : "Pending",
        qmap_backstop: app.qmap_backstop || "",
        programs_officer: app.programs_officer || "",
        stl: app.stl || "",
        seo: app.seo || "",
        lga2: app.lga2 || "",
        cluster: app.cluster || "",
        account_name: app.account_name || "",
        bank_name: app.bank_name || "",
        account_number: app.account_number || "",
        sort_code: app.sort_code || "",
        project: app.project || "",
      });
    }
  }, [applicant, form]);

  const onSubmit = async (data: TAdhocStaffFormData) => {
    try {
      // Prepare update payload with adhoc-specific fields
      const updatePayload = {
        surname: data.sur_name,
        other_names: data.other_names,
        email: data.email_address,
        phone_number: data.phone_number,
        designation: data.designation,
        qualification: data.qualifications,
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
        project: data.project,
      };

      await updateAdhocApplicant(updatePayload as any);

      // Note: The success toast is shown by the mutation's onSuccess handler
      // Wait a bit for cache invalidation to complete before redirecting
      setTimeout(() => {
        router.push(`/dashboard/programs/adhoc-database`);
      }, 500);
    } catch (error) {
      console.error("Update error:", error);
      // Note: The error toast is shown by the mutation's onError handler
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
                  <FormSelect
                    label="Health Facility/Assignment Location"
                    name="health_facility"
                    required
                    placeholder="Select health facility"
                    options={facilityOptions}
                  />
                  <FormInput
                    label="Spoke Site Name"
                    name="spoke_site_name"
                    placeholder="Enter spoke site name"
                  />
                  <FormSelect
                    label="LGA"
                    name="lga"
                    required
                    placeholder="Select LGA"
                    options={lgaOptions}
                  />
                  <FormInput
                    label="Status of Adhoc Staff"
                    name="status_of_adhoc_staff"
                    placeholder="Enter status"
                  />
                </div>
              </div>
            </Card>

            {/* Project Assignment */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Assignment</h2>
                <div className="grid grid-cols-1 gap-6">
                  <FormSelect
                    label="Assigned Project"
                    name="project"
                    placeholder="Select project"
                    options={projectOptions}
                  />
                  {applicant?.project && projectsData?.data?.results && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-2">Project Details</h3>
                      {(() => {
                        const selectedProject = projectsData.data.results.find(p => p.id === applicant.project);
                        if (selectedProject) {
                          return (
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Project Title:</p>
                                <p className="font-medium text-gray-900">{selectedProject.title}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Project ID:</p>
                                <p className="font-medium text-gray-900">{selectedProject.project_id}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Budget:</p>
                                <p className="font-medium text-gray-900">{selectedProject.currency} {selectedProject.budget}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Duration:</p>
                                <p className="font-medium text-gray-900">
                                  {new Date(selectedProject.start_date).toLocaleDateString()} - {new Date(selectedProject.end_date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-gray-600">Funding Sources:</p>
                                <p className="font-medium text-gray-900">
                                  {selectedProject.funding_sources.map(fs => fs.name).join(', ')}
                                </p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  )}
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