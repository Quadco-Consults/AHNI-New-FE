"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "components/ui/form";
import FormInput from "components/atoms/FormInput";
import FormButton from "@/components/FormButton";
import { Button } from "components/ui/button";
import Card from "components/Card";
import { LoadingSpinner } from "components/Loading";
import { toast } from "sonner";
import {
  useGetSingleFacilitatorApplicant,
  useUpdateFacilitatorApplicant,
} from "@/features/contracts-grants/controllers/facilitatorApplicantsController";
import {
  FacilitatorApplicantSchema,
  TFacilitatorApplicantFormData,
} from "@/features/contracts-grants/types/contract-management/facilitator-management/facilitator-application";
import { useEffect } from "react";

export default function FacilitatorEdit() {
  const params = useParams();
  const router = useRouter();
  const facilitatorId = params?.id as string;

  const { data, isLoading: isFetching } = useGetSingleFacilitatorApplicant(facilitatorId);
  const { updateFacilitatorApplicant, isLoading } = useUpdateFacilitatorApplicant(facilitatorId);

  const facilitator = data?.data;

  const form = useForm<TFacilitatorApplicantFormData>({
    resolver: zodResolver(FacilitatorApplicantSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      qualifications: "",
      experience: "",
    },
  });

  // Populate form when data is loaded
  useEffect(() => {
    if (facilitator) {
      // Extract first and last name from name field if they don't exist separately
      const names = facilitator.name ? facilitator.name.split(' ') : [];
      const firstName = facilitator.first_name || names[0] || '';
      const lastName = facilitator.last_name || names.slice(1).join(' ') || '';

      form.reset({
        first_name: firstName,
        last_name: lastName,
        email: facilitator.email || "",
        phone_number: facilitator.phone_number || "",
        qualifications: facilitator.qualifications || "",
        experience: facilitator.experience || "",
      });
    }
  }, [facilitator, form]);

  const onSubmit = async (data: TFacilitatorApplicantFormData) => {
    try {
      console.log('🔍 Updating facilitator:', data);
      await updateFacilitatorApplicant(data);
      toast.success("Facilitator updated successfully");
      router.push(`/dashboard/c-and-g/facilitator-database/${facilitatorId}/view`);
    } catch (error: any) {
      console.error('❌ Failed to update facilitator:', error);
      toast.error(error?.message || "Failed to update facilitator");
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!facilitator) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <div className="p-6 text-center">
            <p className="text-gray-600">Facilitator not found</p>
            <Button onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          ← Go Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Facilitator</h1>
          <p className="text-gray-600">Update facilitator information</p>
        </div>
      </div>

      {/* Edit Form */}
      <Card>
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="First Name"
                    name="first_name"
                    placeholder="Enter first name"
                    required
                  />

                  <FormInput
                    label="Last Name"
                    name="last_name"
                    placeholder="Enter last name"
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
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
                <div className="space-y-4">
                  <FormInput
                    label="Qualifications"
                    name="qualifications"
                    placeholder="Enter qualifications"
                    required
                  />

                  <FormInput
                    label="Experience"
                    name="experience"
                    placeholder="Enter relevant experience"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <FormButton loading={isLoading}>
                  Save Changes
                </FormButton>
              </div>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
}
