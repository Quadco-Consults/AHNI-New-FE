import { zodResolver } from "@hookform/resolvers/zod";
import WriteDialog from "components/modals/dailog/WriteDialog";
import Card from "components/Card";
import { Button } from "components/ui/button";
import { FeedbackGrievianceManagementSchema } from "definations/hr-types/grieviance-management/";
import { VendorsResultsData } from "definations/procurement-types/vendors";
import { useAppDispatch } from "hooks/useStore";

import { EditIcon } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useUpdateGrievianceManagementMutation } from "@/features/hr/controllers/grievance-management//grievanceManagementController";
import { toast } from "sonner";

const Feedback = (data: VendorsResultsData) => { 
type FeedbackFormValues = {
      // Define your form fields here
      feedback: string; 
    };
    
      const [isDialogOpen, setDialogOpen] = useState(false);
    const form = useForm<FeedbackFormValues>({
      defaultValues: {
        feedback: '', 
      },
      resolver: zodResolver(FeedbackGrievianceManagementSchema),
    });
    
    const dispatch = useAppDispatch();
    const [updateGrievianceManagement, {isLoading: isLoading}] = useUpdateGrievianceManagementMutation({})
    const onSubmit: SubmitHandler<FeedbackFormValues> =  async (details: any) => {
       
        try {
          const formData = new FormData();
          formData.append("title", data.title);  
          formData.append("description", data.description);   
          formData.append("findings", data.findings);   
          formData.append("resolution", data.resolution); 
          formData.append("feedback", details.feedback);   
      
          // @ts-ignore
          await updateGrievianceManagement({
            id: data?.id,
            body: formData
          });
          toast.success("Feedback submitted successfully"); 
          setDialogOpen(false)
        } catch (error) {
          toast.error("Something went wrong"); ;
        }
      };

  return (
    <div className='bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
      <div className='p-5 flex justify-between items-center'>
        <h4 className='font-bold capitalize text-lg'>{data?.title}</h4>
        <Button onClick={() => { setDialogOpen(true)}} className='bg-alternate text-primary py-2 px-4 rounded-md'>
          <EditIcon />
          Write Feedback
        </Button>
      </div>
      <div className='flex flex-col p-5 gap-4'>
        <Card className='flex flex-col gap-2'>
          <div className='flex w-full justify-between'>
            <h4 className='font-bold text-md'>Feedback</h4>{/* 
            <p className='text-md'>2:00.pm, 20-10-2024 </p> */}
          </div>

          <p className='text-sm'>
           {data?.feedback}
          </p>
           
        </Card>{" "}
         
      </div>
        <WriteDialog
                     open={isDialogOpen}
                     form={form}
                     name={"feedback"}  
                     title={"Feedback"}
                     onCancel={() => setDialogOpen(false)}
                     onSubmit={onSubmit} 
                     loading={isLoading}
                  />
    </div>
  );
};

export default Feedback;
