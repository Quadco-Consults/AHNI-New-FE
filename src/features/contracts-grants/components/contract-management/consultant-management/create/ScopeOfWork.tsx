"use client";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { Form } from "components/ui/form";
import FormTextArea from "components/atoms/FormTextArea";
import FormInput from "components/atoms/FormInput";
import FadedButton from "components/atoms/FadedButton";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { Label } from "components/ui/label";
import { UploadFileSvg } from "assets/svgs/CAndGSvgs";
import Card from "components/Card";
import FormButton from "@/components/FormButton";
import ConsultantManagementLayout from "./Layout";
import FormSelect from "components/atoms/FormSelect";
import {
  ScopeOfWorkSchema,
  TConsultantanagementDetailsFormData,
  TScopeOfWorkFormData,
} from "@/features/contracts-grants/types/contract-management/consultancy-management/consultancy-management";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "components/ui/button";
import DeleteIcon from "components/icons/DeleteIcon";
import { toast } from "sonner";
import { fileToBase64 } from "utils/fileToBase64";
import {
  useCreateConsultantManagement,
  useGetSingleConsultantManagement,
  useModifyConsultantManagement,
} from "@/features/contracts-grants/controllers/consultantManagementController";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CG_ROUTES, ProgramRoutes } from "constants/RouterConstants";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect } from "react";
import { useCreateConsultantAdvertisement } from "@/features/contracts-grants/controllers/consultantAdvertisementController";
import { useCreateFacilitator } from "@/features/contracts-grants/controllers/facilitatorManagementController";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useGetSingleAdhocRequisition } from "@/controllers/adhocRequisitionController";

export default function ScopeOfWork() {
  const pathname = usePathname();

  const searchParams = useSearchParams();

  const consultantId = searchParams.get("id");

  const type = pathname.includes("adhoc-management") ? "ADHOC" : pathname.includes("facilitator-management") ? "FACILITATOR" : "CONSULTANT";

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(ScopeOfWorkSchema),
    defaultValues: {
      description: "",
      background: "",
      objectives: "",
      //   deliverables: [{ deliverable: "", number_of_days: "" }],
      advertisement_document: [],
      //   fee_rate: "",
      //   payment_frequency: "",
      //   location: "",
      //   scope_of_work_document: [],
    },
  });

  //   const { fields, append, remove } = useFieldArray({
  //     name: "deliverables",
  //     control: form.control,
  //   });

  const handleFileChange = (files: FileList | null, name: string) => {
    form.setValue(name as any, files);
  };

  const { createConsultantAdvertisement, isLoading: isCreateLoading } =
    useCreateConsultantAdvertisement();

  const { createFacilitator, isLoading: isCreateFacilitatorLoading } =
    useCreateFacilitator();

  const { updateConsultantManagement, isLoading: isModifyLoading } =
    useModifyConsultantManagement(consultantId);

  // Get users for supervisor field
  const { data: users } = useGetAllUsers({ page: 1, size: 10 });

  const onSubmit: SubmitHandler<TScopeOfWorkFormData> = async (data) => {
    try {
      const applicationDetails: TConsultantanagementDetailsFormData =
        JSON.parse(
          sessionStorage.getItem("consultantManagementFormData") || "{}"
        );

      let payload = {
        ...applicationDetails,
        ...data,
        advertisement_document:
          typeof data.advertisement_document !== "string" && data.advertisement_document?.[0]
            ? await fileToBase64(data.advertisement_document[0])
            : data.advertisement_document || null,
        // Add type field for create operations
        ...(consultantId ? {} : { type: type as "CONSULTANT" | "ADHOC" | "FACILITATOR" }),
      };

      // Map consultant fields to facilitator fields when creating facilitators
      if (pathname?.includes("facilitator-management") && !consultantId) {
        // Separate application details from scope of work data
        const { description, background, objectives, deliverables, advertisement_document, scope_of_work_document, ...applicationDetails } = payload;

        payload = {
          ...applicationDetails,
          facilitaor_number: payload.consultants_number || payload.facilitaor_number,
          // Keep advertisement_document at top level for facilitators
          advertisement_document: advertisement_document || '',
          // Add facilitator-specific required fields with defaults
          duration: "30", // Default duration in days
          extra_info: "Additional information will be provided", // Default extra info
          evaluation_comments: "To be evaluated during selection process", // Default evaluation comments
          supervisor: applicationDetails.supervisor || users?.data?.results?.[0]?.id || "", // Use form value first, then fallback to first user
          // Nest scope of work data as required by facilitator API
          scope_of_work: {
            description: description || '',
            background: background || '',
            objectives: objectives || '',
            deliverables: deliverables || [],
            // Don't include advertisement_document in scope_of_work for facilitators
            scope_of_work_document: scope_of_work_document || '',
            location: applicationDetails.locations?.[0] || '', // Use first location from the form
          }
        };
        // Remove consultant-specific field
        delete payload.consultants_number;
      }

      if (consultantId) {
        await updateConsultantManagement(payload);
      } else if (pathname?.includes("facilitator-management")) {
        await createFacilitator(payload);
      } else {
        await createConsultantAdvertisement(payload);
      }

      if (pathname?.includes("adhoc-management")) {
        router.push(ProgramRoutes.ADHOC_MANAGEMENT);
      } else if (pathname?.includes("facilitator-management")) {
        router.push(CG_ROUTES.FACILITATOR_ADVERT);
      } else {
        router.push(CG_ROUTES.CONSULTANCY);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Something went wrong");
    }
  };

  const { data } = useGetSingleConsultantManagement(consultantId || skipToken);

  // Get adhoc requisition ID from sessionStorage if on adhoc page
  const isAdhocPage = pathname.includes("adhoc-management");
  const applicationDetails: TConsultantanagementDetailsFormData | null =
    typeof window !== 'undefined'
      ? JSON.parse(sessionStorage.getItem("consultantManagementFormData") || "null")
      : null;

  const adhocRequisitionId = isAdhocPage && applicationDetails?.contract_request
    ? applicationDetails.contract_request
    : "";

  // Fetch adhoc requisition details if on adhoc page
  const { data: adhocRequisitionData } = useGetSingleAdhocRequisition(
    adhocRequisitionId,
    isAdhocPage && !!adhocRequisitionId
  );

  // Populate form from existing consultant management data
  useEffect(() => {
    if (data) {
      const {
        // fee_rate,
        // deliverables,
        advertisement_document,
        // scope_of_work_document,
      } = data.data.scope_of_work;

      form.reset({
        ...data.data.scope_of_work,
        // fee_rate: String(fee_rate),
        // deliverables: deliverables.map((item) => ({
        //   ...item,
        //   number_of_days: String(item.number_of_days),
        // })),
        advertisement_document: advertisement_document ?? ([] as any),
        // scope_of_work_document: scope_of_work_document ?? "",
      });
    }
  }, [data, form]);

  // Populate form from adhoc requisition when on adhoc page
  useEffect(() => {
    if (isAdhocPage && adhocRequisitionData) {
      const requisition = adhocRequisitionData.data || adhocRequisitionData;

      console.log("🔍 Populating Scope of Work from Adhoc Requisition:", requisition);

      // Populate form fields from adhoc requisition
      form.setValue("description", requisition.job_description || "", { shouldValidate: false });
      form.setValue("background", requisition.business_justification || "", { shouldValidate: false });
      form.setValue("objectives", requisition.key_responsibilities || "", { shouldValidate: false });

      console.log("✅ Populated Scope of Work fields:", {
        description: requisition.job_description ? "✓" : "✗",
        background: requisition.business_justification ? "✓" : "✗",
        objectives: requisition.key_responsibilities ? "✓" : "✗",
      });
    }
  }, [isAdhocPage, adhocRequisitionData, form]);

  return (
    <ConsultantManagementLayout>
      <main className='w-full flex flex-col items-center justify-center gap-y-[2.5rem] bg-white p-[1.25rem] pt-[2rem]  rounded-2xl'>
        <h2 className='font-semibold text-[1.25rem] w-full text-black'>
          Scope Of Work
        </h2>
        <Form {...form}>
          <form
            className='w-full flex flex-col gap-y-[1.25rem]'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormTextArea
              label2='A descriptive information on the nature of the Contract and other information on how the Contract will be structured or accomplished'
              label='Description'
              name='description'
              placeholder='Enter Description'
              required
            />
            <FormTextArea
              label='Background'
              label2='A detailed information on the need for the Contract and the expected outcome from the Contract'
              name='background'
              placeholder='Enter Background'
              required
            />
            <FormTextArea
              label='Objectives'
              name='objectives'
              placeholder='Enter Objectives'
              required
            />

            {/* <div className='border-y border-[#DBDFE9] py-[1.875rem] pt-[3rem] space-y-[2rem]'>
              <div className='w-full flex flex-col gap-y-[1.25rem]'>
                <p className='text-[#DEA004] font-semibold'>
                  Specific Deliverables
                </p>
                <p className='text-[#4D4545] text-sm'>
                  Based on the activities listed above, the Contractor is
                  expected to produced or accomplish the following:
                </p>
              </div>
              <div className='space-y-3'>
                <div className='grid grid-cols-2 gap-5'>
                  <h3 className='font-semibold'>Specific Deliverables</h3>
                  <h3 className='font-semibold -ml-8'>
                    Number of Days Required
                  </h3>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className='flex items-center gap-5'>
                    <div className='flex-[1]'>
                      <FormInput
                        name={`deliverables.${index}.deliverable`}
                        placeholder='Enter Deliverable'
                      />
                    </div>
                    <div className='flex-[1]'>
                      <FormInput
                        type='number'
                        name={`deliverables.${index}.number_of_days`}
                        placeholder='Enter Number of Days'
                      />
                    </div>

                    <Button
                      type='button'
                      variant='ghost'
                      onClick={() => remove(index)}
                    >
                      <DeleteIcon />
                    </Button>
                  </div>
                ))}

                <FadedButton
                  type='button'
                  className='text-primary w-fit'
                  onClick={() =>
                    append({
                      deliverable: "",
                      number_of_days: "",
                    })
                  }
                >
                  <AddSquareIcon />
                  Add More
                </FadedButton>

                <div className='grid grid-cols-2 gap-5'>
                  <FormInput
                    name='total'
                    placeholder='Total'
                    disabled
                    className='disabled:opacity-100 font-bold'
                  />
                  <FormInput name='total_sum' />
                </div>
              </div>
            </div> */}
            <div className='border-b border-[#DBDFE9] py-[1.875rem]  space-y-[2rem]'>
              <div className='flex flex-col gap-y-[1rem]'>
                <Label className='font-semibold'>
                  Upload Complete Advertisement Document <span className='text-gray-500 font-normal'>(Optional)</span>
                </Label>
                <div className='flex items-center w-full gap-x-[1rem]'>
                  <label
                    className='cursor-pointer shrink-0 border flex items-center gap-x-[1rem] w-fit rounded-lg border-[#DBDFE9] py-[.875rem] px-[1.125rem]'
                    htmlFor='advertisement_document'
                  >
                    <UploadFileSvg />
                    Select file
                  </label>
                  <input
                    type='file'
                    hidden
                    id='advertisement_document'
                    onChange={(e) =>
                      handleFileChange(e.target.files, "advertisement_document")
                    }
                  />
                  <p className='border flex items-center w-full gap-x-[1rem] rounded-lg border-[#DBDFE9] px-[1.125rem] h-[3.5rem]'>
                    {(form.watch("advertisement_document") as FileList)?.[0]
                      ?.name || data?.data.scope_of_work.advertisement_document || "No file selected"}
                  </p>
                </div>
              </div>
            </div>

            {/* <Card className="space-y-5">
                            <p className="text-[#DEA004] font-semibold">
                                Payment Schedule
                            </p>
                            <p className="text-[#4D4545] text-sm">
                                The fee rate for this work will be paid at the
                                end of every month of assignment upon
                                satisfactory approval by the AHNI Technical
                                Monitor.
                            </p>

                            <p className="text-red-500 text-sm">
                                NOTE: 5% With Holding tax (WHT) will be deducted
                                - in line with the regulations
                            </p>

                            <div className="grid grid-cols-2 gap-5">
                                <FormInput
                                    label="Fee Rate"
                                    name="fee_rate"
                                    placeholder="Enter Fee Rate"
                                    required
                                />
                                <FormSelect
                                    label="Payment Frequency"
                                    name="payment_frequency"
                                    placeholder="Select Payment Frequency"
                                    required
                                    options={[
                                        { label: "Weekly", value: "Weekly" },
                                        { label: "Monthly", value: "Monthly" },
                                        {
                                            label: "Bi-Annually",
                                            value: "Bi-Annually",
                                        },
                                        { label: "Anually", value: "Annually" },
                                    ]}
                                />

                                <FormInput
                                    label="Location"
                                    name="location"
                                    placeholder="Enter Location"
                                    required
                                />
                            </div>

                            <div className="border-b border-[#DBDFE9] py-[1.875rem]  space-y-[2rem]">
                                <div className="flex flex-col gap-y-[1rem]">
                                    <Label className="font-semibold">
                                        Upload Complete Scope of Work Document
                                    </Label>
                                    <div className="flex items-center w-full gap-x-[1rem]">
                                        <label
                                            className="cursor-pointer shrink-0 border flex items-center gap-x-[1rem] w-fit rounded-lg border-[#DBDFE9] py-[.875rem] px-[1.125rem]"
                                            htmlFor="scope_of_work_document"
                                        >
                                            <UploadFileSvg />
                                            Select file
                                        </label>
                                        <input
                                            type="file"
                                            hidden
                                            id="scope_of_work_document"
                                            onChange={(e) =>
                                                handleFileChange(
                                                    e.target.files,
                                                    "scope_of_work_document"
                                                )
                                            }
                                        />
                                        <p className="border flex items-center w-full gap-x-[1rem] rounded-lg border-[#DBDFE9] px-[1.125rem] h-[3.5rem]">
                                            {form.watch(
                                                "scope_of_work_document"
                                            )[0]?.name ||
                                                data?.data.scope_of_work
                                                    .scope_of_work_document}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card> */}

            <Card>
              <div className='w-full flex flex-col gap-y-[1.25rem]'>
                <p className='text-[#DEA004] font-semibold'>
                  Confidential and Proprietary Information
                </p>
                <p className='text-[#4D4545] text-sm'>
                  All information, documents and data resulting from the
                  performance of Contractor's work under this Agreement shall be
                  the sole property of AHNI. Upon termination of Agreement,
                  Contractor agrees to return to AHNI all property and materials
                  within Contractor's possession or control which belong to AHNI
                  or which contain Confidential Information.
                </p>
              </div>
            </Card>
            <div className='flex justify-end items-center gap-x-[1rem]'>
              <FadedButton
                type='button'
                className='text-primary'
                size='lg'
                onClick={() => router.back()}
              >
                Cancel
              </FadedButton>
              <FormButton
                size='lg'
                loading={isCreateLoading || isModifyLoading || isCreateFacilitatorLoading}
              >
                Submit
              </FormButton>
            </div>
          </form>
        </Form>
      </main>
    </ConsultantManagementLayout>
  );
}
