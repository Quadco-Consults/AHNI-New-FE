"use client";

import Card from "components/Card";
import AddSquareIcon from "components/icons/AddSquareIcon";
import FormButton from "@/components/FormButton";
import ManualSubGrantStepWrapper from "./Layout";
import { Button } from "components/ui/button";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useParams, useSearchParams } from "next/navigation";
import {
    useDeleteSubGrantUpload,
    useGetAllSubGrantUploads,
} from "@/features/contracts-grants/controllers/submissionUploadController";
import FilePreview from "components/FilePreview";
import Pagination from "components/Pagination";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateSubGrantUpload() {
    const dispatch = useAppDispatch();

    const [page, setPage] = useState(1);

    const { id: subGrantId } = useParams();
    const [searchParams] = useSearchParams();
    const partnerSubId = searchParams.get("partnerSubId");

    const { data, isFetching } = useGetAllSubGrantUploads({
        page,
        size: 9,
    });

    const { deleteSubGrantUpload, isLoading: isDeleteLoading } =
        useDeleteSubGrantUpload();

    const handleDelete = async (id: string) => {
        try {
            await deleteSubGrantUpload(id)();
            toast.success("Document Deleted");
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    return (
        <ManualSubGrantStepWrapper>
            <div className="px-5 text-[#1A0000] flex flex-col gap-y-[3rem]">
                <h3 className="text-2xl font-bold">Document Upload</h3>
                <Card className="space-y-6">
                    <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {data &&
                            data.data.results.map((doc) => (
                                <FilePreview
                                    key={doc.id}
                                    id={doc.id}
                                    name={doc.name}
                                    timestamp={doc.created_datetime}
                                    file={doc.document}
                                    showDeleteIcon
                                    isLoading={isDeleteLoading}
                                    onDeleteDocument={handleDelete}
                                />
                            ))}
                    </div>

                    <Button
                        className="flex gap-2 py-6 bg-[#FFF2F2] text-red-500 dark:bg-primary dark:text-white"
                        type="button"
                        onClick={() =>
                            dispatch(
                                openDialog({
                                    type: DialogType.SUBGRANT_MANUAL_SUB_UPLOAD,
                                    dialogProps: {
                                        header: "Sub-Grant Submission Upload",
                                        subGrantId,
                                        partnerSubId,
                                    },
                                })
                            )
                        }
                    >
                        <AddSquareIcon />
                        Upload New Document
                    </Button>

                    <Pagination
                        total={data?.data.pagination.count ?? 0}
                        itemsPerPage={data?.data.pagination.page_size ?? 0}
                        onChange={(page: number) => setPage(page)}
                    />
                </Card>

                <div className="flex justify-end">
                    <FormButton type="submit" size="lg">
                        Submit
                    </FormButton>
                </div>
            </div>
        </ManualSubGrantStepWrapper>
    );
}
