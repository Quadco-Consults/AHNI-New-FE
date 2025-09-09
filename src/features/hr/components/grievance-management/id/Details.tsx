"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import WriteDialog from "@/components/modals/dialog/WriteDialog";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { DialogType } from "constants/dailogs";
import {
  FindingsGrievianceManagementSchema,
  GrievianceManagementSchema,
} from "@/features/hr/types/grieviance-management";
import { useAppDispatch } from "hooks/useStore";
import { cn } from "lib/utils";

import { EditIcon } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useUpdateGrievance } from "@/features/hr/controllers/grievanceController";
import { toast } from "sonner";
import { openDialog } from "store/ui";
import { z } from "zod";
export type TFormValues = z.infer<typeof FindingsGrievianceManagementSchema>;

const Details = (data: any) => {
  type FindingsFormValues = {
    // Define your form fields here
    findings: string;
  };

  const [isDialogOpen, setDialogOpen] = useState(false);
  const form = useForm<FindingsFormValues>({
    defaultValues: {
      findings: "",
    },
    resolver: zodResolver(FindingsGrievianceManagementSchema),
  });

  const dispatch = useAppDispatch();
  const { updateGrievance, isLoading } = useUpdateGrievance(data?.id || "");
  const onSubmit: SubmitHandler<FindingsFormValues> = async (details: any) => {
    try {
      await updateGrievance({
        ...details,
        type: data?.title || data?.type || "Complaint",
        title: data?.title || data?.type || "Complaint",
        description: data?.description || "Grievance description",
        whistle_blower: data?.whistle_blower || "Anonymous"
      });
      toast.success("Findings submitted successfully");
      setDialogOpen(false);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className='bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
      <div className='p-5 flex justify-between items-center'>
        <h4 className='font-bold capitalize text-lg'>{data?.title}</h4>
      </div>
      <div className='flex flex-col p-5 gap-4'>
        <Card>
          <h4 className='font-bold text-md'>Description</h4>
          <p className='py-4 text-sm'>{data?.description}</p>
        </Card>
        <Card className='grid grid-cols-2'>
          <div className='flex flex-col gap-2'>
            <h4 className='font-bold text-md'>Submission Date</h4>
            <p className='text-sm'>
              {moment(data?.created_datetime).format("DD-MMM-YYYY")}
            </p>
          </div>
          <div className='flex flex-col gap-2'>
            <h4 className='font-bold text-md'>Status</h4>
            {/* 
            <p className='text-sm'>{data?.is_resolved ? "Resolved" : "Unresolved"}</p> */}
            <Badge
              className={cn(
                "p-1 rounded-lg w-fit capitalize",
                data?.is_resolved === true
                  ? "bg-green-50 text-green-500"
                  : "bg-red-50 text-red-500"
              )}
            >
              {data?.is_resolved === true
                ? "Resolved"
                : ("Unresolved" as string)}
            </Badge>
          </div>
        </Card>
        <Card className='flex flex-col gap-2'>
          <div className='flex w-full justify-between'>
            <h4 className='font-bold text-md'>Investigation</h4>
            <Button
              onClick={() => {
                setDialogOpen(true);
              }}
              className='bg-alternate text-primary py-2 px-4 rounded-md'
            >
              <EditIcon />
              Edit
            </Button>
          </div>
          <h4 className='font-bold text-md'>Findings</h4>
          <p className='text-sm'>{data?.findings}</p>
        </Card>
      </div>
      <WriteDialog
        open={isDialogOpen}
        form={form}
        name={"findings"}
        title={"Findings"}
        onCancel={() => setDialogOpen(false)}
        onSubmit={onSubmit}
        loading={isLoading}
      />
    </div>
  );
};

export default Details;
