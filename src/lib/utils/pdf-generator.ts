import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ISolicitationRFQData } from "@/features/procurement/types/solicitation";

interface RFQPDFOptions {
  rfqData: ISolicitationRFQData;
  organizationName?: string;
  organizationAddress?: string;
  logoUrl?: string;
}

/**
 * Generates a professional RFQ PDF document
 * @param options Configuration options for PDF generation
 * @returns jsPDF document instance
 */
export const generateRFQPDF = async (options: RFQPDFOptions): Promise<jsPDF> => {
  const {
    rfqData,
    organizationName = "Achieving Health Nigeria Initiative (AHNi)",
    organizationAddress = "No.11 Muhammad Buhari Lane, Kofare Annex, Yola, Adamawa State",
  } = options;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number = 20) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Header: Organization Logo and Name
  if (options.logoUrl) {
    try {
      // If logo is provided, add it
      doc.addImage(options.logoUrl, "PNG", margin, yPosition, 30, 30);
      yPosition += 35;
    } catch (error) {
      console.error("Error adding logo:", error);
      yPosition += 10;
    }
  }

  // Reference Number (Top Right)
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Reference: ${rfqData.rfq_id || "N/A"}`, pageWidth - margin, yPosition, {
    align: "right",
  });

  yPosition += 15;

  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  const titleText = rfqData.request_type || "REQUEST FOR QUOTATION (RFQ)";
  doc.text(titleText.toUpperCase(), pageWidth / 2, yPosition, { align: "center" });

  yPosition += 10;

  // RFQ Title/Subject
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  const title = `FOR: ${rfqData.title}`;
  const titleLines = doc.splitTextToSize(title, pageWidth - 2 * margin);
  doc.text(titleLines, pageWidth / 2, yPosition, { align: "center" });
  yPosition += titleLines.length * 6 + 10;

  checkPageBreak();

  // Background Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("(a) BACKGROUND", margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  // Parse HTML content from background (strip HTML tags for PDF)
  const backgroundText = stripHtmlTags(rfqData.background || "");
  const backgroundLines = doc.splitTextToSize(backgroundText, pageWidth - 2 * margin);

  for (let i = 0; i < backgroundLines.length; i++) {
    checkPageBreak();
    doc.text(backgroundLines[i], margin, yPosition);
    yPosition += 5;
  }

  yPosition += 5;
  checkPageBreak();

  // Request Details Section (if items exist)
  if (rfqData.solicitation_items && rfqData.solicitation_items.length > 0) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("(b) REQUEST:", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Detailed scope of work and specifications for each category/lot are provided below:",
      margin,
      yPosition
    );
    yPosition += 10;

    // Group items by lot
    const itemsByLot = groupItemsByLot(rfqData.solicitation_items);

    // Generate table for each lot
    for (const [lotKey, items] of Object.entries(itemsByLot)) {
      checkPageBreak(30);

      const lotName = items[0]?.lot_detail?.name || `LOT ${lotKey}`;
      const subLot = items[0]?.sub_lot;

      // Lot Header
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(
        subLot ? `${lotName} - ${subLot}` : lotName,
        margin,
        yPosition
      );
      yPosition += 7;

      // Prepare table data
      const tableData = items.map((item, index) => {
        const baseData = [
          (index + 1).toString(),
          item.item_detail?.name || "N/A",
          item.item_detail?.description || item.description || "N/A",
          item.quantity?.toString() || "0",
          item.item_detail?.uom || "pieces",
        ];

        // Add custom fields if they exist
        if (item.custom_fields) {
          const customValues = Object.values(item.custom_fields);
          return [...baseData, ...customValues.map(v => String(v || "N/A"))];
        }

        return baseData;
      });

      // Table headers (basic + custom fields)
      const headers = ["S/N", "Description", "Specification", "Qty", "UOM"];

      if (items[0]?.custom_fields) {
        const customFieldKeys = Object.keys(items[0].custom_fields);
        headers.push(...customFieldKeys.map(key => formatFieldName(key)));
      }

      // Generate table
      autoTable(doc, {
        startY: yPosition,
        head: [headers],
        body: tableData,
        theme: "grid",
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 12 }, // S/N
          1: { cellWidth: 45 }, // Description
          2: { cellWidth: 50 }, // Specification
          3: { cellWidth: 15 }, // Qty
          4: { cellWidth: 20 }, // UOM
        },
        margin: { left: margin, right: margin },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 10;

      // Add lot-specific special instructions if they exist
      if (items[0]?.lot_detail?.special_instructions) {
        checkPageBreak();
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        const instructions = doc.splitTextToSize(
          `Special Instructions: ${items[0].lot_detail.special_instructions}`,
          pageWidth - 2 * margin
        );
        doc.text(instructions, margin, yPosition);
        yPosition += instructions.length * 4 + 5;
      }

      yPosition += 5;
    }
  }

  checkPageBreak();

  // Dates Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("(c) IMPORTANT DATES:", margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  if (rfqData.opening_date) {
    doc.text(
      `Opening Date: ${new Date(rfqData.opening_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      margin,
      yPosition
    );
    yPosition += 6;
  }

  if (rfqData.closing_date) {
    doc.text(
      `Closing Date: ${new Date(rfqData.closing_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      margin,
      yPosition
    );
    yPosition += 10;
  }

  checkPageBreak();

  // Footer/Disclaimer
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("DISCLAIMER", margin, yPosition);
  yPosition += 7;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const disclaimer = `${organizationName} reserves the right to select and negotiate with companies it deems qualified, in its sole discretion, for competitive bidding and may terminate the process at any stage without incurring any liability. The issuance of this bid document does not constitute a commitment by ${organizationName} to award a contract. This advertisement and the entire bidding process are completely free of charge — bidders are strongly advised to beware of fraudsters.`;
  const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 2 * margin);
  doc.text(disclaimerLines, margin, yPosition);
  yPosition += disclaimerLines.length * 4 + 10;

  // Contact Information (Footer)
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text(`For inquiries, please contact: ${organizationName}`, margin, yPosition);
  yPosition += 4;
  doc.text(organizationAddress, margin, yPosition);

  // Page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  return doc;
};

/**
 * Helper function to strip HTML tags from text
 */
const stripHtmlTags = (html: string): string => {
  // Create a temporary div element
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

/**
 * Helper function to group items by lot
 */
const groupItemsByLot = (items: any[]): Record<string, any[]> => {
  const grouped: Record<string, any[]> = {};

  items.forEach((item) => {
    const lotKey = item.sub_lot || item.lot || "default";
    if (!grouped[lotKey]) {
      grouped[lotKey] = [];
    }
    grouped[lotKey].push(item);
  });

  return grouped;
};

/**
 * Helper function to format custom field names (e.g., "paper_type" -> "Paper Type")
 */
const formatFieldName = (fieldName: string): string => {
  return fieldName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Export RFQ as PDF and trigger download
 */
export const downloadRFQPDF = async (
  rfqData: ISolicitationRFQData,
  options?: Partial<RFQPDFOptions>
): Promise<void> => {
  try {
    const pdf = await generateRFQPDF({
      rfqData,
      ...options,
    });

    const filename = `RFQ_${rfqData.rfq_id || "document"}_${Date.now()}.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF document");
  }
};
