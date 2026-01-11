import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import SearchIcon from "@/components/icons/SearchIcon";
import FilterIcon from "@/components/icons/FilterIcon";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Icon } from "@iconify/react"; 
import { useState } from "react";
import { PlusIcon, X } from "lucide-react"; 
import DataTable from "@/components/Table/DataTable";
import { supportColumn } from "@/features/support/components/support"; 
import { useGetAllTickets } from "@/features/support/controllers/supportController";
import { useAppDispatch } from "@/hooks/useStore";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dailogs";

export default function Notifications() {
    const [isClosed, setIsClosed] = useState(false)
    const dispatch = useAppDispatch();
    const [searchValue, setSearchValue] = useState<string>()
    const [page, setPage] = useState(1);

    const { data: tickets, isFetching } = useGetAllTickets({
        page,
        size: 100, // Fetch more to allow frontend filtering
        status: "", // Get all tickets, filter on frontend
        search: searchValue,
    });

    // Filter tickets based on selected tab
    const filteredTickets = () => {
        if (!tickets?.data?.results) return [];

        if (isClosed) {
            // Closed tickets tab: show only RESOLVED/CLOSED tickets
            return tickets.data.results.filter(ticket =>
                ticket.status?.toUpperCase() === "RESOLVED" ||
                ticket.status?.toUpperCase() === "CLOSED"
            );
        } else {
            // Open tickets tab: show all non-resolved tickets (PENDING, IN_PROGRESS, OPEN, etc.)
            return tickets.data.results.filter(ticket =>
                ticket.status?.toUpperCase() !== "RESOLVED" &&
                ticket.status?.toUpperCase() !== "CLOSED"
            );
        }
    };

    const displayedTickets = filteredTickets();

    // Calculate counts for each tab
    const openTicketsCount = tickets?.data?.results?.filter(ticket =>
        ticket.status?.toUpperCase() !== "RESOLVED" &&
        ticket.status?.toUpperCase() !== "CLOSED"
    ).length ?? 0;

    const closedTicketsCount = tickets?.data?.results?.filter(ticket =>
        ticket.status?.toUpperCase() === "RESOLVED" ||
        ticket.status?.toUpperCase() === "CLOSED"
    ).length ?? 0;
    
    return (
        <div className="space-y-5">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Global Hub</BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <X size={16} />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Support</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-col items-end gap-8">
                <Button
                    className="flex gap-2 py-6 font-bold"
                    type="button"
                    size="lg"
                    variant="default"
                    onClick={() => {
                        dispatch(
                            openDialog({
                                type: DialogType.AddTicket,
                                dialogProps: {
                                    header: "Add Ticket",
                                    width: "max-w-lg",
                                },
                            })
                        );
                    }}
                >
                    <div className="bg-[#ffffff5f] p-0.5  rounded-[10px] ">
                        <PlusIcon />
                    </div>
                    
                    Add Ticket
                    
                </Button>
                <div className="flex w-full border-[1px] rounded-[16px] p-[20px] bg-white border-[#DBDFE9] items-center gap-2">
                    <span className="flex items-center px-2 py-2 border rounded-lg bg-white">
                        <SearchIcon />
                        <input
                            placeholder="Search"
                            type="text"
                            value={searchValue}
                            onChange={(e) => {setSearchValue(e.target.value)}}
                            className="ml-2 h-6 border-none w-[310px] bg-white focus:outline-none outline-none"
                        />
                    </span>
                    <Button className="shadow-sm" variant="ghost">
                        <FilterIcon />
                    </Button>
                </div>

               
            </div>

            <Card className="space-y-4 bg-transparent shadow-none border-none">
                    <div className="w-full h-fit flex border-b-[2px] border-[#E4E7EC]">
                        <div
                            onClick={() => setIsClosed(false)}
                            className={`font-medium p-[16px] cursor-pointer text-[14px] leading-[145%] tracking-[0%] ${!isClosed ? "text-[#FF0000] border-b-[2px] border-[#FF0000]" : "text-[#667185]"}`}
                        >
                            Open Tickets ({openTicketsCount})
                        </div>
                        <div
                            onClick={() => setIsClosed(true)}
                            className={`font-medium p-[16px] cursor-pointer text-[14px] leading-[145%] tracking-[0%] ${isClosed ? "text-[#FF0000] border-b-[2px] border-[#FF0000]" : "text-[#667185]"}`}
                        >
                            Closed Tickets ({closedTicketsCount})
                        </div>
                    </div>
                    <DataTable
                        data={displayedTickets}
                        headClass="bg-[#FFF2F2]"
                        columns={supportColumn}
                        isLoading={isFetching}
                        pagination={{
                            total: displayedTickets.length,
                            pageSize: 10,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
            </Card>
        </div>
    );
}
