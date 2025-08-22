// HR Controllers
export * from './leaveRequestController';
export * from './compensationController';
export * from './grievanceController';
export * from './employeeOnboardingController';
export * from './jobAdvertisementController';
export * from './payGroupController';
export * from './workforceController';

// New HR Controllers
export * from './hrBeneficiaryController';
export * from './hrCompensationSpreadController';
export * from './hrEmployeeOnboardingAuthorizationController';
export * from './hrEmployeeOnboardingAddInfoController';
export * from './hrEmployeeOnboardingSignatoryController';
export * from './hrEmployeeOnboardingBankAccountController';
export * from './hrEmployeeOnboardingPensionController';
export * from './hrEmployeeOnboardingQualificationsController';
export * from './hrGrievianceManagementDocumentController';
export * from './hrInterviewController';
export * from './hrJobApplicationsController';
export * from './hrLeavePackageController';
export * from './hrPayRollController';
export * from './hrPerformanceAssessmentController';
export * from './hrWorkforceNeedAnalysisController';
export * from './hrGradeController';
export * from './hrPositionController';

// Default exports for convenience
export { useGetLeaveRequests, useGetLeaveRequestsQuery } from './leaveRequestController';
export { useGetCompensations, useGetCompensationsQuery } from './compensationController';
export { useGetGrievances, useGetGrievianceManagementsQuery } from './grievanceController';
export { useGetEmployeeOnboardings, useGetEmployeeOnboardingsQuery } from './employeeOnboardingController';
export { useGetJobAdvertisements, useGetJobAdvertisementsQuery } from './jobAdvertisementController';
export { useGetPayGroups, useGetPayGroupsQuery } from './payGroupController';
export { useGetWorkforces, useGetWorkforcesQuery } from './workforceController';

// New controller convenience exports
export { useGetHrBeneficiaries, useGetHrBeneficiariesQuery } from './hrBeneficiaryController';
export { useGetCompensationsSpread, useGetCompensationsSpreadQuery } from './hrCompensationSpreadController';
export { useGetSystemAuthorizationList, useGetSystemAuthorizationListQuery } from './hrEmployeeOnboardingAuthorizationController';
export { useGetHrEmergencyList, useGetHrEmergencyListQuery } from './hrEmployeeOnboardingAddInfoController';
export { useGetEmployeeOnboardingAddSignatory, useGetEmployeeOnboardingAddSignatoryQuery } from './hrEmployeeOnboardingSignatoryController';
export { useGetEmployeeOnboardingBankAcct, useGetEmployeeOnboardingBankAcctQuery } from './hrEmployeeOnboardingBankAccountController';
export { useGetEmployeeOnboardingPension, useGetEmployeeOnboardingPensionQuery } from './hrEmployeeOnboardingPensionController';
export { useGetEmployeeOnboardingQualificationsList, useGetEmployeeOnboardingQualificationsListQuery } from './hrEmployeeOnboardingQualificationsController';
export { useGetGrievianceManagementDocuments, useGetGrievianceManagementDocumentsQuery } from './hrGrievianceManagementDocumentController';
export { useGetInterviews, useGetInterviewsQuery } from './hrInterviewController';
export { useGetJobApplications, useGetJobApplicationsQuery } from './hrJobApplicationsController';
export { useGetLeavePackages, useGetLeavePackagesQuery } from './hrLeavePackageController';
export { useGetPayRolls, useGetPayRollsQuery } from './hrPayRollController';
export { useGetPerformanceAssesments, useGetPerformanceAssesmentsQuery } from './hrPerformanceAssessmentController';
export { useGetWorkforceNeedAnalysis, useGetWorkforceNeedAnalysisQuery } from './hrWorkforceNeedAnalysisController';
export { useGetHrGrades, useGetHrGradesQuery } from './hrGradeController';
export { useGetHrPositions, useGetHrPositionsQuery } from './hrPositionController';