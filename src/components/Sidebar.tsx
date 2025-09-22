/* eslint-disable react/prop-types */
import { useState } from "react";
import logoSvg from "@/assets/svgs/logo-bg.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaDotCircle } from "react-icons/fa";
import { ChevronDown, Package, ScanEye, HeartHandshake } from "lucide-react";
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
// import FinanceIcon from "components/icons/sidebar-icons/FinanceIcon";
// import { useGetUserProfile } from "@/features/auth/controllers/user";

type SidebarProps = {
  sidebarWidth: boolean;
  setSidebarWidth: any;
};

const globalHubMenu = [
  {
    label: "Purchase Requests",
    path: "/dashboard/procurement/purchase-request",
  },
  { label: "Support", path: "/dashboard/support", icon: <HeartHandshake /> },
  {
    label: "Item Requisition",
    path: "/dashboard/admin/inventory-management/item-requisition",
  },
  {
    label: "Vehicle Request",
    path: "/dashboard/admin/fleet-management/vehicle-request",
  },
  {
    label: "Fuel Request",
    path: "/dashboard/admin/fleet-management/fuel-request",
  },
  {
    label: "Facility Maintenance Ticket",
    path: "/dashboard/admin/facility-management/facility-maintenance",
  },
  {
    label: "Payment Request",
    path: "/dashboard/admin/payment-request",
  },
  {
    label: "Asset Maintenance Request",
    path: "/dashboard/admin/asset-maintenance",
  },
  {
    label: "Expense Authorization",
    path: "/dashboard/admin/expense-authorization",
  },
  {
    label: "Travel Expense Report",
    path: "/dashboard/admin/travel-expenses-report",
  },
  {
    label: "Consultancy Report",
    path: "/dashboard/c-and-g/consultancy-report",
  },
  {
    label: "Contract Request",
    path: "/dashboard/c-and-g/contract-request",
  },
];

const Sidebar = ({ sidebarWidth, setSidebarWidth }: SidebarProps) => {
  // const { data: user } = useGetUserProfile(null);

  // const assignedModules = user?.data.assigned_modules;

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
          {/* Dashboard button */}

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

          {/* Departmental Links */}
          <div className="">
            <h4
              className={cn(
                "text-black/40 px-2 py-3 text-xs font-semibold uppercase duration-200",
                sidebarWidth === false ? "block" : "hidden"
              )}
            >
              DEPARTMENTAL HUB
            </h4>

            <Link
              href="/dashboard/projects"
              className={cn(
                "hover:text-primary flex w-full items-center justify-between gap-3 px-2 py-2 text-sm font-bold hover:cursor-pointer",
                pathname.startsWith("/projects") && "text-primary "
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
            {/* @ts-ignore */}
            {getDeparmentalLinks(["procurement"]).map(
              (link: any, index: number) => (
                <div key={index} className="w-full ">
                  <div
                    onClick={() => {
                      setShowMenu(!showMenu);
                      setSelectedLinkIndex(index);
                    }}
                    className={cn(
                      "hover:text-primary flex w-full items-center justify-between gap-3 px-2 py-2 text-sm font-bold hover:cursor-pointer",
                      pathname.startsWith(link.path) && "text-primary "
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
                                pathname.startsWith(el.path) &&
                                  " text-amber-400 "
                              )}
                            >
                              <span
                                className={cn(
                                  "bg-black hover:bg-amber-400 aspect-square w-2 truncate rounded-full border",
                                  pathname.startsWith(el.path) &&
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
                                href={sublink.path}
                                className={cn(
                                  "",
                                  pathname.startsWith(sublink.path) && "text-amber-400"
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
                          href={el.path}
                          className={cn(
                            "",
                            pathname.startsWith(el.path) && "text-amber-400"
                          )}
                        >
                          <li
                            className={cn(
                              "hover:text-amber-400 flex items-center justify-start gap-2 text-sm",
                              pathname.startsWith(el.path) && " text-amber-400 "
                            )}
                          >
                            <span
                              className={cn(
                                "bg-black hover:bg-amber-400 aspect-square w-2 rounded-full border",
                                pathname.startsWith(el.path) &&
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

          {/* settings */}
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
                        pathname.startsWith(link.path) && "text-primary "
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
                                  pathname.startsWith(el.path) &&
                                    " text-amber-400 "
                                )}
                              >
                                <span
                                  className={cn(
                                    "bg-black hover:bg-amber-400 aspect-square w-2 truncate rounded-full border",
                                    pathname.startsWith(el.path) &&
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
                                  href={sublink.path}
                                  className={cn(
                                    "",
                                    pathname.startsWith(sublink.path) && "text-amber-400"
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
                            href={el.path}
                            className={cn(
                              "",
                              pathname.startsWith(el.path) && "text-amber-400"
                            )}
                          >
                            <li
                              className={cn(
                                "hover:text-amber-400 flex items-center justify-start gap-2 text-sm",
                                pathname.startsWith(el.path) &&
                                  " text-amber-400 "
                              )}
                            >
                              <span
                                className={cn(
                                  "bg-black hover:bg-amber-400 aspect-square w-2 rounded-full border",
                                  pathname.startsWith(el.path) &&
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

          {/* Global Hub */}
          <div className="">
            <h4
              className={cn(
                "text-black/40 px-2 py-3 text-xs font-semibold uppercase duration-200",
                sidebarWidth === false ? "block" : "hidden"
              )}
            >
              GLOBAL HUB
            </h4>

            {globalHubMenu?.map(({ label, path, icon }, id) => {
              return (
                <Link
                  key={id}
                  href={path}
                  className={cn(
                    "hover:text-primary flex w-full items-center justify-between gap-3 px-2 py-2 text-sm font-bold hover:cursor-pointer",
                    pathname.startsWith(path) && "text-primary "
                  )}
                >
                  <div className="flex w-[85%] items-center gap-2">
                    <span className="">{icon ? icon : <FaDotCircle />}</span>
                    <h4
                      className={cn(
                        " w-[100%] truncate font-medium uppercase",
                        sidebarWidth === false ? "block" : "hidden"
                      )}
                    >
                      {label}
                    </h4>
                  </div>
                </Link>
              );
            })}
          </div>
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

// const getDeparmentalLinks = (assignedModules: string[]) => {
const getDeparmentalLinks = () => {
  return [
    {
      name: "Programs",
      path: "/dashboard/programs",
      icon: <ProgramsIcon />,
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
          ],
        },

        { name: "Reports", path: "/dashboard/programs/reports" },
      ],
    },
    {
      name: "Procurement Management",
      path: "/dashboard/procurement",
      icon: <ProcurementManagementIcon />,
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
              name: "RFQ",
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
      link: [
        {
          name: "Overview",
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
          path: "/dashboard/hr/timesheet-management",
        },
        {
          name: "Leave Management",
          sublinks: [
            {
              name: "Apply",
              path: "/dashboard/hr/leave-management/request-leave",
            },
            {
              name: "Assign",
              path: "/dashboard/hr/leave-management/assign-leave",
            },
            {
              name: "Leave List",
              path: "/dashboard/hr/leave-management/leave-list",
            },
          ],
        },
        { name: "HR Reports", path: "/" },
      ],
    },
    {
      name: "C&G",
      icon: <CGIcon />,

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
              name: "Consultancy Acceptance",
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
    // {
    //   name: "Finance",
    //   icon: <FinanceIcon />,
    //   link: [
    //     {
    //       name: "Overview",
    //       sublinks: [
    //         {
    //           name: "Documents Submitted to be Reviewed",
    //           path: "/",
    //         },
    //         {
    //           name: "Documents Awaiting Payment Vouchers",
    //           path: "/",
    //         },
    //         {
    //           name: "Documents Awaiting Final Approval",
    //           path: "/",
    //         },
    //       ],
    //     },
    //     { name: "Employee Compensation & Benefits", path: "/" },
    //     { name: "Payment Requests", path: "/" },
    //     { name: "Payment Voucher", path: "/" },
    //     { name: "General Leger", path: "/" },
    //     { name: "Employee Compensation & Benefits", path: "/" },
    //     { name: "Time Sheet Management", path: "/" },
    //     { name: "Trial Balance", path: "/" },
    //     { name: "Audit", path: "/" },
    //     { name: "Budget", path: "/" },
    //     { name: "Petty Cash Request", path: "/" },
    //     { name: "Bank Reconciliation", path: "/" },
    //     { name: "Invoice", path: "/" },
    //   ],
    // },
  ];
};
