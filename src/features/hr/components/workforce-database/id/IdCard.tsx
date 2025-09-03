import avatar from "assets/imgs/avartar.png";
import DescriptionCard from "components/DescriptionCard";
import { Button } from "components/ui/button";
import PrinterIcon from "components/icons/PrinterIcon";
import { EmployeeOnboarding } from "definations/hr-types/employee-onboarding";

const IdCard = ({ info }: { info: EmployeeOnboarding }) => {
  const { data } = info;
  console.log(data);

  return (
    <div className='space-y-10'>
      <div className='card-wrapper space-y-6'>
        <div className='flex items-center gap-x-4'>
          <img src={data?.passport_file || data?.passport_url || '/default-avatar.png'} alt='avatar' width={100} />
          <h4 className='font-semibold'>
            {data?.legal_firstname} {data?.legal_lastname}
          </h4>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          <div className='space-y-6'>
            <DescriptionCard
              label='Position Title'
              description={data?.designation?.name || data?.position || "N/A"}
            />
            <DescriptionCard
              label='Phone Number'
              description={data?.phone_number}
            />
          </div>

          <div className='space-y-6'>
            <DescriptionCard
              label='Employee Number'
              description={data?.other_number}
            />

            <div className='space-y-2'>
              <p className='font-bold'>Employee Signature</p>

              <img src={data?.signature_file || data?.signature_url || '/default-signature.png'} alt='signature' width={100} />
            </div>
          </div>

          <div className='space-y-6'>
            <DescriptionCard
              label='Email Address'
              description='jamesseptimus@ahnigeria.org'
            />
            <DescriptionCard label='Date' description={data?.date_of_birth} />
          </div>
        </div>

        <Button>
          <PrinterIcon /> Print Passport
        </Button>
      </div>
    </div>
  );
};

export default IdCard;
