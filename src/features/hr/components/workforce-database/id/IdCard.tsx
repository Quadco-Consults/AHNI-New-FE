import avatar from "assets/imgs/avartar.png";
import DescriptionCard from "components/DescriptionCard";
import { Button } from "components/ui/button";
import PrinterIcon from "components/icons/PrinterIcon";
import { EmployeeOnboarding } from "@/features/hr/types/employee-onboarding";

const IdCard = ({ info }: { info: EmployeeOnboarding }) => {
  const data = info?.data || info;

  console.log("🔍 IdCard Debug:");
  console.log("  Raw info prop:", info);
  console.log("  Extracted data:", data);
  console.log("  Position access attempts:");
  console.log("    data?.position?.name:", data?.position?.name);
  console.log("    data?.designation?.name:", data?.designation?.name);
  console.log("    data?.position:", data?.position);
  console.log("  Employee Number access attempts:");
  console.log("    data?.user?.staff_id:", data?.user?.staff_id);
  console.log("    data?.serial_id_code:", data?.serial_id_code);
  console.log("  Email access attempts:");
  console.log("    data?.email:", data?.email);
  console.log("    data?.user?.email:", data?.user?.email);
  console.log("    data?.location?.email:", data?.location?.email);

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
              description={data?.position?.name || data?.designation?.name || data?.position || "N/A"}
            />
            <DescriptionCard
              label='Phone Number'
              description={data?.phone_number || data?.user?.phone || "---"}
            />
          </div>

          <div className='space-y-6'>
            <DescriptionCard
              label='Employee Number'
              description={data?.user?.staff_id || data?.serial_id_code || data?.other_number || "---"}
            />

            <div className='space-y-2'>
              <p className='font-bold'>Employee Signature</p>

              <img src={data?.signature_file || data?.signature_url || '/default-signature.png'} alt='signature' width={100} />
            </div>
          </div>

          <div className='space-y-6'>
            <DescriptionCard
              label='Email Address'
              description={data?.email || data?.user?.email || data?.location?.email || "---"}
            />
            <DescriptionCard label='Date' description={data?.date_of_hire || data?.date_of_birth || "---"} />
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
