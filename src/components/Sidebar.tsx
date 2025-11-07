/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import logoSvg from "@/assets/svgs/logo-bg.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Icon } from "@iconify/react";
import { cn } from "lib/utils";
import { motion } from "framer-motion";
import IconButton from "./IconButton";

import DashboardIcon from "components/icons/sidebar-icons/DashboardIcon";
import ProjectsIcon from "components/icons/sidebar-icons/ProjectsIcon";

import { useGetUserProfile } from "@/features/auth/controllers/userController";
import { 
  departmentalLinks, 
  globalHubLinks, 
  moduleLinks,
  globalHubCategories,
  SidebarItem 
} from "@/utils/sidebarItems";
import { 
  filterSidebarByPermissions,
  filterGlobalHubByPermissions,
  groupGlobalHubByCategory,
  hasGlobalHubAccess
} from "@/utils/sidebarPermissions";

type SidebarProps = {
  sidebarWidth: boolean;
  setSidebarWidth: any;
};

const Sidebar = ({ sidebarWidth, setSidebarWidth }: SidebarProps) => {
  const { data: user } = useGetUserProfile();
  const permissions = user?.data.permissions || [];
  const pathname = usePathname();

  // State for collapsible sections
  const [selectedLinkIndex, setSelectedLinkIndex] = useState<null | number>(null);
  const [showDepartmentalMenu, setShowDepartmentalMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [selectedSubIndex, setSelectedSubIndex] = useState<null | number>(null);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showGlobalHubMenu, setShowGlobalHubMenu] = useState(false);
  const [selectedGlobalHubCategory, setSelectedGlobalHubCategory] = useState<string | null>(null);

  // Filter sidebar items based on permissions - memoized for performance
  const filteredDepartmentalLinks = useMemo(
    () => filterSidebarByPermissions(departmentalLinks, permissions),
    [permissions]
  );

  const filteredModuleLinks = useMemo(
    () => filterSidebarByPermissions(moduleLinks, permissions),
    [permissions]
  );

  const filteredGlobalHubItems = useMemo(
    () => filterGlobalHubByPermissions(globalHubLinks, permissions),
    [permissions]
  );

  const groupedGlobalHubMenu = useMemo(
    () => groupGlobalHubByCategory(filteredGlobalHubItems, globalHubCategories),
    [filteredGlobalHubItems]
  );

  const userHasGlobalHubAccess = useMemo(
    () => hasGlobalHubAccess(permissions),
    [permissions]
  );

  // Render nested sidebar items recursively
  const renderSidebarItem = (
    item: SidebarItem,
    index: number,
    isSubItem: boolean = false,
    level: number = 0
  ) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = item.path && pathname?.startsWith(item.path);
    const paddingLeft = level === 0 ? "pl-2" : level === 1 ? "pl-14" : "pl-20";

    return (
      <div key={index} className="w-full">
        {/* Item header/link */}
        <div
          onClick={() => {
            if (hasChildren) {
              if (level === 0) {
                setShowDepartmentalMenu(!showDepartmentalMenu);
                setSelectedLinkIndex(index);
              } else {
                setShowSubMenu(!showSubMenu);
                setSelectedSubIndex(index);
              }
            }
          }}
          className={cn(
            "flex w-full items-center justify-between gap-3 py-2 text-sm font-bold hover:cursor-pointer",
            paddingLeft,
            isActive && "text-primary",
            !isActive && "hover:text-primary"
          )}
        >
          {item.path && !hasChildren ? (
            <Link href={item.path} className="flex w-full items-center justify-between gap-3">
              <div className="flex w-[85%] items-center gap-2">
                {item.icon && <span>{item.icon}</span>}
                <h4
                  className={cn(
                    "w-[100%] truncate font-medium",
                    sidebarWidth === false ? "block" : "hidden"
                  )}
                >
                  {item.name}
                </h4>
              </div>
            </Link>
          ) : (
            <>
              <div className="flex w-[85%] items-center gap-2">
                {!isSubItem && item.icon && <span>{item.icon}</span>}
                {isSubItem && (
                  <span
                    className={cn(
                      "aspect-square w-2 rounded-full border",
                      isActive 
                        ? "bg-amber-400 border-amber-400" 
                        : "bg-black hover:bg-amber-400"
                    )}
                  ></span>
                )}
                <h4
                  className={cn(
                    "w-[100%] truncate font-medium",
                    sidebarWidth === false ? "block" : "hidden",
                    isSubItem && isActive && "text-amber-400"
                  )}
                >
                  {item.name}
                </h4>
              </div>
              {hasChildren && (
                <ChevronDown
                  className={cn(
                    "h-5 w-5 -rotate-90 transition duration-200",
                    level === 0 && showDepartmentalMenu && selectedLinkIndex === index && "rotate-0",
                    level === 1 && showSubMenu && selectedSubIndex === index && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              )}
            </>
          )}
        </div>

        {/* Children */}
        {hasChildren && (
          <motion.ul
            animate={
              (level === 0 && showDepartmentalMenu && selectedLinkIndex === index) ||
              (level === 1 && showSubMenu && selectedSubIndex === index)
                ? { height: "fit-content" }
                : { height: 0 }
            }
            className="h-0 overflow-hidden list-none"
          >
            {item.children!.map((child, childIndex) =>
              renderSidebarItem(child, childIndex, true, level + 1)
            )}
          </motion.ul>
        )}
      </div>
    );
  };

  // Render settings items (similar logic)
  const renderSettingsItem = (item: SidebarItem, index: number) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = item.path && pathname?.startsWith(item.path);

    return (
      <div key={index} className="w-full">
        <div
          onClick={() => {
            if (hasChildren) {
              setShowSettingsMenu(!showSettingsMenu);
              setSelectedLinkIndex(index);
            }
          }}
          className={cn(
            "hover:text-primary flex w-full items-center justify-between gap-3 px-2 py-2 text-sm font-bold hover:cursor-pointer",
            isActive && "text-primary"
          )}
        >
          {item.path && !hasChildren ? (
            <Link href={item.path} className="flex w-full items-center justify-between gap-3">
              <div className="flex w-[85%] items-center gap-2">
                <span>{item.icon}</span>
                <h4
                  className={cn(
                    "w-[100%] truncate font-medium",
                    sidebarWidth === false ? "block" : "hidden"
                  )}
                >
                  {item.name}
                </h4>
              </div>
            </Link>
          ) : (
            <>
              <div className="flex w-[85%] items-center gap-2">
                <span>{item.icon}</span>
                <h4
                  className={cn(
                    "w-[100%] truncate font-medium",
                    sidebarWidth === false ? "block" : "hidden"
                  )}
                >
                  {item.name}
                </h4>
              </div>
              {hasChildren && (
                <ChevronDown
                  className={cn(
                    "h-5 w-5 -rotate-90 transition duration-200",
                    showSettingsMenu && selectedLinkIndex === index && "rotate-0"
                  )}
                  aria-hidden="true"
                />
              )}
            </>
          )}
        </div>

        {hasChildren && (
          <motion.ul
            animate={
              showSettingsMenu && selectedLinkIndex === index
                ? { height: "fit-content" }
                : { height: 0 }
            }
            className="h-0 overflow-hidden list-none pl-14"
          >
            {item.children!.map((child, childIndex) => (
              <Link
                key={childIndex}
                href={child.path || "#"}
                className={cn(
                  "",
                  child.path && pathname?.startsWith(child.path) && "text-amber-400"
                )}
              >
                <li
                  className={cn(
                    "hover:text-amber-400 flex items-center justify-start gap-2 text-sm",
                    child.path && pathname?.startsWith(child.path) && "text-amber-400"
                  )}
                >
                  <span
                    className={cn(
                      "bg-black hover:bg-amber-400 aspect-square w-2 rounded-full border",
                      child.path &&
                        pathname?.startsWith(child.path) &&
                        "bg-amber-400 border-amber-400 hover:bg-amber-400"
                    )}
                  ></span>
                  <h6 className="py-2">{child.name}</h6>
                </li>
              </Link>
            ))}
          </motion.ul>
        )}
      </div>
    );
  };

  return (
    <aside
      className={cn(
        "bg-background fixed inset-0 z-[20] min-h-screen overflow-auto pb-[4rem] duration-200",
        sidebarWidth === false ? "w-[19%]" : "w-[5%]"
      )}
    >
      <section className="flex flex-col w-full gap-2">
        {/* Logo and collapse button */}
        <div className="relative h-[5rem] overflow-hidden">
          <div
            className={cn(
              "bg-background z-20 mx-auto duration-200",
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
          {/* Dashboard button - always visible */}
          <Link
            href="/dashboard"
            className={cn(
              "flex w-full items-center justify-start gap-3 rounded-lg p-3",
              pathname === "/dashboard"
                ? "bg-primary text-white hover:opacity-70"
                : "bg-inherit hover:bg-primary hover:text-white"
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

          {/* Departmental Hub */}
          {filteredDepartmentalLinks.length > 0 && (
            <div>
              <h4
                className={cn(
                  "text-black/40 px-2 py-3 text-xs font-semibold uppercase duration-200",
                  sidebarWidth === false ? "block" : "hidden"
                )}
              >
                DEPARTMENTAL HUB
              </h4>

              {/* Projects - always show if user is authenticated */}
              <Link
                href="/dashboard/projects"
                className={cn(
                  "hover:text-primary flex w-full items-center justify-between gap-3 px-2 py-2 text-sm font-bold hover:cursor-pointer",
                  pathname?.startsWith("/dashboard/projects") && "text-primary"
                )}
              >
                <div className="flex w-[85%] items-center gap-2">
                  <ProjectsIcon />
                  <h4
                    className={cn(
                      "w-[100%] truncate font-medium",
                      sidebarWidth === false ? "block" : "hidden"
                    )}
                  >
                    Projects
                  </h4>
                </div>
              </Link>

              {/* Filtered departmental links */}
              {filteredDepartmentalLinks.map((link, index) =>
                renderSidebarItem(link, index)
              )}
            </div>
          )}

          {/* Settings/Modules */}
          {filteredModuleLinks.length > 0 && (
            <div>
              <h4
                className={cn(
                  "text-black/40 px-2 py-3 text-xs font-semibold uppercase duration-200",
                  sidebarWidth === false ? "block" : "hidden"
                )}
              >
                SETTINGS
              </h4>

              {filteredModuleLinks.map((link, index) =>
                renderSettingsItem(link, index)
              )}

              {/* Audit Log - check permissions */}
              <Link
                href="/dashboard/audit-log"
                className={cn(
                  "hover:text-primary flex w-full items-center justify-between gap-3 px-2 py-2 text-sm font-bold hover:cursor-pointer",
                  pathname?.startsWith("/dashboard/audit-log") && "text-primary"
                )}
              >
                <div className="flex w-[85%] items-center gap-2">
                  <ProjectsIcon />
                  <h4
                    className={cn(
                      "w-[100%] truncate font-medium",
                      sidebarWidth === false ? "block" : "hidden"
                    )}
                  >
                    Audit Log
                  </h4>
                </div>
              </Link>
            </div>
          )}

          {/* Global Hub - only show if user has access */}
          {userHasGlobalHubAccess && groupedGlobalHubMenu.length > 0 && (
            <div>
              <h4
                className={cn(
                  "text-black/40 px-2 py-3 text-xs font-semibold uppercase duration-200",
                  sidebarWidth === false ? "block" : "hidden"
                )}
              >
                GLOBAL HUB
              </h4>

              <div className="space-y-1">
                {groupedGlobalHubMenu.map((category) => (
                  <div key={category.category}>
                    {/* Category Header */}
                    <div
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer",
                        "text-gray-700 hover:bg-primary/5 hover:text-primary dark:text-gray-300 dark:hover:bg-primary/10"
                      )}
                      onClick={() => {
                        if (
                          selectedGlobalHubCategory === category.category &&
                          showGlobalHubMenu
                        ) {
                          setShowGlobalHubMenu(false);
                          setSelectedGlobalHubCategory(null);
                        } else {
                          setShowGlobalHubMenu(true);
                          setSelectedGlobalHubCategory(category.category);
                        }
                      }}
                    >
                      <div className="flex w-full items-center gap-3">
                        <span className="flex-shrink-0">{category.icon}</span>
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
                          showGlobalHubMenu &&
                            selectedGlobalHubCategory === category.category &&
                            "rotate-0"
                        )}
                        aria-hidden="true"
                      />
                    </div>

                    {/* Category Items */}
                    <motion.ul
                      animate={
                        showGlobalHubMenu &&
                        selectedGlobalHubCategory === category.category
                          ? { height: "auto", opacity: 1 }
                          : { height: 0, opacity: 0 }
                      }
                      className="overflow-hidden"
                    >
                      <div className="space-y-1 pl-6 pt-1">
                        {category.items.map((item, itemIndex) => {
                          const isActive =
                            item.path && pathname?.startsWith(item.path);
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
          )}
        </div>
      </section>
    </aside>
  );
};

export default Sidebar;