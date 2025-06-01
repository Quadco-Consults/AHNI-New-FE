// import { generatePath } from "react-router-dom";
import { JobAdvertisement } from "definations/hr-types/job-advertisement";
import ApplicationsTable from "../table/ApplicationsTable";

const SubmittedApplication = ({ id }: JobAdvertisement) => {
  return <ApplicationsTable linkTitle={"Add Applicant"} id={id} />;
};

export default SubmittedApplication;
