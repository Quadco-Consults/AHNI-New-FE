/* eslint-disable react/prop-types */

import { Moon, Sun } from "lucide-react";
import avatarPng from "assets/imgs/Image.png";
import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { useTheme } from "configs/theme-provider";
import { cn } from "lib/utils";

const Header = ({ sidebarWidth }) => {
  const { setTheme } = useTheme();
  return (
    <nav
      className={cn(
        "py-[17px] w-full fixed z-20 px-10 bg-background flex justify-end border-b shadow-sm",
        sidebarWidth === false ? "md:w-[81%]" : "md:w-[95%]"
      )}
    >
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
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

        <img src={avatarPng} alt="avatar" />
      </div>
    </nav>
  );
};

export default Header;
