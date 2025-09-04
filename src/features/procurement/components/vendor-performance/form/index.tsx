"use client";

"use client";

import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import LongArrowRight from "components/icons/LongArrowRight";
import GoBack from "components/GoBack";
import { Form, FormControl, FormField, FormItem } from "components/ui/form";
import { Label } from "components/ui/label";
import MultiSelectFormField from "components/ui/multiselect";
import { Separator } from "components/ui/separator";
import { RouteEnum } from "constants/RouterConstants";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  useGetAllUsers,
  useGetUserProfile,
} from "@/features/auth/controllers/userController";
import VendorsAPI from "@/features/procurement/controllers/vendorsController";
import VendorsEvaluaionAndPerformanceAPI from "@/features/procurement/controllers/vendorPerformanceEvaluationController";
import { toast } from "sonner";

const CreateVendorEvaluation = () => {
  const router = useRouter();
  const {
    data: vendor,

    // @ts-ignore
  } = VendorsAPI.useGetVendors({});

  const {
    createVendorEvaluation: createVendorEvaluationMutation,
    isLoading: createVendorEvaluationMutationLoading,
  } = VendorsEvaluaionAndPerformanceAPI.useCreateVendorEvaluation();
  // VendorsEvaluaionAndPerformanceAPI.useGetVendors({});

  const { data: users } = useGetAllUsers({
    page: 1,
    size: 2000000,
  });

  const { data: profile } = useGetUserProfile();

  const form = useForm<any>({
    // resolver: zodResolver(),
    defaultValues: {
      evaluators: "",
      // evaluators: profile?.data.id,
      supervisors: "",
      vendor: "",
      vendor_service: "",
      location_of_service: "",
      reviewed_period_start: "",
      reviewed_period_end: "",
      comments: "",
    },
  });

  const { handleSubmit, watch, setValue } = form;

  // Watch the selected vendor
  const selectedVendorId = watch("vendor");

  const vendorsOptions = vendor?.data.results.map(({ company_name, id }) => ({
    label: company_name,
    value: id,
  }));

  const usersOptions = users?.data.results.map(
    ({ first_name, last_name, id }) => ({
      name: `${first_name} ${last_name}`,
      id: id,
    })
  );

  // Autofill location based on selected vendor
  useEffect(() => {
    if (selectedVendorId && vendor) {
      const selectedVendor = vendor.data.results.find(
        (v) => v.id === selectedVendorId
      );

      if (selectedVendor) {
        setValue("location_of_service", selectedVendor.state || "");
        setValue(
          "vendor_service",
          selectedVendor?.approved_categories_details[0]?.name || ""
        );
      }
    }
    // setValue("evaluators", profile?.data.id || "");
  }, [selectedVendorId, vendor, setValue, profile?.data.id]);

  const onSubmit = async (data: any) => {
    const payload = {
      evaluators: data.evaluators,
      supervisors: data.supervisors,
      vendor: data?.vendor,
      service: data?.vendor_service,
      location_of_service: data?.location_of_service,
      reviewed_period_start: data?.reviewed_period_start,
      reviewed_period_end: data?.reviewed_period_end,
    };

    try {
      await createVendorEvaluationMutation(payload);
      toast.success("Successfully created.");
      router.push(RouteEnum.VENDOR_PERFORMANCE_EVALUATION);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="">
      <GoBack />

      <div className="pt-20">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-5">
              {vendorsOptions && (
                <FormSelect
                  label="Vendor Name"
                  name="vendor"
                  required
                  options={vendorsOptions}
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-5">
              <FormInput
                label="Vendor Service"
                name="vendor_service"
                type="text"
              />
              <FormInput
                label="Location of Service"
                name="location_of_service"
                type="text"
              />
            </div>

            <div className="grid gap-5">
              <FormInput
                label="Review Start Period"
                name="reviewed_period_start"
                type="date"
                placeholder="01/01/2024"
              />
              <FormInput
                label="Review End Period"
                name="reviewed_period_end"
                type="date"
                placeholder="01/01/2024"
              />
            </div>

            <span className="block space-y-2">
              <h3 className="font-semibold text-xl text-black">EVALUATION</h3>
            </span>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-5">
              {usersOptions && (
                <>
                  <div className="">
                    <Label className="font-semibold">Evaluators</Label>
                    <FormField
                      control={form.control}
                      name="evaluators"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormControl>
                              <MultiSelectFormField
                                options={usersOptions || []}
                                defaultValue={field.value}
                                onValueChange={field.onChange}
                                placeholder="Please Select"
                                variant="inverted"
                              />
                            </FormControl>
                          </FormItem>
                        );
                      }}
                    />
                  </div>

                  <div className="">
                    <Label className="font-semibold">Supervisor</Label>
                    <FormField
                      control={form.control}
                      name="supervisors"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormControl>
                              <MultiSelectFormField
                                options={usersOptions || []}
                                defaultValue={field.value}
                                onValueChange={field.onChange}
                                placeholder="Please Select"
                                variant="inverted"
                              />
                            </FormControl>
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                </>
              )}
            </div>
            <FormButton
              loading={createVendorEvaluationMutationLoading}
              disabled={createVendorEvaluationMutationLoading}
              type="submit"
              className="flex items-center justify-center gap-2"
            >
              <LongArrowRight />
              Save
            </FormButton>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateVendorEvaluation;
