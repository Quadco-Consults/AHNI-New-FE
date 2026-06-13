"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  Building2,
  User,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

interface OrgNode {
  id: string;
  name: string;
  title: string;
  email?: string;
  phone?: string;
  department: string;
  location?: string;
  reports_to?: string;
  direct_reports: string[];
  level: number;
  employee_type: "staff" | "consultant" | "contractor";
}

interface Department {
  id: string;
  name: string;
  description: string;
  head: string;
  location: string;
  employee_count: number;
}

export default function OrganizationChartPage() {
  const { user } = usePermissions();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"chart" | "directory">("chart");
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [orgData, setOrgData] = useState<OrgNode[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock organizational data
  const mockOrgData: OrgNode[] = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      title: "Executive Director",
      email: "s.johnson@ahni.org",
      phone: "+234-123-456-7890",
      department: "Executive",
      location: "Abuja Headquarters",
      reports_to: "",
      direct_reports: ["2", "3", "4", "5"],
      level: 0,
      employee_type: "staff"
    },
    {
      id: "2",
      name: "Michael Brown",
      title: "Director of Programs",
      email: "m.brown@ahni.org",
      phone: "+234-123-456-7891",
      department: "Programs",
      location: "Abuja Headquarters",
      reports_to: "1",
      direct_reports: ["6", "7"],
      level: 1,
      employee_type: "staff"
    },
    {
      id: "3",
      name: "Jennifer Davis",
      title: "Director of Operations",
      email: "j.davis@ahni.org",
      phone: "+234-123-456-7892",
      department: "Operations",
      location: "Abuja Headquarters",
      reports_to: "1",
      direct_reports: ["8", "9", "10"],
      level: 1,
      employee_type: "staff"
    },
    {
      id: "4",
      name: "Robert Wilson",
      title: "Finance Director",
      email: "r.wilson@ahni.org",
      phone: "+234-123-456-7893",
      department: "Finance",
      location: "Abuja Headquarters",
      reports_to: "1",
      direct_reports: ["11", "12"],
      level: 1,
      employee_type: "staff"
    },
    {
      id: "5",
      name: "Amanda Garcia",
      title: "HR Director",
      email: "a.garcia@ahni.org",
      phone: "+234-123-456-7894",
      department: "Human Resources",
      location: "Abuja Headquarters",
      reports_to: "1",
      direct_reports: ["13", "14"],
      level: 1,
      employee_type: "staff"
    },
    {
      id: "6",
      name: "David Miller",
      title: "Program Manager",
      email: "d.miller@ahni.org",
      department: "Programs",
      location: "Lagos Office",
      reports_to: "2",
      direct_reports: ["15", "16"],
      level: 2,
      employee_type: "staff"
    },
    {
      id: "7",
      name: "Lisa Thompson",
      title: "M&E Specialist",
      email: "l.thompson@ahni.org",
      department: "Programs",
      location: "Kano Office",
      reports_to: "2",
      direct_reports: [],
      level: 2,
      employee_type: "consultant"
    },
    {
      id: "8",
      name: "James Anderson",
      title: "Procurement Manager",
      email: "j.anderson@ahni.org",
      department: "Operations",
      location: "Abuja Headquarters",
      reports_to: "3",
      direct_reports: ["17"],
      level: 2,
      employee_type: "staff"
    },
    {
      id: "9",
      name: "Maria Rodriguez",
      title: "Admin Manager",
      email: "m.rodriguez@ahni.org",
      department: "Operations",
      location: "Abuja Headquarters",
      reports_to: "3",
      direct_reports: ["18", "19"],
      level: 2,
      employee_type: "staff"
    },
    {
      id: "10",
      name: "Thomas Lee",
      title: "IT Manager",
      email: "t.lee@ahni.org",
      department: "Operations",
      location: "Abuja Headquarters",
      reports_to: "3",
      direct_reports: ["20"],
      level: 2,
      employee_type: "contractor"
    }
  ];

  const mockDepartments: Department[] = [
    {
      id: "1",
      name: "Executive",
      description: "Strategic leadership and organizational direction",
      head: "Dr. Sarah Johnson",
      location: "Abuja Headquarters",
      employee_count: 1
    },
    {
      id: "2",
      name: "Programs",
      description: "Program implementation and monitoring",
      head: "Michael Brown",
      location: "Multiple Locations",
      employee_count: 8
    },
    {
      id: "3",
      name: "Operations",
      description: "Operational support and infrastructure",
      head: "Jennifer Davis",
      location: "Abuja Headquarters",
      employee_count: 12
    },
    {
      id: "4",
      name: "Finance",
      description: "Financial management and accounting",
      head: "Robert Wilson",
      location: "Abuja Headquarters",
      employee_count: 6
    },
    {
      id: "5",
      name: "Human Resources",
      description: "Staff development and management",
      head: "Amanda Garcia",
      location: "Abuja Headquarters",
      employee_count: 4
    }
  ];

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setOrgData(mockOrgData);
      setDepartments(mockDepartments);
      setIsLoading(false);
      // Expand top level by default
      setExpandedNodes(new Set(["1"]));
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const toggleNodeExpansion = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getEmployeeTypeColor = (type: string) => {
    switch (type) {
      case "staff": return "bg-blue-100 text-blue-800";
      case "consultant": return "bg-green-100 text-green-800";
      case "contractor": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderOrgNode = (nodeId: string, indent: number = 0) => {
    const node = orgData.find((n: any) => n.id === nodeId);
    if (!node) return null;

    const hasChildren = node.direct_reports.length > 0;
    const isExpanded = expandedNodes.has(nodeId);

    return (
      <div key={nodeId} className="space-y-2">
        <Card className={`ml-${indent * 4} transition-all duration-200 hover:shadow-md`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {hasChildren && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleNodeExpansion(nodeId)}
                    className="p-1 h-6 w-6"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                )}
                {!hasChildren && <div className="w-6"></div>}

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <h3 className="font-semibold">{node.name}</h3>
                    <Badge className={getEmployeeTypeColor(node.employee_type)}>
                      {node.employee_type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{node.title}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {node.department}
                    </div>
                    {node.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {node.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                {node.email && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                    <Mail className="w-3 h-3" />
                    <a href={`mailto:${node.email}`} className="hover:text-blue-600">
                      {node.email}
                    </a>
                  </div>
                )}
                {node.phone && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Phone className="w-3 h-3" />
                    {node.phone}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {isExpanded && hasChildren && (
          <div className="space-y-2">
            {node.direct_reports.map((childId: any) => renderOrgNode(childId, indent + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredOrgData = orgData.filter((person: any) => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || person.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Organization Chart</h1>
            <p className="text-gray-600">View organizational structure and contact information</p>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i: any) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Organization Chart
          </h1>
          <p className="text-gray-600">View organizational structure and contact information</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "chart" ? "default" : "outline"}
            onClick={() => setViewMode("chart")}
          >
            Chart View
          </Button>
          <Button
            variant={viewMode === "directory" ? "default" : "outline"}
            onClick={() => setViewMode("directory")}
          >
            Directory
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Departments</option>
            {departments.map((dept: any) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Department Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept: any) => (
          <Card key={dept.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="w-5 h-5 text-blue-600" />
                {dept.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-3">{dept.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Department Head:</span>
                  <span className="font-medium">{dept.head}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location:</span>
                  <span>{dept.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Team Size:</span>
                  <span>{dept.employee_count} members</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Organization Chart or Directory */}
      {viewMode === "chart" ? (
        <Card>
          <CardHeader>
            <CardTitle>Organizational Hierarchy</CardTitle>
          </CardHeader>
          <CardContent>
            {orgData.length > 0 && (
              <div className="space-y-4">
                {renderOrgNode("1")}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Staff Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrgData.map((person: any) => (
                <div key={person.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{person.name}</h3>
                      <p className="text-sm text-gray-600">{person.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {person.department}
                        </Badge>
                        <Badge className={`text-xs ${getEmployeeTypeColor(person.employee_type)}`}>
                          {person.employee_type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    {person.email && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Mail className="w-3 h-3" />
                        <a href={`mailto:${person.email}`} className="hover:text-blue-600">
                          {person.email}
                        </a>
                      </div>
                    )}
                    {person.phone && (
                      <div className="flex items-center gap-1 text-gray-600 mt-1">
                        <Phone className="w-3 h-3" />
                        {person.phone}
                      </div>
                    )}
                    {person.location && (
                      <div className="flex items-center gap-1 text-gray-600 mt-1">
                        <MapPin className="w-3 h-3" />
                        {person.location}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}