/* eslint-disable react/prop-types */
import React from "react";
import Card from "components/Card";
import { cn } from "lib/utils";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Checkbox } from "components/ui/checkbox";
import { Switch } from "components/ui/switch";
import { Label } from "components/ui/label";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import logoPng from "@/assets/svgs/logo-bg.svg";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Progress } from "components/ui/progress";
import DataTable from "components/DataTable";
import {
    dashboardColumns,
} from "./dashboard-columns";
import { useGetUserProfile } from "features/auth/controllers/userController";
import { useGetNotifications, TNotification, useMarkNotificationAsRead } from "features/notifications/controllers/notificationController";
import { useAuth } from "hooks/useAuth";
import { useRouter } from "next/navigation";
import { useGetAllProjects } from "features/projects/controllers/projectController";
import { formatNumberCurrency } from "utils/utls";

// Helper function to get notification icon based on priority/category
const getNotificationIcon = (notification: TNotification) => {
    // Default icon SVG based on priority or module type
    const defaultIcon = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.3"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
    );

    return defaultIcon;
};

// Helper function to get styling based on notification priority
const getNotificationStyling = (notification: TNotification) => {
    const priority = notification.priority || 'medium';
    
    switch (priority) {
        case 'urgent':
            return {
                backgroundColor: "bg-red-50",
                textColor: "text-red-600",
                indicatorColor: "bg-red-500"
            };
        case 'high':
            return {
                backgroundColor: "bg-orange-50",
                textColor: "text-orange-600", 
                indicatorColor: "bg-orange-500"
            };
        case 'medium':
            return {
                backgroundColor: "bg-yellow-50",
                textColor: "text-yellow-600",
                indicatorColor: "bg-yellow-500"
            };
        case 'low':
            return {
                backgroundColor: "bg-green-50",
                textColor: "text-green-600",
                indicatorColor: "bg-green-500"
            };
        default:
            return {
                backgroundColor: "bg-gray-50",
                textColor: "text-gray-600",
                indicatorColor: "bg-gray-500"
            };
    }
};

// Helper function to format time since creation
const getTimeSinceCreation = (createdDateTime: string): string => {
    const now = new Date();
    const created = new Date(createdDateTime);
    const diffInMs = now.getTime() - created.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
        return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
    } else if (diffInHours > 0) {
        return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
    } else {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes} minutes ago`;
    }
};

// Sample data for display while fixing API issues - moved outside component to avoid re-renders
const sampleProjectData = [
    {
        ref: { name: "Health Education Initiative", desc: "Community health awareness program focused on preventive care and nutrition education" },
        amount: 2500000,
        date: "15 Jan 2024",
        status: "In Progress",
        progress: 75,
        manager_initials: ["AO", "MK"],
        project_id: "AHNI-2024-001",
        currency: "NGN",
        funding_sources: "World Health Organization",
        start_date: "2024-01-01",
        end_date: "2024-06-30",
    },
    {
        ref: { name: "Maternal Care Program", desc: "Improving maternal health services and reducing infant mortality rates" },
        amount: 3200000,
        date: "22 Feb 2024",
        status: "Active",
        progress: 60,
        manager_initials: ["FJ", "NK"],
        project_id: "AHNI-2024-002",
        currency: "NGN",
        funding_sources: "UNICEF, Gates Foundation",
        start_date: "2024-02-01",
        end_date: "2024-08-31",
    },
    {
        ref: { name: "Nutrition Monitoring System", desc: "Digital platform for tracking nutritional indicators across communities" },
        amount: 1800000,
        date: "10 Mar 2024",
        status: "Planning",
        progress: 25,
        manager_initials: ["SA", "BO"],
        project_id: "AHNI-2024-003",
        currency: "NGN",
        funding_sources: "EU Development Fund",
        start_date: "2024-03-01",
        end_date: "2024-09-30",
    },
    {
        ref: { name: "Rural Health Clinics", desc: "Establishing mobile health clinics in underserved rural areas" },
        amount: 4500000,
        date: "05 Apr 2024",
        status: "Approved",
        progress: 40,
        manager_initials: ["OT", "EW"],
        project_id: "AHNI-2024-004",
        currency: "NGN",
        funding_sources: "African Development Bank",
        start_date: "2024-04-01",
        end_date: "2024-12-31",
    },
    {
        ref: { name: "Disease Surveillance Network", desc: "Early warning system for infectious disease outbreaks" },
        amount: 2100000,
        date: "18 May 2024",
        status: "Completed",
        progress: 100,
        manager_initials: ["IC", "LM"],
        project_id: "AHNI-2024-005",
        currency: "NGN",
        funding_sources: "CDC, WHO",
        start_date: "2023-12-01",
        end_date: "2024-05-31",
    }
];

export default function Dashboard() {
    const { data: user } = useGetUserProfile();
    const { isLoggedIn } = useAuth();
    const router = useRouter();
    const { mutate: markAsRead } = useMarkNotificationAsRead();
    
    // Fetch real notifications - limit to 6 for dashboard display
    const { data: notificationsData, isLoading: notificationsLoading } = useGetNotifications({ 
        size: 6, 
        enabled: isLoggedIn 
    });

    // Fetch real project data - use same pattern as notifications (which work)
    const { data: projectsData, isLoading: projectsLoading, error: projectsError } = useGetAllProjects({
        page: 1,
        size: 100, // Match the API debug call that shows 22 projects
        search: "",
        has_fund_requests: undefined, // Don't filter by funding requests
        enabled: isLoggedIn  // Use same pattern as notifications
    });

    // Debug logging to understand what's happening
    React.useEffect(() => {
        console.log("🔍 Dashboard Debug Info:");
        console.log("- Current URL:", window.location.href);
        console.log("- Is logged in:", isLoggedIn);
        console.log("- Projects loading:", projectsLoading);
        console.log("- Projects data:", projectsData);
        console.log("- Projects error:", projectsError);
        console.log("- Projects results:", projectsData?.results);
        console.log("- Projects results length:", projectsData?.results?.length);
        if (projectsData?.results && projectsData.results.length > 0) {
            console.log("- First project:", projectsData.results[0]);
            console.log("- First project funding sources:", projectsData.results[0].funding_sources);
        }
        
        // Test API endpoint directly
        console.log("🔍 Testing API endpoint directly...");
        
        // Let's also test if we can access the projects page data directly
        const token = localStorage.getItem("token");
        console.log("🔍 Auth token:", token ? "Present" : "Missing");
        
        fetch('https://ahni-erp-029252c2fbb9.herokuapp.com/api/v1/projects/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
        })
        .then(response => {
            console.log("🔍 Direct API Response Status:", response.status);
            console.log("🔍 Direct API Response Headers:", response.headers);
            return response.json();
        })
        .then(data => {
            console.log("🔍 Direct API Response Data:", data);
        })
        .catch(error => {
            console.log("🔍 Direct API Error:", error);
        });
        
    }, [projectsData, projectsLoading, projectsError, isLoggedIn]);

    // Transform project data to match dashboard table format
    const transformedProjectData = React.useMemo(() => {
        console.log("🔄 Transform Data - Raw projects data:", projectsData);
        console.log("🔄 Transform Data - Results array:", projectsData?.results);
        console.log("🔄 Transform Data - Results length:", projectsData?.results?.length);
        
        // Use sample data if no real data is available
        if (!projectsData?.results || projectsData.results.length === 0) {
            console.log("🚨 No projects data available, using sample data");
            return sampleProjectData;
        }
        
        return projectsData.results.map((project, index) => {
            console.log(`🔄 Transforming project ${index + 1}:`, {
                title: project.title, // API uses 'title' not 'name'
                id: project.id,
                budget: project.budget,
                funding_sources: project.funding_sources,
                status: project.status
            });
            
            // Get funding source names for display
            const fundingSourceNames = project.funding_sources?.map(source => source.name).join(", ") || "No funding sources";
            
            // Calculate status based on project dates and status
            const getProjectStatus = () => {
                const now = new Date();
                const endDate = new Date(project.end_date);
                const startDate = new Date(project.start_date);
                
                if (project.status) {
                    return project.status;
                } else if (now > endDate) {
                    return "Completed";
                } else if (now < startDate) {
                    return "Pending";
                } else {
                    return "In Progress";
                }
            };

            // Calculate project progress based on dates
            const calculateProgress = () => {
                if (!project.start_date || !project.end_date) return 50; // Default if no dates
                
                const now = new Date();
                const start = new Date(project.start_date);
                const end = new Date(project.end_date);
                
                if (now < start) return 0; // Not started
                if (now > end) return 100; // Completed
                
                const totalDuration = end.getTime() - start.getTime();
                const elapsed = now.getTime() - start.getTime();
                
                return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
            };

            // Get project manager initials
            const getProjectManagerInitials = () => {
                if (!project.project_managers || project.project_managers.length === 0) {
                    return ["PM"]; // Default initials
                }
                
                return project.project_managers.slice(0, 3).map(manager => {
                    const firstName = manager.first_name || "";
                    const lastName = manager.last_name || "";
                    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "PM";
                });
            };

            const transformedProject = {
                ref: { 
                    name: project.title || project.project_id, 
                    desc: project.goal || project.narrative || "No description available" 
                },
                amount: parseFloat(project.budget) || 0,
                date: new Date(project.created_datetime).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short', 
                    year: 'numeric'
                }),
                status: getProjectStatus(),
                progress: Math.round(calculateProgress()),
                manager_initials: getProjectManagerInitials(),
                // Additional data that might be useful
                project_id: project.id,
                currency: project.currency,
                funding_sources: fundingSourceNames,
                start_date: project.start_date,
                end_date: project.end_date,
            };
            
            console.log(`✅ Transformed project ${index + 1}:`, transformedProject);
            return transformedProject;
        });
    }, [projectsData]);

    // Calculate pie chart data from projects (real or sample)
    const pieData = React.useMemo(() => {
        const dataToUse = transformedProjectData.length > 0 ? transformedProjectData : sampleProjectData;
        
        if (dataToUse.length === 0) {
            return [
                { name: "No Projects", value: 100, color: "#E5E5E5" }
            ];
        }
        
        // Group projects by funding source
        const fundingSourceMap = new Map();
        
        dataToUse.forEach(project => {
            // Handle different data structures (API vs sample data)
            const fundingSources = project.funding_sources || [];
            const budget = project.amount || parseFloat(project.budget) || 0;
            
            if (typeof fundingSources === 'string') {
                // Sample data format: "WHO, UNICEF"
                const sources = fundingSources.split(',').map(s => s.trim());
                const budgetPerSource = budget / sources.length;
                sources.forEach(source => {
                    const currentValue = fundingSourceMap.get(source) || 0;
                    fundingSourceMap.set(source, currentValue + budgetPerSource);
                });
            } else if (Array.isArray(fundingSources) && fundingSources.length > 0) {
                // API data format: array of objects
                const budgetPerSource = budget / fundingSources.length;
                fundingSources.forEach(source => {
                    const sourceName = source.name || source;
                    const currentValue = fundingSourceMap.get(sourceName) || 0;
                    fundingSourceMap.set(sourceName, currentValue + budgetPerSource);
                });
            } else {
                // No funding source specified
                const currentValue = fundingSourceMap.get("Other") || 0;
                fundingSourceMap.set("Other", currentValue + budget);
            }
        });
        
        // Convert to pie chart format
        const pieEntries = Array.from(fundingSourceMap.entries()).map(([name, value], index) => ({
            name,
            value,
            color: COLORS[index % COLORS.length]
        }));
        
        return pieEntries.length > 0 ? pieEntries : [{ name: "No Data", value: 100, color: "#E5E5E5" }];
    }, [transformedProjectData]);

    // Handle notification click - same logic as header dropdown
    const handleNotificationClick = (notification: TNotification) => {
        // Mark as read if unread
        const isUnread = !notification.is_read || notification.status === "Pending";
        if (isUnread) {
            markAsRead(notification.id);
        }

        // Navigate to relevant module
        const routes: { [key: string]: string } = {
            'Project': '/dashboard/projects',
            'ExpenseAuthorization': '/dashboard/admin/expense-authorization',
            'Agreement': '/dashboard/c-and-g/agreements',
            'User': '/account',
            'ProcurementPlan': '/dashboard/procurement/procurement-plan',
            'PurchaseOrder': '/dashboard/procurement/purchase-order',
            'VehicleRequest': '/dashboard/admin/fleet-management/vehicle-request',
            'FuelRequest': '/dashboard/admin/fleet-management/fuel-request',
            'PaymentRequest': '/dashboard/admin/payment-request',
            'AssetMaintenance': '/dashboard/admin/asset-maintenance',
            'TravelExpenseReport': '/dashboard/admin/travel-expenses-report',
            'ConsultancyReport': '/dashboard/c-and-g/consultancy-report',
            'ContractRequest': '/dashboard/c-and-g/contract-request'
        };

        const route = routes[notification.module_type] || '/dashboard';
        router.push(route);
    };

    return (
        <div className="space-y-10">
            <h4 className="font-bold text-lg">Dashboard</h4>

            <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
                <Card className="space-y-5">
                    <div className="flex justify-between">
                        <h4 className="font-bold text-base">Notifications</h4>
                        <div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button size="icon" variant="ghost">
                                        <svg
                                            width="21"
                                            height="20"
                                            viewBox="0 0 21 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g opacity="0.3">
                                                <path
                                                    d="M13.8107 1.8934H16.1723C16.8061 1.8934 17.3486 2.10979 17.8 2.54257C18.2496 2.97535 18.4744 3.50664 18.4744 4.13646V6.4191C18.4744 7.03836 18.2496 7.56701 17.8 8.00507C17.3486 8.44488 16.8061 8.66479 16.1723 8.66479H13.8107C13.1751 8.66479 12.6325 8.44488 12.1829 8.00507C11.7316 7.56701 11.5059 7.03836 11.5059 6.4191V4.13646C11.5059 3.50664 11.7316 2.97535 12.1829 2.54257C12.6325 2.10979 13.1751 1.8934 13.8107 1.8934Z"
                                                    fill="#FD4A36"
                                                />
                                            </g>
                                            <g opacity="0.3">
                                                <path
                                                    d="M4.51497 10.929H6.87664C7.5122 10.929 8.05477 11.1489 8.50435 11.5887C8.95574 12.0267 9.18143 12.5554 9.18143 13.1746V15.4573C9.18143 16.0871 8.95574 16.6184 8.50435 17.0512C8.05477 17.484 7.5122 17.7003 6.87664 17.7003H4.51497C3.88122 17.7003 3.33865 17.484 2.88727 17.0512C2.43768 16.6184 2.21289 16.0871 2.21289 15.4573V13.1746C2.21289 12.5554 2.43768 12.0267 2.88727 11.5887C3.33865 11.1489 3.88122 10.929 4.51497 10.929Z"
                                                    fill="#FD4A36"
                                                />
                                            </g>
                                            <path
                                                d="M13.8107 10.9474H16.1723C16.8061 10.9474 17.3486 11.1673 17.8 11.6071C18.2496 12.0452 18.4744 12.5739 18.4744 13.1931V15.4942C18.4744 16.1117 18.2496 16.6404 17.8 17.0802C17.3486 17.5183 16.8061 17.7373 16.1723 17.7373H13.8107C13.1751 17.7373 12.6325 17.5183 12.1829 17.0802C11.7316 16.6404 11.5059 16.1117 11.5059 15.4942V13.1931C11.5059 12.5739 11.7316 12.0452 12.1829 11.6071C12.6325 11.1673 13.1751 10.9474 13.8107 10.9474Z"
                                                fill="#FD4A36"
                                            />
                                            <path
                                                d="M4.51497 1.85645H6.87664C7.5122 1.85645 8.05477 2.07547 8.50435 2.51353C8.95574 2.95334 9.18143 3.482 9.18143 4.0995V6.40061C9.18143 7.01987 8.95574 7.54853 8.50435 7.98658C8.05477 8.4264 7.5122 8.64631 6.87664 8.64631H4.51497C3.88122 8.64631 3.33865 8.4264 2.88727 7.98658C2.43768 7.54853 2.21289 7.01987 2.21289 6.40061V4.0995C2.21289 3.482 2.43768 2.95334 2.88727 2.51353C3.33865 2.07547 3.88122 1.85645 4.51497 1.85645Z"
                                                fill="#FD4A36"
                                            />
                                        </svg>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64">
                                    <h4 className="font-medium p-5 text-base">
                                        Filter Options
                                    </h4>
                                    <hr />

                                    <div className="p-5 space-y-5">
                                        <div className="space-y-1">
                                            <h4 className="font-medium">
                                                Status:
                                            </h4>
                                            <Select>
                                                <SelectTrigger className="w-[200px]">
                                                    <SelectValue placeholder="Select Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {/* <SelectLabel>Fruits</SelectLabel> */}
                                                        <SelectItem value="apple">
                                                            Approved
                                                        </SelectItem>
                                                        <SelectItem value="banana">
                                                            Pending
                                                        </SelectItem>
                                                        <SelectItem value="blueberry">
                                                            In Progress
                                                        </SelectItem>
                                                        <SelectItem value="grapes">
                                                            Rejected
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-medium">
                                                Member Type:
                                            </h4>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1">
                                                    <Checkbox />{" "}
                                                    <h6 className="text-grey-light">
                                                        Author
                                                    </h6>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Checkbox checked />{" "}
                                                    <h6 className="text-grey-light">
                                                        Customer
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-medium">
                                                Notifications:
                                            </h4>
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id="notifications-mode"
                                                    checked
                                                />
                                                <Label htmlFor="notifications-mode">
                                                    Enabled
                                                </Label>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-4">
                                            <Button variant="ghost">
                                                Reset
                                            </Button>
                                            <Button>Apply</Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="space-y-5 dark:text-black">
                        {notificationsLoading ? (
                            // Loading state
                            Array(4).fill(0).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center p-5 text-sm rounded-lg md:text-md bg-gray-100 animate-pulse"
                                >
                                    <div className="w-[15%]">
                                        <div className="w-6 h-6 bg-gray-300 rounded"></div>
                                    </div>
                                    <div className="w-[70%]">
                                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                                    </div>
                                    <div className="w-[15%]">
                                        <div className="h-4 bg-gray-300 rounded w-12"></div>
                                    </div>
                                </div>
                            ))
                        ) : !notificationsData?.results || notificationsData.results.length === 0 ? (
                            // Empty state
                            <div className="flex items-center justify-center p-8 text-gray-500">
                                <div className="text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7h11l-11 11H9V7z" />
                                    </svg>
                                    <h4 className="mt-2 font-medium">No notifications</h4>
                                    <p className="text-sm">You're all caught up!</p>
                                </div>
                            </div>
                        ) : (
                            // Real notification data
                            notificationsData.results.map((notification, index) => {
                                const styling = getNotificationStyling(notification);
                                const timeDisplay = getTimeSinceCreation(notification.created_datetime);
                                const isUnread = !notification.is_read || notification.status === "Pending";
                                
                                return (
                                    <div
                                        key={notification.id}
                                        className={cn(
                                            "flex items-center p-5 text-sm rounded-lg md:text-md cursor-pointer hover:shadow-md transition-shadow",
                                            styling.backgroundColor,
                                            isUnread && "border-l-4 border-blue-500"
                                        )}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="w-[15%]">
                                            <div className={styling.textColor}>
                                                {getNotificationIcon(notification)}
                                            </div>
                                        </div>
                                        <div className="w-[70%]">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium">{notification.title}</h4>
                                                {isUnread && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                )}
                                            </div>
                                            <h6 className="text-sm text-grey-dark truncate">
                                                {notification.message}
                                            </h6>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-400">{timeDisplay}</span>
                                                <span className="text-xs text-gray-400">•</span>
                                                <span className="text-xs text-gray-400">{notification.module_type}</span>
                                            </div>
                                        </div>
                                        <div className="w-[15%] flex flex-col items-center">
                                            {notification.priority && (
                                                <span className={cn("text-xs px-2 py-1 rounded-full", styling.backgroundColor, styling.textColor)}>
                                                    {notification.priority}
                                                </span>
                                            )}
                                            {notification.category && (
                                                <span className="text-xs text-gray-500 mt-1">
                                                    {notification.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </Card>

                <Card className="space-y-5">
                    <div className="flex justify-between">
                        <h4 className="font-bold text-base">AHNi Tasks</h4>
                        <div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button size="icon" variant="ghost">
                                        <svg
                                            width="21"
                                            height="20"
                                            viewBox="0 0 21 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g opacity="0.3">
                                                <path
                                                    d="M13.8107 1.8934H16.1723C16.8061 1.8934 17.3486 2.10979 17.8 2.54257C18.2496 2.97535 18.4744 3.50664 18.4744 4.13646V6.4191C18.4744 7.03836 18.2496 7.56701 17.8 8.00507C17.3486 8.44488 16.8061 8.66479 16.1723 8.66479H13.8107C13.1751 8.66479 12.6325 8.44488 12.1829 8.00507C11.7316 7.56701 11.5059 7.03836 11.5059 6.4191V4.13646C11.5059 3.50664 11.7316 2.97535 12.1829 2.54257C12.6325 2.10979 13.1751 1.8934 13.8107 1.8934Z"
                                                    fill="#FD4A36"
                                                />
                                            </g>
                                            <g opacity="0.3">
                                                <path
                                                    d="M4.51497 10.929H6.87664C7.5122 10.929 8.05477 11.1489 8.50435 11.5887C8.95574 12.0267 9.18143 12.5554 9.18143 13.1746V15.4573C9.18143 16.0871 8.95574 16.6184 8.50435 17.0512C8.05477 17.484 7.5122 17.7003 6.87664 17.7003H4.51497C3.88122 17.7003 3.33865 17.484 2.88727 17.0512C2.43768 16.6184 2.21289 16.0871 2.21289 15.4573V13.1746C2.21289 12.5554 2.43768 12.0267 2.88727 11.5887C3.33865 11.1489 3.88122 10.929 4.51497 10.929Z"
                                                    fill="#FD4A36"
                                                />
                                            </g>
                                            <path
                                                d="M13.8107 10.9474H16.1723C16.8061 10.9474 17.3486 11.1673 17.8 11.6071C18.2496 12.0452 18.4744 12.5739 18.4744 13.1931V15.4942C18.4744 16.1117 18.2496 16.6404 17.8 17.0802C17.3486 17.5183 16.8061 17.7373 16.1723 17.7373H13.8107C13.1751 17.7373 12.6325 17.5183 12.1829 17.0802C11.7316 16.6404 11.5059 16.1117 11.5059 15.4942V13.1931C11.5059 12.5739 11.7316 12.0452 12.1829 11.6071C12.6325 11.1673 13.1751 10.9474 13.8107 10.9474Z"
                                                fill="#FD4A36"
                                            />
                                            <path
                                                d="M4.51497 1.85645H6.87664C7.5122 1.85645 8.05477 2.07547 8.50435 2.51353C8.95574 2.95334 9.18143 3.482 9.18143 4.0995V6.40061C9.18143 7.01987 8.95574 7.54853 8.50435 7.98658C8.05477 8.4264 7.5122 8.64631 6.87664 8.64631H4.51497C3.88122 8.64631 3.33865 8.4264 2.88727 7.98658C2.43768 7.54853 2.21289 7.01987 2.21289 6.40061V4.0995C2.21289 3.482 2.43768 2.95334 2.88727 2.51353C3.33865 2.07547 3.88122 1.85645 4.51497 1.85645Z"
                                                fill="#FD4A36"
                                            />
                                        </svg>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64">
                                    <h4 className="font-medium p-5 text-base">
                                        Filter Options
                                    </h4>
                                    <hr />

                                    <div className="p-5 space-y-5">
                                        <div className="space-y-1">
                                            <h4 className="font-medium">
                                                Status:
                                            </h4>
                                            <Select>
                                                <SelectTrigger className="w-[200px]">
                                                    <SelectValue placeholder="Select Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {/* <SelectLabel>Fruits</SelectLabel> */}
                                                        <SelectItem value="apple">
                                                            Approved
                                                        </SelectItem>
                                                        <SelectItem value="banana">
                                                            Pending
                                                        </SelectItem>
                                                        <SelectItem value="blueberry">
                                                            In Progress
                                                        </SelectItem>
                                                        <SelectItem value="grapes">
                                                            Rejected
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-medium">
                                                Member Type:
                                            </h4>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1">
                                                    <Checkbox />{" "}
                                                    <h6 className="text-grey-light">
                                                        Author
                                                    </h6>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Checkbox checked />{" "}
                                                    <h6 className="text-grey-light">
                                                        Customer
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-medium">
                                                Notifications:
                                            </h4>
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id="notifications-mode"
                                                    checked
                                                />
                                                <Label htmlFor="notifications-mode">
                                                    Enabled
                                                </Label>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-4">
                                            <Button variant="ghost">
                                                Reset
                                            </Button>
                                            <Button>Apply</Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="space-y-7">
                        {[
                            {
                                name: "Prepare Health Report",
                                description: "Due in 2 Days",
                                status: "Urgent",
                                backgroundColor: "bg-yellow-50",
                                textColor: "text-yellow-600",
                                bgColor: "bg-yellow-600",
                            },
                            {
                                name: "Organize Health Seminar",
                                description: "Due in 5 Days",
                                status: "Upcoming",
                                backgroundColor: "bg-green-50",
                                textColor: "text-green-600",
                                bgColor: "bg-green-600",
                            },
                            {
                                name: "Review Nutrition Guidelines",
                                description: "Due in 1 Days",
                                status: "Review",
                                backgroundColor: "bg-red-50",
                                textColor: "text-red-600",
                                bgColor: "bg-red-600",
                            },
                            {
                                name: "Update Financial Projections",
                                description: "Due in 1 Week",
                                status: "Important",
                                backgroundColor: "bg-red-50",
                                textColor: "text-red-600",
                                bgColor: "bg-red-600",
                            },
                            {
                                name: "Finalize Partnership Deal",
                                description: "Due in 2 Days",
                                status: "Partnership",
                                backgroundColor: "bg-yellow-50",
                                textColor: "text-yellow-600",
                                bgColor: "bg-yellow-600",
                            },
                            {
                                name: "Coordinate with Education Dept.",
                                description: "Due in 1 Days",
                                status: "Finance",
                                backgroundColor: "bg-yellow-50",
                                textColor: "text-yellow-600",
                                bgColor: "bg-yellow-600",
                            },
                        ].map(
                            ({
                                name,
                                description,
                                status,
                                backgroundColor,
                                textColor,
                                bgColor,
                            }) => (
                                <div
                                    key={name}
                                    className="flex gap-5 items-center text-sm md:text-md"
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={cn(
                                                "w-[5px] h-10 rounded-t-full rounded-b-full",
                                                bgColor
                                            )}
                                        />
                                        <div className="w-6 h-6 bg-gray-300 rounded-lg" />
                                    </div>

                                    <div className="w-[70%]">
                                        <h4 className="font-medium">{name}</h4>
                                        <h6 className="text-sm text-grey-dark">
                                            {description}
                                        </h6>
                                    </div>

                                    <div>
                                        <Badge
                                            className={cn(
                                                textColor,
                                                backgroundColor
                                            )}
                                        >
                                            {status}
                                        </Badge>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </Card>
            </div>

            <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
                <Card className="space-y-4">
                    <div>
                        <h4 className="font-bold text-lg">
                            Funding Received by Projects
                        </h4>
                        <h6 className="text-xs">
                            List of funding&apos;s for AHNI projects
                        </h6>
                    </div>

                    {!isLoggedIn ? (
                        <div className="flex items-center justify-center p-8 text-gray-500">
                            <div className="text-center">
                                <h4 className="font-medium">Please log in</h4>
                                <p className="text-sm">Log in to see your funded projects.</p>
                            </div>
                        </div>
                    ) : projectsLoading ? (
                        <DataTable
                            data={[]}
                            columns={dashboardColumns}
                            isLoading={true}
                        />
                    ) : projectsError ? (
                        <div className="flex items-center justify-center p-8 text-red-500">
                            <div className="text-center">
                                <h4 className="font-medium">Error loading projects</h4>
                                <p className="text-sm">Failed to load project data. Please try refreshing the page.</p>
                                <p className="text-xs mt-2">Error: {String(projectsError)}</p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {(!projectsData?.results || projectsData.results.length === 0) && (
                                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-700">
                                        <strong>Note:</strong> Displaying sample data while API data issue is resolved.
                                    </p>
                                </div>
                            )}
                            <p className="text-xs text-gray-500 mb-2">
                                Showing {transformedProjectData.length} projects
                            </p>
                            <DataTable
                                data={transformedProjectData}
                                columns={dashboardColumns}
                                isLoading={false}
                            />
                        </div>
                    )}
                </Card>

                <Card className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="font-bold text-lg">
                                Projects Expenditure
                            </h4>
                            <h6 className="text-xs">
                                Total Funds Expended on Major Initiatives
                            </h6>
                        </div>

                        <div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button size="icon" variant="ghost">
                                        <svg
                                            width="21"
                                            height="20"
                                            viewBox="0 0 21 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g opacity="0.3">
                                                <path
                                                    d="M13.8107 1.8934H16.1723C16.8061 1.8934 17.3486 2.10979 17.8 2.54257C18.2496 2.97535 18.4744 3.50664 18.4744 4.13646V6.4191C18.4744 7.03836 18.2496 7.56701 17.8 8.00507C17.3486 8.44488 16.8061 8.66479 16.1723 8.66479H13.8107C13.1751 8.66479 12.6325 8.44488 12.1829 8.00507C11.7316 7.56701 11.5059 7.03836 11.5059 6.4191V4.13646C11.5059 3.50664 11.7316 2.97535 12.1829 2.54257C12.6325 2.10979 13.1751 1.8934 13.8107 1.8934Z"
                                                    fill="#FD4A36"
                                                />
                                            </g>
                                            <g opacity="0.3">
                                                <path
                                                    d="M4.51497 10.929H6.87664C7.5122 10.929 8.05477 11.1489 8.50435 11.5887C8.95574 12.0267 9.18143 12.5554 9.18143 13.1746V15.4573C9.18143 16.0871 8.95574 16.6184 8.50435 17.0512C8.05477 17.484 7.5122 17.7003 6.87664 17.7003H4.51497C3.88122 17.7003 3.33865 17.484 2.88727 17.0512C2.43768 16.6184 2.21289 16.0871 2.21289 15.4573V13.1746C2.21289 12.5554 2.43768 12.0267 2.88727 11.5887C3.33865 11.1489 3.88122 10.929 4.51497 10.929Z"
                                                    fill="#FD4A36"
                                                />
                                            </g>
                                            <path
                                                d="M13.8107 10.9474H16.1723C16.8061 10.9474 17.3486 11.1673 17.8 11.6071C18.2496 12.0452 18.4744 12.5739 18.4744 13.1931V15.4942C18.4744 16.1117 18.2496 16.6404 17.8 17.0802C17.3486 17.5183 16.8061 17.7373 16.1723 17.7373H13.8107C13.1751 17.7373 12.6325 17.5183 12.1829 17.0802C11.7316 16.6404 11.5059 16.1117 11.5059 15.4942V13.1931C11.5059 12.5739 11.7316 12.0452 12.1829 11.6071C12.6325 11.1673 13.1751 10.9474 13.8107 10.9474Z"
                                                fill="#FD4A36"
                                            />
                                            <path
                                                d="M4.51497 1.85645H6.87664C7.5122 1.85645 8.05477 2.07547 8.50435 2.51353C8.95574 2.95334 9.18143 3.482 9.18143 4.0995V6.40061C9.18143 7.01987 8.95574 7.54853 8.50435 7.98658C8.05477 8.4264 7.5122 8.64631 6.87664 8.64631H4.51497C3.88122 8.64631 3.33865 8.4264 2.88727 7.98658C2.43768 7.54853 2.21289 7.01987 2.21289 6.40061V4.0995C2.21289 3.482 2.43768 2.95334 2.88727 2.51353C3.33865 2.07547 3.88122 1.85645 4.51497 1.85645Z"
                                                fill="#FD4A36"
                                            />
                                        </svg>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64">
                                    <h4 className="font-medium p-5 text-base">
                                        Filter Options
                                    </h4>
                                    <hr />

                                    <div className="p-5 space-y-5">
                                        <div className="space-y-1">
                                            <h4 className="font-medium">
                                                Status:
                                            </h4>
                                            <Select>
                                                <SelectTrigger className="w-[200px]">
                                                    <SelectValue placeholder="Select Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {/* <SelectLabel>Fruits</SelectLabel> */}
                                                        <SelectItem value="apple">
                                                            Approved
                                                        </SelectItem>
                                                        <SelectItem value="banana">
                                                            Pending
                                                        </SelectItem>
                                                        <SelectItem value="blueberry">
                                                            In Progress
                                                        </SelectItem>
                                                        <SelectItem value="grapes">
                                                            Rejected
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-medium">
                                                Member Type:
                                            </h4>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1">
                                                    <Checkbox />{" "}
                                                    <h6 className="text-grey-light">
                                                        Author
                                                    </h6>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Checkbox checked />{" "}
                                                    <h6 className="text-grey-light">
                                                        Customer
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-medium">
                                                Notifications:
                                            </h4>
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id="notifications-mode"
                                                    checked
                                                />
                                                <Label htmlFor="notifications-mode">
                                                    Enabled
                                                </Label>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-4">
                                            <Button variant="ghost">
                                                Reset
                                            </Button>
                                            <Button>Apply</Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="flex relative gap-5 flex-col md:flex-row">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart width={400} height={400}>
                                <Tooltip />
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="block md:hidden">
                            {pieData.map(({ name, color }) => (
                                <div
                                    key={name}
                                    className="flex items-center gap-2"
                                >
                                    <div
                                        style={{ backgroundColor: color }}
                                        className="h-3 w-3 rounded-full"
                                    />
                                    <h4>{name}</h4>
                                </div>
                            ))}
                        </div>
                        <div className="absolute hidden top-5 right-5 md:block">
                            {pieData.map(({ name, color }) => (
                                <div
                                    key={name}
                                    className="flex items-center gap-2"
                                >
                                    <div
                                        style={{ backgroundColor: color }}
                                        className="h-3 w-3 rounded-full"
                                    />
                                    <h4>{name}</h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            <div className="space-y-5">
                <div className="flex justify-between items-center">
                    <h4 className="font-bold text-lg">
                        Projects{" "}
                        <span className="text-sm text-grey-dark">
                            by Status
                        </span>
                    </h4>

                    <Select>
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {/* <SelectLabel>Fruits</SelectLabel> */}
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="in_progress">
                                    In Progress
                                </SelectItem>
                                <SelectItem value="todo">Todo</SelectItem>
                                <SelectItem value="completed">
                                    Completed
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {transformedProjectData.length > 0 ? transformedProjectData.slice(0, 3).map((project, index) => (
                            <Card
                                key={index}
                                className="space-y-5 hover:border-primary"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <img
                                            src={logoPng}
                                            alt="logo"
                                            width={50}
                                        />
                                    </div>
                                    <div className="bg-green-100 text-green-500 px-2 py-1 rounded-lg">
                                        {project.status}
                                    </div>
                                </div>

                                <div className="">
                                    <h4 className="font-bold text-lg">
                                        {project.ref.name}
                                    </h4>
                                    <h6>{project.ref.desc}</h6>
                                </div>

                                <div className="flex gap-5 items-center">
                                    <div className="p-3 border border-dashed rounded-lg">
                                        <h4 className="font-bold text-lg">
                                            {project.end_date ? new Date(project.end_date).toLocaleDateString("en-US") : project.date}
                                        </h4>
                                        <h6>Due Date</h6>
                                    </div>
                                    <div className="p-3 border border-dashed rounded-lg">
                                        <h4 className="font-bold text-lg">
                                            {project.currency === "NGN" ? "₦" : "$"}{project.amount.toLocaleString()}
                                        </h4>
                                        <h6>Budget</h6>
                                    </div>
                                </div>

                                <Progress value={project.progress} />

                                <div className="flex">
                                    {project.manager_initials.map((initials, idx) => (
                                        <div 
                                            key={idx}
                                            className={`p-3 font-bold rounded-full text-center bg-[#7239EA] text-white ${idx > 0 ? '-ml-3' : ''}`}
                                        >
                                            {initials}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )) : null}
                </div>
            </div>
        </div>
    );
}


const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#775DD0"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};