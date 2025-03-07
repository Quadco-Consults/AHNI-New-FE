import { JobAdvertisement } from "definations/hr-types/job-advertisement";
import ApplicationsTable from "../table/ApplicationsTable";

const Shortlist = ({ id }: JobAdvertisement) => {
  return <ApplicationsTable id={id} status='shortlisted' />;
};

export default Shortlist;
