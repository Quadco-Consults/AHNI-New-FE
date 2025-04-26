import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react"; 
import { useState } from "react";
import { PlusIcon } from "lucide-react"; 
import DataTable from "components/Table/DataTable";
import { supportColumn } from "components/Table/support/support"; 
import { useGetAllTicketsQuery } from "services/support";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";

export default function Notifications() {
    const [isClosed, setIsClosed] = useState(false)
    const dispatch = useAppDispatch();
    const [searchValue, setSearchValue] = useState<string>()
   const [page, setPage] = useState(1);
    const { data: tickets, isFetching } = useGetAllTicketsQuery({
        page,
        size: 10,
        status: isClosed ? "RESOLVED" : "PENDING" ,
        search: searchValue,
    }); 
    return (
        <div className="space-y-5">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Global Hub</BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Icon icon="iconoir:slash" />
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
                        {
                            ["Open Tickets", "Closed Tickets"].map((el,l) => (
                                <div key={l} onClick={() => {setIsClosed(Boolean(l))}} className={` font-medium p-[16px] cursor-pointer text-[14px] leading-[145%] tracking-[0%] ${isClosed === Boolean(l) ? "text-[#FF0000] border-b-[2px] border-[#FF0000]" : "  text-[#667185]"}`}> 
                                   {el}                 
                                </div>
                            ))
                        }
                    </div>
                    <DataTable
                        data={tickets?.data.results ?? []}
                        headClass="bg-[#FFF2F2]"
                        columns={supportColumn}
                        isLoading={isFetching}
                        pagination={{
                            total: tickets?.data.pagination.count ?? 0,
                            pageSize: tickets?.data.pagination.page_size ?? 0,
                            onChange: (page: number) => setPage(page),
                        }}
                    />
            </Card>
        </div>
    );
}
