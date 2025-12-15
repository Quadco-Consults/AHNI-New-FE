import { useAppSelector } from '../store/hooks';
import { useMemo } from 'react';

export function useAdminOfficerPermissions() {
  const authState = useAppSelector((state) => state.auth);
  const { user: currentUser, isAuthenticated, loading } = authState;

  // Check for permissions at root level (new structure) or user level (fallback)
  const userPermissions = authState.permissions || currentUser?.permissions || [];

  return useMemo(() => {
    // If not authenticated or still loading, return empty permissions
    if (!isAuthenticated || loading || !currentUser || userPermissions.length === 0) {
      return {
        // Default false values
        canCreateItemRequisition: false,
        canCreateAssetRequest: false,
        canCreateVehicleRequest: false,
        canCreatePaymentRequest: false,
        canCreateFacilityMaintenance: false,
        canCreateVehicleMaintenance: false,
        canCreateStoreTransfer: false,
        canCreateLeaveRequest: false,
        canCreateTimesheet: false,

        // View permissions
        canViewItemRequisition: false,
        canViewAssetRequest: false,
        canViewVehicleRequest: false,
        canViewPaymentRequest: false,
        canViewFacilityMaintenance: false,
        canViewVehicleMaintenance: false,
        canViewStoreTransfer: false,
        canViewConsumable: false,
        canViewAsset: false,
        canViewLeaveRequest: false,
        canViewTimesheet: false,

        // Edit permissions
        canEditItemRequisition: false,
        canEditAssetRequest: false,
        canEditVehicleRequest: false,
        canEditPaymentRequest: false,
        canEditFacilityMaintenance: false,
        canEditVehicleMaintenance: false,
        canEditStoreTransfer: false,
        canEditLeaveRequest: false,
        canEditTimesheet: false,

        // Approval permissions (should be false for Admin Officer)
        canApprove: false,
        canAuthorize: false,
        canReview: false,

        // Computed properties
        hasAnyAdminPermissions: false,
        hasAnyInventoryPermissions: false,
        hasAnyFleetPermissions: false,
        hasAnyFacilityPermissions: false,
        hasAnyHRPermissions: false,
        isAdminOfficer: false,

        // Authentication state
        isAuthenticated: false,
        loading: loading || false
      };
    }

    // Helper function to check if user has a specific permission
    const hasPermission = (module: string, codename: string): boolean => {
      const modulePerms = userPermissions.find(p => p.module === module);
      return modulePerms?.permissions.some(p => p.codename === codename) || false;
    };

    // AdminApp Module permissions - Inventory Management
    const canCreateItemRequisition = hasPermission('adminapp', 'add_itemrequisition');
    const canEditItemRequisition = hasPermission('adminapp', 'change_itemrequisition');
    const canViewItemRequisition = hasPermission('adminapp', 'view_itemrequisition');

    const canViewConsumable = hasPermission('adminapp', 'view_consumable');
    const canViewAsset = hasPermission('adminapp', 'view_asset');

    const canCreateStoreTransfer = hasPermission('adminapp', 'add_storetransfer');
    const canEditStoreTransfer = hasPermission('adminapp', 'change_storetransfer');
    const canViewStoreTransfer = hasPermission('adminapp', 'view_storetransfer');

    // AdminApp Module permissions - Asset Management
    const canCreateAssetRequest = hasPermission('adminapp', 'add_assetrequest');
    const canEditAssetRequest = hasPermission('adminapp', 'change_assetrequest');
    const canViewAssetRequest = hasPermission('adminapp', 'view_assetrequest');

    // AdminApp Module permissions - Fleet Management
    const canCreateVehicleRequest = hasPermission('adminapp', 'add_vehiclerequest');
    const canEditVehicleRequest = hasPermission('adminapp', 'change_vehiclerequest');
    const canViewVehicleRequest = hasPermission('adminapp', 'view_vehiclerequest');

    const canCreateVehicleMaintenance = hasPermission('adminapp', 'add_vehiclemaintenanceticket');
    const canEditVehicleMaintenance = hasPermission('adminapp', 'change_vehiclemaintenanceticket');
    const canViewVehicleMaintenance = hasPermission('adminapp', 'view_vehiclemaintenanceticket');

    // AdminApp Module permissions - Facility Management
    const canCreateFacilityMaintenance = hasPermission('adminapp', 'add_facilitymaintenanceticket');
    const canEditFacilityMaintenance = hasPermission('adminapp', 'change_facilitymaintenanceticket');
    const canViewFacilityMaintenance = hasPermission('adminapp', 'view_facilitymaintenanceticket');

    // AdminApp Module permissions - Payment Management
    const canCreatePaymentRequest = hasPermission('adminapp', 'add_paymentrequest');
    const canEditPaymentRequest = hasPermission('adminapp', 'change_paymentrequest');
    const canViewPaymentRequest = hasPermission('adminapp', 'view_paymentrequest');

    // HR Module permissions (for leave and timesheet)
    const canCreateLeaveRequest = hasPermission('hr', 'add_leaverequest');
    const canEditLeaveRequest = hasPermission('hr', 'change_leaverequest');
    const canViewLeaveRequest = hasPermission('hr', 'view_leaverequest');

    const canCreateTimesheet = hasPermission('hr', 'add_timesheet');
    const canEditTimesheet = hasPermission('hr', 'change_timesheet');
    const canViewTimesheet = hasPermission('hr', 'view_timesheet');

    // Approval permissions (should be false for Admin Officer)
    const canApprove = hasPermission('approvals', 'can_approve');
    const canAuthorize = hasPermission('approvals', 'can_authorize');
    const canReview = hasPermission('approvals', 'can_review');

    // Computed properties
    const hasAnyInventoryPermissions = canCreateItemRequisition || canViewItemRequisition || canViewConsumable || canViewAsset;
    const hasAnyFleetPermissions = canCreateVehicleRequest || canViewVehicleRequest || canViewVehicleMaintenance;
    const hasAnyFacilityPermissions = canCreateFacilityMaintenance || canViewFacilityMaintenance;
    const hasAnyAdminPermissions = hasAnyInventoryPermissions || hasAnyFleetPermissions || hasAnyFacilityPermissions;
    const hasAnyHRPermissions = canCreateLeaveRequest || canCreateTimesheet || canViewLeaveRequest || canViewTimesheet;

    // Check if user is an Admin Officer (has characteristic admin permissions but no approval rights)
    const isAdminOfficer = canCreateItemRequisition &&
                          canViewAssetRequest &&
                          canViewPaymentRequest &&
                          !canApprove &&
                          !canAuthorize &&
                          !canReview;

    return {
      // Create permissions
      canCreateItemRequisition,
      canCreateAssetRequest,
      canCreateVehicleRequest,
      canCreatePaymentRequest,
      canCreateFacilityMaintenance,
      canCreateVehicleMaintenance,
      canCreateStoreTransfer,
      canCreateLeaveRequest,
      canCreateTimesheet,

      // View permissions
      canViewItemRequisition,
      canViewAssetRequest,
      canViewVehicleRequest,
      canViewPaymentRequest,
      canViewFacilityMaintenance,
      canViewVehicleMaintenance,
      canViewStoreTransfer,
      canViewConsumable,
      canViewAsset,
      canViewLeaveRequest,
      canViewTimesheet,

      // Edit permissions
      canEditItemRequisition,
      canEditAssetRequest,
      canEditVehicleRequest,
      canEditPaymentRequest,
      canEditFacilityMaintenance,
      canEditVehicleMaintenance,
      canEditStoreTransfer,
      canEditLeaveRequest,
      canEditTimesheet,

      // Approval permissions (should be false for Admin Officer)
      canApprove,
      canAuthorize,
      canReview,

      // Convenience computed properties
      hasAnyAdminPermissions,
      hasAnyInventoryPermissions,
      hasAnyFleetPermissions,
      hasAnyFacilityPermissions,
      hasAnyHRPermissions,
      isAdminOfficer,

      // Helper function for dynamic permission checks
      hasPermission,

      // Authentication state
      isAuthenticated: true,
      loading: false
    };
  }, [currentUser, isAuthenticated, loading, userPermissions]);
}