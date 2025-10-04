"use client";

import Card from "components/Card";
import FormButton from "@/components/FormButton";
import { useGetAllSubGrantUploads } from "@/features/contracts-grants/controllers/submissionUploadController";
import FilePreview from "components/FilePreview";
import Pagination from "components/Pagination";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function SubGrantUploadDetail() {
    const [page, setPage] = useState(1);
    const params = useParams();
    const submissionId = params?.id as string;

    const { data } = useGetAllSubGrantUploads({
        page,
        size: 9,
        sub_grant_submission: submissionId,
    });

    return (
        <div className="px-5 text-[#1A0000] flex flex-col gap-y-[3rem]">
            <h3 className="text-2xl font-bold">Document Upload</h3>
            <Card className="space-y-6">
                <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {data?.data?.results && data.data.results.length > 0 ? (
                        data.data.results.map((doc) => (
                            <FilePreview
                                key={doc.id}
                                id={doc.id}
                                name={doc.name}
                                timestamp={doc.created_datetime}
                                file={doc.document}
                                showDeleteIcon={false}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500 py-8">
                            No documents uploaded yet.
                        </div>
                    )}
                </div>

                <Pagination
                    total={data?.data?.paginator?.count ?? 0}
                    itemsPerPage={data?.data?.paginator?.page_size ?? 0}
                    onChange={(page: number) => setPage(page)}
                />
            </Card>

            <div className="flex justify-end">
                <FormButton type="submit" size="lg">
                    Submit
                </FormButton>
            </div>
        </div>
    );
}
