import { useAppSelector } from '../store/hooks';
import { useMemo } from 'react';

export function useProgramOfficerPermissions() {
  const authState = useAppSelector((state: any) => state.auth);
  const { user: currentUser, isAuthenticated, loading } = authState;

  // Check for permissions at root level (new structure) or user level (fallback)
  const userPermissions = authState.permissions || currentUser?.permissions || [];

  return useMemo(() => {
    // If not authenticated or still loading, return empty permissions
    if (!isAuthenticated || loading || !currentUser || userPermissions.length === 0) {
      return {
        // Default false values
        canCreateWorkplan: false,
        canCreateFundRequest: false,
        canCreateLeaveRequest: false,
        canCreateTimesheet: false,
        canApplyForJob: false,
        canCreatePurchaseRequest: false,
        canCreateEA: false,
        canCreateTER: false,
        canCreateItemRequisition: false,
        canCreateAdhocRequisition: false,
        canCreateAnnualPlan: false,
        canCreateSiteVisit: false,
        canCreateActivityMemo: false,
        // View permissions
        canViewWorkplan: false,
        canViewFundRequest: false,
        canViewLeaveRequest: false,
        canViewTimesheet: false,
        canViewJobApplication: false,
        canViewPurchaseRequest: false,
        canViewEA: false,
        canViewTER: false,
        canViewItemRequisition: false,
        canViewAdhocRequisition: false,
        canViewAnnualPlan: false,
        canViewSiteVisit: false,
        canViewActivityMemo: false,
        // Edit permissions
        canEditWorkplan: false,
        canEditFundRequest: false,
        canEditLeaveRequest: false,
        canEditTimesheet: false,
        canEditJobApplication: false,
        canEditPurchaseRequest: false,
        canEditEA: false,
        canEditTER: false,
        canEditItemRequisition: false,
        canEditAdhocRequisition: false,
        canEditAnnualPlan: false,
        canEditSiteVisit: false,
        canEditActivityMemo: false,
        // Approval permissions (should be false for Program Officer)
        canApprove: false,
        canAuthorize: false,
        canReview: false,
        // Computed properties
        hasAnyProgramPermissions: false,
        hasAnyHRPermissions: false,
        hasAnyProcurementPermissions: false,
        hasAnyAdminPermissions: false,
        isProgramOfficer: false,

        // Authentication state
        isAuthenticated: false,
        loading: loading || false
      };
    }

    // Helper function to check if user has a specific permission
    const hasPermission = (module: string, codename: string): boolean => {
      const modulePerms = userPermissions.find((p: any) => p.module === module);
      return modulePerms?.permissions.some((p: any) => p.codename === codename) || false;
    };

    // Programs Module permissions
    const canCreateWorkplan = hasPermission('programs', 'add_workplan');
    const canEditWorkplan = hasPermission('programs', 'change_workplan');
    const canViewWorkplan = hasPermission('programs', 'view_workplan');

    const canCreateFundRequest = hasPermission('programs', 'add_fundrequest');
    const canEditFundRequest = hasPermission('programs', 'change_fundrequest');
    const canViewFundRequest = hasPermission('programs', 'view_fundrequest');

    const canCreateAnnualPlan = hasPermission('programs', 'add_annualsupervisionplan');
    const canEditAnnualPlan = hasPermission('programs', 'change_annualsupervisionplan');
    const canViewAnnualPlan = hasPermission('programs', 'view_annualsupervisionplan');

    const canCreateSiteVisit = hasPermission('programs', 'add_sitevisit');
    const canEditSiteVisit = hasPermission('programs', 'change_sitevisit');
    const canViewSiteVisit = hasPermission('programs', 'view_sitevisit');

    // HR Module permissions
    const canCreateLeaveRequest = hasPermission('hr', 'add_leaverequest');
    const canEditLeaveRequest = hasPermission('hr', 'change_leaverequest');
    const canViewLeaveRequest = hasPermission('hr', 'view_leaverequest');

    const canCreateTimesheet = hasPermission('hr', 'add_timesheet');
    const canEditTimesheet = hasPermission('hr', 'change_timesheet');
    const canViewTimesheet = hasPermission('hr', 'view_timesheet');

    const canApplyForJob = hasPermission('hr', 'add_jobapplication');
    const canEditJobApplication = hasPermission('hr', 'change_jobapplication');
    const canViewJobApplication = hasPermission('hr', 'view_jobapplication');

    // Procurement Module permissions
    const canCreatePurchaseRequest = hasPermission('procurements', 'add_purchaserequest');
    const canEditPurchaseRequest = hasPermission('procurements', 'change_purchaserequest');
    const canViewPurchaseRequest = hasPermission('procurements', 'view_purchaserequest');

    const canCreateActivityMemo = hasPermission('procurements', 'add_purchaserequestmemo');
    const canEditActivityMemo = hasPermission('procurements', 'change_purchaserequestmemo');
    const canViewActivityMemo = hasPermission('procurements', 'view_purchaserequestmemo');

    // AdminApp Module permissions (EA, TER, Item Requisitions)
    const canCreateEA = hasPermission('adminapp', 'add_expenseauthorization');
    const canEditEA = hasPermission('adminapp', 'change_expenseauthorization');
    const canViewEA = hasPermission('adminapp', 'view_expenseauthorization');

    const canCreateTER = hasPermission('adminapp', 'add_travelexpensereport');
    const canEditTER = hasPermission('adminapp', 'change_travelexpensereport');
    const canViewTER = hasPermission('adminapp', 'view_travelexpensereport');

    const canCreateItemRequisition = hasPermission('adminapp', 'add_itemrequisition');
    const canEditItemRequisition = hasPermission('adminapp', 'change_itemrequisition');
    const canViewItemRequisition = hasPermission('adminapp', 'view_itemrequisition');

    // Adhoc Requisitions Module permissions
    const canCreateAdhocRequisition = hasPermission('adhoc_requisitions', 'add_adhocrequisition');
    const canEditAdhocRequisition = hasPermission('adhoc_requisitions', 'change_adhocrequisition');
    const canViewAdhocRequisition = hasPermission('adhoc_requisitions', 'view_adhocrequisition');

    // Approval permissions (should be false for Program Officer)
    const canApprove = hasPermission('approvals', 'can_approve');
    const canAuthorize = hasPermission('approvals', 'can_authorize');
    const canReview = hasPermission('approvals', 'can_review');

    // Computed properties
    const hasAnyProgramPermissions = canCreateWorkplan || canCreateFundRequest || canViewWorkplan || canViewFundRequest;
    const hasAnyHRPermissions = canCreateLeaveRequest || canCreateTimesheet || canViewLeaveRequest || canViewTimesheet;
    const hasAnyProcurementPermissions = canCreatePurchaseRequest || canViewPurchaseRequest;
    const hasAnyAdminPermissions = canCreateEA || canCreateTER || canCreateItemRequisition ||
                                  canViewEA || canViewTER || canViewItemRequisition;

    // Check if user is a Program Officer (has the characteristic permissions but no approval rights)
    const isProgramOfficer = canCreateWorkplan &&
                           canCreateLeaveRequest &&
                           !canApprove &&
                           !canAuthorize &&
                           !canReview;

    return {
      // Create permissions
      canCreateWorkplan,
      canCreateFundRequest,
      canCreateLeaveRequest,
      canCreateTimesheet,
      canApplyForJob,
      canCreatePurchaseRequest,
      canCreateEA,
      canCreateTER,
      canCreateItemRequisition,
      canCreateAdhocRequisition,
      canCreateAnnualPlan,
      canCreateSiteVisit,
      canCreateActivityMemo,

      // View permissions
      canViewWorkplan,
      canViewFundRequest,
      canViewLeaveRequest,
      canViewTimesheet,
      canViewJobApplication,
      canViewPurchaseRequest,
      canViewEA,
      canViewTER,
      canViewItemRequisition,
      canViewAdhocRequisition,
      canViewAnnualPlan,
      canViewSiteVisit,
      canViewActivityMemo,

      // Edit permissions
      canEditWorkplan,
      canEditFundRequest,
      canEditLeaveRequest,
      canEditTimesheet,
      canEditJobApplication,
      canEditPurchaseRequest,
      canEditEA,
      canEditTER,
      canEditItemRequisition,
      canEditAdhocRequisition,
      canEditAnnualPlan,
      canEditSiteVisit,
      canEditActivityMemo,

      // Approval permissions (should be false for Program Officer)
      canApprove,
      canAuthorize,
      canReview,

      // Convenience computed properties
      hasAnyProgramPermissions,
      hasAnyHRPermissions,
      hasAnyProcurementPermissions,
      hasAnyAdminPermissions,
      isProgramOfficer,

      // Helper function for dynamic permission checks
      hasPermission,

      // Authentication state
      isAuthenticated: true,
      loading: false
    };
  }, [currentUser, isAuthenticated, loading, userPermissions]);
}