import { IConsultancyStaffSingleData } from "@/features/contracts-grants/types/contract-management/consultancy-management/consultancy-application";
import DescriptionCard from "components/DescriptionCard";
import FilePreview from "components/FilePreview";

export default function SingleConsultancyStaffDetails({
    name,
    contractor_name,
    email,
    address,
    contract_number,
    position_under_contract,
    proposed_salary,
    phone_number,
    place_of_birth,
    citizenship,
    start_duration_date,
    end_duration_date,
    education,
    language_proficiency,
    employment_history,
    special_consultant_services,
    referees,
    documents,
}: IConsultancyStaffSingleData) {
    return (
        <div>
            <h3 className="text-lg font-bold">{name}</h3>

            <div className="grid grid-cols-3 gap-10 mt-5">
                <DescriptionCard
                    label="Contractor Name"
                    description={contractor_name}
                />

                <DescriptionCard label="Email" description={email} />

                <DescriptionCard
                    label="Employee Address"
                    description={address || ""}
                    className="col-span-3"
                />

                <DescriptionCard
                    label="Contract Number"
                    description={contract_number}
                />

                <DescriptionCard
                    label="Position Under Contract"
                    description={position_under_contract}
                />

                <DescriptionCard
                    label="Proposed Amount / Rate"
                    description={proposed_salary}
                />

                <DescriptionCard
                    label="Telephone Number"
                    description={phone_number}
                />

                <DescriptionCard
                    label="Place of Birth"
                    description={place_of_birth}
                />

                <DescriptionCard label="Date of Birth" description="N/A" />

                <DescriptionCard
                    label="Citizenship"
                    description={citizenship}
                />

                <section className="col-span-3 space-y-3">
                    <h3 className="font-bold text-lg">
                        Duration of Assignment
                    </h3>

                    <div className="grid grid-cols-3 gap-10">
                        <DescriptionCard
                            label="Start Date"
                            description={start_duration_date}
                        />

                        <DescriptionCard
                            label="End Date"
                            description={end_duration_date}
                        />
                    </div>
                </section>

                <section className="col-span-3 space-y-3">
                    <h3 className="font-bold text-lg">Language Proficiency</h3>

                    <div className="space-y-10">
                        {education.map(
                            ({ name, location, major, degree, date }) => (
                                <div className="grid grid-cols-3 gap-10">
                                    <DescriptionCard
                                        label="Institution Name"
                                        description={name}
                                    />

                                    <DescriptionCard
                                        label="Institution Location"
                                        description={location}
                                    />

                                    <DescriptionCard
                                        label="Major"
                                        description={major}
                                    />

                                    <DescriptionCard
                                        label="Degree"
                                        description={degree}
                                    />

                                    <DescriptionCard
                                        label="Date"
                                        description={date}
                                    />
                                </div>
                            )
                        )}
                    </div>
                </section>

                <section className="col-span-3 space-y-3">
                    <h3 className="font-bold text-lg">Education</h3>

                    <div className="space-y-10">
                        {language_proficiency.map(
                            ({
                                language,
                                proficiency_speaking,
                                proficiency_reading,
                            }) => (
                                <div className="grid grid-cols-3 gap-10">
                                    <DescriptionCard
                                        label="Lanugage"
                                        description={language}
                                    />

                                    <DescriptionCard
                                        label="Proficiency Speaking"
                                        description={proficiency_speaking}
                                    />

                                    <DescriptionCard
                                        label="Proficiency Reading"
                                        description={proficiency_reading}
                                    />
                                </div>
                            )
                        )}
                    </div>
                </section>

                <section className="col-span-3 space-y-3">
                    <h3 className="font-bold text-lg">Employment History</h3>

                    <div className="space-y-10">
                        {employment_history.map(
                            ({
                                position_title,
                                employer_name,
                                employer_telephone,
                                from,
                                to,
                            }) => (
                                <div className="grid grid-cols-3 gap-10">
                                    <DescriptionCard
                                        label="Position Title"
                                        description={position_title}
                                    />

                                    <DescriptionCard
                                        label="Employer Name"
                                        description={employer_name}
                                    />

                                    <DescriptionCard
                                        label="Employer Telephone"
                                        description={employer_telephone}
                                    />

                                    <DescriptionCard
                                        label="From"
                                        description={from}
                                    />

                                    <DescriptionCard
                                        label="To"
                                        description={to}
                                    />
                                </div>
                            )
                        )}
                    </div>
                </section>

                <section className="col-span-3 space-y-3">
                    <h3 className="font-bold text-lg">
                        Specific Consultant Services
                    </h3>

                    <div className="space-y-10">
                        {special_consultant_services.map(
                            ({
                                services_performed,
                                employer_name,
                                employer_telephone,
                                from,
                                to,
                            }) => (
                                <div className="grid grid-cols-3 gap-10">
                                    <DescriptionCard
                                        label="Services Performed"
                                        description={services_performed}
                                    />

                                    <DescriptionCard
                                        label="Employer Name"
                                        description={employer_name}
                                    />

                                    <DescriptionCard
                                        label="Employer Telephone"
                                        description={employer_telephone}
                                    />

                                    <DescriptionCard
                                        label="From"
                                        description={from}
                                    />

                                    <DescriptionCard
                                        label="To"
                                        description={to}
                                    />
                                </div>
                            )
                        )}
                    </div>
                </section>

                <section className="col-span-3 space-y-3">
                    <h3 className="font-bold text-lg">Referees</h3>

                    <div className="space-y-10">
                        {referees.map(({ name, email, phone_number }) => (
                            <div className="grid grid-cols-3 gap-10">
                                <DescriptionCard
                                    label="Name"
                                    description={name}
                                />

                                <DescriptionCard
                                    label="Email"
                                    description={email}
                                />

                                <DescriptionCard
                                    label="Phone Number"
                                    description={phone_number}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                <section className="col-span-3 space-y-3">
                    <h3 className="font-bold text-lg">Documents</h3>

                    {documents.length === 0 && <p>No documents uploaded</p>}

                    <div className="grid grid-cols-2 gap-10">
                        {documents?.map(
                            ({ name, document, updated_datetime }, index) => {
                                const documentName =
                                    name === "file-letter"
                                        ? "Cover Letter"
                                        : "Resume";

                                // Only render if document exists
                                if (!document) {
                                    return (
                                        <div key={`${name}-${index}`} className="border border-dashed border-gray-300 p-4 rounded-lg text-center text-gray-500">
                                            <p>{documentName}</p>
                                            <p className="text-sm">Document not available</p>
                                        </div>
                                    );
                                }

                                return (
                                    <FilePreview
                                        key={`${name}-${index}`}
                                        name={documentName}
                                        file={document}
                                        timestamp={updated_datetime}
                                    />
                                );
                            }
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
