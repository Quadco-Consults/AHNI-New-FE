import {
  ClockTimingSvg,
  DataCalenderSvg,
  LocationSvg,
  PeoplePositionsSvg,
  PersonClusterSvg,
  SuiteCase,
} from "assets/svgs/CAndGSvgs";
import DescriptionCard from "@/components/DescriptionCard";
import FilePreview from "@/components/FilePreview";
import { format, isValid } from "date-fns";
import { IConsultantSingleData } from "definitions/c&g/contract-management/consultancy-management/consultancy-management";
import React from "react";

export default function JobDetails({
  title,
  consultants_number,
  duration,
  end_date,
  locations,
  advertisement_document,
  created_datetime,
  scope_of_work,
  status,
  grade_level,
  supervisor,
  background,
}: IConsultantSingleData) {
  //   return;
  return (
    <div className='space-y-5'>
      <h1 className='font-bold text-lg'>{title}</h1>

      <div className='flex flex-wrap items-center justify-start gap-x-[.625rem] gap-y-[1rem] w-1/2'>
        <DetailsTag
          icon={<PeoplePositionsSvg />}
          label={`${consultants_number || 1} ${(consultants_number || 1) === 1 ? 'person' : 'people'}`}
        />
        <DetailsTag
          icon={<ClockTimingSvg />}
          label={`${duration || 'TBD'} ${duration && duration === 1 ? 'month' : 'months'} with possibility of extension`}
        />
        <DetailsTag
          icon={<DataCalenderSvg />}
          label={end_date && isValid(new Date(end_date)) ? format(new Date(end_date), "MMM dd, yyyy") : "End date TBD"}
        />

        <DetailsTag
          icon={<LocationSvg />}
          label={(() => {
            if (locations && Array.isArray(locations) && locations.length > 0) {
              // Handle both string arrays and object arrays
              return locations.map(location => {
                if (typeof location === 'string') {
                  return location;
                } else if (typeof location === 'object' && location) {
                  return location.name || location.city || "Unknown Location";
                }
                return "Unknown Location";
              }).join(", ");
            }
            return "Location TBD";
          })()}
        />
        <DetailsTag
          icon={<SuiteCase />}
          label={(() => {
            // Handle grade_level as either string or object
            if (grade_level) {
              if (typeof grade_level === 'object') {
                return grade_level.name || 'Position Level TBD';
              }
              if (typeof grade_level === 'string') {
                // Check if it looks like an ID (UUID format)
                if (grade_level.includes('-') && grade_level.length > 30) {
                  return status || 'Position Level TBD';
                }
                return grade_level;
              }
            }
            return status || 'Position Level TBD';
          })()}
        />

        <DetailsTag
          icon={<PersonClusterSvg />}
          label={(() => {
            // Handle supervisor data more robustly
            if (supervisor) {
              if (typeof supervisor === 'object' && supervisor.full_name) {
                return supervisor.full_name;
              }
              if (typeof supervisor === 'object' && (supervisor.first_name || supervisor.last_name)) {
                return [supervisor.first_name, supervisor.last_name].filter(Boolean).join(' ');
              }
              if (typeof supervisor === 'string') {
                // Check if it's a UUID (raw ID)
                if (supervisor.includes('-') && supervisor.length > 30) {
                  return 'Supervisor TBD';
                }
                return supervisor;
              }
            }
            return 'Supervisor TBD';
          })()}
        />
      </div>
      <DescriptionCard
        label='Background'
        description={scope_of_work?.background || background}
      />

      <div className='w-1/4'>
        {advertisement_document && (
          <FilePreview
            file={advertisement_document}
            name='Advertisement Document'
            timestamp={created_datetime}
          />
        )}
      </div>
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
    <div className='flex items-center border border-[#C7CBD5] text-sm p-1 px-[.625rem] gap-x-[.25rem] rounded-full'>
      {icon}
      <p>{label}</p>
    </div>
  );
};
