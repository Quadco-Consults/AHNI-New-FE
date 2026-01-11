import Card from "@/components/Card";
import DescriptionCard from "@/components/DescriptionCard";
import { ISubGrantSingleData } from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";
import { useMemo } from "react";
import { formatNumberCurrency } from "@/utils/utls";
import { useGetSingleDepartment } from "@/features/modules/controllers/config/departmentController";
import { useGetAllLocations } from "@/features/modules/controllers/config/locationController";
import { useGetSubGrantAwards, useGetSubGrantOverview } from "@/features/contracts-grants/controllers/multiAwardController";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Users, DollarSign, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SubGrantAwardDetails = (props: ISubGrantSingleData & { parent_project?: any }) => {
  const {
    id,
    title,
    grant,
    project,
    sub_grant_administrator,
    award_type,
    technical_staff,
    business_unit,
    amount_usd,
    amount_ngn,
    start_date,
    end_date,
    submission_start_date,
    submission_end_date,
    status,
    locations,
    modifications,
    parent_project,
  } = props;
  // Get business unit name
  const { data: departmentData } = useGetSingleDepartment(
    typeof business_unit === 'string' ? business_unit : '',
    !!business_unit && typeof business_unit === 'string'
  );

  // Get all locations to map IDs to names
  const { data: allLocationsData } = useGetAllLocations({
    page: 1,
    size: 2000,
    enabled: true
  });

  // NEW: Fetch multi-award data to see if this sub-grant has multiple partners
  const { data: multiAwardData, isFetching: isLoadingAwards } = useGetSubGrantAwards(id || "");
  const { data: overviewData, isFetching: isLoadingOverview } = useGetSubGrantOverview(id || "");

  // Check if this is a multi-partner sub-grant
  const hasMultipleAwards = multiAwardData?.data?.awards && multiAwardData.data.awards.length > 1;
  const awards = multiAwardData?.data?.awards || [];
  const overview = overviewData?.data;

  const CardDetails = useMemo(() => {
    // Use project data - check parent_project first (from backend fix), then project, then grant
    const projectData = parent_project || project || grant;

    // Project data will be null if the referenced project doesn't exist in the database

    // Debug: Check what project data we have from the main subgrant API
    console.log("🔍 SUBGRANT DETAILS DEBUG:", {
      hasParentProject: !!parent_project,
      hasProject: !!project,
      hasGrant: !!grant,
      parentProject: parent_project,
      project: project,
      grant: grant,
      selectedProjectData: projectData
    });

    // Handle funding source from different data structures
    let fundingSource = "N/A";
    if (projectData?.funding_sources && Array.isArray(projectData.funding_sources) && projectData.funding_sources.length > 0) {
      // Project structure: array of objects with name property
      fundingSource = projectData.funding_sources.map((fs: any) => fs.name).join(", ");
    } else if (projectData?.funding_source) {
      // Grant structure: single string
      fundingSource = projectData.funding_source;
    }

    // Get locations from sub-grant or fallback to project locations
    const displayLocations = locations || projectData?.location || [];

    return [
      {
        id: 1,
        label: "Sub-Grant Name",
        value: title || "N/A",
      },

      {
        id: 2,
        label: "Project Name",
        value: projectData?.name || projectData?.title || "Project Not Found",
      },

      {
        id: 3,
        label: "Project ID",
        value: projectData?.project_id || projectData?.id || "No Project Assigned",
      },

      {
        id: 4,
        label: "Intervention Area",
        value: projectData?.intervention_area?.code || projectData?.intervention_area?.id || "Not Available (Project Missing)",
      },

      {
        id: 5,
        label: "Funding Source",
        value: fundingSource,
      },

      {
        id: 6,
        label: "Award Type",
        value: award_type || "N/A",
      },

      {
        id: 7,
        label: "Award Amount (USD)",
        value: formatNumberCurrency(amount_usd, "USD"),
      },

      {
        id: 8,
        label: "Award Amount (NGN)",
        value: formatNumberCurrency(amount_ngn, "NGN"),
      },

      {
        id: 9,
        label: "Administrator",
        value: sub_grant_administrator?.full_name || "N/A",
      },

      {
        id: 10,
        label: "Technical Staff",
        value: technical_staff?.full_name || "N/A",
      },

      {
        id: 11,
        label: "Business Unit",
        value: departmentData?.data?.name || business_unit || "N/A",
      },

      {
        id: 12,
        label: "Locations",
        value: (() => {
          if (!displayLocations || displayLocations.length === 0) return "N/A";

          // If locations are objects with name/city, use them directly
          if (typeof displayLocations[0] === 'object' && (displayLocations[0].name || displayLocations[0].city)) {
            return displayLocations.map(loc => loc.name || loc.city).join(", ");
          }

          // If locations are IDs, map them to names from allLocationsData
          if (typeof displayLocations[0] === 'string' && allLocationsData?.data?.results) {
            const locationNames = displayLocations
              .map(locId => {
                const loc = allLocationsData.data.results.find((l: any) => l.id === locId);
                return loc?.name || loc?.city;
              })
              .filter(Boolean)
              .join(", ");
            return locationNames || "N/A";
          }

          return "N/A";
        })(),
      },

      { id: 12, label: "Start Date", value: start_date || "N/A" },

      { id: 13, label: "End Date", value: end_date || "N/A" },

      { id: 14, label: "Submission Start Date", value: submission_start_date || "N/A" },

      { id: 15, label: "Submission End Date", value: submission_end_date || "N/A" },

      {
        id: 16,
        label: "Status",
        value: status || "N/A",
      },
    ];
  }, [
    title,
    grant,
    project,
    parent_project,
    sub_grant_administrator,
    technical_staff,
    business_unit,
    departmentData,
    award_type,
    locations,
    allLocationsData,
    amount_usd,
    amount_ngn,
    start_date,
    end_date,
    submission_start_date,
    submission_end_date,
    status,
  ]);

  return (
    <div className='w-full bg-white px-[2.5rem] py-[1.25rem] rounded-2xl flex flex-col gap-y-[1.25rem]'>
      <div className="flex items-center justify-between">
        <h3 className='text-xl font-bold'>Sub-Grant Award Details</h3>
        {hasMultipleAwards && (
          <Badge className="bg-green-100 text-green-800">
            <Users className="w-4 h-4 mr-1" />
            Multi-Partner Sub-Grant
          </Badge>
        )}
      </div>

      <Card>
        <div className='grid grid-cols-3 gap-10'>
          {CardDetails.map((item, index) => (
            <DescriptionCard
              key={index}
              label={item.label}
              description={item.value}
            />
          ))}
        </div>
      </Card>

      {/* Multi-Partner Awards Section */}
      {hasMultipleAwards && overview && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className='font-semibold text-lg'>Multi-Partner Awards Overview</h3>
            <Link href={`/dashboard/c-and-g/sub-grant/awarded-beneficiaries`}>
              <Button variant="outline" size="sm">
                <Award className="w-4 h-4 mr-2" />
                View All Partners
              </Button>
            </Link>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Partners</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{overview.partner_count}</p>
              <p className="text-xs text-blue-600">
                {overview.active_partners} active • {overview.completed_partners} completed
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">Total Awards</span>
              </div>
              <p className="text-2xl font-bold text-green-900">
                ${overview.total_award_amount_usd?.toLocaleString()}
              </p>
              <p className="text-xs text-green-600">
                ₦{overview.total_award_amount_ngn?.toLocaleString()}
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-orange-600 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Avg Utilization</span>
              </div>
              <p className="text-2xl font-bold text-orange-900">
                {overview.avg_utilization_percentage?.toFixed(1)}%
              </p>
              <div className="mt-2">
                <Progress value={overview.avg_utilization_percentage} className="h-2" />
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Locations</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">
                {overview.geographic_coverage?.length || 0}
              </p>
              <p className="text-xs text-purple-600">
                {overview.geographic_coverage?.slice(0, 2).join(", ")}
                {overview.geographic_coverage && overview.geographic_coverage.length > 2 &&
                  ` +${overview.geographic_coverage.length - 2} more`}
              </p>
            </div>
          </div>

          {/* Individual Awards */}
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Partner Awards</h4>
            <div className="space-y-3">
              {awards.slice(0, 3).map((award: any) => (
                <div key={award.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h5 className="font-medium text-gray-900">{award.partner_name}</h5>
                        <Badge
                          variant={
                            award.status === "ACTIVE" ? "default" :
                            award.status === "COMPLETED" ? "secondary" :
                            award.status === "TERMINATED" ? "destructive" : "outline"
                          }
                          className="text-xs"
                        >
                          {award.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                        <MapPin className="w-3 h-3" />
                        {award.coverage_location}
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Award Amount:</span>
                          <p className="font-medium text-green-600">
                            ${award.award_amount_usd?.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Utilization:</span>
                          <p className="font-medium">
                            {award.utilization_percentage?.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Period:</span>
                          <p className="font-medium text-gray-800">
                            {new Date(award.award_start_date).toLocaleDateString()} -
                            {new Date(award.award_end_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="w-16">
                        <Progress value={award.utilization_percentage || 0} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {awards.length > 3 && (
                <div className="text-center py-3">
                  <Link href={`/dashboard/c-and-g/sub-grant/awarded-beneficiaries`}>
                    <Button variant="outline" size="sm">
                      View All {awards.length} Partners
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {modifications && modifications.length > 0 && (
        <Card>
          <h3 className='font-semibold'>Modifications</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
            {modifications.map((mod: any) => (
              <div
                key={mod.id}
                className='border rounded-lg p-4 space-y-2 bg-gray-50'
              >
                <h4 className='font-bold text-base'>{mod.title}</h4>
                <p className='text-sm text-gray-600'>
                  Description: {mod.description}
                </p>
                <p className='text-sm'>
                  Amount: {formatNumberCurrency(mod.amount, "USD")}
                </p>
                <p className='text-xs text-gray-400'>Date: {mod.date}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SubGrantAwardDetails;
