import {
  ChevronDown,
  Package,
  ScanEye,
  HeartHandshake,
  ShoppingCart,
  FileText,
  Car,
  Wrench,
  CreditCard,
  Hammer,
  DollarSign,
  Plane,
  FileBarChart,
  ScrollText,
  Users,
  Droplet,
  Clock,
  Calendar,
  MapPin,
  ClipboardList
} from "lucide-react";
import ProgramsIcon from "components/icons/sidebar-icons/ProgramsIcon";
import ProcurementManagementIcon from "components/icons/sidebar-icons/ProcurementManagementIcon";
import AdminIcon from "components/icons/sidebar-icons/AdminIcon";
import CGIcon from "components/icons/sidebar-icons/CGIcon";
import HRIcon from "components/icons/sidebar-icons/HRIcon";

// Types
export interface PermissionRequirement {
  module: string;
  codenames: string[];
  requireAll?: boolean;
}

export interface SidebarItem {
  name: string;
  path?: string;
  icon?: React.ReactNode;
  permissions?: PermissionRequirement[];
  children?: SidebarItem[];
}

export interface GlobalHubItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  category: string;
  permissions?: PermissionRequirement[];
}




// ==================== DEPARTMENTAL LINKS ====================
export const departmentalLinks: SidebarItem[] = [
  {
    name: "Programs",
    path: "/dashboard/programs",
    icon: <ProgramsIcon />,
    permissions: [
      {
        module: "programs",
        codenames: ["view_workplan", "view_fundrequest", "view_activityplan"]
      }
    ],
    children: [
      {
        name: "Plans",
        path: "/dashboard/programs/plan",
        permissions: [
          {
            module: "programs",
            codenames: ["view_workplan", "view_activityplan"]
          }
        ],
        children: [
          {
            name: "Work Plan",
            path: "/dashboard/programs/plan/work-plan",
            permissions: [
              {
                module: "programs",
                codenames: ["view_workplan"]
              }
            ]
          },
          {
            name: "Work Plan Tracker",
            path: "/dashboard/programs/plan/activity-tracker",
            permissions: [
              {
                module: "programs",
                codenames: ["view_workplantracker"]
              }
            ]
          },
          {
            name: "Activity Plan",
            path: "/dashboard/programs/plan/activity",
            permissions: [
              {
                module: "programs",
                codenames: ["view_activityplan"]
              }
            ]
          },
          {
            name: "Risk Management Plan",
            path: "/dashboard/programs/plan/risk-management-plan",
            permissions: [
              {
                module: "programs",
                codenames: ["view_riskmanagementplan"]
              }
            ]
          },
          {
            name: "Supportive Supervision Plan",
            path: "/dashboard/programs/plan/supportive-supervision-plan",
            permissions: [
              {
                module: "programs",
                codenames: ["view_supportivesupervisionplan"]
              }
            ]
          },
          {
            name: "Annual Supervision Plan",
            path: "/dashboard/programs/plan/annual-supervision"
          },
          {
            name: "Site Visit",
            path: "/dashboard/programs/plan/site-visit"
          },
          {
            name: "Supervision Evaluation",
            path: "/dashboard/programs/plan/supervision-evaluation"
          }
        ]
      },
      {
        name: "Stakeholder Management",
        path: "/dashboard/programs/stakeholder-management",
        permissions: [
          {
            module: "programs",
            codenames: ["view_stakeholder", "view_stakeholderengagementplan"]
          }
        ],
        children: [
          {
            name: "Analysis & Mapping",
            path: "/dashboard/programs/stakeholder-management/analysis&mapping",
            permissions: [
              {
                module: "programs",
                codenames: ["view_stakeholder"]
              }
            ]
          },
          {
            name: "Stakeholder Register",
            path: "/dashboard/programs/stakeholder-management/stakeholder-register",
            permissions: [
              {
                module: "programs",
                codenames: ["view_stakeholder"]
              }
            ]
          },
          {
            name: "Engagement Plan",
            path: "/dashboard/programs/stakeholder-management/engagement-plan",
            permissions: [
              {
                module: "programs",
                codenames: ["view_stakeholderengagementplan"]
              }
            ]
          }
        ]
      },
      {
        name: "Fund Request",
        path: "/dashboard/programs/fund-request",
        permissions: [
          {
            module: "programs",
            codenames: ["view_fundrequest"]
          }
        ]
      },
      {
        name: "Adhoc Management",
        permissions: [
          {
            module: "adhoc_requisitions",
            codenames: ["view_adhocrequisition", "view_adhocadvertisement"]
          }
        ],
        children: [
          {
            name: "Adhoc Management",
            path: "/dashboard/programs/adhoc-management",
            permissions: [
              {
                module: "adhoc_requisitions",
                codenames: ["view_adhocadvertisement"]
              }
            ]
          },
          {
            name: "Adhoc Database",
            path: "/dashboard/programs/adhoc-database",
            permissions: [
              {
                module: "adhoc_requisitions",
                codenames: ["view_adhocapplicant"]
              }
            ]
          },
          {
            name: "Adhoc Acceptance",
            path: "/dashboard/programs/adhoc/adhoc-acceptance",
            permissions: [
              {
                module: "adhoc_requisitions",
                codenames: ["view_adhocapplicant"]
              }
            ]
          },
          {
            name: "Contract Recipients",
            path: "/dashboard/programs/adhoc/contract-recipients",
            permissions: [
              {
                module: "adhoc_requisitions",
                codenames: ["view_adhocapplicant"]
              }
            ]
          },
          {
            name: "Accepted Contracts",
            path: "/dashboard/programs/adhoc/accepted-contracts",
            permissions: [
              {
                module: "adhoc_requisitions",
                codenames: ["view_adhocapplicant"]
              }
            ]
          },
          {
            name: "Adhoc Staff Requisition",
            path: "/dashboard/adhoc-requisition",
            permissions: [
              {
                module: "adhoc_requisitions",
                codenames: ["view_adhocrequisition"]
              }
            ]
          }
        ]
      },
      {
        name: "Reports",
        path: "/dashboard/programs/reports",
        permissions: [
          {
            module: "programs",
            codenames: ["view_workplan"]
          }
        ]
      }
    ]
  },
  {
    name: "Procurement Management",
    path: "/dashboard/procurement",
    icon: <ProcurementManagementIcon />,
    permissions: [
      {
        module: "procurements",
        codenames: ["view_purchaserequest", "view_vendor", "view_solicitation"]
      }
    ],
    children: [
      {
        name: "Overview",
        path: "/dashboard/procurement",
        permissions: [
          {
            module: "procurements",
            codenames: ["view_purchaserequest"]
          }
        ]
      },
      {
        name: "Vendor Management",
        path: "/dashboard/procurement/vendor-management/prequalification",
        permissions: [
          {
            module: "procurements",
            codenames: ["view_vendor", "view_vendorprequalification"]
          }
        ],
        children: [
          {
            name: "Prequalification",
            path: "/dashboard/procurement/vendor-management/prequalification",
            permissions: [
              {
                module: "procurements",
                codenames: ["view_vendorprequalification"]
              }
            ]
          },
          {
            name: "EOI",
            path: "/dashboard/procurement/vendor-management/eoi",
            permissions: [
              {
                module: "procurements",
                codenames: ["view_vendor"]
              }
            ]
          },
          {
            name: "Vendor Evaluation",
            path: "/dashboard/procurement/vendor-performance",
            permissions: [
              {
                module: "procurements",
                codenames: ["view_vendor"]
              }
            ]
          },
          {
            name: "Evaluation Dashboard",
            path: "/dashboard/procurement/vendor-evaluation-dashboard",
            permissions: [
              {
                module: "procurements",
                codenames: ["view_vendor"]
              }
            ]
          },
          {
            name: "Performance Analytics",
            path: "/dashboard/procurement/vendor-performance-analytics",
            permissions: [
              {
                module: "procurements",
                codenames: ["view_vendor"]
              }
            ]
          }
        ]
      },
      {
        name: "Supplier Database",
        path: "/dashboard/procurement/supplier-database",
        permissions: [
          {
            module: "procurements",
            codenames: ["view_vendor"]
          }
        ]
      },
      {
        name: "Price Intelligence",
        path: "/dashboard/procurement/price-intelligence",
        permissions: [
          {
            module: "procurements",
            codenames: ["view_marketitem"]
          }
        ]
      },
      {
        name: "Procurement Plan",
        path: "/dashboard/procurement/procurement-plan",
        permissions: [
          {
            module: "procurements",
            codenames: ["view_sampleprocurementplan"]
          }
        ]
      },
      {
        name: "Procurement Tracker",
        path: "/dashboard/procurement/procurement-tracker",
        permissions: [
          {
            module: "procurements",
            codenames: ["view_purchaserequest"]
          }
        ]
      },
      {
        name: "Purchase Request",
        path: "/dashboard/procurement/purchase-request",
        permissions: [
          {
            module: "procurements",
            codenames: ["view_purchaserequest"]
          }
        ]
      },
      {
        name: "Activity Memo",
        path: "/dashboard/procurement/activity-memo",
        permissions: [
          {
            module: "procurements",
            codenames: ["view_purchaserequest"]
          }
        ]
      },
      {
        name: "Solicitation Management",
        path: "/dashboard/procurement/solicitation-management",
        permissions: [
          {
            module: "procurements",
            codenames: ["view_solicitation", "view_requestforproposal"]
          }
        ],
        children: [
          {
            name: "RFQ",
            path: "/dashboard/procurement/solicitation-management/rfq",
            permissions: [
              {
                module: "procurements",
                codenames: ["view_solicitation"]
              }
            ]
          },
          {
            name: "RFP",
            path: "/dashboard/procurement/solicitation-management/rfp",
            permissions: [
              {
                module: "procurements",
                codenames: ["view_requestforproposal"]
              }
            ]
          }
        ]
      },
      {
        name: "Competitive Bid Analysis",
        path: "/dashboard/procurement/competitive-bid-analysis",
        permissions: [
          {
            module: "procurements",
            codenames: ["view_cba"]
          }
        ]
      },
      {
        name: "Purchase Order",
        path: "/dashboard/procurement/purchase-order",
        permissions: [
          {
            module: "procurements",
            codenames: ["view_purchaseorder"]
          }
        ]
      },
      {
        name: "Procurement Report",
        path: "/dashboard/procurement/procurement-report",
        permissions: [
          {
            module: "procurements",
            codenames: ["view_purchaserequest"]
          }
        ]
      }
    ]
  },
  {
    name: "Admin",
    icon: <AdminIcon />,
    permissions: [
      {
        module: "adminapp",
        codenames: [
          "view_itemrequisition",
          "view_assetrequest",
          "view_vehiclerequest",
          "view_paymentrequest"
        ]
      }
    ],
    children: [
      {
        name: "Inventory Management",
        path: "/dashboard/admin/inventory-management",
        permissions: [
          {
            module: "adminapp",
            codenames: ["view_consumable", "view_asset", "view_itemrequisition"]
          }
        ],
        children: [
          {
            name: "Consumable",
            path: "/dashboard/admin/inventory-management/consumable",
            permissions: [
              {
                module: "adminapp",
                codenames: ["view_itemrequisition"]
              }
            ]
          },
          {
            name: "Item Requisition",
            path: "/dashboard/admin/inventory-management/item-requisition",
            permissions: [
              {
                module: "adminapp",
                codenames: ["view_itemrequisition"]
              }
            ]
          },
          {
            name: "Assets",
            path: "/dashboard/admin/inventory-management/assets",
            permissions: [
              {
                module: "adminapp",
                codenames: ["view_asset"]
              }
            ]
          },
          {
            name: "Asset Requests",
            path: "/dashboard/admin/inventory-management/asset-request",
            permissions: [
              {
                module: "adminapp",
                codenames: ["view_assetrequest"]
              }
            ]
          },
          {
            name: "Good Receive Note",
            path: "/dashboard/admin/inventory-management/good-receive-note",
            permissions: [
              {
                module: "adminapp",
                codenames: ["view_goodreceivenote"]
              }
            ]
          },
          {
            name: "Stores",
            path: "/dashboard/admin/inventory-management/stores",
            permissions: [
              {
                module: "config",
                codenames: ["view_store"]
              }
            ]
          },
          {
            name: "Store Transfers",
            path: "/dashboard/admin/inventory-management/store-transfers",
            permissions: [
              {
                module: "adminapp",
                codenames: ["view_storetransfer"]
              }
            ]
          },
          {
            name: "Admin Tracker",
            path: "/dashboard/admin/admin-tracker",
            permissions: [
              {
                module: "adminapp",
                codenames: ["view_itemrequisition"]
              }
            ]
          }
        ]
      },
      {
        name: "Solicitation Management",
        path: "/dashboard/admin/solicitation-management",
        permissions: [
          {
            module: "adminapp",
            codenames: ["view_itemrequisition"]
          }
        ],
        children: [
          {
            name: "Request For Quotation",
            path: "/dashboard/admin/solicitation-management/rfq",
            permissions: [
              {
                module: "adminapp",
                codenames: ["view_itemrequisition"]
              }
            ]
          }
        ]
      },
      {
        name: "Fleet Management",
        path: "/dashboard/admin/fleet-management",
        permissions: [
          {
            module: "adminapp",
            codenames: ["view_vehiclerequest", "view_vehiclemaintenanceticket"],
            requireAll: false // Use OR logic - user needs ANY of these permissions
          }
        ],
        children: [
          {
            name: "Vehicle Request",
            path: "/dashboard/admin/fleet-management/vehicle-request",
            permissions: [
              {
                module: "adminapp",
                codenames: ["view_vehiclerequest"]
              }
            ]
          },
          {
            name: "Vehicle Maintenance Ticket",
            path: "/dashboard/admin/fleet-management/vehicle-maintenance",
            permissions: [
              {
                module: "adminapp",
                codenames: ["view_vehiclemaintenanceticket"]
              }
            ]
          },
          {
            name: "Fuel Request",
            path: "/dashboard/admin/fleet-management/fuel-request",
            permissions: [
              {
                module: "adminapp",
                codenames: ["view_fuelconsumptionrecord"]
              }
            ]
          }
        ]
      },
      {
        name: "Facility Management",
        path: "/dashboard/admin/facility-management",
        permissions: [
          {
            module: "adminapp",
            codenames: ["view_facilitymaintenanceticket"]
          }
        ],
        children: [
          {
            name: "Facility Maintenance Ticket",
            path: "/dashboard/admin/facility-management/facility-maintenance",
            permissions: [
              {
                module: "adminapp",
                codenames: ["view_facilitymaintenanceticket"]
              }
            ]
          }
        ]
      },
      {
        name: "Payment Request",
        path: "/dashboard/admin/payment-request",
        permissions: [
          {
            module: "adminapp",
            codenames: ["view_paymentrequest"]
          }
        ]
      },
      {
        name: "Service Level Agreements",
        path: "/dashboard/admin/agreements",
        permissions: [
          {
            module: "adminapp",
            codenames: ["view_paymentrequest"]
          }
        ]
      },
      {
        name: "Asset Maintenance",
        path: "/dashboard/admin/asset-maintenance",
        permissions: [
          {
            module: "adminapp",
            codenames: ["view_assetmaintenance"]
          }
        ]
      },
      {
        name: "Expense Authorization",
        path: "/dashboard/admin/expense-authorization",
        permissions: [
          {
            module: "adminapp",
            codenames: ["view_expenseauthorization"]
          }
        ]
      },
      {
        name: "Travel Expenses Report",
        path: "/dashboard/admin/travel-expenses-report",
        permissions: [
          {
            module: "adminapp",
            codenames: ["view_travelexpensereport"]
          }
        ]
      }
    ]
  },
  {
    name: "HR",
    icon: <HRIcon />,
    permissions: [
      {
        module: "hr",
        codenames: [
          "view_employee",
          "view_leaverequest",
          "view_timesheet",
          "view_jobadvertisement"
        ]
      }
    ],
    children: [
      {
        name: "Overview",
        path: "/dashboard/hr",
        permissions: [
          {
            module: "hr",
            codenames: ["view_employee"]
          }
        ]
      },
      {
        name: "Employee Management",
        permissions: [
          {
            module: "hr",
            codenames: ["view_employee", "view_workforceneedanalysis"]
          }
        ],
        children: [
          {
            name: "Workforce Need Analysis",
            path: "/dashboard/hr/workforce-need-analysis",
            permissions: [
              {
                module: "hr",
                codenames: ["view_workforceneedanalysis"]
              }
            ]
          },
          {
            name: "Workforce Database",
            path: "/dashboard/hr/workforce-database",
            permissions: [
              {
                module: "hr",
                codenames: ["view_employee"]
              }
            ]
          }
        ]
      },
      {
        name: "Recruitment",
        permissions: [
          {
            module: "hr",
            codenames: ["view_jobadvertisement", "view_jobapplication"]
          }
        ],
        children: [
          {
            name: "Advertisement",
            path: "/dashboard/hr/advertisement",
            permissions: [
              {
                module: "hr",
                codenames: ["view_jobadvertisement"]
              }
            ]
          },
          {
            name: "Selection",
            path: "/dashboard/hr/selection",
            permissions: [
              {
                module: "hr",
                codenames: ["view_jobapplication"]
              }
            ]
          },
          {
            name: "Onboarding",
            path: "/dashboard/hr/onboarding",
            permissions: [
              {
                module: "hr",
                codenames: ["view_employee"]
              }
            ]
          }
        ]
      },
      {
        name: "Performance Management",
        permissions: [
          {
            module: "hr",
            codenames: ["view_assessment", "view_goal"]
          }
        ],
        children: [
          {
            name: "Performance Appraisal",
            path: "/dashboard/hr/performance-management",
            permissions: [
              {
                module: "hr",
                codenames: ["view_assessment"]
              }
            ]
          },
          {
            name: "Goal Setting",
            path: "/dashboard/hr/goals-management",
            permissions: [
              {
                module: "hr",
                codenames: ["view_goal"]
              }
            ]
          }
        ]
      },
      {
        name: "Employee compensation & benefits",
        permissions: [
          {
            module: "hr",
            codenames: ["view_compensation", "view_paygroup"] // Proper compensation permissions
          }
        ],
        children: [
          {
            name: "Compensation Category (Pay Group)",
            path: "/dashboard/hr/employee-benefit/pay-group",
            permissions: [
              {
                module: "hr",
                codenames: ["view_employee"] // Temporarily use basic HR permission
              }
            ]
          },
          {
            name: "Compensation",
            path: "/dashboard/hr/employee-benefit/compensation",
            permissions: [
              {
                module: "hr",
                codenames: ["view_employee"] // Temporarily use basic HR permission
              }
            ]
          },
          {
            name: "Compensation Spread",
            path: "/dashboard/hr/employee-benefit/compensation-spread",
            permissions: [
              {
                module: "hr",
                codenames: ["view_employee"] // Temporarily use basic HR permission
              }
            ]
          },
          {
            name: "Payroll",
            path: "/dashboard/hr/employee-benefit/pay-roll",
            permissions: [
              {
                module: "hr",
                codenames: ["view_employee"] // Temporarily use basic HR permission
              }
            ]
          }
        ]
      },
      {
        name: "Separation Management",
        path: "/dashboard/hr/separation-management",
        permissions: [
          {
            module: "hr",
            codenames: ["view_employeeseparation"]
          }
        ]
      },
      {
        name: "Grievance Management",
        path: "/dashboard/hr/grievance-management",
        permissions: [
          {
            module: "hr",
            codenames: ["view_complaint"]
          }
        ]
      },
      {
        name: "Timesheet Management",
        permissions: [
          {
            module: "hr",
            codenames: ["view_timesheet"]
          }
        ],
        children: [
          {
            name: "My Timesheets",
            path: "/dashboard/hr/timesheet-management",
            permissions: [
              {
                module: "hr",
                codenames: ["view_timesheet"]
              }
            ]
          },
          {
            name: "Approvals",
            path: "/dashboard/hr/timesheet-management/approvals",
            permissions: [
              {
                module: "hr",
                codenames: ["view_timesheet"]
              }
            ]
          },
          {
            name: "Reports",
            path: "/dashboard/hr/timesheet-management/reports",
            permissions: [
              {
                module: "hr",
                codenames: ["view_timesheet"]
              }
            ]
          }
        ]
      },
      {
        name: "Leave Management",
        permissions: [
          {
            module: "hr",
            codenames: ["view_leaverequest"]
          }
        ],
        children: [
          {
            name: "My Dashboard",
            path: "/dashboard/hr/leave-management",
            permissions: [
              {
                module: "hr",
                codenames: ["view_leaverequest"]
              }
            ]
          },
          {
            name: "Assign",
            path: "/dashboard/hr/leave-management/assign-leave",
            permissions: [
              {
                module: "hr",
                codenames: ["view_leaverequest"]
              }
            ]
          },
          {
            name: "Leave List",
            path: "/dashboard/hr/leave-management/leave-list",
            permissions: [
              {
                module: "hr",
                codenames: ["view_leaverequest"]
              }
            ]
          },
          {
            name: "Configuration",
            path: "/dashboard/hr/leave-management/configuration",
            permissions: [
              {
                module: "hr",
                codenames: ["view_leaverequest"]
              }
            ]
          }
        ]
      },
      {
        name: "HR Reports",
        path: "/",
        permissions: [
          {
            module: "hr",
            codenames: ["view_employee"]
          }
        ]
      }
    ]
  },
  {
    name: "C&G",
    icon: <CGIcon />,
    permissions: [
      {
        module: "contract_grants",
        codenames: [
          "view_grant",
          "view_subgrant",
          "view_consultant",
          "view_contractrequest"
        ]
      }
    ],
    children: [
      {
        name: "Overview",
        path: "/dashboard/c-and-g/overview",
        permissions: [
          {
            module: "contract_grants",
            codenames: ["view_grant"]
          }
        ]
      },
      {
        name: "Donor Database",
        path: "/dashboard/c-and-g/donor-database",
        permissions: [
          {
            module: "projects",
            codenames: ["view_fundingsource"]
          }
        ]
      },
      {
        name: "Grants",
        path: "/dashboard/c-and-g/grant",
        permissions: [
          {
            module: "contract_grants",
            codenames: ["view_grant"]
          }
        ]
      },
      {
        name: "Sub Grants",
        permissions: [
          {
            module: "contract_grants",
            codenames: ["view_subgrant", "view_subgrantaward"]
          }
        ],
        children: [
          {
            name: "Sub Grant Adverts",
            path: "/dashboard/c-and-g/sub-grant",
            permissions: [
              {
                module: "contract_grants",
                codenames: ["view_subgrant"]
              }
            ]
          },
          {
            name: "Awards",
            path: "/dashboard/c-and-g/sub-grant/awards",
            permissions: [
              {
                module: "contract_grants",
                codenames: ["view_subgrantaward"]
              }
            ]
          },
          {
            name: "Pre-award Assessment",
            path: "/dashboard/c-and-g/sub-grant/preaward-assessment",
            permissions: [
              {
                module: "contract_grants",
                codenames: ["view_subgrant"]
              }
            ]
          },
          {
            name: "Awarded Beneficiaries",
            path: "/dashboard/c-and-g/awarded-beneficiaries",
            permissions: [
              {
                module: "contract_grants",
                codenames: ["view_subgrantaward"]
              }
            ]
          }
        ]
      },
      {
        name: "Closeout",
        permissions: [
          {
            module: "contract_grants",
            codenames: ["view_closeoutplan"]
          }
        ],
        children: [
          {
            name: "Closeout Plan",
            path: "/dashboard/c-and-g/close-out-plan",
            permissions: [
              {
                module: "contract_grants",
                codenames: ["view_closeoutplan"]
              }
            ]
          },
          {
            name: "Activity Headings",
            path: "/dashboard/c-and-g/close-out-plan/activity-headings",
            permissions: [
              {
                module: "contract_grants",
                codenames: ["view_closeoutplan"]
              }
            ]
          }
        ]
      },
      {
        name: "Contract Management",
        permissions: [
          {
            module: "contract_grants",
            codenames: ["view_contractrequest", "view_consultant", "view_agreement"]
          }
        ],
        children: [
          {
            name: "Contract Request",
            path: "/dashboard/c-and-g/contract-request",
            permissions: [
              {
                module: "contract_grants",
                codenames: ["view_contractrequest"]
              }
            ]
          },
          {
            name: "Consultant Management",
            path: "/dashboard/c-and-g/consultancy",
            permissions: [
              {
                module: "contract_grants",
                codenames: ["view_consultant"]
              }
            ]
          },
          {
            name: "Consultancy Database",
            path: "/dashboard/c-and-g/consultancy-database",
            permissions: [
              {
                module: "contract_grants",
                codenames: ["view_consultant"]
              }
            ]
          },
          {
            name: "Consultant Contract Dashboard",
            path: "/dashboard/c-and-g/consultant/consultance-acceptance",
            permissions: [
              {
                module: "contract_grants",
                codenames: ["view_consultant"]
              }
            ]
          },
          {
            name: "Consultancy Report",
            path: "/dashboard/c-and-g/consultancy-report",
            permissions: [
              {
                module: "contract_grants",
                codenames: ["view_consultancyreport"]
              }
            ]
          },
          {
            name: "Service Level Agreement",
            path: "/dashboard/c-and-g/agreements",
            permissions: [
              {
                module: "contract_grants",
                codenames: ["view_agreement"]
              }
            ]
          },
          {
            name: "Facilitator Management",
            path: "/dashboard/c-and-g/facilitator-management",
            permissions: [
              {
                module: "contract_grants",
                codenames: ["view_facilitator"]
              }
            ]
          },
          {
            name: "Facilitator Database",
            path: "/dashboard/c-and-g/facilitator-database",
            permissions: [
              {
                module: "contract_grants",
                codenames: ["view_facilitator"]
              }
            ]
          }
        ]
      },
      {
        name: "C&G Reports",
        path: "/",
        permissions: [
          {
            module: "contract_grants",
            codenames: ["view_grant"]
          }
        ]
      }
    ]
  },
  {
    name: "Finance",
    path: "/dashboard/finance",
    icon: <DollarSign />,
    permissions: [
      {
        module: "finance",
        codenames: ["view_budgetline", "view_chartofaccounts", "view_journalentry"]
      }
    ],
    children: [
      {
        name: "Overview",
        path: "/dashboard/finance",
        permissions: [
          {
            module: "finance",
            codenames: ["view_budgetline"]
          }
        ]
      },
      {
        name: "Financial Classifications",
        path: "/dashboard/finance/classifications",
        permissions: [
          {
            module: "finance",
            codenames: ["view_chartofaccounts"]
          }
        ]
      },
      {
        name: "Chart of Accounts",
        path: "/dashboard/finance/chart-of-accounts",
        permissions: [
          {
            module: "finance",
            codenames: ["view_chartofaccounts"]
          }
        ]
      },
      {
        name: "Bank Accounts",
        path: "/dashboard/finance/bank-accounts",
        permissions: [
          {
            module: "finance",
            codenames: ["view_chartofaccounts"]
          }
        ]
      },
      {
        name: "Journal Entries",
        path: "/dashboard/finance/journal-entries",
        permissions: [
          {
            module: "finance",
            codenames: ["view_journalentry"]
          }
        ]
      },
      {
        name: "Financial Reports",
        path: "/dashboard/finance/financial-reports",
        permissions: [
          {
            module: "finance",  
            codenames: ["view_financialreport"]
          }
        ]
      },
      {
        name: "Bank Reconciliation",
        path: "/dashboard/finance/bank-reconciliation",
        permissions: [
          {
            module: "finance",
            codenames: ["view_bankreconcialiation"]
          }
        ]
      }, 
      {
        name: "Integration Dashboard",
        path: "/dashboard/finance/integration-dashboard",
        permissions: [
          {
            module: "finance",
            codenames: ["view_integrationdashboard"]
          }
        ]
      }, 
      {
        name: "Financial Analysis",
        path: "/dashboard/finance/analysis",
        permissions: [
          {
            module: "finance",
            codenames: ["view_financialanalysis"]
          }
        ]
      },
        {
          name: "Invoicing & Billing",
          path: "/dashboard/finance/invoices",
          permissions: [
          {
            module: "finance",
            codenames: ["view_invoices"]
          }
        ]
        },
        {
          name: "Sales Orders",
          path: "/dashboard/finance/sales-orders",
          permissions: [
          {
            module: "finance",
            codenames: ["view_salesorders"]
          }
        ]
        },
        {
          name: "Accounts Receivable",
          path: "/dashboard/finance/accounts-receivable",
          permissions: [
          {
            module: "finance",
            codenames: ["view_accountsreceivable"]
          }
        ]
        },
        {
          name: "Tax Management",
          path: "/dashboard/finance/tax-management",
          permissions: [
          {
            module: "finance",
            codenames: ["view_taxmanagement"]
          }
        ]
        },
        {
          name: "Accounts Payable",
          path: "/dashboard/finance/accounts-payable",
          permissions: [
          {
            module: "finance",
            codenames: ["view_accountspayable"]
          }
        ]
        },
        {
          name: "Fixed Assets",
          path: "/dashboard/finance/fixed-assets",
          permissions: [
          {
            module: "finance",
            codenames: ["view_fixedassets"]
          }
        ]
        },
        {
          name: "Expense Tracking",
          path: "/dashboard/finance/expenses",
          permissions: [
          {
            module: "finance",
            codenames: ["view_expensetracking"]
          }
        ]
        },
        {
          name: "Budget Reports",
          path: "/dashboard/finance/budget-reports",
          permissions: [
          {
            module: "finance",
            codenames: ["view_budgetreports"]
          }
        ]
        },
        {
          name: "Petty Cash",
          path: "/dashboard/finance/petty-cash",
          permissions: [
          {
            module: "finance",
            codenames: ["view_pettycash"]
          }
        ]
        },
        {
          name: "Travel Reconciliation",
          path: "/dashboard/finance/travel-reconciliation",
          permissions: [
          {
            module: "finance",
            codenames: ["view_travelreconciliation"]
          }
        ]
        },
    ]
  }
];

// ==================== GLOBAL HUB LINKS ====================
// POLICY: ALL Global Hub items are universally accessible to ALL authenticated AHNI employees
// regardless of department, role, permissions, or position level.
// This includes both organizational items (Calendar, Directory, etc.) and departmental items
// (Purchase Requests, Travel Expenses, etc.) - everyone can see and access everything in Global Hub.
export const globalHubLinks: GlobalHubItem[] = [
  // ==================== UNIVERSAL ACCESS ITEMS ====================
  // These items are available to ALL authenticated users regardless of department

  {
    label: "Announcements",
    path: "/dashboard/global-hub/announcements",
    icon: <FileBarChart className="w-4 h-4" />,
    category: "communication"
    // No permissions = universal access
  },

  {
    label: "Organization Chart",
    path: "/dashboard/global-hub/org-chart",
    icon: <Users className="w-4 h-4" />,
    category: "organization"
    // No permissions = universal access
  },

  {
    label: "Calendar",
    path: "/dashboard/global-hub/calendar",
    icon: <Calendar className="w-4 h-4" />,
    category: "organization"
    // No permissions = universal access
  },

  {
    label: "Directory",
    path: "/dashboard/global-hub/directory",
    icon: <MapPin className="w-4 h-4" />,
    category: "organization"
    // No permissions = universal access
  },

  // ==================== DEPARTMENT-SPECIFIC ITEMS ====================

  // Procurement & Purchasing
  {
    label: "Purchase Requests",
    path: "/dashboard/procurement/purchase-request",
    icon: <ShoppingCart className="w-4 h-4" />,
    category: "procurement",
    permissions: [
      {
        module: "procurements",
        codenames: ["view_purchaserequest"]
      }
    ]
  },
  {
    label: "Activity Memo",
    path: "/dashboard/procurement/activity-memo",
    icon: <FileText className="w-4 h-4" />,
    category: "procurement",
    permissions: [
      {
        module: "procurements",
        codenames: ["view_purchaserequest"]
      }
    ]
  },
  
  // Inventory Management
  {
    label: "Item Requisition",
    path: "/dashboard/admin/inventory-management/item-requisition",
    icon: <FileText className="w-4 h-4" />,
    category: "inventory",
    permissions: [
      {
        module: "adminapp",
        codenames: ["view_itemrequisition"]
      }
    ]
  },

  // Fleet & Transport
  {
    label: "Vehicle Request",
    path: "/dashboard/admin/fleet-management/vehicle-request",
    icon: <Car className="w-4 h-4" />,
    category: "fleet",
    permissions: [
      {
        module: "adminapp",
        codenames: ["view_vehiclerequest"]
      }
    ]
  },
  {
    label: "Fuel Request",
    path: "/dashboard/admin/fleet-management/fuel-request",
    icon: <Droplet className="w-4 h-4" />,
    category: "fleet",
    permissions: [
      {
        module: "adminapp",
        codenames: ["view_fuelconsumptionrecord"]
      }
    ]
  },

  // Maintenance
  {
    label: "Facility Maintenance",
    path: "/dashboard/admin/facility-management/facility-maintenance",
    icon: <Wrench className="w-4 h-4" />,
    category: "maintenance",
    permissions: [
      {
        module: "adminapp",
        codenames: ["view_facilitymaintenanceticket"]
      }
    ]
  },
  {
    label: "Asset Maintenance",
    path: "/dashboard/admin/asset-maintenance",
    icon: <Hammer className="w-4 h-4" />,
    category: "maintenance",
    permissions: [
      {
        module: "adminapp",
        codenames: ["view_assetmaintenance"]
      }
    ]
  },

  // Financial Services
  {
    label: "Payment Request",
    path: "/dashboard/admin/payment-request",
    icon: <CreditCard className="w-4 h-4" />,
    category: "financial",
    permissions: [
      {
        module: "adminapp",
        codenames: ["view_paymentrequest"]
      }
    ]
  },
  {
    label: "Expense Authorization",
    path: "/dashboard/admin/expense-authorization",
    icon: <DollarSign className="w-4 h-4" />,
    category: "financial",
    permissions: [
      {
        module: "adminapp",
        codenames: ["view_expenseauthorization"]
      }
    ]
  },
  {
    label: "Travel Expense Report",
    path: "/dashboard/admin/travel-expenses-report",
    icon: <Plane className="w-4 h-4" />,
    category: "financial",
    permissions: [
      {
        module: "adminapp",
        codenames: ["view_travelexpensereport"]
      }
    ]
  },

  // Contracts & Reports
  {
    label: "Contract Request",
    path: "/dashboard/c-and-g/contract-request",
    icon: <ScrollText className="w-4 h-4" />,
    category: "contracts",
    permissions: [
      {
        module: "contract_grants",
        codenames: ["view_contractrequest"]
      }
    ]
  },
  {
    label: "Consultancy Report",
    path: "/dashboard/c-and-g/consultancy-report",
    icon: <FileBarChart className="w-4 h-4" />,
    category: "contracts",
    permissions: [
      {
        module: "contract_grants",
        codenames: ["view_consultancyreport"]
      }
    ]
  },

  // HR - Staff Self-Service
  {
    label: "My Timesheet",
    path: "/dashboard/hr/timesheet-management",
    icon: <Clock className="w-4 h-4" />,
    category: "hr",
    permissions: [
      {
        module: "hr",
        codenames: ["view_timesheet"]
      }
    ]
  },
  {
    label: "Apply for Leave",
    path: "/dashboard/hr/leave-management/apply",
    icon: <Calendar className="w-4 h-4" />,
    category: "hr",
    permissions: [
      {
        module: "hr",
        codenames: ["view_leaverequest"]
      }
    ]
  },
  {
    label: "My Leave Dashboard",
    path: "/dashboard/hr/leave-management",
    icon: <Calendar className="w-4 h-4" />,
    category: "hr",
    permissions: [
      {
        module: "hr",
        codenames: ["view_leaverequest"]
      }
    ]
  },
  {
    label: "Adhoc Staff Requisition",
    path: "/dashboard/adhoc-requisition",
    icon: <Users className="w-4 h-4" />,
    category: "hr",
    permissions: [
      {
        module: "adhoc_requisitions",
        codenames: ["view_adhocrequisition"]
      }
    ]
  },

  // Programs & Plans
  {
    label: "Annual Supervision Plan",
    path: "/dashboard/programs/plan/annual-supervision",
    icon: <Calendar className="w-4 h-4" />,
    category: "programs"
  },
  {
    label: "Site Visit Application",
    path: "/dashboard/programs/plan/site-visit",
    icon: <Calendar className="w-4 h-4" />,
    category: "programs"
  },
  {
    label: "Site Visit Management",
    path: "/dashboard/programs/plan/site-visit",
    icon: <MapPin className="w-4 h-4" />,
    category: "programs"
  },
  {
    label: "Supervision Evaluation",
    path: "/dashboard/programs/plan/supervision-evaluation",
    icon: <ClipboardList className="w-4 h-4" />,
    category: "programs"
  },

  // Support
  {
    label: "Support",
    path: "/dashboard/support",
    icon: <HeartHandshake className="w-4 h-4" />,
    category: "support",
    permissions: [
      {
        module: "support",
        codenames: ["view_ticket"]
      }
    ]
  }
];

// ==================== MODULE/SETTINGS LINKS ====================
export const moduleLinks: SidebarItem[] = [
  // Settings Menu - Available to admin-level users who manage users and permissions
  {
    name: "Settings",
    icon: <ScanEye />,
    permissions: [
      {
        module: "users",
        codenames: ["view_user"],
        requireAll: false // Any user management permission qualifies
      }
    ],
    children: [
      {
        name: "Access Management",
        permissions: [
          {
            module: "users",
            codenames: ["view_user", "change_user"],
            requireAll: false
          }
        ],
        children: [
          {
            name: "Users",
            path: "/dashboard/users",
            permissions: [
              {
                module: "users",
                codenames: ["view_user"]
              }
            ]
          },
          {
            name: "Authorization",
            path: "/dashboard/authorization",
            permissions: [
              {
                module: "authorization",
                codenames: ["view_role", "view_permission"]
              }
            ]
          }
        ]
      }
    ]
  },
  // Modules Menu - Super Admin Only (is_superuser = true)
  {
    name: "Modules",
    path: "/dashboard/modules",
    icon: <Package />,
    permissions: [
      {
        module: "superuser",
        codenames: ["is_superuser"], // This will be handled by our unified permission system
        requireAll: true
      }
    ],
    children: [
      {
        name: "Projects",
        path: "/dashboard/modules/project",
        permissions: [
          {
            module: "superuser",
            codenames: ["is_superuser"]
          }
        ]
      },
      {
        name: "Programs",
        path: "/dashboard/modules/programs",
        permissions: [
          {
            module: "superuser",
            codenames: ["is_superuser"]
          }
        ]
      },
      {
        name: "Admin Module",
        path: "/dashboard/modules/admin",
        permissions: [
          {
            module: "superuser",
            codenames: ["is_superuser"]
          }
        ]
      },
      {
        name: "Config",
        path: "/dashboard/modules/config",
        permissions: [
          {
            module: "superuser",
            codenames: ["is_superuser"]
          }
        ]
      },
      {
        name: "Procurement",
        path: "/dashboard/modules/procurement",
        permissions: [
          {
            module: "superuser",
            codenames: ["is_superuser"]
          }
        ]
      },
      {
        name: "HR",
        path: "/dashboard/modules/hr",
        permissions: [
          {
            module: "superuser",
            codenames: ["is_superuser"]
          }
        ]
      },
      {
        name: "C and G",
        path: "/dashboard/modules/c-and-g",
        permissions: [
          {
            module: "superuser",
            codenames: ["is_superuser"]
          }
        ]
      },
      {
        name: "Audit Log",
        path: "/dashboard/modules/audit-log",
        permissions: [
          {
            module: "superuser",
            codenames: ["is_superuser"]
          }
        ]
      }
    ]
  }
];

// Category definitions for Global Hub UI
export const globalHubCategories = {
  // Universal categories available to all users
  communication: { label: "Communication", icon: <FileBarChart className="w-4 h-4" /> },
  organization: { label: "Organization", icon: <Users className="w-4 h-4" /> },

  // Department-specific categories
  programs: { label: "Programs & Planning", icon: <MapPin className="w-4 h-4" /> },
  procurement: { label: "Procurement & Purchasing", icon: <ShoppingCart className="w-4 h-4" /> },
  inventory: { label: "Inventory Management", icon: <Package className="w-4 h-4" /> },
  fleet: { label: "Fleet & Transport", icon: <Car className="w-4 h-4" /> },
  maintenance: { label: "Maintenance", icon: <Wrench className="w-4 h-4" /> },
  financial: { label: "Financial Services", icon: <DollarSign className="w-4 h-4" /> },
  contracts: { label: "Contracts & Reports", icon: <FileText className="w-4 h-4" /> },
  hr: { label: "Staff Self-Service", icon: <Users className="w-4 h-4" /> },
  support: { label: "Support", icon: <HeartHandshake className="w-4 h-4" /> }
};