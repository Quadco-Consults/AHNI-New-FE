import {
  ClockTimingSvg,
  DataCalenderSvg,
  LocationSvg,
  PeoplePositionsSvg,
  SuiteCase,
} from "assets/svgs/CAndGSvgs";
import DescriptionCard from "components/DescriptionCard";
import FilePreview from "components/FilePreview";
import { format, isValid } from "date-fns";
import { IFacilitatorSingleData } from "@/features/contracts-grants/types/contract-management/facilitator-management";
import React from "react";

export default function JobDetails({
  title,
  facilitaor_number,
  duration,
  end_date,
  commencement_date,
  locations,
  advertisement_document,
  created_datetime,
  scope_of_work,
  grade_level,
  background,
  extra_info,
  evaluation_comments,
}: IFacilitatorSingleData) {
  return (
    <div className='space-y-5'>
      <h1 className='font-bold text-lg'>{title}</h1>

      <div className='flex flex-wrap items-center justify-start gap-x-[.625rem] gap-y-[1rem] w-1/2'>
        <DetailsTag
          icon={<PeoplePositionsSvg />}
          label={`${facilitaor_number} people`}
        />
        <DetailsTag
          icon={<ClockTimingSvg />}
          label={`${duration} months with possibility of extension`}
        />
        <DetailsTag
          icon={<DataCalenderSvg />}
          label={commencement_date && isValid(new Date(commencement_date)) ? format(new Date(commencement_date), "MMM dd, yyyy") : "Date not available"}
        />
        <DetailsTag
          icon={<DataCalenderSvg />}
          label={end_date && isValid(new Date(end_date)) ? format(new Date(end_date), "MMM dd, yyyy") : "Date not available"}
        />

        <DetailsTag
          icon={<LocationSvg />}
          label={locations && Array.isArray(locations) && locations.length > 0
            ? locations.map((item) => item.name || item.city || "Unknown").join(", ")
            : "No location specified"
          }
        />
        <DetailsTag icon={<SuiteCase />} label={grade_level || "N/A"} />
      </div>

      {background && (
        <DescriptionCard
          label='Background'
          description={background}
        />
      )}

      {scope_of_work?.background && (
        <DescriptionCard
          label='Scope of Work Background'
          description={scope_of_work.background}
        />
      )}

      {scope_of_work?.description && (
        <DescriptionCard
          label='Description'
          description={scope_of_work.description}
        />
      )}

      {scope_of_work?.objectives && (
        <DescriptionCard
          label='Objectives'
          description={scope_of_work.objectives}
        />
      )}

      {evaluation_comments && (
        <DescriptionCard
          label='Evaluation Comments'
          description={evaluation_comments}
        />
      )}

      {extra_info && (
        <DescriptionCard
          label='Additional Information'
          description={extra_info}
        />
      )}

      <div className='w-1/4 space-y-4'>
        {advertisement_document && (
          <FilePreview
            file={advertisement_document}
            name='Advertisement Document'
            timestamp={created_datetime}
          />
        )}
        {scope_of_work?.advertisement_document && (
          <FilePreview
            file={scope_of_work.advertisement_document}
            name='Scope of Work - Advertisement Document'
            timestamp={scope_of_work.created_datetime}
          />
        )}
        {scope_of_work?.scope_of_work_document && (
          <FilePreview
            file={scope_of_work.scope_of_work_document}
            name='Scope of Work Document'
            timestamp={scope_of_work.created_datetime}
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
