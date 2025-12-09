import { jsPDF } from "jspdf";

/**
 * Downloads a PDF using the blob method for better browser compatibility
 * Avoids popup blockers by creating a hidden download link
 */
export const downloadPDF = (pdf: jsPDF, filename: string): void => {
  try {
    // Generate blob from PDF
    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);

    // Create hidden download link
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up memory
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('PDF download error:', error);
    throw new Error('Failed to download PDF');
  }
};

/**
 * Downloads any blob as a file
 * Generic utility for file downloads
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('File download error:', error);
    throw new Error('Failed to download file');
  }
};

/**
 * Alternative method: Open PDF in new tab if download fails
 * Fallback option for environments where downloads are restricted
 */
export const openPDFInNewTab = (pdf: jsPDF): void => {
  try {
    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);

    // Open in new tab
    const newWindow = window.open(url, '_blank');

    if (!newWindow) {
      throw new Error('Popup blocked');
    }

    // Clean up after a delay to allow PDF to load
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 5000);
  } catch (error) {
    console.error('PDF view error:', error);
    throw new Error('Failed to open PDF');
  }
};

/**
 * Downloads PDF with fallback to new tab if download fails
 * Most robust solution for various browser environments
 */
export const downloadPDFWithFallback = (pdf: jsPDF, filename: string): void => {
  try {
    // Try download first
    downloadPDF(pdf, filename);
  } catch (error) {
    console.warn('Download failed, trying to open in new tab:', error);
    try {
      // Fallback to new tab
      openPDFInNewTab(pdf);
    } catch (fallbackError) {
      console.error('Both download and view failed:', fallbackError);
      throw new Error('Unable to download or view PDF. Please check browser settings.');
    }
  }
};