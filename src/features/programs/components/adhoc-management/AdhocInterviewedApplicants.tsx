"use client";

import { useState, useEffect } from "react";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { useGetApplicantsByAdvertisement } from "@/features/programs/controllers/adhocApplicantController";
import { adhocInterviewedColumns } from "@/features/programs/components/table-columns/adhoc-interviewed";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

interface AdhocInterviewedApplicantsProps {
  advertisementId: string;
}

export default function AdhocInterviewedApplicants({ advertisementId }: AdhocInterviewedApplicantsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [applicantsWithScores, setApplicantsWithScores] = useState<any[]>([]);
  const [loadingScores, setLoadingScores] = useState(false);

  const { data, isFetching } = useGetApplicantsByAdvertisement(
    advertisementId,
    {
      page: currentPage,
      size: 10,
      enabled: !!advertisementId,
    }
  );

  // Filter for interviewed and selected applicants
  const interviewedApplicants = data?.data?.results
    ?.filter((applicant: any) => {
      const belongsToThisAdvertisement = applicant.advertisement === advertisementId ||
                                         applicant.advertisement?.id === advertisementId;
      const isInterviewed = applicant.status === "INTERVIEWED" || applicant.status === "SELECTED";

      return belongsToThisAdvertisement && isInterviewed;
    })
    ?.map((applicant: any) => ({
      ...applicant,
      // Map from API response field names to expected field names
      sur_name: applicant.surname || applicant.sur_name,
      other_names: applicant.other_names,
      email_address: applicant.email || applicant.email_address,
      phone_number: applicant.phone_number,
    })) || [];

  // Fetch interview scores for each applicant
  useEffect(() => {
    const fetchScores = async () => {
      if (!interviewedApplicants.length) {
        setApplicantsWithScores([]);
        return;
      }

      setLoadingScores(true);
      console.log('📊 Fetching scores for', interviewedApplicants.length, 'interviewed applicants');

      try {
        // Fetch all interviews
        const interviewsResponse = await AxiosWithToken.get('/programs/adhoc/interviews/');
        const allInterviews = interviewsResponse.data?.data?.results || interviewsResponse.data?.data || [];

        // Fetch all scores
        const scoresResponse = await AxiosWithToken.get('/programs/adhoc/interview-scores/');
        const allScores = scoresResponse.data?.data?.results || scoresResponse.data?.data || [];

        console.log('📊 Fetched', allInterviews.length, 'interviews and', allScores.length, 'scores');

        // Enrich each applicant with their interview scores
        const enriched = interviewedApplicants.map((applicant: any) => {
          // Find the interview for this applicant
          const interview = Array.isArray(allInterviews)
            ? allInterviews.find((int: any) => {
                const intApplicant = int.applicant;
                const appId = typeof intApplicant === 'string' ? intApplicant : intApplicant?.id;
                return appId === applicant.id;
              })
            : null;

          if (!interview) {
            console.log('⚠️ No interview found for applicant:', applicant.id);
            return applicant;
          }

          // Find all scores for this interview
          const interviewScores = Array.isArray(allScores)
            ? allScores.filter((score: any) => {
                const scoreIntId = typeof score.interview === 'string' ? score.interview : score.interview?.id;
                return scoreIntId === interview.id;
              })
            : [];

          console.log(`📊 Found ${interviewScores.length} scores for applicant ${applicant.id}`);
          console.log(`📊 Score details:`, interviewScores.map((s: any) => ({
            id: s.id,
            total_score: s.total_score,
            percentage_score: s.percentage_score,
            status: s.status
          })));

          if (interviewScores.length === 0) {
            return applicant;
          }

          // Calculate average scores
          // The backend might not calculate total_score, so we calculate it from individual scores
          const totalScores = interviewScores.reduce((sum: number, score: any) => {
            // Try using total_score first, if it's 0 or missing, calculate from individual criteria
            let scoreValue = score.total_score || 0;

            // If total_score is 0, calculate from individual criteria scores
            if (scoreValue === 0) {
              const criteria = [
                'relevant_experience',
                'project_management',
                'recent_experience',
                'comparable_projects',
                'communication_skills',
                'technical_skill',
                'relevant_qualification',
                'academic_credentials',
                'timeline_management',
                'toolset_framework'
              ];

              scoreValue = criteria.reduce((criteriaSum, criterion) => {
                const value = parseInt(score[criterion]) || 0;
                return criteriaSum + value;
              }, 0);
            }

            console.log(`  Score ${score.id}: ${scoreValue} (total_score: ${score.total_score})`);
            return sum + scoreValue;
          }, 0);
          const averageScore = totalScores / interviewScores.length;
          const percentage = (averageScore / 50) * 100; // Assuming max score is 50

          console.log(`📊 Calculation for applicant ${applicant.id}:`, {
            totalScores,
            averageScore,
            percentage,
            numScores: interviewScores.length
          });

          return {
            ...applicant,
            average_scores: {
              total: averageScore,
              percentage: percentage,
            },
            completed_evaluations: interviewScores.length,
            total_interviewers: interview.committee_members?.length || 1,
          };
        });

        setApplicantsWithScores(enriched);
        console.log('✅ Enriched applicants with scores:', enriched);
        console.log('✅ First applicant average_scores:', enriched[0]?.average_scores);
        console.log('✅ First applicant completed_evaluations:', enriched[0]?.completed_evaluations);
        console.log('✅ First applicant total_interviewers:', enriched[0]?.total_interviewers);
      } catch (error) {
        console.error('❌ Error fetching scores:', error);
        setApplicantsWithScores(interviewedApplicants);
      } finally {
        setLoadingScores(false);
      }
    };

    fetchScores();
  }, [interviewedApplicants.length, data]); // Re-fetch when applicants change

  console.log('🔍 Interviewed Applicants Debug:', {
    advertisementId,
    totalApplicants: data?.data?.results?.length || 0,
    interviewedCount: interviewedApplicants.length,
    allApplicants: data?.data?.results?.map((a: any) => ({
      id: a.id,
      name: `${a.surname || a.sur_name} ${a.other_names}`,
      status: a.status,
      advertisement: a.advertisement
    }))
  });

  return (
    <section className='space-y-5'>
      <h1 className='text-xl font-bold'>Interviewed Applicants</h1>
      <TableFilters>
        {!isFetching && (!interviewedApplicants || interviewedApplicants.length === 0) ? (
          <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">No Interviewed Applicants</h4>
                <p className="text-sm text-gray-500 mt-1">
                  No applicants have been interviewed yet.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <DataTable
            columns={adhocInterviewedColumns}
            data={applicantsWithScores.length > 0 ? applicantsWithScores : interviewedApplicants}
            isLoading={isFetching || loadingScores}
            pagination={(data?.data as any)?.pagination || (data?.data as any)?.paginator ? {
              total: ((data?.data as any)?.pagination?.count || (data?.data as any)?.paginator?.count) ?? interviewedApplicants.length,
              pageSize: ((data?.data as any)?.pagination?.page_size || (data?.data as any)?.paginator?.page_size) ?? 10,
              onChange: (page: number) => setCurrentPage(page),
            } : undefined}
          />
        )}
      </TableFilters>
    </section>
  );
}
