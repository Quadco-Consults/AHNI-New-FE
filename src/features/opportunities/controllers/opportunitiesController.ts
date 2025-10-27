"use client";

import { useQuery } from "@tanstack/react-query";
import {
  UnifiedOpportunity,
  OpportunityFilters,
  HRJobOpportunity,
  ConsultantOpportunity,
  AdhocOpportunity,
  FacilitatorOpportunity,
  OpportunityType,
  OpportunityStatus,
} from "../types";

// Import existing controllers
import { useGetJobAdvertisements } from "@/features/hr/controllers/jobAdvertisementController";
import { useGetAllConsultantAdvertisements } from "@/features/contracts-grants/controllers/consultantAdvertisementController";
import { useGetAllAdhocAdvertisements } from "@/features/programs/controllers/adhocAdvertisementController";
import { useGetAllFacilitators } from "@/features/contracts-grants/controllers/facilitatorManagementController";

// Transformation functions to convert existing data to unified format
const transformHRJob = (job: any): HRJobOpportunity => ({
  id: job.id,
  type: "HR_JOB",
  title: job.title,
  status: "ACTIVE" as OpportunityStatus, // HR jobs don't have explicit status
  created_datetime: job.created_datetime,
  updated_datetime: job.updated_datetime,
  created_by: job.created_by,
  grade_level: job.grade_level,
  locations: job.locations,
  commencement_date: job.commencement_date,
  duration: job.duration,
  background: job.background,
  supervisor: job.supervisor,
  number_of_positions: job.number_of_positions,
  advertisement_document: job.advert_document,
  job_type: job.job_type,
  any_other_info: job.any_other_info,
  advert_document: job.advert_document,
  interviewers: job.interviewers,
});

const transformConsultant = (consultant: any): ConsultantOpportunity => ({
  id: consultant.id,
  type: "CONSULTANT",
  title: consultant.title,
  status: consultant.status?.toUpperCase() as OpportunityStatus || "ACTIVE",
  created_datetime: consultant.created_datetime,
  created_by: consultant.created_by,
  grade_level: consultant.grade_level,
  locations: consultant.locations?.map((loc: any) => loc.name || loc).join(", "),
  commencement_date: consultant.commencement_date,
  end_date: consultant.end_date,
  duration: consultant.duration,
  background: consultant.background,
  supervisor: consultant.supervisor?.full_name || consultant.supervisor,
  number_of_positions: consultant.consultants_number,
  advertisement_document: consultant.advertisement_document,
  consultants_number: consultant.consultants_number,
  scope_of_work: consultant.scope_of_work,
  extra_info: consultant.extra_info,
  evaluation_comments: consultant.evaluation_comments,
});

const transformAdhoc = (adhoc: any): AdhocOpportunity => ({
  id: adhoc.id,
  type: "ADHOC",
  title: adhoc.position_title,
  status: adhoc.status as OpportunityStatus,
  created_datetime: adhoc.created_datetime,
  updated_datetime: adhoc.updated_datetime,
  created_by: adhoc.created_by_name || adhoc.created_by,
  grade_level: adhoc.grade_level,
  locations: adhoc.location_name || adhoc.location,
  commencement_date: adhoc.start_date,
  end_date: adhoc.end_date,
  duration: adhoc.duration_months,
  background: adhoc.job_description,
  supervisor: adhoc.supervisor,
  number_of_positions: adhoc.number_of_positions,
  advertisement_document: adhoc.advertisement_document,
  total_applicants: adhoc.total_applicants,
  application_deadline: adhoc.application_deadline,
  department: adhoc.department?.name,
  project: adhoc.project?.title,

  // Adhoc-specific fields
  advertisement_number: adhoc.advertisement_number,
  position_title: adhoc.position_title,
  location_name: adhoc.location_name,
  health_facility: adhoc.health_facility,
  spoke_site_name: adhoc.spoke_site_name,
  lga: adhoc.lga,
  cluster: adhoc.cluster,
  start_date: adhoc.start_date,
  duration_months: adhoc.duration_months,
  proposed_salary: adhoc.proposed_salary,
  currency: adhoc.currency,
  budget_line: adhoc.budget_line,
  job_description: adhoc.job_description,
  key_responsibilities: adhoc.key_responsibilities,
  qualifications_required: adhoc.qualifications_required,
  skills_required: adhoc.skills_required,
  additional_requirements: adhoc.additional_requirements,
  experience_years: adhoc.experience_years,
  education_level: adhoc.education_level,
  shortlisted_count: adhoc.shortlisted_count,
  selected_count: adhoc.selected_count,
  hired_count: adhoc.hired_count,
  qmap_backstop: adhoc.qmap_backstop,
  programs_officer: adhoc.programs_officer,
  stl: adhoc.stl,
  seo: adhoc.seo,
  requisition: adhoc.requisition_details,
});

const transformFacilitator = (facilitator: any): FacilitatorOpportunity => ({
  id: facilitator.id,
  type: "FACILITATOR",
  title: facilitator.title,
  status: facilitator.status?.toUpperCase() as OpportunityStatus || "ACTIVE",
  created_datetime: facilitator.created_datetime,
  created_by: facilitator.created_by,
  grade_level: facilitator.grade_level,
  locations: facilitator.locations?.map((loc: any) => loc.name || loc).join(", "),
  commencement_date: facilitator.commencement_date,
  end_date: facilitator.end_date,
  duration: facilitator.duration,
  supervisor: facilitator.supervisor?.full_name || facilitator.supervisor,
  number_of_positions: facilitator.facilitator_number,
  advertisement_document: facilitator.advertisement_document,
  facilitator_number: facilitator.facilitator_number,
  scope_of_work: facilitator.scope_of_work,
  extra_info: facilitator.extra_info,
  evaluation_comments: facilitator.evaluation_comments,
});

// Main hook to get all opportunities with unified format
export function useGetAllOpportunities(filters: OpportunityFilters = {}) {
  // Get data from all sources
  const {
    data: hrJobsData,
    isLoading: hrLoading,
    error: hrError,
  } = useGetJobAdvertisements({
    page: filters.page,
    size: filters.size,
    search: filters.search,
  });

  const {
    data: consultantData,
    isLoading: consultantLoading,
    error: consultantError,
  } = useGetAllConsultantAdvertisements();

  const {
    data: adhocData,
    isLoading: adhocLoading,
    error: adhocError,
  } = useGetAllAdhocAdvertisements({
    page: filters.page,
    size: filters.size,
    search: filters.search,
    status: filters.status?.[0],
  });

  const {
    data: facilitatorData,
    isLoading: facilitatorLoading,
    error: facilitatorError,
  } = useGetAllFacilitators({});

  return useQuery({
    queryKey: ["unified-opportunities", filters],
    queryFn: async () => {
      const opportunities: UnifiedOpportunity[] = [];

      // Transform and add HR jobs
      if (hrJobsData?.data?.results) {
        const hrOpportunities = hrJobsData.data.results.map(transformHRJob);
        opportunities.push(...hrOpportunities);
      }

      // Transform and add consultant positions
      if (consultantData?.data?.results) {
        const consultantOpportunities = consultantData.data.results.map(transformConsultant);
        opportunities.push(...consultantOpportunities);
      }

      // Transform and add adhoc positions
      if (adhocData?.data?.results) {
        const adhocOpportunities = adhocData.data.results.map(transformAdhoc);
        opportunities.push(...adhocOpportunities);
      }

      // Add facilitator positions
      if (facilitatorData?.data?.results) {
        const facilitatorOpportunities = facilitatorData.data.results.map(transformFacilitator);
        opportunities.push(...facilitatorOpportunities);
      }

      // Apply client-side filtering
      let filteredOpportunities = opportunities;

      // Filter by type
      if (filters.type && filters.type.length > 0) {
        filteredOpportunities = filteredOpportunities.filter(op =>
          filters.type!.includes(op.type)
        );
      }

      // Filter by status
      if (filters.status && filters.status.length > 0) {
        filteredOpportunities = filteredOpportunities.filter(op =>
          filters.status!.includes(op.status)
        );
      }

      // Filter by location
      if (filters.location && filters.location.length > 0) {
        filteredOpportunities = filteredOpportunities.filter(op => {
          const opLocation = typeof op.locations === 'string'
            ? op.locations.toLowerCase()
            : (op.locations || []).join(' ').toLowerCase();
          return filters.location!.some(loc =>
            opLocation.includes(loc.toLowerCase())
          );
        });
      }

      // Filter by grade level
      if (filters.grade_level && filters.grade_level.length > 0) {
        filteredOpportunities = filteredOpportunities.filter(op =>
          op.grade_level && filters.grade_level!.includes(op.grade_level)
        );
      }

      // Filter by date range
      if (filters.date_from || filters.date_to) {
        filteredOpportunities = filteredOpportunities.filter(op => {
          const opDate = new Date(op.created_datetime);
          if (filters.date_from && opDate < new Date(filters.date_from)) return false;
          if (filters.date_to && opDate > new Date(filters.date_to)) return false;
          return true;
        });
      }

      // Sort by created date (newest first)
      filteredOpportunities.sort((a, b) =>
        new Date(b.created_datetime).getTime() - new Date(a.created_datetime).getTime()
      );

      return {
        opportunities: filteredOpportunities,
        total: filteredOpportunities.length,
        pagination: {
          count: filteredOpportunities.length,
          page: filters.page || 1,
          page_size: filters.size || 20,
          total_pages: Math.ceil(filteredOpportunities.length / (filters.size || 20)),
        }
      };
    },
    enabled: !!(hrJobsData || consultantData || adhocData || facilitatorData),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to get opportunity statistics
export function useGetOpportunityStatistics() {
  const { data: allOpportunities } = useGetAllOpportunities();

  return useQuery({
    queryKey: ["opportunity-statistics"],
    queryFn: () => {
      if (!allOpportunities?.opportunities) {
        return {
          total: 0,
          byType: {},
          byStatus: {},
          recent: 0,
        };
      }

      const opportunities = allOpportunities.opportunities;
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const byType = opportunities.reduce((acc, op) => {
        acc[op.type] = (acc[op.type] || 0) + 1;
        return acc;
      }, {} as Record<OpportunityType, number>);

      const byStatus = opportunities.reduce((acc, op) => {
        acc[op.status] = (acc[op.status] || 0) + 1;
        return acc;
      }, {} as Record<OpportunityStatus, number>);

      const recent = opportunities.filter(op =>
        new Date(op.created_datetime) > oneWeekAgo
      ).length;

      return {
        total: opportunities.length,
        byType,
        byStatus,
        recent,
      };
    },
    enabled: !!allOpportunities?.opportunities,
  });
}

// Utility functions for filtering
export function getUniqueValues(
  opportunities: UnifiedOpportunity[],
  field: keyof UnifiedOpportunity
): string[] {
  const values = opportunities
    .map(op => op[field])
    .filter(Boolean)
    .flatMap(value =>
      typeof value === 'string'
        ? [value]
        : Array.isArray(value)
        ? value
        : []
    )
    .filter((value): value is string => typeof value === 'string');

  return [...new Set(values)].sort();
}

export function getAvailableFilters(opportunities: UnifiedOpportunity[]) {
  return {
    locations: getUniqueValues(opportunities, 'locations'),
    gradeLevels: getUniqueValues(opportunities, 'grade_level'),
    departments: opportunities
      .filter(op => op.type === 'ADHOC')
      .map(op => (op as AdhocOpportunity).department)
      .filter(Boolean) as string[],
    projects: opportunities
      .filter(op => op.type === 'ADHOC')
      .map(op => (op as AdhocOpportunity).project)
      .filter(Boolean) as string[],
  };
}