/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, Settings, User, LogOut, Building2, Menu, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { VendorAuthUtils, useVendorLogout } from "@/features/vendor-portal/controllers/vendorAuthController";
import { logoutStateManager } from "@/utils/errorHandlers";

type VendorHeaderProps = {
  sidebarWidth: boolean;
};

const VendorHeader = ({ sidebarWidth }: VendorHeaderProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [vendorInfo, setVendorInfo] = useState<any>(null);

  // Use the proper vendor logout hook with API call
  const { mutate: logout, isPending: isLoggingOut } = useVendorLogout();

  useEffect(() => {
    // Get vendor info from localStorage or token
    const vendorData = VendorAuthUtils.getVendorData();
    setVendorInfo(vendorData);
  }, []);

  const handleLogout = () => {
    // Set logout state to suppress authentication toasts
    logoutStateManager.setLoggingOut(true);

    logout(undefined, {
      onSuccess: () => {
        console.log('✅ Vendor logout successful');
        router.push('/vendor-portal/login');
      },
      onError: (error) => {
        console.error('❌ Vendor logout error:', error);
        // Still redirect even if API call fails
        router.push('/vendor-portal/login');
      },
      onSettled: () => {
        // Reset logout state after a delay to allow any pending requests to complete
        setTimeout(() => {
          logoutStateManager.setLoggingOut(false);
        }, 2000);
      }
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/vendor-portal/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className={cn(
        "flex items-center justify-between h-16 px-4 transition-all duration-300",
        sidebarWidth ? "lg:ml-16" : "lg:ml-64"
      )}>

        {/* Mobile menu button (only visible on mobile) */}
        <div className="flex items-center lg:hidden">
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Page title and breadcrumb area */}
        <div className="flex items-center space-x-4 flex-1">
          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold text-gray-900">
              Vendor Portal
            </h1>
            <div className="text-sm text-gray-500 flex items-center space-x-1">
              <Building2 className="w-3 h-3" />
              <span>{vendorInfo?.company_name || 'Vendor Dashboard'}</span>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md ml-8 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search RFQs, orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={cn(
                  "pl-10 pr-4 transition-all duration-200",
                  isSearchFocused ? "ring-2 ring-primary/20 border-primary" : ""
                )}
              />
            </form>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-3">

          {/* Help button */}
          <Button
            variant="ghost"
            size="sm"
            className="p-2 relative"
            onClick={() => router.push('/vendor-portal/support')}
          >
            <HelpCircle className="w-5 h-5 text-gray-500" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2 relative">
                <Bell className="w-5 h-5 text-gray-500" />
                {/* Notification badge */}
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <Badge variant="secondary" className="text-xs">3 New</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem className="flex-col items-start space-y-1 py-3">
                <div className="font-medium text-sm">New RFQ Available</div>
                <div className="text-xs text-gray-500">Medical Equipment Procurement - Closes in 5 days</div>
                <div className="text-xs text-gray-400">2 hours ago</div>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex-col items-start space-y-1 py-3">
                <div className="font-medium text-sm">Bid Evaluation Complete</div>
                <div className="text-xs text-gray-500">Your submission for RFQ-2024-001 has been evaluated</div>
                <div className="text-xs text-gray-400">1 day ago</div>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex-col items-start space-y-1 py-3">
                <div className="font-medium text-sm">Profile Update Required</div>
                <div className="text-xs text-gray-500">Please update your tax clearance certificate</div>
                <div className="text-xs text-gray-400">3 days ago</div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/vendor-portal/notifications')}>
                View All Notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 px-3 py-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {vendorInfo?.company_name?.charAt(0) || 'V'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {vendorInfo?.company_name || 'Vendor'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {vendorInfo?.email || 'vendor@company.com'}
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{vendorInfo?.company_name || 'Vendor Company'}</p>
                  <p className="text-xs text-gray-500">{vendorInfo?.email || 'vendor@company.com'}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => router.push('/vendor-portal/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Company Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => router.push('/vendor-portal/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => router.push('/vendor-portal/support')}>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Support Center</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default VendorHeader;