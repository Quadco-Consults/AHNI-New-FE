import React, { useState } from "react";
import logoSvg from "assets/imgs/logo.png";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { RouteEnum } from "constants/RouterConstants";
import { Icon } from "@iconify/react";
import { cn } from "lib/utils";
import { motion } from "framer-motion";
import IconButton from "./IconButton";

const Sidebar = ({ sidebarWidth, setSidebarWidth }) => {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [selectedLinkIndex, setSelectedLinkIndex] = useState(null);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [selectedLinkSubIndex, setSelectedLinkSubIndex] = useState(null);
  console.log(selectedLinkSubIndex);

  return (
    <aside
      className={cn(
        "fixed overflow-auto inset-0 max-h-screen z-[20] space-y-6 bg-background duration-200",
        sidebarWidth === false ? "w-[19%]" : "w-[5%]"
      )}
    >
      <div className="h-20 relative">
        <div
          className={cn(
            "fixed h-[75px] pt-4 border-dashed border-b-2 border-black z-20 bg-background duration-200",
            sidebarWidth === false ? "w-[19%]" : "w-[5%]"
          )}
        >
          <img src={logoSvg} alt="logo" width={125} className="pl-5" />
          <IconButton
            onClick={() => setSidebarWidth(!sidebarWidth)}
            className={cn(
              "absolute z-40 shadow-sm right-0 top-5 hover:text-primary",
              sidebarWidth && "duration-200 rotate-180"
            )}
          >
            <Icon icon="ph:arrow-left-duotone" fontSize={15} />
          </IconButton>
        </div>
      </div>

      <div className="px-3">
        <button className="w-full">
          <NavLink
            to={RouteEnum.DASHBOARD}
            className={({ isActive }) => {
              return isActive
                ? "w-full bg-primary rounded-lg p-3 px gap-3 flex text-white justify-start items-center hover:opacity-70 dark:text-inherit"
                : "w-full bg-inherit rounded-lg p-3 px gap-3 flex justify-start items-center hover:bg-primary hover:text-white";
            }}
          >
            <Icon icon="material-symbols:dashboard" fontSize={25} />

            <h4
              className={cn(
                "duration-200",
                sidebarWidth === false ? "block" : "hidden"
              )}
            >
              Dashboard
            </h4>
          </NavLink>
        </button>

        <div className="mt-5">
          <h4
            className={cn(
              "uppercase font-light py-3 px-2 text-xs text-grey-light duration-200",
              sidebarWidth === false ? "block" : "hidden"
            )}
          >
            DEPARTMENTAL HUB
          </h4>

          {DEPARTMENTAL_LINKS.map((link, index) => (
            <div key={index} className="w-full space-y-1">
              <div
                onClick={() => {
                  setShowMenu(!showMenu);
                  setSelectedLinkIndex(index);
                }}
                className={cn(
                  "flex w-full gap-3 px-2 py-2 justify-between items-center hover:text-primary hover:cursor-pointer",
                  location.pathname.startsWith(link.path) && "text-primary "
                )}
              >
                <div className="flex items-center gap-2 ">
                  {link.icon}
                  <h4
                    className={cn(
                      "font-medium",
                      sidebarWidth === false ? "block" : "hidden"
                    )}
                  >
                    {link.name}
                  </h4>
                </div>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition duration-200",
                    showMenu && selectedLinkIndex === index && "rotate-180"
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
                className="pl-14 list-disc h-0 overflow-hidden"
              >
                {link?.link?.map((el, i) =>
                  el?.sublinks ? (
                    <div key={i}>
                      <li className="list-disc hover:text-primary hover:cursor-pointer">
                        <div
                          onClick={() => {
                            setShowSubMenu(!showSubMenu);
                            setSelectedLinkSubIndex(i);
                          }}
                          className="flex items-center justify-between"
                        >
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
                        className="h-0 overflow-hidden"
                      >
                        {el?.sublinks?.map((sublink) => (
                          <NavLink
                            key={sublink.name}
                            to={sublink.path}
                            className={({ isActive }) => {
                              return isActive ? "text-primary" : "";
                            }}
                          >
                            <li className="list-disc py-2 ml-5 hover:text-primary hover:cursor-pointer">
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
                        return isActive ? "text-primary" : "";
                      }}
                    >
                      <li className="list-disc hover:text-primary hover:cursor-pointer">
                        <h6 className="py-2">{el.name}</h6>
                      </li>
                    </NavLink>
                  )
                )}
              </motion.ul>
            </div>
          ))}

          {/* {DEPARTMENTAL_LINKS.map((link, index) => (
            <div key={index} className="w-full space-y-1">
              <div
                onClick={() => {
                  setShowMenu(!showMenu);
                  setSelectedLinkIndex(index);
                }}
                className={cn(
                  "flex w-full gap-3 px-2 py-3 justify-between items-center hover:text-primary hover:cursor-pointer",
                  location.pathname.includes(link.path) && "text-primary "
                )}
              >
                <div className="flex items-center gap-4 ">
                  {link.icon}
                  <h4 className="font-medium">{link.name}</h4>
                </div>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition duration-200",
                    showMenu && selectedLinkIndex === index && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </div>

              {showMenu && selectedLinkIndex === index && (
                <ul className="pl-14 list-disc">
                  {link?.link?.map((el, i) =>
                    el?.sublinks ? (
                      <>
                        <li
                          className="list-disc hover:text-primary hover:cursor-pointer"
                          key={i}
                        >
                          <div
                            onClick={() => {
                              setShowSubMenu(!showSubMenu);
                              setSelectedLinkSubIndex(i);
                            }}
                            className="flex items-center justify-between"
                          >
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

                        {showSubMenu && selectedLinkSubIndex === i && (
                          <ul className=" duration-200">
                            {el?.sublinks?.map((sublink) => (
                              <NavLink
                                key={sublink.name}
                                to={sublink.path}
                                className={({ isActive }) => {
                                  return isActive ? "text-primary" : "";
                                }}
                              >
                                <li className="list-disc py-2 ml-3 hover:text-primary hover:cursor-pointer">
                                  {sublink.name}
                                </li>
                              </NavLink>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <NavLink
                        key={i}
                        to={el.path}
                        className={({ isActive }) => {
                          return isActive ? "text-primary" : "";
                        }}
                      >
                        <li className="list-disc hover:text-primary hover:cursor-pointer">
                          <h6 className="py-2">{el.name}</h6>
                        </li>
                      </NavLink>
                    )
                  )}
                </ul>
              )}
            </div>
          ))} */}
          {/* {DEPARTMENTAL_LINKS.map((link) => (
          <NavigationMenu key={link.name}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <div className="flex gap-3 items-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.5 17.5L6.5 14.5M11.5 17.5L11.5 8.5M16.5 17.5V13.5"
                        stroke="#667185"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M21.5 5.5C21.5 7.15685 20.1569 8.5 18.5 8.5C16.8431 8.5 15.5 7.15685 15.5 5.5C15.5 3.84315 16.8431 2.5 18.5 2.5C20.1569 2.5 21.5 3.84315 21.5 5.5Z"
                        stroke="#667185"
                        stroke-width="1.5"
                      />
                      <path
                        d="M21.4955 11C21.4955 11 21.5 11.3395 21.5 12C21.5 16.4784 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4784 2.5 12C2.5 7.52169 2.5 5.28252 3.89124 3.89127C5.28249 2.50003 7.52166 2.50003 12 2.50003L13 2.5"
                        stroke="#667185"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <h4>{link.name}</h4>
                  </div>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  {link?.link?.map((el, index) => (
                    <NavigationMenuLink key={index}>
                      <h4 className="py-1">{el.name}</h4>
                    </NavigationMenuLink>
                  ))}
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        ))} */}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

const DEPARTMENTAL_LINKS = [
  {
    name: "Procurement Management",
    path: "/procurement-management",
    icon: (
      <Icon icon="material-symbols-light:analytics-outline" fontSize={30} />
    ),
    link: [
      { name: "Overview", path: RouteEnum.OVERVIEW },
      {
        name: "Expression of interest",
        sublinks: [
          { name: "EOI List", path: RouteEnum.EOI },
          { name: "Vendor of Submission", path: RouteEnum.EOI_VENDOR },
        ],
      },
      {
        name: "RFQ Management",
        sublinks: [
          { name: "RFQ List", path: RouteEnum.RFQ },
          { name: "Vendor of Submission", path: RouteEnum.RFQ_VENDOR },
        ],
      },
      {
        name: "Competitive Bid Analysis",
        path: RouteEnum.COMPETITIVE_ANALYSIS,
      },
      { name: "Purchase Requests", path: RouteEnum.PURCHASE_REQUEST },
      { name: "Vendor Management", path: RouteEnum.VENDOR_MANAGEMENT },
      { name: "Payment Request", path: RouteEnum.PAYMENT_REQUEST },
      { name: "Procurement Plan", path: RouteEnum.PROCUREMENT_PLAN },
      {
        name: "Procurement Plan Tracker",
        path: RouteEnum.PROCUREMENT_PLAN_TRACKER,
      },
      { name: "Report", path: RouteEnum.REPORT },
    ],
  },
  {
    name: "Programs",
    path: "/program",
    icon: <Icon icon="fluent:notepad-28-regular" fontSize={25} />,
    link: [
      { name: "Overview", path: RouteEnum.PROGRAM_OVERVIEW },
      { name: "Work Plans", path: RouteEnum.WORK_PLAN },
      { name: "Work Plan Audit/Tracker", path: RouteEnum.WORK_PLAN_AUDIT },
      { name: "Donor Management", path: RouteEnum.DONOR_MANAGEMENT },
      { name: "Projects", path: RouteEnum.PROJECTS },
      { name: "Training and Procurement", path: RouteEnum.TRAINING },
      { name: "Payment Request", path: RouteEnum.PROGRAM_PAYMENT_REQUEST },
      { name: "Reports", path: RouteEnum.PROGRAM_REPORT },
    ],
  },
  {
    name: "Admin",
    icon: <Icon icon="solar:calculator-outline" fontSize={25} />,
  },
  {
    name: "HR",
    icon: <Icon icon="fluent:briefcase-28-regular" fontSize={25} />,
  },
  { name: "C&G", icon: <Icon icon="oui:timeline" fontSize={25} /> },
  {
    name: "Finance",
    icon: <Icon icon="healthicons:money-bag-outline" fontSize={25} />,
  },
];
