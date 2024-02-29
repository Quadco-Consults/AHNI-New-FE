import React, { useState } from "react";
import logoSvg from "assets/imgs/logo.png";
import { Link, NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { RouteEnum } from "constants/RouterConstants";

const Sidebar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedLinkIndex, setSelectedLinkIndex] = useState(null);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [selectedLinkSubIndex, setSelectedLinkSubIndex] = useState(null);

  return (
    <aside className="space-y-6 bg-background h-full">
      <div className="py-4 border-dashed border-b-2 border-black">
        <img src={logoSvg} alt="logo" width={140} className="pl-5" />
      </div>

      <div className="px-3">
        <button className="w-full">
          <NavLink
            to={RouteEnum.DASHBOARD}
            className={({ isActive }) => {
              return isActive
                ? "w-full bg-primary rounded-lg p-3 px gap-3 flex text-white justify-start hover:opacity-70"
                : "w-full bg-inherit rounded-lg p-3 px gap-3 flex text-grey-light justify-start hover:bg-primary hover:text-white";
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 1.83301H1.83333V7.33301H11V1.83301Z"
                fill="white"
                stroke="white"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
              <path
                d="M20.1667 1.83301H14.6667V10.9997H20.1667V1.83301Z"
                fill="white"
                stroke="white"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
              <path
                d="M20.1667 14.666H14.6667V20.166H20.1667V14.666Z"
                fill="white"
                stroke="white"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
              <path
                d="M11 11H1.83333V20.1667H11V11Z"
                fill="white"
                stroke="white"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
            </svg>

            <h4>Dashboard</h4>
          </NavLink>
        </button>

        <div className="mt-5">
          <h4 className="uppercase font-light py-3 text-grey-dark">
            DEPARTMENTAL HUB
          </h4>

          {DEPARTMENTAL_LINKS.map((link, index) => (
            <div key={index} className="w-full space-y-2 text-grey-light">
              <div
                onClick={() => {
                  setShowMenu(!showMenu);
                  setSelectedLinkIndex(index);
                }}
                className="flex w-full gap-3 p-2 justify-between  items-center hover:text-primary hover:cursor-pointer"
              >
                <div className="flex items-center gap-4 ">
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
                  <h4 className="font-medium">{link.name}</h4>
                </div>
                <ChevronDown
                  className="h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
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
                              className="h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
                              aria-hidden="true"
                            />
                          </div>
                        </li>

                        {showSubMenu && selectedLinkSubIndex === i && (
                          <ul>
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
          ))}
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
      { name: "Procurement Plan", path: RouteEnum.PRECUREMENT_PLAN },
      {
        name: "Procurement Plan Tracker",
        path: RouteEnum.PRECUREMENT_PLAN_TRACKER,
      },
      { name: "Report", path: RouteEnum.REPORT },
    ],
  },
  { name: "Programs" },
  { name: "Admin" },
  { name: "HR" },
  { name: "C&G" },
  { name: "Finance" },
];
