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
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { Label } from "components/ui/label";
import { useLocation } from "react-router-dom";

const Header = ({ sidebarWidth }) => {
  const { setTheme } = useTheme();

  const { pathname } = useLocation();

  return (
    <nav
      className={cn(
        "py-[17px] w-full fixed z-20 px-10 bg-background flex justify-between border-b shadow-sm",
        sidebarWidth === false ? "md:w-[81%]" : "md:w-[95%]"
      )}
    >
      <div>
        <Label className="text-lg font-bold capitalize ">
          {pathname.split("/").at(-1).replaceAll("-", " ")}
        </Label>
      </div>
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

        <Avatar>
          <AvatarImage src={avatarPng} />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
};

export default Header;
