import { Icon } from "@iconify/react";
import Card from "@/components/Card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CategoryResultsData } from "definitions/configs/category";
import { EOIResultsData } from "definitions/procurement-types/eoi";
import { useState, useMemo } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Edit, Clock, X, Calendar, AlertTriangle, FileText, Package } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { useGetSingleSolicitation } from "@/features/procurement/controllers/solicitationController";
import DataTable from "@/components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

interface EoIDetailsProps extends EOIResultsData {
  submissionCount?: number;
}

const EoIDetails = (props: EoIDetailsProps) => {
  const data = props;
  const router = useRouter();
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  // Debug: Log the full data to see what we're getting
  console.log("EOI Data:", data);
  console.log("EOI Type:", data.type);
  console.log("Linked RFQ:", (data as any).linked_rfq);

  // Fetch linked RFQ data for OPEN_TENDER type EOIs
  const linkedRfqId = (data as any).linked_rfq?.id;
  console.log("Linked RFQ ID:", linkedRfqId);

  const { data: rfqData, isLoading: isLoadingRfq } = useGetSingleSolicitation(
    linkedRfqId || "",
    data.type === "OPEN_TENDER" && !!linkedRfqId
  );

  console.log("RFQ Data:", rfqData);
  console.log("Is Loading RFQ:", isLoadingRfq);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  // Calculate deadline info
  const deadlineInfo = useMemo(() => {
    if (!data.closing_date) return null;

    try {
      const closingDate = parseISO(data.closing_date);
      const today = new Date();
      const daysRemaining = differenceInDays(closingDate, today);
      const isOpen = data.status === "OPEN";
      const isClosingSoon = daysRemaining > 0 && daysRemaining <= 7 && isOpen;
      const isPastDue = daysRemaining < 0 && isOpen;

      return {
        daysRemaining,
        isOpen,
        isClosingSoon,
        isPastDue,
        formattedDate: format(closingDate, "MMMM dd, yyyy"),
      };
    } catch {
      return null;
    }
  }, [data.closing_date, data.status]);

  const handleEdit = () => {
    router.push(`/dashboard/procurement/vendor-management/eoi?edit=${data.id}`);
  };

  const handleClose = () => {
    // TODO: Implement close EOI functionality
    console.log("Close EOI", data.id);
  };

  const handleExtendDeadline = () => {
    // TODO: Implement extend deadline functionality
    console.log("Extend deadline", data.id);
  };

  return (
    <div className='p-5'>
      <Card className='space-y-6 p-10'>
        {/* Header with Title and Actions */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <h2 className='text-2xl font-bold'>{data.name}</h2>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Icon icon='ooui:reference' fontSize={16} />
              <span>{data?.eoi_number}</span>
            </div>
          </div>
          <div className='flex gap-2'>
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            {data.status === "OPEN" && (
              <>
                <Button variant="outline" size="sm" onClick={handleExtendDeadline}>
                  <Clock className="h-4 w-4 mr-1" />
                  Extend
                </Button>
                <Button variant="destructive" size="sm" onClick={handleClose}>
                  <X className="h-4 w-4 mr-1" />
                  Close
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Status and Type Badges */}
        <div className='flex items-center flex-wrap gap-3'>
          {/* EOI Type Badge */}
          <Badge
            variant="outline"
            className={cn(
              "px-3 py-1.5",
              data.type === "NEW_VENDOR"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-purple-50 text-purple-700 border-purple-200"
            )}
          >
            <FileText className="h-3 w-3 mr-1" />
            {data.type === "NEW_VENDOR" ? "Vendor Registration" : "Open Tender"}
          </Badge>

          {/* Status Badge */}
          <Badge
            variant="outline"
            className={cn(
              "px-3 py-1.5",
              data?.status === "OPEN" && "bg-green-50 text-green-700 border-green-200",
              data?.status === "CLOSED" && "bg-red-50 text-red-700 border-red-200",
              data?.status === "IN_PROGRESS" && "bg-yellow-50 text-yellow-700 border-yellow-200"
            )}
          >
            <span className="mr-1">
              {data?.status === "OPEN" && "🟢"}
              {data?.status === "CLOSED" && "🔴"}
              {data?.status === "IN_PROGRESS" && "🟡"}
            </span>
            {data.status}
          </Badge>

          {/* Solicitation Type for OPEN_TENDER */}
          {data.type === "OPEN_TENDER" && data.solicitation && (
            <Badge variant="outline" className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border-indigo-200">
              <Icon icon="solar:document-text-bold" className="mr-1" fontSize={14} />
              {data.solicitation === "R_F_Q" ? "Request for Quotation (RFQ)" : "Request for Proposal (RFP)"}
            </Badge>
          )}

          {/* Submission Count */}
          {data.submissionCount !== undefined && (
            <Badge variant="outline" className="px-3 py-1.5 bg-slate-50 text-slate-700 border-slate-200">
              <Icon icon="ph:users-three-duotone" className="mr-1" fontSize={14} />
              {data.submissionCount} {data.submissionCount === 1 ? "Submission" : "Submissions"}
            </Badge>
          )}
        </div>

        {/* Deadline Warning Alert */}
        {deadlineInfo?.isClosingSoon && (
          <Alert variant="default" className="bg-orange-50 border-orange-200">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Closing Soon:</strong> This EOI closes in {deadlineInfo.daysRemaining} day{deadlineInfo.daysRemaining !== 1 ? 's' : ''} on {deadlineInfo.formattedDate}
            </AlertDescription>
          </Alert>
        )}

        {deadlineInfo?.isPastDue && (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Past Due:</strong> This EOI closed {Math.abs(deadlineInfo.daysRemaining)} day{Math.abs(deadlineInfo.daysRemaining) !== 1 ? 's' : ''} ago. Consider closing it or extending the deadline.
            </AlertDescription>
          </Alert>
        )}

        {/* Background */}
        <div className='space-y-2'>
          <h3 className='font-semibold text-base'>Background</h3>
          <p className='text-gray-600 leading-relaxed whitespace-pre-wrap'>{data.description}</p>
        </div>

        {/* Dates and Financial Year */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <div className='space-y-2'>
            <h3 className='font-semibold text-sm text-gray-700'>Opening Date</h3>
            <div className='flex items-center gap-2 text-sm'>
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>
                {data.opening_date ? format(parseISO(data.opening_date), "MMMM dd, yyyy") : "-"}
              </span>
            </div>
          </div>
          <div className='space-y-2'>
            <h3 className='font-semibold text-sm text-gray-700'>Closing Date</h3>
            <div className='flex items-center gap-2 text-sm'>
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className={cn(
                deadlineInfo?.isClosingSoon && "text-orange-600 font-medium",
                deadlineInfo?.isPastDue && "text-red-600 font-medium"
              )}>
                {data.closing_date ? format(parseISO(data.closing_date), "MMMM dd, yyyy") : "-"}
              </span>
            </div>
          </div>
          <div className='space-y-2'>
            <h3 className='font-semibold text-sm text-gray-700'>Financial Year</h3>
            <div className='flex items-center gap-2 text-sm'>
              <Icon icon="mdi:calendar-range" fontSize={16} className="text-gray-500" />
              <span>{data.financial_year?.year || "-"}</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className='space-y-3'>
          <h3 className='font-semibold text-base'>Categories ({data.categories?.length || 0})</h3>
          <div className='flex flex-wrap gap-2'>
            {data.categories?.length > 0 ? (
              data.categories.map((category: CategoryResultsData) => (
                <Badge
                  variant="secondary"
                  className='bg-[#EBE8E1] py-2 px-4 rounded-lg text-gray-700'
                  key={category.id}
                >
                  {category.name}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No categories specified</p>
            )}
          </div>
        </div>

        {/* Bill of Quantities (BOQ) - Only for OPEN_TENDER type */}
        {data.type === "OPEN_TENDER" && linkedRfqId && (
          <div className='space-y-3'>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <h3 className='font-semibold text-base'>Bill of Quantities (BOQ)</h3>
              </div>
              {rfqData?.data && (
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                  RFQ: {rfqData.data.rfq_id}
                </Badge>
              )}
            </div>

            {isLoadingRfq ? (
              <div className="flex items-center justify-center py-8">
                <Icon icon="eos-icons:loading" fontSize={32} className="text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">Loading BOQ items...</span>
              </div>
            ) : rfqData?.data?.solicitation_items && rfqData.data.solicitation_items.length > 0 ? (
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {rfqData.data.solicitation_items.length} item{rfqData.data.solicitation_items.length !== 1 ? 's' : ''} in this tender
                    </p>
                    {rfqData.data.tender_type && (
                      <Badge variant="outline" className="text-xs">
                        {rfqData.data.tender_type}
                      </Badge>
                    )}
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specification</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {rfqData.data.solicitation_items.map((item: any, index: number) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {item.item_detail?.name || item.item?.name || "N/A"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {item.description || "-"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <div className="max-w-xs truncate" title={item.specification}>
                                {item.specification || "-"}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                              {item.quantity?.toLocaleString() || 0} {item.item_detail?.uom || ""}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {rfqData.data.background && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <h4 className="text-xs font-semibold text-blue-900 mb-1">RFQ Background</h4>
                      <p className="text-xs text-blue-800">{rfqData.data.background}</p>
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed rounded-lg">
                <Icon icon="ph:package-duotone" fontSize={48} className="text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No BOQ items found for this tender</p>
              </div>
            )}
          </div>
        )}

        {/* Document */}
        <div className='space-y-3'>
          <h3 className='font-semibold text-base'>EOI Advertisement Document</h3>
          <div className='bg-black/10 py-2 w-full h-56 rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer hover:bg-black/15 transition-colors'>
            <Dialog>
              <DialogTrigger asChild>
                <div className="w-full h-full flex items-center justify-center">
                  <Document
                    file={data.document_detail}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    <Page pageNumber={pageNumber} width={200} height={100} />
                  </Document>
                </div>
              </DialogTrigger>
              <DialogContent className='min-w-[60%] max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                  <DialogTitle>{data.name}</DialogTitle>
                  <div className='flex pt-5 justify-center'>
                    <Document
                      file={data.document_detail}
                      onLoadSuccess={onDocumentLoadSuccess}
                    >
                      {Array.from(new Array(numPages), (el, index) => (
                        <Page
                          key={`page_${index + 1}`}
                          pageNumber={index + 1}
                          width={600}
                        />
                      ))}
                    </Document>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-xs text-muted-foreground text-center">Click to view full document</p>
        </div>
      </Card>
    </div>
  );
};

export default EoIDetails;
