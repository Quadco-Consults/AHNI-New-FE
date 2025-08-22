// src/pages/ProjectUploads.tsx
import { useParams } from "next/navigation";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import {
  useDeleteProjectDocument,
  useGetAllProjectDocuments,
} from "@/features/projects/controllers/projectDocumentController";

import { useState } from "react";
import UploadsComponent from "components/UploadComponent";

export default function ProjectUploads() {
  const dispatch = useAppDispatch();
  const { id: projectId } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [documentToDelete, setDocumentToDelete] = useState<string>("");

  // Call the query hook at the component level
  const { data: documentsData, isLoading: isFetching } = useGetAllProjectDocuments({
    page,
    size: 9,
    search: "",
    project: projectId as string,
    enabled: !!projectId,
  });

  const { deleteProjectDocument, isLoading: isDeleting } = useDeleteProjectDocument(documentToDelete);

  // Function to delete a document
  const deleteDocument = async (id: string) => {
    setDocumentToDelete(id);
    await deleteProjectDocument();
    sessionStorage.removeItem("projectsCompletedSteps");
  };

  // This function updates our local page state when pagination changes
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <UploadsComponent
      title="Project Uploads"
      documents={documentsData}
      isFetching={isFetching}
      deleteDocument={deleteDocument}
      onUploadClick={() => {
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
      onPageChange={handlePageChange}
      isDeleting={isDeleting}
      emptyTitle="No Project Documents Found"
      emptyDescription="No documents have been uploaded for this project yet. Once documents are added, they will be displayed here."
    />
  );
}
