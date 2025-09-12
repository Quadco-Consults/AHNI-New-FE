import UserIcon from "components/icons/UserIcon";
import Card from "components/Card";
import DescriptionCard from "components/DescriptionCard";
import GoBack from "components/GoBack";
import { Loading } from "components/Loading";
import PdfContent from "components/PdfContent";
import { Button } from "components/ui/button";
// import { HrRoutes } from "constants/RouterConstants";
import { useParams, useRouter } from "next/navigation";
import {
  useGetJobApplication,
  usePatchJobApplicationPreferred,
  usePatchJobApplicationShortlisted,
} from "@/features/hr/controllers/hrJobApplicationsController";
import { toast } from "sonner";
// import { format } from "date-fns";

const SubmittedApplicationDetail = () => {
  const params = useParams();
  const router = useRouter();
  const { data, isLoading } = useGetJobApplication({
    id: params?.appID as string,
  });

  const { patchJobApplicationShortlisted, isLoading: isUpdating } =
    usePatchJobApplicationShortlisted();

  const { patchJobApplicationPreferred, isLoading: isReUpdating } =
    usePatchJobApplicationPreferred();

  const handleShortlist = async () => {
    try {
      await patchJobApplicationShortlisted({
        id: params?.appID as string,
        body: {
          status: "SHORTLISTED",
        },
      })();
      toast.success("Applicant shortlisted successfully");
      router.back();
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const handlePreferred = async () => {
    try {
      await patchJobApplicationPreferred({
        id: params?.appID as string,
        body: {
          status: "PREFERRED",
        },
      })();
      toast.success("Applicant preferred successfully");
      router.back();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  // @ts-ignore
  const applicationData = data?.data;

  const coverLetterPdf = {
    name: "Cover Letter",
    document: applicationData?.cover_letter,
  };

  const resumePdf = {
    name: "Resume",
    document: applicationData?.resume,
  };

  // Format date if it exists
  const formattedInterviewDate = applicationData?.interview_date
    ? new Date(applicationData.interview_date).toLocaleDateString("en-US")
    : "Not scheduled";

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <GoBack />
        {applicationData?.status === "APPLIED" && (
          <Button onClick={handleShortlist} disabled={isUpdating}>
            <UserIcon />{" "}
            {isUpdating ? "Shortlisting..." : "Shortlist Applicant"}
          </Button>
        )}
        {applicationData?.status === "ACCEPTED" && (
          <Button onClick={handlePreferred} disabled={isReUpdating}>
            <UserIcon />{" "}
            {isUpdating ? "Marking as Preferred..." : "Mark as Preferred"}
          </Button>
        )}
      </div>

      <Card className='space-y-8'>
        <h4 className='text-xl font-semibold'>
          {applicationData?.applicant_name}
        </h4>

        {/* Application Details */}
        <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
          <DescriptionCard
            aside
            label='Applicant Email'
            description={applicationData?.applicant_email}
          />
          <DescriptionCard
            aside
            label='Employment Type'
            description={applicationData?.employment_type}
          />
          <DescriptionCard
            aside
            label='Position Applied'
            description={applicationData?.position_applied}
          />
          <DescriptionCard
            aside
            label='Application Status'
            description={applicationData?.status}
          />
          <DescriptionCard
            aside
            label='Interview Date'
            description={formattedInterviewDate}
          />
          <DescriptionCard
            aside
            label='Application Date'
            description={new Date(
              applicationData?.created_datetime
            ).toLocaleDateString("en-US")}
          />
        </div>

        {/* Notes */}
        {applicationData?.application_notes && (
          <div className='space-y-2'>
            <h4 className='font-medium'>Application Notes</h4>
            <div className='p-4 bg-gray-50 rounded-md'>
              {applicationData.application_notes}
            </div>
          </div>
        )}

        {/* Referees Section */}
        <div className='space-y-4'>
          <h4 className='font-medium text-lg'>Referees</h4>
          <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
            {/* @ts-ignore */}
            {applicationData?.referees?.map((referee, index) => (
              <div key={referee.id} className='p-4 border rounded-md space-y-3'>
                <h4 className='font-medium'>Referee {index + 1}</h4>
                <DescriptionCard
                  aside
                  label='Name'
                  description={referee?.name}
                />
                <DescriptionCard
                  aside
                  label='Email'
                  description={referee?.email}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Documents Section */}
        <div className='space-y-4'>
          <h4 className='font-medium text-lg'>Documents</h4>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            <div>
              <h5 className='mb-2 font-medium'>Cover Letter</h5>
              <PdfContent pdf={coverLetterPdf} />
            </div>
            <div>
              <h5 className='mb-2 font-medium'>Resume</h5>
              <PdfContent pdf={resumePdf} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SubmittedApplicationDetail;
