// Contracts & Grants Controllers
export * from "./grantController";
export * from "./closeoutPlanController";
export * from "./agreementController";
export * from "./consultancyApplicantsController";
// export * from './consultantManagementController';
export * from "./consultancyReportController";
export * from "./contractController";
export * from "./facilitatorManagementController";
export * from "./expenditureController";
export * from "./obligationController";
export * from "./subGrantController";
export * from "./submissionUploadController";
export * from "./submissionController";

// Default exports for convenience
export { useGetAllGrants, useGetAllGrantsQuery } from "./grantController";
export {
  useGetAllCloseoutPlans,
  useGetAllCloseOutPlansQuery,
} from "./closeoutPlanController";
export {
  useGetAllAgreements,
  useGetAllAgreementsQuery,
} from "./agreementController";
export {
  useGetAllConsultancyApplicants,
  useGetAllConsultancyStaffsQuery,
} from "./consultancyApplicantsController";
export {
  useGetAllConsultantManagements,
  useGetAllConsultantManagementsQuery,
} from "./consultantManagementController";
export {
  useGetAllConsultancyReports,
  useGetAllConsultancyReportsQuery,
} from "./consultancyReportController";
export {
  useGetAllContractRequests,
  useGetAllContractRequestsQuery,
} from "./contractController";
export {
  useGetAllFacilitators,
  useGetAllFacilitatorsQuery,
} from "./facilitatorManagementController";
export {
  useGetAllExpenditures,
  useGetAllExpendituresQuery,
} from "./expenditureController";
export {
  useGetAllObligations,
  useGetAllObligationsQuery,
} from "./obligationController";
export {
  useGetAllSubGrants,
  useGetAllSubGrantsQuery,
} from "./subGrantController";
export {
  useGetAllSubGrantUploads,
  useGetAllSubGrantUploadsQuery,
} from "./submissionUploadController";
export {
  useGetAllSubGrantSubmissions,
  useGetAllSubGrantManualSubQuery,
} from "./submissionController";
