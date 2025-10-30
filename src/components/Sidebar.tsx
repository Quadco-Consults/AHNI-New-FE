/* eslint-disable react/prop-types */
import { useState } from "react";
import { getCurrentUser } from "@/utils/auth";
import logoSvg from "@/assets/svgs/logo-bg.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Calendar
} from "lucide-react";
// Direct Next.js paths - no RouterConstants needed
import { Icon } from "@iconify/react";
import { cn } from "lib/utils";
import { motion } from "framer-motion";
import IconButton from "./IconButton";

import DashboardIcon from "components/icons/sidebar-icons/DashboardIcon";
import ProjectsIcon from "components/icons/sidebar-icons/ProjectsIcon";
import ProgramsIcon from "components/icons/sidebar-icons/ProgramsIcon";
import ProcurementManagementIcon from "components/icons/sidebar-icons/ProcurementManagementIcon";
import AdminIcon from "components/icons/sidebar-icons/AdminIcon";
import CGIcon from "components/icons/sidebar-icons/CGIcon";
import HRIcon from "components/icons/sidebar-icons/HRIcon";

// New imports for permission system
import { usePermissions } from "@/hooks/usePermissions";
import { PermissionGuard } from "@/components/PermissionGuard";
import {
  DASHBOARD_PERMISSIONS,
  NAVIGATION_PERMISSIONS,
  MODULE_PERMISSIONS,
  SETTINGS_PERMISSIONS,
  MODULE_CODES
} from "@/constants/permissions";

type SidebarProps = {
  sidebarWidth: boolean;
  setSidebarWidth: any;
};

// Helper function to determine user's department based on email or user type
const getUserDepartment = () => {
  const user = getCurrentUser();
  if (!user) return null;

  // For now, determine department based on email pattern or user data
  const email = user.email?.toLowerCase() || '';

  // You can customize this logic based on how departments are identified
  if (email.includes('procurement') || email.includes('supply')) return 'procurement';
  if (email.includes('hr') || email.includes('human')) return 'hr';
  if (email.includes('finance') || email.includes('accounting')) return 'finance';
  if (email.includes('admin') || user.is_staff || user.is_superuser) return 'admin';

  // Default fallback - you might want to use user.department field if it exists
  return 'admin'; // For testing, default to admin so users can see menus
};

// Helper function to check if user is admin
const isUserAdmin = () => {
  const user = getCurrentUser();
  if (!user) return false;

  return user.is_staff ||
         user.is_superuser ||
         user.email?.toLowerCase().includes('admin') ||
         getUserDepartment() === 'admin';
};

// Global Hub menu items with permission requirements
const globalHubMenu = [
  // Procurement & Purchasing
  {
    label: "Purchase Requests",
    path: "/dashboard/procurement/purchase-request",
    icon: <ShoppingCart className="w-4 h-4" />,
    category: "procurement",
    permission: NAVIGATION_PERMISSIONS.VIEW_PROCUREMENT_REQUESTS
  },
  {
    label: "Item Requisition",
    path: "/dashboard/admin/inventory-management/item-requisition",
    icon: <FileText className="w-4 h-4" />,
    category: "inventory",
    permission: NAVIGATION_PERMISSIONS.VIEW_ITEM_REQUISITION
  },

  // Fleet & Transport
  {
    label: "Vehicle Request",
    path: "/dashboard/admin/fleet-management/vehicle-request",
    icon: <Car className="w-4 h-4" />,
    category: "fleet",
    permission: NAVIGATION_PERMISSIONS.VIEW_FLEET_REQUESTS
  },
  {
    label: "Fuel Request",
    path: "/dashboard/admin/fleet-management/fuel-request",
    icon: <Droplet className="w-4 h-4" />,
    category: "fleet",
    permission: NAVIGATION_PERMISSIONS.VIEW_FLEET_REQUESTS
  },

  // Maintenance
  {
    label: "Facility Maintenance",
    path: "/dashboard/admin/facility-management/facility-maintenance",
    icon: <Wrench className="w-4 h-4" />,
    category: "maintenance",
    permission: NAVIGATION_PERMISSIONS.VIEW_MAINTENANCE_REQUESTS
  },
  {
    label: "Asset Maintenance",
    path: "/dashboard/admin/asset-maintenance",
    icon: <Hammer className="w-4 h-4" />,
    category: "maintenance",
    permission: NAVIGATION_PERMISSIONS.VIEW_MAINTENANCE_REQUESTS
  },

  // Financial
  {
    label: "Payment Request",
    path: "/dashboard/admin/payment-request",
    icon: <CreditCard className="w-4 h-4" />,
    category: "financial",
    permission: NAVIGATION_PERMISSIONS.VIEW_FINANCIAL_REQUESTS
  },
  {
    label: "Expense Authorization",
    path: "/dashboard/admin/expense-authorization",
    icon: <DollarSign className="w-4 h-4" />,
    category: "financial",
    permission: NAVIGATION_PERMISSIONS.VIEW_FINANCIAL_REQUESTS
  },
  {
    label: "Travel Expense Report",
    path: "/dashboard/admin/travel-expenses-report",
    icon: <Plane className="w-4 h-4" />,
    category: "financial",
    permission: NAVIGATION_PERMISSIONS.VIEW_FINANCIAL_REQUESTS
  },

  // Contracts
  {
    label: "Contract Request",
    path: "/dashboard/c-and-g/contract-request",
    icon: <ScrollText className="w-4 h-4" />,
    category: "contracts",
    permission: NAVIGATION_PERMISSIONS.VIEW_CONTRACT_REQUESTS
  },
  {
    label: "Consultancy Report",
    path: "/dashboard/c-and-g/consultancy-report",
    icon: <FileBarChart className="w-4 h-4" />,
    category: "contracts",
    permission: NAVIGATION_PERMISSIONS.VIEW_CONTRACT_REQUESTS
  },

  // HR - Staff Self-Service
  {
    label: "My Timesheet",
    path: "/dashboard/hr/timesheet-management",
    icon: <Clock className="w-4 h-4" />,
    category: "hr",
    permission: NAVIGATION_PERMISSIONS.VIEW_MY_TIMESHEET
  },
  {
    label: "Apply for Leave",
    path: "/dashboard/hr/leave-management/apply",
    icon: <Calendar className="w-4 h-4" />,
    category: "hr",
    permission: NAVIGATION_PERMISSIONS.APPLY_FOR_LEAVE
  },
  {
    label: "My Leave Dashboard",
    path: "/dashboard/hr/leave-management",
    icon: <Calendar className="w-4 h-4" />,
    category: "hr",
    permission: NAVIGATION_PERMISSIONS.VIEW_MY_LEAVE_DASHBOARD
  },
  {
    label: "Adhoc Staff Requisition",
    path: "/dashboard/adhoc-requisition",
    icon: <Users className="w-4 h-4" />,
    category: "hr",
    permission: NAVIGATION_PERMISSIONS.CREATE_ADHOC_STAFF_REQUISITION
  },

  // Support
  {
    label: "Support",
    path: "/dashboard/support",
    icon: <HeartHandshake className="w-4 h-4" />,
    category: "support",
    permission: NAVIGATION_PERMISSIONS.VIEW_SUPPORT
  },
];

const Sidebar = ({ sidebarWidth, setSidebarWidth }: SidebarProps) => {
  // Use the new permission system
  const { hasPermission, hasModule, userModules, isAuthenticated } = usePermissions();

  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedLinkIndex, setSelectedLinkIndex] = useState<null | number>(
    null
  );
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [selectedLinkSubIndex, setSelectedLinkSubIndex] = useState<
    null | number
  >(null);

  // Global Hub dropdown state
  const [showGlobalHubMenu, setShowGlobalHubMenu] = useState(false);
  const [selectedGlobalHubCategory, setSelectedGlobalHubCategory] = useState<string | null>(null);

  // Group Global Hub menu items by category with permission filtering
  const globalHubCategories = {
    procurement: { label: "Procurement & Purchasing", icon: <ShoppingCart className="w-4 h-4" /> },
    inventory: { label: "Inventory Management", icon: <Package className="w-4 h-4" /> },
    fleet: { label: "Fleet & Transport", icon: <Car className="w-4 h-4" /> },
    maintenance: { label: "Maintenance", icon: <Wrench className="w-4 h-4" /> },
    financial: { label: "Financial Services", icon: <DollarSign className="w-4 h-4" /> },
    contracts: { label: "Contracts & Reports", icon: <FileText className="w-4 h-4" /> },
    hr: { label: "Staff Self-Service", icon: <Users className="w-4 h-4" /> },
    support: { label: "Support", icon: <HeartHandshake className="w-4 h-4" /> }
  };

  const groupedGlobalHubMenu = Object.entries(globalHubCategories).map(([category, categoryInfo]) => ({
    category,
    ...categoryInfo,
    items: globalHubMenu.filter(item => {
      if (item.category !== category) return false;

      // Check if user has permission for this item
      if (item.permission && !hasPermission(item.permission)) {
        return false;
      }

      return true;
    })
  })).filter(group => group.items.length > 0);

  return (
    <aside
      className={cn(
        "bg-background fixed inset-0 z-[20] min-h-screen overflow-auto pb-[4rem] duration-200",
        sidebarWidth === false ? "w-[19%]" : "w-[5%]"
      )}
    >
      <section className="flex flex-col w-full gap-2">
        <div className="relative h-[5rem] overflow-hidden">
          <div
            className={cn(
              "bg-background z-20 mx-auto duration-200 ",
              sidebarWidth === false ? "w-[100%]" : "w-[0%]"
            )}
          >
            <img
              src={logoSvg.src}
              alt="logo"
              className="object-cover w-24 mx-auto"
            />
            <IconButton
              onClick={() => setSidebarWidth(!sidebarWidth)}
              className={cn(
                "hover:text-primary absolute right-0 top-5 z-40 shadow-sm",
                sidebarWidth && "right-3 rotate-180 duration-200"
              )}
            >
              <Icon icon="ph:arrow-left-duotone" fontSize={15} />
            </IconButton>
          </div>
        </div>

        <div className="px-2 pt-5 space-y-6">
          {/* Dashboard button - Protected by permission */}
          <PermissionGuard permission={DASHBOARD_PERMISSIONS.ACCESS_DASHBOARD}>
            <Link
              href="/dashboard"
              className={cn(
                "flex w-full items-center justify-start gap-3 rounded-lg p-3",
                pathname === "/dashboard"
                  ? "bg-primary px dark:text-inherit text-white hover:opacity-70"
                  : "bg-inherit px hover:bg-primary hover:text-white"
              )}
            >
              <DashboardIcon />

              <h4
                className={cn(
                  "font-semibold duration-200",
                  sidebarWidth === false ? "block" : "hidden"
                )}
              >
                Dashboard
              </h4>
            </Link>
          </PermissionGuard>


          {/* Departmental Links - Based on assigned modules */}
          {/* Temporarily show for all authenticated users while setting up roles */}
          {isAuthenticated && (
            <div className="">
              <h4
                className={cn(
                  "text-black/40 px-2 py-3 text-xs font-semibold uppercase duration-200",
                  sidebarWidth === false ? "block" : "hidden"
                )}
              >
                DEPARTMENTAL HUB
              </h4>

              {/* Projects Link - Special case, not module-based */}
              <Link
                href="/dashboard/projects"
                className={cn(
                  "hover:text-primary flex w-full items-center justify-between gap-3 px-2 py-2 text-sm font-bold hover:cursor-pointer",
                  pathname.startsWith("/dashboard/projects") && "text-primary "
                )}
              >
                <div className="flex w-[85%] items-center gap-2">
                  <span className="">
                    <ProjectsIcon />
                  </span>
                  <h4
                    className={cn(
                      " w-[100%] truncate font-medium",
                      sidebarWidth === false ? "block" : "hidden"
                    )}
                  >
                    Projects
                  </h4>
                </div>
              </Link>

              {/* Render departmental links based on user's assigned modules */}
              {getDeparmentalLinks(userModules).map(
                (link: any, index: number) => (
                <div key={index} className="w-full ">
                  <div
                    onClick={() => {
                      setShowMenu(!showMenu);
                      setSelectedLinkIndex(index);
                    }}
                    className={cn(
                      "hover:text-primary flex w-full items-center justify-between gap-3 px-2 py-2 text-sm font-bold hover:cursor-pointer",
                      link.path && pathname && pathname.startsWith(link.path) && "text-primary "
                    )}
                  >
                    <div className="flex w-[85%] items-center gap-2">
                      <span className="">{link.icon}</span>
                      <h4
                        className={cn(
                          " w-[100%] truncate font-medium",
                          sidebarWidth === false ? "block" : "hidden"
                        )}
                      >
                        {link.name}
                      </h4>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 -rotate-90 transition duration-200",
                        showMenu && selectedLinkIndex === index && "rotate-0"
                      )}
                      aria-hidden="true"
                    />
                  </div>
                  <motion.ul
                    animate={
                      showMenu && selectedLinkIndex === index
                        ? {
                            height: "fit-content",
                          }
                        : {
                            height: 0,
                          }
                    }
                    className="h-0 overflow-hidden list-none pl-14"
                  >
                    {link?.link?.map((el: any, i: number) =>
                      el?.sublinks ? (
                        <div key={i}>
                          <li className="text-sm list-none hover:text-amber-400 hover:cursor-pointer">
                            <div
                              onClick={() => {
                                setShowSubMenu(!showSubMenu);
                                setSelectedLinkSubIndex(i);
                              }}
                              className={cn(
                                "flex items-center justify-start gap-2",
                                el.path && pathname && pathname.startsWith(el.path) &&
                                  " text-amber-400 "
                              )}
                            >
                              <span
                                className={cn(
                                  "bg-black hover:bg-amber-400 aspect-square w-2 truncate rounded-full border",
                                  el.path && pathname && pathname.startsWith(el.path) &&
                                    " bg-amber-400 border-amber-400 hover:bg-amber-400"
                                )}
                              ></span>
                              <h6 className="py-2">{el.name}</h6>
                              <ChevronDown
                                className={cn(
                                  "h-3 w-3 transition duration-200",
                                  showSubMenu &&
                                    selectedLinkSubIndex === i &&
                                    "rotate-180"
                                )}
                                aria-hidden="true"
                              />
                            </div>
                          </li>

                          <motion.ul
                            animate={
                              showSubMenu && selectedLinkSubIndex === i
                                ? {
                                    height: "fit-content",
                                  }
                                : {
                                    height: 0,
                                  }
                            }
                            className="h-0 overflow-hidden text-sm"
                          >
                            {el?.sublinks?.map((sublink: any) => (
                              <Link
                                key={sublink.name}
                                href={sublink.path || "#"}
                                className={cn(
                                  "",
                                  sublink.path && pathname && pathname.startsWith(sublink.path) && "text-amber-400"
                                )}
                              >
                                <li className="py-2 ml-8 list-none hover:text-amber-400 hover:cursor-pointer">
                                  {sublink.name}
                                </li>
                              </Link>
                            ))}
                          </motion.ul>
                        </div>
                      ) : (
                        <Link
                          key={i}
                          href={el.path || "#"}
                          className={cn(
                            "",
                            el.path && pathname && pathname.startsWith(el.path) && "text-amber-400"
                          )}
                        >
                          <li
                            className={cn(
                              "hover:text-amber-400 flex items-center justify-start gap-2 text-sm",
                              el.path && pathname && pathname.startsWith(el.path) && " text-amber-400 "
                            )}
                          >
                            <span
                              className={cn(
                                "bg-black hover:bg-amber-400 aspect-square w-2 rounded-full border",
                                el.path && pathname && pathname.startsWith(el.path) &&
                                  " bg-amber-400 border-amber-400 hover:bg-amber-400"
                              )}
                            ></span>
                            <h6 className="py-2">{el.name}</h6>
                          </li>
                        </Link>
                      )
                    )}
                  </motion.ul>
                </div>
              )
            )}
            </div>
          )}

          {/* Settings Section - Protected by permissions */}
          <PermissionGuard permission={SETTINGS_PERMISSIONS.VIEW_SETTINGS_MENU}>
            <div>
            <h4
              className={cn(
                "text-black/40 px-2 py-3 text-xs font-semibold uppercase duration-200",
                sidebarWidth === false ? "block" : "hidden"
              )}
            >
              SETTINGS
            </h4>

            {MODULE_LINKS.map((link: any, index: number) => {
              if (link) {
                return (
                  <div key={index} className="w-full ">
                    <div
                      onClick={() => {
                        setShowSettings(!showSettings);
                        setSelectedLinkIndex(index);
                      }}
                      className={cn(
                        "hover:text-primary flex w-full items-center justify-between gap-3 px-2 py-2 text-sm font-bold hover:cursor-pointer",
                        link.path && pathname && pathname.startsWith(link.path) && "text-primary "
                      )}
                    >
                      <div className="flex w-[85%] items-center gap-2">
                        <span className="">{link.icon}</span>
                        <h4
                          className={cn(
                            " w-[100%] truncate font-medium",
                            sidebarWidth === false ? "block" : "hidden"
                          )}
                        >
                          {link.name}
                        </h4>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 -rotate-90 transition duration-200",
                          showSettings &&
                            selectedLinkIndex === index &&
                            "rotate-0"
                        )}
                        aria-hidden="true"
                      />
                    </div>
                    <motion.ul
                      animate={
                        showSettings && selectedLinkIndex === index
                          ? {
                              height: "fit-content",
                            }
                          : {
                              height: 0,
                            }
                      }
                      className="h-0 overflow-hidden list-none pl-14"
                    >
                      {link?.link?.map((el: any, i: number) =>
                        el?.sublinks ? (
                          <div key={i}>
                            <li className="text-sm list-none hover:text-amber-400 hover:cursor-pointer">
                              <div
                                onClick={() => {
                                  setShowSubMenu(!showSubMenu);
                                  setSelectedLinkSubIndex(i);
                                }}
                                className={cn(
                                  "flex items-center justify-start gap-2",
                                  el.path && pathname && pathname.startsWith(el.path) &&
                                    " text-amber-400 "
                                )}
                              >
                                <span
                                  className={cn(
                                    "bg-black hover:bg-amber-400 aspect-square w-2 truncate rounded-full border",
                                    el.path && pathname && pathname.startsWith(el.path) &&
                                      " bg-amber-400 border-amber-400 hover:bg-amber-400"
                                  )}
                                ></span>
                                <h6 className="py-2">{el.name}</h6>
                                <ChevronDown
                                  className={cn(
                                    "h-3 w-3 transition duration-200",
                                    showSubMenu &&
                                      selectedLinkSubIndex === i &&
                                      "rotate-180"
                                  )}
                                  aria-hidden="true"
                                />
                              </div>
                            </li>

                            <motion.ul
                              animate={
                                showSubMenu && selectedLinkSubIndex === i
                                  ? {
                                      height: "fit-content",
                                    }
                                  : {
                                      height: 0,
                                    }
                              }
                              className="h-0 overflow-hidden text-sm"
                            >
                              {el?.sublinks?.map((sublink: any) => (
                                <Link
                                  key={sublink.name}
                                  href={sublink.path || "#"}
                                  className={cn(
                                    "",
                                    sublink.path && pathname && pathname.startsWith(sublink.path) && "text-amber-400"
                                  )}
                                >
                                  <li className="py-2 ml-8 list-none hover:text-amber-400 hover:cursor-pointer">
                                    {sublink.name}
                                  </li>
                                </Link>
                              ))}
                            </motion.ul>
                          </div>
                        ) : (
                          <Link
                            key={i}
                            href={el.path || "#"}
                            className={cn(
                              "",
                              el.path && pathname && pathname.startsWith(el.path) && "text-amber-400"
                            )}
                          >
                            <li
                              className={cn(
                                "hover:text-amber-400 flex items-center justify-start gap-2 text-sm",
                                el.path && pathname && pathname.startsWith(el.path) &&
                                  " text-amber-400 "
                              )}
                            >
                              <span
                                className={cn(
                                  "bg-black hover:bg-amber-400 aspect-square w-2 rounded-full border",
                                  el.path && pathname && pathname.startsWith(el.path) &&
                                    " bg-amber-400 border-amber-400 hover:bg-amber-400"
                                )}
                              ></span>
                              <h6 className="py-2">{el.name}</h6>
                            </li>
                          </Link>
                        )
                      )}
                    </motion.ul>
                  </div>
                );
              }
            })}

            <Link
              href="/dashboard/audit-log"
              className={cn(
                "hover:text-primary flex w-full items-center justify-between gap-3 px-2 py-2 text-sm font-bold hover:cursor-pointer",
                pathname.startsWith("/audit-log") && "text-primary "
              )}
            >
              <div className="flex w-[85%] items-center gap-2">
                <span className="">
                  <ProjectsIcon />
                </span>
                <h4
                  className={cn(
                    " w-[100%] truncate font-medium",
                    sidebarWidth === false ? "block" : "hidden"
                  )}
                >
                  Audit Log{" "}
                </h4>
              </div>
            </Link>

            {/* modules */}
            </div>
          </PermissionGuard>

          {/* Global Hub - Protected by permissions */}
          <PermissionGuard permission={NAVIGATION_PERMISSIONS.VIEW_GLOBAL_HUB}>
          <div className="">
            <h4
              className={cn(
                "text-black/40 px-2 py-3 text-xs font-semibold uppercase duration-200",
                sidebarWidth === false ? "block" : "hidden"
              )}
            >
              GLOBAL HUB
            </h4>

            <div className="space-y-1">
              {groupedGlobalHubMenu?.map((category) => (
                <div key={category.category}>
                  {/* Category Header */}
                  <div
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer",
                      "text-gray-700 hover:bg-primary/5 hover:text-primary dark:text-gray-300 dark:hover:bg-primary/10"
                    )}
                    onClick={() => {
                      if (selectedGlobalHubCategory === category.category && showGlobalHubMenu) {
                        setShowGlobalHubMenu(false);
                        setSelectedGlobalHubCategory(null);
                      } else {
                        setShowGlobalHubMenu(true);
                        setSelectedGlobalHubCategory(category.category);
                      }
                    }}
                  >
                    <div className="flex w-full items-center gap-3">
                      <span className="flex-shrink-0">
                        {category.icon}
                      </span>
                      <h4
                        className={cn(
                          "w-[100%] truncate font-medium",
                          sidebarWidth === false ? "block" : "hidden"
                        )}
                      >
                        {category.label}
                      </h4>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 -rotate-90 transition duration-200",
                        showGlobalHubMenu && selectedGlobalHubCategory === category.category && "rotate-0"
                      )}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Category Items */}
                  <motion.ul
                    animate={
                      showGlobalHubMenu && selectedGlobalHubCategory === category.category
                        ? { height: "auto", opacity: 1 }
                        : { height: 0, opacity: 0 }
                    }
                    className="overflow-hidden"
                  >
                    <div className="space-y-1 pl-6 pt-1">
                      {category.items.map((item, itemIndex) => {
                        const isActive = item.path && pathname && pathname.startsWith(item.path);
                        return (
                          <Link
                            key={itemIndex}
                            href={item.path || "#"}
                            className={cn(
                              "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-gray-600 hover:bg-primary/5 hover:text-primary dark:text-gray-400 dark:hover:bg-primary/10"
                            )}
                          >
                            <span
                              className={cn(
                                "bg-gray-400 hover:bg-primary aspect-square w-2 rounded-full border",
                                isActive && "bg-primary border-primary"
                              )}
                            ></span>
                            <h6
                              className={cn(
                                "truncate transition-all duration-200",
                                sidebarWidth === false ? "block" : "hidden"
                              )}
                            >
                              {item.label}
                            </h6>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.ul>
                </div>
              ))}
            </div>
          </div>
          </PermissionGuard>
        </div>
      </section>
    </aside>
  );
};

export default Sidebar;

const MODULE_LINKS = [
  {
    name: "Access Management",
    path: "/dashboard/users",
    icon: <ScanEye />,
    link: [
      {
        name: "Users",
        path: "/dashboard/users",
      },
      {
        name: "Authorization",
        path: "/dashboard/authorization",
      },
    ],
  },
  {
    name: "Modules",
    path: "/dashboard/modules",
    icon: <Package />,
    link: [
      {
        name: "Projects",
        path: "/dashboard/modules/project",
      },
      {
        name: "Programs",
        path: "/dashboard/modules/programs",
      },
      {
        name: "Admin",
        path: "/dashboard/modules/admin",
      },
      {
        name: "Config",
        path: "/dashboard/modules/config",
      },
      {
        name: "Procurement",
        path: "/dashboard/modules/procurement",
      },
      // {
      //   name: "Finance",
      //   path: "/dashboard/modules/finance",
      // },
      {
        name: "HR",
        path: "/dashboard/modules/hr",
      },

      {
        name: "C and G",
        path: "/dashboard/modules/c-and-g",
      },
    ],
  },
];

const getDeparmentalLinks = (assignedModules: string[] = []) => {
  // Define all available departmental modules
  const allDepartmentalModules = [
    {
      name: "Programs",
      path: "/dashboard/programs",
      icon: <ProgramsIcon />,
      moduleCode: MODULE_CODES.PROGRAMS,
      modulePermission: MODULE_PERMISSIONS.ACCESS_PROGRAMS_MODULE,
      link: [
        {
          name: "Plans",
          path: "/dashboard/programs/plan",
          sublinks: [
            {
              name: "Work Plan",
              path: "/dashboard/programs/plan/work-plan",
            },
            {
              name: "Work Plan Tracker",
              path: "/dashboard/programs/plan/activity-tracker",
            },
            {
              name: "Activity Plan",
              path: "/dashboard/programs/plan/activity",
            },

            {
              name: "Risk Management Plan",
              path: "/dashboard/programs/plan/risk-management-plan",
            },

            {
              name: "Supportive Supervision Plan",
              path: "/dashboard/programs/plan/supportive-supervision-plan",
            },
          ],
        },

        {
          name: "Stakeholder Management",
          path: "/dashboard/programs/stakeholder-management",
          sublinks: [
            {
              name: "Analysis & Mapping",
              path: "/dashboard/programs/stakeholder-management/analysis&mapping",
            },
            {
              name: "Stakeholder Register",
              path: "/dashboard/programs/stakeholder-management/stakeholder-register",
            },
            {
              name: "Engagement Plan",
              path: "/dashboard/programs/stakeholder-management/engagement-plan",
            },
          ],
        },

        { name: "Fund Request", path: "/dashboard/programs/fund-request" },

        {
          name: "Adhoc Management",
          sublinks: [
            {
              name: "Adhoc Management",
              path: "/dashboard/programs/adhoc-management",
            },

            {
              name: "Adhoc Database",
              path: "/dashboard/programs/adhoc-database",
            },

            {
              name: "Adhoc Acceptance",
              path: "/dashboard/programs/adhoc/adhoc-acceptance",
            },

            {
              name: "Contract Recipients",
              path: "/dashboard/programs/adhoc/contract-recipients",
            },

            {
              name: "Accepted Contracts",
              path: "/dashboard/programs/adhoc/accepted-contracts",
            },

            {
              name: "Adhoc Staff Requisition",
              path: "/dashboard/adhoc-requisition",
            },
          ],
        },

        { name: "Reports", path: "/dashboard/programs/reports" },
      ],
    },
    {
      name: "Procurement Management",
      path: "/dashboard/procurement",
      icon: <ProcurementManagementIcon />,
      moduleCode: MODULE_CODES.PROCUREMENT,
      modulePermission: MODULE_PERMISSIONS.ACCESS_PROCUREMENT_MODULE,
      link: [
        { name: "Overview", path: "/dashboard/procurement" },
        {
          name: "Vendor Management",
          path: "/dashboard/procurement/vendor-management/prequalification",
          sublinks: [
            {
              name: "Prequalification",
              path: "/dashboard/procurement/vendor-management/prequalification",
            },
            {
              name: "EOI",
              path: "/dashboard/procurement/vendor-management/eoi",
            },
            {
              name: "Vendor Evaluation",
              path: "/dashboard/procurement/vendor-performance",
            },
            {
              name: "Evaluation Dashboard",
              path: "/dashboard/procurement/vendor-evaluation-dashboard",
            },
            {
              name: "Performance Analytics",
              path: "/dashboard/procurement/vendor-performance-analytics",
            },
          ],
        },
        {
          name: "Supplier Database",
          path: "/dashboard/procurement/supplier-database",
        },
        {
          name: "Price Intelligence",
          path: "/dashboard/procurement/price-intelligence",
        },
        {
          name: "Procurement Plan",
          path: "/dashboard/procurement/procurement-plan",
        },
        {
          name: "Procurement Tracker",
          path: "/dashboard/procurement/procurement-tracker",
        },
        {
          name: "Purchase Request",
          path: "/dashboard/procurement/purchase-request",
        },
        {
          name: "Activity Memo",
          path: "/dashboard/procurement/activity-memo",
        },
        {
          name: "Solicitation Management",
          path: "/dashboard/procurement/solicitation-management",
          sublinks: [
            {
              name: "RFQ",
              path: "/dashboard/procurement/solicitation-management/rfq",
            },
            {
              name: "RFP",
              path: "/dashboard/procurement/solicitation-management/rfp",
            },
          ],
        },
        {
          name: "Competitive Bid Analysis",
          path: "/dashboard/procurement/competitive-bid-analysis",
        },
        {
          name: "Purchase Order",
          path: "/dashboard/procurement/purchase-order",
        },
        {
          name: "Procurement Report",
          path: "/dashboard/procurement/procurement-report",
        },
      ],
    },

    {
      name: "Admin",
      icon: <AdminIcon />,
      moduleCode: MODULE_CODES.ADMIN,
      modulePermission: MODULE_PERMISSIONS.ACCESS_ADMIN_MODULE,
      link: [
        {
          name: "Inventory Management",
          path: "/dashboard/admin/inventory-management",
          sublinks: [
            {
              name: "Consumable",
              path: "/dashboard/admin/inventory-management/consumable",
            },

            {
              name: "Item Requisition",
              path: "/dashboard/admin/inventory-management/item-requisition",
            },

            {
              name: "Assets",
              path: "/dashboard/admin/inventory-management/assets",
            },
            {
              name: "Asset Requests",
              path: "/dashboard/admin/inventory-management/asset-request",
            },
            {
              name: "Good Receive Note",
              path: "/dashboard/admin/inventory-management/good-receive-note",
            },

            {
              name: "Stores",
              path: "/dashboard/admin/inventory-management/stores",
            },

            {
              name: "Store Transfers",
              path: "/dashboard/admin/inventory-management/store-transfers",
            },

            {
              name: "Admin Tracker",
              path: "/dashboard/admin/admin-tracker",
            },
          ],
        },

        {
          name: "Solicitation Management",
          path: "/dashboard/admin/solicitation-management",
          sublinks: [
            {
              name: "Request For Quotation",
              path: "/dashboard/admin/solicitation-management/rfq",
            },
          ],
        },

        {
          name: "Fleet Management",
          path: "/dashboard/admin/fleet-management",
          sublinks: [
            {
              name: "Vehicle Request",
              path: "/dashboard/admin/fleet-management/vehicle-request",
            },
            {
              name: "Vehicle Maintenance Ticket",
              path: "/dashboard/admin/fleet-management/vehicle-maintenance",
            },
            {
              name: "Fuel Request",
              path: "/dashboard/admin/fleet-management/fuel-request",
            },
          ],
        },
        {
          name: "Facility Management",
          sublinks: [
            {
              name: "Facility Maintenance Ticket",
              path: "/dashboard/admin/facility-management/facility-maintenance",
            },
          ],
        },
        {
          name: "Payment Request",
          path: "/dashboard/admin/payment-request",
        },
        {
          name: "Service Level Agreements",
          path: "/dashboard/admin/agreements",
        },

        {
          name: "Asset Maintenance",
          path: "/dashboard/admin/asset-maintenance",
        },

        {
          name: "Expense Authorization",
          path: "/dashboard/admin/expense-authorization",
        },

        {
          name: "Travel Expenses Report",
          path: "/dashboard/admin/travel-expenses-report",
        },
      ],
    },
    {
      name: "HR",
      icon: <HRIcon />,
      moduleCode: MODULE_CODES.HR,
      modulePermission: MODULE_PERMISSIONS.ACCESS_HR_MODULE,
      link: [
        { name: "Overview", path: "/dashboard/hr" },
        {
          name: "Employee Management",
          sublinks: [
            {
              name: "Workforce Need Analysis",
              path: "/dashboard/hr/workforce-need-analysis",
            },
            {
              name: "Workforce Database",
              path: "/dashboard/hr/workforce-database",
            },
          ],
        },
        {
          name: "Recruitment",
          sublinks: [
            { name: "Advertisement", path: "/dashboard/hr/advertisement" },
            { name: "Selection", path: "/dashboard/hr/selection" },
            { name: "Onboarding", path: "/dashboard/hr/onboarding" },
          ],
        },
        {
          name: "Performance Management",
          sublinks: [
            {
              name: "Performance Appraisal",
              path: "/dashboard/hr/performance-management",
            },
            {
              name: "Goal Setting",
              path: "/dashboard/hr/goals-management",
            },
          ],
        },
        {
          name: "Employee compensation & benefits",
          sublinks: [
            {
              name: "Compensation Category (Pay Group)",
              path: "/dashboard/hr/employee-benefit/pay-group",
            },
            {
              name: "Compensation",
              path: "/dashboard/hr/employee-benefit/compensation",
            },
            {
              name: "Compensation Spread",
              path: "/dashboard/hr/employee-benefit/compensation-spread",
            },

            {
              name: "Payroll",
              path: "/dashboard/hr/employee-benefit/pay-roll",
            },
          ],
        },

        {
          name: "Separation Management",
          path: "/dashboard/hr/separation-management",
        },
        {
          name: "Grievance Management",
          path: "/dashboard/hr/grievance-management",
        },
        {
          name: "Timesheet Management",
          sublinks: [
            {
              name: "My Timesheets",
              path: "/dashboard/hr/timesheet-management",
            },
            {
              name: "Approvals",
              path: "/dashboard/hr/timesheet-management/approvals",
            },
          ],
        },
        {
          name: "Leave Management",
          sublinks: [
            {
              name: "My Dashboard",
              path: "/dashboard/hr/leave-management",
            },
            {
              name: "Assign",
              path: "/dashboard/hr/leave-management/assign-leave",
            },
            {
              name: "Leave List",
              path: "/dashboard/hr/leave-management/leave-list",
            },
            {
              name: "Configuration",
              path: "/dashboard/hr/leave-management/configuration",
            },
          ],
        },
        { name: "HR Reports", path: "/" },
      ],
    },
    {
      name: "C&G",
      icon: <CGIcon />,
      moduleCode: MODULE_CODES.CONTRACTS,
      modulePermission: MODULE_PERMISSIONS.ACCESS_CONTRACTS_MODULE,
      link: [
        { name: "Overview", path: "/dashboard/c-and-g/overview" },

        { name: "Donor Database", path: "/dashboard/c-and-g/donor-database" },

        { name: "Grants", path: "/dashboard/c-and-g/grant" },

        {
          name: "Sub Grants",
          sublinks: [
            {
              name: "Sub Grant Adverts",
              path: "/dashboard/c-and-g/sub-grant",
            },
            { name: "Awards", path: "/dashboard/c-and-g/sub-grant/awards" },
            {
              name: "Pre-award Assessment",
              path: "/dashboard/c-and-g/sub-grant/preaward-assessment",
            },
            {
              name: "Awarded Beneficiaries",
              path: "/dashboard/c-and-g/awarded-beneficiaries",
            },
          ],
        },

        {
          name: "Closeout",
          sublinks: [
            {
              name: "Closeout Plan",
              path: "/dashboard/c-and-g/close-out-plan",
            },
            {
              name: "Activity Headings",
              path: "/dashboard/c-and-g/close-out-plan/activity-headings",
            },
          ],
        },
        {
          name: "Contract Management",
          sublinks: [
            {
              name: "Contract Request",
              path: "/dashboard/c-and-g/contract-request",
            },

            {
              name: "Consultant Management",
              path: "/dashboard/c-and-g/consultancy",
            },

            {
              name: "Consultancy Database",
              path: "/dashboard/c-and-g/consultancy-database",
            },

            {
              name: "Consultant Contract Dashboard",
              path: "/dashboard/c-and-g/consultant/consultance-acceptance",
            },

            {
              name: "Consultancy Report",
              path: "/dashboard/c-and-g/consultancy-report",
            },
            {
              name: "Service Level Agreement",
              path: "/dashboard/c-and-g/agreements",
            },
            {
              name: "Facilitator Management",
              path: "/dashboard/c-and-g/facilitator-management",
            },

            {
              name: "Facilitator Database",
              path: "/dashboard/c-and-g/facilitator-database",
            },
          ],
        },
        { name: "C&G Reports", path: "/" },
      ],
    },
    {
      name: "Finance",
      path: "/dashboard/finance",
      icon: <DollarSign />,
      moduleCode: MODULE_CODES.FINANCE,
      modulePermission: MODULE_PERMISSIONS.ACCESS_FINANCE_MODULE,
      link: [
        {
          name: "Overview",
          path: "/dashboard/finance",
        },
        {
          name: "Financial Classifications",
          path: "/dashboard/finance/classifications",
        },
        {
          name: "Chart of Accounts",
          path: "/dashboard/finance/chart-of-accounts",
        },
        {
          name: "Bank Accounts",
          path: "/dashboard/finance/bank-accounts",
        },
        {
          name: "Journal Entries",
          path: "/dashboard/finance/journal-entries",
        },
        {
          name: "Financial Reports",
          path: "/dashboard/finance/financial-reports",
        },
        {
          name: "Bank Reconciliation",
          path: "/dashboard/finance/bank-reconciliation",
        },
        {
          name: "Integration Dashboard",
          path: "/dashboard/finance/integration-dashboard",
        },
        {
          name: "Financial Analysis",
          path: "/dashboard/finance/analysis",
        },
        {
          name: "QuickBooks Settings",
          path: "/dashboard/finance/quickbooks/settings",
        },
        {
          name: "QuickBooks Sync",
          path: "/dashboard/finance/quickbooks/sync",
        },
        {
          name: "Customer Management",
          path: "/dashboard/finance/customers",
        },
        {
          name: "Invoicing & Billing",
          path: "/dashboard/finance/invoices",
        },
        {
          name: "Sales Orders",
          path: "/dashboard/finance/sales-orders",
        },
        {
          name: "Accounts Receivable",
          path: "/dashboard/finance/accounts-receivable",
        },
        {
          name: "Tax Management",
          path: "/dashboard/finance/tax-management",
        },
        {
          name: "Accounts Payable",
          path: "/dashboard/finance/accounts-payable",
        },
        {
          name: "Fixed Assets",
          path: "/dashboard/finance/fixed-assets",
        },
        {
          name: "Expense Tracking",
          path: "/dashboard/finance/expenses",
        },
        {
          name: "Budget Reports",
          path: "/dashboard/finance/budget-reports",
        },
        {
          name: "Petty Cash",
          path: "/dashboard/finance/petty-cash",
        },
      ],
    },
  ];

  // Filter modules based on user's assigned modules
  return allDepartmentalModules.filter(link => {
    // Temporarily show Admin module to all authenticated users for role setup
    if (link.moduleCode === MODULE_CODES.ADMIN) {
      return true;
    }

    // Check if user has access to this module
    if (link.moduleCode && !assignedModules.includes(link.moduleCode)) {
      return false;
    }

    return true;
  });
};
