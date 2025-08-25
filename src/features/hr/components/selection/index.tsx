// import ApplicationsTable from "../table/ApplicationsTable";

import ApplicationsTable from "../advertisement/table/ApplicationsTable";

const Shortlist = () => {
  return (
    <div className='mb-4 border bg-white p-4 rounded-lg space-y-3'>
      <ApplicationsTable
        href={"/hr/advertisement/1/application-form"}
        status='PREFERRED'
      />
    </div>
  );
};

export default Shortlist;
