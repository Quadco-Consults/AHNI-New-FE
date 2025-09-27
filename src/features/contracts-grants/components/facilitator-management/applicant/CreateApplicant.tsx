"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "components/ui/form";
import FormInput from "components/atoms/FormInput";
import FormButton from "@/components/FormButton";
import { Button } from "components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import Card from "components/Card";
import {
  FacilitatorApplicantSchema,
  TFacilitatorApplicantFormData
} from "@/features/contracts-grants/types/contract-management/facilitator-management/facilitator-application";
import { useCreateFacilitatorApplicant } from "@/features/contracts-grants/controllers/facilitatorApplicantsController";

export default function CreateFacilitatorApplicant() {
  const router = useRouter();
  const { id } = useParams();

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
    },
  });

  const onSubmit = async (data: TFacilitatorApplicantFormData) => {
    try {
      const payload = {
        ...data,
        facilitator_id: id as string,
      };

      await createFacilitatorApplicant(payload);
      toast.success("Facilitator applicant registered successfully");
      router.push(`/dashboard/c-and-g/facilitator-management/${id}`);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Register New Facilitator</h1>
        <p className="text-gray-600">Add a new facilitator to the system</p>
      </div>

      <Card>
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <FormButton loading={isLoading}>Register Facilitator</FormButton>
              </div>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
}