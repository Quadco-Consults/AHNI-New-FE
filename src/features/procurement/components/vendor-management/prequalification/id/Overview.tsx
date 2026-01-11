import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VendorsResultsData } from "definations/procurement-types/vendors";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import FormTextArea from "@/components/atoms/FormTextArea";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

const Overview = (data: VendorsResultsData) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");

  const form = useForm({
    defaultValues: {
      remarks: "",
    },
  });

  const handlePrequalificationAction = async (action: "approve" | "reject", remarks?: string) => {
    setIsProcessing(true);
    try {
      // TODO: Replace with actual API call
      console.log(`${action === "approve" ? "Approving" : "Rejecting"} vendor:`, data.id, remarks);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Vendor ${action === "approve" ? "approved" : "rejected"} successfully!`);
      setDialogOpen(false);
      
      // Refresh the page or update state
      window.location.reload();
      
    } catch (error) {
      toast.error(`Failed to ${action} vendor`);
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const onSubmit = (formData: any) => {
    handlePrequalificationAction(actionType, formData.remarks);
  };

  const openActionDialog = (action: "approve" | "reject") => {
    setActionType(action);
    setDialogOpen(true);
    form.reset();
  };

  return (
    <div className='bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
      <div className='p-5 flex justify-between items-center'>
        <h4 className='font-bold text-lg'>Profile Details</h4>
      </div>
      <hr />

      <div className='p-5 space-y-8'>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Vendor Name</h4>
          <h4>{data?.company_name}</h4>
        </div>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Type of Business</h4>
          <h4>{data?.type_of_business}</h4>
        </div>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Company Reg No</h4>
          <h4>{data?.company_registration_number}</h4>
        </div>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Evaluation Status</h4>
          <div>
            <Badge
              className={cn(
                "px-3 py-2",
                data?.status === "Approved" && "bg-green-200 text-green-500",
                data?.status === "Rejected" && "bg-red-200 text-red-500",
                data?.status === "Pending" && "bg-yellow-200 text-yellow-500"
              )}
            >
              {data?.status}
            </Badge>
          </div>
        </div>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Company Address</h4>
          <h4>{data?.company_address}</h4>
        </div>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>State</h4>
          <h4>{data?.state}</h4>
        </div>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Account Name</h4>
          <h4>{data?.account_name || "-"}</h4>
        </div>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Account Number</h4>
          <h4>{data?.account_number || "-"}</h4>
        </div>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Bank Name</h4>
          <h4>{data?.bank_name}</h4>
        </div>{" "}
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Bank Address</h4>
          <h4>{data?.bank_address}</h4>
        </div>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Company Email</h4>
          <h4>{data?.email}</h4>
        </div>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Company Website</h4>
          {data?.website ? (
            <a href={data.website} className='hover:underline'>
              {data.website}
            </a>
          ) : (
            <h4>-</h4>
          )}
        </div>
        {/* <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Active Company Telephone Number</h4>
          <h4>{data?.phone_number}</h4>
        </div>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Submitted Category</h4>
          <h4>{}</h4>
        </div>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Date Submitted</h4>
          <h4>{}</h4>
        </div>
        <div className='grid grid-cols-2 items-center'>
          <h4 className='font-bold'>Bank Account</h4>
          <h4>{}</h4>
        </div> */}
        
        {/* Prequalification Actions */}
        {data?.status === "Pending" && (
          <div className='flex justify-end gap-3 pt-4 border-t'>
            <Button 
              variant="outline" 
              onClick={() => openActionDialog("reject")}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Reject
            </Button>
            <Button 
              onClick={() => openActionDialog("approve")}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve
            </Button>
          </div>
        )}
      </div>

      {/* Action Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve" : "Reject"} Vendor Prequalification
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" 
                ? "This will approve the vendor for prequalification and allow them to participate in tenders." 
                : "This will reject the vendor's prequalification application."
              }
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormTextArea
                name="remarks"
                label="Remarks"
                placeholder={`Add remarks for ${actionType === "approve" ? "approval" : "rejection"}...`}
                rows={4}
              />
              
              <div className="flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isProcessing}
                  className={actionType === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                >
                  {isProcessing ? "Processing..." : (actionType === "approve" ? "Approve" : "Reject")}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Overview;
