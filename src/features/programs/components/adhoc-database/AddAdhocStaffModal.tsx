"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormTextArea from "@/components/FormTextArea";
import FormSelect from "@/components/FormSelect";
import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AxiosWithToken from "@/lib/axios";
import { useGetAllFacilities } from "@/features/modules/controllers/program/facilityController";
import { useGetAllUsers } from "@/features/auth/controllers/userController";

// Validation schema
const AddAdhocStaffSchema = z.object({
  // User Information (Required)
  email: z.string().email("Invalid email address"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  mobile_number: z.string().optional(),
  user_gender: z.enum(["M", "F", ""]).optional(),

  // Personal Information
  surname: z.string().optional(),
  other_names: z.string().optional(),
  gender: z.string().optional(),
  state_of_origin: z.string().optional(),

  // Professional Information
  designation: z.string().optional(),
  qualification: z.string().optional(),
  health_facility: z.string().optional(),
  spoke_site_name: z.string().optional(),
  lga: z.string().optional(),
  lga2: z.string().optional(),
  adhoc_role: z.string().optional(),

  // Status Information
  status_of_adhoc_staff: z.string().optional(),
  qmap_backstop: z.string().optional(),
  programs_officer: z.string().optional(),
  stl: z.string().optional(),
  seo: z.string().optional(),

  // Contact Information
  phone_number: z.string().optional(),
  email_address: z.string().optional(),

  // Banking Information
  account_name: z.string().optional(),
  bank_name: z.string().optional(),
  account_number: z.string().optional(),
  sort_code: z.string().optional(),
  tax_identification_number: z.string().optional(),

  // Contract Information
  monthly_pay: z.union([z.string(), z.number()]).optional().transform((val) => val?.toString()),
  contract_start_date: z.string().optional(),
  contract_end_date: z.string().optional(),
});

type TAddAdhocStaffFormData = z.infer<typeof AddAdhocStaffSchema>;

interface AddAdhocStaffModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddAdhocStaffModal({
  open,
  onClose,
}: AddAdhocStaffModalProps) {
  const router = useRouter();

  // Fetch facilities and users for dropdowns
  const { data: facilitiesData } = useGetAllFacilities({ page: 1, size: 1000, enabled: open });
  const { data: usersData } = useGetAllUsers({ page: 1, size: 1000, enabled: open });

  const form = useForm<TAddAdhocStaffFormData>({
    resolver: zodResolver(AddAdhocStaffSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      mobile_number: "",
      user_gender: "",
      surname: "",
      other_names: "",
      gender: "",
      state_of_origin: "",
      designation: "",
      qualification: "",
      health_facility: "",
      spoke_site_name: "",
      lga: "",
      lga2: "",
      adhoc_role: "",
      status_of_adhoc_staff: "",
      qmap_backstop: "",
      programs_officer: "",
      stl: "",
      seo: "",
      phone_number: "",
      email_address: "",
      account_name: "",
      bank_name: "",
      account_number: "",
      sort_code: "",
      tax_identification_number: "",
      monthly_pay: "",
      contract_start_date: "",
      contract_end_date: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<TAddAdhocStaffFormData> = async (data) => {
    setIsLoading(true);
    try {
      const response = await AxiosWithToken.post(
        "users/adhoc-staff-profiles/create-direct/",
        data
      );

      if (response.data.status) {
        toast.success("Adhoc staff added successfully");
        form.reset();
        onClose();
        router.refresh();
      } else {
        toast.error(response.data.message || "Failed to add adhoc staff");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.errors || "An error occurred while adding adhoc staff";
      toast.error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      console.error("Error creating adhoc staff:", error.response?.data || error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const genderOptions = [
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
  ];

  const adhocRoleOptions = [
    { label: "Case Manager", value: "CASE_MANAGER" },
    { label: "Data Entry Clerk", value: "DATA_ENTRY_CLERK" },
    { label: "Laboratory Support Officer", value: "LAB_SUPPORT_OFFICER" },
    { label: "Counselor Tester", value: "COUNSELOR_TESTER" },
    { label: "Site Enhancement Officer", value: "SITE_ENHANCEMENT_OFFICER" },
    { label: "Lab Optimizer", value: "LAB_OPTIMIZER" },
    { label: "Operations Support", value: "OPERATIONS_SUPPORT" },
  ];

  const stateOptions = [
    { label: "Abia", value: "Abia" },
    { label: "Adamawa", value: "Adamawa" },
    { label: "Akwa Ibom", value: "Akwa Ibom" },
    { label: "Anambra", value: "Anambra" },
    { label: "Bauchi", value: "Bauchi" },
    { label: "Bayelsa", value: "Bayelsa" },
    { label: "Benue", value: "Benue" },
    { label: "Borno", value: "Borno" },
    { label: "Cross River", value: "Cross River" },
    { label: "Delta", value: "Delta" },
    { label: "Ebonyi", value: "Ebonyi" },
    { label: "Edo", value: "Edo" },
    { label: "Ekiti", value: "Ekiti" },
    { label: "Enugu", value: "Enugu" },
    { label: "FCT", value: "FCT" },
    { label: "Gombe", value: "Gombe" },
    { label: "Imo", value: "Imo" },
    { label: "Jigawa", value: "Jigawa" },
    { label: "Kaduna", value: "Kaduna" },
    { label: "Kano", value: "Kano" },
    { label: "Katsina", value: "Katsina" },
    { label: "Kebbi", value: "Kebbi" },
    { label: "Kogi", value: "Kogi" },
    { label: "Kwara", value: "Kwara" },
    { label: "Lagos", value: "Lagos" },
    { label: "Nasarawa", value: "Nasarawa" },
    { label: "Niger", value: "Niger" },
    { label: "Ogun", value: "Ogun" },
    { label: "Ondo", value: "Ondo" },
    { label: "Osun", value: "Osun" },
    { label: "Oyo", value: "Oyo" },
    { label: "Plateau", value: "Plateau" },
    { label: "Rivers", value: "Rivers" },
    { label: "Sokoto", value: "Sokoto" },
    { label: "Taraba", value: "Taraba" },
    { label: "Yobe", value: "Yobe" },
    { label: "Zamfara", value: "Zamfara" },
  ];

  // Create facility options from API data
  const facilityOptions = facilitiesData?.data?.results?.map((facility: any) => ({
    label: facility.name,
    value: facility.id,
  })) || [];

  // Create staff options from API data
  const staffOptions = usersData?.data?.results?.map((user: any) => ({
    label: `${user.first_name} ${user.last_name}`,
    value: user.id,
  })) || [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Adhoc Staff Directly</DialogTitle>
          <DialogDescription>
            Create an adhoc staff record directly without going through the
            recruitment process. Fill in all required information.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* User Information Section */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  form={form}
                  name="email"
                  label="Email Address"
                  placeholder="staff@example.com"
                  required
                />
                <FormInput
                  form={form}
                  name="mobile_number"
                  label="Mobile Number"
                  placeholder="+234..."
                />
                <FormInput
                  form={form}
                  name="first_name"
                  label="First Name"
                  placeholder="John"
                  required
                />
                <FormInput
                  form={form}
                  name="last_name"
                  label="Last Name"
                  placeholder="Doe"
                  required
                />
                <FormSelect
                  form={form}
                  name="user_gender"
                  label="Gender"
                  placeholder="Select gender"
                  options={genderOptions}
                />
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                  form={form}
                  name="state_of_origin"
                  label="State of Origin"
                  placeholder="Select state"
                  options={stateOptions}
                />
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold">
                Professional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                  form={form}
                  name="adhoc_role"
                  label="Adhoc Role / Designation"
                  placeholder="Select role"
                  options={adhocRoleOptions}
                />
                <FormTextArea
                  form={form}
                  name="qualification"
                  label="Qualification"
                  placeholder="Education and certifications"
                  rows={3}
                />
                <FormSelect
                  form={form}
                  name="health_facility"
                  label="Health Facility Assignment"
                  placeholder="Select facility"
                  options={facilityOptions}
                />
                <FormInput
                  form={form}
                  name="spoke_site_name"
                  label="Spoke Site Name"
                  placeholder="Site name"
                />
                <FormInput
                  form={form}
                  name="lga"
                  label="LGA"
                  placeholder="Local Government Area"
                />
                <FormInput
                  form={form}
                  name="lga2"
                  label="LGA 2"
                  placeholder="Secondary LGA"
                />
              </div>
            </div>

            {/* Status Information Section */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold">Status & Reporting</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  form={form}
                  name="status_of_adhoc_staff"
                  label="Status of Adhoc Staff"
                  placeholder="Status"
                />
                <FormInput
                  form={form}
                  name="qmap_backstop"
                  label="QMAP Backstop"
                  placeholder="QMAP backstop name"
                />
                <FormSelect
                  form={form}
                  name="programs_officer"
                  label="Programs Officer"
                  placeholder="Select programs officer"
                  options={staffOptions}
                />
                <FormSelect
                  form={form}
                  name="stl"
                  label="STL"
                  placeholder="Select STL"
                  options={staffOptions}
                />
                <FormInput form={form} name="seo" label="SEO" placeholder="SEO name" />
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  form={form}
                  name="phone_number"
                  label="Phone Number"
                  placeholder="+234..."
                />
                <FormInput
                  form={form}
                  name="email_address"
                  label="Email Address (Profile)"
                  placeholder="Alternative email"
                />
              </div>
            </div>

            {/* Banking Information Section */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold">Banking Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  form={form}
                  name="account_name"
                  label="Account Name"
                  placeholder="Bank account name"
                />
                <FormInput
                  form={form}
                  name="bank_name"
                  label="Bank Name"
                  placeholder="e.g., First Bank"
                />
                <FormInput
                  form={form}
                  name="account_number"
                  label="Account Number"
                  placeholder="1234567890"
                />
                <FormInput
                  form={form}
                  name="sort_code"
                  label="Sort Code"
                  placeholder="Bank sort code"
                />
                <FormInput
                  form={form}
                  name="tax_identification_number"
                  label="Tax ID Number (TIN)"
                  placeholder="Tax identification number"
                />
              </div>
            </div>

            {/* Contract Information Section */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold">Contract Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  form={form}
                  name="monthly_pay"
                  label="Monthly Pay"
                  type="number"
                  placeholder="0.00"
                />
                <FormInput
                  form={form}
                  name="contract_start_date"
                  label="Contract Start Date"
                  type="date"
                />
                <FormInput
                  form={form}
                  name="contract_end_date"
                  label="Contract End Date"
                  type="date"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <FormButton
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </FormButton>
              <FormButton type="submit" loading={isLoading}>
                Add Adhoc Staff
              </FormButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
