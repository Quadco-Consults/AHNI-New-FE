"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/atoms/FormInput";
import FormTextArea from "@/components/atoms/FormTextArea";
import FormButton from "@/components/FormButton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Card from "@/components/Card";
import BackNavigation from "@/components/atoms/BackNavigation";
import {
  FacilitatorApplicantSchema,
  TFacilitatorApplicantFormData
} from "@/features/contracts-grants/types/contract-management/facilitator-management/facilitator-application";
import { useCreateFacilitatorApplicant } from "@/features/contracts-grants/controllers/facilitatorApplicantsController";

export default function SimplifiedCreateFacilitator() {
  const router = useRouter();

  const { createFacilitatorApplicant, isLoading } = useCreateFacilitatorApplicant();

  const form = useForm<TFacilitatorApplicantFormData>({
    resolver: zodResolver(FacilitatorApplicantSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      qualifications: "",
      experience: "",
      referee_one: {
        name: "",
        email: "",
        phone_number: "",
        designation: "",
        address: "",
      },
      referee_two: {
        name: "",
        email: "",
        phone_number: "",
        designation: "",
        address: "",
      },
    },
  });

  const onSubmit = async (data: TFacilitatorApplicantFormData) => {
    try {
      // Combine first_name and last_name into name for the API
      const { first_name, last_name, ...restData } = data;
      const fullName = `${first_name} ${last_name}`.trim();

      const payload = {
        ...restData,
        name: fullName,  // API expects 'name' field
        status: "APPROVED", // Directly set as APPROVED since no review process
      };

      console.log('📤 Creating facilitator:', payload);

      await createFacilitatorApplicant(payload);
      toast.success("Facilitator added successfully");
      router.push("/dashboard/c-and-g/facilitator-management");
    } catch (error: any) {
      console.error('❌ Facilitator creation error:', error);
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <BackNavigation extraText="Add New Facilitator" />

      <Card>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Add New Facilitator</h1>
            <p className="text-gray-600 mt-1">Add a new facilitator to the database</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Personal Information</h3>
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
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Professional Information</h3>
                <FormInput
                  label="Qualifications"
                  name="qualifications"
                  placeholder="Enter qualifications (e.g., BSc Education, MEd, etc.)"
                  required
                />

                <FormInput
                  label="Experience"
                  name="experience"
                  placeholder="Enter relevant experience"
                  required
                />
              </div>

              {/* Referees Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-700">Referee from previous work</h3>

                {/* First Referee */}
                <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
                  <h4 className="font-semibold text-md text-gray-700">Referee 1</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Name"
                      name="referee_one.name"
                      placeholder="Enter referee name"
                      required
                    />

                    <FormInput
                      label="Email"
                      name="referee_one.email"
                      type="email"
                      placeholder="Enter referee email"
                      required
                    />

                    <FormInput
                      label="Phone Number"
                      name="referee_one.phone_number"
                      placeholder="Enter referee phone number"
                      required
                    />

                    <FormInput
                      label="Designation"
                      name="referee_one.designation"
                      placeholder="Enter referee designation"
                      required
                    />

                    <div className="md:col-span-2">
                      <FormTextArea
                        label="Address"
                        name="referee_one.address"
                        placeholder="Enter referee address"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Second Referee */}
                <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
                  <h4 className="font-semibold text-md text-gray-700">Referee 2</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Name"
                      name="referee_two.name"
                      placeholder="Enter referee name"
                      required
                    />

                    <FormInput
                      label="Email"
                      name="referee_two.email"
                      type="email"
                      placeholder="Enter referee email"
                      required
                    />

                    <FormInput
                      label="Phone Number"
                      name="referee_two.phone_number"
                      placeholder="Enter referee phone number"
                      required
                    />

                    <FormInput
                      label="Designation"
                      name="referee_two.designation"
                      placeholder="Enter referee designation"
                      required
                    />

                    <div className="md:col-span-2">
                      <FormTextArea
                        label="Address"
                        name="referee_two.address"
                        placeholder="Enter referee address"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/c-and-g/facilitator-management")}
                >
                  Cancel
                </Button>
                <FormButton loading={isLoading}>
                  Add Facilitator
                </FormButton>
              </div>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
}
