import { SidebarItem } from './sidebarItems';
import {
  Package,
  Car,
  Wrench,
  Building,
  Receipt,
  DollarSign,
  Users,
  Calendar,
  Clock,
  Target,
  Archive,
  Truck,
  Settings,
  FileText
} from 'lucide-react';

/**
 * Sidebar configuration specifically for Admin Officers
 * This configuration will be filtered based on the user's actual permissions
 */
export const adminOfficerSidebarItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    icon: <Target />,
    path: '/dashboard',
    permissions: [], // Dashboard is accessible to all users
  },
  {
    name: 'Inventory Management',
    icon: <Package />,
    permissions: [
      { module: 'adminapp', codenames: ['view_itemrequisition', 'view_consumable', 'view_asset'] }
    ],
    children: [
      {
        name: 'Item Requisitions',
        path: '/admin/inventory-management/item-requisition',
        permissions: [
          { module: 'adminapp', codenames: ['view_itemrequisition'] }
        ]
      },
      {
        name: 'Consumables',
        path: '/admin/inventory-management/consumable',
        permissions: [
          { module: 'adminapp', codenames: ['view_consumable'] }
        ]
      },
      {
        name: 'Assets',
        path: '/admin/inventory-management/assets',
        permissions: [
          { module: 'adminapp', codenames: ['view_asset'] }
        ]
      },
      {
        name: 'Asset Requests',
        path: '/admin/inventory-management/asset-request',
        permissions: [
          { module: 'adminapp', codenames: ['view_assetrequest'] }
        ]
      },
      {
        name: 'Store Transfers',
        path: '/admin/inventory-management/store-transfer',
        permissions: [
          { module: 'adminapp', codenames: ['view_storetransfer'] }
        ]
      }
    ]
  },
  {
    name: 'Fleet & Transport',
    icon: <Car />,
    permissions: [
      { module: 'adminapp', codenames: ['view_vehiclerequest', 'view_vehiclemaintenanceticket'] }
    ],
    children: [
      {
        name: 'Vehicle Requests',
        path: '/admin/fleet-transport/vehicle-request',
        permissions: [
          { module: 'adminapp', codenames: ['view_vehiclerequest'] }
        ]
      },
      {
        name: 'Vehicle Maintenance',
        path: '/admin/fleet-transport/vehicle-maintenance',
        permissions: [
          { module: 'adminapp', codenames: ['view_vehiclemaintenanceticket'] }
        ]
      },
      {
        name: 'Fuel Consumption',
        path: '/admin/fleet-transport/fuel-consumption',
        permissions: [
          { module: 'adminapp', codenames: ['view_fuelconsumption'] }
        ]
      }
    ]
  },
  {
    name: 'Facility Management',
    icon: <Building />,
    permissions: [
      { module: 'adminapp', codenames: ['view_facilitymaintenanceticket'] }
    ],
    children: [
      {
        name: 'Facility Maintenance',
        path: '/admin/facility-management/facility-maintenance',
        permissions: [
          { module: 'adminapp', codenames: ['view_facilitymaintenanceticket'] }
        ]
      }
    ]
  },
  {
    name: 'Payment Processing',
    icon: <DollarSign />,
    permissions: [
      { module: 'adminapp', codenames: ['view_paymentrequest'] }
    ],
    children: [
      {
        name: 'Payment Requests',
        path: '/admin/payment-processing/payment-request',
        permissions: [
          { module: 'adminapp', codenames: ['view_paymentrequest'] }
        ]
      }
    ]
  },
  {
    name: 'HR Self Service',
    icon: <Users />,
    permissions: [
      { module: 'hr', codenames: ['view_leaverequest', 'view_timesheet'] }
    ],
    children: [
      {
        name: 'Leave Requests',
        path: '/hr/leave-requests',
        permissions: [
          { module: 'hr', codenames: ['view_leaverequest'] }
        ]
      },
      {
        name: 'Timesheet',
        path: '/hr/timesheet',
        permissions: [
          { module: 'hr', codenames: ['view_timesheet'] }
        ]
      }
    ]
  }
];

/**
 * Configuration for quick action buttons that Admin Officers can perform
 */
export const adminOfficerQuickActions = [
  {
    id: 'create-item-requisition',
    title: 'Item Requisition',
    description: 'Create a new item requisition',
    icon: Package,
    path: '/admin/inventory-management/item-requisition/create',
    permissions: [
      { module: 'adminapp', codenames: ['add_itemrequisition'] }
    ]
  },
  {
    id: 'create-asset-request',
    title: 'Asset Request',
    description: 'Request new assets',
    icon: Archive,
    path: '/admin/inventory-management/asset-request/create',
    permissions: [
      { module: 'adminapp', codenames: ['add_assetrequest'] }
    ]
  },
  {
    id: 'create-vehicle-request',
    title: 'Vehicle Request',
    description: 'Request vehicle use',
    icon: Car,
    path: '/admin/fleet-transport/vehicle-request/create',
    permissions: [
      { module: 'adminapp', codenames: ['add_vehiclerequest'] }
    ]
  },
  {
    id: 'create-vehicle-maintenance',
    title: 'Vehicle Maintenance',
    description: 'Report vehicle maintenance issue',
    icon: Wrench,
    path: '/admin/fleet-transport/vehicle-maintenance/create',
    permissions: [
      { module: 'adminapp', codenames: ['add_vehiclemaintenanceticket'] }
    ]
  },
  {
    id: 'create-facility-maintenance',
    title: 'Facility Maintenance',
    description: 'Report facility issue',
    icon: Building,
    path: '/admin/facility-management/facility-maintenance/create',
    permissions: [
      { module: 'adminapp', codenames: ['add_facilitymaintenanceticket'] }
    ]
  },
  {
    id: 'create-payment-request',
    title: 'Payment Request',
    description: 'Request payment processing',
    icon: DollarSign,
    path: '/admin/payment-processing/payment-request/create',
    permissions: [
      { module: 'adminapp', codenames: ['add_paymentrequest'] }
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
  }
];