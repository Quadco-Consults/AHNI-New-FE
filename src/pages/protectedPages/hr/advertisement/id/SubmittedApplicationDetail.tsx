import UserIcon from "components/icons/UserIcon";
import Card from "components/shared/Card";
import DescriptionCard from "components/shared/DescriptionCard";
import GoBack from "components/shared/GoBack";
import { Loading } from "components/shared/Loading";
import PdfContent from "components/shared/PdfContent";
import { Button } from "components/ui/button";
import { useParams } from "react-router-dom";
import JobApplicationAPI from "services/hrApi/hr-job-applications";
import { toast } from "sonner";

const SubmittedApplicationDetail = () => {
  const params = useParams();

  const { data, isLoading } = JobApplicationAPI.useGetJobApplicationQuery({
    id: params?.appID as string,
  });

  const [patchJobApplication, { isLoading: isUpdating }] =
    JobApplicationAPI.usePatchJobApplicationMutation();

  const handleShortlist = async () => {
    try {
      await patchJobApplication({
        id: params?.appID as string,
        body: {
          status: "shortlisted",
        },
      }).unwrap();
      toast.success("Applicant shortlisted successfully");
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }
  const pdf = {
    name: "document",
    document: data?.data?.cover_letter!,
  };
  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <GoBack />
        <Button onClick={handleShortlist} disabled={isUpdating}>
          <UserIcon /> {isUpdating ? "Shortlisting..." : "Shortlist Applicant"}
        </Button>
      </div>
      <Card className='space-y-8'>
        <h4 className='text-lg font-medium'>{data?.data?.applicant_name}</h4>

        <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
          <div className='space-y-4'>
            <h4 className='font-medium'>Referee 1</h4>
            <DescriptionCard
              aside
              label='Name'
              description={data?.data?.referee_1_name}
            />
            <DescriptionCard
              aside
              label='Email'
              description={data?.data?.referee_1_email}
            />
          </div>
          <div className='space-y-4'>
            <h4 className='font-medium'>Referee 2</h4>
            <DescriptionCard
              aside
              label='Name'
              description={data?.data?.referee_2_name}
            />
            <DescriptionCard
              aside
              label='Email'
              description={data?.data?.referee_2_email}
            />
          </div>
          <div className='space-y-4'>
            <h4 className='font-medium'>Referee 3</h4>
            <DescriptionCard
              aside
              label='Name'
              description={data?.data?.referee_3_name}
            />
            <DescriptionCard
              aside
              label='Email'
              description={data?.data?.referee_3_email}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
          <PdfContent pdf={pdf} />
        </div>
      </Card>
    </div>
  );
};

export default SubmittedApplicationDetail;
