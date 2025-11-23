import { SidebarItem } from '../types/sidebar';
import {
  FolderOpen,
  Calendar,
  DollarSign,
  Users,
  Clock,
  Briefcase,
  ShoppingCart,
  Receipt,
  FileText,
  MapPin,
  Target
} from 'lucide-react';

/**
 * Sidebar configuration specifically for Program Officers
 * This configuration will be filtered based on the user's actual permissions
 */
export const programOfficerSidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: Target,
    path: '/dashboard',
    permissions: [], // Dashboard is accessible to all users
  },
  {
    id: 'programs',
    title: 'Programs',
    icon: FolderOpen,
    permissions: [
      { module: 'programs', codenames: ['view_workplan', 'view_fundrequest'] }
    ],
    children: [
      {
        id: 'workplans',
        title: 'Workplans',
        path: '/programs/workplans',
        permissions: [
          { module: 'programs', codenames: ['view_workplan'] }
        ]
      },
      {
        id: 'fund-requests',
        title: 'Fund Requests',
        path: '/programs/fund-requests',
        permissions: [
          { module: 'programs', codenames: ['view_fundrequest'] }
        ]
      },
      {
        id: 'annual-supervision-plans',
        title: 'Annual Supervision Plans',
        path: '/programs/annual-supervision-plans',
        permissions: [
          { module: 'programs', codenames: ['view_annualsupervisionplan'] }
        ]
      },
      {
        id: 'site-visits',
        title: 'Site Visits',
        path: '/programs/site-visits',
        permissions: [
          { module: 'programs', codenames: ['view_sitevisit'] }
        ]
      }
    ]
  },
  {
    id: 'hr',
    title: 'Human Resources',
    icon: Users,
    permissions: [
      { module: 'hr', codenames: ['view_leaverequest', 'view_timesheet'] }
    ],
    children: [
      {
        id: 'leave-requests',
        title: 'Leave Requests',
        path: '/hr/leave-requests',
        permissions: [
          { module: 'hr', codenames: ['view_leaverequest'] }
        ]
      },
      {
        id: 'timesheet',
        title: 'Timesheet',
        path: '/hr/timesheet',
        permissions: [
          { module: 'hr', codenames: ['view_timesheet'] }
        ]
      },
      {
        id: 'job-applications',
        title: 'Job Applications',
        path: '/hr/job-applications',
        permissions: [
          { module: 'hr', codenames: ['view_jobapplication'] }
        ]
      }
    ]
  },
  {
    id: 'procurement',
    title: 'Procurement',
    icon: ShoppingCart,
    permissions: [
      { module: 'procurements', codenames: ['view_purchaserequest'] }
    ],
    children: [
      {
        id: 'purchase-requests',
        title: 'Purchase Requests',
        path: '/procurement/purchase-requests',
        permissions: [
          { module: 'procurements', codenames: ['view_purchaserequest'] }
        ]
      },
      {
        id: 'activity-memos',
        title: 'Activity Memos',
        path: '/procurement/activity-memos',
        permissions: [
          { module: 'procurements', codenames: ['view_purchaserequestmemo'] }
        ]
      }
    ]
  },
  {
    id: 'administration',
    title: 'Administration',
    icon: FileText,
    permissions: [
      { module: 'adminapp', codenames: ['view_expenseauthorization', 'view_travelexpensereport', 'view_itemrequisition'] }
    ],
    children: [
      {
        id: 'expense-authorization',
        title: 'Expense Authorization (EA)',
        path: '/administration/expense-authorization',
        permissions: [
          { module: 'adminapp', codenames: ['view_expenseauthorization'] }
        ]
      },
      {
        id: 'travel-expense-report',
        title: 'Travel Expense Report (TER)',
        path: '/administration/travel-expense-report',
        permissions: [
          { module: 'adminapp', codenames: ['view_travelexpensereport'] }
        ]
      },
      {
        id: 'item-requisitions',
        title: 'Item Requisitions',
        path: '/administration/item-requisitions',
        permissions: [
          { module: 'adminapp', codenames: ['view_itemrequisition'] }
        ]
      }
    ]
  },
  {
    id: 'adhoc-requisitions',
    title: 'Adhoc Requisitions',
    icon: Receipt,
    path: '/adhoc-requisitions',
    permissions: [
      { module: 'adhoc_requisitions', codenames: ['view_adhocrequisition'] }
    ]
  }
];

/**
 * Configuration for quick action buttons that Program Officers can perform
 */
export const programOfficerQuickActions = [
  {
    id: 'create-workplan',
    title: 'Create Workplan',
    description: 'Create a new program workplan',
    icon: FolderOpen,
    path: '/programs/workplans/create',
    permissions: [
      { module: 'programs', codenames: ['add_workplan'] }
    ]
  },
  {
    id: 'create-fund-request',
    title: 'Fund Request',
    description: 'Submit a new fund request',
    icon: DollarSign,
    path: '/programs/fund-requests/create',
    permissions: [
      { module: 'programs', codenames: ['add_fundrequest'] }
    ]
  },
  {
    id: 'create-leave-request',
    title: 'Leave Request',
    description: 'Submit a leave request',
    icon: Calendar,
    path: '/hr/leave-requests/create',
    permissions: [
      { module: 'hr', codenames: ['add_leaverequest'] }
    ]
  },
  {
    id: 'create-timesheet',
    title: 'Timesheet',
    description: 'Submit timesheet',
    icon: Clock,
    path: '/hr/timesheet/create',
    permissions: [
      { module: 'hr', codenames: ['add_timesheet'] }
    ]
  },
  {
    id: 'apply-job',
    title: 'Job Application',
    description: 'Apply for a job',
    icon: Briefcase,
    path: '/hr/job-applications/create',
    permissions: [
      { module: 'hr', codenames: ['add_jobapplication'] }
    ]
  },
  {
    id: 'create-purchase-request',
    title: 'Purchase Request',
    description: 'Create purchase request',
    icon: ShoppingCart,
    path: '/procurement/purchase-requests/create',
    permissions: [
      { module: 'procurements', codenames: ['add_purchaserequest'] }
    ]
  },
  {
    id: 'create-ea',
    title: 'Expense Authorization',
    description: 'Create expense authorization',
    icon: Receipt,
    path: '/administration/expense-authorization/create',
    permissions: [
      { module: 'adminapp', codenames: ['add_expenseauthorization'] }
    ]
  },
  {
    id: 'create-ter',
    title: 'Travel Expense Report',
    description: 'Create travel expense report',
    icon: MapPin,
    path: '/administration/travel-expense-report/create',
    permissions: [
      { module: 'adminapp', codenames: ['add_travelexpensereport'] }
    ]
  }
];