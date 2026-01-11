import AddSquareIcon from "@/components/icons/AddSquareIcon";
import PdfContent from "@/components/PdfContent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HrRoutes } from "@/constants/RouterConstants";
import { JobAdvertisement } from "@/features/hr/types/job-advertisement";
import {
  Briefcase,
  CalendarDays,
  Clock,
  MapPin,
  PersonStanding,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useRouter } from "next/navigation";


const JobDetail = (props: JobAdvertisement) => {

  // Helper function to safely extract string values from potentially object fields
  const safeStringValue = (value: any): string => {
    if (!value) return 'N/A';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      if (value.name) return value.name;
      if (value.title) return value.title;
      if (value.description) return value.description;
      return 'N/A';
    }
    return String(value);
  };

  const {
    job_type,
    advert_document,
    background,
    duration,
    locations,
    number_of_positions,
    supervisor,
    title,
    created_datetime,
    commencement_date,
    any_other_info,
  } = props || {};


  // Get the actual job title/position - safely handle object values
  const getJobTitle = () => {
    const position = (props as any).position;

    // If position is an object, try to get name or title from it
    if (position && typeof position === 'object') {
      return position.name || position.title || "Job Position Not Set";
    }

    // If position is a string, use it
    if (typeof position === 'string') {
      return position;
    }

    // Fallback to title if available
    if (title && !title.includes('-')) {
      return title;
    }

    return "Job Position Not Set";
  };

  const jobTitle = getJobTitle();

  const [showFullBackground, setShowFullBackground] = useState(false);
  const router = useRouter();

  const pdf = {
    name: "document",
    document: advert_document!,
  };

  // Handle edit button click - navigate to edit page with the advertisement ID
  const handleEditClick = () => {
    const advertisementId = (props as any).id;
    if (advertisementId) {
      // Navigate to edit page with the advertisement ID as a query parameter
      router.push(`${HrRoutes.ADVERTISEMENT_ADD}?edit=${advertisementId}`);
    } else {
      console.error("No advertisement ID found for editing");
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h4 className='font-semibold text-lg'>{jobTitle}</h4>
        <div className='ml-auto'>
          <Button
            className='flex gap-2 py-6'
            type='button'
            onClick={handleEditClick}
          >
            <AddSquareIcon />
            <p>Edit Advert</p>
          </Button>
        </div>
      </div>

      <div className='flex flex-wrap gap-2 max-w-2xl'>
        <Badge variant='md'>
          <Users size={15} />({number_of_positions || '1'} positions)
        </Badge>
        <Badge variant='md'>
          <Clock size={15} /> {duration || 'N/A'}
        </Badge>
        <Badge variant='md'>
          <CalendarDays size={15} />{" "}
          {created_datetime ? format(new Date(created_datetime), "dd-MM-yyyy") : 'N/A'}
        </Badge>
        <Badge variant='md'>
          <MapPin size={15} /> {safeStringValue(locations)}
        </Badge>
        <Badge variant='md'>
          <Briefcase size={15} /> {safeStringValue(job_type)}
        </Badge>
        <Badge variant='md'>
          <PersonStanding size={15} /> {safeStringValue(supervisor)}
        </Badge>
        {commencement_date && (
          <Badge variant='md'>
            <Calendar size={15} /> Starts:{" "}
            {format(new Date(commencement_date), "dd-MM-yyyy")}
          </Badge>
        )}
      </div>

      <div>
        <h4 className='font-medium mb-2'>Background</h4>
        <p className={`text-sm ${!showFullBackground ? "line-clamp-4" : ""}`}>
          {background || 'No background information'}
        </p>
        {background && background.length > 150 && (
          <button
            onClick={() => setShowFullBackground(!showFullBackground)}
            className='text-blue-600 text-sm font-medium mt-1 flex items-center hover:underline'
          >
            {showFullBackground ? (
              <>
                Show less <ChevronUp size={14} className='ml-1' />
              </>
            ) : (
              <>
                Read more <ChevronDown size={14} className='ml-1' />
              </>
            )}
          </button>
        )}
      </div>

      {/* Additional information */}
      {any_other_info && (
        <div>
          <h4 className='font-medium mb-2'>Additional Information</h4>
          <p className='text-sm'>
            {any_other_info}
          </p>
        </div>
      )}

      <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
        <PdfContent pdf={pdf} />
      </div>
    </div>
  );
};

export default JobDetail;
