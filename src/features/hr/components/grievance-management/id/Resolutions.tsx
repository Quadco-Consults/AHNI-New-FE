"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import WriteDialog from "@/components/modals/dialog/WriteDialog";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FindingsGrievianceManagementSchema, ResolutionGrievianceManagementSchema } from "@/features/hr/types/grieviance-management";
import { VendorsResultsData } from "definations/procurement-types/vendors";
import { useAppDispatch } from "@/hooks/useStore";

import { EditIcon, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useUpdateGrievance, usePatchGrievance } from "@/features/hr/controllers/grievanceController";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
    const { updateGrievance, isLoading } = useUpdateGrievance(data?.id || "")
    const { patchGrievance, isLoading: isPatching } = usePatchGrievance(data?.id || "")

    const onSubmit: SubmitHandler<ResolutionFormValues> =  async (details: any) => {

        try {
          await updateGrievance({
            ...details,
            type: data?.title || data?.type || "Complaint",
            title: data?.title || data?.type || "Complaint",
            description: data?.description || "Grievance description",
            whistle_blower: data?.whistle_blower || "Anonymous"
          });
          toast.success("Resolution submitted successfully");
          setDialogOpen(false)
        } catch (error) {
          toast.error("Something went wrong");
        }
      };

    const handleResolveToggle = async () => {
      try {
        await patchGrievance({
          is_resolved: !data?.is_resolved
        });
        toast.success(data?.is_resolved ? "Grievance reopened" : "Grievance marked as resolved");
        // Refresh the page to show updated status
        window.location.reload();
      } catch (error) {
        toast.error("Failed to update grievance status");
      }
    };

  return (
    <div className='bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
      <div className='p-5 flex justify-between items-center'>
        <div className='flex items-center gap-3'>
          <h4 className='font-bold capitalize text-lg'>{data?.title}</h4>
          <Badge
            className={cn(
              "px-3 py-1 rounded-lg capitalize",
              data?.is_resolved
                ? "bg-green-50 text-green-600 border-green-200"
                : "bg-red-50 text-red-600 border-red-200"
            )}
          >
            {data?.is_resolved ? "Resolved" : "Unresolved"}
          </Badge>
        </div>
        <div className='flex gap-2'>
          <Button
            onClick={handleResolveToggle}
            disabled={isPatching}
            className={cn(
              "py-2 px-4 rounded-md",
              data?.is_resolved
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-green-50 text-green-600 hover:bg-green-100"
            )}
            variant="outline"
          >
            {isPatching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                Updating...
              </>
            ) : (
              <>
                {data?.is_resolved ? (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Reopen
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Resolved
                  </>
                )}
              </>
            )}
          </Button>
          <Button onClick={() => { setDialogOpen(true)}} className='bg-alternate text-primary py-2 px-4 rounded-md'>
            <EditIcon className="w-4 h-4 mr-2" />
            Edit Resolution
          </Button>
        </div>
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
