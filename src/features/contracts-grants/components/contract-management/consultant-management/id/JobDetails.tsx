import {
  ClockTimingSvg,
  DataCalenderSvg,
  LocationSvg,
  PeoplePositionsSvg,
  PersonClusterSvg,
  SuiteCase,
} from "assets/svgs/CAndGSvgs";
import DescriptionCard from "components/DescriptionCard";
import FilePreview from "components/FilePreview";
import { format, isValid } from "date-fns";
import { IConsultantSingleData } from "definations/c&g/contract-management/consultancy-management/consultancy-management";
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
}: IConsultantSingleData) {
  //   return;
  return (
    <div className='space-y-5'>
      <h1 className='font-bold text-lg'>{title}</h1>

      <div className='flex flex-wrap items-center justify-start gap-x-[.625rem] gap-y-[1rem] w-1/2'>
        <DetailsTag
          icon={<PeoplePositionsSvg />}
          label={`${consultants_number} people`}
        />
        <DetailsTag
          icon={<ClockTimingSvg />}
          label={`${duration} months with possibility of extension`}
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
        <DetailsTag icon={<SuiteCase />} label='Internal' />

        <DetailsTag icon={<PersonClusterSvg />} label='Cluster Leads' />
      </div>
      <DescriptionCard
        label='Background'
        description={scope_of_work?.background}
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
