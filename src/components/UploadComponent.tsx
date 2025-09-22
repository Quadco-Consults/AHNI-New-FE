import { useState } from "react";
import Card from "components/Card";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { Loading } from "components/Loading";
import Pagination from "components/Pagination";
import FilePreview from "components/FilePreview";
import { toast } from "sonner";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Define document type based on your API response
interface DocumentItem {
    id: string;
    title: string;
    uploaded_datetime: string;
    file: string;
    [key: string]: any; // For any additional properties
}

// Define pagination type
interface PaginationInfo {
    count: number;
    page_size: number;
    [key: string]: any; // For any additional properties
}

// Define response data structure
interface DocumentsResponse {
    data: {
        results: DocumentItem[];
        pagination: PaginationInfo;
    };
    [key: string]: any; // For any additional properties
}

// Define props for the component
interface UploadsComponentProps {
    title?: string;
    documents?: DocumentsResponse;
    isFetching: boolean;
    deleteDocument: (id: string) => Promise<any>;
    onUploadClick: () => void;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
    isDeleting?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    uploadButtonText?: string;
    className?: string;
}

/**
 * A reusable uploads component that handles document display, pagination, and upload/delete actions
 */
export default function UploadsComponent({
    title = "Uploads",
    documents,
    isFetching,
    deleteDocument,
    onUploadClick,
    onPageChange,
    isLoading = false,
    isDeleting = false,
    emptyTitle = "No Documents Found",
    emptyDescription = "No documents have been uploaded yet. Once documents are added, they will be displayed here.",
    uploadButtonText = "Upload New Document",
    className = "",
}: UploadsComponentProps) {
    const handleDeleteDocument = async (docId: string) => {
        try {
            await deleteDocument(docId);
            toast.success("Document Deleted.");
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Something went wrong");
        }
    };

    return (
        <div className={`space-y-5 ${className}`}>
            <div className="space-y-6 min-h-screen">
                <Card className="space-y-6 py-5">
                    <h4 className="text-lg font-semibold">{title}</h4>

                    {isLoading || isFetching ? (
                        <Loading />
                    ) : !documents?.data?.results ||
                      documents.data.results.length === 0 ? (
                        <div className="w-1/2 mx-auto text-center space-y-2">
                            <h2 className="text-2xl font-bold">{emptyTitle}</h2>
                            <p>{emptyDescription}</p>

                            <Button
                                className="flex gap-2 py-6 bg-[#FFF2F2] text-red-500 dark:bg-primary dark:text-white mx-auto"
                                type="button"
                                onClick={onUploadClick}
                            >
                                <AddSquareIcon />
                                {uploadButtonText}
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {documents.data.results.map((doc) => (
                                <FilePreview
                                    key={doc.id}
                                    id={doc.id}
                                    name={doc.title}
                                    timestamp={doc.uploaded_datetime}
                                    file={doc.file}
                                    showDeleteIcon
                                    onDeleteDocument={handleDeleteDocument}
                                />
                            ))}

                            <Button
                                className="flex gap-2 py-6 bg-[#FFF2F2] text-red-500 dark:bg-primary dark:text-white"
                                type="button"
                                onClick={onUploadClick}
                            >
                                <AddSquareIcon />
                                {uploadButtonText}
                            </Button>
                        </div>
                    )}

                    {documents?.data?.pagination && (
                        <Pagination
                            total={documents.data.pagination.count ?? 0}
                            itemsPerPage={
                                documents.data.pagination.page_size ?? 0
                            }
                            onChange={onPageChange}
                        />
                    )}
                </Card>
            </div>
        </div>
    );
}
