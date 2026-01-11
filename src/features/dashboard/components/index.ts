/**
 * Dashboard components
 * Main dashboard views and widgets
 */

export { default as MainDashboard } from './MainDashboard';
export { default as ProgramOfficerDashboard } from './ProgramOfficerDashboard';

// DepartmentalDashboards exports role-based dashboards
export {
  ProgramOfficerDashboard as DepartmentalProgramOfficerDashboard,
  HRStaffDashboard,
  FinanceStaffDashboard,
  ProcurementStaffDashboard
} from './DepartmentalDashboards';
