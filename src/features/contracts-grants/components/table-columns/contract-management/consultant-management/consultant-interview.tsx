import { ColumnDef } from "@tanstack/react-table";
import { IConsultancyStaffPaginatedData } from "@/features/contracts-grants/types/contract-management/consultancy-management/consultancy-application";
import FormSelect from "components/atoms/FormSelect";

const scoreOptions = ["1", "2", "3", "4", "5"].map((value) => ({
    label: value,
    value,
}));

// Function that returns columns with form control
const createApplicantInterviewColumns = (): ColumnDef<IConsultancyStaffPaginatedData>[] => [
    {
        id: "header",
        header: () => (
            <div className=" bg-gray-50 p-3">
                <h2 className="text-lg text-[#DEA004] font-bold">
                    Relevant Experience Requirements
                </h2>
            </div>
        ),
        footer: "Total Scores",
        columns: [
            {
                header: "Has done similar work previously (nature of task)",
                cell: () => (
                    <FormSelect
                        name="similar_work"
                        placeholder="Select Score"
                        options={scoreOptions}
                    />
                ),
                size: 250,
            },

            {
                header: "Understands project management and the potential task(s)",
                cell: () => (
                    <FormSelect
                        name="project_management"
                        placeholder="Select Score"
                        options={scoreOptions}
                    />
                ),
                size: 250,
            },

            {
                header: "Experience is recent (2-3 years)",
                cell: () => (
                    <FormSelect
                        name="recent_experience"
                        placeholder="Select Score"
                        options={scoreOptions}
                    />
                ),
                size: 250,
            },

            {
                header: "Worked with projects comparable to the AHNi (budget and complexity)",
                cell: () => (
                    <FormSelect
                        name="comparable_projects"
                        placeholder="Select Score"
                        options={scoreOptions}
                    />
                ),
                size: 250,
            },

            {
                header: "Excellent Communication Skills",
                cell: () => (
                    <FormSelect
                        name="communication_skills"
                        placeholder="Select Score"
                        options={scoreOptions}
                    />
                ),
                size: 250,
            },

            {
                header: "Relevant Technical Skill",
                cell: () => (
                    <FormSelect
                        name="relevant_technical_skill"
                        placeholder="Select Score"
                        options={scoreOptions}
                    />
                ),
                size: 250,
            },

            {
                header: "Qualifications are relevant to the consultancy",
                cell: () => (
                    <FormSelect
                        name="relevant_qualifications"
                        placeholder="Select Score"
                        options={scoreOptions}
                    />
                ),
                size: 250,
            },
            {
                header: "Strong academic credentials",
                cell: () => (
                    <FormSelect
                        name="academic_credentials"
                        placeholder="Select Score"
                        options={scoreOptions}
                    />
                ),
                size: 250,
            },
            {
                header: "Demonstrated ability to manage the project/consultancy timelines",
                cell: () => (
                    <FormSelect
                        name="project_timelines"
                        placeholder="Select Score"
                        options={scoreOptions}
                    />
                ),
                size: 250,
            },
            {
                header: "Proven toolset and framework",
                cell: () => (
                    <FormSelect
                        name="proven_toolset"
                        placeholder="Select Score"
                        options={scoreOptions}
                    />
                ),
                size: 250,
            },
        ],
    },
];

export default createApplicantInterviewColumns;
