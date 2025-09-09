import DeleteIcon from "components/icons/DeleteIcon";
import PdfIcon from "components/icons/PdfIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import { Button } from "components/ui/button";
import { format } from "date-fns";
import { useState } from "react";
import { Document, Page } from "react-pdf";
import { useDeleteProjectDocument } from "@/features/projects/controllers/projectDocumentController";
import { toast } from "sonner";
import "@/utils/pdfConfig";

type TProps = {
  id: string;
  title: string;
  file: string;
  onLoadSuccess: (params: { numPages: number }) => void;
  pageNumber: number;
  uploadedDateTime: string;
  showDeleteIcon?: boolean;
  onDeleteDocument?: () => void;
};

export default function DocumentCard({
  id,
  title,
  file,
  onLoadSuccess,
  pageNumber,
  uploadedDateTime,
  showDeleteIcon = true,
  onDeleteDocument,
}: TProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { deleteProjectDocument, isLoading } = useDeleteProjectDocument(id);

  const handleDeleteDocument = async () => {
    try {
      await deleteProjectDocument();
      sessionStorage.removeItem("projectsCompletedSteps");
      toast.success("Project Document Deleted.");
    } catch (error: any) {
      toast.error(error.data.message ?? "Something went wrong");
    }
  };

  const handleDelete = () => {
    if (onDeleteDocument) {
      onDeleteDocument();
    } else {
      handleDeleteDocument();
    }

    setDialogOpen(false);
  };

  return (
    <>
      <div className='border space-y-4 rounded-2xl p-5 w-full overflow-hidden h-fit'>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <PdfIcon />
            <h2 className='line-clamp-1'>{title}</h2>
          </div>

          {showDeleteIcon && (
            <Button
              type='button'
              onClick={() => setDialogOpen(true)}
              variant='outline'
              size='icon'
            >
              <DeleteIcon />
            </Button>
          )}
        </div>
        <div className='bg-[#0000001A] py-2 w-full h-56 rounded-2xl flex items-center justify-center overflow-hidden'>
          <Document file={file} onLoadSuccess={onLoadSuccess}>
            <Page pageNumber={pageNumber} width={200} height={100} />
          </Document>
        </div>
        <h6 className='text-sm'>
          Last Updated: <span>{format(uploadedDateTime, "MMM dd, yyy")}</span>
        </h6>
      </div>

      <ConfirmationDialog
        open={dialogOpen}
        title='Are you sure you want to delete this document?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={handleDelete}
      />
    </>
  );
}
