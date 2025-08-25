import Card from "components/Card";
import {
  ProductionEquipments,
  VendorsResultsData,
} from "definations/procurement-types/vendors";

const TechnicalCapability = (data: VendorsResultsData) => {
  return (
    <div className='space-y-5'>
      <div className='bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
        <div className='p-5 '>
          <h4 className='font-bold text-lg'>Technical Capability</h4>
        </div>

        <hr />

        <div className='p-5 grid gap-5'>
          <div className='space-y-2'>
            <h2 className='text-yellow-darker font-semibold'>
              Installed Capacity
            </h2>
            <h6>{data.installed_capacity}</h6>
          </div>
          <div className='space-y-2'>
            <h2 className='text-yellow-darker font-semibold'>
              Latest Capacity and Utilization
            </h2>
            <h6>{data.lagest_capacity_and_utilization}</h6>
          </div>
          <div className='space-y-2'>
            <h2 className='text-yellow-darker font-semibold'>
              Number of operational work shifts
            </h2>
            <h6>{data.number_of_operational_work_shift}</h6>
          </div>
          <div className='space-y-2'>
            <h2 className='text-yellow-darker font-semibold'>
              Provide Brief Details of Quality Control Procedures
            </h2>
            <h6>{data.brief_of_quality_control}</h6>
          </div>
          <div className='space-y-2'>
            <h2 className='text-yellow-darker font-semibold'>
              Provide brief details of sampling procedures
            </h2>
            <h6>{data.brief_of_sampling}</h6>
          </div>
        </div>
      </div>

      <div className='bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
        <div className='p-5 '>
          <h4 className='font-bold text-lg'>Details of Production Equipment</h4>
        </div>

        <hr />

        <div className='p-5 grid grid-cols-2 gap-5'>
          {data.production_equipments.map(
            (equipment: ProductionEquipments, index: number) => (
              <Card key={index} className='border-yellow-darker space-y-3'>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[140px] font-medium'>
                    Equipment Name:
                  </h4>
                  <h4>{equipment.name}</h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[140px] font-medium'>
                    Manufacturer:
                  </h4>
                  <h4>{equipment.manufacturer}</h4>
                </div>
                <div className='flex items-center gap-5'>
                  <h4 className='w-full max-w-[140px] font-medium'>Year:</h4>
                  <h4>{equipment.year}</h4>
                </div>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicalCapability;
