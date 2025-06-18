import { HrRoutes } from "constants/RouterConstants";
import { lazy } from "react";

export const hr = [
  {
    path: HrRoutes.ADVERTISEMENT,
    element: lazy(() => import("pages/protectedPages/hr/advertisement/index")),
  },
  {
    path: HrRoutes.ADVERTISEMENT_ADD,
    element: lazy(
      () => import("pages/protectedPages/hr/advertisement/AddAdvertisement")
    ),
  },
  {
    path: HrRoutes.ADVERTISEMENT_DETAIL,
    element: lazy(
      () => import("pages/protectedPages/hr/advertisement/id/index")
    ),
  },
  {
    path: HrRoutes.ADVERTISEMENT_DETAIL_SUB_APP,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/hr/advertisement/id/SubmittedApplicationDetail"
        )
    ),
  },
  {
    path: HrRoutes.ADVERTISEMENT_MANUAL_APPLICATION_SUBMISSION,
    element: lazy(
      () => import("pages/protectedPages/hr/advertisement/id/ApplicationForm")
    ),
  },

  {
    path: HrRoutes.ADVERTISEMENT_INTERVIEW_FORM,
    element: lazy(
      () => import("pages/protectedPages/hr/advertisement/id/InterviewForm")
    ),
  },
  {
    path: HrRoutes.ADVERTISEMENT_INTERVIEW_DETAILS,
    element: lazy(
      () => import("pages/protectedPages/hr/advertisement/id/InterviewDetail")
    ),
  },
  {
    path: HrRoutes.SELECTION,
    element: lazy(() => import("pages/protectedPages/hr/selection/index")),
  },
  {
    path: HrRoutes.ONBOARDING,
    element: lazy(() => import("pages/protectedPages/hr/onboarding/index")),
  },
  {
    path: HrRoutes.ONBOARDING_START,
    element: lazy(
      () => import("pages/protectedPages/hr/onboarding/start-onboarding/index")
    ),
  },
  {
    path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_INFO,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/hr/onboarding/add-employee/EmployeeInformation"
        )
    ),
  },
  {
    path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_ADD,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/hr/onboarding/add-employee/AdditionalInformation"
        )
    ),
  },
  {
    path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_BENEFICIARY,
    element: lazy(
      () =>
        import("pages/protectedPages/hr/onboarding/add-employee/Beneficiary")
    ),
  },
  {
    path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_ID_CARD,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/hr/onboarding/add-employee/IdCardInformation"
        )
    ),
  },
  {
    path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_SALARY,
    element: lazy(
      () => import("pages/protectedPages/hr/onboarding/add-employee/Salary")
    ),
  },
  {
    path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_PENSION,
    element: lazy(
      () => import("pages/protectedPages/hr/onboarding/add-employee/Pension")
    ),
  },
  {
    path: HrRoutes.WORKFORCE_NEED_ANALYSIS,
    element: lazy(
      () => import("pages/protectedPages/hr/workforce-need-analysis/index")
    ),
  },
  {
    path: HrRoutes.WORKFORCE_NEED_ANALYSIS_CREATE,
    element: lazy(
      () => import("pages/protectedPages/hr/workforce-need-analysis/form/index")
    ),
  },
  {
    path: HrRoutes.WORKFORCE_DATABASE,
    element: lazy(
      () => import("pages/protectedPages/hr/workforce-database/index")
    ),
  },
  {
    path: HrRoutes.WORKFORCE_DATABASE_CREATE,
    element: lazy(
      () => import("pages/protectedPages/hr/workforce-database/create/index")
    ),
  },
  {
    path: HrRoutes.WORKFORCE_DATABASE_DETAIL,
    element: lazy(
      () => import("pages/protectedPages/hr/workforce-database/id/index")
    ),
  },
  {
    path: HrRoutes.EMPLOYEE_BENEFITS_PAY_ROLL,
    element: lazy(
      () => import("pages/protectedPages/hr/employee-benefits/Payroll/index")
    ),
  },
  {
    path: HrRoutes.EMPLOYEE_BENEFITS_PAY_ROLL_INFO,
    element: lazy(
      () => import("pages/protectedPages/hr/employee-benefits/Payroll/id/index")
    ),
  },
  {
    path: HrRoutes.EMPLOYEE_BENEFITS_PAY_GROUP,
    element: lazy(
      () => import("pages/protectedPages/hr/employee-benefits/PayGroup")
    ),
  },

  {
    path: HrRoutes.EMPLOYEE_BENEFITS_COMPENSATION,
    element: lazy(
      () => import("pages/protectedPages/hr/employee-benefits/Compensation")
    ),
  },
  {
    path: HrRoutes.EMPLOYEE_BENEFITS_COMPENSATION_SPREAD,
    element: lazy(
      () =>
        import("pages/protectedPages/hr/employee-benefits/CompensationSpread")
    ),
  },
  {
    path: HrRoutes.EMPLOYEE_BENEFITS_COMPENSATION_CREATE,
    element: lazy(
      () => import("pages/protectedPages/hr/employee-benefits/NewCompensation")
    ),
  },
  {
    path: HrRoutes.GRIEVANCE_MANAGEMENT,
    element: lazy(
      () => import("pages/protectedPages/hr/grievance-management/index")
    ),
  },
  {
    path: HrRoutes.GRIEVANCE_MANAGEMENT_CREATE,
    element: lazy(
      () => import("pages/protectedPages/hr/grievance-management/form/index")
    ),
  },
  {
    path: HrRoutes.GRIEVANCE_MANAGEMENT_DETAILS,
    element: lazy(
      () => import("pages/protectedPages/hr/grievance-management/id/index")
    ),
  },
  {
    path: HrRoutes.LEAVE_MANAGEMENT_LEAVE_LIST,
    element: lazy(
      () => import("pages/protectedPages/hr/leave-management/index")
    ),
  },
  {
    path: HrRoutes.LEAVE_MANAGEMENT_LEAVE_LIST_DETAIL,
    element: lazy(
      () => import("pages/protectedPages/hr/leave-management/id/index")
    ),
  },
  // {
  //   path: HrRoutes.LEAVE_MANAGEMENT_LEAVE_SETTINGS,
  //   element: lazy(
  //     () => import("pages/protectedPages/hr/leave-management/Settings")
  //   ),
  // },
  {
    path: HrRoutes.LEAVE_MANAGEMENT_REQUEST_LEAVE,
    element: lazy(
      () => import("pages/protectedPages/hr/leave-management/form/index")
    ),
  },
  {
    path: HrRoutes.LEAVE_MANAGEMENT_ASSIGN_LEAVE,
    element: lazy(
      () => import("pages/protectedPages/hr/leave-management/Assign")
    ),
  },
  {
    path: HrRoutes.PERFORMANCE_MANAGEMENT,
    element: lazy(
      () => import("pages/protectedPages/hr/performance-management/index")
    ),
  },
  {
    path: HrRoutes.PERFORMANCE_MANAGEMENT_DETAIL,
    element: lazy(
      () => import("pages/protectedPages/hr/performance-management/id/index")
    ),
  },

  {
    path: HrRoutes.PERFORMANCE_MANAGEMENT_CREATE,
    element: lazy(
      () => import("pages/protectedPages/hr/performance-management/form/index")
    ),
  },
  {
    path: HrRoutes.SEPARATION_MANAGEMENT,
    element: lazy(
      () => import("pages/protectedPages/hr/separation-management/index")
    ),
  },
  {
    path: HrRoutes.SEPARATION_MANAGEMENT_CREATE,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/hr/separation-management/CreateSeparationManagement"
        )
    ),
  },
  {
    path: HrRoutes.SEPARATION_MANAGEMENT_DETAIL,
    element: lazy(
      () => import("pages/protectedPages/hr/separation-management/id/index")
    ),
  },
  {
    path: HrRoutes.TIMESHEET_MANAGEMENT,
    element: lazy(
      () => import("pages/protectedPages/hr/timesheet-management/index")
    ),
  },
  {
    path: HrRoutes.TIMESHEET_MANAGEMENT_DETAIL,
    element: lazy(
      () => import("pages/protectedPages/hr/timesheet-management/id/index")
    ),
  },
  {
    path: HrRoutes.TIMESHEET_MANAGEMENT_DETAIL_CREATE,
    element: lazy(
      () =>
        import(
          "pages/protectedPages/hr/timesheet-management/id/CreateTimesheetManagementDetail"
        )
    ),
  },
  {
    path: HrRoutes.TIMESHEET_MANAGEMENT_CREATE,
    element: lazy(
      () =>
        import("pages/protectedPages/hr/timesheet-management/CreateTimesheet")
    ),
  },
];
