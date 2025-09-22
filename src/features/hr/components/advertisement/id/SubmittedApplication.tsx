// // generatePath replaced with template strings
import { JobAdvertisement } from "@/features/hr/types/job-advertisement";
import ApplicationsTable from "../table/ApplicationsTable";

const SubmittedApplication = ({ id }: JobAdvertisement) => {
  return <ApplicationsTable linkTitle={"Add Applicant"} id={id} />;
};

export default SubmittedApplication;
