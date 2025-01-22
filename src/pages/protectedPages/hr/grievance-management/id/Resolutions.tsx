import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { VendorsResultsData } from "definations/procurement-types/vendors";

import { EditIcon } from "lucide-react";

const Resolutions = (data: VendorsResultsData) => {
  console.log({ data });

  return (
    <div className='bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
      <div className='p-5 flex justify-between items-center'>
        <h4 className='font-bold text-lg'>Non-Payment of September Salary</h4>
        <Button className='bg-alternate text-primary py-2 px-4 rounded-md'>
          <EditIcon />
          Edit
        </Button>
      </div>
      <div className='flex flex-col p-5 gap-4'>
        <Card className='flex flex-col gap-2'>
          <div className=''>
            <h4 className='font-bold text-md'>Resolution</h4>
            <p className='py-4 text-sm'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi
              praesentium quidem eveniet accusamus nostrum, odit maxime, veniam
              similique commodi nemo voluptate dolorem, non assumenda quam
              tempora modi quibusdam consequuntur ducimus maiores? Corrupti,
              voluptas dolorem doloremque tempore qui magni ipsum vel!
            </p>
            <p className='text-sm'>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Inventore id, tempora velit voluptate magnam dolorum sapiente
              cumque asperiores impedit illo ipsum. Velit natus qui id quam
              aliquid reiciendis hic omnis.
            </p>
          </div>

          <div className=''>
            <h4 className='font-bold text-md'>Actions Taken</h4>
            <p className='py-4 text-sm'>
              1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui
              voluptates temporibus at, aspernatur suscipit modi corporis, illo
              animi, exercitationem voluptatibus ipsam. Dolorem amet odio quae
              doloribus laudantium reiciendis. Labore, rem?
            </p>
            <p className='text-sm'>
              2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui
              voluptates temporibus at, aspernatur suscipit modi corporis, illo
              animi, exercitationem voluptatibus ipsam. Dolorem amet odio quae
              doloribus laudantium reiciendis. Labore, rem?
            </p>
          </div>

          <div className=''>
            <h4 className='font-bold text-md'>Preventative Measures</h4>
            <p className='py-4 text-sm'>
              1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui
              voluptates temporibus at, aspernatur suscipit modi corporis, illo
              animi, exercitationem voluptatibus ipsam. Dolorem amet odio quae
              doloribus laudantium reiciendis. Labore, rem?
            </p>
            <p className='text-sm'>
              2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui
              voluptates temporibus at, aspernatur suscipit modi corporis, illo
              animi, exercitationem voluptatibus ipsam. Dolorem amet odio quae
              doloribus laudantium reiciendis. Labore, rem?
            </p>
          </div>

          <div className=''>
            <h4 className='font-bold text-md'>Conclusion</h4>
            <p className='py-4 text-sm'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi
              praesentium quidem eveniet accusamus nostrum, odit maxime, veniam
              similique commodi nemo voluptate dolorem, non assumenda quam
              tempora modi quibusdam consequuntur ducimus maiores? Corrupti,
              voluptas dolorem doloremque tempore qui magni ipsum vel!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Resolutions;
