import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import Card from "components/shared/Card";
import { useParams } from "react-router-dom";
import { consultancyAPIs } from "services/cAndGApi/consultancy";
import { toast } from "sonner";

const ConsultancyApplicationDetails = () => {
  const params = useParams();
  const getConsultancyAppDetails = consultancyAPIs.useGetSingleConsultancyApplicationQuery({
    id: params.id,
  });
  const consultancyDetails = getConsultancyAppDetails?.data;
  // const getConsulTancyDocuments = ConsultancyApplicationsDocsApi.useGetConsultancysApplicationDocsQuery({ params: { id: params.id } });
  const [shortListCandidateMutation, shortListCandidateMutationResults] = consultancyAPIs.useShortlistConsultant1Mutation();

  const HandleShortListCandiate = async () => {
    try {
      const result = await shortListCandidateMutation({
        selected_applications: [params.id],
      }).unwrap();
      toast.success(result?.message);
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <main className="w-full flex flex-col justify-between items-center gap-y-[1rem] text-[#1A0000]">
      <div className="w-full flex items-center justify-between">
        <BackNavigation />
        <FormButton className="flex gap-x-[.5rem] items-center" onClick={HandleShortListCandiate} loading={shortListCandidateMutationResults.isLoading}>
          <PersonSvg />
          <p>Shortlist Consultant</p>
        </FormButton>
      </div>
      <Card className="w-full flex flex-col gap-y-[1.25rem]">
        <p className="text-xl font-semibold">{consultancyDetails?.applicant_name}</p>{" "}
        <div className="w-full flex flex-wrap items-center gap-x-[3%]">
          {consultancyDetails?.referees?.map((referee: any, index: number) => {
            return (
              <div className="w-[30%] flex flex-col gap-y-[1.25rem]" key={index}>
                <p className="font-semibold">Referee {index + 1}</p>
                <div className="w-full flex flex-col gap-y-[.75rem] text-sm">
                  <p className="flex justify-between">
                    {"Name "}
                    <span className="w-[60%]">{referee?.name}</span>
                  </p>
                  <p className="flex justify-between">
                    {"Email "}
                    <span className="w-[60%]">{referee?.email}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </main>
  );
};

export default ConsultancyApplicationDetails;

const PersonSvg = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        opacity="0.4"
        d="M12.0572 1.75C14.2479 1.74999 15.9686 1.74998 17.312 1.93059C18.6886 2.11568 19.7809 2.50272 20.6391 3.36091C21.4973 4.21911 21.8843 5.31137 22.0694 6.68802C22.25 8.03144 22.25 9.7521 22.25 11.9428V11.9428V12.0572V12.0572C22.25 14.2479 22.25 15.9686 22.0694 17.312C21.8843 18.6886 21.4973 19.7809 20.6391 20.6391C19.7809 21.4973 18.6886 21.8843 17.312 22.0694C15.9686 22.25 14.2479 22.25 12.0572 22.25H12.0572H11.9428H11.9428C9.7521 22.25 8.03144 22.25 6.68802 22.0694C5.31137 21.8843 4.21911 21.4973 3.36091 20.6391C2.50272 19.7809 2.11568 18.6886 1.93059 17.312C1.74998 15.9686 1.74999 14.2479 1.75 12.0572V11.9428C1.74999 9.75212 1.74998 8.03144 1.93059 6.68802C2.11568 5.31137 2.50272 4.21911 3.36091 3.36091C4.21911 2.50272 5.31137 2.11568 6.68802 1.93059C8.03144 1.74998 9.75212 1.74999 11.9428 1.75H12.0572Z"
        fill="white"
      />
      <path d="M8.73797 9.5C8.73797 7.70407 10.1956 6.25 11.9915 6.25C13.7874 6.25 15.2451 7.70407 15.2451 9.5C15.2451 11.2959 13.7874 12.75 11.9915 12.75C10.1956 12.75 8.73797 11.2959 8.73797 9.5Z" fill="white" />
      <path d="M6.98208 17.5425C6.68249 17.2564 6.67151 16.7817 6.95754 16.4821C9.57054 13.7453 14.3841 13.5975 17.0515 16.4917C17.3322 16.7963 17.3129 17.2708 17.0083 17.5515C16.8641 17.6844 16.6818 17.75 16.5 17.75H7.5C7.31383 17.75 7.12736 17.6812 6.98208 17.5425Z" fill="white" />
    </svg>
  );
};
