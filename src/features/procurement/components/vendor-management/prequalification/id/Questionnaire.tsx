import Card from "@/components/Card";
import welcomePng from "assets/imgs/welcome.png";
import {
  VendorsResultsData,
  TVendors,
} from "@/features/procurement/types/vendors";

const Questionnaire = (data: VendorsResultsData) => {
  console.log({ data });
  console.log("🔍 Key Clients Data:", {
    hasKeyClients: !!data?.key_clients,
    keyClientsLength: data?.key_clients?.length,
    keyClientsData: data?.key_clients,
    firstClient: data?.key_clients?.[0]
  });

  return (
    <div className='space-y-5'>
      <div className='bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
        <div className='p-5 '>
          <h4 className='font-bold text-lg'>Vendor details</h4>
        </div>

        <hr />

        <div className='p-5 grid gap-5'>
          <div className='space-y-2'>
            <h2 className='text-yellow-darker font-semibold'>
              Company Chairman/Managing Director
            </h2>
            <h6>{data?.company_chairman}</h6>
          </div>
          <div className='space-y-2'>
            <h2 className='text-yellow-darker font-semibold'>
              Contact Telephone
            </h2>
            <h6>{data?.mobile_number_1 || data?.phone_number || "-"}</h6>
          </div>
          <div className='space-y-2'>
            <h2 className='text-yellow-darker font-semibold'>
              Company&apos; Bankers
            </h2>
            <h6>{data?.bank_name}</h6>
          </div>
          <div className='space-y-2'>
            <h2 className='text-yellow-darker font-semibold'>
              Company&apos; Bankers Address
            </h2>
            <h6>{data?.bank_address}</h6>
          </div>
          <div className='space-y-2'>
            <h2 className='text-yellow-darker font-semibold'>
              Number of permanent staff:
            </h2>
            <h6>{data?.key_staff?.length}</h6>
          </div>
          <div className='space-y-2'>
            <h2 className='text-yellow-darker font-semibold'>
              Company&apos; Tax Identification Number (TIN)
            </h2>
            <h6>{data?.tin}</h6>
          </div>
        </div>
      </div>

      <div className='bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
        <div className='p-5 '>
          <h4 className='font-bold text-lg'>Branch Office(s) Address</h4>
        </div>

        <hr />

        <div className='p-5 grid grid-cols-2 gap-5'>
          {data?.branches.map((branch: TVendors, index: number) => (
            <Card key={index} className='border-yellow-darker space-y-3'>
              <div className='flex items-center gap-5'>
                <h4 className='w-full max-w-[140px] font-medium '>
                  Branch Address :
                </h4>
                <h4>{branch.address}</h4>
              </div>
              <div className='flex items-center gap-5'>
                <h4 className='w-full max-w-[140px] font-medium'>
                  Contact Person :
                </h4>
                <h4>{branch.name}</h4>
              </div>
              <div className='flex items-center gap-5'>
                <h4 className='w-full max-w-[140px] font-medium'>Tel :</h4>
                <h4>{branch.phone_number}</h4>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className='bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
        <div className='p-5 '>
          <h4 className='font-bold text-lg'>
            Name and address of key client who we can contact for references (if
            any)
          </h4>
        </div>

        <hr />

        {data?.key_clients && data.key_clients.length > 0 ? (
          <div className='p-5 grid grid-cols-2 gap-5'>
            {data?.key_clients.map((client: any, index: number) => (
              <Card key={index} className='border-yellow-darker space-y-3'>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[140px] font-medium'>
                    Company Name:
                  </h4>
                  <h4>{client.company_name || "-"}</h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[140px] font-medium'>
                    Company Address:
                  </h4>
                  <h4>{client.company_address || "-"}</h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[140px] font-medium'>
                    Contact Person:
                  </h4>
                  <h4>{client.contact_person || "-"}</h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[140px] font-medium'>
                    Position:
                  </h4>
                  <h4>{client.contact_person_position || "-"}</h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[140px] font-medium'>Email:</h4>
                  <h4>{client.contact_person_email || "-"}</h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[140px] font-medium'>Tel:</h4>
                  <h4>{client.contact_person_phone || "-"}</h4>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className='p-5 text-center space-y-4'>
            <img src={welcomePng} alt='img' className='mx-auto' width={150} />
            <h6>No response for in this section</h6>
          </div>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
