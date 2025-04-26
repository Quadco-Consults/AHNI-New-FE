import PdfContent from "components/shared/PdfContent";
import { Badge } from "components/ui/badge";
import { formatDate } from "date-fns";
import { JobAdvertisement } from "definations/hr-types/job-advertisement";
import {
  Briefcase,
  CalendarDays,
  Clock,
  MapPin,
  PersonStanding,
  Users,
} from "lucide-react";
import moment from "moment";

const JobDetail = ({
  job_type,
  advert_document,
  background,
  duration,
  locations,
  number_of_positions,
  supervisor,
  title,
  created_at,
}: JobAdvertisement) => {
  const pdf = {
    name: "document",
    document: advert_document!,
  };

  return (
    <div className='space-y-6'>
      <h4 className='font-semibold text-lg'>{title}</h4>

      <div className='flex flex-wrap gap-2 max-w-2xl'>
        <Badge variant='md'>
          <Users size={15} />({number_of_positions} positions)
        </Badge>
        <Badge variant='md'>
          <Clock size={15} /> {duration} months with possibility of extension
        </Badge>
        <Badge variant='md'>
          <CalendarDays size={15} /> {moment(created_at!).format("DD-MM-YYYY")}
        </Badge>
        <Badge variant='md'>
          <MapPin size={15} /> {locations}
        </Badge>
        <Badge variant='md'>
          <Briefcase size={15} /> {job_type}
        </Badge>
        <Badge variant='md'>
          <PersonStanding size={15} /> {supervisor}
        </Badge>
      </div>

      <h4 className='font-medium'>Background</h4>
      <p className='text-sm line-clamp-4'>{background} </p>

      <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
        <PdfContent pdf={pdf} />
      </div>
    </div>
  );
};

export default JobDetail;
