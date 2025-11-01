"use client";

import Card from "components/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "components/ui/table";
import logoPng from "@/assets/imgs/logo-bg.png";
import GoBack from "components/GoBack";
import { useParams } from "next/navigation";
import VendorsEvaluaionAndPerformanceAPI from "@/features/procurement/controllers/vendorPerformanceEvaluationController";
import { Button } from "components/ui/button";
import { BsFiletypePdf } from "react-icons/bs";
import Image from "next/image";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

const VendorPerformance = () => {
  const { id } = useParams();

  const { data: vendorEvaluationData } =
    VendorsEvaluaionAndPerformanceAPI.useGetSingleVendorEvaluation(id as string);

  // @ts-ignore
  const totals = vendorEvaluationData?.data?.criteria_scores.reduce(
    // @ts-ignore

    (sum, item) => sum + item.value,
    0
  );

  // Download PDF function - Client-side generation
  const handleDownloadPDF = async () => {
    try {
      toast.info('Generating PDF...');

      const element = document.getElementById('vendor-performance-content');
      if (!element) {
        toast.error('Vendor performance content not found');
        return;
      }

      // Hide action buttons before generating PDF
      const actionButtons = document.querySelector('.action-buttons') as HTMLElement;
      const originalDisplay = actionButtons?.style.display;
      if (actionButtons) {
        actionButtons.style.display = 'none';
      }

      // Wait for the DOM to update
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // Restore action buttons
      if (actionButtons) {
        actionButtons.style.display = originalDisplay || '';
      }

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        toast.error('Failed to capture content for PDF');
        return;
      }

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pageHeight = 297; // A4 height in mm

      if (imgHeight <= pageHeight) {
        // Single page
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      } else {
        // Multiple pages
        let sourceHeight = canvas.height;
        let position = 0;
        let pageNumber = 1;

        while (sourceHeight > 0) {
          const pageCanvas = document.createElement('canvas');
          const pageContext = pageCanvas.getContext('2d');

          pageCanvas.width = canvas.width;
          pageCanvas.height = Math.min(canvas.height * pageHeight / imgHeight, sourceHeight);

          if (pageContext) {
            pageContext.drawImage(
              canvas,
              0, position,
              canvas.width, pageCanvas.height,
              0, 0,
              pageCanvas.width, pageCanvas.height
            );

            const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);

            if (pageNumber > 1) {
              pdf.addPage();
            }

            pdf.addImage(pageImgData, 'JPEG', 0, 0, imgWidth, pageHeight);
          }

          sourceHeight -= pageCanvas.height;
          position += pageCanvas.height;
          pageNumber++;
        }
      }

      const vendorName = vendorEvaluationData?.data?.vendor?.name || 'vendor';
      const fileName = `Vendor-Performance-${vendorName.replace(/[^a-zA-Z0-9]/g, '-')}-${id}.pdf`;

      pdf.save(fileName);

      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className='bg-white p-8'>
      <div className="action-buttons mb-4">
        <GoBack />
      </div>

      <div id='vendor-performance-content'>
        <div className='flex justify-center items-center flex-col mb-6'>
          <Image
            src={logoPng}
            alt='AHNI Logo'
            width={200}
            height={200}
            className='mb-4'
          />
          <h1 className='text-2xl font-bold'>Achieving Health Nigeria Initiative (AHNI)</h1>
        </div>
        <div className='mt-8'>
          <div className='flex justify-end action-buttons'>
            <Button variant='custom' className='mb-4 ml-auto' onClick={handleDownloadPDF}>
              <span>
                <BsFiletypePdf size={25} />
              </span>
              Download
            </Button>
          </div>
        <Card className='border-primary flex flex-col gap-[17px]'>
          <div className='flex items-center gap-[30px] '>
            <h2 className='w-[240px] text-[18px] font-semibold text-gray-900'>
              Vendor Performance:
            </h2>
            <p className='text-[18px] font-normal text-gray-900'>
              {/* @ts-ignore */}

              {vendorEvaluationData?.data?.vendor?.name}
            </p>
          </div>
          <div className='flex items-center gap-[30px]'>
            <h2 className='w-[240px] text-[18px] font-semibold text-gray-900 capitalize'>
              Location of Service:
            </h2>
            <p className='text-[18px] font-normal text-gray-900'>
              {/* @ts-ignore */}

              {vendorEvaluationData?.data?.location_of_service}
            </p>
          </div>
          <div className='flex items-center gap-[30px]'>
            <h2 className='w-[240px] text-[18px] font-semibold text-gray-900'>
              Reviewed Start Period:
            </h2>
            <p className='text-[18px] font-normal text-gray-900'>
              {/* @ts-ignore */}

              {vendorEvaluationData?.data?.reviewed_period_start}
            </p>
          </div>
          <div className='flex items-center gap-[30px]'>
            <h2 className='w-[240px] text-[18px] font-semibold text-gray-900'>
              Reviewed End Period:
            </h2>
            <p className='text-[18px] font-normal text-gray-900'>
              {/* @ts-ignore */}

              {vendorEvaluationData?.data?.reviewed_period_end}
            </p>
          </div>
        </Card>
        <Card className='border-primary flex flex-col gap-[17px] bg-[#FEF2F2] justify-center items-center mt-20'>
          <p className='font-semibold text-[24px]'>Evaluation</p>
        </Card>
        <div className='mt-8'>
          <Table>
            <TableHeader>
              <TableRow className='text-center'>
                <TableCell className='max-w-[100px]'>
                  Competency Areas
                </TableCell>
                <TableCell>1 - Low</TableCell>
                <TableCell>2 - Fair</TableCell>
                <TableCell>3 - Satisfactorily</TableCell>
                <TableCell>4 - Good</TableCell>
                <TableCell>5 - Excellent</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* @ts-ignore */}
              {vendorEvaluationData?.data?.criteria_scores?.map(
                // @ts-ignore
                (row, index) => {
                  return (
                    <TableRow className='text-start' key={index}>
                      <TableCell className='max-w-[400px]'>
                        {row.criteria}
                      </TableCell>
                      <TableCell>
                        {row?.value == 1 ? row?.value : "-"}
                      </TableCell>
                      <TableCell>
                        {row?.value == 2 ? row?.value : "-"}
                      </TableCell>
                      <TableCell>
                        {row?.value == 3 ? row?.value : "-"}
                      </TableCell>
                      <TableCell>
                        {row?.value == 4 ? row?.value : "-"}
                      </TableCell>
                      <TableCell>
                        {row?.value == 5 ? row?.value : "-"}
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
              <TableRow className='text-start'>
                <TableCell>
                  <strong>Totals</strong>
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <strong>{totals}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className='mt-8'>
          <Table>
            <TableBody>
              {/* Recommendations Header */}
              <TableRow>
                <TableCell className='font-semibold text-start w-[100px]'>
                  Recommendations
                </TableCell>
                <TableCell
                  className={`font-semibold text-lg w-[400px] ${
                    // If status is PENDING and recommendation is BARRED, treat as PENDING
                    (vendorEvaluationData?.data?.status === "PENDING" && 
                     vendorEvaluationData?.data?.evaluator_recommendation === "BARRED") ||
                    !vendorEvaluationData?.data?.evaluator_recommendation
                      ? "bg-blue-500 text-white text-center"
                      : vendorEvaluationData?.data?.evaluator_recommendation ===
                        "BARRED"
                      ? "bg-red-500 text-white text-center"
                      : vendorEvaluationData?.data?.evaluator_recommendation ===
                        "ON_PROBATION"
                      ? "bg-yellow-500 text-white text-center"
                      : vendorEvaluationData?.data?.evaluator_recommendation ===
                        "RETAIN"
                      ? "bg-green-500 text-white text-center"
                      : "bg-blue-500 text-white text-center"
                  }`}
                >
                  {(vendorEvaluationData?.data?.status === "PENDING" && 
                    vendorEvaluationData?.data?.evaluator_recommendation === "BARRED") ||
                   !vendorEvaluationData?.data?.evaluator_recommendation
                    ? "Pending"
                    : vendorEvaluationData?.data?.evaluator_recommendation ===
                      "BARRED"
                    ? "Barred"
                    : vendorEvaluationData?.data?.evaluator_recommendation ===
                      "ON_PROBATION"
                    ? "On Probation"
                    : vendorEvaluationData?.data?.evaluator_recommendation ===
                      "RETAIN"
                    ? "Retain"
                    : "Pending"}
                </TableCell>
                {/* {data.map((item, index) => (
                  <TableCell key={index} className='text-start'>
                    {item.recommendation}
                  </TableCell>
                ))} */}
              </TableRow>

              {/* Evaluator Child Rows */}
              <TableRow className='border-b-white'>
                <TableCell className='pl-6 font-semibold'></TableCell>
                <TableCell>
                  {vendorEvaluationData?.data?.evaluators[0]?.name}
                </TableCell>
              </TableRow>
              <TableRow className='border-b-white'>
                <TableCell className='pl-6 font-semibold'>Evaluators</TableCell>
                <TableCell className='pl-6'>
                  {vendorEvaluationData?.data?.evaluation_date}
                </TableCell>
              </TableRow>
              <TableRow className='border-b-gray-300 border-t-white'>
                <TableCell className='pl-6 font-semibold'></TableCell>
                <TableCell>
                  {vendorEvaluationData?.data?.evaluators[0]?.name}
                </TableCell>{" "}
              </TableRow>

              {/* Supervisors Header */}
              {/* Supervisor Child Rows */}
              <TableRow className='border-b-white'>
                <TableCell className='pl-6 font-semibold'></TableCell>
                <TableCell>
                  {vendorEvaluationData?.data?.supervisors[0]?.name}
                </TableCell>
              </TableRow>
              <TableRow className='border-b-white'>
                <TableCell className='pl-6 font-semibold'>
                  Supervisors
                </TableCell>
                <TableCell className='pl-6'>
                  {vendorEvaluationData?.data?.evaluation_date}
                </TableCell>
              </TableRow>
              <TableRow className='border-t-white'>
                <TableCell className='pl-6 font-semibold'></TableCell>
                <TableCell>
                  {vendorEvaluationData?.data?.supervisors[0]?.name}
                </TableCell>{" "}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      </div>
    </div>
  );
};

export default VendorPerformance;
