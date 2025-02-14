import Card from "components/shared/Card";
import FormButton from "atoms/FormButton";
import { useGetAllSubGrantUploadsQuery } from "services/c&g/subgrant/submission-upload";
import FilePreview from "components/shared/FileCard";
import Pagination from "components/shared/Pagination";
import { useState } from "react";

export default function SubGrantUploadDetail() {
    const [page, setPage] = useState(1);

    const { data } = useGetAllSubGrantUploadsQuery({
        page,
        size: 9,
    });

    return (
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
                                showDeleteIcon={false}
                            />
                        ))}
                </div>

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
    );
}
