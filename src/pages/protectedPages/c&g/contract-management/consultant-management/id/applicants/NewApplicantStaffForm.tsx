import { zodResolver } from "@hookform/resolvers/zod";
import FadedButton from "atoms/FadedButton";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import FormTextArea from "atoms/FormTextArea";
import AddSquareIcon from "components/icons/AddSquareIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import Upload from "components/shared/Upload";
import { Button } from "components/ui/button";
import { countries } from "constants/countries";
import {
  ConsultancyStaffSchema,
  TConsultancyStaffFormData,
} from "definations/c&g/contract-management/consultancy-management/consultancy-application";
import { useMemo, useState } from "react";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { AiFillPlusCircle } from "react-icons/ai";
import { useCreateConsultancyStaffMutation } from "services/c&g/contract-management/consultancy-management/consultancy-applicants";
import { toast } from "sonner";

export default function NewApplicantStaffForm() {
  const form = useForm<TConsultancyStaffFormData>({
    resolver: zodResolver(ConsultancyStaffSchema),
    defaultValues: {
      consultancy: "",
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
        { language: "", proficiency_speaking: "", proficiency_reading: "" },
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

  const [files, setFiles] = useState<FileList>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const fileNames = Array.from(files ?? [])?.map((file) => file.name);

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

  const [createConsultancyStaff, { isLoading: isCreateLoading }] =
    useCreateConsultancyStaffMutation();

  const onSubmit: SubmitHandler<TConsultancyStaffFormData> = async (data) => {
    try {
        // @ts-ignore
      await createConsultancyStaff({...data, documents: [{document: "Hello"}]}).unwrap();
      toast.success("Consultancy Staff Created");
    } catch (error: any) {
      toast.error(error?.data.message ?? "Something went wrong");
    }
  };

  console.log(form.formState.errors);

  return (
    <FormProvider {...form}>
      <form className="space-y-10" onSubmit={form.handleSubmit(onSubmit)}>
        <h2 className="font-bold text-xl">Add New Applicant</h2>

        <div className="grid grid-cols-3 gap-10">
          <FormInput label="Name (Last, First, Middle)" name="name" required />
          <FormInput
            label="Contractor's Name"
            name="contractor_name"
            required
          />
          <FormInput label="Email" name="email" required />
        </div>

        <FormTextArea
          label="Employee's Address (include Zip Code)"
          name="_"
          required
        />

        <div className="grid grid-cols-3 gap-10">
          <FormInput
            type="number"
            label="Contract Number"
            name="contract_number"
            required
          />

          <FormInput
            label="Position Under Contract"
            name="position_under_contract"
            required
          />

          <FormInput
            type="number"
            label="Proposed Salary"
            name="proposed_salary"
            required
          />

          <FormInput
            type="number"
            label="Telephone Number"
            name="phone_number"
            required
          />

          <FormInput label="Place of Birth" name="place_of_birth" required />

          <FormSelect
            label="Citizenship"
            name="citizenship"
            required
            options={countryOptions}
          />
        </div>

        <section className="space-y-3">
          <h3 className="font-bold text-lg">Duration of Assignment</h3>
          <div className="grid grid-cols-2 gap-10">
            <FormInput
              type="date"
              label="Start Date"
              name="start_duration_date"
              required
            />

            <FormInput
              type="date"
              label="End Date"
              name="end_duration_date"
              required
            />
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="font-bold text-lg">Education</h3>

          <div className="space-y-5">
            {educationFields?.map((field, index) => (
              <div key={field.id} className="grid grid-cols-3 gap-10">
                <FormInput
                  label="Institution Name"
                  name={`education.${index}.name`}
                  required
                />
                <FormInput
                  label="Institution Location"
                  name={`education.${index}.location`}
                  required
                />
                <FormInput
                  label="Major"
                  name={`education.${index}.major`}
                  required
                />
                <FormInput
                  label="Degree"
                  name={`education.${index}.degree`}
                  required
                />
                <FormInput
                  type="date"
                  label="Date"
                  name={`education.${index}.date`}
                  required
                />

                <Button
                  type="button"
                  variant="ghost"
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
            type="button"
            className="text-primary"
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

        <section className="space-y-3">
          <h3 className="font-bold text-lg">Language Proficiency</h3>

          <div className="space-y-5">
            {languageFields?.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-4 items-center gap-10"
              >
                <FormInput
                  label="Language"
                  name={`language_proficiency.${index}.language`}
                  required
                />
                <FormInput
                  label="Proficiency Speaking"
                  name={`language_proficiency.${index}.proficiency_speaking`}
                  required
                />
                <FormInput
                  label="Proficency Reading"
                  name={`language_proficiency.${index}.proficiency_reading`}
                  required
                />

                <Button
                  type="button"
                  variant="ghost"
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
            type="button"
            className="text-primary"
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

        <section className="space-y-3">
          <h3 className="font-bold text-lg">Employment History</h3>

          <div className="space-y-5">
            {employmentFields?.map((field, index) => (
              <div key={field.id} className="grid grid-cols-3 gap-10">
                <FormInput
                  label="Position Title"
                  name={`employment_history.${index}.position_title`}
                  required
                />
                <FormInput
                  label="Employer Name"
                  name={`employment_history.${index}.employer_name`}
                  required
                />
                <FormInput
                  label="Employee Telephone"
                  name={`employment_history.${index}.employer_telephone`}
                  required
                />
                <FormInput
                  type="date"
                  label="From"
                  name={`employment_history.${index}.from`}
                  required
                />
                <FormInput
                  type="date"
                  label="To"
                  name={`employment_history.${index}.to`}
                  required
                />

                <Button
                  type="button"
                  variant="ghost"
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
            type="button"
            className="text-primary"
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

        <section className="space-y-3">
          <h3 className="font-bold text-lg">Specific Consultant Services</h3>

          <div className="space-y-5">
            {consultantServices?.map((field, index) => (
              <div key={field.id} className="grid grid-cols-3 gap-10">
                <FormInput
                  label="Services Performed"
                  name={`special_consultant_services.${index}.services_performed`}
                  required
                />
                <FormInput
                  label="Employer Name"
                  name={`special_consultant_services.${index}.employer_name`}
                  required
                />
                <FormInput
                  label="Employee Telephone"
                  name={`special_consultant_services.${index}.employer_telephone`}
                  required
                />
                <FormInput
                  type="date"
                  label="From"
                  name={`special_consultant_services.${index}.from`}
                  required
                />
                <FormInput
                  type="date"
                  label="To"
                  name={`special_consultant_services.${index}.to`}
                  required
                />

                <Button
                  type="button"
                  variant="ghost"
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
            type="button"
            className="text-primary"
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

        <section className="space-y-3">
          <h3 className="font-bold font-lg">Referees</h3>

          <div className="space-y-5">
            {referees?.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-2 items-center gap-10"
              >
                <FormInput
                  label="Name"
                  name={`referees.${index}.name`}
                  required
                />
                <FormInput
                  label="Email"
                  name={`referees.${index}.email`}
                  required
                />
                <FormInput
                  type="number"
                  label="Phone Number"
                  name={`referees.${index}.phone_number`}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
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
            type="button"
            variant="ghost"
            className="p-0 hover:bg-transparent"
            onClick={() => {
              addReferee({
                name: "",
                email: "",
                phone_number: "",
              });
            }}
          >
            <AiFillPlusCircle size={24} className="text-green-500" />
            Add Referee
          </Button>
        </section>

        <section className="flex flex-col items-start gap-3">
          <h3 className="font-bold text-lg">Document Uploads</h3>

          <div className="space-x-5">
            {fileNames?.map((name) => (
              <span>{name}</span>
            ))}
          </div>

          <Upload onChange={handleFileChange} multiple={true}>
            <Button
              type="button"
              variant="ghost"
              className="p-0 hover:bg-transparent"
            >
              <AiFillPlusCircle size={24} className="text-green-500" />
              Add Document
            </Button>
          </Upload>

          {/* <div className="grid grid-cols-2 gap-10">
                <div className="flex flex-col gap-y-[1rem]">
                  <Label className="font-bold">Upload Resume</Label>

                  <div className="flex items-center w-full gap-x-[1rem]">
                    <label
                      className="cursor-pointer shrink-0 border flex items-center gap-x-[1rem] w-fit rounded-lg border-[#DBDFE9] py-[.875rem] px-[1.125rem]"
                      htmlFor="file"
                    >
                      <UploadFileSvg />
                      Select file
                    </label>
                    <input type="file" name="file" hidden id="file" />
                    <p className="border flex items-center w-full gap-x-[1rem] rounded-lg border-[#DBDFE9] px-[1.125rem] h-[3.5rem]">
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-y-[1rem]">
                  <Label className="font-bold">Upload Cover Letter</Label>

                  <div className="flex items-center w-full gap-x-[1rem]">
                    <label
                      className="cursor-pointer shrink-0 border flex items-center gap-x-[1rem] w-fit rounded-lg border-[#DBDFE9] py-[.875rem] px-[1.125rem]"
                      htmlFor="file"
                    >
                      <UploadFileSvg />
                      Select file
                    </label>
                    <input type="file" name="file" hidden id="file" />
                    <p className="border flex items-center w-full gap-x-[1rem] rounded-lg border-[#DBDFE9] px-[1.125rem] h-[3.5rem]">
                      
                    </p>
                  </div>
                </div>
              </div> */}
        </section>

        <div className="flex items-center justify-end gap-3">
          <FadedButton type="button" size="lg" className="text-primary">
            Cancel
          </FadedButton>

          <FormButton size="lg">Submit</FormButton>
        </div>
      </form>
    </FormProvider>
  );
}
