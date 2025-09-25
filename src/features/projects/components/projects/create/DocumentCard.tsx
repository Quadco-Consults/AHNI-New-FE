import DeleteIcon from "components/icons/DeleteIcon";
import PdfIcon from "components/icons/PdfIcon";
import EyeIcon from "components/icons/EyeIcon";
import DownloadIcon from "components/icons/DownloadIcon";
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

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file;
    link.download = `${title}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = () => {
    window.open(file, '_blank');
  };

  return (
    <>
      <div className='border space-y-4 rounded-2xl p-5 w-full overflow-hidden h-fit'>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <PdfIcon />
            <h2 className='line-clamp-1'>{title}</h2>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              type='button'
              onClick={handleView}
              variant='outline'
              size='icon'
              title="View PDF"
            >
              <EyeIcon />
            </Button>

            <Button
              type='button'
              onClick={handleDownload}
              variant='outline'
              size='icon'
              title="Download PDF"
            >
              <DownloadIcon />
            </Button>

            {showDeleteIcon && (
              <Button
                type='button'
                onClick={() => setDialogOpen(true)}
                variant='outline'
                size='icon'
                title="Delete Document"
              >
                <DeleteIcon />
              </Button>
            )}
          </div>
        </div>
        <div
          className='bg-[#0000001A] py-2 w-full h-56 rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer hover:bg-[#0000002A] transition-colors'
          onClick={handleView}
          title="Click to view PDF"
        >
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
