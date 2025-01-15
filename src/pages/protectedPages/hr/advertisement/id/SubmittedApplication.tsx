// import { generatePath } from "react-router-dom";
import ApplicationsTable from "../table/ApplicationsTable";

// import { HrRoutes } from "constants/RouterConstants";

const SubmittedApplication = () => {
  // const href = generatePath(
  //   HrRoutes.ADVERTISEMENT_MANUAL_APPLICATION_SUBMISSION
  // );
  // console.log({ href });

  return (
    <ApplicationsTable
      href={"/hr/advertisement/1/application-form"}
      linkTitle={"Add Applicant"}
    />
  );
};

export default SubmittedApplication;
