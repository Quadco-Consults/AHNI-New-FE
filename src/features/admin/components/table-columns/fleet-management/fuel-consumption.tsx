import { ColumnDef } from "@tanstack/react-table";
import { IFuelRequestPaginatedData } from "@/features/admin/types/fleet-management/fuel-request";
import DeleteIcon from "@/components/icons/DeleteIcon";
import EyeIcon from "@/components/icons/EyeIcon";
import MoreOptionsHorizontalIcon from "@/components/icons/MoreOptionsHorizontalIcon";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import PencilIcon from "@/components/icons/PencilIcon";
import { toast } from "sonner";
import { useDeleteFuelConsumption, useGetSingleFuelConsumption } from "@/features/admin/controllers/fuelConsumptionController";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
import { formatNumberCurrency } from "@/utils/utls";

export const fuelConsumptionColumns: ColumnDef<IFuelRequestPaginatedData>[] = [
  {
    header: "Asset",
    id: "asset",
    accessorKey: "asset",
    size: 150,
  },
  {
    header: "Driver",
    id: "assigned_driver",
    accessorKey: "assigned_driver",
    size: 150,
  },
  {
    header: "Location",
    id: "location",
    accessorKey: "location",
    size: 120,
  },
  {
    header: "Vendor",
    id: "vendor",
    accessorKey: "vendor.name",
    size: 120,
  },
  {
    header: "Date",
    id: "date",
    accessorFn: ({ date }) => format(new Date(date), "dd-MMM-yyyy"),
    size: 100,
  },
  {
    header: "Quantity (L)",
    id: "quantity",
    accessorKey: "quantity",
    size: 100,
  },
  {
    header: "Price/L",
    id: "price_per_litre",
    accessorFn: ({ price_per_litre }) => `₦${price_per_litre}`,
    size: 100,
  },
  {
    header: "Total Amount",
    id: "amount",
    accessorFn: ({ amount }) => `₦${amount}`,
    size: 120,
  },
  {
    header: "Odometer",
    id: "odometer",
    accessorFn: ({ odometer }) => `${odometer} km`,
    size: 100,
  },
  {
    header: "Status",
    id: "status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      const status = getValue() as string;
      return (
        <Badge
          variant='default'
          className={cn(
            "p-1 rounded-lg font-medium",
            status === "PENDING" &&
              "bg-yellow-100 text-yellow-800 border-yellow-200",
            status === "APPROVED" &&
              "bg-green-100 text-green-800 border-green-200",
            status === "REJECTED" && "bg-red-100 text-red-800 border-red-200"
          )}
        >
          {status}
        </Badge>
      );
    },
    size: 100,
  },
  {
    header: "Created",
    id: "created_datetime",
    accessorFn: ({ created_datetime }) =>
      format(new Date(created_datetime), "dd-MMM-yyyy"),
    size: 120,
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: ({ row }) => {
      return <TableMenu {...row.original} />;
    },
    size: 80,
  },
];

const TableMenu = (fuelData: IFuelRequestPaginatedData) => {
  const { id } = fuelData;
  const [dialogOpen, setDialogOpen] = useState(false);

  const { deleteFuelConsumption, isLoading } = useDeleteFuelConsumption(id);
  const { data: fullFuelData } = useGetSingleFuelConsumption(id, false); // Don't auto-fetch, only when needed

  const onDelete = async () => {
    try {
      await deleteFuelConsumption();
      toast.success("Fuel consumption record deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  const generatePDF = () => {
    // Use data from the row or fetch full data if needed
    const data = fullFuelData?.data || fuelData;

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      toast.error("Please allow popups to generate PDF");
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Fuel Request - ${data.fuel_coupon || data.id?.substring(0, 8)}</title>
          <style>
            @page { size: A4; margin: 15mm; }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.5;
              color: #1F2937;
              max-width: 210mm;
              margin: 0 auto;
              background: white;
            }
            .page-wrapper {
              padding: 15px;
              background: white;
            }
            .header {
              background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%);
              padding: 25px;
              border-radius: 10px 10px 0 0;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              margin-bottom: 25px;
            }
            .header-content {
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .logo-section {
              background: white;
              padding: 10px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .logo {
              width: 80px;
              height: auto;
              display: block;
            }
            .company-info {
              flex: 1;
              text-align: center;
              padding: 0 20px;
            }
            .company-name {
              font-size: 22px;
              font-weight: 700;
              color: white;
              margin: 0 0 5px 0;
              letter-spacing: 1.5px;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            .company-tagline {
              font-size: 11px;
              color: #FEE2E2;
              font-weight: 500;
              letter-spacing: 0.5px;
            }
            .status-badge {
              background: white;
              padding: 10px 20px;
              border-radius: 25px;
              font-weight: 700;
              font-size: 13px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
              ${data.status === 'APPROVED' ?
                'color: #065F46; border: 2px solid #10B981;' :
                data.status === 'REJECTED' ?
                'color: #991B1B; border: 2px solid #EF4444;' :
                'color: #92400E; border: 2px solid #F59E0B;'
              }
            }
            .document-title {
              text-align: center;
              font-size: 18px;
              font-weight: 700;
              margin: 20px 0;
              padding: 12px;
              background: linear-gradient(to right, #FEE2E2, #FECACA, #FEE2E2);
              color: #991B1B;
              border-radius: 6px;
              text-transform: uppercase;
              letter-spacing: 2px;
              border-left: 4px solid #DC2626;
              border-right: 4px solid #DC2626;
            }
            .info-section {
              margin: 25px 0;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              color: #DC2626;
              margin-bottom: 15px;
              padding-bottom: 5px;
              border-bottom: 2px solid #FEE2E2;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-bottom: 15px;
            }
            .info-item {
              padding: 10px;
              background-color: #F9FAFB;
              border-left: 3px solid #DC2626;
            }
            .info-label {
              font-weight: bold;
              font-size: 12px;
              color: #6B7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .info-value {
              font-size: 14px;
              color: #1F2937;
              margin-top: 5px;
            }
            .full-width {
              grid-column: span 2;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #E5E7EB;
              text-align: center;
              font-size: 12px;
              color: #6B7280;
            }
            .print-date {
              text-align: right;
              font-size: 11px;
              color: #9CA3AF;
              margin-top: 20px;
            }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="/imgs/logo.png" alt="AHNI Logo" class="logo" />
            <div class="company-info">
              <h1 class="company-name">Achieving Health Nigeria Initiative (AHNI)</h1>
              <p class="company-tagline" style="font-size: 11px; margin: 3px 0;">No. 30 Anthony Enahoro Street, Utako District, Abuja, Nigeria</p>
              <p class="company-tagline" style="font-size: 10px; margin: 3px 0;">Tel: +234-09-4615555 / +234-09-461500 | Fax: +234-09-4615511 | Email: info@ahnigeria.org.ng</p>
            </div>
            <div class="status-badge">${data.status || 'PENDING'}</div>
          </div>

          <h2 class="document-title">Fuel Consumption Request Form</h2>

          <div class="info-section">
            <h3 class="section-title">Request Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Fuel Coupon</div>
                <div class="info-value">${data.fuel_coupon || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Date</div>
                <div class="info-value">${data.date ? format(new Date(data.date), 'dd-MMM-yyyy') : 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Created By</div>
                <div class="info-value">${data.created_by?.full_name || data.created_by || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Created Date</div>
                <div class="info-value">${data.created_datetime ? format(new Date(data.created_datetime), 'dd-MMM-yyyy HH:mm') : 'N/A'}</div>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3 class="section-title">Vehicle & Driver Details</h3>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Vehicle/Asset</div>
                <div class="info-value">${data.asset?.name || data.asset || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Assigned Driver</div>
                <div class="info-value">${data.assigned_driver?.full_name || data.assigned_driver || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Location</div>
                <div class="info-value">${data.location?.name || data.location || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Vendor</div>
                <div class="info-value">${data.vendor?.company_name || data.vendor?.name || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3 class="section-title">Fuel & Odometer Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Quantity (Liters)</div>
                <div class="info-value" style="font-size: 18px; font-weight: bold;">${data.quantity || 0} L</div>
              </div>
              <div class="info-item">
                <div class="info-label">Price per Liter</div>
                <div class="info-value">${formatNumberCurrency(data.price_per_litre || 0, 'NGN')}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Odometer Reading</div>
                <div class="info-value">${data.odometer ? `${data.odometer.toLocaleString()} km` : 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Distance Covered</div>
                <div class="info-value">${data.distance_covered ? `${data.distance_covered.toLocaleString()} km` : 'N/A'}</div>
              </div>
              <div class="info-item full-width" style="background-color: #FEF3C7; border-left-color: #F59E0B;">
                <div class="info-label">Total Amount</div>
                <div class="info-value" style="font-size: 20px; font-weight: bold; color: #92400E;">
                  ${formatNumberCurrency(data.amount || 0, 'NGN')}
                </div>
              </div>
            </div>
          </div>

          ${data.comments ? `
            <div class="info-section">
              <h3 class="section-title">Comments</h3>
              <div class="info-item full-width">
                <div class="info-value">${data.comments}</div>
              </div>
            </div>
          ` : ''}

          <div class="footer">
            <p><strong>Achieving Health Nigeria Initiative (AHNI)</strong></p>
            <p style="font-size: 10px; margin: 2px 0;">No. 30 Anthony Enahoro Street, Utako District, Abuja, Nigeria</p>
            <p style="font-size: 10px; margin: 2px 0 8px 0;">Tel: +234-09-4615555 / +234-09-461500 | Fax: +234-09-4615511 | Email: info@ahnigeria.org.ng</p>
            <p>Fleet Management System - Fuel Consumption Request</p>
            <p>This is a computer-generated document and does not require a signature.</p>
          </div>

          <div class="print-date">
            Generated on: ${format(new Date(), 'dd-MMM-yyyy HH:mm:ss')}
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 100);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className='flex items-center gap-2'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='ghost' className='flex gap-2 py-6'>
            <MoreOptionsHorizontalIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-fit'>
          <div className='flex flex-col items-start justify-between gap-1'>
            <Link
              href={`/dashboard/admin/fleet-management/fuel-request/${id}?type=vehicle`}
            >
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <EyeIcon />
                View Details
              </Button>
            </Link>
            <Button
              className='w-full flex items-center justify-start gap-2'
              variant='ghost'
              onClick={generatePDF}
            >
              <FileText size={16} />
              Generate PDF
            </Button>
            <Link
              href={`/dashboard/admin/fleet-management/fuel-request/create?id=${id}`}
            >
              <Button
                className='w-full flex items-center justify-start gap-2'
                variant='ghost'
              >
                <PencilIcon />
                Edit
              </Button>
            </Link>
            <Button
              className='w-full flex items-center justify-start gap-2'
              variant='ghost'
              onClick={() => setDialogOpen(true)}
            >
              <DeleteIcon />
              Delete
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <ConfirmationDialog
        open={dialogOpen}
        title='Are you sure you want to delete this fuel consumption record?'
        loading={isLoading}
        onCancel={() => setDialogOpen(false)}
        onOk={onDelete}
      />
    </div>
  );
};
