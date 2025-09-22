import { JobAdvertisement } from "@/features/hr/types/job-advertisement";
import ApplicationsTable from "../table/ApplicationsTable";

const Shortlist = ({ id }: JobAdvertisement) => {
  return <ApplicationsTable id={id} status='SHORTLISTED' />;
};

export default Shortlist;
