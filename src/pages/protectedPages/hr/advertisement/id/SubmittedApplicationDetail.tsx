import UserIcon from "components/icons/UserIcon";
import Card from "components/shared/Card";
import DescriptionCard from "components/shared/DescriptionCard";
import GoBack from "components/shared/GoBack";
import { Loading } from "components/shared/Loading";
import PdfContent from "components/shared/PdfContent";
import { Button } from "components/ui/button";
import { HrRoutes } from "constants/RouterConstants";
import { useNavigate, useParams } from "react-router-dom"; 
import { useGetJobApplicationQuery, usePatchJobApplicationMutation, usePatchJobApplicationShortlistedMutation } from "services/hrApi/hr-job-applications";
import { toast } from "sonner";

const SubmittedApplicationDetail = () => {
  const params = useParams();
  const navigate = useNavigate()
  const { data, isLoading } = useGetJobApplicationQuery({
    id: params?.appID as string,
  });

  const [patchJobApplicationShortlisted, { isLoading: isUpdating }] =
  usePatchJobApplicationShortlistedMutation(); 
  const handleShortlist = async () => {
    if(data?.data?.status !== "APPLIED"){
    try {
      await patchJobApplicationShortlisted({
        id: params?.appID as string,
        body: {
          status: "SHORTLISTED",
        },
      }).unwrap();
      toast.success("Applicant shortlisted successfully");
      navigate(-1)
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }}else{
      toast.error("Applicant needs to be interviewed first")
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
          {
            data?.data?.referees?.map((el,l) => (
              <div key={l} className='space-y-4'>
                <h4 className='font-medium'>Referee {(l + 1)}</h4>
                <DescriptionCard
                  aside
                  label='Name'
                  description={el?.name}
                />
                <DescriptionCard
                  aside
                  label='Email'
                  description={el?.email}
                />
              </div>
            ))
          }
           
        </div>

        <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
          <PdfContent pdf={pdf} />
        </div>
      </Card>
    </div>
  );
};

export default SubmittedApplicationDetail;
