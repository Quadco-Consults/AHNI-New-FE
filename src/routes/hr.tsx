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
    path: HrRoutes.WORKFORCE_DATABASE,
    element: lazy(
      () => import("pages/protectedPages/hr/workforce-database/index")
    ),
  },
  {
    path: HrRoutes.WORKFORCE_DATABASE_DETAIL,
    element: lazy(
      () => import("pages/protectedPages/hr/workforce-database/id/index")
    ),
  },
  {
    path: HrRoutes.EMPLOYEE_BENEFITS,
    element: lazy(
      () => import("pages/protectedPages/hr/employee-benefits/index")
    ),
  },
  {
    path: HrRoutes.GRIEVANCE_MANAGEMENT,
    element: lazy(
      () => import("pages/protectedPages/hr/grievance-management/index")
    ),
  },
  {
    path: HrRoutes.LEAVE_MANAGEMENT,
    element: lazy(
      () => import("pages/protectedPages/hr/leave-management/index")
    ),
  },
  {
    path: HrRoutes.PERFORMANCE_MANAGEMENT,
    element: lazy(
      () => import("pages/protectedPages/hr/performance-management/index")
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
