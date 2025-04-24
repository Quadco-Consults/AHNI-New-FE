import FadedButton from "atoms/FadedButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import FormTextArea from "atoms/FormTextArea";
import AddSquareIcon from "components/icons/AddSquareIcon";
import Upload from "components/shared/Upload";
import { Button } from "components/ui/button";
import { countries } from "constants/countries";
import { useMemo, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";

export default function NewApplicantStaffForm() {
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

    return (
        <div className="space-y-10">
            <h2 className="font-bold text-xl">Add New Applicant</h2>

            <div className="grid grid-cols-2 gap-10">
                <FormInput
                    label="Name (Last, First, Middle)"
                    name="_"
                    required
                />
                <FormInput label="Contractor's Name" name="_" required />
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
                    name="_"
                    required
                />

                <FormInput label="Position Under Contract" name="" required />

                <FormInput
                    type="number"
                    label="Proposed Salary"
                    name=""
                    required
                />

                <FormInput
                    type="number"
                    label="Telephone Number"
                    name=""
                    required
                />

                <FormInput label="Place of Birth" name="" required />

                <FormSelect
                    label="Citizenship"
                    name=""
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
                        name=""
                        required
                    />

                    <FormInput type="date" label="End Date" name="" required />
                </div>
            </section>

            <section className="space-y-3">
                <h3 className="font-bold text-lg">Education</h3>

                <div className="grid grid-cols-3 gap-10">
                    <FormInput label="Institution Name" name="" required />
                    <FormInput label="Institution Location" name="" required />
                    <FormInput label="Major" name="" required />
                    <FormInput label="Degree" name="" required />
                    <FormInput type="date" label="Date" name="" required />
                </div>

                <FadedButton type="button" className="text-primary">
                    <AddSquareIcon />
                    Add Education
                </FadedButton>
            </section>

            <section className="space-y-3">
                <h3 className="font-bold text-lg">Language Proficiency</h3>

                <div className="grid grid-cols-3 gap-10">
                    <FormInput label="Language" name="" required />
                    <FormInput label="Proficiency Speaking" name="" required />
                    <FormInput label="Proficency Reading" name="" required />
                </div>

                <FadedButton type="button" className="text-primary">
                    <AddSquareIcon />
                    Add Language
                </FadedButton>
            </section>

            <section className="space-y-3">
                <h3 className="font-bold text-lg">Employment History</h3>

                <div className="grid grid-cols-3 gap-10">
                    <FormInput label="Position Title" name="" required />
                    <FormInput label="Employer Name" name="" required />
                    <FormInput label="Employee Telephone" name="" required />
                    <FormInput type="date" label="From" name="" required />
                    <FormInput type="date" label="To" name="" required />
                </div>

                <FadedButton type="button" className="text-primary">
                    <AddSquareIcon />
                    Add Employment History
                </FadedButton>
            </section>

            <section className="space-y-3">
                <h3 className="font-bold text-lg">
                    Specific Consultant Services
                </h3>

                <div className="grid grid-cols-3 gap-10">
                    <FormInput label="Services Performed" name="" required />
                    <FormInput label="Employer Name" name="" required />
                    <FormInput label="Employee Telephone" name="" required />
                    <FormInput type="date" label="From" name="" required />
                    <FormInput type="date" label="To" name="" required />
                </div>

                <FadedButton type="button" className="text-primary">
                    <AddSquareIcon />
                    Add Consultant Service
                </FadedButton>
            </section>

            <section className="space-y-3">
                <h3 className="font-bold font-lg">Referees</h3>

                <div className="grid grid-cols-2 gap-10">
                    <FormInput label="Name" name="" required />
                    <FormInput label="Email" name="" required />
                </div>

                <Button
                    type="button"
                    variant="ghost"
                    className="p-0 hover:bg-transparent"
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
                        <AiFillPlusCircle
                            size={24}
                            className="text-green-500"
                        />
                        Add Document
                    </Button>
                </Upload>
            </section>
        </div>
    );
}
