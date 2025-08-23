"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "components/atoms/FormInput";
import FormButton from "@/components/FormButton";
import { Label } from "components/ui/label";
import { toast } from "sonner";
import {
  ConsultancyManagementDetailSchema,
  TConsultantanagementDetailsFormData,
} from "@/features/contracts-grants/types/contract-management/consultancy-management/consultancy-management";
import { Button } from "components/ui/button";
import FormTextArea from "components/atoms/FormTextArea";
import { FormField, FormItem, Form, FormControl } from "components/ui/form";
import MultiSelectFormField from "components/ui/multiselect";
import { useGetAllLocations } from "@/features/modules/controllers/config/locationController";
import { useEffect, useMemo } from "react";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useRouter, useSearchParams, usePathname } from "next/navigation"; 
import { CG_ROUTES, ProgramRoutes } from "constants/RouterConstants";
// import { fileToBase64 } from "utils/fileToBase64";
import { useGetSingleConsultantManagement } from "@/features/contracts-grants/controllers/consultantManagementController";
import { skipToken } from "@reduxjs/toolkit/query";
import FormSelect from "components/atoms/FormSelect";
import { useGetAllContractRequests } from "@/features/contracts-grants/controllers/contractController";
import { useGetAllGrades } from "@/features/modules/controllers/config/gradeController";

export default function ApplicationDetails() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const consultantId = searchParams.get("id");

  const form = useForm<TConsultantanagementDetailsFormData>({
    resolver: zodResolver(ConsultancyManagementDetailSchema),
    defaultValues: {
      title: "",
      locations: [],
      commencement_date: "",
      end_date: "",
      consultants_number: "",
      // background: "",
      grade_level: "",
    },
  });

  const pathname = usePathname();

  const {
    formState: { errors },
    getValues,
  } = form;
  const vn = getValues();
  console.log({ vn });

  const { data: location } = useGetAllLocations({
    page: 1,
    size: 2000000,
  });

  const { data: contractRequests, isFetchingContractRequests } =
    useGetAllContractRequests({
      page: 1,
    });
  const { data: user } = useGetAllUsers({ page: 1, size: 2000000 });

  const contractRequestOptions = useMemo(
    () =>
      contractRequests?.data.results.map(({ title, id }) => ({
        label: title,
        value: id,
      })),
    [user]
  );

  const locationOptions = location?.data.results;

  const onSubmit: SubmitHandler<TConsultantanagementDetailsFormData> = async (
    data
  ) => {
    try {
      const payload = {
        ...data,
      };

      sessionStorage.setItem(
        "consultantManagementFormData",
        JSON.stringify(payload)
      );

      const searchUrl = `${consultantId ? `?id=${consultantId}` : ""}`;

      if (pathname.includes("adhoc-management")) {
        router.push(`${ProgramRoutes.CREATE_ADHOC_WORK_SCOPE}${searchUrl}`);
      } else {
        router.push(`${CG_ROUTES.CREATE_CONSULTANCY_WORK_SCOPE}${searchUrl}`);
      }
    } catch (error: any) {
      toast.error(error?.data.message ?? "Something went wrong");
    }
  };

  const { data } = useGetSingleConsultantManagement(
    consultantId ?? skipToken
  );
  const { data: grades } = useGetAllGrades({
    page: 1,
    size: 2000000,
  });

  const gradeOptions = grades?.data.results.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

  useEffect(() => {
    if (data) {
      const { locations, consultants_number } = data.data;

      form.reset({
        ...data.data,
        locations: locations.map(({ id }) => id),
        consultants_number: String(consultants_number),
      });
    }
  }, [data, user]);

  return (
    <main className='w-full flex flex-col items-center justify-center gap-y-[2.5rem] bg-white p-[1.25rem] pt-[2rem]  rounded-2xl'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full space-y-8'
        >
          <FormInput
            label='Title of Consultancy'
            name='title'
            placeholder='Enter Title'
            required
          />

          <FormSelect
            label='Contract Request'
            name='contract_request'
            placeholder='Select Contract Request'
            required
            options={contractRequestOptions || []}
          />

          <FormTextArea
            label='Job Description'
            name='description'
            placeholder='Enter Background'
            required
          />
          <FormSelect
            label='Grade'
            name='grade_level'
            required
            placeholder='Select Position'
            options={gradeOptions}
          />
          <div>
            <Label className='font-semibold'>Locations</Label>

            <FormField
              control={form.control}
              name='locations'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiSelectFormField
                      options={locationOptions || []}
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select Locations'
                      variant='inverted'
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {errors.locations && (
              <span className='text-sm text-red-500 font-medium'>
                {errors?.locations?.message as string}
              </span>
            )}
          </div>

          <div className='grid grid-cols-2 gap-5'>
            <FormInput
              type='date'
              label='Commencement Date'
              name='commencement_date'
              required
            />

            <FormInput
              type='date'
              label='Effective End Date'
              name='end_date'
              required
            />
          </div>

          <FormInput
            label='Number of Consultants'
            name='consultants_number'
            type='number'
            placeholder='Enter Number of Consultants'
            required
          />

          {/* <div className="flex flex-col gap-y-[1rem]">
                            <Label className="font-semibold">
                                Upload Complete Advertisement Document
                            </Label>

                            <div className="flex items-center w-full gap-x-[1rem]">
                                <label
                                    className="cursor-pointer shrink-0 border flex items-center gap-x-[1rem] w-fit rounded-lg border-[#DBDFE9] py-[.875rem] px-[1.125rem]"
                                    htmlFor="file"
                                >
                                    <UploadFileSvg />
                                    Select file
                                </label>
                                <input
                                    type="file"
                                    name="file"
                                    hidden
                                    id="file"
                                    onChange={handleFileChange}
                                />
                                <p className="border flex items-center w-full gap-x-[1rem] rounded-lg border-[#DBDFE9] px-[1.125rem] h-[3.5rem]">
                                    {fileName ||
                                        data?.data.advertisement_document}
                                </p>
                            </div>

                            {errors.advertisement_document && (
                                <span className="text-sm text-red-500 font-medium">
                                    {
                                        errors?.advertisement_document
                                            ?.message as string
                                    }
                                </span>
                            )}
                        </div> */}

          <div className='flex justify-end items-center gap-5'>
            <Button
              type='button'
              variant='outline'
              size='lg'
              onClick={() => router.back()}
            >
              Cancel
            </Button>

            <FormButton size='lg'>Next</FormButton>
          </div>
        </form>
      </Form>
    </main>
  );
}
