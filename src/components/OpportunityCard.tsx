"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, isValid } from "date-fns";
import { Card } from "@/components/Card";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Building2,
  FileText,
  Briefcase,
  GraduationCap,
  Mail,
} from "lucide-react";

interface OpportunityCardProps {
  id: string;
  title: string;
  type: string;
  category: string;
  project: string;
  location: string;
  postedDate: string;
  deadline: string;
  description: string;
  requirements?: string;
  status?: string;
  positions?: number;
  salary?: string;
  duration?: string;
  applicationEmail?: string;
  onCardClick: () => void;
}

export default function OpportunityCard({
  id,
  title,
  type,
  category,
  project,
  location,
  postedDate,
  deadline,
  description,
  requirements,
  status = "PUBLISHED",
  positions,
  salary,
  duration,
  applicationEmail,
  onCardClick,
}: OpportunityCardProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Get type-specific styling
  const getTypeColor = (opportunityType: string) => {
    switch (opportunityType) {
      case "Consultant":
        return "border-blue-500 text-blue-700 bg-blue-50";
      case "Full Time":
        return "border-green-500 text-green-700 bg-green-50";
      case "Adhoc":
        return "border-purple-500 text-purple-700 bg-purple-50";
      case "EOI":
        return "border-orange-500 text-orange-700 bg-orange-50";
      case "RFQ":
        return "border-cyan-500 text-cyan-700 bg-cyan-50";
      case "RFP":
        return "border-indigo-500 text-indigo-700 bg-indigo-50";
      default:
        return "border-gray-500 text-gray-700 bg-gray-50";
    }
  };

  // Get status color mapping
  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case "DRAFT":
        return "bg-gray-100 text-gray-700";
      case "PUBLISHED":
        return "bg-green-100 text-green-700";
      case "CLOSED":
        return "bg-red-100 text-red-700";
      case "CANCELLED":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  // Format posted date
  const formatPostedDate = (date: string) => {
    try {
      const parsedDate = new Date(date);
      return isValid(parsedDate) ? format(parsedDate, "MMM dd, yyyy") : "Date not available";
    } catch {
      return "Date not available";
    }
  };

  // Format deadline
  const formatDeadline = (date: string) => {
    try {
      const parsedDate = new Date(date);
      return isValid(parsedDate) ? format(parsedDate, "MMM dd, yyyy") : "Not set";
    } catch {
      return "Not set";
    }
  };

  // Get application email based on type
  const getApplicationEmail = () => {
    if (applicationEmail) return applicationEmail;

    switch (type) {
      case "Full Time":
        return "careers@ahnigeria.org";
      case "Consultant":
        return "consultants@ahnigeria.org";
      case "Adhoc":
        return "opportunities@ahnigeria.org";
      case "EOI":
      case "RFQ":
      case "RFP":
        return "procurement@ahnigeria.org";
      default:
        return "opportunities@ahnigeria.org";
    }
  };

  return (
    <div className="w-full">
      <Card className="flex flex-col gap-y-[.625rem] w-full min-h-[25rem] justify-between relative p-[2rem] hover:shadow-lg transition-all duration-300">
        <div className="w-full space-y-[1.5rem]">
          {/* Header with Date and Status */}
          <div className="flex justify-between items-center">
            <p className="bg-[#8C6400] text-[.625rem] py-1 px-[.625rem] w-fit rounded-full text-white text-sm">
              <span className="font-medium">Posted: </span>
              {formatPostedDate(postedDate)}
            </p>
            <p className={`text-[.625rem] py-1 px-[.625rem] w-fit rounded-full ${getStatusColor(status)}`}>
              {status}
            </p>
          </div>

          {/* Title and Project Badge */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge
                  variant="secondary"
                  className="font-semibold text-sm px-3 py-1"
                >
                  {project}
                </Badge>
                <Badge
                  variant="outline"
                  className={`font-semibold text-sm px-3 py-1 ${getTypeColor(type)}`}
                >
                  {type}
                </Badge>
              </div>
              <CardTitle className="text-black text-[1.25rem]" title="Opportunity Title">
                {title}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {category}
              </p>
            </div>
          </div>

          {/* Details Tags */}
          <div className="w-full flex flex-wrap items-center justify-start gap-x-[.625rem] gap-y-[1rem]">
            {positions && (
              <DetailsTag
                icon={<Users size={16} />}
                label={`${positions} ${positions === 1 ? 'position' : 'positions'}`}
              />
            )}

            {duration && (
              <DetailsTag
                icon={<Clock size={16} />}
                label={duration}
              />
            )}

            <DetailsTag
              icon={<MapPin size={16} />}
              label={location || "Location not specified"}
            />

            <DetailsTag
              icon={<Calendar size={16} />}
              label={`Deadline: ${formatDeadline(deadline)}`}
            />

            {salary && (
              <DetailsTag
                icon={<Briefcase size={16} />}
                label={salary}
              />
            )}

            <DetailsTag
              icon={<Mail size={16} />}
              label={getApplicationEmail()}
            />
          </div>
        </div>

        {/* Footer with Description Preview and View Button */}
        <div className="relative">
          <div className="space-y-2">
            <p className="text-sm text-gray-600 line-clamp-2">
              <span className="font-medium">Description: </span>
              {description}
            </p>
            {requirements && (
              <p className="text-sm text-gray-600 line-clamp-2">
                <span className="font-medium">Requirements: </span>
                {requirements}
              </p>
            )}
          </div>

          <div className="w-full flex flex-col items-center justify-center absolute bottom-0 left-0 py-[.75rem] bg-gradient-to-b from-white/50 via-white/70 to-white">
            <Button
              className="bg-primary text-primary-foreground z-[99] hover:bg-primary/90 transition-all shadow-md hover:shadow-lg font-semibold"
              onClick={onCardClick}
            >
              View Details
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export const DetailsTag = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string | number;
}) => {
  return (
    <div className="flex items-center border border-[#C7CBD5] text-sm p-1 px-[.625rem] gap-x-[.25rem] rounded-full">
      {icon}
      <p>{label}</p>
    </div>
  );
};