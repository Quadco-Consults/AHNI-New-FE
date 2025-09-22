import Link from "next/link";
import { useRouter } from "next/navigation";
import ProjectLayout from "./ProjectLayout";
import Card from "components/Card";
import { Button } from "components/ui/button";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { useAppDispatch } from "hooks/useStore";
import {
  useDeleteProjectDocument,
  useGetAllProjectDocuments,
} from "@/features/projects/controllers/projectDocumentController";
import { Loading } from "components/Loading";
import { useState } from "react";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import useQuery from "hooks/useQuery";
import { RouteEnum } from "constants/RouterConstants";
import Pagination from "components/Pagination";
import LongArrowLeft from "components/icons/LongArrowLeft";
import BreadcrumbCard, { TBreadcrumbList } from "components/Breadcrumb";
import FilePreview from "components/FilePreview";
import { toast } from "sonner";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const breadcrumbs: TBreadcrumbList[] = [
  { name: "Projects", icon: true },
  { name: "Create", icon: true },
  { name: "Uploads", icon: false },
];

export default function ProjectUploads() {
  const [page, setPage] = useState(1);

  const router = useRouter();

  const dispatch = useAppDispatch();

  const query = useQuery();
  const projectId = query.get("id");

  const { data: document, isLoading: isFetching } = useGetAllProjectDocuments({
    page,
    size: 9,
    search: "",
    project: projectId as string,
    enabled: !!projectId,
  });

  const [documentToDelete, setDocumentToDelete] = useState<string>("");
  const { deleteProjectDocument } = useDeleteProjectDocument(documentToDelete);

  const handleDeleteDocument = async (id: string) => {
    try {
      setDocumentToDelete(id);
      await deleteProjectDocument();
      sessionStorage.removeItem("projectsCompletedSteps");
      toast.success("Project Document Deleted.");
      setDocumentToDelete("");
      // Refresh the page to update the document list
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.message ?? "Something went wrong");
      setDocumentToDelete("");
    }
  };

  return (
    <div className='space-y-5'>
      <div className='flex items-center gap-5'>
        <Link
          href={{
            pathname: RouteEnum.PROJECTS_CREATE_SUMMARY,
            search: `?id=${projectId}`,
          }}
          className='w-[3rem] h-[3rem] rounded-full drop-shadow-md bg-white flex items-center justify-center'
        >
          <LongArrowLeft />
        </Link>
        <BreadcrumbCard list={breadcrumbs} />
      </div>

      <div className='space-y-6 min-h-screen'>
        <ProjectLayout>
          <Card className='space-y-6 py-5'>
            <h4 className='text-lg font-semibold'>Uploads</h4>

            {isFetching ? (
              <Loading />
            ) : document?.results?.length === 0 ? (
              <div className='w-1/2 mx-auto text-center space-y-2'>
                <h2 className='text-2xl font-bold'>No Documents Found</h2>
                <p>
                  No documents have been uploaded for this project yet. Once
                  documents are added, they will be displayed here.
                </p>

                <Button
                  className='flex gap-2 py-6 bg-[#FFF2F2] text-red-500 dark:bg-primary dark:text-white mx-auto'
                  type='button'
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
              <div className='grid grid-cols-1 items-center gap-5 md:grid-cols-2 lg:grid-cols-3'>
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
                  className='flex gap-2 py-6 bg-[#FFF2F2] text-red-500 dark:bg-primary dark:text-white'
                  type='button'
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
              itemsPerPage={document?.data.pagination.page_size ?? 0}
              onChange={(page: number) => setPage(page)}
            />
          </Card>
          <div className='flex items-center justify-end gap-5 mt-5'>
            <Link
              href={{
                pathname: RouteEnum.PROJECTS_CREATE_SUMMARY,
                search: `?id=${projectId}`,
              }}
            >
              <Button
                type='button'
                size='lg'
                className='bg-[#FFF2F2] text-primary dark:text-gray-500'
              >
                Previous
              </Button>
            </Link>
            <Button onClick={() => router.push(RouteEnum.PROJECTS)} size='lg'>
              Finish
            </Button>
          </div>
        </ProjectLayout>
      </div>
    </div>
  );
}
