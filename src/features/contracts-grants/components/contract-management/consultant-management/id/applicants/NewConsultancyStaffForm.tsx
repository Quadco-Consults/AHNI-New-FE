"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadFileSvg } from "assets/svgs/CAndGSvgs";
import FadedButton from "components/atoms/FadedButton";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import FormTextArea from "components/atoms/FormTextArea";
import AddSquareIcon from "components/icons/AddSquareIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { countries } from "constants/countries";
import {
  ConsultancyStaffSchema,
  IConsultancyStaffSingleData,
  TConsultancyStaffFormData,
} from "@/features/contracts-grants/types/contract-management/consultancy-management/consultancy-application";
import { useEffect, useMemo, useState } from "react";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { AiFillPlusCircle } from "react-icons/ai";
import { useParams, useRouter } from "next/navigation";
import {
  useCreateConsultancyStaffMutation,
  useModifyConsultancyStaffMutation,
} from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { toast } from "sonner";
import { fileToBase64 } from "utils/fileToBase64";

export default function NewConsultancyStaffForm({
  consultancyStaffData,
}: {
  consultancyStaffData: IConsultancyStaffSingleData | undefined;
}) {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const prevCoverLetter = consultancyStaffData?.documents[0]?.document;
  const prevResume = consultancyStaffData?.documents[1]?.document;

  const form = useForm<TConsultancyStaffFormData>({
    resolver: zodResolver(ConsultancyStaffSchema),
    defaultValues: {
      consultancy: id ?? "",
      referees: [{ name: "", email: "", phone_number: "" }],
      name: "",
      contractor_name: "",
      email: "",
      phone_number: "",
      contract_number: "",
      position_under_contract: "",
      proposed_salary: "",
      place_of_birth: "",
      citizenship: "",
      start_duration_date: "",
      end_duration_date: "",
      education: [{ name: "", location: "", major: "", degree: "", date: "" }],
      language_proficiency: [
        {
          language: "",
          proficiency_speaking: "",
          proficiency_reading: "",
        },
      ],
      employment_history: [
        {
          position_title: "",
          employer_name: "",
          employer_telephone: "",
          from: "",
          to: "",
        },
      ],
      special_consultant_services: [
        {
          services_performed: "",
          employer_name: "",
          employer_telephone: "",
          from: "",
          to: "",
        },
      ],
    },
  });

  const [files, setFiles] = useState<{ name: string; document: File | any }[]>([
    { name: "file-resume", document: null },
    { name: "file-letter", document: null },
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const updatedFiles = files.map((file) => {
        if (e.target.name === file.name) {
          return {
            ...file,
            document: e.target.files ? e.target.files[0] : null,
          };
        }

        return file;
      });

      setFiles(updatedFiles);
    }
  };

  const countryOptions = useMemo(
    () =>
      countries.map(({ name }) => ({
        label: name,
        value: name,
      })),
    []
  );

  const {
    fields: educationFields,
    append: appendEducationField,
    remove: removeEducationField,
  } = useFieldArray({
    name: "education",
    control: form.control,
  });

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    name: "language_proficiency",
    control: form.control,
  });

  const {
    fields: employmentFields,
    append: addEmployment,
    remove: removeEmployment,
  } = useFieldArray({
    name: "employment_history",
    control: form.control,
  });

  const {
    fields: consultantServices,
    append: addConsultantService,
    remove: removeConsultantService,
  } = useFieldArray({
    name: "special_consultant_services",
    control: form.control,
  });

  const {
    fields: referees,
    append: addReferee,
    remove: removeReferee,
  } = useFieldArray({
    name: "referees",
    control: form.control,
  });

  const { createConsultancyApplicant, isLoading: isCreateLoading } =
    useCreateConsultancyStaffMutation();

  const { updateConsultancyApplicant, isLoading: isModifyLoading } =
    useModifyConsultancyStaffMutation(consultancyStaffData?.id || "");

  const onSubmit: SubmitHandler<TConsultancyStaffFormData> = async (data) => {
    console.log({ data });

    try {
      const resume = files[0].document
        ? await fileToBase64(files[0].document)
        : "";

      const coverLetter = files[1].document
        ? await fileToBase64(files[1].document)
        : "";

      const documents = [
        { name: files[0].name, document: resume },
        { name: files[1].name, document: coverLetter },
      ];

      if (consultancyStaffData?.id) {
        await updateConsultancyApplicant({ ...data, documents });

        toast.success("Consultancy Staff Updated");
      } else {
        await createConsultancyApplicant({ ...data, documents });
        router.back();
        toast.success("Consultancy Staff Created");
      }
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
      console.log(error);
    }
  };

  useEffect(() => {
    if (consultancyStaffData) {
      form.reset(consultancyStaffData);
    }
  }, [consultancyStaffData, form]);

  console.log(form.formState.errors);

  return (
    <FormProvider {...form}>
      <form className='space-y-10' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid grid-cols-3 gap-10'>
          <FormInput label='Name (Last, First, Middle)' name='name' required />
          <FormInput
            label="Contractor's Name"
            name='contractor_name'
            required
          />
          <FormInput label='Email' name='email' required />
        </div>

        <FormTextArea
          label="Employee's Address (include Zip Code)"
          name='_'
          required
        />

        <div className='grid grid-cols-3 gap-10'>
          <FormInput
            type='number'
            label='Contract Number'
            name='contract_number'
            required
          />

          <FormInput
            label='Position Under Contract'
            name='position_under_contract'
            required
          />

          <FormInput
            type='number'
            label='Proposed Amount / Rate'
            name='proposed_salary'
            required
          />

          <FormInput
            type='number'
            label='Telephone Number'
            name='phone_number'
            required
          />

          <FormInput
            type='date'
            label='Date of Birth'
            name='date_of_birth'
            required
          />

          <FormInput label='Place of Birth' name='place_of_birth' required />

          <FormSelect
            label='Citizenship'
            name='citizenship'
            required
            options={countryOptions}
          />
        </div>

        <section className='space-y-3'>
          <h3 className='font-bold text-lg'>Duration of Assignment</h3>
          <div className='grid grid-cols-2 gap-10'>
            <FormInput
              type='date'
              label='Start Date'
              name='start_duration_date'
              required
            />

            <FormInput
              type='date'
              label='End Date'
              name='end_duration_date'
              required
            />
          </div>
        </section>

        <section className='space-y-3'>
          <h3 className='font-bold text-lg'>Education</h3>

          <div className='space-y-5'>
            {educationFields?.map((field, index) => (
              <div
                key={field.id}
                className='grid grid-cols-3 gap-10 items-center'
              >
                <FormInput
                  label='Institution Name'
                  name={`education.${index}.name`}
                  required
                />
                <FormInput
                  label='Institution Location'
                  name={`education.${index}.location`}
                  required
                />
                <FormInput
                  label='Major'
                  name={`education.${index}.major`}
                  required
                />
                <FormInput
                  label='Degree'
                  name={`education.${index}.degree`}
                  required
                />
                <FormInput
                  type='date'
                  label='Date'
                  name={`education.${index}.date`}
                  required
                />

                <Button
                  type='button'
                  variant='ghost'
                  className='mt-3.5'
                  onClick={() => {
                    removeEducationField(index);
                  }}
                >
                  <DeleteIcon />
                </Button>
              </div>
            ))}
          </div>

          <FadedButton
            type='button'
            className='text-primary'
            onClick={() => {
              appendEducationField({
                name: "",
                location: "",
                major: "",
                degree: "",
                date: "",
              });
            }}
          >
            <AddSquareIcon />
            Add Education
          </FadedButton>
        </section>

        <section className='space-y-3'>
          <h3 className='font-bold text-lg'>Language Proficiency</h3>

          <div className='space-y-5'>
            {languageFields?.map((field, index) => (
              <div
                key={field.id}
                className='grid grid-cols-4 items-center gap-10'
              >
                <FormInput
                  label='Language'
                  name={`language_proficiency.${index}.language`}
                  required
                />
                <FormInput
                  label='Proficiency Speaking'
                  name={`language_proficiency.${index}.proficiency_speaking`}
                  required
                />
                <FormInput
                  label='Proficency Reading'
                  name={`language_proficiency.${index}.proficiency_reading`}
                  required
                />

                <Button
                  type='button'
                  variant='ghost'
                  className='mt-3.5'
                  onClick={() => {
                    removeLanguage(index);
                  }}
                >
                  <DeleteIcon />
                </Button>
              </div>
            ))}
          </div>

          <FadedButton
            type='button'
            className='text-primary'
            onClick={() => {
              appendLanguage({
                language: "",
                proficiency_speaking: "",
                proficiency_reading: "",
              });
            }}
          >
            <AddSquareIcon />
            Add Language
          </FadedButton>
        </section>

        <section className='space-y-3'>
          <h3 className='font-bold text-lg'>Employment History</h3>

          <div className='space-y-5'>
            {employmentFields?.map((field, index) => (
              <div
                key={field.id}
                className='grid grid-cols-3 gap-10 items-center'
              >
                <FormInput
                  label='Position Title'
                  name={`employment_history.${index}.position_title`}
                  required
                />
                <FormInput
                  label='Employer Name'
                  name={`employment_history.${index}.employer_name`}
                  required
                />
                <FormInput
                  label='Employer Telephone'
                  name={`employment_history.${index}.employer_telephone`}
                  required
                />
                <FormInput
                  type='date'
                  label='From'
                  name={`employment_history.${index}.from`}
                  required
                />
                <FormInput
                  type='date'
                  label='To'
                  name={`employment_history.${index}.to`}
                  required
                />

                <Button
                  type='button'
                  variant='ghost'
                  className='mt-3.5'
                  onClick={() => {
                    removeEmployment(index);
                  }}
                >
                  <DeleteIcon />
                </Button>
              </div>
            ))}
          </div>

          <FadedButton
            type='button'
            className='text-primary'
            onClick={() => {
              addEmployment({
                position_title: "",
                employer_name: "",
                employer_telephone: "",
                from: "",
                to: "",
              });
            }}
          >
            <AddSquareIcon />
            Add Employment History
          </FadedButton>
        </section>

        <section className='space-y-3'>
          <h3 className='font-bold text-lg'>Specific Consultant Services</h3>

          <div className='space-y-5'>
            {consultantServices?.map((field, index) => (
              <div
                key={field.id}
                className='grid grid-cols-3 gap-10 items-center'
              >
                <FormInput
                  label='Services Performed'
                  name={`special_consultant_services.${index}.services_performed`}
                  required
                />
                <FormInput
                  label='Employer Name'
                  name={`special_consultant_services.${index}.employer_name`}
                  required
                />
                <FormInput
                  label='Employer Telephone'
                  name={`special_consultant_services.${index}.employer_telephone`}
                  required
                />
                <FormInput
                  type='date'
                  label='From'
                  name={`special_consultant_services.${index}.from`}
                  required
                />
                <FormInput
                  type='date'
                  label='To'
                  name={`special_consultant_services.${index}.to`}
                  required
                />

                <Button
                  type='button'
                  variant='ghost'
                  className='mt-3.5'
                  onClick={() => {
                    removeConsultantService(index);
                  }}
                >
                  <DeleteIcon />
                </Button>
              </div>
            ))}
          </div>

          <FadedButton
            type='button'
            className='text-primary'
            onClick={() => {
              addConsultantService({
                services_performed: "",
                employer_name: "",
                employer_telephone: "",
                from: "",
                to: "",
              });
            }}
          >
            <AddSquareIcon />
            Add Consultant Service
          </FadedButton>
        </section>

        <section className='space-y-3'>
          <h3 className='font-bold font-lg'>Referees</h3>

          <div className='space-y-5'>
            {referees?.map((field, index) => (
              <div
                key={field.id}
                className='grid grid-cols-2 items-center gap-10'
              >
                <FormInput
                  label='Name'
                  name={`referees.${index}.name`}
                  required
                />
                <FormInput
                  label='Email'
                  name={`referees.${index}.email`}
                  required
                />
                <FormInput
                  type='number'
                  label='Phone Number'
                  name={`referees.${index}.phone_number`}
                  required
                />
                <Button
                  type='button'
                  variant='ghost'
                  className='mt-3.5'
                  onClick={() => {
                    removeReferee(index);
                  }}
                >
                  <DeleteIcon />
                </Button>
              </div>
            ))}
          </div>

          <Button
            type='button'
            variant='ghost'
            className='p-0 hover:bg-transparent'
            onClick={() => {
              addReferee({
                name: "",
                email: "",
                phone_number: "",
              });
            }}
          >
            <AiFillPlusCircle size={24} className='text-green-500' />
            Add Referee
          </Button>
        </section>

        <div className='grid grid-cols-2 gap-10'>
          <div className='flex flex-col gap-y-[1rem]'>
            <Label className='font-bold'>Upload Resume</Label>

            <div className='flex items-center w-full gap-x-[1rem]'>
              <label
                className='cursor-pointer shrink-0 border flex items-center gap-x-[1rem] w-fit rounded-lg border-[#DBDFE9] py-[.875rem] px-[1.125rem]'
                htmlFor='file-resume'
              >
                <UploadFileSvg />
                Select file
              </label>
              <input
                type='file'
                name='file-resume'
                hidden
                id='file-resume'
                onChange={handleFileChange}
              />
              <p className='border flex items-center w-full gap-x-[1rem] rounded-lg border-[#DBDFE9] px-[1.125rem] h-[3.5rem] truncate text-ellipsis'>
                {files[0]?.document?.name || prevResume}
              </p>
            </div>
          </div>

          <div className='flex flex-col gap-y-[1rem]'>
            <Label className='font-bold'>Upload Cover Letter</Label>

            <div className='flex items-center w-full gap-x-[1rem]'>
              <label
                className='cursor-pointer shrink-0 border flex items-center gap-x-[1rem] w-fit rounded-lg border-[#DBDFE9] py-[.875rem] px-[1.125rem]'
                htmlFor='file-letter'
              >
                <UploadFileSvg />
                Select file
              </label>
              <input
                type='file'
                name='file-letter'
                hidden
                id='file-letter'
                onChange={handleFileChange}
              />
              <p className='border flex items-center w-full gap-x-[1rem] rounded-lg border-[#DBDFE9] px-[1.125rem] h-[3.5rem] overflow-hidden truncate text-ellipsis'>
                {files[1]?.document?.name || prevCoverLetter}
              </p>
            </div>
          </div>
        </div>

        <div className='flex items-center justify-end gap-3'>
          <FadedButton
            type='button'
            size='lg'
            className='text-primary'
            onClick={() => {
              router.back();
            }}
          >
            Cancel
          </FadedButton>

          <FormButton size='lg' loading={isCreateLoading || isModifyLoading}>
            Submit
          </FormButton>
        </div>
      </form>
    </FormProvider>
  );
}
