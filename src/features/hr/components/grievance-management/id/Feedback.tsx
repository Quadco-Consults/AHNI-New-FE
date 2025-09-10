"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import WriteDialog from "@/components/modals/dialog/WriteDialog";
import Card from "components/Card";
import { Button } from "components/ui/button";
import { FeedbackGrievianceManagementSchema } from "@/features/hr/types/grieviance-management/";
import { VendorsResultsData } from "definations/procurement-types/vendors";
import { useAppDispatch } from "hooks/useStore";

import { EditIcon } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useUpdateGrievance } from "@/features/hr/controllers/grievanceController";
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
    const { updateGrievance, isLoading } = useUpdateGrievance(data?.id || "")
    const onSubmit: SubmitHandler<FeedbackFormValues> =  async (details: any) => {
       
        try {
          await updateGrievance({
            ...details,
            type: data?.title || data?.type || "Complaint",
            title: data?.title || data?.type || "Complaint",
            description: data?.description || "Grievance description",
            whistle_blower: data?.whistle_blower || "Anonymous"
          });
          toast.success("Feedback submitted successfully"); 
          setDialogOpen(false)
        } catch (error: any) {
          console.error("Feedback submission error:", error);
          toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
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
