// Comprehensive organizational structure types for global NGO ERP

export interface ILocation {
  id: string;
  name: string;
  type: 'headquarters' | 'country_office' | 'regional_office' | 'field_office';
  country: string;
  region: string;
  timezone: string;
  is_active: boolean;
}

export interface IDepartment {
  id: string;
  name: string;
  code: string; // e.g., 'PROG', 'HR', 'FIN', 'PROC', 'ADMIN'
  description: string;
  parent_department?: string; // For sub-departments
  location_id?: string; // Can be location-specific
  is_active: boolean;
}

export interface IPosition {
  id: string;
  title: string;
  level: 'staff' | 'supervisor' | 'manager' | 'director' | 'executive';
  department_id: string;
  reports_to?: string; // Position ID of supervisor
  can_approve: boolean;
  can_authorize: boolean;
  approval_limit?: number; // Financial approval limit
  is_active: boolean;
}

export interface IRole {
  id: string;
  name: string;
  code: string; // e.g., 'PROG_OFFICER', 'HR_MANAGER', 'FIN_ANALYST'
  department_id: string;
  position_level: string;
  description: string;
  is_system_role: boolean; // For system admin, super admin, etc.
  is_active: boolean;
}

// Enhanced User with organizational structure
export interface IEnhancedUser {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;

  // Organizational assignment
  department: IDepartment;
  position: IPosition;
  role: IRole;
  location: ILocation;

  // Supervisor hierarchy
  supervisor_id?: string;
  reports?: IEnhancedUser[]; // Direct reports

  // Access control
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;

  // Permissions (modular)
  permissions: IPermissionModule[];

  // Profile data
  employee_id: string;
  join_date: string;
  profile_picture?: string;
  phone?: string;
  emergency_contact?: string;
}

export interface IPermissionModule {
  module: string;
  department?: string; // Some permissions are department-specific
  permissions: IPermissionDetail[];
}

export interface IPermissionDetail {
  id: number;
  name: string;
  codename: string;
  level?: 'department' | 'location' | 'global'; // Permission scope
}

// Access control dimensions
export type AccessScope = 'own' | 'department' | 'location' | 'region' | 'global';

export interface IAccessRule {
  module: string;
  action: string; // view, create, edit, delete, approve, authorize
  scope: AccessScope;
  conditions?: {
    department?: string[];
    position_level?: string[];
    location_type?: string[];
    requires_approval?: boolean;
  };
}

// Dashboard configurations
export interface IDashboardConfig {
  id: string;
  name: string;
  department: string;
  position_level: string;
  widgets: IDashboardWidget[];
  layout: 'grid' | 'list' | 'kanban';
  is_default: boolean;
}

export interface IDashboardWidget {
  id: string;
  type: 'chart' | 'table' | 'metric' | 'list' | 'calendar';
  title: string;
  data_source: string;
  position: { x: number; y: number; width: number; height: number };
  filters?: Record<string, any>;
  permissions_required: string[];
}

// Menu structure for different organizational levels
export interface IMenuStructure {
  department_menus: IMenuSection[];
  global_hub_items: IGlobalHubItem[];
  quick_actions: IQuickAction[];
  admin_menus?: IMenuSection[]; // Only for admin users
}

export interface IMenuSection {
  id: string;
  title: string;
  icon: string;
  department?: string; // If department-specific
  position_levels: string[]; // Which position levels can see this
  children: IMenuItem[];
  permissions_required: IPermissionModule[];
}

export interface IMenuItem {
  id: string;
  title: string;
  path: string;
  icon?: string;
  permissions_required: IPermissionModule[];
  scope: AccessScope;
  badge?: string; // For notification counts
}

export interface IGlobalHubItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  category: 'administrative' | 'operational' | 'reporting' | 'communication';
  available_to: {
    all_departments: boolean;
    specific_departments?: string[];
    position_levels: string[];
  };
  permissions_required: IPermissionModule[];
}

export interface IQuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  department?: string; // If department-specific
  position_levels: string[];
  permissions_required: IPermissionModule[];
  estimated_time?: string; // e.g., "2 mins"
}

// Organizational hierarchy helpers
export interface IOrganizationalContext {
  user: IEnhancedUser;
  hierarchy: {
    supervisor: IEnhancedUser | null;
    peers: IEnhancedUser[];
    direct_reports: IEnhancedUser[];
    department_head: IEnhancedUser | null;
    location_head: IEnhancedUser | null;
  };
  access_levels: {
    can_view_department_data: boolean;
    can_view_location_data: boolean;
    can_view_global_data: boolean;
    can_approve_department_requests: boolean;
    can_authorize_financial: boolean;
    financial_approval_limit: number;
  };
}