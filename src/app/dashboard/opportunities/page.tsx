"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { LoadingSpinner } from "components/Loading";
import {
  Search,
  Filter,
  Briefcase,
  User,
  Clock,
  Presentation,
  MapPin,
  Calendar,
  Users,
  ExternalLink,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import {
  useGetAllOpportunities,
  useGetOpportunityStatistics,
} from "@/features/opportunities/controllers/opportunitiesController";
import {
  UnifiedOpportunity,
  OpportunityType,
  OpportunityStatus,
  OpportunityFilters,
  OPPORTUNITY_TYPE_CONFIGS,
  OPPORTUNITY_STATUS_CONFIGS,
} from "@/features/opportunities/types";

// Icon mapping
const getTypeIcon = (type: OpportunityType) => {
  switch (type) {
    case "HR_JOB":
      return <Briefcase className="h-4 w-4" />;
    case "CONSULTANT":
      return <User className="h-4 w-4" />;
    case "ADHOC":
      return <Clock className="h-4 w-4" />;
    case "FACILITATOR":
      return <Presentation className="h-4 w-4" />;
    default:
      return <Briefcase className="h-4 w-4" />;
  }
};

// Opportunity Card Component
const OpportunityCard: React.FC<{ opportunity: UnifiedOpportunity }> = ({
  opportunity,
}) => {
  const typeConfig = OPPORTUNITY_TYPE_CONFIGS[opportunity.type];
  const statusConfig = OPPORTUNITY_STATUS_CONFIGS[opportunity.status];

  const formatSalary = (op: UnifiedOpportunity) => {
    if (op.type === "ADHOC" && "proposed_salary" in op) {
      return `${op.currency || "NGN"} ${op.proposed_salary}`;
    }
    return null;
  };

  const formatDuration = (op: UnifiedOpportunity) => {
    if (op.type === "ADHOC" && "duration_months" in op && op.duration_months) {
      return `${op.duration_months} months`;
    }
    return op.duration || null;
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={typeConfig.color} variant="secondary">
                <span className="flex items-center gap-1">
                  {getTypeIcon(opportunity.type)}
                  {typeConfig.label}
                </span>
              </Badge>
              <Badge className={statusConfig.color} variant="secondary">
                {statusConfig.label}
              </Badge>
            </div>
            <CardTitle className="text-lg font-semibold mb-1">
              {opportunity.title}
            </CardTitle>
            {opportunity.grade_level && (
              <p className="text-sm text-gray-600 mb-2">
                Grade Level: {opportunity.grade_level}
              </p>
            )}
          </div>
          <Link
            href={typeConfig.route + "/" + opportunity.id}
            className="ml-4 text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Location */}
          {opportunity.locations && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{opportunity.locations}</span>
            </div>
          )}

          {/* Date info */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {opportunity.commencement_date
                ? `Starts: ${new Date(
                    opportunity.commencement_date
                  ).toLocaleDateString()}`
                : `Posted: ${formatDistanceToNow(
                    new Date(opportunity.created_datetime)
                  )} ago`}
            </span>
          </div>

          {/* Positions */}
          {opportunity.number_of_positions && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>
                {opportunity.number_of_positions} position
                {opportunity.number_of_positions > 1 ? "s" : ""} available
              </span>
            </div>
          )}

          {/* Duration */}
          {formatDuration(opportunity) && (
            <div className="text-sm text-gray-600">
              <strong>Duration:</strong> {formatDuration(opportunity)}
            </div>
          )}

          {/* Salary for Adhoc */}
          {formatSalary(opportunity) && (
            <div className="text-sm text-gray-600">
              <strong>Salary:</strong> {formatSalary(opportunity)}
            </div>
          )}

          {/* Applicants count */}
          {opportunity.total_applicants !== undefined && (
            <div className="text-sm text-gray-600">
              <strong>Applicants:</strong> {opportunity.total_applicants}
            </div>
          )}

          {/* Description preview */}
          {opportunity.background && (
            <p className="text-sm text-gray-700 line-clamp-2">
              {opportunity.background.length > 150
                ? opportunity.background.substring(0, 150) + "..."
                : opportunity.background}
            </p>
          )}

          {/* Project context for Adhoc */}
          {opportunity.type === "ADHOC" &&
            "project" in opportunity &&
            opportunity.project && (
              <div className="text-sm text-blue-600">
                <strong>Project:</strong> {opportunity.project}
              </div>
            )}

          {/* Department context for Adhoc */}
          {opportunity.type === "ADHOC" &&
            "department" in opportunity &&
            opportunity.department && (
              <div className="text-sm text-blue-600">
                <strong>Department:</strong> {opportunity.department}
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
};

// Stats Cards Component
const StatsCards: React.FC = () => {
  const { data: stats, isLoading } = useGetOpportunityStatistics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Opportunities
              </p>
              <p className="text-2xl font-bold">{stats?.total || 0}</p>
            </div>
            <Briefcase className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">External Jobs</p>
              <p className="text-2xl font-bold">
                {stats?.byType?.HR_JOB || 0}
              </p>
            </div>
            <Briefcase className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Project Roles
              </p>
              <p className="text-2xl font-bold">{stats?.byType?.ADHOC || 0}</p>
            </div>
            <Clock className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New This Week</p>
              <p className="text-2xl font-bold">{stats?.recent || 0}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Opportunities Page
export default function OpportunitiesPage() {
  const [filters, setFilters] = useState<OpportunityFilters>({
    page: 1,
    size: 20,
  });
  const [activeTab, setActiveTab] = useState<string>("all");

  const { data, isLoading, error } = useGetAllOpportunities(filters);

  // Filter opportunities based on active tab
  const filteredOpportunities = useMemo(() => {
    if (!data?.opportunities) return [];
    if (activeTab === "all") return data.opportunities;
    return data.opportunities.filter((op) => op.type === activeTab);
  }, [data?.opportunities, activeTab]);

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleTypeFilter = (types: OpportunityType[]) => {
    setFilters((prev) => ({ ...prev, type: types, page: 1 }));
  };

  const handleStatusFilter = (statuses: OpportunityStatus[]) => {
    setFilters((prev) => ({ ...prev, status: statuses, page: 1 }));
  };

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">
              Error loading opportunities. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Opportunities</h1>
          <p className="text-gray-600 mt-1">
            Explore all available job opportunities across AHNI
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.values(OPPORTUNITY_TYPE_CONFIGS).map((config) => (
                <Link key={config.type} href={config.route + "/add"}>
                  <DropdownMenuCheckboxItem>
                    {config.label}
                  </DropdownMenuCheckboxItem>
                </Link>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search opportunities..."
                  className="pl-10"
                  value={filters.search || ""}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {Object.entries(OPPORTUNITY_STATUS_CONFIGS).map(
                    ([status, config]) => (
                      <DropdownMenuCheckboxItem
                        key={status}
                        checked={filters.status?.includes(
                          status as OpportunityStatus
                        )}
                        onCheckedChange={(checked) => {
                          const currentStatuses = filters.status || [];
                          const newStatuses = checked
                            ? [...currentStatuses, status as OpportunityStatus]
                            : currentStatuses.filter((s) => s !== status);
                          handleStatusFilter(newStatuses);
                        }}
                      >
                        {config.label}
                      </DropdownMenuCheckboxItem>
                    )
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for opportunity types */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({data?.total || 0})</TabsTrigger>
          {Object.values(OPPORTUNITY_TYPE_CONFIGS).map((config) => (
            <TabsTrigger key={config.type} value={config.type}>
              {config.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-500">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    No opportunities found
                  </h3>
                  <p>
                    {activeTab === "all"
                      ? "There are no opportunities available at the moment."
                      : `There are no ${
                          OPPORTUNITY_TYPE_CONFIGS[activeTab as OpportunityType]
                            ?.label
                        } opportunities available.`}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={`${opportunity.type}-${opportunity.id}`}
                  opportunity={opportunity}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {data && data.total > (filters.size || 20) && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={filters.page === 1}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page! - 1 }))
              }
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {filters.page} of {data.pagination.total_pages}
            </span>
            <Button
              variant="outline"
              disabled={filters.page === data.pagination.total_pages}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page! + 1 }))
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}