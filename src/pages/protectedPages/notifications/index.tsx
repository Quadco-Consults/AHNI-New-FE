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
import ArrowDownIcon from "components/icons/ArrowDownIcon";
import DashboardIcon from "components/icons/sidebar-icons/DashboardIcon";
import { Separator } from "components/ui/separator";
import NotificationItem from "components/features/NotificationItem";

export default function Notifications() {
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
                        <BreadcrumbPage>Notification</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <span className="flex items-center px-2 py-2 border rounded-lg bg-white">
                        <SearchIcon />
                        <input
                            placeholder="Search"
                            type="text"
                            className="ml-2 h-6 border-none w-[310px] bg-white focus:outline-none outline-none"
                        />
                    </span>
                    <Button className="shadow-sm" variant="ghost">
                        <FilterIcon />
                    </Button>
                </div>

                <Button
                    className="flex gap-2 py-6 font-bold"
                    type="button"
                    size="lg"
                    variant="default"
                >
                    Actions
                    <ArrowDownIcon />
                </Button>
            </div>

            <Card className="space-y-5 rounded-none">
                <div className="flex">
                    <div className="w-[35%] border-solid border-[1px] border-gray-200 rounded-sm shadow-md pb-4">
                        <div className="flex items-center justify-between py-2 px-4">
                            <h2 className="font-medium">Notifications</h2>

                            <DashboardIcon fillColor="red" />
                        </div>

                        <Separator />

                        <ul className="mt-6 px-2 space-y-4">
                            <NotificationItem active />
                            <NotificationItem />
                            <NotificationItem />
                            <NotificationItem />
                            <NotificationItem />
                            <NotificationItem />
                            <NotificationItem />
                        </ul>
                    </div>

                    <div className="w-[65%] space-y-2 pt-16 px-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[#344054] text-[12px]">
                                Subject
                            </h3>
                            <p className="font-medium">
                                Issues With Health Insurance
                            </p>
                        </div>

                        <div className="flex items-center justify-between">
                            <h3 className="text-[#344054] text-[12px]">
                                Sender
                            </h3>
                            <p className="font-medium">Admin</p>
                        </div>

                        <div className="flex items-center justify-between">
                            <h3 className="text-[#344054] text-[12px]">
                                Email
                            </h3>
                            <p className="font-medium">
                                support@anhisupport.com
                            </p>
                        </div>

                        <div className="flex items-center justify-between">
                            <h3 className="text-[#344054] text-[12px]">
                                Date Created
                            </h3>
                            <p className="font-medium">Nov 16, 2024</p>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-[#344054] text-[12px]">
                                Message
                            </h3>
                            <p className="text-[#344054] text-[10px] mt-2">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Nulla facilis maiores veniam
                                eos incidunt quibusdam laboriosam repellendus
                                totam veritatis perspiciatis non sunt dolorum,
                                ex magni nesciunt rem officia. Odit, nulla animi
                                asperiores harum obcaecati at unde cum
                                consequuntur optio fugiat?
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
