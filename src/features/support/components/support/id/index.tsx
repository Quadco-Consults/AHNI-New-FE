import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { generatePath, Link, useNavigate, useParams } 
import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/Card"; 
import { Button } from "components/ui/button"; 
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { LoadingSpinner } from "components/Loading";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useGetSingleProject } from "@/features/projects/controllers/project";
import { RouteEnum } from "constants/RouterConstants";
import { useCreateTicket, useEditTicket, useGetSingleTicket } from "@/features/support/controllers/supportController";
import FundSummary from "pages/protectedPages/programs/fund-request/Fund-summary";
import Summary from "pages/protectedPages/programs/fund-request/Fund-request-preview";
import moment from "moment";
import { Paperclip, Send } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";

const TicketDetail = () => {
    const router = useRouter();
    const [remark, setRemark] = useState<string>(""); 
    const [status, setStatus] = useState<string>("");
    const [file, setFile] = useState<File>();
    const { id } = useParams(); 
    const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePaperclipClick = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
      }
  
  };
  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files) {
              setFile(e.target.files[0]);
          }
      };
    const { data: ticket, isLoading } = useGetSingleTicket(
        id ?? skipToken
    );
    const { editTicket, isLoading: isEditLoading } =
    useEditTicket();
    const dispatch = useAppDispatch();

    const goBack = () => {
        router.push(-1);
    };
     const onSubmitRemark = async () => {
            if ( !remark.trim()) {
                toast.error("Please write a remark");
                return;
            }
            if (!file ) {
                toast.error("Please choose a file to upload");
                return;
            }
    
            try {
                const formData = new FormData(); 
                formData.append("remark", remark);  
                formData.append("remark_file", file);
    
                 
                await editTicket({ 
                    id: id!,  
                    body: formData 
                })();
        
                toast.success("Remark Sent");
     
            } catch (error: any) {
                toast.error(error.data.message || "Something went wrong");
            }
        };
    
    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6 relative flex flex-col gap-20 min-h-screen">
            <button
                onClick={goBack}
                className="w-[3rem]  top-0 left-0 aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center"
            >
                <LongArrowLeft />
            </button>

            <div className="w-full h-fit flex items-center justify-center">
            <div  className="space-y-10   flex flex-col gap-1 items-end w-[80%]">
                <div className="relative flex justify-between gap-5 ">
                     

                    <div className="flex items-center gap-2">
                         
                        <Button
                            onClick={async () => {
                                 
                                try {
                                    editTicket({
                                        id: id!,
                                        body: {status: ticket?.data?.status === "RESOLVED" ? "PENDING" : "RESOLVED"}
                                    })
                                    toast.success(`Marked as ${ticket?.data?.status === "RESOLVED" ? "Unresolved" : "Resolved"}`);
                                    goBack()
                                } catch (error: any) {
                                    toast.error(error.data.message || "Something went wrong");
                                }
                            }}
                        >
                            Mark as {ticket?.data?.status === "RESOLVED" ? "Unresolved" : "Resolved"}
                        </Button>
                    </div>
                </div>
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    ticket?.data && (
                        <div className=" bg-white border-[#E5E7EB] rounded-[4px] w-full flex flex-col border">
                                <div className="flex flex-col py-24 px-[39px]"> 
                                    <div className="w-full h-fit py-5 border-b flex flex-col gap-3 border-[#E5E7EB]">
                                        {
                                            [{title: "Subject" , value: ticket?.data?.subject },
                                            {title: "Sender" , value: ticket?.data?.sender },
                                            {title: "Email" , value: ticket?.data?.email },
                                            {title: "Date Created" , value: moment(ticket?.data?.created_datetime).format("DD-MMM-YYYY, HH-MM-SS") },   
                                            ].map((el,l) => (
                                                <div key={l} className="w-full flex justify-between items-center"> 
                                                    <h2 className="text-[12px] font-normal text-[#344054] leading-[125%]">{el.title}</h2>
                                                    <h2 className="text-[14px] font-medium text-[#101928] leading-[100%]">{el.value}</h2>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className="w-full flex flex-col py-5 gap-3"> 
                                        <h2 className="text-[12px] font-normal text-[#101928] leading-[125%]">Message</h2>
                                        <h2 className="text-[10px] font-normal text-[#344054] leading-[125%]">{ticket?.data?.issue_description}</h2>
                                    </div>
                                </div>    
                                <div className="border-[#E5E7EB] border-t flex items-center gap-[20px] px-[59px] py-5"> 
                                    <div className="w-full px-3 border cursor-pointer border-[#E4E7EC] py-2 rounded-[8px] gap-3   flex items-center">
                                        <div className="p-2 "> 
                                            <Paperclip  className="cursor-pointer" onClick={handlePaperclipClick} />
                                            
                                            <input ref={fileInputRef}
                                                 type="file"
                                                onChange={handleChangeFile} className="hidden" />
                                        </div>    
                                         <input type="text" value={remark} onChange={(e) => {setRemark(e.target.value)}} className="text-black w-full h-[50px] m-0 p-0 top-0  border-none outline-none placeholder:text-[#101928] text-[16px] font-medium" placeholder="Type your message" />
                                    </div>    
                                    <div className="cursor-pointer bg-[#F99494] h-[62px] w-[62px] flex-shrink-0 rounded-full flex justify-center items-center"> 
                                        <div onClick={() => {onSubmitRemark()}} className="cursor-pointer bg-[#FD4A36] h-[44px] w-[44px] rounded-full flex justify-center items-center"> 
                                            <Send color="white" />
                                        </div>  
                                    </div>       
                                </div>
                        </div>
                    )
                )}
            </div>
            </div>
        </div>
    );
};

export default TicketDetail;
