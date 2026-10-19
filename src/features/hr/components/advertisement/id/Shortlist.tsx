import { JobAdvertisement } from "@/features/hr/types/job-advertisement";
import ApplicationsTable from "../table/ApplicationsTable";

const Shortlist = ({ id }: JobAdvertisement) => {
  // Hiring Manager's shortlist from the HR longlist
  return <ApplicationsTable id={id} status='SHORTLISTED' />;
};

export default Shortlist;
