import { Link, useNavigate } from "react-router-dom";
import ProjectLayout from "./ProjectLayout";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { useAppDispatch } from "hooks/useStore";
import { useDeleteProjectDocumentMutation, useGetAllProjectDocumentsQuery } from "services/project/document";
import { Loading } from "components/shared/Loading";
import { useState } from "react";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import useQuery from "hooks/useQuery";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { RouteEnum } from "constants/RouterConstants";
import DocumentCard from "./DocumentCard";
import Pagination from "components/shared/Pagination";
import LongArrowLeft from "components/icons/LongArrowLeft";
import BreadcrumbCard, { TBreadcrumbList } from "components/shared/Breadcrumb";
import FilePreview from "components/shared/FilePreview";
import { toast } from "sonner";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const breadcrumbs: TBreadcrumbList[] = [
    { name: "Projects", icon: true },
    { name: "Create", icon: true },
    { name: "Uploads", icon: false },
];

export default function ProjectUploads() {
    const [page, setPage] = useState(1);

    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const query = useQuery();
    const projectId = query.get("id");

    const { data: document, isFetching } = useGetAllProjectDocumentsQuery(
        projectId ? { page, size: 9, project: projectId } : skipToken
    );

    const [deleteProjectDocumentMutation, { isLoading }] =
        useDeleteProjectDocumentMutation();

    const handleDeleteDocument = async (id: string) => {
        try {
            await deleteProjectDocumentMutation({ path: { id: id } }).unwrap();
            sessionStorage.removeItem("projectsCompletedSteps");
            toast.success("Project Document Deleted.");
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-5">
                <Link
                    to={{
                        pathname: RouteEnum.PROJECTS_CREATE_SUMMARY,
                        search: `?id=${projectId}`,
                    }}
                    className="w-[3rem] h-[3rem] rounded-full drop-shadow-md bg-white flex items-center justify-center"
                >
                    <LongArrowLeft />
                </Link>
                <BreadcrumbCard list={breadcrumbs} />
            </div>

            <div className="space-y-6 min-h-screen">
                <ProjectLayout>
                    <Card className="space-y-6 py-5">
                        <h4 className="text-lg font-semibold">Uploads</h4>

                        {isFetching ? (
                            <Loading />
                        ) : document?.data.results.length === 0 ? (
                            <div className="w-1/2 mx-auto text-center space-y-2">
                                <h2 className="text-2xl font-bold">
                                    No Documents Found
                                </h2>
                                <p>
                                    No documents have been uploaded for this
                                    project yet. Once documents are added, they
                                    will be displayed here.
                                </p>

                                <Button
                                    className="flex gap-2 py-6 bg-[#FFF2F2] text-red-500 dark:bg-primary dark:text-white mx-auto"
                                    type="button"
                                    onClick={() => {
                                        dispatch(
                                            openDialog({
                                                type: DialogType.ProjectUploadModal,
                                                dialogProps: {
                                                    header: "Upload New Document",
                                                    width: "max-w-md",
                                                    projectId: projectId ?? "",
                                                },
                                            })
                                        );
                                    }}
                                >
                                    <AddSquareIcon />
                                    Upload New Document
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-2 lg:grid-cols-3">
                                {document?.data?.results?.map((doc) => (
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
                                    onClick={() => {
                                        dispatch(
                                            openDialog({
                                                type: DialogType.ProjectUploadModal,
                                                dialogProps: {
                                                    header: "Upload New Document",
                                                    width: "max-w-md",
                                                    projectId: projectId ?? "",
                                                },
                                            })
                                        );
                                    }}
                                >
                                    <AddSquareIcon />
                                    Upload New Document
                                </Button>
                            </div>
                        )}

                        <Pagination
                            total={document?.data.pagination.count ?? 0}
                            itemsPerPage={
                                document?.data.pagination.page_size ?? 0
                            }
                            onChange={(page: number) => setPage(page)}
                        />
                    </Card>
                    <div className="flex justify-between gap-5 mt-10">
                        <Link
                            to={{
                                pathname: RouteEnum.PROJECTS_CREATE_SUMMARY,
                                search: `?id=${projectId}`,
                            }}
                        >
                            <Button
                                type="button"
                                className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                            >
                                Previous
                            </Button>
                        </Link>
                        <Button onClick={() => navigate(RouteEnum.PROJECTS)}>
                            Finish
                        </Button>
                    </div>
                </ProjectLayout>
            </div>
        </div>
    );
}
