import { IConsultancyStaffSingleData } from "@/features/contracts-grants/types/contract-management/consultancy-management/consultancy-application";
import DescriptionCard from "components/DescriptionCard";
import FilePreview from "components/FilePreview";
import { useEffect, useState } from "react";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

export default function SingleConsultancyStaffDetails({
    name,
    email,
    address,
    position_under_contract,
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
    interview_scores,
    status,
    id,
}: IConsultancyStaffSingleData & { status?: string; id?: string }) {
    // State for individual interviews
    const [allInterviews, setAllInterviews] = useState<any[]>([]);
    const [loadingInterviews, setLoadingInterviews] = useState(false);

    // Fetch all individual interviews when component mounts
    useEffect(() => {
        if (id && interview_scores) {
            fetchAllInterviews();
        }
    }, [id, interview_scores]);

    const fetchAllInterviews = async () => {
        try {
            setLoadingInterviews(true);
            const response = await AxiosWithToken.get(
                `/contract-grants/consultancy/applicants/${id}/interviews/`
            );
            setAllInterviews(response.data || []);
        } catch (error) {
            console.error("Error fetching interviews:", error);
        } finally {
            setLoadingInterviews(false);
        }
    };

    // Status badge colors
    const getStatusBadge = (status?: string) => {
        const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
            'APPLIED': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Applied' },
            'SHORTLISTED': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Shortlisted' },
            'INTERVIEWED': { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Interviewed' },
            'ACCEPTED': { bg: 'bg-green-100', text: 'text-green-800', label: 'Accepted' },
            'CONTRACT_ISSUED': { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Contract Issued' },
            'REJECTED': { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
        };

        const config = status ? statusConfig[status] : null;
        if (!config) return null;

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };
    const criteriaLabels: Record<string, string> = {
        relevant_experience: "Has done similar work previously (nature of task)",
        project_management: "Understands project management and the potential task(s)",
        recent_experience: "Experience is recent (2-3 years)",
        comparable_projects: "Worked with projects comparable to the AHNI (budget and complexity)",
        communication_skills: "Excellent Communication Skills",
        technical_skill: "Relevant Technical Skill",
        relevant_qualification: "Qualifications are relevant to the consultancy",
        academic_credentials: "Strong academic credentials",
        timeline_management: "Demonstrated ability to manage the project/consultancy timelines",
        toolset_framework: "Proven toolset and framework",
    };

    // Debug logging
    console.log("📊 Interview Scores Debug:");
    console.log("- Has interview_scores:", !!interview_scores);
    console.log("- Interview scores data:", interview_scores);
    console.log("- Applicant name:", name);
    console.log("- Applicant status:", status);

    return (
        <div>
            <div className="flex justify-between items-start mb-8">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-3xl font-bold text-gray-900">{name}</h3>
                        {getStatusBadge(status)}
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>{email}</span>
                        </div>
                        {phone_number && (
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>{phone_number}</span>
                            </div>
                        )}
                    </div>
                </div>

                {interview_scores && (
                    <div className="bg-gradient-to-br from-[#DEA004] to-[#f59e0b] text-white rounded-2xl shadow-xl p-6 min-w-[280px]">
                        <div className="text-center">
                            <div className="text-sm font-medium opacity-90 mb-3">Overall Interview Score</div>
                            <div className="flex items-end justify-center gap-2 mb-2">
                                <span className="text-6xl font-bold">{interview_scores.total_score || 0}</span>
                                <span className="text-3xl font-semibold opacity-80 mb-3">/ 50</span>
                            </div>
                            <div className="text-sm opacity-90">
                                {interview_scores.total_score && interview_scores.total_score >= 40 ? '🌟 Excellent Performance' :
                                 interview_scores.total_score && interview_scores.total_score >= 30 ? '✨ Good Performance' :
                                 interview_scores.total_score && interview_scores.total_score >= 20 ? '👍 Average Performance' :
                                 '📝 Needs Improvement'}
                            </div>
                            {interview_scores.interview_date && (
                                <div className="mt-4 pt-4 border-t border-white/20">
                                    <p className="text-xs opacity-90">
                                        Interviewed on {new Date(interview_scores.interview_date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-3 gap-10 mt-8">
                <DescriptionCard label="Email" description={email} />

                <DescriptionCard
                    label="Employee Address"
                    description={address || ""}
                    className="col-span-3"
                />

                <DescriptionCard
                    label="Position Under Contract"
                    description={position_under_contract}
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

                <section className="col-span-3 space-y-4">
                    <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2 border-b pb-2">
                        <svg className="w-5 h-5 text-[#DEA004]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
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

                {interview_scores && (
                    <section className="col-span-3 space-y-4">
                        <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                            <svg className="w-6 h-6 text-[#DEA004]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Interview Evaluation Breakdown
                        </h3>

                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(interview_scores).map(([key, value]) => {
                                    // Skip total_score and interview_date as they're handled separately
                                    if (key === 'total_score' || key === 'interview_date' || value === undefined) return null;

                                    const label = criteriaLabels[key];
                                    if (!label) return null;

                                    // Calculate percentage for visual bar
                                    const percentage = ((value as number) / 5) * 100;

                                    // Determine color based on score
                                    let barColor = 'bg-red-500';
                                    if (value >= 4) barColor = 'bg-green-500';
                                    else if (value >= 3) barColor = 'bg-yellow-500';

                                    return (
                                        <div key={key} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="text-sm font-medium text-gray-700 leading-tight flex-1">{label}</p>
                                                <div className="ml-3 flex items-center gap-1">
                                                    <span className="text-xl font-bold text-gray-900">{value}</span>
                                                    <span className="text-sm text-gray-500">/ 5</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                )}

                {interview_scores && allInterviews.length > 1 && (
                    <section className="col-span-3 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                                <svg className="w-6 h-6 text-[#DEA004]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Individual Committee Member Scores
                            </h3>
                            <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                                {allInterviews.length} {allInterviews.length === 1 ? 'Interview' : 'Interviews'}
                            </span>
                        </div>

                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> The overall score shown above is the <strong>average</strong> of all individual committee member scores below.
                            </p>
                        </div>

                        {loadingInterviews ? (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#DEA004]"></div>
                                <p className="mt-2 text-gray-600">Loading interviews...</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {allInterviews.map((interview, index) => {
                                    const totalScore = [
                                        interview.relevant_experience,
                                        interview.project_management,
                                        interview.recent_experience,
                                        interview.comparable_projects,
                                        interview.communication_skills,
                                        interview.technical_skill,
                                        interview.relevant_qualification,
                                        interview.academic_credentials,
                                        interview.timeline_management,
                                        interview.toolset_framework
                                    ].reduce((sum, score) => sum + (score || 0), 0);

                                    return (
                                        <div key={interview.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                                            {/* Header with interviewer info */}
                                            <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        <h4 className="font-semibold text-lg text-gray-900">
                                                            {interview.interviewer?.name || interview.interviewer?.email || 'Committee Member'}
                                                        </h4>
                                                    </div>
                                                    <p className="text-sm text-gray-600 ml-7">
                                                        {interview.interview_type === 'COMMITTEE' ? 'Committee Interview' : 'Individual Interview'} •
                                                        {new Date(interview.date).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>

                                                {/* Individual Score Badge */}
                                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg px-4 py-2 text-center min-w-[100px]">
                                                    <div className="text-sm font-medium opacity-90">Score</div>
                                                    <div className="flex items-end justify-center gap-1">
                                                        <span className="text-3xl font-bold">{totalScore}</span>
                                                        <span className="text-lg opacity-80 mb-1">/ 50</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Scores Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {Object.entries(criteriaLabels).map(([key, label]) => {
                                                    const value = interview[key as keyof typeof interview];
                                                    if (value === undefined || value === null) return null;

                                                    const percentage = ((value as number) / 5) * 100;
                                                    let barColor = 'bg-red-500';
                                                    if (value >= 4) barColor = 'bg-green-500';
                                                    else if (value >= 3) barColor = 'bg-yellow-500';

                                                    return (
                                                        <div key={key} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <p className="text-xs font-medium text-gray-700">{label}</p>
                                                                <span className="text-lg font-bold text-gray-900">{value}<span className="text-xs text-gray-500">/5</span></span>
                                                            </div>
                                                            <div className="w-full bg-gray-300 rounded-full h-1.5">
                                                                <div
                                                                    className={`h-full rounded-full ${barColor}`}
                                                                    style={{ width: `${percentage}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Comments if any */}
                                            {interview.comments && (
                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                    <p className="text-sm font-medium text-gray-700 mb-1">Comments:</p>
                                                    <p className="text-sm text-gray-600 italic">{interview.comments}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                )}

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
