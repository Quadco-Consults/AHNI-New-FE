import DescriptionCard from "components/DescriptionCard";
import { LoadingSpinner } from "components/Loading";
import { Separator } from "components/ui/separator";
import { useParams } from "next/navigation";
import { useGetHrEmergencyList } from "@/features/hr/controllers/hrEmployeeOnboardingAddInfoController";

const AdditionalInfo = () => {
  const { id } = useParams();

  const { data, isLoading: contactsLoading } = useGetHrEmergencyList({
    employee: id as string,
  });

  if (!contactsLoading) console.log(data);

  return (
    <div className=' space-y-10'>
      <h2 className='text-2xl font-medium text-red-500 mt-6'>
        Emergency Contacts
      </h2>

      {contactsLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className='card-wrapper space-y-8'>
            <h4 className='font-bold'>Contact 1</h4>

            <Separator />

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <DescriptionCard
                label='Name'
                description={
                  data?.data.results[0] ? data?.data.results[0].name : undefined
                }
              />
              <DescriptionCard
                label='Relationship'
                description={
                  data?.data.results[0]
                    ? data?.data.results[0].relationship
                    : undefined
                }
              />
              <DescriptionCard
                label='Email'
                description={
                  data?.data.results[0]
                    ? data?.data.results[0].email_address
                    : undefined
                }
              />
              <DescriptionCard
                label='Address'
                description={
                  data?.data.results[0]
                    ? data?.data.results[0].address
                    : undefined
                }
              />
              <DescriptionCard
                label='Phone Number'
                description={
                  data?.data.results[0]
                    ? data?.data.results[0].home_phone
                    : undefined
                }
              />
              <DescriptionCard
                label='Other Number'
                description={
                  data?.data.results[0]
                    ? data?.data.results[0].mobile_phone
                    : undefined
                }
              />
            </div>
          </div>

          <div className='card-wrapper space-y-8'>
            <h4 className='font-bold'>Contact 2</h4>

            <Separator />

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <DescriptionCard
                label='Name'
                description={
                  data?.data.results[1] ? data?.data.results[1].name : undefined
                }
              />
              <DescriptionCard
                label='Relationship'
                description={
                  data?.data.results[1]
                    ? data?.data.results[1].relationship
                    : undefined
                }
              />
              <DescriptionCard
                label='Email'
                description={
                  data?.data.results[1]
                    ? data?.data.results[1].email_address
                    : undefined
                }
              />
              <DescriptionCard
                label='Address'
                description={
                  data?.data.results[1]
                    ? data?.data.results[1].address
                    : undefined
                }
              />
              <DescriptionCard
                label='Phone Number'
                description={
                  data?.data.results[1]
                    ? data?.data.results[1].home_phone
                    : undefined
                }
              />
              <DescriptionCard
                label='Other Number'
                description={
                  data?.data.results[1]
                    ? data?.data.results[1].mobile_phone
                    : undefined
                }
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdditionalInfo;
