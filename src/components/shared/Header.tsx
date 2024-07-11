/* eslint-disable react/prop-types */
import { Moon, Sun } from "lucide-react";
import avatarPng from "assets/imgs/avatar.png";
import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { useTheme } from "configs/theme-provider";
import { cn } from "lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthRoutes } from "constants/RouterConstants";

const Header = ({ sidebarWidth }: { sidebarWidth: boolean }) => {
  const { setTheme } = useTheme();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  const logoutHandler = () => {
    localStorage.removeItem("persist:ahni");
    window.location.reload();
  };

  return (
    <nav
      className={cn(
        "py-[17px] w-full fixed z-20 px-10 bg-background flex items-center justify-between border-b shadow-sm",
        sidebarWidth === false ? "md:w-[81%]" : "md:w-[95%]"
      )}
    >
      <div className="capitalize font-bold text-xl">{pageTitle}</div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="bg-[#F9F9F9] dark:hover:text-primary dark:hover:bg-red-light dark:text-black"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Popover>
          <PopoverTrigger asChild>
            <Avatar>
              <AvatarImage src={avatarPng} />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="w-35 p-5">
            <Button
              onClick={logoutHandler}
              variant="secondary"
              className="w-full"
            >
              Logout
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
};

export default Header;

// Function to extract page title from URL
const getPageTitle = (pathname: string) => {
  const lastSegment = pathname.split("/").pop();
  return lastSegment?.replace(/-/g, " ");
};
