import { zodResolver } from "@hookform/resolvers/zod";
import WriteDialog from "components/modals/dailog/WriteDialog";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { FindingsGrievianceManagementSchema, ResolutionGrievianceManagementSchema } from "definations/hr-types/grieviance-management";
import { VendorsResultsData } from "definations/procurement-types/vendors";
import { useAppDispatch } from "hooks/useStore";

import { EditIcon } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useUpdateGrievianceManagementMutation } from "services/hrApi/hr-grieviance-management";
import { toast } from "sonner";

const Resolutions = (data: VendorsResultsData) => {
  
  type ResolutionFormValues = {
      // Define your form fields here
      resolution: string; 
    };
    
      const [isDialogOpen, setDialogOpen] = useState(false);
    const form = useForm<ResolutionFormValues>({
      defaultValues: {
        resolution: '', 
      },
      resolver: zodResolver(ResolutionGrievianceManagementSchema),
    });
    
    const dispatch = useAppDispatch();
    const [updateGrievianceManagement, {isLoading: isLoading}] = useUpdateGrievianceManagementMutation({})
    const onSubmit: SubmitHandler<ResolutionFormValues> =  async (details: any) => {
       
        try {
          const formData = new FormData();
          formData.append("title", data.title);  
          formData.append("description", data.description);   
          formData.append("findings", data.findings);   
          formData.append("resolution", details.resolution);  
      
          // @ts-ignore
          await updateGrievianceManagement({
            id: data?.id,
            body: formData
          }).unwrap();
          toast.success("Resolution submitted successfully"); 
          setDialogOpen(false)
        } catch (error) {
          toast.error("Something went wrong"); ;
        }
      };

  return (
    <div className='bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
      <div className='p-5 flex justify-between items-center'>
        <h4 className='font-bold text-lg'>{data?.title}</h4>
        <Button onClick={() => { setDialogOpen(true)}}   className='bg-alternate text-primary py-2 px-4 rounded-md'>
          <EditIcon />
          Edit
        </Button>
      </div>
      <div className='flex flex-col p-5 gap-4'>
        <Card className='flex flex-col gap-2'>
          <div className=''>
            <h4 className='font-bold text-md'>Resolution</h4>
            <p className='py-4 text-sm'>
              {data?.resolution}
            </p>
             
          </div>

          {/* <div className=''>
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
          </div> */}

         {/*  <div className=''>
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
          </div> */}
        </Card>
      </div>
            <WriteDialog 
               open={isDialogOpen}
               form={form}
               name={"resolution"}  
               title={"Resolution"}
               onCancel={() => setDialogOpen(false)}
               onSubmit={onSubmit} 
               loading={isLoading}
            />
    </div>
  );
};

export default Resolutions;
