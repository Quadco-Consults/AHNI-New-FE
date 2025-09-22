import InterviewedCandidatesTable from "./InterviewedCandidatesTable";

const Selection = () => {
  return (
    <div className='space-y-6'>
      <div className='mb-4'>
        <h1 className='text-2xl font-bold'>Selection - Interviewed Candidates</h1>
        <p className='text-gray-600 mt-2'>
          View all candidates who have completed their interviews across all job advertisements
        </p>
      </div>

      <div className='border bg-white p-6 rounded-lg'>
        <InterviewedCandidatesTable />
      </div>
    </div>
  );
};

export default Selection;
