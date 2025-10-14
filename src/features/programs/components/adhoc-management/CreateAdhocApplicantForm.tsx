"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import FormTextArea from "components/atoms/FormTextArea";
import FadedButton from "components/atoms/FadedButton";
import {
  AdhocApplicantCreateSchema,
  TAdhocApplicantCreatePayload,
  IAdhocAdvertisement,
} from "@/features/programs/types/adhoc-management";
import { useEffect, useMemo } from "react";
import {
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import {
  useCreateAdhocApplicant,
} from "@/features/programs/controllers/adhocApplicantController";
import { toast } from "sonner";
import { nigeriaStates } from "@/constants/nigeria-states";

// Gender options
const genderOptions = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
];

export default function CreateAdhocApplicantForm({
  advertisementData,
}: {
  advertisementData: IAdhocAdvertisement | undefined;
}) {
  const router = useRouter();
  const params = useParams();
  const advertisementId = params?.id as string;

  const form = useForm<TAdhocApplicantCreatePayload>({
    resolver: zodResolver(AdhocApplicantCreateSchema),
    defaultValues: {
      advertisement_id: advertisementId ?? "",
      sur_name: "",
      other_names: "",
      gender: "MALE",
      date_of_birth: "",
      state_of_origin: "",
      lga_of_origin: "",
      phone_number: "",
      email_address: "",
      alternative_phone: "",
      residential_address: "",
      qualifications: "",
      total_experience_years: 0,
      current_employer: "",
      current_position: "",
      preferred_location: "",
      preferred_health_facility: "",
      willing_to_relocate: true,
    },
  });

  const stateOptions = useMemo(
    () =>
      nigeriaStates.map((state) => ({
        label: state,
        value: state,
      })),
    []
  );

  const { mutateAsync: createApplicant, isPending: isCreateLoading } =
    useCreateAdhocApplicant();

  const onSubmit: SubmitHandler<TAdhocApplicantCreatePayload> = async (data) => {
    console.log("📋 Submitting adhoc applicant:", data);

    try {
      await createApplicant(data);
      router.back();
      toast.success("Application submitted successfully!");
    } catch (error: any) {
      toast.error(error?.message ?? "Failed to submit application");
      console.error("Application submission error:", error);
    }
  };

  // Auto-populate advertisement_id
  useEffect(() => {
    if (advertisementId) {
      form.setValue("advertisement_id", advertisementId);
    }
  }, [advertisementId, form]);

  console.log("Form errors:", form.formState.errors);

  return (
    <FormProvider {...form}>
      <form className="space-y-10" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Personal Information Section */}
        <section className="space-y-5">
          <h3 className="font-bold text-lg">Personal Information</h3>

          <div className="grid grid-cols-2 gap-10">
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
              placeholder="Enter first and middle names"
            />
          </div>

          <div className="grid grid-cols-3 gap-10">
            <FormSelect
              label="Gender"
              name="gender"
              required
              options={genderOptions}
            />

            <FormInput
              type="date"
              label="Date of Birth"
              name="date_of_birth"
              required
            />

            <FormSelect
              label="State of Origin"
              name="state_of_origin"
              required
              options={stateOptions}
            />
          </div>

          <div className="grid grid-cols-2 gap-10">
            <FormInput
              label="LGA of Origin"
              name="lga_of_origin"
              placeholder="Enter LGA (optional)"
            />
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="space-y-5">
          <h3 className="font-bold text-lg">Contact Information</h3>

          <div className="grid grid-cols-2 gap-10">
            <FormInput
              type="tel"
              label="Phone Number"
              name="phone_number"
              required
              placeholder="+234 800 000 0000"
            />

            <FormInput
              type="tel"
              label="Alternative Phone"
              name="alternative_phone"
              placeholder="+234 800 000 0000 (optional)"
            />
          </div>

          <FormInput
            type="email"
            label="Email Address"
            name="email_address"
            required
            placeholder="your.email@example.com"
          />

          <FormTextArea
            label="Residential Address"
            name="residential_address"
            placeholder="Enter your full residential address (optional)"
            rows={3}
          />
        </section>

        {/* Professional Information Section */}
        <section className="space-y-5">
          <h3 className="font-bold text-lg">Professional Information</h3>

          <FormTextArea
            label="Qualifications"
            name="qualifications"
            required
            placeholder="List your educational qualifications and certifications"
            rows={4}
          />

          <div className="grid grid-cols-3 gap-10">
            <FormInput
              type="number"
              label="Years of Experience"
              name="total_experience_years"
              required
              placeholder="0"
            />

            <FormInput
              label="Current Employer"
              name="current_employer"
              placeholder="Current company (optional)"
            />

            <FormInput
              label="Current Position"
              name="current_position"
              placeholder="Current job title (optional)"
            />
          </div>
        </section>

        {/* Assignment Preferences Section */}
        <section className="space-y-5">
          <h3 className="font-bold text-lg">Assignment Preferences</h3>

          <div className="grid grid-cols-2 gap-10">
            <FormInput
              label="Preferred Location"
              name="preferred_location"
              placeholder="Preferred work location (optional)"
            />

            <FormInput
              label="Preferred Health Facility"
              name="preferred_health_facility"
              placeholder="Preferred health facility (optional)"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="willing_to_relocate"
              {...form.register("willing_to_relocate")}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="willing_to_relocate" className="text-sm">
              I am willing to relocate if required for this position
            </label>
          </div>
        </section>

        {/* Advertisement Info Display */}
        {advertisementData && (
          <section className="bg-gray-50 p-5 rounded-lg space-y-2">
            <h4 className="font-semibold text-gray-700">Applying For:</h4>
            <p className="text-gray-900 font-medium">{advertisementData.position_title}</p>
            <p className="text-sm text-gray-600">
              Advertisement: {advertisementData.advertisement_number}
            </p>
            {advertisementData.location && (
              <p className="text-sm text-gray-600">
                Location: {typeof advertisementData.location === 'object'
                  ? advertisementData.location.name
                  : advertisementData.location}
              </p>
            )}
          </section>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-5 border-t">
          <FadedButton
            type="button"
            size="lg"
            className="text-primary"
            onClick={() => router.back()}
          >
            Cancel
          </FadedButton>

          <FormButton size="lg" loading={isCreateLoading}>
            Submit Application
          </FormButton>
        </div>
      </form>
    </FormProvider>
  );
}
