// Admin Controllers
export * from './assetController';
export * from './assetMaintenanceController';
export * from './assetRequestController';
export * from './consumableController';
export * from './expenseAuthorizationController';
export * from './facilityMaintenanceController';
export * from './fuelRequestController';
export * from './goodReceiveNoteController';
export * from './itemRequisitionController';
export * from './paymentRequestController';
export * from './travelExpenseController';
export * from './vehicleMaintenanceController';
export * from './vehicleRequestController';

// Default exports for convenience
export { useGetAllAssets, useGetAllAssetsQuery } from './assetController';
export { useGetAllAssetMaintenance, useGetAllAssetMaintenanceQuery } from './assetMaintenanceController';
export { useGetAllAssetRequests, useGetAllAssetRequestsQuery } from './assetRequestController';
export { useGetAllConsumables, useGetAllConsumablesQuery } from './consumableController';
export { useGetAllExpenseAuthorizations, useGetAllExpenseAuthorizationsQuery } from './expenseAuthorizationController';
export { useGetAllFacilityMaintenance, useGetAllFacilityMaintenanceQuery } from './facilityMaintenanceController';
export { useGetAllFuelRequests, useGetAllFuelRequestsQuery } from './fuelRequestController';
export { useGetAllGoodReceiveNote, useGetAllGoodReceiveNoteQuery } from './goodReceiveNoteController';
export { useGetAllItemRequisitions, useGetAllItemRequisitionsQuery } from './itemRequisitionController';
export { useGetAllPaymentRequests, useGetAllPaymentRequestsQuery } from './paymentRequestController';
export { useGetAllTravelExpenses, useGetAllTravelExpensesQuery } from './travelExpenseController';
export { useGetAllVehicleMaintenance, useGetAllVehicleMaintenanceQuery } from './vehicleMaintenanceController';
export { useGetAllVehicleRequest, useGetAllVehicleRequestQuery } from './vehicleRequestController';