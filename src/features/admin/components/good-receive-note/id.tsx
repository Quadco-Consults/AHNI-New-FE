"use client";

import logoPng from "assets/svgs/logo-bg.svg";
import Card from "components/Card";
import DataTable from "components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Link, useParams } from "next/navigation";
import { Button } from "components/ui/button";
import { BsFiletypeCsv, BsFiletypeDoc } from "react-icons/bs";
import { useGetSingleGoodReceiveNoteQuery } from "@/features/admin/controllers/goodReceiveNoteController";
import { useMemo } from "react";

const tableColumns: ColumnDef<any>[] = [
    {
        id: "description",
        header: "Description of Items",
    },

    {
        id: "unit",
        header: "Unit of Measurement",
    },

    {
        id: "unit",
        header: "Quantity Ordered",
    },

    {
        id: "unit",
        header: "Quantity Delivered",
    },

    {
        id: "unit",
        header: "Remarks",
    },
];

export default function GoodReceiveNoteDetails() {
    const { id } = useParams();

    const { data } = useGetSingleGoodReceiveNoteQuery(id || "", !!id);

    const details = useMemo(() => {
        if (!data) return {};

        const {
            purchase_order: { purchase_order_number },
        } = data?.data;

        return {
            purchase_order_number,
        };
    }, [data]);

    return (
        <div className="bg-white p-8">
            <div className="flex justify-center items-center flex-col">
                <img src={logoPng} alt="logo" width={200} />
                <h1>Achieving Health Nigeria Initiative (AHNI)</h1>
            </div>
            <div className="mt-5">
                <Card className="bg-alternate border-primary">
                    <h3 className="text-primary text-[18px] text-center mb-4 font-semibold">
                        Goods Receive Note
                    </h3>

                    <div className="space-y-5">
                        <div className="flex gap-2">
                            <p className="font-semibold">
                                Goods Receive Note Number:
                            </p>
                            <p className=""></p>
                        </div>

                        <div className="flex gap-2">
                            <p className="font-semibold">Receipt Date:</p>
                            <p className=""></p>
                        </div>

                        <div className="flex gap-2">
                            <p className="font-semibold">Invoice Number:</p>
                            <p className=""></p>
                        </div>

                        <div className="flex gap-2">
                            <p className="font-semibold">Waybill Number:</p>
                            <p className=""></p>
                        </div>

                        <div className="flex gap-2">
                            <p className="font-semibold">
                                Purchase Order Number:
                            </p>
                            <p>{details?.purchase_order_number}</p>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="bg-[#BE8800] text-white font-semibold text-[20px] p-[10px] my-4">
                Vendor: HYBRID TECHNICAL COMPANY LIMITED
            </div>
            <div className="my-5">
                <DataTable columns={tableColumns} data={[]} headClass="p-0" />
            </div>

            <div className=" w-full flex justify-between flex-wrap gap-8">
                <Card className="flex-1 border-primary">
                    <p className="text-[16px] font-semibold mb-2">
                        Procurement Officer
                    </p>
                    <div className="space-y-2">
                        <div className="flex gap-2 text-[12px]">
                            <p className=" w-[122px] font-semibold">
                                Signature:
                            </p>
                            <p className="">-</p>
                        </div>

                        <div className="flex gap-2 text-[12px]">
                            <p className=" w-[122px] font-semibold">Date</p>
                            <p className="">-</p>
                        </div>
                    </div>
                    <p></p>
                </Card>

                <Card className="flex-1 border-primary">
                    <p className="text-[16px] font-semibold mb-2">
                        Requestor Name:
                    </p>
                    <div className="space-y-2">
                        <div className="flex gap-2 text-[12px]">
                            <p className=" w-[122px] font-semibold">
                                Signature:
                            </p>
                            <p className="">-</p>
                        </div>

                        <div className="flex gap-2 text-[12px]">
                            <p className=" w-[122px] font-semibold">Date</p>
                            <p className="">-</p>
                        </div>
                    </div>
                    <p></p>
                </Card>

                <Card className="flex-1 border-primary">
                    <p className="text-[16px] font-semibold mb-2">
                        Inventory Officer Name:
                    </p>
                    <div className="space-y-2">
                        <div className="flex gap-2 text-[12px]">
                            <p className=" w-[122px] font-semibold">
                                Signature:
                            </p>
                            <p className="">
                                <p className=""></p>
                            </p>
                        </div>
                        <div className="flex gap-2 text-[12px]">
                            <p className=" w-[122px] font-semibold">Date</p>
                            <p className="">-</p>
                        </div>
                    </div>
                    <p></p>
                </Card>

                <Card className="flex-1 border-primary">
                    <p className="text-[16px] font-semibold mb-2">
                        Goods received by:
                    </p>
                    <div className="space-y-2">
                        <div className="flex gap-2 text-[12px]">
                            <p className=" w-[122px] font-semibold">
                                Signature:
                            </p>
                            <p className="">
                                <p className=""></p>
                            </p>
                        </div>
                        <div className="flex gap-2 text-[12px]">
                            <p className=" w-[122px] font-semibold">Date</p>
                            <p className="">-</p>
                        </div>
                    </div>
                    <p></p>
                </Card>
            </div>

            <div className="flex justify-end my-8 gap-3">
                <Link href={"file"} target="_blank" title={"file"}>
                    <Button
                        variant="secondary"
                        className="bg-[#0000001A] py-2 px-4 w-fit  rounded-2xl flex items-center justify-center overflow-hidden"
                    >
                        <BsFiletypeDoc size={25} className="mr-2" />
                        Specification Document
                    </Button>
                </Link>

                <Button variant="custom">
                    <span>
                        <BsFiletypeCsv size={25} />
                    </span>
                    Download
                </Button>
            </div>
        </div>
    );
}
