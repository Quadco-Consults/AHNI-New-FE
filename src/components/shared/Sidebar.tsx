/* eslint-disable react/prop-types */
import { useState } from "react";
import logoSvg from "assets/svgs/logo-bg.svg";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, User, VaultIcon } from "lucide-react";
import { RouteEnum, AdminRoutes } from "constants/RouterConstants";
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
import FinanceIcon from "components/icons/sidebar-icons/FinanceIcon";

type SidebarProps = {
  sidebarWidth: boolean;
  setSidebarWidth: any;
};
const Sidebar = ({ sidebarWidth, setSidebarWidth }: SidebarProps) => {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
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
              src={logoSvg}
              alt="logo"
              // width={50}
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

          <NavLink
            to={RouteEnum.DASHBOARD}
            className={({ isActive }) => {
              return isActive
                ? "bg-primary px dark:text-inherit flex w-full items-center justify-start gap-3 rounded-lg p-3 text-white hover:opacity-70"
                : "bg-inherit px hover:bg-primary flex w-full items-center justify-start gap-3 rounded-lg p-3 hover:text-white";
            }}
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
          </NavLink>

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

            <NavLink
              to={RouteEnum.PROJECTS}
              className={cn(
                "hover:text-primary flex w-full items-center justify-between gap-3 px-2 py-2 text-sm font-bold hover:cursor-pointer",
                location.pathname.startsWith(RouteEnum.PROJECTS) &&
                  "text-primary "
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
            </NavLink>

            {DEPARTMENTAL_LINKS.map((link: any, index: number) => (
              <div key={index} className="w-full ">
                <div
                  onClick={() => {
                    setShowMenu(!showMenu);
                    setSelectedLinkIndex(index);
                  }}
                  className={cn(
                    "hover:text-primary flex w-full items-center justify-between gap-3 px-2 py-2 text-sm font-bold hover:cursor-pointer",
                    location.pathname.startsWith(link.path) && "text-primary "
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
                              location.pathname.startsWith(el.path) &&
                                " text-amber-400 "
                            )}
                          >
                            <span
                              className={cn(
                                "bg-black hover:bg-amber-400 aspect-square w-2 truncate rounded-full border",
                                location.pathname.startsWith(el.path) &&
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
                            <NavLink
                              key={sublink.name}
                              to={sublink.path}
                              className={({ isActive }) => {
                                return isActive ? "text-amber-400" : "";
                              }}
                            >
                              <li className="py-2 ml-8 list-none hover:text-amber-400 hover:cursor-pointer">
                                {sublink.name}
                              </li>
                            </NavLink>
                          ))}
                        </motion.ul>
                      </div>
                    ) : (
                      <NavLink
                        key={i}
                        to={el.path}
                        className={({ isActive }) => {
                          return isActive ? "text-amber-400" : "";
                        }}
                      >
                        <li
                          className={cn(
                            "hover:text-amber-400 flex items-center justify-start gap-2 text-sm",
                            location.pathname.startsWith(el.path) &&
                              " text-amber-400 "
                          )}
                        >
                          <span
                            className={cn(
                              "bg-black hover:bg-amber-400 aspect-square w-2 rounded-full border",
                              location.pathname.startsWith(el.path) &&
                                " bg-amber-400 border-amber-400 hover:bg-amber-400"
                            )}
                          ></span>
                          <h6 className="py-2">{el.name}</h6>
                        </li>
                      </NavLink>
                    )
                  )}
                </motion.ul>
              </div>
            ))}
          </div>
          <div>
            <h4
              className={cn(
                "text-black/40 px-2 py-3 text-xs font-semibold uppercase duration-200",
                sidebarWidth === false ? "block" : "hidden"
              )}
            >
              SETTINGS
            </h4>
            <div>
              <NavLink
                to={RouteEnum.USERS}
                className={cn(
                  "hover:text-primary flex w-full items-center justify-between gap-3 px-2 py-2 text-sm font-bold hover:cursor-pointer",
                  location.pathname.startsWith(RouteEnum.PROJECTS) &&
                    "text-primary "
                )}
              >
                <div className="flex w-[85%] items-center gap-2">
                  <span className="">
                    <User />
                  </span>
                  <h4
                    className={cn(
                      " w-[100%] truncate font-medium",
                      sidebarWidth === false ? "block" : "hidden"
                    )}
                  >
                    Users
                  </h4>
                </div>
              </NavLink>
            </div>
            <div>
              <NavLink
                to={RouteEnum.AUTHORIZATION}
                className={cn(
                  "hover:text-primary flex w-full items-center justify-between gap-3 px-2 py-2 text-sm font-bold hover:cursor-pointer",
                  location.pathname.startsWith(RouteEnum.PROJECTS) &&
                    "text-primary "
                )}
              >
                <div className="flex w-[85%] items-center gap-2">
                  <span className="">
                    <VaultIcon />
                  </span>
                  <h4
                    className={cn(
                      " w-[100%] truncate font-medium",
                      sidebarWidth === false ? "block" : "hidden"
                    )}
                  >
                    Authorization
                  </h4>
                </div>
              </NavLink>
            </div>
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
          </div>
        </div>
      </section>
    </aside>
  );
};

export default Sidebar;

const DEPARTMENTAL_LINKS = [
  {
    name: "Programs",
    path: "/program",
    icon: <ProgramsIcon />,
    link: [
      {
        name: "Plans",
        path: "/program/plan",
        sublinks: [
          { name: "Work Plan", path: RouteEnum.PROGRAM_WORK_PLAN },
          { name: "Activity Plan", path: RouteEnum.PROGRAM_ACTIVITY },
          {
            name: "Risk Management Plan",
            path: RouteEnum.PROGRAM_RISK_MANAGEMENT,
          },
          // {
          //   name: "Value Management Plan",
          //   path: RouteEnum.PROGRAM_RISK_MANAGEMENT,
          // },
          {
            name: "Supportive Supervision Plan",
            path: RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION,
          },
        ],
      },
      {
        name: "Stakeholder Management",
        path: "/program/stakeholder-management",
        sublinks: [
          {
            name: "Analysis/Mapping",
            path: RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_ANALYSIS,
          },
          {
            name: "Stakeholder Register",
            path: RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_REGISTER,
          },
          {
            name: "Engagement Plan",
            path: RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_PLAN,
          },
        ],
      },
      { name: "Fund Request", path: RouteEnum.PROGRAM_FUND_REQUEST },
      { name: "Reports", path: RouteEnum.PROGRAM_REPORT },
    ],
  },
  {
    name: "Procurement Management",
    path: "/procurement-management",
    icon: <ProcurementManagementIcon />,
    link: [
      { name: "Overview", path: RouteEnum.OVERVIEW },
      {
        name: "Vendor Management",
        path: "/procurement-management/vendor-management",
        sublinks: [
          { name: "Prequalification", path: RouteEnum.VENDOR_MANAGEMENT },
          { name: "EOI", path: RouteEnum.EOI },
          // { name: "Vendor Selection", path: RouteEnum.EOI_VENDOR },
        ],
      },
      { name: "Supplier Database", path: RouteEnum.SUPPLIER_DATABASE },
      { name: "Price Intelligence", path: RouteEnum.PRICE_INTELLIGENCE },
      { name: "Procurement Plan", path: RouteEnum.PROCUREMENT_PLAN },
      { name: "Purchase Requests", path: RouteEnum.PURCHASE_REQUEST },
      {
        name: "Solicitation Management",
        path: "/procurement-management/solicitation",
        sublinks: [
          { name: "RFQ", path: RouteEnum.RFQ },
          // { name: "National Open Tender", path: RouteEnum.OPEN_TENDER },
          // { name: "Single-Sourcing", path: RouteEnum.SINGLE_SOURCING },
        ],
      },
      // {
      //   name: "Expression of Interest",
      //   sublinks: [
      //     { name: "EOI", path: RouteEnum.EOI },
      //     { name: "Vendor of Submission", path: RouteEnum.EOI_VENDOR },
      //   ],
      // },
      // {
      //   name: "RFQ Management",
      //   sublinks: [
      //     { name: "RFQ", path: RouteEnum.RFQ },
      //     { name: "Vendor of Submission", path: RouteEnum.RFQ_VENDOR },
      //   ],
      // },
      {
        name: "Submission of Bids",
        path: RouteEnum.SUBMISSION_OF_BIDS,
      },
      {
        name: "Competitive Bid Analysis",
        path: RouteEnum.COMPETITIVE_ANALYSIS,
        // sublinks: [
        //   { name: "CBA", path: RouteEnum.COMPETITIVE_ANALYSIS },
        //   { name: "Selection", path: RouteEnum.COMPETITIVE_SELECTION },
        // ],
      },
      { name: "Purchase Order", path: RouteEnum.PURCHASE_ORDER },
      { name: "Payment Request", path: RouteEnum.PAYMENT_REQUEST },

      {
        name: "Procurement Tracker",
        path: RouteEnum.PROCUREMENT_TRACKER,
      },
      { name: "Procurement Report", path: RouteEnum.REPORT },
    ],
  },
  {
    name: "Admin",
    icon: <AdminIcon />,
    link: [
      { name: "Overview", path: AdminRoutes.OVERVIEW },
      {
        name: "Inventory Management",
        path: "/admin/inventory-managment",
        sublinks: [
          { name: "Consumable", path: AdminRoutes.CONSUMABLES },
          { name: "Assets", path: AdminRoutes.ASSETS },
        ],
      },
      {
        name: "Fleet Management",
        path: "/admin/fleet-management",
        sublinks: [
          { name: "Vehicle request", path: AdminRoutes.VehicleRequest },
          {
            name: "Vehicle maintenance ticket",
            path: AdminRoutes.VehicleMaitenance,
          },
          {
            name: "Fuel consumption record",
            path: AdminRoutes.FuelConsumptions,
          },
        ],
      },
      {
        name: "Facility Management",
        sublinks: [
          { name: "Facilities", path: AdminRoutes.Facilities },
          {
            name: "Facility  Maintenance Ticket",
            path: AdminRoutes.FacilitiesTicket,
          },
        ],
      },
      { name: "Payment Request", path: AdminRoutes.PaymentRequest },
      {
        name: "Agreements",
        path: "/admin/agreements",
        sublinks: [
          { name: "Lease", path: AdminRoutes.Lease },
          { name: "SLA", path: AdminRoutes.SLA },
          { name: "HMO", path: AdminRoutes.HMO },
          { name: "Security", path: AdminRoutes.Security },
          { name: "Insurance", path: AdminRoutes.Insurance },
          { name: "Ticketing", path: AdminRoutes.Ticketing },
        ],
      },

      { name: "Report", path: "/" },
    ],
  },
  {
    name: "C&G",
    icon: <CGIcon />,

    link: [
      { name: "Overview", path: "/" },
      {
        name: "Grant Management",
        sublinks: [
          { name: "Grants", path: "/" },
          { name: "Subgrants", path: "/" },
        ],
      },
      {
        name: "Closeout",
        sublinks: [{ name: "Closeout Plan", path: "/" }],
      },
      {
        name: "Contract Management",
        sublinks: [
          { name: "Consultant management", path: "/" },
          { name: "Consultancy report", path: "/" },
          { name: "Payment request", path: "/" },
          { name: "Facilitator management", path: "/" },
          { name: "SLA", path: "/" },
        ],
      },
      { name: "C&G Reports", path: "/" },
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
            path: "/",
          },
          { name: "Workforce Database", path: "/" },
        ],
      },
      {
        name: "Recruitment",
        sublinks: [
          { name: "Advertisement", path: "/" },
          { name: "Selection", path: "/" },
          { name: "Onboarding", path: "/" },
        ],
      },
      {
        name: "Performance Management",
        sublinks: [
          { name: "Timesheet Management", path: "/" },
          { name: "Performance Appraisal", path: "/" },
        ],
      },
      { name: "Employee compensation & benefits", path: "/" },
      {
        name: "Separation Management",
        sublinks: [
          { name: "Voluntary Separation", path: "/" },
          { name: "End of Project", path: "/" },
          { name: "Dismissal", path: "/" },
          { name: "Exit", path: "/" },
          { name: "Evaluation", path: "/" },
          { name: "Feedback", path: "/" },
        ],
      },
      { name: "HR Reports", path: "/" },
    ],
  },
  {
    name: "Finance",
    icon: <FinanceIcon />,
    link: [
      {
        name: "Overview",
        sublinks: [
          {
            name: "Documents Submitted to be Reviewed",
            path: "/",
          },
          { name: "Documents Awaiting Payment Vouchers", path: "/" },
          { name: "Documents Awaiting Final Approval", path: "/" },
        ],
      },
      { name: "Employee Compensation & Benefits", path: "/" },
      { name: "Payment Requests", path: "/" },
      { name: "Payment Voucher", path: "/" },
      { name: "General Leger", path: "/" },
      { name: "Employee Compensation & Benefits", path: "/" },
      { name: "Time Sheet Management", path: "/" },
      { name: "Trial Balance", path: "/" },
      { name: "Audit", path: "/" },
      { name: "Budget", path: "/" },
      { name: "Petty Cash Request", path: "/" },
      { name: "Bank Reconciliation", path: "/" },
      { name: "Invoice", path: "/" },
    ],
  },
];

// const SETTINGS = [
//   {
//     name: "Users",
//     path: "/users",
//     icon: <User2 />,
//   },
// ];
