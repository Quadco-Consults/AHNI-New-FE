import { JobAdvertisement } from "@/features/hr/types/job-advertisement";
import ApplicationsTable from "../table/ApplicationsTable";

const LongList = ({ id }: JobAdvertisement) => {
  return <ApplicationsTable id={id} status='LONGLISTED' />;
};

export default LongList;
