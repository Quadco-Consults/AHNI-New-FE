"use client";

import { Button } from "components/ui/button";
import { useParams } from "next/navigation";
import Link from "next/link";
import { LoadingSpinner } from "components/Loading";
import BreadcrumbCard from "components/Breadcrumb";
import CbaAPI from "@/features/procurement/controllers/cbaController";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import { Icon } from "@iconify/react";
import { SolicitationItems } from "definations/procurement-types/solicitation";
import GoBack from "components/GoBack";
import { CommitteeMemberData } from "definations/procurement-types/cba";
import { RouteEnum } from "constants/RouterConstants";
import { cn } from "lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "components/ui/dialog";
import { Form } from "components/ui/form";
import FormSelect from "components/atoms/FormSelectField";
import { useForm } from "react-hook-form";
import { SelectContent, SelectItem } from "components/ui/select";
import FormTextArea from "components/atoms/FormTextArea";
import FormButton from "@/components/FormButton";
import { z } from "zod";
import { CbaApprovalSchema } from "@/features/procurement/types/procurement-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";

const generatePath = (route: string, params?: Record<string, any>): string => {
  let path = route;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, String(value));
    });
  }
  return path;
};

const CompetitiveBidAnalysisDetail = () => {
    const { id } = useParams();
    const [open, setOpen] = useState(false);

    const { data, isLoading } = CbaAPI.useGetSingleCba(id as string);

    const { approveCba, isLoading: createApprovalCbaIsLoading } = CbaAPI.useApproveCba(id as string);

    const form = useForm<z.infer<typeof CbaApprovalSchema>>({
        resolver: zodResolver(CbaApprovalSchema),
        defaultValues: {
            status: "APPROVED" as const,
            remarks: "",
        },
    });

    const { handleSubmit } = form;

    const onSubmit = async (data: z.infer<typeof CbaApprovalSchema>) => {
        try {
            await approveCba(data);
            toast.success("Successfully added.");
            setOpen(false);
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
        }
    };

    if (isLoading) return <LoadingSpinner />;

    const breadcrumbs = [
        { name: "Procurement", icon: true },
        { name: "Competitive Bid Analysis", icon: true },
        { name: "Detail", icon: false },
    ];

    return (
        <div className="space-y-5">
            <BreadcrumbCard list={breadcrumbs} />

            <GoBack />

            <Card className="space-y-8 p-10">
                <div className="flex justify-between">
                    <h2 className="font-semibold text-lg">{data?.data?.title || 'CBA Details'}</h2>

                    <div className="flex gap-3">
                        <Link
                            href={generatePath(
                                RouteEnum.PROCUREMENT_CBA_REPORT,
                                { id: id as string }
                            )}
                        >
                            <Button variant="outline">
                                <Icon icon="heroicons:document-text" className="mr-2" />
                                View Report
                            </Button>
                        </Link>
                        
                        {data?.data?.status === "PENDING" ? (
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button>Approval</Button>
                                </DialogTrigger>
                            <DialogContent className="max-w-xl">
                                <DialogHeader className="text-2xl font-semibold mb-5">
                                    CBA Approval
                                </DialogHeader>
                                <Form {...form}>
                                    <form
                                        onSubmit={handleSubmit(onSubmit)}
                                        className="space-y-5"
                                    >
                                        <FormSelect
                                            name="status"
                                            label="Status"
                                            placeholder="Select status"
                                            required
                                        >
                                            <SelectContent>
                                                <SelectItem value="APPROVED">
                                                    Generate Purchase Order
                                                </SelectItem>
                                                <SelectItem value="REJECTED">
                                                    Redo CBA
                                                </SelectItem>
                                            </SelectContent>
                                        </FormSelect>

                                        <FormTextArea
                                            name="remarks"
                                            label="Remarks"
                                            placeholder="Enter remarks"
                                        />

                                        <div className="flex justify-end">
                                            <FormButton
                                                loading={
                                                    createApprovalCbaIsLoading
                                                }
                                                disabled={
                                                    createApprovalCbaIsLoading
                                                }
                                                type="submit"
                                            >
                                                Submit
                                            </FormButton>
                                        </div>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                        ) : (
                            <Link
                                href={generatePath(
                                    RouteEnum.PROCUREMENT_CBA_START,
                                    {
                                        id: id as string,
                                        appID: data?.data?.solicitation || '',
                                    }
                                )}
                            >
                                <Button>Start CBA</Button>
                            </Link>
                        )}
                    </div>
                </div>

                <h4 className="text-green-dark text-base font-semibold">
                    Status{" "}
                    <Badge
                        className={cn(
                            data?.data?.status === "APPROVED" &&
                                "bg-green-200 text-green-500",
                            data?.data?.status === "REJECTED" &&
                                "bg-red-200 text-red-500",
                            data?.data?.status === "PENDING" &&
                                "bg-yellow-200 text-yellow-500",
                            data?.data?.status === "COMPLETED" &&
                                "bg-blue-200 text-blue-500"
                        )}
                    >
                        {data?.data?.status.toLowerCase()}
                    </Badge>
                </h4>

                <div className="flex items-center gap-10">
                    <div className="flex gap-3 items-center">
                        <Icon icon="ooui:reference" fontSize={18} />
                        <h6>{data?.data?.lot}</h6>
                    </div>
                    <div className="flex gap-3 items-center">
                        <Icon
                            icon="lets-icons:date-today-duotone"
                            fontSize={18}
                        />
                        <h6>{data?.data?.cba_date}</h6>
                    </div>
                    <div className="flex gap-3 items-center">
                        <Icon
                            icon="solar:case-minimalistic-bold-duotone"
                            fontSize={18}
                        />
                        <h6>{data?.data?.cba_type}</h6>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="font-semibold text-base">Remarks:</h2>
                    <h4 className=" text-gray-500">{data?.data?.remarks}</h4>
                </div>

                <div className="space-y-4">
                    <h2 className="font-semibold text-yellow-darker text-base">
                        Items:
                    </h2>

                    <div className="grid grid-cols-2 gap-5">
                        {data?.data?.items?.map((item: SolicitationItems) => (
                            <Card
                                key={item?.id}
                                className="border-yellow-darker space-y-3"
                            >
                                <div className="flex items-center gap-5">
                                    <h4 className="w-1/4 font-semibold">
                                        Item:
                                    </h4>
                                    <h4>{item?.item?.name}</h4>
                                </div>
                                <div className="flex items-center gap-5">
                                    <h4 className="w-1/4 font-semibold">
                                        Quantity:
                                    </h4>
                                    <h4>{item?.quantity}</h4>
                                </div>
                                <div className="flex items-center gap-5">
                                    <h4 className="w-1/4 font-semibold">
                                        Lot:
                                    </h4>
                                    <h4>{item?.lot}</h4>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="font-semibold text-yellow-darker text-base">
                        Assignee:
                    </h2>

                    <Card className="border-yellow-darker space-y-3 w-full md:w-1/2">
                        <div className="flex items-center gap-5">
                            <h4 className="w-1/3 font-semibold">First Name:</h4>
                            <h4>{data?.data?.assignee?.first_name}</h4>
                        </div>
                        <div className="flex items-center gap-5">
                            <h4 className="w-1/3 font-semibold">Last Name:</h4>
                            <h4>{data?.data?.assignee?.last_name}</h4>
                        </div>
                        <div className="flex items-center gap-5">
                            <h4 className="w-1/3 font-semibold">
                                Designation:
                            </h4>
                            <h4>{data?.data?.assignee?.designation}</h4>
                        </div>
                    </Card>
                </div>

                <div className="space-y-4">
                    <h2 className="font-semibold text-yellow-darker text-base">
                        Committee Members:
                    </h2>

                    <div className="grid grid-cols-2 gap-5">
                        {data?.data?.committee_members?.map(
                            (member: CommitteeMemberData) => (
                                <Card
                                    key={member?.id}
                                    className="border-yellow-darker space-y-3"
                                >
                                    <div className="flex items-center gap-5">
                                        <h4 className="w-1/3 font-semibold">
                                            First Name:
                                        </h4>
                                        <h4>{member?.first_name}</h4>
                                    </div>
                                    <div className="flex items-center gap-5">
                                        <h4 className="w-1/3 font-semibold">
                                            Last Name:
                                        </h4>
                                        <h4>{member?.last_name}</h4>
                                    </div>
                                    <div className="flex items-center gap-5">
                                        <h4 className="w-1/3 font-semibold">
                                            Designation:
                                        </h4>
                                        <h4>{member?.designation}</h4>
                                    </div>
                                </Card>
                            )
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default CompetitiveBidAnalysisDetail;
