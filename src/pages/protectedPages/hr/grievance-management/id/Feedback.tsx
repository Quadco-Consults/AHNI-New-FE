import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { VendorsResultsData } from "definations/procurement-types/vendors";

import { EditIcon } from "lucide-react";

const Feedback = (data: VendorsResultsData) => {
  console.log({ data });

  return (
    <div className='bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
      <div className='p-5 flex justify-between items-center'>
        <h4 className='font-bold text-lg'>Misuse of Company Funds</h4>
        <Button className='bg-alternate text-primary py-2 px-4 rounded-md'>
          <EditIcon />
          Write Feedback
        </Button>
      </div>
      <div className='flex flex-col p-5 gap-4'>
        <Card className='flex flex-col gap-2'>
          <div className='flex w-full justify-between'>
            <h4 className='font-bold text-md'>HR Manager</h4>
            <p className='text-md'>2:00.pm, 20-10-2024 </p>
          </div>

          <p className='text-sm'>
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
        </Card>{" "}
        <Card className='flex flex-col gap-2'>
          <div className='flex w-full justify-between'>
            <h4 className='font-bold text-md'>HR Manager</h4>
            <p className='text-md'>2:00.pm, 20-10-2024 </p>
          </div>

          <p className='text-sm'>
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
        </Card>
      </div>
    </div>
  );
};

export default Feedback;
