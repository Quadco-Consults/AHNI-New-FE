"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Loading } from "components/Loading";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import Card from "components/Card";
import { Icon } from "@iconify/react";
import CbaAPI from "@/features/procurement/controllers/cbaController";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

interface AnalysisResultsProps {
  cbaId?: string;
}

const AnalysisResults = ({ cbaId: propCbaId }: AnalysisResultsProps) => {
  const { id } = useParams();
  const cbaId = propCbaId || (id as string);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: analysisData, isLoading, error } = CbaAPI.useGetCbaAnalysisResults(cbaId);
  const { data: cbaData } = CbaAPI.useGetSingleCba(cbaId);

  // Debug logging
  console.log("🔍 Analysis Results Debug:", {
    cbaId,
    analysisData,
    error,
    isLoading
  });

  // Handle download analysis as PDF
  const handleDownloadPDF = async () => {
    if (!analysisData?.data) {
      toast.error("No analysis data available to download");
      return;
    }

    setIsDownloading(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 15;
      let yPosition = 20;

      // Header - AHNI Logo and Title
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("ACHIEVING HEALTH INITIATIVE NIGERIA (AHNI)", pageWidth / 2, yPosition, { align: "center" });

      yPosition += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Building Sustainable Health Systems Across Nigeria", pageWidth / 2, yPosition, { align: "center" });

      yPosition += 15;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("COMPETITIVE BID ANALYSIS - RESULTS", pageWidth / 2, yPosition, { align: "center" });

      yPosition += 10;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`CBA ID: ${cbaId.slice(0, 13)}...`, pageWidth / 2, yPosition, { align: "center" });

      yPosition += 5;
      doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: "center" });

      yPosition += 15;

      // Draw line separator
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      // Analysis Summary Section
      const result = analysisData.data;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("ANALYSIS SUMMARY", margin, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      const summaryData = [
        ["CBA Status", cbaData?.data?.status || "N/A"],
        ["Solicitation ID", result?.solicitation_id?.slice(0, 20) + "..." || "N/A"],
        ["Selected Vendor ID", result?.vendor_id?.slice(0, 20) + "..." || "N/A"],
        ["Number of Selected Items", result?.selected_items?.length?.toString() || "0"],
        ["Submitted At", result?.submitted_at ? new Date(result.submitted_at).toLocaleString() : "N/A"],
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [],
        body: summaryData,
        theme: "grid",
        styles: { fontSize: 10 },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 60 },
          1: { cellWidth: 120 },
        },
        margin: { left: margin, right: margin },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;

      // Recommendation Note Section
      if (result?.recommendation_note) {
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("AWARD RECOMMENDATION", margin, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const splitText = doc.splitTextToSize(result.recommendation_note, pageWidth - 2 * margin);
        doc.text(splitText, margin, yPosition);
        yPosition += splitText.length * 6 + 10;
      }

      // Selected Items Section
      if (result?.selected_items && result.selected_items.length > 0) {
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("SELECTED ITEMS", margin, yPosition);
        yPosition += 8;

        const itemsData = result.selected_items.map((item: string, index: number) => [
          (index + 1).toString(),
          item.slice(0, 40) + (item.length > 40 ? "..." : ""),
        ]);

        autoTable(doc, {
          startY: yPosition,
          head: [["#", "Item ID"]],
          body: itemsData,
          theme: "striped",
          styles: { fontSize: 9 },
          headStyles: { fillColor: [59, 130, 246], fontStyle: "bold" },
          columnStyles: {
            0: { cellWidth: 20, halign: "center" },
            1: { cellWidth: 150 },
          },
          margin: { left: margin, right: margin },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 15;
      }

      // Footer
      const totalPages = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.text(
          `Page ${i} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
        doc.text(
          "Generated with Claude Code",
          pageWidth - margin,
          pageHeight - 10,
          { align: "right" }
        );
      }

      // Save the PDF
      doc.save(`CBA-Analysis-Results-${cbaId.slice(0, 8)}-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("Analysis results downloaded successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle download as JSON
  const handleDownloadJSON = () => {
    if (!analysisData?.data) {
      toast.error("No analysis data available to download");
      return;
    }

    try {
      const dataStr = JSON.stringify(analysisData.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `CBA-Analysis-Results-${cbaId.slice(0, 8)}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Analysis results downloaded as JSON!");
    } catch (error) {
      console.error("JSON download error:", error);
      toast.error("Failed to download JSON. Please try again.");
    }
  };

  if (isLoading) return <Loading />;

  // Handle case where analysis results don't exist yet (not an error, just no data)
  if (!analysisData?.data && !error) {
    return (
      <Card className="p-8">
        <div className="text-center py-12 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-dashed border-yellow-300 rounded-xl">
          <Icon icon="solar:document-bold-duotone" fontSize={56} className="mx-auto mb-4 text-yellow-500 opacity-50" />
          <p className="text-yellow-800 font-semibold text-lg">No Analysis Results Yet</p>
          <p className="text-yellow-600 text-sm mt-2">
            The bid analysis has not been submitted. Please perform the vendor analysis first.
          </p>
        </div>
      </Card>
    );
  }

  // Only show error if there's an actual error AND it's not a "no data" scenario
  if (error && !error.message.includes("undefined")) {
    return (
      <Card className="p-8">
        <div className="text-center py-12">
          <Icon icon="solar:danger-triangle-bold-duotone" fontSize={56} className="mx-auto mb-4 text-red-500" />
          <p className="text-red-700 font-semibold text-lg">Failed to load analysis results</p>
          <p className="text-gray-600 text-sm mt-2">{error.message}</p>
        </div>
      </Card>
    );
  }

  // If we still don't have data at this point, show the "no results" message
  if (!analysisData?.data) {
    return (
      <Card className="p-8">
        <div className="text-center py-12 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-dashed border-yellow-300 rounded-xl">
          <Icon icon="solar:document-bold-duotone" fontSize={56} className="mx-auto mb-4 text-yellow-500 opacity-50" />
          <p className="text-yellow-800 font-semibold text-lg">No Analysis Results Yet</p>
          <p className="text-yellow-600 text-sm mt-2">
            The bid analysis has not been submitted. Please perform the vendor analysis first.
          </p>
        </div>
      </Card>
    );
  }

  const result = analysisData.data;
  const selectedTotal = result?.selected_total || 0;

  return (
    <div className="space-y-6">
      {/* Header Section with Download Actions */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
              <Icon icon="solar:clipboard-check-bold" fontSize={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Analysis Results</h2>
              <p className="text-sm text-gray-600">Review and download bid analysis outcome</p>
            </div>
          </div>
          <Badge className="bg-green-600 text-white px-4 py-2 text-base shadow-md">
            <Icon icon="solar:check-circle-bold" className="mr-2" fontSize={18} />
            Submitted
          </Badge>
        </div>

        {/* Download Actions */}
        <div className="flex gap-3 mt-4">
          <Button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
          >
            <Icon icon="solar:document-text-bold" className="mr-2" fontSize={18} />
            {isDownloading ? "Generating PDF..." : "Download PDF Report"}
          </Button>
          <Button
            onClick={handleDownloadJSON}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <Icon icon="solar:download-minimalistic-bold" className="mr-2" fontSize={18} />
            Download JSON
          </Button>
        </div>
      </Card>

      {/* Analysis Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary Card */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon icon="solar:document-bold-duotone" fontSize={22} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Summary</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">CBA Status:</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {cbaData?.data?.status || "N/A"}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Solicitation ID:</span>
              <span className="text-sm font-mono text-gray-800">
                {result?.solicitation_id?.slice(0, 13)}...
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Selected Vendor:</span>
              <span className="text-sm font-mono text-gray-800">
                {result?.vendor_id?.slice(0, 13)}...
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Selected Items:</span>
              <Badge className="bg-green-600 text-white">
                {result?.selected_items?.length || 0} items
              </Badge>
            </div>
            {selectedTotal > 0 && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Total Amount:</span>
                <span className="text-lg font-bold text-green-600">
                  ₦{selectedTotal.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Submitted At:</span>
              <span className="text-sm text-gray-800">
                {result?.submitted_at
                  ? new Date(result.submitted_at).toLocaleString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </Card>

        {/* Recommendation Card */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Icon icon="solar:notes-bold-duotone" fontSize={22} className="text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Award Recommendation</h3>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
            {result?.recommendation_note ? (
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {result.recommendation_note}
              </p>
            ) : (
              <p className="text-sm text-gray-500 italic">No recommendation note provided</p>
            )}
          </div>
        </Card>
      </div>

      {/* Selected Items List */}
      {result?.selected_items && result.selected_items.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Icon icon="solar:checklist-bold-duotone" fontSize={22} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Selected Items</h3>
            </div>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300 px-3 py-1">
              {result.selected_items.length} Items
            </Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-purple-50 to-indigo-50">
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-700">
                    #
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-bold text-gray-700">
                    Item ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.selected_items.map((itemId: string, index: number) => (
                  <tr key={index} className="hover:bg-purple-50 transition-colors">
                    <td className="border border-gray-200 px-4 py-3 text-sm text-center font-semibold text-gray-900">
                      {index + 1}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-sm font-mono text-gray-700">
                      {itemId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AnalysisResults;