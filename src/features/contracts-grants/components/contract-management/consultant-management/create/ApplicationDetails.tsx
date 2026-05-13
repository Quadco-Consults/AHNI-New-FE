"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/atoms/FormInput";
import FormButton from "@/components/FormButton";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  ConsultancyManagementDetailSchema,
  TConsultantanagementDetailsFormData,
} from "@/features/contracts-grants/types/contract-management/consultancy-management/consultancy-management";
import { Button } from "@/components/ui/button";
import FormTextArea from "@/components/atoms/FormTextArea";
import { FormField, FormItem, Form, FormControl, FormMessage } from "@/components/ui/form";
import MultiSelectFormField from "@/components/ui/multiselect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllLocations } from "@/features/modules/controllers/config/locationController";
import { useEffect, useMemo } from "react";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useRouter, useSearchParams, usePathname } from "next/navigation"; 
import { CG_ROUTES, ProgramRoutes } from "@/constants/RouterConstants";
// import { fileToBase64 } from "@/utils/fileToBase64";
import { useGetSingleConsultantManagement } from "@/features/contracts-grants/controllers/consultantManagementController";
import { skipToken } from "@reduxjs/toolkit/query";
import FormSelect from "@/components/atoms/FormSelect";
import { useGetAllContractRequests, useGetSingleContractRequest } from "@/features/contracts-grants/controllers/contractController";
import { useGetAllGrades } from "@/features/modules/controllers/config/gradeController";
import { useGetAllAdhocRequisitions, useGetSingleAdhocRequisition } from "@/controllers/adhocRequisitionController";

export default function ApplicationDetails() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const consultantId = searchParams.get("id");

  const form = useForm<TConsultantanagementDetailsFormData>({
    resolver: zodResolver(ConsultancyManagementDetailSchema),
    defaultValues: {
      title: "",
      contract_request: "",
      job_description: "",
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
    watch,
    setValue,
  } = form;

  // Watch the contract_request field
  const selectedContractRequestId = watch("contract_request");

  // Debug: Log when contract request ID changes
  useEffect(() => {
    console.log("📋 Selected Contract Request ID:", selectedContractRequestId);
  }, [selectedContractRequestId]);

  const { data: location } = useGetAllLocations({
    page: 1,
    size: 2000000,
  });

  // Check if we're on adhoc management page
  const isAdhocPage = pathname.includes("adhoc-management");

  // Fetch adhoc requisitions if on adhoc page, otherwise fetch contract requests
  const { data: adhocRequisitions } = useGetAllAdhocRequisitions({
    page: 1,
    size: 2000000,
    enabled: isAdhocPage,
  });

  const { data: contractRequests } = useGetAllContractRequests({
    page: 1,
    enabled: !isAdhocPage,
  });

  const { data: user } = useGetAllUsers({ page: 1, size: 2000000 });

  // Fetch selected adhoc requisition details if on adhoc page
  const { data: selectedAdhocRequisition, isLoading: isLoadingAdhocRequisition } = useGetSingleAdhocRequisition(
    selectedContractRequestId || "",
    isAdhocPage && !!selectedContractRequestId
  );

  // Fetch selected contract request details if not on adhoc page
  const { data: selectedContractRequest, isLoading: isLoadingContractRequest } = useGetSingleContractRequest(
    selectedContractRequestId || "",
    !isAdhocPage && !!selectedContractRequestId
  );

  // Debug: Log contract request data
  useEffect(() => {
    console.log("📦 Selected Contract Request Data:", selectedContractRequest);
    console.log("⏳ Loading:", isLoadingContractRequest);
  }, [selectedContractRequest, isLoadingContractRequest]);

  // Generate options based on page type
  const contractRequestOptions = useMemo(() => {
    if (isAdhocPage) {
      // Map adhoc requisitions with more context for easy identification
      // Filter to only show approved requisitions that haven't been converted yet
      return adhocRequisitions?.data?.results
        ?.filter((req: any) => req.status === "APPROVED" && !req.converted_to_advertisement)
        ?.map((req: any) => {
          // Build a descriptive label: "REQ-001 - Position Title (Department)"
          const reqNumber = req.requisition_number || 'N/A';
          const positionTitle = req.position_title || req.title || 'Untitled';
          const department = typeof req.requesting_department === 'object'
            ? req.requesting_department?.name
            : req.requesting_department_name || '';
          const priority = req.priority || '';

          // Format: "REQ-001 - Data Analyst (Finance) - HIGH"
          let label = `${reqNumber} - ${positionTitle}`;
          if (department) {
            label += ` (${department})`;
          }
          if (priority) {
            label += ` - ${priority}`;
          }

          return {
            label,
            value: req.id,
          };
        }) || [];
    } else {
      // Map contract requests
      return contractRequests?.data?.results?.map(({ title, id }) => ({
        label: title,
        value: id,
      })) || [];
    }
  }, [isAdhocPage, adhocRequisitions, contractRequests]);

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
      } else if (pathname.includes("facilitator-management")) {
        router.push(`${CG_ROUTES.CREATE_FACILITATOR_ADVERT_WORK_SCOPE}${searchUrl}`);
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
  const { data: grades, isLoading: isLoadingGrades, error: gradesError } = useGetAllGrades({
    page: 1,
    size: 2000000,
  });

  console.log('🎓 Grades data:', grades);
  console.log('🎓 Is loading grades:', isLoadingGrades);
  console.log('🎓 Grades error:', gradesError);

  const gradeOptions = grades?.data?.results?.map(({ name, id }) => ({
    label: name,
    value: id,
  })) || [];

  const userOptions = user?.data.results.map(({ first_name, last_name, id }) => ({
    label: `${first_name} ${last_name}`,
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

  // Populate form when adhoc requisition or contract request is selected
  useEffect(() => {
    const selectedData = isAdhocPage ? selectedAdhocRequisition : selectedContractRequest;

    if (!selectedData) {
      console.log("⚠️ No data selected");
      return;
    }

    console.log("🔄 useEffect triggered with:", selectedData);

    // Extract data from the response
    let extractedData: any;
    if ('data' in selectedData && 'status' in selectedData) {
      extractedData = selectedData.data;
      console.log("📦 Extracted from ApiResponse wrapper:", extractedData);
    } else {
      extractedData = selectedData;
      console.log("📦 Direct data:", extractedData);
    }

    if (extractedData && extractedData.id) {
      if (isAdhocPage) {
        // Populate ALL fields from adhoc requisition
        console.log("🔍 Adhoc Requisition Selected:", extractedData);

        // Title of Consultancy
        form.setValue("title", extractedData.position_title || extractedData.title || "", { shouldValidate: false });

        // Number of Consultants/Positions
        const staffNumber = extractedData.number_of_positions ||
                           extractedData.number_of_staff ||
                           extractedData.staff_count ||
                           extractedData.consultants_number;
        const staffNumberString = (staffNumber !== undefined && staffNumber !== null) ? String(staffNumber) : "";
        console.log("📊 Setting consultants_number to:", staffNumberString);
        form.setValue("consultants_number", staffNumberString, { shouldValidate: false });

        // Job Description
        if (extractedData.job_description) {
          form.setValue("job_description", extractedData.job_description, { shouldValidate: false });
        }

        // Locations
        if (extractedData.location?.id) {
          form.setValue("locations", [extractedData.location.id], { shouldValidate: false });
        } else if (extractedData.location_detail?.id) {
          form.setValue("locations", [extractedData.location_detail.id], { shouldValidate: false });
        }

        // Commencement Date (start_date from requisition)
        if (extractedData.start_date) {
          form.setValue("commencement_date", extractedData.start_date, { shouldValidate: false });
        }

        // End Date
        if (extractedData.end_date) {
          form.setValue("end_date", extractedData.end_date, { shouldValidate: false });
        }

        // Grade Level - if mapped
        if (extractedData.grade_level?.id) {
          form.setValue("grade_level", extractedData.grade_level.id, { shouldValidate: false });
        } else if (extractedData.grade_level) {
          form.setValue("grade_level", extractedData.grade_level, { shouldValidate: false });
        }

        console.log("✅ Populated all adhoc requisition fields:", {
          title: extractedData.position_title,
          positions: staffNumberString,
          description: extractedData.job_description ? "✓" : "✗",
          location: extractedData.location?.name || "✗",
          startDate: extractedData.start_date || "✗",
          endDate: extractedData.end_date || "✗",
        });
      } else {
        // Populate from contract request
        console.log("🔍 Contract Request Selected:", extractedData);

        setValue("title", extractedData.title || "");

        // Ensure number is converted to string
        const consultantsCount = extractedData.consultants_count;
        setValue("consultants_number", consultantsCount ? String(consultantsCount) : "");

        if (extractedData.location_detail?.id) {
          setValue("locations", [extractedData.location_detail.id]);
        }
      }
    }
  }, [isAdhocPage, selectedAdhocRequisition, selectedContractRequest, setValue]);

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

          <div>
            <Label className='font-semibold'>
              {isAdhocPage ? "Adhoc Requisition" : "Contract Request"}{" "}
              <span className='text-red-500'>*</span>
            </Label>
            <FormField
              control={form.control}
              name='contract_request'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        console.log(
                          `🎯 ${isAdhocPage ? "Adhoc Requisition" : "Contract Request"} Selected:`,
                          value
                        );
                        field.onChange(value);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={`Select ${isAdhocPage ? "Adhoc Requisition" : "Contract Request"}`}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {contractRequestOptions?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormTextArea
            label='Job Description'
            name='job_description'
            placeholder='Enter Job Description'
            required={false}
          />
          <FormSelect
            label='Grade'
            name='grade_level'
            required
            placeholder={isLoadingGrades ? 'Loading grades...' : 'Select Grade'}
            options={gradeOptions}
          />
          {isLoadingGrades && (
            <p className="text-sm text-gray-500 mt-1">Loading grades...</p>
          )}
          {gradesError && (
            <p className="text-sm text-red-500 mt-1">Failed to load grades. Please refresh the page.</p>
          )}
          {!isLoadingGrades && gradeOptions.length === 0 && (
            <p className="text-sm text-amber-600 mt-1">No grades available. Please add grades in settings.</p>
          )}
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

          {/* Show supervisor field only for facilitator management */}
          {pathname?.includes("facilitator-management") && (
            <FormSelect
              label='Supervisor'
              name='supervisor'
              placeholder='Select Supervisor'
              required
              options={userOptions || []}
            />
          )}

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
