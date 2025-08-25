import Card from "components/Card";
import welcomePng from "assets/imgs/welcome.png";
import {
  VendorsResultsData,
  TVendors,
  KeyStaff,
  AssociatedEntities,
  Questionairs,
} from "definations/procurement-types/vendors";

const Questionnaire = (data: VendorsResultsData) => {
  console.log({ data });

  return (
    <div className='space-y-5'>
      <div className='bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
        <div className='p-5 '>
          <h4 className='font-bold text-lg'>Vendor Questionniare</h4>
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
            <h6>{data?.phone_numbers}</h6>
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
            Majority Shareholders & Directors
          </h4>
        </div>

        <hr />

        <div className='p-5 grid grid-cols-2 gap-5'>
          {data?.share_holders.map((share: TVendors, index: number) => (
            <Card key={index} className='border-yellow-darker space-y-3'>
              <div className='flex items-center gap-5'>
                <h4 className='w-full max-w-[140px]  font-medium'>
                  Branch Address:
                </h4>
                <h4>{share.address}</h4>
              </div>
              <div className='flex items-center gap-5'>
                <h4 className='w-full max-w-[140px]  font-medium'>
                  Contact Person:
                </h4>
                <h4>{share.name}</h4>
              </div>
              <div className='flex items-center gap-5'>
                <h4 className='w-full max-w-[140px]  font-medium'>Tel:</h4>
                <h4>{share.phone_number}</h4>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className='bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
        <div className='p-5 '>
          <h4 className='font-bold text-lg'>
            Names & Qualifications of Key Staff
          </h4>
        </div>

        <hr />

        <div className='p-5 grid grid-cols-2 gap-5'>
          {data?.key_staff.map((keyStaff: KeyStaff, index: number) => (
            <Card key={index} className='border-yellow-darker space-y-3'>
              <div className='flex items-center gap-5'>
                <h4 className='w-full max-w-[140px]  font-medium'>Name:</h4>
                <h4>{keyStaff.name}</h4>
              </div>
              <div className='flex items-center gap-5'>
                <h4 className='w-full max-w-[140px]  font-medium'>
                  Qualification:
                </h4>
                <h4>{keyStaff.qualification}</h4>
              </div>
              <div className='flex items-center gap-5'>
                <h4 className='w-full max-w-[140px]  font-medium'>Tel:</h4>
                <h4>{keyStaff.phone_number}</h4>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className='bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
        <div className='p-5 '>
          <h4 className='font-bold text-lg'>
            Subsidiaries, Associates, Affiliates or technical Partners
          </h4>
        </div>

        <hr />

        <div className='p-5 grid grid-cols-2 gap-5'>
          {data?.associated_entities.map(
            (entity: AssociatedEntities, index: number) => (
              <Card key={index} className='border-yellow-darker space-y-3'>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[140px] font-medium'>Name:</h4>
                  <h4>{entity.name}</h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[140px] font-medium'>
                    Qualification:
                  </h4>
                  <h4>{entity.address}</h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[140px] font-medium'>
                    Entity Type:
                  </h4>
                  <h4>{entity.entity_type}</h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[140px] font-medium'>Tel:</h4>
                  <h4>{entity.phone_number}</h4>
                </div>
              </Card>
            )
          )}
        </div>
      </div>

      <div className='bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
        <div className='p-5 '>
          <h4 className='font-bold text-lg'>Questions</h4>
        </div>

        <hr />

        <div className='p-5 grid gap-5 grid-cols-2'>
          {data?.questionnaires?.map((question: Questionairs) => (
            <div key={question.questionaire} className='space-y-2'>
              <h2 className='text-yellow-darker font-semibold'>
                {question.name}
              </h2>
              <h6>{question.response}</h6>
            </div>
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

        {data?.key_clients ? (
          <div className='p-5 grid grid-cols-2 gap-5'>
            {data?.key_clients.map((client: TVendors, index: number) => (
              <Card key={index} className='border-yellow-darker space-y-3'>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[140px] font-medium'>
                    Contact Address:
                  </h4>
                  <h4>{client.address}</h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[140px] font-medium'>
                    Contact Person:
                  </h4>
                  <h4>{client.name}</h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[140px] font-medium'>Tel:</h4>
                  <h4>{client.phone_number}</h4>
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
